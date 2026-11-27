// Ekonomi Makro 27 Nov 2026 (format M/T1 + L whiteboard): emas dunia -36% vs Antam -21%.
// b(k) = frame where sentence k of the scene starts. All numbers come from TradingView weekly data
// (makro_weekly.json) or dated public sources listed on screen.
import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Board, HAND, Hi, MARK, Note, Pop, SANSB, Stroke, Tag, Title, W, Write, arrowD, circleD, prog, underD} from './wb';
import WK from './makro_weekly.json';

type SP = {b: (k: number) => number; dur: number};
type Row = {t: number; date: string; xau: number; xau_h: number; idr: number; idr_h: number; gidr: number};
const D = WK as Row[];
const PEAK_I = D.findIndex((r) => r.date === '2026-01-26');
const LAST = D.length - 1;

const T: React.FC<{s?: number; c?: string; w?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({s = 46, c = W.ink, w = 700, children, style}) => (
	<div style={{fontFamily: HAND, fontWeight: w, fontSize: s, color: c, lineHeight: 1.15, ...style}}>{children}</div>
);
const M: React.FC<{s?: number; c?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({s = 56, c = W.ink, children, style}) => (
	<div style={{fontFamily: MARK, fontSize: s, color: c, lineHeight: 1.1, ...style}}>{children}</div>
);
const Abs: React.FC<{x: number; y: number; w?: number; children: React.ReactNode}> = ({x, y, w, children}) => <div style={{position: 'absolute', left: x, top: y, width: w}}>{children}</div>;
const Src: React.FC<{children: React.ReactNode; x?: number; y?: number}> = ({children, x = 110, y = 1040}) => (
	<Abs x={x} y={y}>
		<div style={{fontFamily: SANSB, fontSize: 22, color: W.grey}}>{children}</div>
	</Abs>
);
const Contoh: React.FC<{x?: number; y?: number; label?: string}> = ({x = 1380, y = 190, label = 'CONTOH SIMULASI'}) => (
	<Abs x={x} y={y}>
		<Tag color={W.red}>{label}</Tag>
	</Abs>
);
const rp = (v: number) => 'Rp' + Math.round(v).toLocaleString('id-ID');
const num = (v: number, d = 0) => v.toLocaleString('id-ID', {minimumFractionDigits: d, maximumFractionDigits: d});

// count-up number
const Count: React.FC<{at: number; to: number; from?: number; fmt: (v: number) => string; dur?: number}> = ({at, to, from = 0, fmt, dur = 24}) => {
	const f = useCurrentFrame();
	const p = prog(f, at, dur);
	return <>{fmt(from + (to - from) * p)}</>;
};

// sketch line chart (stroke reveal), values -> path
const linePath = (vals: number[], x0: number, y0: number, w: number, h: number, lo: number, hi: number) =>
	vals.map((v, i) => `${i ? 'L' : 'M'} ${(x0 + (w * i) / (vals.length - 1)).toFixed(1)} ${(y0 + h - ((v - lo) / (hi - lo)) * h).toFixed(1)}`).join(' ');
const pt = (i: number, v: number, n: number, x0: number, y0: number, w: number, h: number, lo: number, hi: number) => [x0 + (w * i) / (n - 1), y0 + h - ((v - lo) / (hi - lo)) * h];

const Axis: React.FC<{x0: number; y0: number; w: number; h: number; at: number; ticks: [number, string][]; lo: number; hi: number}> = ({x0, y0, w, h, at, ticks, lo, hi}) => {
	const f = useCurrentFrame();
	const o = prog(f, at, 10);
	return (
		<>
			<Stroke d={`M ${x0} ${y0} L ${x0} ${y0 + h} L ${x0 + w} ${y0 + h}`} at={at} color={W.ink} width={4} />
			{ticks.map(([v, l]) => (
				<div key={l} style={{position: 'absolute', left: x0 - 150, width: 138, textAlign: 'right', top: y0 + h - ((v - lo) / (hi - lo)) * h - 18, fontFamily: HAND, fontWeight: 700, fontSize: 30, color: W.grey, opacity: o}}>{l}</div>
			))}
		</>
	);
};
const XLabels: React.FC<{x0: number; y: number; w: number; at: number}> = ({x0, y, w, at}) => {
	const f = useCurrentFrame();
	const marks = ['2025-06-02', '2025-10-06', '2026-01-26', '2026-06-01', '2026-11-23'];
	return (
		<>
			{marks.map((m) => {
				const i = D.findIndex((r) => r.date === m);
				if (i < 0) return null;
				const lab = ['Jun 25', 'Okt 25', 'Jan 26', 'Jun 26', 'Nov 26'][marks.indexOf(m)];
				return (
					<div key={m} style={{position: 'absolute', left: x0 + (w * i) / LAST - 50, width: 100, textAlign: 'center', top: y, fontFamily: HAND, fontWeight: 700, fontSize: 30, color: W.grey, opacity: prog(f, at, 10)}}>{lab}</div>
				);
			})}
		</>
	);
};
const Dot: React.FC<{x: number; y: number; at: number; c?: string}> = ({x, y, at, c = W.red}) => (
	<div style={{position: 'absolute', left: x - 13, top: y - 13}}>
		<Pop at={at}>
			<div style={{width: 26, height: 26, borderRadius: 13, background: c, border: `4px solid ${W.ink}`}} />
		</Pop>
	</div>
);

// ================= HOOK =================
const Hook: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const card = b(4);
	const z = interpolate(f, [0, card], [1, 1.07], {extrapolateRight: 'clamp'});
	const fade = interpolate(f, [card - 8, card], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const shake = f < b(3) + 6 && f > b(3) - 2 ? Math.sin(f * 2.4) * 6 : 0;
	return (
		<AbsoluteFill>
			<Board dur={dur} zoom={[b(6), 1.05, 700, 300]}>
				<Title at={card + 4} sub="dua bantalan harga emas lo">ADA 2 HAL YANG NAMBAL</Title>
				<Note at={b(5)} x={130} y={340} w={560} rot={-2}>
					<span style={{color: W.blue}}>#1</span> gampang ditebak
				</Note>
				<Note at={b(6)} x={760} y={360} w={600} color="#FFD9D9" rot={1.5}>
					<span style={{color: W.red}}>#2</span> jarang dibahas, paling kerasa pas lo <Hi at={b(6) + 30}>JUAL</Hi>
				</Note>
				<Abs x={130} y={640} w={1200}>
					<div style={{display: 'flex', gap: 22, flexWrap: 'wrap'}}>
						{['RUMUSNYA', 'ITUNGANNYA', 'DOMPET SIAPA YANG RUGI'].map((t, i) => (
							<Pop key={t} at={b(7) + 10 + i * 26}>
								<Tag color={[W.blue, W.orange, W.red][i]} style={{fontSize: 36}}>{`${i + 1}. ${t}`}</Tag>
							</Pop>
						))}
					</div>
				</Abs>
			</Board>
			{fade > 0 && (
				<AbsoluteFill style={{opacity: fade, background: 'radial-gradient(ellipse at 50% 35%, #2b2f3a 0%, #0b0d12 70%)'}}>
					<AbsoluteFill style={{transform: `scale(${z}) translateX(${shake}px)`, transformOrigin: '50% 35%'}}>
						<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 60%, rgba(255,200,80,0.18), transparent 50%)'}} />
						<div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: SANSB, fontWeight: 900, fontSize: 132, color: '#fff', lineHeight: 1.0, letterSpacing: -2, textShadow: '0 8px 30px rgba(0,0,0,0.6)'}}>
							<div>
								EMAS DUNIA <span style={{color: W.gold}}>−36%</span>
							</div>
							<div style={{marginTop: 18}}>
								ANTAM LO CUMA <span style={{color: W.gold}}>−21%</span>?
							</div>
						</div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 500, textAlign: 'center', opacity: prog(f, b(1), 10), fontFamily: SANSB, fontWeight: 800, fontSize: 58, color: 'rgba(255,255,255,0.85)'}}>
							Kabar baik? <span style={{color: W.gold, opacity: prog(f, b(3), 6)}}>PADAHAL BUKAN.</span>
						</div>
						<div style={{position: 'absolute', left: 0, right: 0, top: 600, textAlign: 'center', fontFamily: HAND, fontWeight: 700, fontSize: 34, color: 'rgba(255,255,255,0.55)'}}>
							XAUUSD: high minggu 26 Jan 2026 → 27 Nov 2026 (TradingView) · Antam: 29 Jan vs 26 Nov 2026 (Logam Mulia)
						</div>
					</AbsoluteFill>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// ================= SCENE (metaphor: gold shop) =================
const SceneM: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const kb = interpolate(f, [0, dur], [1.04, 1.16]);
	const pan = interpolate(f, [0, dur], [0, -60]);
	const Price: React.FC<{at: number; x: number; y: number; top: string; big: string; c?: string}> = ({at, x, y, top, big, c = '#fff'}) => (
		<div style={{position: 'absolute', left: x, top: y}}>
			<Pop at={at}>
				<div style={{background: 'rgba(10,12,18,0.82)', border: '3px solid rgba(255,216,77,0.8)', borderRadius: 18, padding: '18px 30px', boxShadow: '0 12px 40px rgba(0,0,0,0.5)'}}>
					<div style={{fontFamily: SANSB, fontWeight: 700, fontSize: 32, color: 'rgba(255,255,255,0.75)'}}>{top}</div>
					<div style={{fontFamily: SANSB, fontWeight: 900, fontSize: 72, color: c, letterSpacing: -1}}>{big}</div>
				</div>
			</Pop>
		</div>
	);
	return (
		<AbsoluteFill style={{background: '#0b0d12', overflow: 'hidden'}}>
			<Img src={staticFile('scene/gold_shop.png')} style={{position: 'absolute', width: 1920, height: 1080, objectFit: 'cover', transform: `scale(${kb}) translateX(${pan}px)`, transformOrigin: '40% 50%'}} />
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.45) 100%)'}} />
			<Price at={b(1) + 10} x={110} y={150} top="Rekor Antam · 29 Jan 2026" big="Rp3.168.000/g" />
			<Price at={b(2)} x={110} y={360} top="Harga jual · 26 Nov 2026" big="Rp2.501.000/g" />
			<div style={{position: 'absolute', left: 760, top: 380}}>
				<Pop at={b(3)}>
					<div style={{fontFamily: SANSB, fontWeight: 900, fontSize: 120, color: W.gold, textShadow: '0 6px 24px rgba(0,0,0,0.7)'}}>−21%</div>
				</Pop>
			</div>
			<Price at={b(5)} x={110} y={580} top="Emas dunia (XAUUSD) dari puncak" big="−36%" c="#FF6B6B" />
			<div style={{position: 'absolute', left: 620, top: 600}}>
				<Pop at={b(6)}>
					<div style={{fontFamily: MARK, fontSize: 84, color: '#fff', textShadow: '0 6px 24px rgba(0,0,0,0.8)'}}>
						SELISIH <span style={{color: W.gold}}>15%</span> DARI MANA?
					</div>
				</Pop>
			</div>
		</AbsoluteFill>
	);
};

// ================= MAP =================
const MapS: React.FC<SP> = ({b, dur}) => {
	const items: [string, string][] = [
		['1', 'Rumus harga emas lo'],
		['2', 'Bantalan #1: rupiah rekor terlemah'],
		['3', 'Bantalan #2: selisih jual vs buyback'],
		['4', 'Simulasi Rp100 juta, 3 dompet'],
	];
	return (
		<Board dur={dur} zoom={[b(5), 1.05, 400, 300]}>
			<Title at={4}>4 BAGIAN</Title>
			{items.map(([n, t], i) => (
				<Abs key={n} x={150} y={280 + i * 125}>
					<Write at={b(i + 1)} dur={14}>
						<M s={58}>
							<span style={{color: [W.blue, W.orange, W.red, W.green][i]}}>{n}.</span> {t}
						</M>
					</Write>
				</Abs>
			))}
			<Note at={b(5)} x={150} y={790} w={760} color="#DDEBFF" rot={-1}>
				+ bonus: XAUUSD buat yang trading
			</Note>
		</Board>
	);
};

// ================= FORMULA =================
const Formula: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const Box: React.FC<{at: number; x: number; c: string; top: string; sub: string; w: number}> = ({at, x, c, top, sub, w}) => (
		<Abs x={x} y={330} w={w}>
			<Pop at={at}>
				<div style={{border: `5px solid ${c}`, borderRadius: 16, padding: '18px 14px', textAlign: 'center', background: '#fff'}}>
					<M s={50} c={c}>{top}</M>
					<T s={34} c={W.grey}>{sub}</T>
				</div>
			</Pop>
		</Abs>
	);
	const Op: React.FC<{at: number; x: number; s: string}> = ({at, x, s}) => (
		<Abs x={x} y={360}>
			<Pop at={at}>
				<M s={90}>{s}</M>
			</Pop>
		</Abs>
	);
	return (
		<Board dur={dur} zoom={f < b(5) ? undefined : [b(5), 1.05, 700, 300]}>
			<Title at={4} sub="rumus kasar, sebelum ongkos cetak, margin & pajak">HARGA EMAS LO = ?</Title>
			<Box at={b(2)} x={110} c={W.orange} top="EMAS DUNIA" sub="$ per troy ounce" w={360} />
			<Op at={b(2) + 40} x={500} s="×" />
			<Box at={b(2) + 60} x={590} c={W.blue} top="KURS" sub="Rp per $1" w={300} />
			<Op at={b(2) + 100} x={920} s="÷" />
			<Box at={b(3)} x={1010} c={W.ink} top="31,1" sub="1 troy oz ≈ 31,1 gram" w={330} />
			<Abs x={110} y={560}>
				<Write at={b(4)}>
					<M s={54}>
						= <Hi at={b(4) + 20}>EMAS MENTAH Rp / GRAM</Hi>
					</M>
				</Write>
			</Abs>
			<Abs x={110} y={680}>
				<Write at={b(6)}>
					<T s={52}>
						⚙ Mesin 1: <span style={{color: W.orange}}>emas dunia</span>
					</T>
				</Write>
			</Abs>
			<Abs x={640} y={680}>
				<Write at={b(7)}>
					<T s={52}>
						⚙ Mesin 2: <span style={{color: W.blue}}>kurs rupiah</span>
					</T>
				</Write>
			</Abs>
			<Abs x={110} y={770} w={1250}>
				<Write at={b(8)}>
					<T s={46} c={W.red}>emas dunia turun + rupiah melemah = dua mesin saling ngerem</T>
				</Write>
			</Abs>
			<Stroke d={underD(110, 835, 1150)} at={b(9)} color={W.yellow} width={18} />
		</Board>
	);
};

// ================= CHART: XAUUSD $ vs gold Rp/gram =================
const ChartS: React.FC<SP> = ({b, dur}) => {
	const x0 = 290, w = 1060;
	const xau = D.map((r) => r.xau), gidr = D.map((r) => r.gidr);
	const top = {y0: 230, h: 250, lo: 3000, hi: 5800};
	const bot = {y0: 560, h: 250, lo: 1700000, hi: 3200000};
	const [px, py] = pt(PEAK_I, D[PEAK_I].xau_h, D.length, x0, top.y0, w, top.h, top.lo, top.hi);
	const [nx, ny] = pt(LAST, D[LAST].xau, D.length, x0, top.y0, w, top.h, top.lo, top.hi);
	const gPeak = (D[PEAK_I].xau_h * D[PEAK_I].idr) / 31.1035;
	const [gx, gy] = pt(PEAK_I, gPeak, D.length, x0, bot.y0, w, bot.h, bot.lo, bot.hi);
	const [gnx, gny] = pt(LAST, D[LAST].gidr, D.length, x0, bot.y0, w, bot.h, bot.lo, bot.hi);
	const zoom: [number, number, number, number] = [b(5), 1.04, 960, 200];
	return (
		<Board dur={dur} zoom={zoom}>
			<Title at={4}>EMAS DUNIA vs EMAS RUPIAH</Title>
			<Axis x0={x0} y0={top.y0} w={w} h={top.h} at={b(1)} lo={top.lo} hi={top.hi} ticks={[[3000, '$3.000'], [4500, '$4.500'], [5600, '$5.600']]} />
			<Stroke d={linePath(xau, x0, top.y0, w, top.h, top.lo, top.hi)} at={b(1) + 10} dur={50} color={W.orange} width={6} />
			<Abs x={x0 + 20} y={top.y0 - 10}>
				<T s={36} c={W.orange}>XAUUSD ($/oz)</T>
			</Abs>
			<Dot x={px} y={py} at={b(2)} />
			<Abs x={px - 40} y={py - 70}>
				<Write at={b(2) + 6}>
					<T s={38} c={W.red}>high 26 Jan: $5.602</T>
				</Write>
			</Abs>
			<Dot x={nx} y={ny} at={b(3)} />
			<Abs x={nx - 260} y={ny + 18}>
				<Write at={b(3) + 6}>
					<T s={38} c={W.red}>sekarang ±$3.579</T>
				</Write>
			</Abs>
			<Abs x={1380} y={290}>
				<Pop at={b(4)}>
					<M s={110} c={W.red}>−36%</M>
				</Pop>
			</Abs>
			<Axis x0={x0} y0={bot.y0} w={w} h={bot.h} at={b(5)} lo={bot.lo} hi={bot.hi} ticks={[[1800000, 'Rp1,8 jt'], [2500000, 'Rp2,5 jt'], [3100000, 'Rp3,1 jt']]} />
			<Stroke d={linePath(gidr, x0, bot.y0, w, bot.h, bot.lo, bot.hi)} at={b(5) + 10} dur={50} color={W.blue} width={6} />
			<Abs x={x0 + 20} y={bot.y0 - 10}>
				<T s={36} c={W.blue}>emas Rp/gram = XAU × kurs ÷ 31,1</T>
			</Abs>
			<Dot x={gx} y={gy} at={b(6)} c={W.blue} />
			<Abs x={gx + 24} y={gy - 30}>
				<Write at={b(6) + 4}>
					<T s={36} c={W.blue}>±Rp3,02 jt</T>
				</Write>
			</Abs>
			<Dot x={gnx} y={gny} at={b(6) + 30} c={W.blue} />
			<Abs x={gnx - 250} y={gny + 16}>
				<Write at={b(6) + 34}>
					<T s={36} c={W.blue}>±Rp2,11 jt</T>
				</Write>
			</Abs>
			<Abs x={1380} y={620}>
				<Pop at={b(7)}>
					<M s={110} c={W.blue}>−30%</M>
				</Pop>
			</Abs>
			<Note at={b(8)} x={1370} y={430} w={300} color="#FFF3A8" rot={3}>
				beda <b style={{color: W.red}}>6%</b>
			</Note>
			<XLabels x0={x0} y={bot.y0 + bot.h + 8} w={w} at={b(5)} />
			<Abs x={110} y={160}>
				<Write at={b(9)}>
					<T s={0}> </T>
				</Write>
			</Abs>
			<Abs x={700} y={140}>
				<Pop at={b(10)}>
					<Tag color={W.red} style={{fontSize: 34}}>KARENA DOLARNYA MAKIN MAHAL</Tag>
				</Pop>
			</Abs>
			<Src>Data asli OANDA:XAUUSD & FX_IDC:USDIDR · 1W · Jun 2025–27 Nov 2026 · TradingView (garis = close mingguan; puncak = high minggu 26 Jan)</Src>
		</Board>
	);
};

// ================= RUPIAH =================
const Rupiah: React.FC<SP> = ({b, dur}) => {
	const x0 = 290, w = 900, y0 = 260, h = 470, lo = 16000, hi = 18600;
	const idr = D.map((r) => r.idr);
	const [px, py] = pt(PEAK_I, D[PEAK_I].idr, D.length, x0, y0, w, h, lo, hi);
	const [nx, ny] = pt(LAST, D[LAST].idr, D.length, x0, y0, w, h, lo, hi);
	return (
		<Board dur={dur} zoom={[b(5), 1.04, 960, 300]}>
			<Title at={4} sub="USD/IDR, makin tinggi = rupiah makin lemah">BANTALAN #1: RUPIAH</Title>
			<Axis x0={x0} y0={y0} w={w} h={h} at={b(1)} lo={lo} hi={hi} ticks={[[16200, '16.200'], [17200, '17.200'], [18300, '18.300']]} />
			<Stroke d={linePath(idr, x0, y0, w, h, lo, hi)} at={b(1) + 6} dur={45} color={W.red} width={6} />
			<XLabels x0={x0} y={y0 + h + 8} w={w} at={b(1)} />
			<Dot x={nx} y={ny} at={b(1) + 50} />
			<Abs x={1240} y={250} w={560}>
				<Pop at={b(1) + 60}>
					<div style={{border: `5px solid ${W.red}`, borderRadius: 16, padding: '14px 22px', background: '#fff'}}>
						<T s={36} c={W.grey}>Kamis 26 Nov 2026</T>
						<M s={52}>close 18.335</M>
						<M s={44} c={W.red}>intraday 18.395</M>
					</div>
				</Pop>
			</Abs>
			<Abs x={1240} y={455} w={560}>
				<Pop at={b(2)}>
					<Tag color={W.red} style={{fontSize: 34}}>REKOR TERLEMAH</Tag>
				</Pop>
				<Write at={b(3)}>
					<T s={40} style={{marginTop: 8}}>YTD rupiah melemah ±10%</T>
				</Write>
			</Abs>
			<Dot x={px} y={py} at={b(4)} c={W.blue} />
			<Abs x={px - 140} y={py + 20}>
				<Write at={b(4) + 6}>
					<T s={36} c={W.blue}>saat emas puncak ±16.800</T>
				</Write>
			</Abs>
			<Note at={b(5)} x={1150} y={585} w={400} color="#DDEBFF" rot={-2}>
				kurs diam di 16.800 → emas mentah ±Rp1.932.000/g
			</Note>
			<Abs x={290} y={800} w={950}>
				<Pop at={b(6)}>
					<div style={{display: 'inline-block', background: W.yellow, border: `4px solid ${W.ink}`, borderRadius: 14, padding: '10px 24px'}}>
						<M s={50}>rupiah nambal ±Rp174.000 / gram</M>
					</div>
				</Pop>
			</Abs>
			<Src>Kurs: FX_IDC:USDIDR 1W (TradingView) · rekor 26/11: fxstreet-id/ANTARA, Refinitiv via monitorindonesia</Src>
		</Board>
	);
};

// ================= WHY =================
const Why: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const C: React.FC<{at: number; x: number; n: string; t: string; sub: string; c: string}> = ({at, x, n, t, sub, c}) => (
		<Abs x={x} y={270} w={400}>
			<Pop at={at}>
				<div style={{border: `5px solid ${c}`, borderRadius: 18, padding: '18px 20px', background: '#fff', minHeight: 250}}>
					<M s={44} c={c}>{n}</M>
					<T s={44}>{t}</T>
					<T s={32} c={W.grey} style={{marginTop: 8}}>{sub}</T>
				</div>
			</Pop>
		</Abs>
	);
	return (
		<Board dur={dur} zoom={f < b(10) ? [b(3), 1.04, 300, 400] : [b(10), 1.06, 700, 400]}>
			<Title at={4} sub="menurut Bank Indonesia">KENAPA RUPIAH SEGINI?</Title>
			<C at={b(2)} x={110} n="1" t="Dolar menguat" sub="inflasi AS naik lagi" c={W.orange} />
			<Abs x={150} y={560}>
				<Pop at={b(4)}>
					<div style={{background: W.dark, color: '#fff', borderRadius: 14, padding: '10px 22px', fontFamily: SANSB, fontWeight: 900, fontSize: 40}}>
						Fed naik Des: <span style={{color: W.gold}}>96%</span>
					</div>
				</Pop>
				<Write at={b(4) + 20}>
					<T s={28} c={W.grey}>CME FedWatch per 25/11</T>
				</Write>
			</Abs>
			<Abs x={110} y={690} w={420}>
				<Write at={b(6)}>
					<T s={34}>bunga AS ↑ → pegang $ → $ ↑ vs Rp</T>
				</Write>
			</Abs>
			<Stroke d={arrowD(520, 400, 600, 400)} at={b(7)} color={W.ink} width={5} />
			<C at={b(7)} x={610} n="2" t="Usulan MSCI" sub="turunkan status pasar saham RI → dana asing keluar" c={W.red} />
			<Stroke d={arrowD(1020, 400, 1100, 400)} at={b(8)} color={W.ink} width={5} />
			<C at={b(8)} x={1110} n="3" t="Butuh $ akhir bulan" sub="permintaan valas korporasi" c={W.blue} />
			<Abs x={610} y={600} w={760}>
				<Pop at={b(9)}>
					<div style={{border: `5px solid ${W.green}`, borderRadius: 16, padding: '12px 22px', background: '#fff'}}>
						<M s={48} c={W.green}>BI Rate → 6,00%</M>
						<T s={32} c={W.grey}>RDG 17–18 Nov 2026 · naik 25 bps · jaga stabilitas rupiah</T>
					</div>
				</Pop>
			</Abs>
			<Abs x={610} y={790} w={900}>
				<Write at={b(11)}>
					<M s={46} c={W.red}>
						Emas lo kelihatan aman karena <Hi at={b(11) + 24}>rupiah lo lagi sakit</Hi>
					</M>
				</Write>
			</Abs>
			<Src>Sumber: BI via ANTARA/fxstreet-id 26/11, Bisnis.com 18/11 (BI Rate), CME FedWatch via CNBC 25/11</Src>
		</Board>
	);
};

// ================= WHO PAYS =================
const Who: React.FC<SP> = ({b, dur}) => {
	const rows: [number, string, string, string][] = [
		[2, '💰', 'Tabungan Rp100 jt', 'nilai dalam $ turun ±8% sejak akhir Jan'],
		[3, '📦', 'Barang berkomponen impor', 'berpotensi ikut naik harga'],
		[4, '🏠', 'Kredit bunga mengambang', 'bisa ikut naik (cek kontrak & bank lo)'],
	];
	return (
		<Board dur={dur} zoom={[b(6), 1.05, 500, 300]}>
			<Title at={4}>SIAPA YANG BAYAR? LO.</Title>
			{rows.map(([k, ic, t, s], i) => (
				<Abs key={t} x={130} y={280 + i * 160} w={1200}>
					<Write at={b(k)} dur={16}>
						<div style={{display: 'flex', alignItems: 'center', gap: 26}}>
							<div style={{fontSize: 70}}>{ic}</div>
							<div>
								<M s={50}>{t}</M>
								<T s={40} c={W.red}>{s}</T>
							</div>
						</div>
					</Write>
				</Abs>
			))}
			<Abs x={130} y={780} w={1200}>
				<Write at={b(6)}>
					<M s={50}>
						Emas lo nggak menang. Cuma <Hi at={b(7)}>kalah lebih pelan</Hi>.
					</M>
				</Write>
			</Abs>
			<Src>±8%: 16.791 → 18.335 per $ (TradingView 1W, close 26/11). Dampak kredit tergantung kebijakan tiap bank.</Src>
		</Board>
	);
};

// ================= SPREAD (bars) =================
const Spread: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const sc = 380 / 3200000;
	const Bar: React.FC<{x: number; v: number; c: string; at: number; lab: string}> = ({x, v, c, at, lab}) => {
		const p = prog(f, at, 20);
		const h = v * sc * p;
		if (p <= 0) return null;
		return (
			<>
				<div style={{position: 'absolute', left: x, top: 800 - h, width: 120, height: h, background: c, border: `4px solid ${W.ink}`, borderRadius: 8, opacity: 0.9}} />
				<div style={{position: 'absolute', left: x - 50, width: 220, textAlign: 'center', top: 800 - h - 52, fontFamily: MARK, fontSize: 34, color: W.ink, opacity: p}}>{rp(v).replace('Rp', '')}</div>
				<div style={{position: 'absolute', left: x - 40, width: 200, textAlign: 'center', top: 812, fontFamily: HAND, fontWeight: 700, fontSize: 34, color: W.grey, opacity: p}}>{lab}</div>
			</>
		);
	};
	return (
		<Board dur={dur} zoom={[b(7), 1.04, 400, 300]}>
			<Title at={4} sub="harga jual (lo beli) vs buyback (lo jual balik)">BANTALAN #2: SPREAD</Title>
			<Abs x={760} y={250}>
				<Write at={b(2)}>
					<T s={40}>26 Nov 2026 · per gram</T>
				</Write>
			</Abs>
			<Bar x={780} v={2501000} c={W.orange} at={b(2)} lab="jual" />
			<Bar x={960} v={2111000} c={W.blue} at={b(4)} lab="buyback" />
			<Abs x={1130} y={430} w={260}>
				<Pop at={b(5)}>
					<M s={48} c={W.red}>Rp390rb</M>
					<T s={38} c={W.red}>±16% harga beli</T>
				</Pop>
			</Abs>
			<Abs x={150} y={250}>
				<Write at={b(7)}>
					<T s={40}>29 Jan 2026 (rekor)</T>
				</Write>
			</Abs>
			<Bar x={170} v={3168000} c={W.orange} at={b(8)} lab="jual" />
			<Bar x={350} v={2989000} c={W.blue} at={b(8) + 40} lab="buyback" />
			<Abs x={500} y={330} w={260}>
				<Pop at={b(9)}>
					<M s={48} c={W.green}>Rp179rb</M>
					<T s={38} c={W.green}>±6%</T>
				</Pop>
			</Abs>
			<Stroke d={arrowD(560, 470, 1110, 470)} at={b(9) + 20} color={W.red} width={5} dash />
			<Src>Harga & buyback Antam 1 g: Logam Mulia via Liputan6/SWA (29 Jan), Antara/IDN Times/Liputan6 (26 Nov 2026)</Src>
		</Board>
	);
};

// ================= SPREAD2 (% drops) =================
const Spread2: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const items: [number, string, number, string][] = [
		[1, 'Harga jual Antam', 21, W.orange],
		[2, 'Buyback Antam', 29, W.blue],
		[3, 'Emas mentah Rp/g (rumus)', 30, W.ink],
	];
	return (
		<Board dur={dur} zoom={[b(4), 1.06, 700, 400]}>
			<Title at={4} sub="turun dari puncak 29 Jan 2026 / minggu 26 Jan">ANGKA YANG MASUK KANTONG</Title>
			{items.map(([k, lab, v, c], i) => {
				const p = prog(f, b(k), 22);
				return (
					<Abs key={lab} x={130} y={290 + i * 150} w={1300}>
						<T s={44}>{lab}</T>
						<div style={{display: 'flex', alignItems: 'center', gap: 20}}>
							<div style={{height: 54, width: v * 30 * p, background: c, border: `4px solid ${W.ink}`, borderRadius: 8, opacity: 0.85}} />
							<M s={56} c={c}>−{Math.round(v * p)}%</M>
						</div>
					</Abs>
				);
			})}
			<Note at={b(4)} x={1080} y={300} w={460} color="#FFD9D9" rot={2}>
				−21% = angka buat yang mau BELI
			</Note>
			<Note at={b(6)} x={1080} y={520} w={460} color="#DDEBFF" rot={-2}>
				pemilik emas: −29%
			</Note>
			<Abs x={130} y={790}>
				<Write at={b(7)}>
					<M s={50}>
						Bantalan #2: <Hi at={b(8)}>kerasa pas lo JUAL</Hi>
					</M>
				</Write>
			</Abs>
		</Board>
	);
};

// ================= SIM (setup) =================
const Wallet: React.FC<{at: number; x: number; c: string; who: string; what: string; val: React.ReactNode}> = ({at, x, c, who, what, val}) => (
	<Abs x={x} y={300} w={400}>
		<Pop at={at}>
			<div style={{border: `5px solid ${c}`, borderRadius: 20, padding: '20px 22px', background: '#fff', minHeight: 320}}>
				<M s={46} c={c}>{who}</M>
				<T s={40} c={W.grey}>{what}</T>
				<div style={{marginTop: 18, fontFamily: MARK, fontSize: 52, color: W.ink}}>{val}</div>
			</div>
		</Pop>
	</Abs>
);
const Sim: React.FC<SP> = ({b, dur}) => (
	<Board dur={dur} zoom={[b(5), 1.04, 900, 250]}>
		<Title at={4} sub="29 Jan 2026 · masing-masing Rp100 juta">3 DOMPET</Title>
		<Contoh />
		<Wallet at={b(3)} x={110} c={W.orange} who="Orang 1" what="beli Antam Rp3.168.000/g" val={<Count at={b(3) + 6} dur={Math.max(20, b(4) - b(3))} to={31.57} fmt={(v) => num(v, 1) + ' gram'} />} />
		<Wallet at={b(5)} x={560} c={W.green} who="Orang 2" what="tukar $ di kurs ±16.800" val={<Count at={b(5) + 6} dur={Math.max(20, b(6) - b(5))} to={5956} fmt={(v) => '$' + num(v)} />} />
		<Wallet at={b(7)} x={1010} c={W.blue} who="Orang 3" what="simpan rupiah" val="Rp100 juta" />
		<Src>Ilustrasi data publik, bukan saran. Kurs ±16.791 (USDIDR 1W, minggu 26 Jan 2026, TradingView).</Src>
	</Board>
);
const Sim2: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	return (
		<Board dur={dur} zoom={f < b(6) ? [b(3), 1.03, 900, 200] : [b(6), 1.05, 900, 250]}>
			<Title at={4} sub="hari ini (buyback 26 Nov, kurs 18.335)">HASILNYA</Title>
			<Contoh />
			<Wallet at={6} x={110} c={W.orange} who="Orang 1" what="jual di buyback Rp2.111.000" val={<><Count at={b(1)} from={100} to={66.6} fmt={(v) => 'Rp' + num(v, 1) + ' jt'} /><div style={{color: W.red, fontSize: 46, opacity: prog(f, b(2), 8)}}>−33%</div></>} />
			<Wallet at={b(3)} x={560} c={W.green} who="Orang 2" what="tukar balik di 18.335" val={<Count at={b(4)} from={100} to={109.2} fmt={(v) => 'Rp' + num(v, 1) + ' jt'} />} />
			<Wallet at={b(5)} x={1010} c={W.blue} who="Orang 3" what="tetap Rp100 juta" val={<><span>Rp100 jt</span><div style={{color: W.red, fontSize: 40, opacity: prog(f, b(5) + 60, 8)}}>daya beli $ −8%</div></>} />
			<Abs x={110} y={700} w={1300}>
				<Write at={b(6)}>
					<T s={42}>orang 1 kena dua kali: emas dunia jatuh + selisih buyback</T>
				</Write>
			</Abs>
			<Abs x={110} y={780} w={1300}>
				<Write at={b(9)}>
					<M s={46}>
						Penentu: <Hi at={b(9) + 20}>harga masuk · kurs · biaya keluar</Hi>
					</M>
				</Write>
			</Abs>
			<Abs x={900} y={190}>
				<Pop at={b(7)}>
					<Tag color={W.grey} style={{fontSize: 30}}>periode lain bisa kebalik</Tag>
				</Pop>
			</Abs>
		</Board>
	);
};

// ================= XAU =================
const Xau: React.FC<SP> = ({b, dur}) => {
	const x0 = 290, w = 950, y0 = 260, h = 440, lo = 3000, hi = 5800;
	const xau = D.map((r) => r.xau);
	return (
		<Board dur={dur} zoom={[b(5), 1.05, 1400, 400]}>
			<Title at={4} sub="di chart XAUUSD rupiah nggak ada">BUAT TRADER XAUUSD</Title>
			<Abs x={1300} y={130}>
				<Pop at={b(1)}>
					<Tag color={W.red} style={{fontSize: 36}}>BUKAN SINYAL</Tag>
				</Pop>
			</Abs>
			<Axis x0={x0} y0={y0} w={w} h={h} at={b(1)} lo={lo} hi={hi} ticks={[[3000, '$3.000'], [4500, '$4.500'], [5600, '$5.600']]} />
			<Stroke d={linePath(xau, x0, y0, w, h, lo, hi)} at={b(1) + 8} dur={40} color={W.orange} width={6} />
			<XLabels x0={x0} y={y0 + h + 8} w={w} at={b(1)} />
			<Abs x={1290} y={270} w={520}>
				<Write at={b(3)}>
					<M s={46}>bantalan rupiah ✗</M>
				</Write>
				<Write at={b(4)}>
					<M s={46} c={W.red}>−36% ya −36%</M>
				</Write>
			</Abs>
			<Abs x={1290} y={420} w={520}>
				<Pop at={b(5)}>
					<div style={{border: `4px solid ${W.ink}`, borderRadius: 14, padding: '10px 18px', background: '#fff'}}>
						<T s={38}>penggerak: bunga Fed + dolar</T>
						<T s={32} c={W.grey}>emas tanpa bunga ↔ aset berbunga</T>
					</div>
				</Pop>
			</Abs>
			<Abs x={1290} y={600} w={520}>
				<Pop at={b(7)}>
					<Tag color={W.orange} style={{fontSize: 30}}>rilis PCE: gerak puluhan $</Tag>
				</Pop>
			</Abs>
			<Abs x={290} y={770} w={1050}>
				<Write at={b(9)}>
					<T s={40} c={W.red}>leverage? ukur risiko/transaksi · pasang SL · SL bisa slippage</T>
				</Write>
			</Abs>
			<Src>Data asli OANDA:XAUUSD · 1W · Jun 2025–27 Nov 2026 · TradingView</Src>
		</Board>
	);
};

// ================= MISTAKES =================
const Mistakes: React.FC<SP> = ({b, dur}) => {
	const items: [number, string, string][] = [
		[1, 'Ngukur pakai harga JUAL', 'yang lo terima = buyback'],
		[2, 'Ngira emas Indonesia aman', 'itu rupiah yang melemah, daya beli tetap kepotong'],
		[4, 'Emas fisik buat jangka pendek', 'buyback harus naik ±18% buat balik modal'],
	];
	return (
		<Board dur={dur} zoom={[b(5), 1.05, 700, 300]}>
			<Title at={4}>3 KESALAHAN UMUM</Title>
			{items.map(([k, t, s], i) => (
				<Abs key={t} x={130} y={270 + i * 180} w={1250}>
					<Write at={b(k)} dur={16}>
						<M s={52}>
							<span style={{color: W.red}}>✗ {i + 1}.</span> {t}
						</M>
					</Write>
					<Write at={b(k) + (i === 2 ? b(5) - b(4) : 30)} dur={16}>
						<T s={42} c={W.grey}>{s}</T>
					</Write>
				</Abs>
			))}
			<Note at={b(5) + 20} x={1050} y={720} w={460} color="#FFF3A8" rot={2}>
				2.501.000 ÷ 2.111.000 = +18,5%
			</Note>
		</Board>
	);
};

// ================= SUMMARY =================
const Summary: React.FC<SP> = ({b, dur}) => (
	<Board dur={dur} zoom={[b(5), 1.05, 600, 300]}>
		<Title at={4}>RANGKUMAN</Title>
		{[
			[1, 'Harga emas lo = emas dunia × kurs (2 mesin)'],
			[3, 'Antam −21% karena rupiah rekor terlemah'],
			[4, 'Pemilik emas lihat buyback: −29% dari puncak'],
		].map(([k, t], i) => (
			<Abs key={String(t)} x={130} y={270 + i * 130} w={1250}>
				<Write at={b(k as number)}>
					<M s={50}>
						<span style={{color: [W.blue, W.orange, W.red][i]}}>{i + 1}.</span> {t}
					</M>
				</Write>
			</Abs>
		))}
		<Abs x={130} y={700} w={1250}>
			<Pop at={b(5)}>
				<div style={{display: 'flex', gap: 20}}>
					{['HARGA DUNIA', 'KURS', 'SELISIH BUYBACK'].map((t, i) => (
						<div key={t} style={{background: W.yellow, border: `4px solid ${W.ink}`, borderRadius: 12, padding: '8px 18px', fontFamily: MARK, fontSize: 38}}>
							{i + 1}. {t}
						</div>
					))}
				</div>
			</Pop>
		</Abs>
	</Board>
);

// ================= DISCLAIMER =================
const Disclaimer: React.FC<SP> = ({b, dur}) => (
	<Board dur={dur}>
		<Abs x={150} y={330} w={1200}>
			<Write at={4}>
				<M s={62}>EDUKASI EKONOMI MAKRO</M>
			</Write>
			<Write at={b(0) + 30}>
				<T s={50} style={{marginTop: 20}}>bukan ajakan transaksi atau saran keuangan pribadi</T>
			</Write>
			<Write at={b(1)}>
				<T s={46} c={W.grey} style={{marginTop: 20}}>angka simulasi = ilustrasi · kinerja masa lalu bukan jaminan</T>
			</Write>
		</Abs>
	</Board>
);

// ================= CTA =================
const Cta: React.FC<SP> = ({b}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 75% 70%, #2a3140 0%, #0b0d12 60%)'}}>
			<div style={{position: 'absolute', right: 120, bottom: 0, width: 700, height: 900, background: 'radial-gradient(ellipse at 50% 100%, rgba(255,230,160,0.22), transparent 65%)'}} />
			<div style={{position: 'absolute', left: 120, top: 150}}>
				<div style={{opacity: prog(f, b(1), 8), fontFamily: SANSB, fontWeight: 900, fontSize: 88, color: '#fff', letterSpacing: -1}}>
					TIM <span style={{color: W.gold}}>EMAS</span> atau TIM <span style={{color: '#7FD1FF'}}>RUPIAH</span>?
				</div>
				<div style={{opacity: prog(f, b(2), 8), marginTop: 18, fontFamily: SANSB, fontWeight: 700, fontSize: 44, color: 'rgba(255,255,255,0.85)'}}>Rp100 juta hari ini lo taruh di mana? Tulis di komentar.</div>
				<div style={{opacity: prog(f, b(4), 10), marginTop: 70, fontFamily: SANSB, fontWeight: 900, fontSize: 72, color: '#fff'}}>JOIN KOMUNITAS TRADING</div>
				<div style={{opacity: prog(f, b(4) + 8, 10), fontFamily: SANSB, fontWeight: 900, fontSize: 110, color: W.gold, letterSpacing: -2}}>dhirajkelly.id</div>
				<div style={{opacity: prog(f, b(5), 10), marginTop: 26, display: 'inline-block', background: '#E62117', color: '#fff', fontFamily: SANSB, fontWeight: 800, fontSize: 42, padding: '10px 28px', borderRadius: 10}}>SUBSCRIBE · YouTube Doktor Trader</div>
			</div>
		</AbsoluteFill>
	);
};

export const SCENES: Record<string, React.FC<SP>> = {
	hook: Hook,
	scene: SceneM,
	map: MapS,
	formula: Formula,
	chart: ChartS,
	rupiah: Rupiah,
	why: Why,
	who: Who,
	spread: Spread,
	spread2: Spread2,
	sim: Sim,
	sim2: Sim2,
	xau: Xau,
	mistakes: Mistakes,
	summary: Summary,
	disclaimer: Disclaimer,
	cta: Cta,
};
void circleD;
