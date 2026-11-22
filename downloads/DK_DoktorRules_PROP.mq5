//+------------------------------------------------------------------+
//|                                         DK_DoktorRules_PROP.mq5  |
//|          Doktor Trader - Doktor Rules EA + prop firm guard       |
//|                                       https://dhirajkelly.id     |
//+------------------------------------------------------------------+
//  Doktor Rules (versi murni, satu posisi):
//  1. Bias: close candle H1 terakhir yang sudah selesai di atas EMA 200 -> hanya buy,
//     di bawah -> hanya sell.
//  2. Entry M5: EMA 9 memotong VWAP searah bias, dieksekusi setelah candle close
//     (di candle berikutnya).
//  3. SL di swing M5 terakhir (fractal 3 candle kiri & kanan) + buffer (+ spread untuk sell).
//     TP = RR x jarak SL (default 2R). Lewati sinyal jika jarak SL < 3x spread.
//     v1.10: SL dipindah ke harga entry (break-even) saat profit mencapai +1R.
//  4. Lot dari jarak SL dengan risiko RiskPercent (default 0,5%).
//  Prop guard (dihitung dari saldo awal akun prop):
//  - Daily guard: rugi hari ini (termasuk floating) >= DailyGuardPct -> tutup posisi, stop sampai besok.
//  - Max loss guard: equity <= saldo awal x (1 - MaxLossGuardPct) -> tutup posisi, EA berhenti.
//  - Target lock: equity >= saldo awal x (1 + ProfitTargetPct) -> tutup posisi, EA berhenti.
//  Cek aturan prop firm Anda: sebagian melarang EA di ukuran akun tertentu
//  (mis. FundedNext: EA tidak boleh di akun >= $50k).
//  Bukan jaminan profit. Hasil masa lalu tidak menjamin hasil ke depan.
//+------------------------------------------------------------------+
#property copyright "Dhiraj Kelly - Doktor Trader"
#property link      "https://dhirajkelly.id"
#property version   "1.11"
#property description "Doktor Rules (H1 EMA200 + M5 EMA9/VWAP, SL swing, TP 2R) dengan guard aturan prop firm."

#include <Trade\Trade.mqh>

input group "=== RISK (DOKTOR RULES) ==="
input double RiskPercent        = 0.5;   // Risiko per trade (% balance). Akun funded: pertimbangkan 0,3
input int    MaxTradesPerDay    = 1;     // Maksimal trade per hari
input double RR                 = 2.0;   // TP = RR x jarak SL
input double SLBuffer           = 1.0;   // Buffer SL di luar swing (harga, XAUUSD 1.0 = $1)
input double BreakEvenR         = 1.0;   // Pindah SL ke entry saat profit >= N x jarak SL (0 = off)
input int    FractalBars        = 3;     // Swing: candle kiri & kanan
input double MinSLSpreadMult    = 3.0;   // Lewati jika jarak SL < N x spread
input double MaxSpreadPrice     = 1.0;   // Lewati jika spread > nilai ini (harga)
input bool   AllowMinLotOverRisk= false; // Izinkan lot minimum walau melebihi risiko
input group "=== PROP FIRM GUARD ==="
input double PropInitialBalance = 0;     // Saldo awal akun prop (0 = balance saat EA dipasang)
input double DailyGuardPct      = 3.0;   // Tutup & stop hari ini jika rugi harian >= (% saldo awal)
input double MaxLossGuardPct    = 6.5;   // Tutup & EA stop jika total rugi >= (% saldo awal)
input double ProfitTargetPct    = 0;     // Tutup & EA stop saat profit >= (% saldo awal). 0 = off
input bool   TrailingMaxLoss    = false; // true = max loss trailing dari balance tertinggi, maks sampai saldo awal (mis. Stellar Instant)
input group "=== INDIKATOR ==="
input int    TrendEMA           = 200;   // EMA bias H1
input int    FastEMA            = 9;     // EMA cepat M5
input group "=== LAINNYA ==="
input long   MagicNumber        = 26112304;
input int    SlippagePoints     = 50;

CTrade trade;
int hEma9 = INVALID_HANDLE, hEma200 = INVALID_HANDLE;
datetime lastBar = 0;
int curDay = -1, tradesToday = 0;
double dayRef = 0, initBal = 0, peakBal = 0;
bool dayBlocked = false, halted = false;

string GV(string k) { return "DKDRP_" + _Symbol + "_" + IntegerToString(MagicNumber) + "_" + k; }
int DayNo() { return (int)(TimeCurrent() / 86400); }
void SaveDay()
{
   GlobalVariableSet(GV("DAYNO"), DayNo()); GlobalVariableSet(GV("DAYREF"), dayRef);
   GlobalVariableSet(GV("DAYCNT"), tradesToday); GlobalVariableSet(GV("DAYBLK"), dayBlocked ? 1 : 0);
}

//+------------------------------------------------------------------+
int OnInit()
{
   trade.SetExpertMagicNumber(MagicNumber);
   trade.SetDeviationInPoints(SlippagePoints);
   trade.SetTypeFillingBySymbol(_Symbol);
   hEma9   = iMA(_Symbol, PERIOD_M5, FastEMA, 0, MODE_EMA, PRICE_CLOSE);
   hEma200 = iMA(_Symbol, PERIOD_H1, TrendEMA, 0, MODE_EMA, PRICE_CLOSE);
   if(hEma9 == INVALID_HANDLE || hEma200 == INVALID_HANDLE) return INIT_FAILED;

   if(PropInitialBalance > 0) initBal = PropInitialBalance;
   else if(GlobalVariableCheck(GV("INIT"))) initBal = GlobalVariableGet(GV("INIT"));
   else initBal = AccountInfoDouble(ACCOUNT_BALANCE);
   GlobalVariableSet(GV("INIT"), initBal);
   peakBal = GlobalVariableCheck(GV("PEAK")) ? GlobalVariableGet(GV("PEAK")) : initBal;
   peakBal = MathMax(peakBal, MathMax(initBal, AccountInfoDouble(ACCOUNT_BALANCE)));
   GlobalVariableSet(GV("PEAK"), peakBal);
   halted = GlobalVariableCheck(GV("HALT")) && GlobalVariableGet(GV("HALT")) > 0;
   if(halted) Print("EA dalam status BERHENTI. Hapus Global Variable ", GV("HALT"), " (F3) untuk mengaktifkan lagi.");

   curDay = DayNo();
   dayRef = MathMax(AccountInfoDouble(ACCOUNT_BALANCE), AccountInfoDouble(ACCOUNT_EQUITY));
   if(GlobalVariableCheck(GV("DAYNO")) && (int)GlobalVariableGet(GV("DAYNO")) == curDay)
   {
      dayRef = GlobalVariableGet(GV("DAYREF"));
      tradesToday = (int)GlobalVariableGet(GV("DAYCNT"));
      dayBlocked = GlobalVariableGet(GV("DAYBLK")) > 0;
   }
   SaveDay();
   return INIT_SUCCEEDED;
}
void OnDeinit(const int reason) { IndicatorRelease(hEma9); IndicatorRelease(hEma200); Comment(""); }

//+------------------------------------------------------------------+
bool HasPosition()
{
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong t = PositionGetTicket(i);
      if(t == 0) continue;
      if(PositionGetString(POSITION_SYMBOL) == _Symbol && PositionGetInteger(POSITION_MAGIC) == MagicNumber) return true;
   }
   return false;
}
void CloseAll(string why)
{
   for(int a = 0; a < 5 && HasPosition(); a++)
   {
      for(int i = PositionsTotal() - 1; i >= 0; i--)
      {
         ulong t = PositionGetTicket(i);
         if(t == 0) continue;
         if(PositionGetString(POSITION_SYMBOL) == _Symbol && PositionGetInteger(POSITION_MAGIC) == MagicNumber) trade.PositionClose(t);
      }
      if(HasPosition()) Sleep(300);
   }
   PrintFormat("Posisi ditutup (%s).", why);
}
double MaxLossFloor()
{
   if(!TrailingMaxLoss) return initBal * (1.0 - MaxLossGuardPct / 100.0);
   return MathMin(peakBal - initBal * MaxLossGuardPct / 100.0, initBal);   // trailing, maksimal di saldo awal
}
void Halt(string why) { halted = true; GlobalVariableSet(GV("HALT"), 1); Alert("DK Doktor Rules PROP BERHENTI: ", why); }

//+------------------------------------------------------------------+
bool VWAP(int shift, double &v)
{
   datetime bt = iTime(_Symbol, PERIOD_M5, shift);
   if(bt == 0) return false;
   MqlDateTime md; TimeToStruct(bt, md); md.hour = 0; md.min = 0; md.sec = 0;
   MqlRates r[];
   int n = CopyRates(_Symbol, PERIOD_M5, StructToTime(md), bt, r);
   if(n <= 0) return false;
   double pv = 0, vv = 0;
   for(int i = 0; i < n; i++) { double tp = (r[i].high + r[i].low + r[i].close) / 3.0; pv += tp * (double)r[i].tick_volume; vv += (double)r[i].tick_volume; }
   if(vv <= 0) return false;
   v = pv / vv; return true;
}

// last confirmed fractal swing low (dir=1) or high (dir=-1) before the signal bar (shift 1)
bool LastSwing(int dir, double &level)
{
   int need = 200;
   MqlRates r[]; ArraySetAsSeries(r, true);
   if(CopyRates(_Symbol, PERIOD_M5, 0, need, r) < need) return false;
   int k = FractalBars;
   for(int s = 1 + k; s < need - k; s++)   // pivot at s is confirmed once bar s-k (>= shift 1) closed
   {
      bool ok = true;
      for(int j = 1; j <= k && ok; j++)
      {
         if(dir == 1) { if(!(r[s].low < r[s - j].low && r[s].low < r[s + j].low)) ok = false; }
         else         { if(!(r[s].high > r[s - j].high && r[s].high > r[s + j].high)) ok = false; }
      }
      if(ok) { level = (dir == 1) ? r[s].low : r[s].high; return true; }
   }
   return false;
}

double LotForRisk(double dist)
{
   double tv = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE_LOSS);
   if(tv <= 0) tv = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
   double ts = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);
   if(tv <= 0 || ts <= 0 || dist <= 0) return 0;
   double raw = AccountInfoDouble(ACCOUNT_BALANCE) * RiskPercent / 100.0 / (dist / ts * tv);
   double step = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP), mn = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN), mx = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   double v = MathFloor(raw / step + 1e-9) * step;
   if(v < mn) v = AllowMinLotOverRisk ? mn : 0;
   return NormalizeDouble(MathMin(v, mx), 2);
}

//+------------------------------------------------------------------+
void OnTick()
{
   if(DayNo() != curDay)
   {
      curDay = DayNo();
      dayRef = MathMax(AccountInfoDouble(ACCOUNT_BALANCE), AccountInfoDouble(ACCOUNT_EQUITY));
      tradesToday = 0; dayBlocked = false; SaveDay();
   }
   double eq = AccountInfoDouble(ACCOUNT_EQUITY);
   double bal = AccountInfoDouble(ACCOUNT_BALANCE);
   if(bal > peakBal) { peakBal = bal; GlobalVariableSet(GV("PEAK"), peakBal); }
   if(eq <= MaxLossFloor())
   { if(HasPosition()) CloseAll("MAX LOSS GUARD"); if(!halted) Halt(StringFormat("equity %.2f menyentuh max loss guard %.1f%%", eq, MaxLossGuardPct)); }
   if(ProfitTargetPct > 0 && eq >= initBal * (1.0 + ProfitTargetPct / 100.0))
   { if(HasPosition()) CloseAll("PROFIT TARGET"); if(!halted) Halt(StringFormat("target %.1f%% tercapai", ProfitTargetPct)); }
   if(eq - dayRef <= -DailyGuardPct / 100.0 * initBal)
   { if(HasPosition()) CloseAll("DAILY GUARD"); if(!dayBlocked) { dayBlocked = true; SaveDay(); } }
   ManageBreakEven();
   ShowPanel();
   if(halted || dayBlocked) return;

   datetime bt = iTime(_Symbol, PERIOD_M5, 0);
   if(bt == lastBar) return;
   lastBar = bt;
   if(HasPosition() || tradesToday >= MaxTradesPerDay) return;

   double e9[], e200[];
   ArraySetAsSeries(e9, true); ArraySetAsSeries(e200, true);
   if(CopyBuffer(hEma9, 0, 1, 2, e9) < 2) return;        // e9[0] = bar 1 (closed), e9[1] = bar 2
   if(CopyBuffer(hEma200, 0, 1, 1, e200) < 1) return;    // last completed H1
   double h1c = iClose(_Symbol, PERIOD_H1, 1);
   double v1, v2;
   if(!VWAP(1, v1) || !VWAP(2, v2)) return;

   int dir = 0;
   if(e9[1] <= v2 && e9[0] > v1 && h1c > e200[0]) dir = 1;
   if(e9[1] >= v2 && e9[0] < v1 && h1c < e200[0]) dir = -1;
   if(dir == 0) return;

   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK), bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   double spread = ask - bid;
   if(spread > MaxSpreadPrice) return;
   double swing;
   if(!LastSwing(dir, swing)) return;
   int dg = (int)SymbolInfoInteger(_Symbol, SYMBOL_DIGITS);
   double entry = (dir == 1) ? ask : bid;
   double sl = (dir == 1) ? swing - SLBuffer : swing + SLBuffer + spread;
   double dist = dir * (entry - sl);
   if(dist <= 0 || dist < MinSLSpreadMult * spread) { Print("Sinyal dilewati: jarak SL terlalu kecil / swing tidak valid."); return; }
   double tp = entry + dir * RR * dist;
   double lot = LotForRisk(dist);
   if(lot <= 0) { PrintFormat("Sinyal dilewati: lot di bawah minimum untuk risiko %.2f%% (SL %.2f).", RiskPercent, dist); return; }
   bool ok = (dir == 1) ? trade.Buy(lot, _Symbol, ask, NormalizeDouble(sl, dg), NormalizeDouble(tp, dg), "Doktor Rules")
                        : trade.Sell(lot, _Symbol, bid, NormalizeDouble(sl, dg), NormalizeDouble(tp, dg), "Doktor Rules");
   if(ok) { tradesToday++; SaveDay(); PrintFormat("%s %.2f lot | SL %.2f | TP %.2f | RR 1:%.1f", dir == 1 ? "BUY" : "SELL", lot, sl, tp, RR); }
   else PrintFormat("Order gagal: %d", trade.ResultRetcode());
}

void ManageBreakEven()
{
   if(BreakEvenR <= 0) return;
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong t = PositionGetTicket(i);
      if(t == 0) continue;
      if(PositionGetString(POSITION_SYMBOL) != _Symbol || PositionGetInteger(POSITION_MAGIC) != MagicNumber) continue;
      double op = PositionGetDouble(POSITION_PRICE_OPEN), sl = PositionGetDouble(POSITION_SL), tp = PositionGetDouble(POSITION_TP);
      if(tp <= 0 || RR <= 0) continue;
      long type = PositionGetInteger(POSITION_TYPE);
      double dist = MathAbs(tp - op) / RR;              // jarak SL awal
      if(type == POSITION_TYPE_BUY)
      {
         if(sl >= op) continue;                          // sudah break-even
         if(SymbolInfoDouble(_Symbol, SYMBOL_BID) - op >= BreakEvenR * dist)
            if(trade.PositionModify(t, op, tp)) Print("SL dipindah ke break-even.");
      }
      else
      {
         if(sl > 0 && sl <= op) continue;
         if(op - SymbolInfoDouble(_Symbol, SYMBOL_ASK) >= BreakEvenR * dist)
            if(trade.PositionModify(t, op, tp)) Print("SL dipindah ke break-even.");
      }
   }
}

void ShowPanel()
{
   double eq = AccountInfoDouble(ACCOUNT_EQUITY);
   string s = "DK Doktor Rules PROP v1.11 | Doktor Trader\n";
   if(halted) s += "STATUS: BERHENTI (max loss guard / target)\n";
   s += StringFormat("Saldo awal %.2f | Equity %.2f (%.2f%%)\n", initBal, eq, (eq / initBal - 1) * 100);
   s += StringFormat("Hari ini %.2f%% | guard -%.1f%% %s | trade %d/%d\n", (eq - dayRef) / initBal * 100, DailyGuardPct, dayBlocked ? "(TERKUNCI)" : "", tradesToday, MaxTradesPerDay);
   s += StringFormat("Max loss guard%s: equity %.2f | Risk %.2f%% | RR 1:%.1f\n", TrailingMaxLoss ? " (trailing)" : "", MaxLossFloor(), RiskPercent, RR);
   Comment(s);
}
//+------------------------------------------------------------------+
