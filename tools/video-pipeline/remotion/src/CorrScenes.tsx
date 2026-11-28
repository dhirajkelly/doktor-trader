// Scenes for Academy "Risiko tersembunyi: posisi ganda dan korelasi" (Manajemen Risiko #13, format L whiteboard). b(k) = frame where sentence k starts.
// Data: ohlcv.json = OANDA:XAUUSD H1 (TradingView, 24–26 Nov 2026); fx.json = OANDA:EURUSD & OANDA:GBPUSD H4 closes (TradingView, 2–28 Nov 2026 WIB).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Board, HAND, Hi, MARK, Note, Pop, SANSB, Stroke, Tag, Title, W, Write, circleD, prog, underD} from './wb';
import D from './ohlcv.json';
import FX from './fx.json';

type SP = {b: (k: number) => number; dur: number};
const T: React.FC<{s?: number; c?: string; w?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({s = 46, c = W.ink, w = 700, children, style}) => (
	<div style={{fontFamily: HAND, fontWeight: w, fontSize: s, color: c, lineHeight: 1.15, ...style}}>{children}</div>
);
const M: React.FC<{s?: number; c?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({s = 56, c = W.ink, children, style}) => (
	<div style={{fontFamily: MARK, fontSize: s, color: c, lineHeight: 1.1, ...style}}>{children}</div>
);
const Abs: React.FC<{x: number; y: number; w?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, w, children, style}) => (
	<div style={{position: 'absolute', left: x, top: y, width: w, ...style}}>{children}</div>
);
const Ilus: React.FC<{x?: number; y?: number; label?: string}> = ({x = 1400, y = 120, label = 'CONTOH SIMULASI'}) => (
	<Abs x={x} y={y}>
		<Tag color={W.red} style={{fontSize: 30}}>{label}</Tag>
	</Abs>
);
const Stamp: React.FC<{at: number; color?: string; s?: number; rot?: number; children: React.ReactNode}> = ({at, color = W.red, s = 50, rot = -3, children}) => (
	<Pop at={at}>
		<div style={{display: 'inline-block', border: `6px solid ${color}`, color, fontFamily: MARK, fontSize: s, padding: '4px 22px', borderRadius: 10, background: '#fff', transform: `rotate(${rot}deg)`}}>{children}</div>
	</Pop>
);
const Box: React.FC<{color?: string; bg?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({color = W.ink, bg = '#fff', children, style}) => (
	<div style={{border: `5px solid ${color}`, borderRadius: 16, padding: '10px 20px', background: bg, display: 'inline-block', ...style}}>{children}</div>
);

// ---------- simulated positions on the real XAUUSD H1 chart (25 Nov 2026) ----------
// entries inside the real ranges: i16 (10:00 WIB, 3546.9–3561.0), i19 (13:00, 3512.6–3530.3), i24 (18:00, 3484.5–3532.5); common SL 3470 first touched at i26 (20:00, low 3467.435)
const POS = [
	{i: 16, e: 3550, lot: '0,01', dist: 80, risk: 80},
	{i: 19, e: 3520, lot: '0,02', dist: 50, risk: 100},
	{i: 24, e: 3490, lot: '0,05', dist: 20, risk: 100},
];
const SL = 3470;
const HIT = 26;
const hourOf = (i: number) => String(new Date((D.t[i] + 7 * 3600) * 1000).getUTCHours()).padStart(2, '0') + '.00';

type Geo = {x: number; y: number; w: number; h: number; pmin: number; pmax: number; i0: number; i1: number};
const XauChart: React.FC<{g: Geo; at: number; show: number[]; slAt?: number; hitAt?: number; label?: boolean; fs?: number}> = ({g, at, show, slAt, hitAt, label = true, fs = 30}) => {
	const f = useCurrentFrame();
	const n = g.i1 - g.i0 + 1;
	const px = (i: number) => g.x + ((i - g.i0 + 0.5) / n) * g.w;
	const py = (p: number) => g.y + ((g.pmax - p) / (g.pmax - g.pmin)) * g.h;
	const bw = (g.w / n) * 0.55;
	const ticks = [3450, 3500, 3550];
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<defs>
					<filter id="roughC">
						<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={7} />
						<feDisplacementMap in="SourceGraphic" scale={2.2} />
					</filter>
				</defs>
				<path d={`M ${g.x} ${g.y - 10} L ${g.x} ${g.y + g.h} L ${g.x + g.w} ${g.y + g.h}`} stroke={W.ink} strokeWidth={4} fill="none" filter="url(#roughC)" opacity={prog(f, at, 10)} />
				{ticks.map((p) => (
					<g key={p} opacity={prog(f, at + 6, 10)}>
						<line x1={g.x - 10} x2={g.x} y1={py(p)} y2={py(p)} stroke={W.ink} strokeWidth={3} />
						<text x={g.x - 16} y={py(p) + 10} textAnchor="end" fontFamily={HAND} fontWeight={700} fontSize={fs} fill={W.grey}>
							{p.toLocaleString('de-DE')}
						</text>
					</g>
				))}
				{[g.i0, Math.round((g.i0 + g.i1) / 2), g.i1].map((i) => (
					<text key={i} x={px(i)} y={g.y + g.h + fs + 8} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={fs} fill={W.grey} opacity={prog(f, at + 6, 10)}>
						{hourOf(i)}
					</text>
				))}
				<g filter="url(#roughC)">
					{Array.from({length: n}).map((_, k) => {
						const i = g.i0 + k;
						const o = D.o[i], h = D.h[i], l = D.l[i], c = D.c[i];
						const pp = prog(f, at + 8 + k * 3, 6);
						if (pp <= 0) return null;
						const yT = py(Math.max(o, c)), yB = py(Math.min(o, c));
						return (
							<g key={i} opacity={pp}>
								<line x1={px(i)} x2={px(i)} y1={py(h)} y2={py(l)} stroke={W.ink} strokeWidth={3} />
								<rect x={px(i) - bw / 2} y={yT} width={bw} height={Math.max(3, yB - yT)} fill={c >= o ? W.green : W.red} fillOpacity={0.8} stroke={W.ink} strokeWidth={3} />
							</g>
						);
					})}
				</g>
				{slAt !== undefined && (
					<g opacity={prog(f, slAt, 10)}>
						<line x1={px(POS[0].i) - 20} x2={g.x + g.w} y1={py(SL)} y2={py(SL)} stroke={W.red} strokeWidth={4} strokeDasharray="14 10" />
						<text x={px(POS[0].i) - 20} y={py(SL) - 12} fontFamily={MARK} fontSize={fs} fill={W.red} stroke="#FBFAF5" strokeWidth={8} paintOrder="stroke">
							SL 3.470 (semua)
						</text>
					</g>
				)}
				{POS.map((p, k) =>
					show[k] !== undefined ? (
						<g key={k} opacity={prog(f, show[k], 8)}>
							<line x1={px(p.i) - 30} x2={px(p.i) + 30} y1={py(p.e)} y2={py(p.e)} stroke={W.blue} strokeWidth={5} />
							<path d={`M ${px(p.i)} ${py(p.e) + 12} l -14 26 l 28 0 z`} fill={W.blue} />
							<text x={px(p.i) - 36} y={py(p.e) + 10} textAnchor="end" fontFamily={MARK} fontSize={fs} fill={W.blue} stroke="#FBFAF5" strokeWidth={9} paintOrder="stroke">
								BUY #{k + 1}
							</text>
						</g>
					) : null,
				)}
				{hitAt !== undefined && (
					<g opacity={prog(f, hitAt, 8)}>
						<circle cx={px(HIT)} cy={py(D.l[HIT])} r={34} fill="none" stroke={W.red} strokeWidth={6} />
						<text x={px(HIT) - 44} y={py(D.l[HIT]) + 60} textAnchor="end" fontFamily={MARK} fontSize={fs} fill={W.red} stroke="#FBFAF5" strokeWidth={9} paintOrder="stroke">
							20.00 · low 3.467
						</text>
					</g>
				)}
			</svg>
			{label && (
				<Abs x={g.x} y={g.y + g.h + fs + 24}>
					<T s={26} c={W.grey}>
						Data asli XAUUSD · H1 · 25 Nov 2026 WIB · TradingView (OANDA) · posisi = simulasi
					</T>
				</Abs>
			)}
		</>
	);
};

// ---------- HOOK ----------
const Hook: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const card = b(2);
	const z = interpolate(f, [0, card], [1, 1.07], {extrapolateRight: 'clamp'});
	const fade = interpolate(f, [card - 8, card], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const late = f >= b(12);
	const g: Geo = {x: 140, y: 290, w: 1000, h: 470, pmin: 3415, pmax: 3590, i0: 12, i1: 29};
	return (
		<AbsoluteFill>
			<Board dur={dur}>
				<Title sub="modal $10.000 · risiko 1% per posisi">3 POSISI, 1 TARUHAN</Title>
				<Ilus />
				{!late && (
					<>
						<XauChart g={g} at={b(4)} show={[b(5), b(6), b(7)]} slAt={b(8)} hitAt={b(9)} />
						<Abs x={1200} y={300} w={460}>
							{[0, 1, 2].map((k) => (
								<div key={k} style={{opacity: prog(f, [b(5), b(6), b(7)][k] + 10, 8), marginBottom: 10}}>
									<T s={40}>
										buy #{k + 1} · {POS[k].e.toLocaleString('de-DE')} · <span style={{color: W.blue}}>≤1%</span>
									</T>
								</div>
							))}
							<div style={{opacity: prog(f, b(10), 8), marginTop: 20}}>
								<M s={48} c={W.red}>
									3× SL KENA
								</M>
							</div>
							<div style={{marginTop: 16}}>
								<Stamp at={b(11)} s={64}>
									−$280
								</Stamp>
							</div>
						</Abs>
					</>
				)}
				{late && (
					<>
						<Note at={b(12)} x={140} y={300} w={700} color="#FFD6D6" rot={-1.5}>
							Dulu gue margin call: nambah posisi pas harga lawan arah, "tiap posisi kecil"
						</Note>
						<Abs x={940} y={300} w={560}>
							{['RISIKO YANG SEBENARNYA', 'BEDA NAMA, 1 TARUHAN', '1 BATAS SEDERHANA'].map((t, i) => (
								<div key={t} style={{marginBottom: 22}}>
									<Pop at={b(14) + 40 + i * 70}>
										<Tag color={[W.blue, W.orange, W.green][i]} style={{fontSize: 36}}>{`${i + 1}. ${t}`}</Tag>
									</Pop>
								</div>
							))}
						</Abs>
						<Abs x={140} y={640} w={1300}>
							<Write at={b(15)}>
								<M s={54}>
									disiplin 1%/trade, tapi bocor <Hi at={b(15) + 30} color="#FFB3B3">3×</Hi>
								</M>
							</Write>
						</Abs>
					</>
				)}
			</Board>
			{f < card && (
				<AbsoluteFill style={{opacity: fade, background: 'radial-gradient(ellipse at 60% 40%, #1d2433 0%, #0b0d12 70%)'}}>
					<div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '80px 80px', transform: `scale(${z})`}} />
					<div style={{position: 'absolute', left: 120, top: 190, transform: `scale(${z})`, transformOrigin: '0 0'}}>
						<div style={{fontFamily: SANSB, fontWeight: 900, fontSize: 104, color: '#fff', lineHeight: 1.04, letterSpacing: -2, textTransform: 'uppercase'}}>
							<div style={{opacity: prog(f, 0, 8)}}>3 posisi × 1%</div>
							<div style={{opacity: prog(f, b(1), 8)}}>
								= <span style={{color: '#FF5A5A'}}>−2,8%</span> dalam 1 jam?
							</div>
						</div>
						<div style={{marginTop: 40, display: 'flex', gap: 26, opacity: prog(f, b(1) + 30, 8)}}>
							<div style={{border: '3px solid rgba(255,255,255,0.8)', color: '#fff', fontFamily: SANSB, fontWeight: 800, fontSize: 44, padding: '8px 22px', borderRadius: 12}}>LOT-NYA NGGAK SALAH HITUNG</div>
							<div style={{color: W.gold, fontFamily: SANSB, fontWeight: 800, fontSize: 36, padding: '14px 0'}}>SIMULASI</div>
						</div>
					</div>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// ---------- MAP ----------
const MapS: React.FC<SP> = ({b, dur}) => {
	const items = ['Posisi ganda di satu pair ("averaging")', 'Korelasi: EURUSD + GBPUSD (data asli 4 minggu)', 'Cara ngitung total risiko terbuka + batasnya', '3 kesalahan yang bikin risiko numpuk'];
	const cols = [W.blue, W.orange, W.green, W.red];
	return (
		<Board dur={dur}>
			<Title sub="Academy Doktor Trader · Manajemen Risiko · materi 13">PETA VIDEO</Title>
			{items.map((t, i) => (
				<Abs key={t} x={140} y={300 + i * 120}>
					<Write at={b(i + 1)} dur={20}>
						<div style={{display: 'flex', alignItems: 'center', gap: 26}}>
							<div style={{width: 74, height: 74, borderRadius: 40, border: `5px solid ${cols[i]}`, fontFamily: MARK, fontSize: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cols[i]}}>{i + 1}</div>
							<T s={54}>{t}</T>
						</div>
					</Write>
				</Abs>
			))}
			<Abs x={1300} y={150}>
				<Pop at={b(0) + 30}>
					<Tag color={W.red} style={{fontSize: 30}}>POSISI & HITUNGAN = SIMULASI</Tag>
				</Pop>
			</Abs>
		</Board>
	);
};

// ---------- STACK: 3 buys, one SL ----------
const Stack: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const g: Geo = {x: 150, y: 260, w: 960, h: 520, pmin: 3415, pmax: 3590, i0: 12, i1: 29};
	const rows = [b(5), b(9), b(11)];
	const cmp = f >= b(19);
	return (
		<Board dur={dur}>
			<Title sub={"XAUUSD · H1 · 25 Nov 2026 · modal $10.000\u00a0\u00a0"}>POSISI GANDA</Title>
			<Ilus x={1420} y={120} />
			<XauChart g={g} at={b(1)} show={[b(3), b(7), b(10)]} slAt={b(3) + 20} hitAt={b(16)} />
			{/* distance bracket for buy #1 */}
			<Abs x={1170} y={212}>
				<Pop at={b(2)}>
					<Box color={W.blue}>
						<T s={36}>
							risiko 1% = <b>$100</b> / posisi
						</T>
					</Box>
				</Pop>
			</Abs>
			{!cmp && (
				<Abs x={1170} y={300} w={560}>
					<div style={{opacity: prog(f, b(4), 8)}}>
						<T s={34} c={W.grey}>
							0,01 lot = $1 per $1 gerak
						</T>
					</div>
					{POS.map((p, k) => (
						<div key={k} style={{opacity: prog(f, rows[k], 8), marginTop: 14, display: 'flex', alignItems: 'baseline', gap: 12}}>
							<M s={36} c={W.blue}>
								#{k + 1}
							</M>
							<T s={40}>
								{p.lot} lot × ${p.dist} = <b>${p.risk}</b>
							</T>
							<span style={{opacity: prog(f, b(13) + k * 10, 6), fontFamily: MARK, fontSize: 40, color: W.green}}>✓</span>
						</div>
					))}
					<div style={{opacity: prog(f, b(15), 10), marginTop: 18, borderTop: `4px solid ${W.ink}`, paddingTop: 10}}>
						<M s={52} c={W.red}>
							TOTAL $280 = 2,8%
						</M>
						<T s={34} c={W.grey}>
							1 arah · 1 instrumen · 1 SL
						</T>
					</div>
				</Abs>
			)}
			{!cmp && f >= b(17) && (
				<Note at={b(17)} x={1180} y={720} w={360} color="#FFF3A8" rot={2}>
					+ slippage kalau pasar cepat
				</Note>
			)}
			{cmp && (
				<Abs x={1170} y={300} w={560}>
					<Write at={b(19)}>
						<T s={38} c={W.grey}>
							analisa sama, salah sama:
						</T>
					</Write>
					<div style={{opacity: prog(f, b(20), 8), marginTop: 14}}>
						<Box color={W.green}>
							<T s={36}>1 posisi · 1%</T>
							<M s={56} c={W.green}>
								−$100
							</M>
						</Box>
					</div>
					<div style={{opacity: prog(f, b(21), 8), marginTop: 14}}>
						<Box color={W.red} bg="#FFE9E9">
							<T s={36}>3 posisi "kecil"</T>
							<M s={56} c={W.red}>
								−$280
							</M>
						</Box>
					</div>
					<div style={{marginTop: 26}}>
						<Stamp at={b(22)} s={40}>
							TANPA SL = TANPA REM
						</Stamp>
					</div>
				</Abs>
			)}
		</Board>
	);
};

// ---------- PAIR: EURUSD vs GBPUSD real H4 ----------
const N = FX.t.length;
const pe = FX.eur.map((v: number) => (v / FX.eur[0] - 1) * 100);
const pg = FX.gbp.map((v: number) => (v / FX.gbp[0] - 1) * 100);
const PMIN = Math.min(...pe, ...pg) - 0.2;
const PMAX = Math.max(...pe, ...pg) + 0.2;
const Pair: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const X = 160, Y = 250, Wd = 1060, H = 400;
	const px = (i: number) => X + (i / (N - 1)) * Wd;
	const py = (v: number) => Y + ((PMAX - v) / (PMAX - PMIN)) * H;
	const path = (s: number[]) => s.map((v, i) => `${i ? 'L' : 'M'} ${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ');
	const draw = prog(f, b(2) + 10, 70);
	const late = f >= b(12);
	const dayLbl = (i: number) => new Date((FX.t[i] + 7 * 3600) * 1000).toISOString().slice(5, 10).split('-').reverse().join('/');
	return (
		<Board dur={dur}>
			<Title sub="H4 · % perubahan sejak 2 Nov 2026">EURUSD vs GBPUSD</Title>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<g opacity={prog(f, b(2), 10)}>
					<path d={`M ${X} ${Y - 10} L ${X} ${Y + H} L ${X + Wd} ${Y + H}`} stroke={W.ink} strokeWidth={4} fill="none" />
					{[0, -1, -2].map((v) => (
						<g key={v}>
							<line x1={X} x2={X + Wd} y1={py(v)} y2={py(v)} stroke="rgba(0,0,0,0.12)" strokeWidth={2} strokeDasharray="8 10" />
							<text x={X - 14} y={py(v) + 10} textAnchor="end" fontFamily={HAND} fontWeight={700} fontSize={30} fill={W.grey}>
								{v === 0 ? '0%' : `${v}%`}
							</text>
						</g>
					))}
					{[0, 40, 80, N - 1].map((i) => (
						<text key={i} x={px(i)} y={Y + H + 40} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={30} fill={W.grey}>
							{dayLbl(i)}
						</text>
					))}
				</g>
				<path d={path(pe)} fill="none" stroke={W.blue} strokeWidth={5} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
				<path d={path(pg)} fill="none" stroke={W.orange} strokeWidth={5} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
			</svg>
			<Abs x={X + Wd + 14} y={py(pe[N - 1]) - 70}>
				<div style={{opacity: prog(f, b(5), 8)}}>
					<T s={34} c={W.blue}>
						EUR −2,1%
					</T>
				</div>
			</Abs>
			<Abs x={X + Wd + 14} y={py(pg[N - 1]) + 4}>
				<div style={{opacity: prog(f, b(5) + 30, 8)}}>
					<T s={34} c={W.orange}>
						GBP −2,2%
					</T>
				</div>
			</Abs>
			<Abs x={X} y={Y + H + 56}>
				<T s={26} c={W.grey}>
					Data asli OANDA:EURUSD & OANDA:GBPUSD · H4 · 2–28 Nov 2026 WIB · TradingView · korelasi dihitung dari return H4 (Python)
				</T>
			</Abs>
			{!late && (
				<>
					<Abs x={1360} y={250} w={420}>
						<Pop at={b(6)}>
							<Box color={W.ink}>
								<M s={60}>104 / 119</M>
								<T s={34}>candle H4 bergerak searah</T>
							</Box>
						</Pop>
					</Abs>
					<Abs x={160} y={770} w={1200}>
						<div style={{opacity: prog(f, b(7), 8), display: 'flex', alignItems: 'center', gap: 30}}>
							<M s={52}>korelasi</M>
							<div style={{position: 'relative', width: 640, height: 60}}>
								<div style={{position: 'absolute', left: 0, right: 0, top: 26, height: 8, background: W.ink, borderRadius: 4}} />
								{[-1, 0, 1].map((v) => (
									<div key={v} style={{position: 'absolute', left: ((v + 1) / 2) * 640 - 20, top: -34, width: 40, textAlign: 'center', fontFamily: HAND, fontWeight: 700, fontSize: 30, color: W.grey}}>
										{v}
									</div>
								))}
								<div style={{position: 'absolute', left: ((0.91 + 1) / 2) * 640 - 16, top: 14, width: 32, height: 32, borderRadius: 20, background: W.red, opacity: prog(f, b(8), 8)}} />
							</div>
							<M s={64} c={W.red}>
								0,91
							</M>
						</div>
					</Abs>
					<Abs x={1360} y={480} w={420}>
						<Pop at={b(10)}>
							<Box color={W.green} bg="#E8F7EE">
								<M s={44} c={W.green}>
									$ USD
								</M>
								<T s={34}>di belakang dua-duanya</T>
							</Box>
						</Pop>
					</Abs>
				</>
			)}
			{late && (
				<>
					<Abs x={160} y={770} w={1250}>
						<Write at={b(12)}>
							<M s={50}>
								buy EUR 1% + buy GBP 1% = <Hi at={b(13)} color="#FFB3B3">2% di 1 ide</Hi>
							</M>
						</Write>
					</Abs>
					<Abs x={1430} y={250} w={420}>
						<Stamp at={b(13) + 20} s={40}>
							"DOLAR MELEMAH"
						</Stamp>
					</Abs>
					<Note at={b(15)} x={1430} y={400} w={370} color="#E8EEFF" rot={2}>
						Korelasi bisa berubah, apalagi pas ada berita khusus Inggris/Eropa
					</Note>
					<Abs x={1430} y={650} w={420}>
						<Stamp at={b(17)} color={W.green} s={38}>
							SEARAH = 1 POSISI
						</Stamp>
					</Abs>
				</>
			)}
		</Board>
	);
};

// ---------- USD: buy XAU + sell USDJPY ----------
const Usd: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	return (
		<Board dur={dur}>
			<Title sub="arahnya beda, taruhannya sama">BUY + SELL = SEIMBANG?</Title>
			<Abs x={160} y={290}>
				<Pop at={b(1)}>
					<Box color={W.blue} style={{width: 420}}>
						<M s={56} c={W.blue}>
							BUY XAUUSD
						</M>
					</Box>
				</Pop>
			</Abs>
			<Abs x={700} y={290}>
				<Pop at={b(1) + 30}>
					<Box color={W.orange} style={{width: 420}}>
						<M s={56} c={W.orange}>
							SELL USDJPY
						</M>
					</Box>
				</Pop>
			</Abs>
			<Abs x={1170} y={300}>
				<div style={{opacity: prog(f, b(3), 8)}}>
					<M s={56} c={W.grey}>
						⚖ ?
					</M>
				</div>
			</Abs>
			<Stroke d="M 370 400 Q 560 470 640 480" at={b(4)} color={W.ink} width={5} />
			<Stroke d="M 910 400 Q 760 470 700 480" at={b(4)} color={W.ink} width={5} />
			<Abs x={330} y={490}>
				<Stamp at={b(4) + 20} s={50}>
					1 TARUHAN: DOLAR MELEMAH
				</Stamp>
			</Abs>
			<Abs x={160} y={630} w={1250}>
				<div style={{opacity: prog(f, b(5), 8)}}>
					<T s={42}>
						kalau dolar <b style={{color: W.green}}>menguat</b>: emas cenderung tertekan <span style={{color: W.red}}>(buy rugi)</span>
					</T>
				</div>
				<div style={{opacity: prog(f, b(5) + 90, 8)}}>
					<T s={42}>
						dan USDJPY cenderung naik <span style={{color: W.red}}>(sell rugi)</span>
					</T>
				</div>
			</Abs>
			<Note at={b(7)} x={160} y={770} w={760} color="#FFF3A8" rot={-1}>
				Tes cepat: "posisi ini untung kalau dolar ngapain?"
			</Note>
			<Abs x={1000} y={790}>
				<Stamp at={b(8)} color={W.ink} s={38} rot={2}>
					1 TARUHAN · BANYAK TIKET
				</Stamp>
			</Abs>
		</Board>
	);
};

// ---------- TOTAL OPEN RISK ----------
const Total: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const phaseB = f >= b(6) && f < b(15);
	const phaseC = f >= b(15);
	const rows: [string, string, number, string][] = [
		['XAUUSD', 'buy', 100, 'emas'],
		['EURUSD', 'buy', 100, 'dolar melemah'],
		['GBPUSD', 'buy', 100, 'dolar melemah'],
	];
	const full = prog(f, b(12), 30);
	return (
		<Board dur={dur}>
			<Title sub="kalau SEMUA stop loss aktif kena barengan">TOTAL RISIKO TERBUKA</Title>
			{!phaseB && !phaseC && (
				<Abs x={150} y={320} w={1250}>
					<Write at={b(2)}>
						<M s={56}>Σ rugi semua SL yang aktif</M>
					</Write>
					<Write at={b(4)}>
						<T s={50} style={{marginTop: 40}}>
							per posisi: <Hi at={b(4) + 20}>jarak SL × lot × nilai per poin</Hi>
						</T>
					</Write>
					<Write at={b(5)}>
						<M s={50} c={W.blue} style={{marginTop: 30}}>
							lalu dijumlah semua
						</M>
					</Write>
				</Abs>
			)}
			{phaseB && (
				<>
					<Ilus x={1150} y={120} label="CONTOH SIMULASI · MODAL $10.000" />
					<Abs x={150} y={290} w={1000}>
						{rows.map(([p, d, r, grp], k) => (
							<div key={p} style={{display: 'flex', gap: 30, alignItems: 'baseline', marginBottom: 14, opacity: prog(f, b(7) + k * 60, 8)}}>
								<M s={46} style={{width: 260}}>
									{p}
								</M>
								<T s={42} style={{width: 90}}>
									{d}
								</T>
								<T s={42} style={{width: 200}}>
									${r} <span style={{opacity: prog(f, b(8) + k * 10, 6), color: W.green}}>(1%)</span>
								</T>
								<T s={34} c={k ? W.orange : W.grey}>
									{grp}
								</T>
							</div>
						))}
						<div style={{opacity: prog(f, b(9), 10), borderTop: `4px solid ${W.ink}`, paddingTop: 10, width: 640}}>
							<M s={56} c={W.red}>
								TOTAL $300 = 3%
							</M>
						</div>
					</Abs>
					<Stroke d="M 1120 380 Q 1150 420 1120 460" at={b(10)} color={W.orange} width={6} />
					<Abs x={1160} y={380} w={300}>
						<div style={{opacity: prog(f, b(10) + 10, 8)}}>
							<T s={38} c={W.orange}>
								1 ide: $200 (2%)
							</T>
						</div>
					</Abs>
					<Abs x={150} y={640} w={1300}>
						<div style={{opacity: prog(f, b(11), 8), display: 'flex', alignItems: 'center', gap: 30}}>
							<T s={42}>batas total 2–3%</T>
							<div style={{width: 460, height: 46, border: `5px solid ${W.ink}`, borderRadius: 10, position: 'relative', overflow: 'hidden'}}>
								<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${66 + 34 * full}%`, background: full > 0.95 ? W.red : W.orange, opacity: 0.75}} />
							</div>
							<M s={44} c={W.red} style={{opacity: prog(f, b(12) + 30, 8)}}>
								PENUH
							</M>
						</div>
						<div style={{marginTop: 26, display: 'flex', gap: 40}}>
							<Stamp at={b(13)} s={40}>
								SETUP BARU = TUNGGU
							</Stamp>
							<div style={{opacity: prog(f, b(14), 8)}}>
								<Tag color={W.orange} style={{fontSize: 34}}>
									maks 2% per 1 ide
								</Tag>
							</div>
						</div>
					</Abs>
				</>
			)}
			{phaseC && (
				<Abs x={150} y={300} w={1300}>
					<Write at={b(15)}>
						<M s={48}>TABEL KECIL DI JURNAL</M>
					</Write>
					<div style={{marginTop: 26, display: 'flex', border: `4px solid ${W.ink}`, borderRadius: 12, overflow: 'hidden', background: '#fff', width: 'fit-content'}}>
						{['pair', 'arah', 'lot', 'jarak SL', 'risiko $', 'kelompok'].map((c, i) => (
							<div key={c} style={{padding: '12px 22px', borderLeft: i ? `3px solid ${W.ink}` : undefined, opacity: prog(f, b(16) + i * 14, 6)}}>
								<T s={40}>{c}</T>
							</div>
						))}
					</div>
					<div style={{marginTop: 18, opacity: prog(f, b(16) + 100, 8)}}>
						<T s={36} c={W.grey}>
							+ baris TOTAL di bawah. Cek sebelum buka posisi baru.
						</T>
					</div>
				</Abs>
			)}
		</Board>
	);
};

// ---------- RULES: adding positions ----------
const Rules: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	return (
		<Board dur={dur}>
			<Title sub="dua kondisi yang bedanya jauh">MAU NAMBAH POSISI?</Title>
			<Abs x={150} y={280} w={560}>
				<Pop at={b(2)}>
					<div style={{border: `6px solid ${W.red}`, borderRadius: 22, padding: '20px 28px', background: '#FFF4F4'}}>
						<M s={44} c={W.red}>
							1 · POSISI LAGI RUGI
						</M>
						<div style={{opacity: prog(f, b(3), 8)}}>
							<M s={64} c={W.red} style={{marginTop: 10}}>
								✗ JANGAN DITAMBAH
							</M>
						</div>
						<div style={{opacity: prog(f, b(4), 8)}}>
							<T s={38} style={{marginTop: 10}}>
								nambah risiko di ide yang lagi terbukti salah
							</T>
						</div>
					</div>
				</Pop>
			</Abs>
			<Abs x={770} y={280} w={640}>
				<Pop at={b(5)}>
					<div style={{border: `6px solid ${W.green}`, borderRadius: 22, padding: '20px 28px', background: '#F2FBF5'}}>
						<M s={44} c={W.green}>
							2 · UNTUNG + SL DI BREAK EVEN
						</M>
						<div style={{opacity: prog(f, b(6), 8), marginTop: 10}}>
							<T s={38}>posisi lama ≈ $0 risiko</T>
							<T s={30} c={W.grey}>
								(tetap ada spread & slippage)
							</T>
						</div>
						<div style={{opacity: prog(f, b(7), 8), marginTop: 10}}>
							<T s={38}>
								posisi baru 1% → total <b>tetap di bawah batas</b>
							</T>
						</div>
						<div style={{opacity: prog(f, b(7) + 60, 8), marginTop: 6}}>
							<M s={44} c={W.green}>
								✓ BISA DIPERTIMBANGKAN
							</M>
						</div>
					</div>
				</Pop>
			</Abs>
			<Abs x={150} y={760} w={1250}>
				<Write at={b(9)}>
					<M s={52}>
						yang dihitung selalu <Hi at={b(9) + 20}>TOTAL-nya</Hi>
					</M>
				</Write>
			</Abs>
		</Board>
	);
};

// ---------- MISTAKES ----------
const Mistakes: React.FC<SP> = ({b, dur}) => {
	const items: [string, string, number, number][] = [
		['Ngitung risiko per tiket', '"tiap posisi 1%", padahal semuanya searah', b(1), b(2)],
		['Averaging down tanpa batas', 'harga makin jauh, lot terakhir paling besar', b(3), b(4)],
		['Beda pair = diversifikasi', 'EURUSD, GBPUSD, emas: bisa 1 taruhan dolar', b(5), b(6)],
	];
	return (
		<Board dur={dur}>
			<Title>3 KESALAHAN UMUM</Title>
			{items.map(([h, fix, at, at2], i) => (
				<Abs key={h} x={130} y={260 + i * 175} w={1300}>
					<div style={{display: 'flex', alignItems: 'center', gap: 28}}>
						<Pop at={at}>
							<M s={80} c={W.red}>
								✗
							</M>
						</Pop>
						<div>
							<Write at={at}>
								<M s={52}>
									{i + 1}. {h}
								</M>
							</Write>
							<Write at={at2}>
								<T s={44} c={W.grey}>
									{fix}
								</T>
							</Write>
						</div>
					</div>
				</Abs>
			))}
			<Note at={b(7)} x={130} y={790} w={760} color="#E8EEFF" rot={1.5}>
				Satu aja jadi kebiasaan = risiko di jurnal lo lebih besar dari yang lo kira
			</Note>
		</Board>
	);
};

// ---------- SUMMARY ----------
const Summary: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const tiers: [string, number][] = [
		['3 posisi 1% searah ≈ 3%, bukan 1%', b(1)],
		['beda nama, bisa 1 taruhan (dolar)', b(3)],
		['batasi TOTAL risiko terbuka', b(4)],
	];
	const steps: [string, number][] = [
		['Jumlahkan risiko semua posisi terbuka sebelum buka yang baru', b(6)],
		['Kelompokkan posisi yang taruhannya sama = 1 posisi', b(7)],
		['Total nyentuh 2–3%? Stop buka posisi baru', b(8)],
	];
	const late = f >= b(5);
	return (
		<Board dur={dur}>
			<Title>RANGKUMAN</Title>
			{!late &&
				tiers.map(([a, at], i) => (
					<Abs key={a} x={140} y={290 + i * 130} w={1250}>
						<Write at={at}>
							<M s={54} c={[W.red, W.orange, W.green][i]}>
								{a}
							</M>
						</Write>
					</Abs>
				))}
			{late && (
				<>
					<Abs x={110} y={270}>
						<Write at={b(5)}>
							<M s={52}>MULAI BESOK:</M>
						</Write>
					</Abs>
					{steps.map(([t, at], i) => (
						<Abs key={t} x={140} y={380 + i * 130} w={1300}>
							<div style={{display: 'flex', alignItems: 'center', gap: 26}}>
								<div style={{width: 64, height: 64, border: `5px solid ${W.ink}`, borderRadius: 10, position: 'relative', opacity: prog(f, at - 6, 6), flexShrink: 0}}>
									<div style={{position: 'absolute', left: 4, top: -18, fontFamily: MARK, fontSize: 70, color: W.green, opacity: prog(f, at + 24, 6)}}>✓</div>
								</div>
								<Write at={at}>
									<T s={50}>{t + '\u00a0\u00a0'}</T>
								</Write>
							</div>
						</Abs>
					))}
					<Abs x={140} y={790}>
						<Stamp at={b(9)} s={42}>
							JANGAN NAMBAH DI POSISI RUGI
						</Stamp>
					</Abs>
				</>
			)}
		</Board>
	);
};

// ---------- DISCLAIMER ----------
const Disclaimer: React.FC<SP> = ({b, dur}) => (
	<Board dur={dur}>
		<Abs x={200} y={250} w={1300}>
			<Pop at={2}>
				<div style={{border: `6px solid ${W.ink}`, borderRadius: 24, padding: '40px 54px', background: '#fff'}}>
					<M s={56} c={W.red}>
						⚠ PENGINGAT
					</M>
					<T s={50} style={{marginTop: 18}}>
						Edukasi umum, bukan ajakan transaksi atau saran keuangan pribadi.
					</T>
					<Write at={b(2)}>
						<T s={50} style={{marginTop: 8}}>
							Chart = data asli. Posisi & angka hitungan = contoh simulasi.
						</T>
					</Write>
					<Write at={b(3)}>
						<T s={50} c={W.red} style={{marginTop: 8}}>
							Trading berleverage bisa menyebabkan rugi & kehilangan modal. Stop loss bisa kena slippage.
						</T>
					</Write>
				</div>
			</Pop>
		</Abs>
	</Board>
);

// ---------- CTA ----------
const Cta: React.FC<SP> = ({b}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 75% 70%, #2a3140 0%, #0b0d12 60%)'}}>
			<div style={{position: 'absolute', right: 120, bottom: 0, width: 700, height: 900, background: 'radial-gradient(ellipse at 50% 100%, rgba(255,230,160,0.22), transparent 65%)'}} />
			<div style={{position: 'absolute', left: 120, top: 190}}>
				<div style={{opacity: prog(f, 4, 10), fontFamily: SANSB, fontWeight: 700, fontSize: 46, color: '#fff', width: 1050}}>
					Komen: <span style={{color: W.gold}}>tim total risiko terbuka</span> atau <span style={{color: W.gold}}>tim 1% per posisi?</span>
				</div>
				<div style={{opacity: prog(f, b(3), 10), marginTop: 60, fontFamily: SANSB, fontWeight: 900, fontSize: 92, color: '#fff', letterSpacing: -1}}>JOIN KOMUNITAS TRADING</div>
				<div style={{opacity: prog(f, b(3) + 10, 10), fontFamily: SANSB, fontWeight: 900, fontSize: 120, color: W.gold, letterSpacing: -2}}>dhirajkelly.id</div>
				<div style={{opacity: prog(f, b(4), 10), marginTop: 30, display: 'inline-block', background: '#E62117', color: '#fff', fontFamily: SANSB, fontWeight: 800, fontSize: 42, padding: '10px 28px', borderRadius: 10}}>SUBSCRIBE · Doktor Trader</div>
			</div>
		</AbsoluteFill>
	);
};

void circleD;
void underD;
export const SCENES: Record<string, React.FC<SP>> = {
	hook: Hook,
	map: MapS,
	stack: Stack,
	pair: Pair,
	usd: Usd,
	total: Total,
	rules: Rules,
	mistakes: Mistakes,
	summary: Summary,
	disclaimer: Disclaimer,
	cta: Cta,
};
