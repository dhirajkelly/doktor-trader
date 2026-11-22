//+------------------------------------------------------------------+
//|                                                  DoktorRules.mq5 |
//|                         Doktor Rules EA - Dhiraj Kelly / @dhirajkelly |
//|                                            https://dhirajkelly.id |
//+------------------------------------------------------------------+
//  ATURAN DOKTOR RULES
//  1. Bias tren di H1 pakai EMA 200 (close H1 terakhir di atas = hanya BUY,
//     di bawah = hanya SELL).
//  2. Entry di M5 saat EMA 9 memotong VWAP (harian), dieksekusi SETELAH
//     candle close (di pembukaan candle berikutnya).
//  3. SL/TP pakai Fibonacci dari swing M5 terakhir yang searah bias:
//     SL sedikit di luar level 1.0 (+ buffer + spread), TP di extension
//     2.618 (level -1.618). RR mengikuti struktur, minimal 1:2; di bawah itu skip.
//  4. Lot dihitung dari jarak SL dengan risk 0,5% per trade.
//  Batas: maksimal 1-2 trade per hari, filter berita high-impact USD,
//  stop harian bila equity turun X% dari awal hari.
//
//  Default = MODE SINYAL (alert + gambar Fibonacci, tanpa eksekusi).
//  Aktifkan InpAutoTrade = true untuk eksekusi otomatis / backtest.
//
//  Materi edukasi. Bukan ajakan atau jaminan profit. Trading derivatif
//  berisiko tinggi; uji di akun demo / Strategy Tester dulu.
//+------------------------------------------------------------------+
#property copyright "Dhiraj Kelly - Doktor Trader"
#property link      "https://dhirajkelly.id"
#property version   "1.10"
#property description "Doktor Rules: bias H1 EMA200, entry M5 cross EMA9/VWAP setelah candle close,"
#property description "SL/TP Fibonacci (SL di luar 1.0, TP di extension 2.618), lot dari risk 0,5%, RR min 1:2,"
#property description "maks 1-2 trade/hari. Default mode sinyal (alert saja)."

#include <Trade\Trade.mqh>

enum ENUM_RISK_BASE
  {
   RISK_EQUITY  = 0, // Equity
   RISK_BALANCE = 1  // Balance
  };

//--- Mode
input group "=== Mode ==="
input bool            InpAutoTrade        = false;        // Auto-trade (false = sinyal/alert saja)
input ulong           InpMagic            = 20261122;     // Magic number
input int             InpSlippagePts      = 30;           // Slippage maks (points)

//--- Aturan 1
input group "=== Aturan 1: Bias H1 EMA 200 ==="
input ENUM_TIMEFRAMES InpBiasTF           = PERIOD_H1;    // Timeframe bias
input int             InpBiasEMA          = 200;          // Periode EMA bias
input double          InpMinBiasDist      = 0.0;          // Jarak min close ke EMA200 (harga), 0 = off

//--- Aturan 2
input group "=== Aturan 2: Entry M5 cross EMA 9 / VWAP ==="
input ENUM_TIMEFRAMES InpEntryTF          = PERIOD_M5;    // Timeframe entry
input int             InpFastEMA          = 9;            // Periode EMA cepat
input bool            InpVWAPRealVolume   = false;        // VWAP pakai real volume (false = tick volume)
input double          InpMaxDistVWAP      = 0.0;          // Skip bila close terlalu jauh dari VWAP (harga), 0 = off

//--- Aturan 3
input group "=== Aturan 3: Fibonacci retracement ==="
input int             InpPivotStrength    = 3;            // Kekuatan swing (bar kiri/kanan)
input int             InpSwingLookback    = 150;          // Jumlah bar M5 untuk cari swing
input double          InpSLBuffer         = 0.50;         // Buffer SL di luar level 1.0 (harga)
input bool            InpAddSpreadToSL    = true;         // Tambah spread ke buffer SL
input double          InpTPExtension      = 1.618;        // TP extension di luar level 0 (1.618 = Fibo 2.618, 0 = level 0)
input double          InpMinRR            = 2.0;          // RR minimal (1:x)

//--- Aturan 4
input group "=== Aturan 4: Risk per trade ==="
input double          InpRiskPct          = 0.5;          // Risk per trade (%)
input ENUM_RISK_BASE  InpRiskBase         = RISK_EQUITY;  // Dasar hitung risk

//--- Batas harian
input group "=== Batas harian ==="
input int             InpMaxTradesDay     = 2;            // Maks trade per hari
input double          InpDailyLossStopPct = 3.0;          // Stop hari ini bila equity turun X% (0 = off)
input int             InpStartHour        = 0;            // Jam mulai (waktu server)
input int             InpEndHour          = 24;           // Jam selesai (waktu server)
input bool            InpNewsFilter       = true;         // Filter berita high-impact USD (live saja)
input int             InpNewsMinutes      = 30;           // Menit sebelum/sesudah berita

//--- Tampilan
input group "=== Tampilan & notifikasi ==="
input bool            InpDrawFibo         = true;         // Gambar Fibonacci + garis SL/TP
input bool            InpShowPanel        = true;         // Panel info di chart
input bool            InpAlertPopup       = true;         // Alert popup
input bool            InpPushNotif        = true;         // Push notification ke HP (MT5 mobile)

//--- Global
CTrade   g_trade;
int      g_hFast  = INVALID_HANDLE;
int      g_hBias  = INVALID_HANDLE;
datetime g_lastBar = 0;
datetime g_curDay  = 0;
double   g_dayStartEquity = 0.0;
int      g_signalsToday   = 0;

//--- status untuk panel
int      g_bias      = 0;
double   g_lastEMA   = 0.0;
double   g_lastVWAP  = 0.0;
string   g_lastInfo  = "Menunggu candle M5 close...";

const string PFX = "DR_";

//+------------------------------------------------------------------+
int OnInit()
  {
   g_hFast = iMA(_Symbol, InpEntryTF, InpFastEMA, 0, MODE_EMA, PRICE_CLOSE);
   g_hBias = iMA(_Symbol, InpBiasTF, InpBiasEMA, 0, MODE_EMA, PRICE_CLOSE);
   if(g_hFast == INVALID_HANDLE || g_hBias == INVALID_HANDLE)
     {
      Print("Doktor Rules: gagal membuat handle EMA");
      return(INIT_FAILED);
     }
   if(InpRiskPct <= 0.0 || InpMinRR <= 0.0 || InpPivotStrength < 1 || InpSwingLookback < 20)
     {
      Print("Doktor Rules: cek input (risk, RR, pivot, lookback)");
      return(INIT_PARAMETERS_INCORRECT);
     }

   g_trade.SetExpertMagicNumber(InpMagic);
   g_trade.SetDeviationInPoints(InpSlippagePts);
   g_trade.SetTypeFillingBySymbol(_Symbol);

   g_curDay = DayStart(TimeCurrent());
   g_dayStartEquity = AccountInfoDouble(ACCOUNT_EQUITY);
   g_lastBar = iTime(_Symbol, InpEntryTF, 0);   // jangan entry di candle yang sudah berjalan

   PrintFormat("Doktor Rules aktif | %s | mode %s | risk %.2f%% | RR min 1:%.1f | maks %d trade/hari",
               _Symbol, (InpAutoTrade ? "AUTO-TRADE" : "SINYAL"), InpRiskPct, InpMinRR, InpMaxTradesDay);
   return(INIT_SUCCEEDED);
  }

//+------------------------------------------------------------------+
void OnDeinit(const int reason)
  {
   if(g_hFast != INVALID_HANDLE) IndicatorRelease(g_hFast);
   if(g_hBias != INVALID_HANDLE) IndicatorRelease(g_hBias);
   ObjectsDeleteAll(0, PFX);
   Comment("");
  }

//+------------------------------------------------------------------+
void OnTick()
  {
   CheckNewDay();

   datetime bar0 = iTime(_Symbol, InpEntryTF, 0);
   if(bar0 != 0 && bar0 != g_lastBar)
     {
      g_lastBar = bar0;
      OnNewEntryBar();
     }

   if(InpShowPanel) DrawPanel();
  }

//+------------------------------------------------------------------+
//| Logika utama: dijalankan sekali tiap candle M5 baru (= candle     |
//| sebelumnya sudah close)                                           |
//+------------------------------------------------------------------+
void OnNewEntryBar()
  {
   //--- Aturan 1: bias H1
   double bEma[];
   ArraySetAsSeries(bEma, true);
   if(CopyBuffer(g_hBias, 0, 1, 1, bEma) < 1) return;
   double h1Close = iClose(_Symbol, InpBiasTF, 1);
   if(h1Close <= 0.0) return;

   g_bias = 0;
   if(h1Close > bEma[0] + InpMinBiasDist)      g_bias = 1;
   else if(h1Close < bEma[0] - InpMinBiasDist) g_bias = -1;

   //--- Aturan 2: EMA9 vs VWAP di candle close [1] dan [2]
   double fEma[];
   ArraySetAsSeries(fEma, true);
   if(CopyBuffer(g_hFast, 0, 0, 3, fEma) < 3) return;

   MqlRates rates[];
   ArraySetAsSeries(rates, true);
   int got = CopyRates(_Symbol, InpEntryTF, 0, 700, rates);
   if(got < 10) return;

   double vwap1 = VWAPAt(rates, got, 1);
   double vwap2 = VWAPAt(rates, got, 2);
   if(vwap1 <= 0.0 || vwap2 <= 0.0) return;

   g_lastEMA  = fEma[1];
   g_lastVWAP = vwap1;

   bool crossUp = (fEma[2] <= vwap2 && fEma[1] > vwap1);
   bool crossDn = (fEma[2] >= vwap2 && fEma[1] < vwap1);

   int dir = 0;
   if(crossUp && g_bias == 1)  dir = 1;
   if(crossDn && g_bias == -1) dir = -1;

   if(dir == 0)
     {
      if(crossUp || crossDn)
         g_lastInfo = StringFormat("%s cross %s, berlawanan/tanpa bias H1 -> skip",
                                   TimeToString(rates[1].time, TIME_MINUTES), (crossUp ? "naik" : "turun"));
      return;
     }

   string side = (dir == 1 ? "BUY" : "SELL");

   //--- Filter
   if(!InSession())                   { Skip(side, "di luar jam trading"); return; }
   if(TradesToday() >= InpMaxTradesDay){ Skip(side, StringFormat("kuota %d trade hari ini habis", InpMaxTradesDay)); return; }
   if(DailyLossHit())                 { Skip(side, StringFormat("stop harian %.1f%% tercapai", InpDailyLossStopPct)); return; }
   if(InpAutoTrade && HasOpenPosition()){ Skip(side, "masih ada posisi terbuka"); return; }
   if(NewsBlocked())                  { Skip(side, "dekat berita high-impact USD"); return; }
   if(InpMaxDistVWAP > 0.0 && MathAbs(rates[1].close - vwap1) > InpMaxDistVWAP)
                                      { Skip(side, "harga terlalu jauh dari VWAP"); return; }

   //--- Aturan 3: swing + Fibonacci
   double lvl1, lvl0;      // level 1.0 dan level 0
   datetime t1, t0;
   if(!FindLeg(dir, lvl1, lvl0, t1, t0)) { Skip(side, "swing Fibonacci tidak valid"); return; }

   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   double spread = ask - bid;
   double buffer = InpSLBuffer + (InpAddSpreadToSL ? spread : 0.0);

   double entry, sl, tp;
   if(dir == 1)
     {
      entry = ask;
      sl    = lvl1 - buffer;
      tp    = lvl0 + InpTPExtension * (lvl0 - lvl1);
     }
   else
     {
      entry = bid;
      sl    = lvl1 + buffer;
      tp    = lvl0 + InpTPExtension * (lvl0 - lvl1);
     }
   sl = NormalizeDouble(sl, _Digits);
   tp = NormalizeDouble(tp, _Digits);

   double risk   = (dir == 1 ? entry - sl : sl - entry);
   double reward = (dir == 1 ? tp - entry : entry - tp);
   if(risk <= 0.0 || reward <= 0.0) { Skip(side, "harga sudah di luar swing (TP/SL terlewati)"); return; }

   double minStop = (double)SymbolInfoInteger(_Symbol, SYMBOL_TRADE_STOPS_LEVEL) * _Point;
   if(risk < minStop || reward < minStop) { Skip(side, "jarak SL/TP di bawah stop level broker"); return; }

   double rr = reward / risk;
   if(rr < InpMinRR) { Skip(side, StringFormat("RR 1:%.2f < 1:%.1f", rr, InpMinRR)); return; }

   //--- Aturan 4: lot dari jarak SL
   double riskMoney = 0.0;
   double lot = CalcLot(dir == 1 ? ORDER_TYPE_BUY : ORDER_TYPE_SELL, entry, sl, riskMoney);
   if(lot <= 0.0) { Skip(side, "lot minimum melebihi risk 0,5% (SL terlalu jauh)"); return; }

   //--- Sinyal valid
   if(InpDrawFibo) DrawSetup(dir, t1, lvl1, t0, lvl0, entry, sl, tp);

   string msg = StringFormat("DOKTOR RULES | %s %s | Entry %s | SL %s | TP %s | RR 1:%.2f | Lot %.2f (risk %.2f%% = %.2f %s)",
                             side, _Symbol,
                             DoubleToString(entry, _Digits), DoubleToString(sl, _Digits), DoubleToString(tp, _Digits),
                             rr, lot, InpRiskPct, riskMoney, AccountInfoString(ACCOUNT_CURRENCY));
   g_lastInfo = msg;
   Print(msg);
   Notify(msg);

   if(!InpAutoTrade)
     {
      g_signalsToday++;
      return;
     }

   bool ok = (dir == 1) ? g_trade.Buy(lot, _Symbol, 0.0, sl, tp, "DoktorRules")
                        : g_trade.Sell(lot, _Symbol, 0.0, sl, tp, "DoktorRules");
   if(!ok)
      PrintFormat("Doktor Rules: order gagal, retcode %u (%s)", g_trade.ResultRetcode(), g_trade.ResultRetcodeDescription());
  }

//+------------------------------------------------------------------+
//| VWAP harian (reset tiap pergantian hari server)                   |
//+------------------------------------------------------------------+
double VWAPAt(const MqlRates &r[], const int count, const int shift)
  {
   if(shift >= count) return 0.0;
   datetime day = DayStart(r[shift].time);
   double pv = 0.0, vv = 0.0;
   for(int k = shift; k < count && r[k].time >= day; k++)
     {
      double vol = (InpVWAPRealVolume && r[k].real_volume > 0) ? (double)r[k].real_volume : (double)r[k].tick_volume;
      if(vol <= 0.0) vol = 1.0;
      double typical = (r[k].high + r[k].low + r[k].close) / 3.0;
      pv += typical * vol;
      vv += vol;
     }
   return (vv > 0.0 ? pv / vv : 0.0);
  }

//+------------------------------------------------------------------+
//| Swing (fractal) yang sudah terkonfirmasi                          |
//+------------------------------------------------------------------+
bool IsPivotHigh(const double &h[], const int i, const int s)
  {
   for(int k = 1; k <= s; k++)
      if(!(h[i] > h[i - k] && h[i] >= h[i + k])) return false;
   return true;
  }

bool IsPivotLow(const double &l[], const int i, const int s)
  {
   for(int k = 1; k <= s; k++)
      if(!(l[i] < l[i - k] && l[i] <= l[i + k])) return false;
   return true;
  }

//+------------------------------------------------------------------+
//| Cari leg swing terakhir searah bias.                              |
//| BUY : level 1.0 = swing low,  level 0 = swing high (setelahnya)   |
//| SELL: level 1.0 = swing high, level 0 = swing low  (setelahnya)   |
//+------------------------------------------------------------------+
bool FindLeg(const int dir, double &lvl1, double &lvl0, datetime &t1, datetime &t0)
  {
   int n = InpSwingLookback;
   int s = InpPivotStrength;
   double h[], l[];
   datetime t[];
   ArraySetAsSeries(h, true);
   ArraySetAsSeries(l, true);
   ArraySetAsSeries(t, true);
   if(CopyHigh(_Symbol, InpEntryTF, 0, n, h) < n) return false;
   if(CopyLow(_Symbol, InpEntryTF, 0, n, l)  < n) return false;
   if(CopyTime(_Symbol, InpEntryTF, 0, n, t) < n) return false;

   int last = n - 1 - s;
   int idx0 = -1, idx1 = -1;

   if(dir == 1)
     {
      for(int i = s + 1; i <= last; i++) if(IsPivotHigh(h, i, s)) { idx0 = i; break; }
      if(idx0 < 0) return false;
      for(int i = idx0 + 1; i <= last; i++) if(IsPivotLow(l, i, s)) { idx1 = i; break; }
      if(idx1 < 0) return false;
      // struktur batal kalau swing low sudah ditembus
      for(int i = 1; i < idx0; i++) if(l[i] <= l[idx1]) return false;
      lvl1 = l[idx1]; t1 = t[idx1];
      lvl0 = h[idx0]; t0 = t[idx0];
     }
   else
     {
      for(int i = s + 1; i <= last; i++) if(IsPivotLow(l, i, s)) { idx0 = i; break; }
      if(idx0 < 0) return false;
      for(int i = idx0 + 1; i <= last; i++) if(IsPivotHigh(h, i, s)) { idx1 = i; break; }
      if(idx1 < 0) return false;
      for(int i = 1; i < idx0; i++) if(h[i] >= h[idx1]) return false;
      lvl1 = h[idx1]; t1 = t[idx1];
      lvl0 = l[idx0]; t0 = t[idx0];
     }
   return (MathAbs(lvl0 - lvl1) > 0.0);
  }

//+------------------------------------------------------------------+
//| Lot = (balance/equity x risk%) / rugi per 1 lot di SL, dibulatkan |
//| ke bawah. Tidak pernah dinaikkan ke lot minimum.                  |
//+------------------------------------------------------------------+
double CalcLot(const ENUM_ORDER_TYPE type, const double entry, const double sl, double &riskMoney)
  {
   double base = (InpRiskBase == RISK_EQUITY) ? AccountInfoDouble(ACCOUNT_EQUITY) : AccountInfoDouble(ACCOUNT_BALANCE);
   riskMoney = base * InpRiskPct / 100.0;

   double loss1 = 0.0;
   if(!OrderCalcProfit(type, _Symbol, 1.0, entry, sl, loss1)) return 0.0;
   loss1 = MathAbs(loss1);
   if(loss1 <= 0.0) return 0.0;

   double step = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);
   double minL = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   double maxL = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   if(step <= 0.0) step = 0.01;

   double lot = MathFloor((riskMoney / loss1) / step) * step;
   if(lot < minL) return 0.0;
   if(lot > maxL) lot = maxL;

   int vd = (int)MathMax(0.0, MathCeil(-MathLog10(step)));
   lot = NormalizeDouble(lot, vd);
   riskMoney = loss1 * lot;   // risk riil setelah pembulatan
   return lot;
  }

//+------------------------------------------------------------------+
//| Helper                                                            |
//+------------------------------------------------------------------+
datetime DayStart(const datetime t) { return t - (t % 86400); }

void CheckNewDay()
  {
   datetime d = DayStart(TimeCurrent());
   if(d != g_curDay)
     {
      g_curDay = d;
      g_dayStartEquity = AccountInfoDouble(ACCOUNT_EQUITY);
      g_signalsToday = 0;
     }
  }

bool InSession()
  {
   if(InpStartHour <= 0 && InpEndHour >= 24) return true;
   MqlDateTime dt;
   TimeToStruct(TimeCurrent(), dt);
   if(InpStartHour < InpEndHour) return (dt.hour >= InpStartHour && dt.hour < InpEndHour);
   return (dt.hour >= InpStartHour || dt.hour < InpEndHour);   // sesi lewat tengah malam
  }

int TradesToday()
  {
   if(!InpAutoTrade) return g_signalsToday;
   if(!HistorySelect(g_curDay, TimeCurrent() + 60)) return 0;
   int cnt = 0;
   for(int i = HistoryDealsTotal() - 1; i >= 0; i--)
     {
      ulong tk = HistoryDealGetTicket(i);
      if(tk == 0) continue;
      if(HistoryDealGetString(tk, DEAL_SYMBOL) != _Symbol) continue;
      if((ulong)HistoryDealGetInteger(tk, DEAL_MAGIC) != InpMagic) continue;
      if(HistoryDealGetInteger(tk, DEAL_ENTRY) == DEAL_ENTRY_IN) cnt++;
     }
   return cnt;
  }

bool DailyLossHit()
  {
   if(InpDailyLossStopPct <= 0.0 || g_dayStartEquity <= 0.0) return false;
   double dd = (g_dayStartEquity - AccountInfoDouble(ACCOUNT_EQUITY)) / g_dayStartEquity * 100.0;
   return (dd >= InpDailyLossStopPct);
  }

bool HasOpenPosition()
  {
   for(int i = PositionsTotal() - 1; i >= 0; i--)
     {
      ulong tk = PositionGetTicket(i);
      if(tk == 0) continue;
      if(PositionGetString(POSITION_SYMBOL) == _Symbol && (ulong)PositionGetInteger(POSITION_MAGIC) == InpMagic)
         return true;
     }
   return false;
  }

bool NewsBlocked()
  {
   if(!InpNewsFilter || MQLInfoInteger(MQL_TESTER)) return false;   // kalender tidak tersedia di tester
   MqlCalendarValue vals[];
   datetime now  = TimeTradeServer();
   datetime from = now - InpNewsMinutes * 60;
   datetime to   = now + InpNewsMinutes * 60;
   if(!CalendarValueHistory(vals, from, to, NULL, "USD")) return false;
   for(int i = 0; i < ArraySize(vals); i++)
     {
      MqlCalendarEvent ev;
      if(CalendarEventById(vals[i].event_id, ev) && ev.importance == CALENDAR_IMPORTANCE_HIGH)
         return true;
     }
   return false;
  }

void Skip(const string side, const string reason)
  {
   g_lastInfo = StringFormat("Sinyal %s dilewati: %s", side, reason);
   Print("Doktor Rules | ", g_lastInfo);
  }

void Notify(const string msg)
  {
   if(MQLInfoInteger(MQL_TESTER)) return;
   if(InpAlertPopup) Alert(msg);
   if(InpPushNotif)  SendNotification(msg);
  }

//+------------------------------------------------------------------+
//| Gambar Fibonacci standar + garis entry/SL/TP                      |
//+------------------------------------------------------------------+
void DrawSetup(const int dir, const datetime t1, const double p1, const datetime t0, const double p0,
               const double entry, const double sl, const double tp)
  {
   string fib = PFX + "FIBO";
   ObjectDelete(0, fib);
   // titik pertama = level 1.0, titik kedua = level 0
   if(ObjectCreate(0, fib, OBJ_FIBO, 0, t1, p1, t0, p0))
     {
      double lv[8] = {0.0, 0.236, 0.382, 0.5, 0.618, 0.786, 1.0, 0.0};
      lv[7] = -InpTPExtension;   // level TP (2.618 = -1.618 dari level 0)
      int nl = (InpTPExtension > 0.0 ? 8 : 7);
      ObjectSetInteger(0, fib, OBJPROP_LEVELS, nl);
      for(int i = 0; i < nl; i++)
        {
         ObjectSetDouble(0, fib, OBJPROP_LEVELVALUE, i, lv[i]);
         string txt = (i == 7) ? StringFormat("TP ext %.3f  %%$", 1.0 + InpTPExtension) : DoubleToString(lv[i], 3) + "  %$";
         ObjectSetString(0, fib, OBJPROP_LEVELTEXT, i, txt);
         ObjectSetInteger(0, fib, OBJPROP_LEVELCOLOR, i, clrDarkTurquoise);
        }
      ObjectSetInteger(0, fib, OBJPROP_COLOR, clrDarkTurquoise);
      ObjectSetInteger(0, fib, OBJPROP_RAY_RIGHT, true);
     }
   HLine(PFX + "ENTRY", entry, clrWhite,     "Entry");
   HLine(PFX + "SL",    sl,    clrTomato,    "SL");
   HLine(PFX + "TP",    tp,    clrMediumSeaGreen, "TP");
   ChartRedraw();
  }

void HLine(const string name, const double price, const color c, const string txt)
  {
   ObjectDelete(0, name);
   if(ObjectCreate(0, name, OBJ_HLINE, 0, 0, price))
     {
      ObjectSetInteger(0, name, OBJPROP_COLOR, c);
      ObjectSetInteger(0, name, OBJPROP_STYLE, STYLE_DASH);
      ObjectSetString(0, name, OBJPROP_TEXT, txt);
     }
  }

void DrawPanel()
  {
   string biasTxt = (g_bias == 1 ? "BULLISH (BUY saja)" : (g_bias == -1 ? "BEARISH (SELL saja)" : "netral / belum terbaca"));
   double dd = 0.0;
   if(g_dayStartEquity > 0.0)
      dd = (AccountInfoDouble(ACCOUNT_EQUITY) - g_dayStartEquity) / g_dayStartEquity * 100.0;

   Comment(StringFormat(
      "DOKTOR RULES  |  %s  |  mode %s\n"
      "Bias %s EMA%d : %s\n"
      "EMA%d %s : %s   |   VWAP : %s\n"
      "Risk %.2f%%/trade  |  RR min 1:%.1f  |  Trade hari ini %d/%d\n"
      "P/L hari ini %.2f%%  |  stop harian %s\n"
      "%s",
      _Symbol, (InpAutoTrade ? "AUTO" : "SINYAL"),
      EnumToString(InpBiasTF), InpBiasEMA, biasTxt,
      InpFastEMA, EnumToString(InpEntryTF), DoubleToString(g_lastEMA, _Digits), DoubleToString(g_lastVWAP, _Digits),
      InpRiskPct, InpMinRR, TradesToday(), InpMaxTradesDay,
      dd, (InpDailyLossStopPct > 0.0 ? DoubleToString(InpDailyLossStopPct, 1) + "%" : "off"),
      g_lastInfo));
  }
//+------------------------------------------------------------------+
