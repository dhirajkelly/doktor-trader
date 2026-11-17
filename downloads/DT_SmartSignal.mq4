//+------------------------------------------------------------------+
//| DT Smart Signal (MT4) - Doktor Trader                            |
//| BUY : uptrend (harga & EMA cepat > EMA lambat) + RSI naik        |
//|       melewati level pullback. SELL kebalikannya.                |
//| Saran SL/TP dari ATR. Candle tertutup saja (tidak repaint).      |
//| Alat bantu edukasi, bukan rekomendasi transaksi.                 |
//+------------------------------------------------------------------+
#property copyright "Doktor Trader - dhirajkelly.id"
#property link      "https://dhirajkelly.id"
#property version   "1.00"
#property strict
#property indicator_chart_window
#property indicator_buffers 2
#property indicator_color1 clrLimeGreen
#property indicator_color2 clrTomato
#property indicator_width1 2
#property indicator_width2 2

input int    InpFastEMA = 50;
input int    InpSlowEMA = 200;
input int    InpRSI     = 14;
input double InpRSIBuy  = 40;
input double InpRSISell = 60;
input int    InpATR     = 14;
input double InpSLATR   = 1.5;
input double InpTPATR   = 3.0;
input bool   InpAlert   = true;

double BuyBuf[], SellBuf[];
datetime g_lastAlert = 0;

int OnInit()
{
   SetIndexBuffer(0, BuyBuf);  SetIndexStyle(0, DRAW_ARROW); SetIndexArrow(0, 233); SetIndexLabel(0, "DT Buy");
   SetIndexBuffer(1, SellBuf); SetIndexStyle(1, DRAW_ARROW); SetIndexArrow(1, 234); SetIndexLabel(1, "DT Sell");
   SetIndexEmptyValue(0, EMPTY_VALUE); SetIndexEmptyValue(1, EMPTY_VALUE);
   IndicatorShortName("DT Smart Signal");
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason) { Comment(""); }

int OnCalculate(const int rates_total, const int prev_calculated, const datetime &time[],
                const double &open[], const double &high[], const double &low[], const double &close[],
                const long &tick_volume[], const long &volume[], const int &spread[])
{
   int minBars = MathMax(InpSlowEMA, MathMax(InpRSI, InpATR)) + 3;
   if(rates_total < minBars) return(0);
   if(prev_calculated == 0) { ArrayInitialize(BuyBuf, EMPTY_VALUE); ArrayInitialize(SellBuf, EMPTY_VALUE); }
   int limit = (prev_calculated == 0) ? rates_total - minBars : rates_total - prev_calculated + 1;
   if(limit < 1) limit = 1;

   for(int i = limit; i >= 0; i--)      // indeks seri: 0 = candle berjalan
   {
      BuyBuf[i] = EMPTY_VALUE; SellBuf[i] = EMPTY_VALUE;
      if(i == 0) continue;
      double f  = iMA(NULL, 0, InpFastEMA, 0, MODE_EMA, PRICE_CLOSE, i);
      double s  = iMA(NULL, 0, InpSlowEMA, 0, MODE_EMA, PRICE_CLOSE, i);
      double r0 = iRSI(NULL, 0, InpRSI, PRICE_CLOSE, i);
      double r1 = iRSI(NULL, 0, InpRSI, PRICE_CLOSE, i + 1);
      double a  = iATR(NULL, 0, InpATR, i);
      if(Close[i] > s && f > s && r1 < InpRSIBuy && r0 >= InpRSIBuy)    BuyBuf[i]  = Low[i] - a * 0.3;
      if(Close[i] < s && f < s && r1 > InpRSISell && r0 <= InpRSISell)  SellBuf[i] = High[i] + a * 0.3;
   }

   for(int k = 1; k < 500 && k < rates_total - minBars; k++)
   {
      bool b = BuyBuf[k] != EMPTY_VALUE, sl = SellBuf[k] != EMPTY_VALUE;
      if(!b && !sl) continue;
      double a = iATR(NULL, 0, InpATR, k), entry = Close[k];
      double stop = b ? entry - a * InpSLATR : entry + a * InpSLATR;
      double take = b ? entry + a * InpTPATR : entry - a * InpTPATR;
      string txt = StringFormat("DT Smart Signal: %s %s @ %s | Saran SL %s | TP %s (%s)", b ? "BUY" : "SELL", Symbol(),
                                DoubleToString(entry, Digits), DoubleToString(stop, Digits), DoubleToString(take, Digits),
                                TimeToString(Time[k], TIME_DATE | TIME_MINUTES));
      Comment(txt, "\nSesuaikan lot dengan aturan risiko 1% Anda. Edukasi, bukan rekomendasi.");
      if(InpAlert && k == 1 && Time[k] != g_lastAlert && prev_calculated > 0)
      { g_lastAlert = Time[k]; Alert(txt); SendNotification(txt); }
      break;
   }
   return(rates_total);
}
