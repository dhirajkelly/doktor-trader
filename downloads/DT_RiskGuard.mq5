//+------------------------------------------------------------------+
//| DT Risk Guard (MT5) - Doktor Trader                              |
//| Manajemen risiko otomatis untuk posisi yang sudah terbuka:       |
//|  - Auto SL / TP untuk posisi tanpa SL/TP                          |
//|  - Break-even otomatis                                            |
//|  - Trailing stop                                                  |
//|  - Batas rugi harian (tutup semua posisi & kunci sampai besok)    |
//| EA ini TIDAK membuka posisi. Alat bantu edukasi, uji di demo dulu.|
//+------------------------------------------------------------------+
#property copyright "Doktor Trader - dhirajkelly.id"
#property link      "https://dhirajkelly.id"
#property version   "1.00"

#include <Trade\Trade.mqh>

input group "Posisi yang dikelola"
input bool   InpAllSymbols    = false;  // Kelola semua simbol (false = simbol chart ini saja)
input long   InpMagic         = -1;     // Magic number (-1 = semua, 0 = posisi manual saja)

input group "Auto SL / TP (dalam POINT, 0 = mati)"
input int    InpStopLoss      = 500;    // Stop loss (XAUUSD 2 digit: 500 point = $5)
input int    InpTakeProfit    = 1000;   // Take profit (1000 point = $10)

input group "Break-even (0 = mati)"
input int    InpBETrigger     = 500;    // Pindah SL ke entry setelah profit (point)
input int    InpBEOffset      = 20;     // Kunci profit kecil di atas entry (point)

input group "Trailing stop (0 = mati)"
input int    InpTrailStart    = 800;    // Mulai trailing setelah profit (point)
input int    InpTrailDistance = 400;    // Jarak SL dari harga (point)
input int    InpTrailStep     = 50;     // Geser minimal per langkah (point)

input group "Batas rugi harian"
input double InpDailyLossPct  = 3.0;    // Maks rugi harian (% dari equity awal hari, 0 = mati)

CTrade   trade;
datetime g_day = 0;
double   g_dayEquity = 0;
bool     g_locked = false;

datetime DayOf(datetime t) { return t - (t % 86400); }

void NewDayCheck()
{
   datetime d = DayOf(TimeCurrent());
   if(d != g_day)
   {
      g_day = d;
      g_dayEquity = AccountInfoDouble(ACCOUNT_EQUITY);
      g_locked = false;
   }
}

bool Selected(const string sym, const long magic)
{
   if(!InpAllSymbols && sym != _Symbol) return false;
   if(InpMagic >= 0 && magic != InpMagic) return false;
   return true;
}

void ManagePositions()
{
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0) continue;
      string sym  = PositionGetString(POSITION_SYMBOL);
      long  magic = PositionGetInteger(POSITION_MAGIC);
      if(!Selected(sym, magic)) continue;

      bool   buy    = (PositionGetInteger(POSITION_TYPE) == POSITION_TYPE_BUY);
      double open   = PositionGetDouble(POSITION_PRICE_OPEN);
      double sl     = PositionGetDouble(POSITION_SL);
      double tp     = PositionGetDouble(POSITION_TP);
      double point  = SymbolInfoDouble(sym, SYMBOL_POINT);
      int    digits = (int)SymbolInfoInteger(sym, SYMBOL_DIGITS);
      double bid    = SymbolInfoDouble(sym, SYMBOL_BID);
      double ask    = SymbolInfoDouble(sym, SYMBOL_ASK);
      double minDist = (SymbolInfoInteger(sym, SYMBOL_TRADE_STOPS_LEVEL) + 1) * point;
      if(point <= 0 || bid <= 0) continue;

      double newSL = sl, newTP = tp;

      // 1) Auto SL / TP
      if(sl == 0 && InpStopLoss > 0)  newSL = buy ? open - InpStopLoss * point : open + InpStopLoss * point;
      if(tp == 0 && InpTakeProfit > 0) newTP = buy ? open + InpTakeProfit * point : open - InpTakeProfit * point;

      double profitPts = buy ? (bid - open) / point : (open - ask) / point;

      // 2) Break-even
      if(InpBETrigger > 0 && profitPts >= InpBETrigger)
      {
         double be = buy ? open + InpBEOffset * point : open - InpBEOffset * point;
         if(newSL == 0 || (buy && newSL < be) || (!buy && newSL > be)) newSL = be;
      }

      // 3) Trailing stop
      if(InpTrailStart > 0 && InpTrailDistance > 0 && profitPts >= InpTrailStart)
      {
         double t = buy ? bid - InpTrailDistance * point : ask + InpTrailDistance * point;
         if(newSL == 0 || (buy && t > newSL + InpTrailStep * point) || (!buy && t < newSL - InpTrailStep * point)) newSL = t;
      }

      // Validasi jarak minimal broker
      if(buy)
      {
         if(newSL > 0 && bid - newSL < minDist) newSL = sl;
         if(newTP > 0 && newTP - bid < minDist) newTP = tp;
      }
      else
      {
         if(newSL > 0 && newSL - ask < minDist) newSL = sl;
         if(newTP > 0 && ask - newTP < minDist) newTP = tp;
      }
      newSL = NormalizeDouble(newSL, digits);
      newTP = NormalizeDouble(newTP, digits);

      if(MathAbs(newSL - sl) > point / 2 || MathAbs(newTP - tp) > point / 2)
      {
         if(!trade.PositionModify(ticket, newSL, newTP))
            PrintFormat("DT Risk Guard: gagal ubah SL/TP #%I64u (%s) error %d", ticket, sym, GetLastError());
      }
   }
}

void CloseAll()
{
   for(int i = PositionsTotal() - 1; i >= 0; i--)
   {
      ulong ticket = PositionGetTicket(i);
      if(ticket == 0) continue;
      if(!Selected(PositionGetString(POSITION_SYMBOL), PositionGetInteger(POSITION_MAGIC))) continue;
      if(!trade.PositionClose(ticket))
         PrintFormat("DT Risk Guard: gagal tutup #%I64u error %d", ticket, GetLastError());
   }
}

void Run()
{
   NewDayCheck();
   double eq = AccountInfoDouble(ACCOUNT_EQUITY);
   double lossPct = (g_dayEquity > 0) ? (g_dayEquity - eq) / g_dayEquity * 100.0 : 0;

   if(InpDailyLossPct > 0 && lossPct >= InpDailyLossPct && !g_locked)
   {
      g_locked = true;
      Alert("DT Risk Guard: batas rugi harian ", DoubleToString(InpDailyLossPct, 1), "% tercapai. Semua posisi ditutup. Berhenti trading hari ini.");
   }
   if(g_locked) CloseAll();
   else ManagePositions();

   Comment("DT Risk Guard - Doktor Trader\n",
           "Equity awal hari: ", DoubleToString(g_dayEquity, 2), "  |  Sekarang: ", DoubleToString(eq, 2), "\n",
           "Rugi hari ini: ", DoubleToString(MathMax(lossPct, 0), 2), "% dari batas ", DoubleToString(InpDailyLossPct, 1), "%\n",
           "Status: ", g_locked ? "TERKUNCI - posisi baru akan langsung ditutup sampai besok" : "aktif");
}

int OnInit()
{
   trade.SetDeviationInPoints(50);
   NewDayCheck();
   EventSetTimer(1);
   return(INIT_SUCCEEDED);
}

void OnDeinit(const int reason) { EventKillTimer(); Comment(""); }
void OnTick()  { Run(); }
void OnTimer() { Run(); }
