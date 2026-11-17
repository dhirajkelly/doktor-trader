//+------------------------------------------------------------------+
//| DT Smart Signal (MT5) - Doktor Trader                            |
//| Indikator sinyal berbasis aturan (bukan ramalan):                |
//|  BUY : harga & EMA cepat di atas EMA lambat (uptrend), lalu RSI  |
//|        naik kembali melewati level pullback (default 40).        |
//|  SELL: kebalikannya (RSI turun melewati 60 saat downtrend).      |
//| Saran SL/TP dihitung dari ATR. Hanya membaca candle yang sudah   |
//| ditutup, jadi panah tidak berubah (tidak repaint).               |
//| Alat bantu edukasi, bukan rekomendasi transaksi.                 |
//+------------------------------------------------------------------+
#property copyright "Doktor Trader - dhirajkelly.id"
#property link      "https://dhirajkelly.id"
#property version   "1.00"
#property indicator_chart_window
#property indicator_buffers 2
#property indicator_plots   2
#property indicator_label1  "DT Buy"
#property indicator_type1   DRAW_ARROW
#property indicator_color1  clrLimeGreen
#property indicator_width1  2
#property indicator_label2  "DT Sell"
#property indicator_type2   DRAW_ARROW
#property indicator_color2  clrTomato
#property indicator_width2  2

input int    InpFastEMA = 50;     // EMA cepat
input int    InpSlowEMA = 200;    // EMA lambat (filter tren)
input int    InpRSI     = 14;     // Periode RSI
input double InpRSIBuy  = 40;     // Level pullback BUY
input double InpRSISell = 60;     // Level pullback SELL
input int    InpATR     = 14;     // Periode ATR
input double InpSLATR   = 1.5;    // Saran SL = ATR x
input double InpTPATR   = 3.0;    // Saran TP = ATR x
input bool   InpAlert   = true;   // Alert & notifikasi saat sinyal baru

double BuyBuf[], SellBuf[];
double f[], s[], r[], a[];
int hF, hS, hR, hA;
datetime g_lastAlert = 0;

int OnInit()
{
   SetIndexBuffer(0, BuyBuf, INDICATOR_DATA);
   SetIndexBuffer(1, SellBuf, INDICATOR_DATA);
   PlotIndexSetInteger(0, PLOT_ARROW, 233);
   PlotIndexSetInteger(1, PLOT_ARROW, 234);
   PlotIndexSetDouble(0, PLOT_EMPTY_VALUE, EMPTY_VALUE);
   PlotIndexSetDouble(1, PLOT_EMPTY_VALUE, EMPTY_VALUE);
   hF = iMA(_Symbol, _Period, InpFastEMA, 0, MODE_EMA, PRICE_CLOSE);
   hS = iMA(_Symbol, _Period, InpSlowEMA, 0, MODE_EMA, PRICE_CLOSE);
   hR = iRSI(_Symbol, _Period, InpRSI, PRICE_CLOSE);
   hA = iATR(_Symbol, _Period, InpATR);
   if(hF == INVALID_HANDLE || hS == INVALID_HANDLE || hR == INVALID_HANDLE || hA == INVALID_HANDLE) return(INIT_FAILED);
   IndicatorSetString(INDICATOR_SHORTNAME, "DT Smart Signal");
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason) { ObjectsDeleteAll(0, "DTSS_"); Comment(""); }

int OnCalculate(const int rates_total, const int prev_calculated, const datetime &time[],
                const double &open[], const double &high[], const double &low[], const double &close[],
                const long &tick_volume[], const long &volume[], const int &spread[])
{
   int minBars = MathMax(InpSlowEMA, MathMax(InpRSI, InpATR)) + 3;
   if(rates_total < minBars) return(0);
   if(prev_calculated == rates_total) return(rates_total);   // hanya hitung saat candle baru
   if(prev_calculated == 0) { ArrayInitialize(BuyBuf, EMPTY_VALUE); ArrayInitialize(SellBuf, EMPTY_VALUE); }

   if(CopyBuffer(hF, 0, 0, rates_total, f) < rates_total) return(0);
   if(CopyBuffer(hS, 0, 0, rates_total, s) < rates_total) return(0);
   if(CopyBuffer(hR, 0, 0, rates_total, r) < rates_total) return(0);
   if(CopyBuffer(hA, 0, 0, rates_total, a) < rates_total) return(0);

   int start = (prev_calculated > minBars) ? prev_calculated - 1 : minBars;
   for(int i = start; i < rates_total; i++)
   {
      BuyBuf[i] = EMPTY_VALUE; SellBuf[i] = EMPTY_VALUE;
      if(i >= rates_total - 1) continue;                     // candle berjalan diabaikan
      bool up   = close[i] > s[i] && f[i] > s[i];
      bool down = close[i] < s[i] && f[i] < s[i];
      if(up && r[i - 1] < InpRSIBuy && r[i] >= InpRSIBuy)     BuyBuf[i]  = low[i]  - a[i] * 0.3;
      if(down && r[i - 1] > InpRSISell && r[i] <= InpRSISell) SellBuf[i] = high[i] + a[i] * 0.3;
   }

   // Info sinyal terakhir + alert
   int last = rates_total - 2;
   for(int k = last; k > last - 500 && k > minBars; k--)
   {
      bool b = BuyBuf[k] != EMPTY_VALUE, sl = SellBuf[k] != EMPTY_VALUE;
      if(!b && !sl) continue;
      int d = _Digits;
      double entry = close[k];
      double stop  = b ? entry - a[k] * InpSLATR : entry + a[k] * InpSLATR;
      double take  = b ? entry + a[k] * InpTPATR : entry - a[k] * InpTPATR;
      string txt = StringFormat("DT Smart Signal: %s %s @ %s | Saran SL %s | TP %s (%s)",
                                b ? "BUY" : "SELL", _Symbol, DoubleToString(entry, d), DoubleToString(stop, d),
                                DoubleToString(take, d), TimeToString(time[k], TIME_DATE | TIME_MINUTES));
      Comment(txt, "\nSesuaikan lot dengan aturan risiko 1% Anda. Edukasi, bukan rekomendasi.");
      if(InpAlert && k == last && time[k] != g_lastAlert && prev_calculated > 0)
      {
         g_lastAlert = time[k];
         Alert(txt);
         SendNotification(txt);
      }
      break;
   }
   return(rates_total);
}
