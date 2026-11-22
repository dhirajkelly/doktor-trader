//+------------------------------------------------------------------+
//|                                       DK_HedgeRecovery_PROP.mq5  |
//|      Doktor Trader - Hedge Recovery PROP (XAUUSD, prop firm)     |
//|                                       https://dhirajkelly.id     |
//+------------------------------------------------------------------+
//  Konsep: zone recovery (hedge martingale) dengan batas keras.
//  - Entry awal pakai Doktor Rules: bias H1 EMA200 + cross EMA9/VWAP M5
//    (setelah candle close).
//  - Kalau harga melawan sejauh 1 zona (ATR H1 x ZoneATRMult), EA buka
//    posisi lawan (hedge) dengan lot terhitung agar basket profit saat TP.
//  - Maksimal MaxLegs posisi. Kalau leg terakhir sudah terbuka dan harga
//    menyentuh garis leg berikutnya -> SEMUA posisi ditutup (cut loss).
//    Kerugian maksimum per basket karenanya sudah diketahui di depan dan
//    lot awal dihitung supaya kerugian itu = RiskPercent dari balance.
//  - PROP GUARD (dihitung dari saldo awal akun prop):
//      * Daily guard: equity turun DailyGuardPct dari acuan awal hari
//        (max balance/equity jam 00:00 server) -> tutup semua, stop hari itu.
//      * Max loss guard: equity <= saldo awal x (1 - MaxLossGuardPct) ->
//        tutup semua dan EA BERHENTI permanen.
//      * Target lock: equity >= saldo awal x (1 + ProfitTargetPct) ->
//        tutup semua dan EA berhenti (target challenge terkunci).
//  - Doktor Rules: risk 0,5% per basket, maksimal 2 basket per hari.
//  - Filter jam & spread, tidak menahan posisi lewat weekend.
//  Cek dulu aturan prop firm Anda: beberapa prop firm melarang EA di
//  ukuran akun tertentu (mis. FundedNext: EA tidak boleh di akun >= $50k).
//  WAJIB akun HEDGING. Default untuk XAUUSD.
//  Bukan jaminan profit. Hasil backtest tidak menjamin hasil di masa depan.
//+------------------------------------------------------------------+
#property copyright "Dhiraj Kelly - Doktor Trader"
#property link      "https://dhirajkelly.id"
#property version   "1.00"
#property description "XAUUSD hedge recovery dengan guard aturan prop firm. Bukan jaminan profit."

#include <Trade\Trade.mqh>

//--- Risk
input group "=== RISK ==="
input double RiskPercent        = 0.5;   // Kerugian maksimum per basket (% balance) - Doktor Rules 0,5%
input int    MaxBasketsPerDay   = 2;     // Maksimal basket baru per hari - Doktor Rules 1-2
input double EmergencyLossPct   = 2.0;   // Darurat: tutup basket jika floating loss >= (% balance)
input bool   AllowMinLotOverRisk= false; // Izinkan lot minimum walau melebihi RiskPercent
//--- Prop firm
input group "=== PROP FIRM GUARD ==="
input double PropInitialBalance = 0;     // Saldo awal akun prop (0 = pakai balance saat EA dipasang)
input double DailyGuardPct      = 3.0;   // Tutup semua jika rugi harian >= (% saldo awal). Aturan prop biasanya 4-5%
input double MaxLossGuardPct    = 6.5;   // Tutup semua + EA stop jika total rugi >= (% saldo awal). Aturan prop biasanya 8-10%
input double ProfitTargetPct    = 0;     // Tutup semua + EA stop saat profit >= (% saldo awal). 0 = off (akun funded)
//--- Recovery
input group "=== HEDGE RECOVERY ==="
input int    MaxLegs            = 4;     // Jumlah posisi maksimum per basket (3-5)
input double ZoneATRMult        = 1.0;   // Lebar zona = ATR(H1) x nilai ini
input double ZoneMinPrice       = 2.0;   // Lebar zona minimum (harga, mis. 2.0 = $2)
input double TPRatio            = 2.0;   // Jarak TP = zona x nilai ini
input double ProfitTargetZ      = 0.5;   // Target profit basket (dalam zona x lot awal)
//--- Signal
input group "=== SIGNAL (DOKTOR RULES) ==="
input int    TrendEMA           = 200;   // EMA bias di H1
input int    FastEMA            = 9;     // EMA cepat di M5
input int    ATRPeriod          = 14;    // ATR H1
//--- Filters
input group "=== FILTER ==="
input int    StartHour          = 8;     // Jam server mulai cari entry
input int    EndHour            = 20;    // Jam server berhenti cari entry
input int    FridayNoNewHour    = 16;    // Jumat: tidak ada basket baru setelah jam ini
input int    FridayCloseHour    = 21;    // Jumat: tutup semua basket jam ini (0 = off)
input double MaxSpreadPrice     = 0.50;  // Spread maksimum (harga, mis. 0.50 = 50 sen)
//--- Misc
input group "=== LAINNYA ==="
input long   MagicNumber        = 26112302;
input int    SlippagePoints     = 50;

CTrade trade;
int    hEmaFast = INVALID_HANDLE, hEmaTrend = INVALID_HANDLE, hAtr = INVALID_HANDLE;
double lotUnits[10];
double worstUnits = 0;
datetime lastBarTime = 0;
int    curDay = -1;
double dayRef = 0;          // acuan awal hari: max(balance, equity) jam 00:00 server
bool   dayBlocked = false;
int    basketsToday = 0;
double initBal = 0;
bool   halted = false;

// basket state (persisted in terminal Global Variables)
int    bDir = 0;      // +1 buy basket, -1 sell basket
double bP0 = 0;       // first entry line
double bZ  = 0;       // zone width (price)
double bBase = 0;     // base lot

string GVName(string k) { return "DKHRP_" + _Symbol + "_" + IntegerToString(MagicNumber) + "_" + k; }

//+------------------------------------------------------------------+
//| Build lot schedule (in base-lot units) + worst-case loss (Z units)|
//+------------------------------------------------------------------+
void BuildSchedule()
{
   double lots[10]; int sides[10]; double ent[10];
   int n = 1;
   lots[0] = 1.0; sides[0] = 1; ent[0] = 0.0;
   double upTP = TPRatio, dnTP = -1.0 - TPRatio;
   while(n < MaxLegs)
   {
      int s = -sides[n-1];
      double e = (s == -1) ? -1.0 : 0.0;
      double tgt = (s == -1) ? dnTP : upTP;
      double net = 0;
      for(int k = 0; k < n; k++) net += lots[k] * sides[k] * (tgt - ent[k]);
      lots[n] = (ProfitTargetZ - net) / TPRatio;
      sides[n] = s; ent[n] = e; n++;
   }
   double stopPx = (sides[n-1] == -1) ? 0.0 : -1.0;
   double net = 0;
   for(int k = 0; k < n; k++) net += lots[k] * sides[k] * (stopPx - ent[k]);
   worstUnits = -net;
   for(int k = 0; k < n; k++) lotUnits[k] = lots[k];
}

//+------------------------------------------------------------------+
int OnInit()
{
   if(MaxLegs < 2 || MaxLegs > 6) { Print("MaxLegs harus 2-6"); return INIT_PARAMETERS_INCORRECT; }
   if((ENUM_ACCOUNT_MARGIN_MODE)AccountInfoInteger(ACCOUNT_MARGIN_MODE) != ACCOUNT_MARGIN_MODE_RETAIL_HEDGING)
   {
      Alert("DK Hedge Recovery Lite butuh akun HEDGING. EA dihentikan.");
      return INIT_FAILED;
   }
   trade.SetExpertMagicNumber(MagicNumber);
   trade.SetDeviationInPoints(SlippagePoints);
   trade.SetTypeFillingBySymbol(_Symbol);

   hEmaFast  = iMA(_Symbol, PERIOD_M5, FastEMA, 0, MODE_EMA, PRICE_CLOSE);
   hEmaTrend = iMA(_Symbol, PERIOD_H1, TrendEMA, 0, MODE_EMA, PRICE_CLOSE);
   hAtr      = iATR(_Symbol, PERIOD_H1, ATRPeriod);
   if(hEmaFast == INVALID_HANDLE || hEmaTrend == INVALID_HANDLE || hAtr == INVALID_HANDLE)
      return INIT_FAILED;

   BuildSchedule();
   string sch = "";
   for(int k = 0; k < MaxLegs; k++) sch += DoubleToString(lotUnits[k], 3) + " ";
   PrintFormat("Lot schedule (x lot awal): %s | worst-case = %.3f zona x lot awal", sch, worstUnits);

   LoadState();
   // saldo awal prop: input, atau yang tersimpan, atau balance sekarang
   if(PropInitialBalance > 0) initBal = PropInitialBalance;
   else if(GlobalVariableCheck(GVName("INIT"))) initBal = GlobalVariableGet(GVName("INIT"));
   else initBal = AccountInfoDouble(ACCOUNT_BALANCE);
   GlobalVariableSet(GVName("INIT"), initBal);
   halted = GlobalVariableCheck(GVName("HALT")) && GlobalVariableGet(GVName("HALT")) > 0;
   if(halted) Print("EA dalam status BERHENTI (max loss / target). Hapus Global Variable ", GVName("HALT"), " (F3) untuk mengaktifkan lagi.");
   dayRef = MathMax(AccountInfoDouble(ACCOUNT_BALANCE), AccountInfoDouble(ACCOUNT_EQUITY));
   if(GlobalVariableCheck(GVName("DAYREF")) && (int)GlobalVariableGet(GVName("DAYNO")) == DayNo()) {
      dayRef = GlobalVariableGet(GVName("DAYREF"));
      basketsToday = (int)GlobalVariableGet(GVName("DAYCNT"));
      dayBlocked = GlobalVariableGet(GVName("DAYBLK")) > 0;
   }
   curDay = DayNo();
   SaveDay();
   return INIT_SUCCEEDED;
}

void OnDeinit(const int reason)
{
   IndicatorRelease(hEmaFast); IndicatorRelease(hEmaTrend); IndicatorRelease(hAtr);
   Comment("");
}

//+------------------------------------------------------------------+
void SaveState()
{
   GlobalVariableSet(GVName("DIR"), bDir);
   GlobalVariableSet(GVName("P0"), bP0);
   GlobalVariableSet(GVName("Z"), bZ);
   GlobalVariableSet(GVName("BASE"), bBase);
}
void LoadState()
{
   if(GlobalVariableCheck(GVName("DIR")))
   {
      bDir  = (int)GlobalVariableGet(GVName("DIR"));
      bP0   = GlobalVariableGet(GVName("P0"));
      bZ    = GlobalVariableGet(GVName("Z"));
      bBase = GlobalVariableGet(GVName("BASE"));
   }
   if(CountLegs() == 0) ClearState();
}
int  DayNo() { return (int)(TimeCurrent() / 86400); }
void SaveDay()
{
   GlobalVariableSet(GVName("DAYNO"), DayNo());
   GlobalVariableSet(GVName("DAYREF"), dayRef);
   GlobalVariableSet(GVName("DAYCNT"), basketsToday);
   GlobalVariableSet(GVName("DAYBLK"), dayBlocked ? 1 : 0);
}
void Halt(string why)
{
   halted = true;
   GlobalVariableSet(GVName("HALT"), 1);
   Alert("DK Hedge Recovery PROP BERHENTI: ", why);
}
void ClearState() { bDir = 0; bP0 = 0; bZ = 0; bBase = 0; SaveState(); }

//+------------------------------------------------------------------+
int CountLegs()
{
   int c = 0;
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong t = PositionGetTicket(i);
      if(t == 0) continue;
      if(PositionGetString(POSITION_SYMBOL) == _Symbol && PositionGetInteger(POSITION_MAGIC) == MagicNumber) c++;
   }
   return c;
}
double BasketProfit()
{
   double p = 0;
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong t = PositionGetTicket(i);
      if(t == 0) continue;
      if(PositionGetString(POSITION_SYMBOL) == _Symbol && PositionGetInteger(POSITION_MAGIC) == MagicNumber)
         p += PositionGetDouble(POSITION_PROFIT) + PositionGetDouble(POSITION_SWAP);
   }
   return p;
}
bool CloseBasket(string why)
{
   bool ok = true;
   for(int attempt = 0; attempt < 5; attempt++)
   {
      ok = true;
      for(int i = PositionsTotal() - 1; i >= 0; i--)
      {
         ulong t = PositionGetTicket(i);
         if(t == 0) continue;
         if(PositionGetString(POSITION_SYMBOL) != _Symbol || PositionGetInteger(POSITION_MAGIC) != MagicNumber) continue;
         if(!trade.PositionClose(t)) ok = false;
      }
      if(ok && CountLegs() == 0) break;
      Sleep(300);
   }
   PrintFormat("Basket ditutup (%s).", why);
   if(CountLegs() == 0) ClearState();
   return ok;
}

//+------------------------------------------------------------------+
double MoneyPerPricePerLot()
{
   double tv = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE_LOSS);
   if(tv <= 0) tv = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
   double ts = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);
   if(ts <= 0) return 0;
   return tv / ts;
}
double NormLot(double lots, bool roundUp)
{
   double step = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);
   double mn   = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double mx   = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   double v = roundUp ? MathCeil(lots / step - 1e-9) * step : MathFloor(lots / step + 1e-9) * step;
   if(v < mn) v = mn;
   if(v > mx) v = mx;
   return NormalizeDouble(v, 2);
}

//+------------------------------------------------------------------+
//| Daily VWAP from M5 tick volume, up to the last closed bar          |
//+------------------------------------------------------------------+
bool GetVWAP(int shift, double &vwap)
{
   datetime barT = iTime(_Symbol, PERIOD_M5, shift);
   if(barT == 0) return false;
   MqlDateTime md; TimeToStruct(barT, md);
   md.hour = 0; md.min = 0; md.sec = 0;
   datetime dayStart = StructToTime(md);
   MqlRates r[];
   int n = CopyRates(_Symbol, PERIOD_M5, dayStart, barT, r);
   if(n <= 0) return false;
   double pv = 0, vv = 0;
   for(int i = 0; i < n; i++)
   {
      double tp = (r[i].high + r[i].low + r[i].close) / 3.0;
      pv += tp * (double)r[i].tick_volume;
      vv += (double)r[i].tick_volume;
   }
   if(vv <= 0) return false;
   vwap = pv / vv;
   return true;
}

//+------------------------------------------------------------------+
void OnTick()
{
   MqlDateTime now; TimeToStruct(TimeCurrent(), now);
   if(DayNo() != curDay)
   {
      curDay = DayNo();
      dayRef = MathMax(AccountInfoDouble(ACCOUNT_BALANCE), AccountInfoDouble(ACCOUNT_EQUITY));
      dayBlocked = false; basketsToday = 0;
      SaveDay();
   }
   double eq = AccountInfoDouble(ACCOUNT_EQUITY);

   // ---- PROP GUARDS (dicek setiap tick, sebelum yang lain) ----
   if(eq <= initBal * (1.0 - MaxLossGuardPct / 100.0))
   {
      if(CountLegs() > 0) CloseBasket("MAX LOSS GUARD");
      if(!halted) Halt(StringFormat("equity %.2f menyentuh max loss guard %.1f%%", eq, MaxLossGuardPct));
   }
   if(ProfitTargetPct > 0 && eq >= initBal * (1.0 + ProfitTargetPct / 100.0))
   {
      if(CountLegs() > 0) CloseBasket("PROFIT TARGET");
      if(!halted) Halt(StringFormat("target profit %.1f%% tercapai, equity %.2f", ProfitTargetPct, eq));
   }
   if(eq - dayRef <= -DailyGuardPct / 100.0 * initBal)
   {
      if(CountLegs() > 0) CloseBasket("DAILY GUARD");
      if(!dayBlocked) { dayBlocked = true; SaveDay(); PrintFormat("Daily guard: rugi hari ini >= %.1f%%. Tidak ada basket baru sampai besok.", DailyGuardPct); }
   }
   if(halted) { ShowPanel(); return; }

   int legs = CountLegs();
   if(legs > 0 && bDir != 0) ManageBasket(legs, now);
   else if(legs == 0 && bDir != 0) ClearState();

   // new M5 bar -> look for a new basket
   datetime bt = iTime(_Symbol, PERIOD_M5, 0);
   if(bt != lastBarTime)
   {
      lastBarTime = bt;
      if(CountLegs() == 0 && !dayBlocked && basketsToday < MaxBasketsPerDay) TryOpenBasket(now);
   }
   ShowPanel();
}

//+------------------------------------------------------------------+
void ManageBasket(int legs, MqlDateTime &now)
{
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   double bal = AccountInfoDouble(ACCOUNT_BALANCE);
   double x = bDir * (bid - bP0);          // relative coordinate (first leg = +)
   int lastSide = (legs % 2 == 1) ? 1 : -1; // leg 1 = +1, leg 2 = -1, ...
   int nextSide = -lastSide;

   // 1) take profit: price reached TP line beyond the last leg's side
   bool tpHit = (lastSide == 1) ? (x >= TPRatio * bZ) : (x <= -bZ - TPRatio * bZ);
   if(tpHit) { CloseBasket("TP"); return; }

   // 2) emergency loss (gaps / slippage)
   double fl = BasketProfit();
   if(fl <= -EmergencyLossPct / 100.0 * bal) { CloseBasket("EMERGENCY LOSS"); return; }

   // 3) Friday close
   if(FridayCloseHour > 0 && now.day_of_week == 5 && now.hour >= FridayCloseHour)
   { CloseBasket("FRIDAY CLOSE"); return; }

   // 4) next leg line reached?
   bool lineHit = (nextSide == -1) ? (x <= -bZ) : (x >= 0);
   if(!lineHit) return;

   if(legs >= MaxLegs) { CloseBasket("MAX LEGS STOP"); return; }

   double lot = NormLot(lotUnits[legs] * bBase, true);
   int realSide = nextSide * bDir;   // +1 buy, -1 sell
   bool ok = (realSide == 1) ? trade.Buy(lot, _Symbol, ask, 0, 0, "DKHRP leg " + IntegerToString(legs + 1))
                             : trade.Sell(lot, _Symbol, bid, 0, 0, "DKHRP leg " + IntegerToString(legs + 1));
   if(!ok) PrintFormat("Gagal buka leg %d: %d", legs + 1, trade.ResultRetcode());
}

//+------------------------------------------------------------------+
void TryOpenBasket(MqlDateTime &now)
{
   if(now.day_of_week == 5 && now.hour >= FridayNoNewHour) return;
   if(now.day_of_week == 0 || now.day_of_week == 6) return;
   if(now.hour < StartHour || now.hour >= EndHour) return;

   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   if(ask - bid > MaxSpreadPrice) return;

   double ema[], trendE[], atr[];
   ArraySetAsSeries(ema, true); ArraySetAsSeries(trendE, true); ArraySetAsSeries(atr, true);
   if(CopyBuffer(hEmaFast, 0, 1, 2, ema) < 2) return;     // ema[0]=bar 1 (closed), ema[1]=bar 2
   if(CopyBuffer(hEmaTrend, 0, 1, 1, trendE) < 1) return; // last completed H1
   if(CopyBuffer(hAtr, 0, 1, 1, atr) < 1) return;
   double h1Close = iClose(_Symbol, PERIOD_H1, 1);
   double vw1, vw2;
   if(!GetVWAP(1, vw1) || !GetVWAP(2, vw2)) return;

   bool crossUp = (ema[1] <= vw2) && (ema[0] > vw1);
   bool crossDn = (ema[1] >= vw2) && (ema[0] < vw1);
   int dir = 0;
   if(crossUp && h1Close > trendE[0]) dir = 1;
   if(crossDn && h1Close < trendE[0]) dir = -1;
   if(dir == 0) return;

   double Z = MathMax(atr[0] * ZoneATRMult, ZoneMinPrice);
   double mpp = MoneyPerPricePerLot();
   if(mpp <= 0) return;
   double riskMoney = AccountInfoDouble(ACCOUNT_BALANCE) * RiskPercent / 100.0;
   double rawBase = riskMoney / (worstUnits * Z * mpp);
   double mn = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   if(rawBase < mn && !AllowMinLotOverRisk)
   {
      PrintFormat("Skip: balance terlalu kecil untuk risk %.2f%% (butuh lot %.4f < min %.2f). Pakai akun cent / tambah balance.",
                  RiskPercent, rawBase, mn);
      return;
   }
   double base = NormLot(rawBase, false);

   bool ok = (dir == 1) ? trade.Buy(base, _Symbol, ask, 0, 0, "DKHRP leg 1")
                        : trade.Sell(base, _Symbol, bid, 0, 0, "DKHRP leg 1");
   if(!ok) { PrintFormat("Gagal buka basket: %d", trade.ResultRetcode()); return; }

   bDir = dir;
   bP0 = bid;   // semua trigger memakai Bid (sama dengan backtest)
   bZ = Z; bBase = base;
   SaveState();
   basketsToday++; SaveDay();
   PrintFormat("Basket %s dibuka. Lot awal %.2f, zona %.2f, worst-case ~%.2f",
               dir == 1 ? "BUY" : "SELL", base, Z, worstUnits * Z * mpp * base);
}

//+------------------------------------------------------------------+
void ShowPanel()
{
   double eq = AccountInfoDouble(ACCOUNT_EQUITY);
   string s = "DK Hedge Recovery PROP v1.00 | Doktor Trader\n";
   if(halted) s += "STATUS: BERHENTI (max loss guard / target tercapai)\n";
   s += StringFormat("Saldo awal %.2f | Equity %.2f (%.2f%%)\n", initBal, eq, (eq / initBal - 1) * 100);
   s += StringFormat("Hari ini: %.2f%% dari acuan | guard -%.1f%% %s | basket %d/%d\n", (eq - dayRef) / initBal * 100, DailyGuardPct, dayBlocked ? "(TERKUNCI)" : "", basketsToday, MaxBasketsPerDay);
   s += StringFormat("Max loss guard: equity %.2f | Risk/basket %.2f%%\n", initBal * (1 - MaxLossGuardPct / 100.0), RiskPercent);
   int legs = CountLegs();
   if(legs > 0)
      s += StringFormat("Basket %s | leg %d/%d | zona %.2f | floating %.2f\n", bDir == 1 ? "BUY" : "SELL", legs, MaxLegs, bZ, BasketProfit());
   else
      s += "Menunggu sinyal Doktor Rules (H1 EMA200 + cross EMA9/VWAP M5)\n";
   Comment(s);
}
//+------------------------------------------------------------------+
