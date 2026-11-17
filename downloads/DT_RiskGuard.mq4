//+------------------------------------------------------------------+
//| DT Risk Guard (MT4) - Doktor Trader                              |
//| Auto SL/TP, break-even, trailing stop, batas rugi harian.        |
//| EA ini TIDAK membuka posisi. Alat bantu edukasi, uji di demo dulu.|
//+------------------------------------------------------------------+
#property copyright "Doktor Trader - dhirajkelly.id"
#property link      "https://dhirajkelly.id"
#property version   "1.00"
#property strict

input bool   InpAllSymbols    = false;  // Kelola semua simbol (false = simbol chart ini saja)
input int    InpMagic         = -1;     // Magic number (-1 = semua, 0 = posisi manual saja)
input int    InpStopLoss      = 500;    // Auto stop loss (point, 0 = mati). XAUUSD 2 digit: 500 = $5
input int    InpTakeProfit    = 1000;   // Auto take profit (point, 0 = mati)
input int    InpBETrigger     = 500;    // Break-even setelah profit (point, 0 = mati)
input int    InpBEOffset      = 20;     // Kunci profit di atas entry (point)
input int    InpTrailStart    = 800;    // Mulai trailing setelah profit (point, 0 = mati)
input int    InpTrailDistance = 400;    // Jarak trailing dari harga (point)
input int    InpTrailStep     = 50;     // Geser minimal per langkah (point)
input double InpDailyLossPct  = 3.0;    // Maks rugi harian (% equity awal hari, 0 = mati)

datetime g_day = 0;
double   g_dayEquity = 0;
bool     g_locked = false;

datetime DayOf(datetime t) { return t - (t % 86400); }

void NewDayCheck()
{
   datetime d = DayOf(TimeCurrent());
   if(d != g_day) { g_day = d; g_dayEquity = AccountEquity(); g_locked = false; }
}

bool Selected()
{
   if(OrderType() > OP_SELL) return false;               // posisi aktif saja, bukan pending
   if(!InpAllSymbols && OrderSymbol() != Symbol()) return false;
   if(InpMagic >= 0 && OrderMagicNumber() != InpMagic) return false;
   return true;
}

void ManagePositions()
{
   for(int i = OrdersTotal() - 1; i >= 0; i--)
   {
      if(!OrderSelect(i, SELECT_BY_POS, MODE_TRADES) || !Selected()) continue;
      string sym = OrderSymbol();
      bool   buy = (OrderType() == OP_BUY);
      double open = OrderOpenPrice(), sl = OrderStopLoss(), tp = OrderTakeProfit();
      double point = MarketInfo(sym, MODE_POINT);
      int    digits = (int)MarketInfo(sym, MODE_DIGITS);
      double bid = MarketInfo(sym, MODE_BID), ask = MarketInfo(sym, MODE_ASK);
      double minDist = (MarketInfo(sym, MODE_STOPLEVEL) + 1) * point;
      if(point <= 0 || bid <= 0) continue;

      double newSL = sl, newTP = tp;
      if(sl == 0 && InpStopLoss > 0)   newSL = buy ? open - InpStopLoss * point : open + InpStopLoss * point;
      if(tp == 0 && InpTakeProfit > 0) newTP = buy ? open + InpTakeProfit * point : open - InpTakeProfit * point;

      double profitPts = buy ? (bid - open) / point : (open - ask) / point;

      if(InpBETrigger > 0 && profitPts >= InpBETrigger)
      {
         double be = buy ? open + InpBEOffset * point : open - InpBEOffset * point;
         if(newSL == 0 || (buy && newSL < be) || (!buy && newSL > be)) newSL = be;
      }
      if(InpTrailStart > 0 && InpTrailDistance > 0 && profitPts >= InpTrailStart)
      {
         double t = buy ? bid - InpTrailDistance * point : ask + InpTrailDistance * point;
         if(newSL == 0 || (buy && t > newSL + InpTrailStep * point) || (!buy && t < newSL - InpTrailStep * point)) newSL = t;
      }

      if(buy)  { if(newSL > 0 && bid - newSL < minDist) newSL = sl; if(newTP > 0 && newTP - bid < minDist) newTP = tp; }
      else     { if(newSL > 0 && newSL - ask < minDist) newSL = sl; if(newTP > 0 && ask - newTP < minDist) newTP = tp; }
      newSL = NormalizeDouble(newSL, digits);
      newTP = NormalizeDouble(newTP, digits);

      if(MathAbs(newSL - sl) > point / 2 || MathAbs(newTP - tp) > point / 2)
         if(!OrderModify(OrderTicket(), open, newSL, newTP, 0, clrNONE))
            Print("DT Risk Guard: gagal ubah SL/TP #", OrderTicket(), " error ", GetLastError());
   }
}

void CloseAll()
{
   for(int i = OrdersTotal() - 1; i >= 0; i--)
   {
      if(!OrderSelect(i, SELECT_BY_POS, MODE_TRADES) || !Selected()) continue;
      double price = (OrderType() == OP_BUY) ? MarketInfo(OrderSymbol(), MODE_BID) : MarketInfo(OrderSymbol(), MODE_ASK);
      if(!OrderClose(OrderTicket(), OrderLots(), price, 50, clrNONE))
         Print("DT Risk Guard: gagal tutup #", OrderTicket(), " error ", GetLastError());
   }
}

void Run()
{
   RefreshRates();
   NewDayCheck();
   double eq = AccountEquity();
   double lossPct = (g_dayEquity > 0) ? (g_dayEquity - eq) / g_dayEquity * 100.0 : 0;
   if(InpDailyLossPct > 0 && lossPct >= InpDailyLossPct && !g_locked)
   {
      g_locked = true;
      Alert("DT Risk Guard: batas rugi harian ", DoubleToString(InpDailyLossPct, 1), "% tercapai. Semua posisi ditutup. Berhenti trading hari ini.");
   }
   if(g_locked) CloseAll(); else ManagePositions();

   Comment("DT Risk Guard - Doktor Trader\n",
           "Equity awal hari: ", DoubleToString(g_dayEquity, 2), "  |  Sekarang: ", DoubleToString(eq, 2), "\n",
           "Rugi hari ini: ", DoubleToString(MathMax(lossPct, 0), 2), "% dari batas ", DoubleToString(InpDailyLossPct, 1), "%\n",
           "Status: ", g_locked ? "TERKUNCI - posisi baru akan langsung ditutup sampai besok" : "aktif");
}

int  OnInit()  { NewDayCheck(); EventSetTimer(1); return(INIT_SUCCEEDED); }
void OnDeinit(const int reason) { EventKillTimer(); Comment(""); }
void OnTick()  { Run(); }
void OnTimer() { Run(); }
