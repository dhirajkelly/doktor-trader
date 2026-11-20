// Academy: Fondasi Trading > Membaca chart candlestick. All prices are SIMULASI.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Chart, HLine, Tag, Zone, useReveal, fmt} from './Chart';
import * as D from './data';
import {Appear, Badge, C, Card, Hl, MONO, SANS, SERIF, useIn, useOut} from './ui';

export type SceneProps = {b: (k: number) => number; dur: number};

const SimBadge: React.FC<{text?: string}> = ({text = 'SIMULASI · EDUKASI · BUKAN SINYAL'}) => (
	<div style={{position: 'absolute', left: 110, top: 104}}>
		<Badge color={C.muted}>{text}</Badge>
	</div>
);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---------- Big single candle (SVG) ----------
type BC = {o: number; h: number; l: number; c: number; yMin: number; yMax: number; H: number; W?: number; bw?: number; p?: number; axis?: boolean; marks?: {p: number; label: string; color: string; a: number; side?: 'l' | 'r'}[]; children?: (y: (v: number) => number, cx: number) => React.ReactNode};
const priceAt = (o: number, h: number, l: number, c: number, p: number) => (p <= 1 ? o + (h - o) * p : p <= 2 ? h + (l - h) * (p - 1) : l + (c - l) * Math.min(1, p - 2));
export const BigCandle: React.FC<BC> = ({o, h, l, c, yMin, yMax, H, W = 520, bw = 120, p = 3, axis = true, marks = [], children}) => {
	const y = (v: number) => H - ((v - yMin) / (yMax - yMin)) * H;
	const cur = priceAt(o, h, l, c, p);
	const hi = p >= 1 ? h : Math.max(o, cur);
	const lo = p >= 2 ? Math.min(l, cur) : Math.min(o, cur);
	const up = cur >= o;
	const col = up ? C.green : C.red;
	const cx = W / 2;
	const ticks: number[] = [];
	const step = (yMax - yMin) > 30 ? 5 : 2;
	for (let v = Math.ceil(yMin / step) * step; v <= yMax; v += step) ticks.push(v);
	return (
		<svg width={W} height={H} style={{overflow: 'visible'}}>
			{axis && ticks.map((v) => (
				<g key={v}>
					<line x1={0} x2={W} y1={y(v)} y2={y(v)} stroke="rgba(159,168,184,0.12)" />
					<text x={W + 14} y={y(v) + 7} fill={C.muted} fontFamily={MONO} fontSize={19}>{fmt(v, 0)}</text>
				</g>
			))}
			<line x1={cx} x2={cx} y1={y(hi)} y2={y(lo)} stroke={col} strokeWidth={5} />
			<rect x={cx - bw / 2} y={y(Math.max(o, cur))} width={bw} height={Math.max(4, y(Math.min(o, cur)) - y(Math.max(o, cur)))} fill={col} rx={4} />
			{p < 3 && <circle cx={cx} cy={y(cur)} r={9} fill={C.text} />}
			{marks.map((m) => (
				<g key={m.label} opacity={m.a}>
					<line x1={m.side === 'l' ? cx - bw / 2 - 150 : cx + bw / 2 + 8} x2={m.side === 'l' ? cx - bw / 2 - 8 : cx + bw / 2 + 150} y1={y(m.p)} y2={y(m.p)} stroke={m.color} strokeWidth={2.5} strokeDasharray="8 6" />
					<text x={m.side === 'l' ? cx - bw / 2 - 160 : cx + bw / 2 + 160} y={y(m.p) + 9} textAnchor={m.side === 'l' ? 'end' : 'start'} fill={m.color} fontFamily={MONO} fontWeight={700} fontSize={26}>{m.label}</text>
				</g>
			))}
			{children?.(y, cx)}
		</svg>
	);
};

const Row: React.FC<{at: number; k: string; v: string; gold?: boolean; size?: number}> = ({at, k, v, gold, size = 32}) => (
	<Appear at={at} dx={30} dy={0}>
		<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20, padding: '12px 22px', borderRadius: 14, background: gold ? 'rgba(201,162,74,0.16)' : 'rgba(20,40,80,0.85)', border: `1.5px solid ${gold ? C.gold : 'rgba(159,168,184,0.25)'}`}}>
			<div style={{fontSize: size - 6, color: C.body}}>{k}</div>
			<div style={{fontFamily: MONO, fontSize: size, fontWeight: 700, color: gold ? C.gold : C.text, whiteSpace: 'nowrap'}}>{v}</div>
		</div>
	</Appear>
);

// ---------- S01 HOOK ----------
export const SHook: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const p = interpolate(f, [b(0) + 6, b(3) + 50], [0, 3], clamp);
	const out1 = useOut(b(4) - 6, 14);
	return (
		<AbsoluteFill>
			<div style={{opacity: out1}}>
				<SimBadge />
				<div style={{position: 'absolute', left: 60, top: 230}}>
					<div style={{fontFamily: MONO, fontSize: 22, color: C.muted, marginBottom: 16, marginLeft: 170}}>XAUUSD · H1 · SIMULASI</div>
					<BigCandle o={3750} h={3758} l={3746} c={3752} yMin={3744} yMax={3760} H={600} W={760} bw={130} p={p}
						marks={[{p: 3758, label: '+$8 sempat', color: C.gold, a: interpolate(f, [b(3), b(3) + 12], [0, 1], clamp)}, {p: 3752, label: 'close +$2', color: C.green, a: interpolate(f, [b(3) + 40, b(3) + 52], [0, 1], clamp)}]} />
				</div>
				<div style={{position: 'absolute', right: 110, top: 250, width: 720, display: 'flex', flexDirection: 'column', gap: 26}}>
					<Appear at={4}><Hl text="Satu candle, *dua kesimpulan.*" size={60} /></Appear>
					<Appear at={b(1)} dx={40} dy={0}><Card accent={C.green}><div style={{fontFamily: MONO, fontSize: 22, color: C.green, fontWeight: 700}}>TRADER A</div><div style={{fontSize: 36, fontWeight: 700, marginTop: 8}}>"Hijau, berarti mau naik."</div></Card></Appear>
					<Appear at={b(2)} dx={40} dy={0}><Card accent={C.gold}><div style={{fontFamily: MONO, fontSize: 22, color: C.gold, fontWeight: 700}}>TRADER B</div><div style={{fontSize: 36, fontWeight: 700, marginTop: 8}}>"Sumbu atas panjang, pembeli kalah."</div></Card></Appear>
				</div>
			</div>
			{f >= b(4) - 6 && (
				<AbsoluteFill style={{padding: '220px 110px'}}>
					<Appear at={b(4)}><Hl text="Cara baca *candlestick* dengan benar" size={68} /></Appear>
					<div style={{display: 'flex', gap: 26, marginTop: 56}}>
						{[['01', 'Empat harga', 'Open · High · Low · Close'], ['02', 'Body & sumbu', 'Hitung, bukan tebak'], ['03', 'Timeframe', 'M15 → H1 → H4'], ['04', 'Stop loss', 'Di luar sumbu']].map(([n, t, d], i) => (
							<Appear key={n} at={b(4) + 24 + i * 12} pop style={{flex: 1}}>
								<Card style={{height: 220}}>
									<div style={{fontFamily: MONO, color: C.gold, fontSize: 28, fontWeight: 700}}>{n}</div>
									<div style={{fontSize: 40, fontWeight: 700, marginTop: 18}}>{t}</div>
									<div style={{fontSize: 26, color: C.muted, marginTop: 12}}>{d}</div>
								</Card>
							</Appear>
						))}
					</div>
					<Appear at={b(5)} style={{marginTop: 44}}><Hl text="Cuma lihat warna = *setengah cerita.*" size={54} serif /></Appear>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// ---------- generic list ----------
const List: React.FC<{b: (k: number) => number; badge: string; badgeAt: number; title: string; titleAt: number; items: string[]; ats: number[]; mark?: 'num' | 'check'; footer?: string; footerAt?: number; compact?: boolean}> = ({badge, badgeAt, title, titleAt, items, ats, mark = 'num', footer, footerAt = 0, compact}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{padding: compact ? '110px 160px' : '130px 160px'}}>
			<Appear at={badgeAt}><Badge>{badge}</Badge></Appear>
			<Appear at={titleAt} style={{marginTop: 20}}><Hl text={title} size={compact ? 56 : 62} /></Appear>
			<div style={{marginTop: compact ? 26 : 36, display: 'flex', flexDirection: 'column', gap: compact ? 12 : 18}}>
				{items.map((t, i) => {
					const at = ats[i];
					const tick = interpolate(f, [at + 10, at + 22], [0, 1], clamp);
					return (
						<Appear key={t} at={at} dx={-30} dy={0}>
							<div style={{display: 'flex', alignItems: 'center', gap: 24, background: 'rgba(20,40,80,0.85)', border: '1.5px solid rgba(159,168,184,0.25)', borderRadius: 18, padding: compact ? '11px 26px' : '16px 28px'}}>
								{mark === 'check' && <div style={{width: 48, height: 48, borderRadius: 12, border: `3px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: C.green, transform: `scale(${0.6 + tick * 0.4})`, opacity: 0.3 + tick * 0.7}}>✓</div>}
								<div style={{fontFamily: MONO, color: C.gold, fontSize: 28, fontWeight: 700}}>{String(i + 1).padStart(2, '0')}</div>
								<div style={{fontSize: compact ? 31 : 34, fontWeight: 700, color: C.text}}>{t}</div>
							</div>
						</Appear>
					);
				})}
			</div>
			{footer && <Appear at={footerAt} style={{marginTop: 30}}><Hl text={footer} size={44} serif /></Appear>}
		</AbsoluteFill>
	);
};

// ---------- S02 MAP ----------
export const SMap: React.FC<SceneProps> = ({b}) => (
	<>
		<div style={{position: 'absolute', right: 110, top: 136}}><Appear at={b(1)}><Badge color={C.muted}>SEMUA CHART & ANGKA = SIMULASI · BUKAN SINYAL</Badge></Appear></div>
		<List b={b} badge="FONDASI TRADING · MATERI 3" badgeAt={4} title="Membaca chart *candlestick*" titleAt={b(0)}
			items={['Empat harga di dalam satu candle', 'Body, sumbu, dan range', 'Timeframe: mulai dari H1 & H4', 'Konteks lebih penting dari bentuk', 'Dari candle ke rencana risiko', 'Tugas latihan di akun demo']}
			ats={[b(3), b(4), b(5), b(6), b(7), b(8)]} compact />
	</>
);

// ---------- S03 OHLC ----------
export const SOhlc: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const sim = f >= b(7) - 6;
	const p = interpolate(f, [b(8) + 10, b(10) + 10], [0, 3], clamp);
	const a = (k: number) => interpolate(f, [k, k + 12], [0, 1], clamp);
	const gOut = useOut(b(7) - 8, 10);
	return (
		<AbsoluteFill>
			<SimBadge />
			{!sim && (
				<div style={{opacity: gOut}}>
					<div style={{position: 'absolute', left: 300, top: 220}}>
						<BigCandle o={20} h={92} l={6} c={70} yMin={0} yMax={100} H={620} W={420} bw={140} axis={false}
							marks={[{p: 20, label: 'OPEN', color: C.text, a: a(b(2)), side: 'l'}, {p: 92, label: 'HIGH', color: C.gold, a: a(b(3))}, {p: 6, label: 'LOW', color: C.gold, a: a(b(4))}, {p: 70, label: 'CLOSE', color: C.green, a: a(b(5)), side: 'l'}]} />
					</div>
					<div style={{position: 'absolute', right: 110, top: 240, width: 640, display: 'flex', flexDirection: 'column', gap: 22}}>
						<Appear at={b(1)}><Hl text="1 candle = *4 harga*" size={64} /></Appear>
						<Appear at={b(1) + 20}><div style={{fontSize: 30, color: C.body}}>dalam satu periode (timeframe)</div></Appear>
						<Appear at={b(6)} dx={40} dy={0}>
							<Card style={{width: 420, fontFamily: MONO, fontSize: 26}}>
								<div style={{color: C.muted, fontSize: 20, letterSpacing: 2}}>DATA WINDOW · MT4/MT5</div>
								{['Open', 'High', 'Low', 'Close'].map((k) => (<div key={k} style={{display: 'flex', justifyContent: 'space-between', marginTop: 10}}><span>{k}</span><span style={{color: C.gold}}>····</span></div>))}
							</Card>
						</Appear>
					</div>
				</div>
			)}
			{sim && (
				<>
					<div style={{position: 'absolute', left: 130, top: 230}}>
						<div style={{fontFamily: MONO, fontSize: 22, color: C.muted, marginBottom: 14, marginLeft: 170, opacity: a(b(7))}}>XAUUSD · H1 · SIMULASI</div>
						<BigCandle o={3750} h={3758} l={3746} c={3752} yMin={3744} yMax={3760} H={600} W={760} bw={140} p={p}
							marks={[{p: 3750, label: 'O 3.750', color: C.text, a: a(b(8)), side: 'l'}, {p: 3758, label: 'H 3.758', color: C.gold, a: interpolate(p, [0.9, 1], [0, 1], clamp)}, {p: 3746, label: 'L 3.746', color: C.gold, a: interpolate(p, [1.9, 2], [0, 1], clamp)}, {p: 3752, label: 'C 3.752', color: C.green, a: interpolate(p, [2.9, 3], [0, 1], clamp), side: 'l'}]} />
					</div>
					<div style={{position: 'absolute', right: 110, top: 260, width: 600, display: 'flex', flexDirection: 'column', gap: 24}}>
						<Appear at={b(11)}><Card accent={C.green}><div style={{fontSize: 34, fontWeight: 700}}>Close <span style={{color: C.green}}>&gt;</span> Open → <span style={{color: C.green}}>hijau</span></div></Card></Appear>
						<Appear at={b(12)}><Card accent={C.red}><div style={{fontSize: 34, fontWeight: 700}}>Close <span style={{color: C.red}}>&lt;</span> Open → <span style={{color: C.red}}>merah</span></div></Card></Appear>
						<Appear at={b(13)} style={{marginTop: 16}}><Hl text="Warna = posisi close dibanding open." size={46} /></Appear>
						<Appear at={b(14)}><Hl text="*Bukan* perjalanan harganya." size={46} serif /></Appear>
					</div>
				</>
			)}
		</AbsoluteFill>
	);
};

// ---------- S04 BODY / WICK / RANGE ----------
const Bracket: React.FC<{x: number; y0: number; y1: number; label: string; color: string; a: number; side?: 'l' | 'r'}> = ({x, y0, y1, label, color, a, side = 'r'}) => {
	const d = side === 'r' ? 14 : -14;
	return (
		<g opacity={a}>
			<path d={`M${x} ${y0} h${d} V${y1} h${-d}`} fill="none" stroke={color} strokeWidth={3} />
			<text x={x + d * 2} y={(y0 + y1) / 2 + 9} textAnchor={side === 'r' ? 'start' : 'end'} fill={color} fontFamily={MONO} fontWeight={700} fontSize={26}>{label}</text>
		</g>
	);
};
export const SBody: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const a = (k: number) => interpolate(f, [k, k + 12], [0, 1], clamp);
	const cmpA = a(b(11));
	return (
		<AbsoluteFill>
			<SimBadge />
			<div style={{position: 'absolute', left: 150, top: 240}}>
				<div style={{fontFamily: MONO, fontSize: 22, color: C.muted, marginBottom: 14}}>XAUUSD · H1 · SIMULASI</div>
				<svg width={760} height={600} style={{overflow: 'visible'}}>
					<g transform="translate(110,0)">
						<BigCandle o={3750} h={3758} l={3746} c={3752} yMin={3744} yMax={3760} H={600} W={300} bw={120} axis={false}>
							{(y, cx) => (
								<>
									<Bracket x={cx + 80} y0={y(3752)} y1={y(3750)} label="body $2" color={C.green} a={a(b(1))} />
									<Bracket x={cx - 80} y0={y(3758)} y1={y(3746)} label="range $12" color={C.gold} a={a(b(3))} side="l" />
									<Bracket x={cx + 80} y0={y(3758)} y1={y(3752)} label="sumbu atas $6" color={C.blue} a={a(b(5))} />
									<Bracket x={cx + 80} y0={y(3750)} y1={y(3746)} label="sumbu bawah $4" color={C.blue} a={a(b(6))} />
								</>
							)}
						</BigCandle>
					</g>
					<g transform="translate(640,0)" opacity={cmpA}>
						<BigCandle o={3750} h={3758} l={3749.5} c={3757.5} yMin={3744} yMax={3760} H={600} W={200} bw={90} axis={false}>
							{(y, cx) => <text x={cx} y={y(3744) - 6} textAnchor="middle" fill={C.muted} fontFamily={MONO} fontSize={22}>body ≈ range</text>}
						</BigCandle>
					</g>
				</svg>
			</div>
			<div style={{position: 'absolute', right: 100, top: 210, width: 690, display: 'flex', flexDirection: 'column', gap: 14}}>
				<Row at={b(2)} k="Body = close − open" v="3.752 − 3.750 = $2" size={30} />
				<Row at={b(4)} k="Range = high − low" v="3.758 − 3.746 = $12" size={30} />
				<Row at={b(5)} k="Sumbu atas" v="3.758 − 3.752 = $6" size={30} />
				<Row at={b(6)} k="Sumbu bawah" v="3.750 − 3.746 = $4" size={30} />
				<Row at={b(7)} k="Cek" v="2 + 6 + 4 = 12 ✓" gold size={30} />
				<Row at={b(8)} k="Body dibanding range" v="≈ 1/6" gold size={30} />
				<Appear at={b(12)} style={{marginTop: 14}}><Hl text="Body *≠* Range" size={64} serif /></Appear>
			</div>
		</AbsoluteFill>
	);
};

// ---------- S05 TIMEFRAME ----------
const M15 = [
	{o: 3750, h: 3753, l: 3746, c: 3752},
	{o: 3752, h: 3758, l: 3751, c: 3756},
	{o: 3756, h: 3757, l: 3751, c: 3753},
	{o: 3753, h: 3755, l: 3750, c: 3752},
];
export const STf: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const a = (k: number) => interpolate(f, [k, k + 12], [0, 1], clamp);
	const H = 520, yMin = 3744, yMax = 3760;
	const y = (v: number) => H - ((v - yMin) / (yMax - yMin)) * H;
	const rev = interpolate(f, [b(2), b(2) + 40], [0, 4], clamp);
	const cw = 110;
	const x = (i: number) => 60 + i * 130;
	const late = f >= b(9) - 6;
	const tfOut = useOut(b(9) - 6, 12);
	return (
		<AbsoluteFill>
			<SimBadge />
			<div style={{position: 'absolute', left: 110, top: 168, display: 'flex', gap: 14}}>
				{['M1', 'M5', 'M15', 'H1', 'H4', 'D1'].map((t, i) => (
					<Appear key={t} at={b(1) + i * 6} pop>
						<div style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, padding: '8px 22px', borderRadius: 999, border: `1.5px solid ${t === 'M15' || t === 'H1' ? C.gold : 'rgba(159,168,184,0.5)'}`, color: t === 'M15' || t === 'H1' ? C.gold : C.text}}>{t}</div>
					</Appear>
				))}
			</div>
			<div style={{opacity: tfOut}}>
				<div style={{position: 'absolute', left: 110, top: 290}}>
					<div style={{fontFamily: MONO, fontSize: 22, color: C.muted, marginBottom: 12}}>4 × M15 · SIMULASI</div>
					<svg width={620} height={H} style={{overflow: 'visible'}}>
						{[3746, 3750, 3754, 3758].map((v) => (<g key={v}><line x1={0} x2={600} y1={y(v)} y2={y(v)} stroke="rgba(159,168,184,0.12)" /><text x={-14} y={y(v) + 7} textAnchor="end" fill={C.muted} fontFamily={MONO} fontSize={18}>{fmt(v, 0)}</text></g>))}
						{M15.map((k, i) => {
							const op = Math.max(0, Math.min(1, rev - i));
							const col = k.c >= k.o ? C.green : C.red;
							return (
								<g key={i} opacity={op}>
									<line x1={x(i) + cw / 2} x2={x(i) + cw / 2} y1={y(k.h)} y2={y(k.l)} stroke={col} strokeWidth={3} />
									<rect x={x(i) + cw * 0.2} y={y(Math.max(k.o, k.c))} width={cw * 0.6} height={Math.max(3, Math.abs(y(k.o) - y(k.c)))} fill={col} rx={2} />
								</g>
							);
						})}
						<g opacity={a(b(3))}><line x1={x(0)} x2={x(0) + cw} y1={y(3750)} y2={y(3750)} stroke={C.text} strokeWidth={3} /><text x={x(0)} y={y(3750) + 34} fill={C.text} fontFamily={MONO} fontWeight={700} fontSize={22}>OPEN</text></g>
						<g opacity={a(b(4))}><line x1={x(3)} x2={x(3) + cw} y1={y(3752)} y2={y(3752)} stroke={C.green} strokeWidth={3} /><text x={x(3) + cw + 10} y={y(3752) + 8} textAnchor="start" fill={C.green} fontFamily={MONO} fontWeight={700} fontSize={22}>CLOSE</text></g>
						<g opacity={a(b(5))}>
							<line x1={0} x2={600} y1={y(3758)} y2={y(3758)} stroke={C.gold} strokeWidth={2.5} strokeDasharray="8 6" /><text x={600} y={y(3758) - 12} textAnchor="end" fill={C.gold} fontFamily={MONO} fontWeight={700} fontSize={22}>HIGH 3.758</text>
							<line x1={0} x2={600} y1={y(3746)} y2={y(3746)} stroke={C.gold} strokeWidth={2.5} strokeDasharray="8 6" /><text x={600} y={y(3746) + 32} textAnchor="end" fill={C.gold} fontFamily={MONO} fontWeight={700} fontSize={22}>LOW 3.746</text>
						</g>
					</svg>
				</div>
				<div style={{position: 'absolute', left: 790, top: 290 + 34 + H / 2 - 40, fontSize: 72, color: C.gold, opacity: a(b(8) - 10)}}>=</div>
				<div style={{position: 'absolute', left: 930, top: 290, opacity: a(b(8) - 10)}}>
					<div style={{fontFamily: MONO, fontSize: 22, color: C.muted, marginBottom: 12}}>1 × H1 · SIMULASI</div>
					<BigCandle o={3750} h={3758} l={3746} c={3752} yMin={yMin} yMax={yMax} H={H} W={260} bw={110} axis={false} />
				</div>
				<div style={{position: 'absolute', right: 100, top: 330, width: 520, display: 'flex', flexDirection: 'column', gap: 18}}>
					<Appear at={b(2)}><Card><div style={{fontSize: 30, fontWeight: 700}}>1 candle H1 = <span style={{color: C.gold}}>4 candle M15</span></div></Card></Appear>
					<Appear at={b(7)}><Card accent={C.blue}><div style={{fontSize: 28, color: C.body}}>Naik ke 3.758, lalu turun lagi → jadi <b style={{color: C.text}}>sumbu atas</b> di H1</div></Card></Appear>
				</div>
			</div>
			{late && (
				<AbsoluteFill style={{padding: '300px 160px'}}>
					<Appear at={b(9)}><Hl text="Timeframe makin kecil → *noise makin banyak*" size={58} /></Appear>
					<Appear at={b(10)} style={{marginTop: 40}}><Badge style={{fontSize: 30}}>PEMULA: MULAI DARI H1 & H4</Badge></Appear>
					<Appear at={b(11)} style={{marginTop: 36}}><div style={{fontSize: 34, color: C.body}}>Candle lebih sedikit · lebih sedikit noise · ada waktu mikir</div></Appear>
					<Appear at={b(12)} style={{marginTop: 46}}><Card accent={C.muted} style={{display: 'inline-block', fontSize: 30, color: C.body}}>Catatan: jam candle ikut zona waktu server broker</Card></Appear>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// ---------- S06 CONTEXT ----------
const CTX_L = D.build([[0, 3750], [4, 3760], [8, 3744], [12, 3759], [16, 3745], [19, 3751.5]], {seed: 21, noise: 1.6, wick: 1.1, overrides: {}});
CTX_L.push({o: 3751.5, h: 3752.5, l: 3747, c: 3752.2, v: 1});
const CTX_R = D.build([[0, 3758], [5, 3745.2], [9, 3757], [13, 3745.6], [17, 3755], [19, 3746.5]], {seed: 33, noise: 1.6, wick: 1.1, overrides: {5: {l: 3742.6}, 13: {l: 3742.4}}});
CTX_R.push({o: 3746.5, h: 3747.5, l: 3742, c: 3747.2, v: 1});
export const SCtx: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const a = (k: number) => interpolate(f, [k, k + 12], [0, 1], clamp);
	const chartsOut = useOut(b(10) - 6, 12);
	const late = f >= b(10) - 6;
	const N = CTX_L.length;
	const show = f >= b(4) - 6;
	return (
		<AbsoluteFill>
			<SimBadge />
			{!late && (
				<div style={{opacity: chartsOut}}>
					{!show && (
						<div style={{position: 'absolute', left: 160, top: 260}}>
							<Appear at={b(1)}><Hl text="Ngapalin nama pola?" size={64} /></Appear>
							<div style={{display: 'flex', gap: 20, marginTop: 50}}>
								{['Doji', 'Engulfing', 'Pin bar', 'Hammer'].map((t, i) => (
									<Appear key={t} at={b(2) + i * 8} pop><div style={{fontFamily: MONO, fontSize: 36, border: '1.5px solid rgba(159,168,184,0.5)', borderRadius: 999, padding: '14px 30px', textDecoration: f > b(3) + 10 ? 'line-through' : 'none', color: f > b(3) + 10 ? C.muted : C.text}}>{t}</div></Appear>
								))}
							</div>
							<Appear at={b(3)} style={{marginTop: 50}}><Hl text="Bentuk tanpa lokasi = *nyaris nggak ada artinya.*" size={50} serif /></Appear>
						</div>
					)}
					{show && (
						<>
							{[{d: CTX_L, x: 110, yMin: 3740, yMax: 3764, tag: 'TENGAH RANGE', tagAt: b(6), col: C.muted, zone: false}, {d: CTX_R, x: 990, yMin: 3738, yMax: 3762, tag: 'DI AREA SUPPORT', tagAt: b(7), col: C.gold, zone: true}].map((c, k) => (
								<div key={k} style={{position: 'absolute', left: c.x, top: 250, opacity: a(b(4) + k * 10)}}>
									<Chart data={c.d} reveal={N} yMin={c.yMin} yMax={c.yMax} W={820} H={520} label="XAUUSD · H1 · SIMULASI"
										under={(s) => c.zone ? <Zone s={s} lo={3742} hi={3744.6} from={0} color={C.gold} prog={a(b(7))} label="SUPPORT" labelSide="bottom" /> : null}
										overlay={(s) => (
											<>
												<circle cx={s.x(N - 1)} cy={s.y(c.d[N - 1].l + 2.5)} r={34} fill="none" stroke={C.text} strokeWidth={3} opacity={a(b(5))} />
												<Tag x={s.x(N - 1) - 60} y={s.y(c.d[N - 1].h) - 70} text={c.tag} color={c.col} prog={a(c.tagAt)} />
												{c.zone && <Tag x={s.x(N - 1) - 40} y={s.y(c.d[N - 1].l) + 60} text="DITOLAK" color={C.green} prog={a(b(8))} />}
											</>
										)} />
								</div>
							))}
						</>
					)}
				</div>
			)}
			{late && (
				<AbsoluteFill style={{padding: '210px 160px'}}>
					<Appear at={b(10)}><Badge>URUTANNYA</Badge></Appear>
					<div style={{display: 'flex', gap: 26, marginTop: 34}}>
						{[['1', 'Tandai area penting di H4'], ['2', 'Perhatikan candle di area itu'], ['3', 'Baca tarik-menarik pembeli vs penjual']].map(([n, t], i) => (
							<Appear key={n} at={b(11 + i)} pop style={{flex: 1}}>
								<Card style={{height: 230}}>
									<div style={{fontFamily: MONO, color: C.gold, fontSize: 30, fontWeight: 700}}>{n}</div>
									<div style={{fontSize: 38, fontWeight: 700, marginTop: 18, lineHeight: 1.2}}>{t}</div>
								</Card>
							</Appear>
						))}
					</div>
					<Appear at={b(14)} style={{marginTop: 54}}><Hl text="Candle bukan sinyal. Candle = *bukti kecil.*" size={54} serif /></Appear>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// ---------- S07 RISK ----------
const RISK = D.build([[0, 3762], [5, 3743.4], [8, 3757], [12, 3743.2], [15, 3758], [19, 3746.5]], {seed: 7, noise: 1.5, wick: 1.0, overrides: {5: {l: 3740.8}, 12: {l: 3741}}});
RISK.push({o: 3746.5, h: 3749.2, l: 3740, c: 3748, v: 1});
export const SRisk: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const a = (k: number) => interpolate(f, [k, k + 14], [0, 1], clamp);
	const N = RISK.length;
	const rulesOut = useOut(b(9) - 6, 10);
	const calc = f >= b(9) - 6;
	return (
		<AbsoluteFill>
			<SimBadge />
			<div style={{position: 'absolute', left: 110, top: 220}}>
				<Chart data={RISK} reveal={useReveal(4, b(2), 8, N)} yMin={3734} yMax={3766} W={1040} H={640} label="XAUUSD · H1 · SIMULASI" slots={N + 7}
					under={(s) => <Zone s={s} lo={3740} hi={3743.5} from={0} color={C.gold} prog={1} label="SUPPORT" labelSide="bottom" />}
					overlay={(s) => (
						<>
							<Tag x={s.x(N - 1)} y={s.y(3740) + 52} text="LOW 3.740" color={C.gold} prog={a(b(2))} />
							<HLine s={s} p={3748} color={C.text} label="ENTRY" prog={a(b(3))} dash="2 0" from={N - 3} />
							<HLine s={s} p={3739} color={C.red} label="SL" prog={a(b(4))} from={N - 3} />
							<g opacity={f < b(9) ? 1 : 0.35}>
								<line x1={s.x(N - 1) - 14} x2={s.x(N - 1) + 14} y1={s.y(3744)} y2={s.y(3744)} stroke={C.red} strokeWidth={4} opacity={a(b(6))} />
								<Tag x={s.x(N - 1) - 40} y={s.y(3744)} text="✕ TENGAH SUMBU" color={C.red} prog={a(b(6))} anchor="end" />
							</g>
						</>
					)} />
			</div>
			<div style={{position: 'absolute', right: 90, top: 200, width: 600}}>
				{!calc && (
					<div style={{opacity: rulesOut, display: 'flex', flexDirection: 'column', gap: 18}}>
						<Appear at={b(3)} dx={40} dy={0}><Card><div style={{fontFamily: MONO, fontSize: 22, color: C.muted, fontWeight: 700}}>ENTRY ILUSTRASI</div><div style={{fontSize: 36, fontWeight: 700, marginTop: 8}}>3.748</div></Card></Appear>
						<Appear at={b(4)} dx={40} dy={0}><Card accent={C.red}><div style={{fontFamily: MONO, fontSize: 22, color: C.red, fontWeight: 700}}>STOP LOSS</div><div style={{fontSize: 34, fontWeight: 700, marginTop: 8}}>Low 3.740 − buffer $1 = 3.739</div></Card></Appear>
						<Appear at={b(5)} dx={40} dy={0}><Card accent={C.gold}><div style={{fontFamily: MONO, fontSize: 22, color: C.gold, fontWeight: 700}}>JARAK STOP</div><div style={{fontSize: 44, fontWeight: 700, marginTop: 8}}>$9</div></Card></Appear>
						<Appear at={b(7)} dx={40} dy={0}><div style={{fontSize: 30, color: C.body, lineHeight: 1.35}}>Tengah sumbu = harga <b style={{color: C.text}}>udah pernah ke sana</b>. Gampang kesentuh lagi.</div></Appear>
					</div>
				)}
				{calc && (
					<div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
						<Appear at={b(9)}><Badge>HITUNG LOT · CONTOH</Badge></Appear>
						<Row at={b(10)} k="Modal" v="$5.000" size={30} />
						<Row at={b(10) + 20} k="Risiko 1%" v="$50" size={30} />
						<Row at={b(11)} k="1 lot = 100 oz" v="$100 / $1" size={30} />
						<Row at={b(12)} k="Stop $9 × 1 lot" v="$900" size={30} />
						<Row at={b(13)} k="$50 ÷ $900" v="≈ 0,0556" size={30} />
						<Row at={b(14)} k="Dibulatkan ke bawah" v="0,05 lot" gold size={30} />
						<Row at={b(15)} k="Rugi di SL*" v="≈ $45" size={30} />
						<Appear at={b(15) + 20}><div style={{fontSize: 22, color: C.muted}}>*bisa lebih besar karena slippage / spread melebar</div></Appear>
					</div>
				)}
			</div>
			<div style={{position: 'absolute', left: 110, top: 160, opacity: a(b(16))}}>
				<div style={{fontFamily: MONO, fontSize: 24, color: C.gold, fontWeight: 700, background: 'rgba(7,18,38,0.9)', padding: '8px 18px', borderRadius: 10}}>CANDLE → LOKASI SL · RISIKO % → BATAS RUGI · LOT PALING AKHIR</div>
			</div>
		</AbsoluteFill>
	);
};

// ---------- S08 TASK ----------
export const STask: React.FC<SceneProps> = ({b}) => (
	<List b={b} badge="TUGAS · AKUN DEMO" badgeAt={4} title="Latihan *baca candle*" titleAt={b(0)} mark="check"
		items={['H1 XAUUSD: ambil 10 candle terakhir', 'Catat open, high, low, close', 'Hitung body, range, 2 sumbu · cek jumlahnya', 'Tandai area penting di H4', 'Bandingkan dengan M15']}
		ats={[b(1), b(2), b(3), b(4), b(5)]} footer="Nggak usah buka posisi. Candle = *data*, bukan warna." footerAt={b(6)} />
);

// ---------- S09 SUMMARY ----------
export const SSum: React.FC<SceneProps> = ({b}) => (
	<List b={b} badge="RINGKASAN" badgeAt={4} title="Cara baca *candlestick*" titleAt={b(0)} compact
		items={['4 harga: open, high, low, close', 'Warna = close dibanding open', 'Body ≠ range · body + 2 sumbu = range', '1 candle H1 = 4 candle M15 · mulai H1 & H4', 'Lokasi lebih penting dari bentuk', 'SL di luar sumbu · lot dari risiko']}
		ats={[b(1), b(2), b(3), b(4), b(5), b(6)]} />
);

// ---------- S10 CTA ----------
export const SCta: React.FC<SceneProps> = ({b}) => (
	<AbsoluteFill style={{padding: '150px 160px'}}>
		<Appear at={b(0)}><Card accent={C.muted} style={{fontSize: 30, color: C.body}}>Konten edukasi umum. Trading derivatif berleverage dapat menyebabkan kerugian dan kehilangan modal.</Card></Appear>
		<Appear at={b(2)} style={{marginTop: 60}}>
			<div style={{fontFamily: MONO, color: C.muted, fontSize: 26, letterSpacing: 2}}>JOIN KOMUNITAS TRADING</div>
			<div style={{fontFamily: SANS, fontWeight: 800, fontSize: 110, color: C.gold, letterSpacing: -2, marginTop: 6}}>dhirajkelly.id</div>
		</Appear>
		<Appear at={b(3)} style={{marginTop: 40}}>
			<Card style={{display: 'inline-block', fontSize: 34, fontWeight: 700}}>💬 Dari 10 candle yang lo catat, berapa yang body-nya &lt; setengah range?</Card>
		</Appear>
		<Appear at={b(5)} style={{marginTop: 56}}>
			<div style={{fontFamily: SERIF, fontSize: 44, color: C.text}}>Dr. Dhiraj Kelly Sawlani</div>
			<Appear at={b(6)}><div style={{fontFamily: MONO, fontSize: 26, color: C.gold, marginTop: 10, letterSpacing: 2}}>MANAGE RISK · PROTECT CAPITAL · TRADE SMARTER</div></Appear>
		</Appear>
	</AbsoluteFill>
);

export const SCENES: Record<string, React.FC<SceneProps>> = {
	hook: SHook, roadmap: SMap, ohlc: SOhlc, bodywick: SBody, timeframe: STf, context: SCtx, risk: SRisk, task: STask, summary: SSum, cta: SCta,
};
void Tag; void useIn;
