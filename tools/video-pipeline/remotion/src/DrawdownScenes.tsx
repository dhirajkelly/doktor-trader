// Academy: Manajemen Risiko > Drawdown dan anatomi margin call. All numbers are SIMULASI / CONTOH.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Appear, Badge, C, Card, Hl, MONO, SANS, SERIF, useIn, useOut} from './ui';

export type SceneProps = {b: (k: number) => number; dur: number};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const AMBER = '#F2B84B';
const usd = (v: number) => '$' + Math.round(v).toLocaleString('de-DE');

const SimBadge: React.FC<{text?: string; at?: number}> = ({text = 'SIMULASI · EDUKASI · BUKAN SINYAL', at = 0}) => (
	<div style={{position: 'absolute', left: 110, top: 104}}>
		<Appear at={at}><Badge color={C.muted}>{text}</Badge></Appear>
	</div>
);

const Row: React.FC<{at: number; k: string; v: string; color?: string; size?: number}> = ({at, k, v, color, size = 32}) => (
	<Appear at={at} dx={30} dy={0}>
		<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20, padding: '12px 22px', borderRadius: 14, background: color ? 'rgba(201,162,74,0.10)' : 'rgba(20,40,80,0.85)', border: `1.5px solid ${color ?? 'rgba(159,168,184,0.25)'}`}}>
			<div style={{fontSize: size - 6, color: C.body}}>{k}</div>
			<div style={{fontFamily: MONO, fontSize: size, fontWeight: 700, color: color ?? C.text, whiteSpace: 'nowrap'}}>{v}</div>
		</div>
	</Appear>
);

const List: React.FC<{badge: string; badgeAt: number; title: string; titleAt: number; items: string[]; ats: number[]; mark?: 'num' | 'check'; footer?: string; footerAt?: number; compact?: boolean}> = ({badge, badgeAt, title, titleAt, items, ats, mark = 'num', footer, footerAt = 0, compact}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{padding: compact ? '110px 160px' : '130px 160px'}}>
			<Appear at={badgeAt}><Badge>{badge}</Badge></Appear>
			<Appear at={titleAt} style={{marginTop: 20}}><Hl text={title} size={compact ? 56 : 62} /></Appear>
			<div style={{marginTop: compact ? 26 : 36, display: 'flex', flexDirection: 'column', gap: compact ? 12 : 18, maxWidth: 1250}}>
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

const CAUSES = ['Lot terlalu besar', 'Tanpa stop loss', 'Averaging posisi rugi', 'Menolak rugi kecil'];

// ---------- S01 HOOK ----------
export const SHook: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const shrink = interpolate(f, [8, 34], [1000, 500], clamp);
	const regrow = f < b(2) ? 500 : f < b(3) ? interpolate(f, [b(2), b(2) + 20], [500, 750], clamp) : interpolate(f, [b(3), b(3) + 20], [750, 1000], clamp);
	const val = f < b(2) ? shrink : regrow;
	const out1 = useOut(b(4) - 8, 12);
	const H = 430;
	const hBar = (v: number) => (v / 1000) * H;
	const ok = f >= b(3) + 20;
	const midIn = useIn(b(4) - 4);
	const midOut = useOut(b(7) - 6);
	return (
		<AbsoluteFill>
			{f < b(4) + 6 && (
				<div style={{opacity: out1}}>
					<SimBadge />
					<div style={{position: 'absolute', left: 150, top: 280, width: 420, height: H + 80}}>
						<div style={{position: 'absolute', bottom: 60, left: 60, width: 300, height: H, border: '2px dashed rgba(159,168,184,0.35)', borderRadius: 16}} />
						<div style={{position: 'absolute', bottom: 60, left: 60, width: 300, height: hBar(val), background: ok ? C.green : val < 999 ? (f < b(2) ? C.red : AMBER) : C.gold, borderRadius: 16, transition: 'none'}} />
						<div style={{position: 'absolute', bottom: 60 + hBar(val) + 14, left: 0, width: 420, textAlign: 'center', fontFamily: MONO, fontSize: 56, fontWeight: 700, color: C.text}}>{usd(val)}</div>
						<div style={{position: 'absolute', bottom: 0, left: 0, width: 420, textAlign: 'center', fontFamily: MONO, fontSize: 24, color: C.muted}}>MODAL AKUN · CONTOH</div>
					</div>
					<div style={{position: 'absolute', left: 700, top: 230, width: 760, display: 'flex', flexDirection: 'column', gap: 26}}>
						<Appear at={4}><Hl text="Turun *50%*." size={84} /></Appear>
						<Appear at={b(1)}><Hl text="Naik berapa % buat *balik modal*?" size={52} /></Appear>
						<Appear at={b(2)} dx={40} dy={0}><Card accent={C.red}><div style={{display: 'flex', justifyContent: 'space-between', fontSize: 40, fontWeight: 700}}><span>+50% dari $500</span><span style={{fontFamily: MONO, color: C.red}}>$750 ✗</span></div></Card></Appear>
						<Appear at={b(3)} dx={40} dy={0} pop><Card accent={C.green}><div style={{display: 'flex', justifyContent: 'space-between', fontSize: 40, fontWeight: 700}}><span>+100% dari $500</span><span style={{fontFamily: MONO, color: C.green}}>$1.000 ✓</span></div></Card></Appear>
					</div>
				</div>
			)}
			{f >= b(4) - 8 && f < b(7) + 6 && (
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: midIn * midOut}}>
					<Appear at={b(4)} pop>
						<div style={{border: `6px solid ${C.red}`, color: C.red, fontFamily: MONO, fontWeight: 700, fontSize: 120, padding: '10px 48px', borderRadius: 18, transform: 'rotate(-4deg)', letterSpacing: 6}}>MARGIN CALL</div>
					</Appear>
					<Appear at={b(5)} style={{marginTop: 60}}><Hl text="Bukan *kecelakaan*." size={72} serif /></Appear>
					<Appear at={b(6)} style={{marginTop: 16}}><div style={{fontSize: 40, color: C.muted}}>Bukan karena market jahat.</div></Appear>
				</AbsoluteFill>
			)}
			{f >= b(7) - 6 && (
				<AbsoluteFill style={{padding: '200px 110px'}}>
					<Appear at={b(7)}><Hl text="*4 keputusan kecil* yang diulang-ulang" size={64} /></Appear>
					<div style={{display: 'flex', gap: 26, marginTop: 50}}>
						{CAUSES.map((t, i) => (
							<Appear key={t} at={b(7) + 20 + i * 12} pop style={{flex: 1}}>
								<Card accent={C.red} style={{height: 200}}>
									<div style={{fontFamily: MONO, color: C.red, fontSize: 28, fontWeight: 700}}>0{i + 1}</div>
									<div style={{fontSize: 40, fontWeight: 700, marginTop: 18}}>{t}</div>
								</Card>
							</Appear>
						))}
					</div>
					<Appear at={b(8)} style={{marginTop: 44}}><div style={{fontFamily: MONO, fontSize: 30, color: C.gold, letterSpacing: 2}}>MATEMATIKA DRAWDOWN · ANATOMI MARGIN CALL · PAGAR PENGAMAN</div></Appear>
					<Appear at={b(10)} style={{marginTop: 34}}><Hl text="Bukan sial. *Bisa dihitung.*" size={56} serif /></Appear>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// ---------- S02 MAP ----------
export const SMap: React.FC<SceneProps> = ({b}) => (
	<>
		<div style={{position: 'absolute', right: 110, top: 136}}><Appear at={b(1)}><Badge color={C.muted}>SEMUA CHART & ANGKA = SIMULASI · BUKAN SINYAL</Badge></Appear></div>
		<List badge="MANAJEMEN RISIKO · MATERI 4" badgeAt={b(2)} title="Drawdown & anatomi *margin call*" titleAt={4}
			items={['Apa itu drawdown & cara mengukurnya', 'Matematika pemulihan: turun vs naik', 'Di dalam akun saat margin call', 'Empat penyebab yang muncul bareng', 'Pagar pengaman & checklist']}
			ats={[b(4), b(5), b(6), b(7), b(8)]} />
	</>
);

// ---------- S03 DRAWDOWN ----------
const EQ = [1000, 1030, 1010, 1070, 1090, 1060, 1130, 1160, 1200, 1150, 1170, 1090, 1040, 1060, 980, 940, 900];
export const SDd: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const W = 1050, H = 520, yMin = 850, yMax = 1250;
	const x = (i: number) => 40 + (i / (EQ.length - 1)) * (W - 120);
	const y = (v: number) => H - ((v - yMin) / (yMax - yMin)) * H;
	const draw = f < b(4) ? interpolate(f, [b(3), b(3) + 12], [0, 0.5], clamp) : f < b(5) ? interpolate(f, [b(4), b(4) + 50], [0.5, 8], clamp) : interpolate(f, [b(5), b(5) + 50], [8, EQ.length - 1], clamp);
	const pts: string[] = [];
	for (let i = 0; i <= Math.floor(draw); i++) pts.push(`${x(i)},${y(EQ[i])}`);
	const fr = draw - Math.floor(draw);
	const i0 = Math.floor(draw);
	if (i0 < EQ.length - 1 && fr > 0) pts.push(`${x(i0 + fr)},${y(EQ[i0] + (EQ[i0 + 1] - EQ[i0]) * fr)}`);
	const peakA = interpolate(f, [b(4) + 40, b(4) + 52], [0, 1], clamp);
	const lowA = interpolate(f, [b(5) + 46, b(5) + 58], [0, 1], clamp);
	const ddA = interpolate(f, [b(7), b(7) + 14], [0, 1], clamp);
	return (
		<AbsoluteFill>
			<SimBadge />
			<div style={{position: 'absolute', left: 110, top: 170, width: 1100}}>
				<Appear at={4}><Hl text="Drawdown = turun dari *titik tertinggi*" size={52} /></Appear>
			</div>
			<div style={{position: 'absolute', left: 90, top: 300}}>
				<div style={{fontFamily: MONO, fontSize: 20, color: C.muted, marginLeft: 40, marginBottom: 8}}>EQUITY AKUN · SIMULASI</div>
				<svg width={W} height={H} style={{overflow: 'visible'}}>
					{[900, 1000, 1100, 1200].map((v) => (
						<g key={v}>
							<line x1={0} x2={W - 60} y1={y(v)} y2={y(v)} stroke="rgba(159,168,184,0.12)" />
							<text x={W - 50} y={y(v) + 7} fill={C.muted} fontFamily={MONO} fontSize={19}>{usd(v)}</text>
						</g>
					))}
					<line x1={0} x2={W - 60} y1={y(1000)} y2={y(1000)} stroke={C.muted} strokeDasharray="4 8" opacity={interpolate(f, [b(3), b(3) + 10], [0, 0.8], clamp)} />
					<polyline points={pts.join(' ')} fill="none" stroke={C.gold} strokeWidth={5} strokeLinejoin="round" />
					<g opacity={peakA}>
						<line x1={x(8)} x2={W - 60} y1={y(1200)} y2={y(1200)} stroke={C.green} strokeWidth={2.5} strokeDasharray="10 7" />
						<circle cx={x(8)} cy={y(1200)} r={10} fill={C.green} />
						<text x={x(8) - 20} y={y(1200) - 22} fill={C.green} fontFamily={MONO} fontWeight={700} fontSize={26} textAnchor="end">PUNCAK $1.200</text>
					</g>
					<g opacity={lowA}>
						<circle cx={x(16)} cy={y(900)} r={10} fill={C.red} />
						<text x={x(16) - 24} y={y(900) + 9} fill={C.red} fontFamily={MONO} fontWeight={700} fontSize={26} textAnchor="end">$900</text>
					</g>
					<g opacity={ddA}>
						<line x1={x(16) + 30} x2={x(16) + 30} y1={y(1200) + 8} y2={y(900) - 8} stroke={C.red} strokeWidth={4} />
						<path d={`M ${x(16) + 20} ${y(900) - 22} L ${x(16) + 30} ${y(900) - 6} L ${x(16) + 40} ${y(900) - 22}`} fill="none" stroke={C.red} strokeWidth={4} />
					</g>
				</svg>
			</div>
			<div style={{position: 'absolute', right: 110, top: 300, width: 560, display: 'flex', flexDirection: 'column', gap: 20}}>
				{f < b(10) ? (
					<>
						<Appear at={b(6)} dx={30} dy={0}><Card accent={C.red}><div style={{fontSize: 28, color: C.muted}}>Dari modal awal $1.000</div><div style={{fontSize: 40, fontWeight: 700, marginTop: 6, textDecoration: f > b(7) ? 'line-through' : 'none', color: f > b(7) ? C.muted : C.text}}>"Cuma rugi 10%"</div></Card></Appear>
						<Appear at={b(7)} dx={30} dy={0} pop><Card accent={C.gold}><div style={{fontSize: 28, color: C.muted}}>Dari puncak $1.200</div><div style={{fontFamily: MONO, fontSize: 34, fontWeight: 700, marginTop: 8}}>(1.200 − 900) ÷ 1.200</div><div style={{fontFamily: MONO, fontSize: 64, fontWeight: 700, color: C.gold, marginTop: 6}}>DD 25%</div></Card></Appear>
						<Appear at={b(9)} dx={30} dy={0}><div style={{fontSize: 30, color: C.body, lineHeight: 1.35}}>$300 itu tadinya sudah ada di akun.</div></Appear>
					</>
				) : (
					<>
						<Appear at={b(10)} dx={30} dy={0}><Badge>2 ANGKA YANG DIPANTAU</Badge></Appear>
						<Appear at={b(11)} dx={30} dy={0}><Card><div style={{fontFamily: MONO, color: C.gold, fontSize: 24}}>01</div><div style={{fontSize: 38, fontWeight: 700, marginTop: 6}}>Drawdown sekarang</div></Card></Appear>
						<Appear at={b(12)} dx={30} dy={0}><Card accent={C.gold}><div style={{fontFamily: MONO, color: C.gold, fontSize: 24}}>02</div><div style={{fontSize: 38, fontWeight: 700, marginTop: 6}}>Maximum drawdown</div><div style={{fontSize: 26, color: C.muted, marginTop: 8}}>Cermin paling jujur dari manajemen risiko</div></Card></Appear>
					</>
				)}
			</div>
		</AbsoluteFill>
	);
};

// ---------- S04 RECOVERY MATH ----------
const ROWS: [number, number][] = [[10, 11], [25, 33], [50, 100], [75, 300], [90, 900]];
export const SMath: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const ats = [b(2), b(4), b(5), b(7), b(8)];
	return (
		<AbsoluteFill>
			<SimBadge text="MATEMATIKA · BERLAKU UNTUK SEMUA AKUN" />
			<div style={{position: 'absolute', left: 110, top: 170}}>
				<Appear at={4}><Hl text="Turun dan naik itu *nggak simetris*" size={56} /></Appear>
			</div>
			<div style={{position: 'absolute', left: 110, top: 290, width: 1080}}>
				<div style={{display: 'flex', fontFamily: MONO, fontSize: 24, color: C.muted, padding: '0 24px 10px', opacity: useIn(b(2) - 10)}}>
					<div style={{width: 200}}>TURUN</div><div style={{width: 250}}>BUTUH NAIK</div><div>BEBAN PEMULIHAN</div>
				</div>
				<div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
					{ROWS.map(([d, n], i) => {
						const w = interpolate(f, [ats[i] + 6, ats[i] + 30], [0, Math.min(n, 300) / 300], clamp) * 470;
						const col = n <= 11 ? C.green : n <= 33 ? AMBER : C.red;
						const hot = d === 50;
						return (
							<Appear key={d} at={ats[i]} dx={-30} dy={0}>
								<div style={{display: 'flex', alignItems: 'center', padding: '14px 24px', borderRadius: 16, background: hot ? 'rgba(201,162,74,0.14)' : 'rgba(20,40,80,0.85)', border: `1.5px solid ${hot ? C.gold : 'rgba(159,168,184,0.25)'}`}}>
									<div style={{width: 200, fontFamily: MONO, fontSize: 44, fontWeight: 700, color: C.text}}>−{d}%</div>
									<div style={{width: 250, fontFamily: MONO, fontSize: 44, fontWeight: 700, color: col}}>+{n}%</div>
									<div style={{height: 26, width: w, background: col, borderRadius: 13}} />
									{n > 300 && <div style={{fontFamily: MONO, fontSize: 30, color: C.red, marginLeft: 10, whiteSpace: 'nowrap', opacity: interpolate(f, [ats[i] + 30, ats[i] + 40], [0, 1], clamp)}}>→ 3x</div>}
								</div>
							</Appear>
						);
					})}
				</div>
			</div>
			<div style={{position: 'absolute', right: 110, top: 300, width: 520, display: 'flex', flexDirection: 'column', gap: 22}}>
				<Appear at={b(10)} dx={30} dy={0}><Card accent={C.gold}><div style={{fontFamily: MONO, fontSize: 22, color: C.gold}}>RUMUS</div><div style={{fontSize: 34, fontWeight: 700, marginTop: 10, lineHeight: 1.3}}>Butuh naik = % turun ÷ % sisa modal</div></Card></Appear>
				<Appear at={b(11)} dx={30} dy={0}><Card><div style={{fontFamily: MONO, fontSize: 40, fontWeight: 700}}>50 ÷ 50 = <span style={{color: C.gold}}>100%</span></div></Card></Appear>
				<Appear at={b(13)} dx={30} dy={0}><div style={{fontSize: 30, color: C.body, lineHeight: 1.35}}>Setelah rugi, modal lebih kecil. % yang sama = dolar lebih sedikit.</div></Appear>
				<Appear at={b(16)} dx={30} dy={0}><Hl text="Tugas utama: jaga drawdown *jauh dari zona merah*." size={38} serif /></Appear>
			</div>
		</AbsoluteFill>
	);
};

// ---------- S05 LOSING STREAK ----------
const Spark: React.FC<{r: number; prog: number; color: string}> = ({r, prog, color}) => {
	const W = 420, H = 110;
	const pts: string[] = [];
	const n = Math.floor(prog * 10);
	for (let i = 0; i <= n; i++) pts.push(`${(i / 10) * W},${H - (Math.pow(1 - r, i) * 1000 - 300) / 700 * H}`);
	return (
		<svg width={W} height={H} style={{overflow: 'visible'}}>
			<line x1={0} x2={W} y1={0} y2={0} stroke="rgba(159,168,184,0.25)" strokeDasharray="4 6" />
			<polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={4} />
		</svg>
	);
};
export const SStreak: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const T: {r: number; at: number; left: string; need: string; color: string; atL: number; atN: number}[] = [
		{r: 0.01, at: b(4), atL: b(5), atN: b(6), left: '$904', need: '+11%', color: C.green},
		{r: 0.05, at: b(7), atL: b(8), atN: b(9), left: '$599', need: '+67%', color: AMBER},
		{r: 0.1, at: b(10), atL: b(11), atN: b(12), left: '$349', need: '+187%', color: C.red},
	];
	return (
		<AbsoluteFill>
			<SimBadge />
			<div style={{position: 'absolute', left: 110, top: 170, width: 1700}}>
				<Appear at={b(1)}><Hl text="Modal sama *$1.000* · sama-sama kalah *10x beruntun*" size={52} /></Appear>
				<Appear at={b(3)} style={{marginTop: 12}}><div style={{fontSize: 32, color: C.muted}}>Bedanya cuma risiko per posisi.</div></Appear>
			</div>
			<div style={{position: 'absolute', left: 110, right: 110, top: 360, display: 'flex', gap: 30}}>
				{T.map((t, i) => {
					const prog = interpolate(f, [t.atL - 30, t.atL + 10], [0, 1], clamp);
					return (
						<Appear key={i} at={t.at} pop style={{flex: 1}}>
							<Card accent={t.color} style={{height: 440}}>
								<div style={{fontFamily: MONO, fontSize: 24, color: C.muted}}>TRADER {i + 1}</div>
								<div style={{fontSize: 44, fontWeight: 700, marginTop: 6}}>Risiko <span style={{color: t.color, fontFamily: MONO}}>{Math.round(t.r * 100)}%</span></div>
								<div style={{marginTop: 16}}><Spark r={t.r} prog={prog} color={t.color} /></div>
								<div style={{display: 'flex', justifyContent: 'space-between', marginTop: 20, opacity: interpolate(f, [t.atL, t.atL + 10], [0, 1], clamp)}}>
									<span style={{fontSize: 28, color: C.body}}>Sisa</span><span style={{fontFamily: MONO, fontSize: 44, fontWeight: 700}}>{t.left}</span>
								</div>
								<div style={{display: 'flex', justifyContent: 'space-between', marginTop: 8, opacity: interpolate(f, [t.atN, t.atN + 10], [0, 1], clamp)}}>
									<span style={{fontSize: 28, color: C.body}}>Butuh naik</span><span style={{fontFamily: MONO, fontSize: 44, fontWeight: 700, color: t.color}}>{t.need}</span>
								</div>
							</Card>
						</Appear>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: 110, bottom: 190}}>
				<Appear at={b(15)}><Hl text="Strategi sama. Kekalahan sama. Yang beda: *ukuran risiko*." size={44} serif /></Appear>
			</div>
		</AbsoluteFill>
	);
};

// ---------- S06 MARGIN CALL ANATOMY ----------
export const SMc: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const sim = f >= b(9) - 6;
	const d = f < b(14) ? 0 : f < b(17) ? interpolate(f, [b(14), b(15)], [0, 12.5], clamp) : interpolate(f, [b(17), b(18)], [12.5, 16.25], clamp);
	const eq = 1000 - 50 * d;
	const lvl = (eq / 375) * 100;
	const st = lvl <= 50.5 ? 'STOP OUT' : lvl <= 100.5 ? 'MARGIN CALL' : 'AMAN';
	const stc = st === 'STOP OUT' ? C.red : st === 'MARGIN CALL' ? AMBER : C.green;
	const out1 = useOut(b(9) - 8, 10);
	const simA = useIn(b(9) - 4);
	// price path chart
	const W = 820, H = 470, pMin = 3730, pMax = 3754;
	const y = (p: number) => H - ((p - pMin) / (pMax - pMin)) * H;
	const N = 60;
	const prog = interpolate(f, [b(13), b(18)], [0, 1], clamp);
	const pts: string[] = [];
	for (let i = 0; i <= N; i++) {
		const t = i / N;
		if (t > prog) break;
		const base = 3750 - 16.25 * Math.pow(t, 1.3);
		const wig = Math.sin(i * 1.7) * 0.9 * (1 - t * 0.5);
		pts.push(`${40 + t * (W - 160)},${y(i === 0 ? 3750 : base + wig)}`);
	}
	return (
		<AbsoluteFill>
			{!sim || f < b(9) + 4 ? (
				<div style={{opacity: out1}}>
					<div style={{position: 'absolute', left: 110, top: 170}}><Appear at={4}><Hl text="Di dalam akun saat *margin call*" size={56} /></Appear></div>
					<div style={{position: 'absolute', left: 110, top: 300, width: 1050, display: 'flex', flexDirection: 'column', gap: 18}}>
						<Appear at={b(3)} dx={-30} dy={0}><Card><div style={{fontFamily: MONO, color: C.gold, fontSize: 26, fontWeight: 700}}>EQUITY</div><div style={{fontSize: 34, marginTop: 6}}>Saldo ± floating</div></Card></Appear>
						<Appear at={b(4)} dx={-30} dy={0}><Card><div style={{fontFamily: MONO, color: C.gold, fontSize: 26, fontWeight: 700}}>USED MARGIN</div><div style={{fontSize: 34, marginTop: 6}}>Jaminan yang dikunci untuk posisi terbuka</div></Card></Appear>
						<Appear at={b(5)} dx={-30} dy={0}><Card accent={C.gold}><div style={{fontFamily: MONO, color: C.gold, fontSize: 26, fontWeight: 700}}>MARGIN LEVEL</div><div style={{fontFamily: MONO, fontSize: 38, fontWeight: 700, marginTop: 6}}>Equity ÷ Used margin × 100%</div></Card></Appear>
					</div>
					<div style={{position: 'absolute', right: 110, top: 300, width: 520, display: 'flex', flexDirection: 'column', gap: 18}}>
						<Appear at={b(6)} dx={30} dy={0}><Badge color={C.muted}>BATAS TIAP BROKER BERBEDA</Badge></Appear>
						<Appear at={b(7)} dx={30} dy={0}><Card accent={AMBER}><div style={{fontSize: 26, color: C.muted}}>CONTOH</div><div style={{fontSize: 36, fontWeight: 700, marginTop: 4}}>Margin call <span style={{fontFamily: MONO, color: AMBER}}>100%</span></div></Card></Appear>
						<Appear at={b(7) + 20} dx={30} dy={0}><Card accent={C.red}><div style={{fontSize: 26, color: C.muted}}>CONTOH</div><div style={{fontSize: 36, fontWeight: 700, marginTop: 4}}>Stop out <span style={{fontFamily: MONO, color: C.red}}>50%</span></div></Card></Appear>
						<Appear at={b(8)} dx={30} dy={0}><div style={{fontSize: 28, color: C.body}}>Cek angka pastinya di ketentuan akun lo.</div></Appear>
					</div>
				</div>
			) : null}
			{sim && (
				<AbsoluteFill style={{opacity: simA}}>
					<SimBadge />
					<div style={{position: 'absolute', left: 110, top: 160, display: 'flex', gap: 16}}>
						<Appear at={b(10)}><Badge>MODAL $1.000 · LEVERAGE 1:500</Badge></Appear>
						<Appear at={b(11)}><Badge>BUY XAUUSD 0,5 LOT @ 3.750 (CONTOH)</Badge></Appear>
					</div>
					<div style={{position: 'absolute', left: 90, top: 260}}>
						<svg width={W} height={H} style={{overflow: 'visible'}}>
							{[3735, 3740, 3745, 3750].map((p) => (
								<g key={p}><line x1={0} x2={W - 100} y1={y(p)} y2={y(p)} stroke="rgba(159,168,184,0.12)" /><text x={W - 90} y={y(p) + 7} fill={C.muted} fontFamily={MONO} fontSize={19}>{p.toLocaleString('de-DE')}</text></g>
							))}
							<g opacity={interpolate(f, [b(14), b(14) + 12], [0, 1], clamp)}>
								<line x1={0} x2={W - 100} y1={y(3737.5)} y2={y(3737.5)} stroke={AMBER} strokeWidth={2.5} strokeDasharray="10 7" />
								<text x={10} y={y(3737.5) - 12} fill={AMBER} fontFamily={MONO} fontWeight={700} fontSize={22}>MARGIN CALL ≈ −$12</text>
							</g>
							<g opacity={interpolate(f, [b(17), b(17) + 12], [0, 1], clamp)}>
								<line x1={0} x2={W - 100} y1={y(3733.75)} y2={y(3733.75)} stroke={C.red} strokeWidth={2.5} strokeDasharray="10 7" />
								<text x={10} y={y(3733.75) + 30} fill={C.red} fontFamily={MONO} fontWeight={700} fontSize={22}>STOP OUT ≈ −$16</text>
							</g>
							<polyline points={pts.join(' ')} fill="none" stroke={C.gold} strokeWidth={4} />
						</svg>
					</div>
					<div style={{position: 'absolute', right: 110, top: 260, width: 640}}>
						<Card accent={stc}>
							<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
								<div style={{fontFamily: MONO, fontSize: 24, color: C.muted}}>AKUN · SIMULASI</div>
								<div style={{fontFamily: MONO, fontSize: 24, fontWeight: 700, color: stc, border: `2px solid ${stc}`, borderRadius: 999, padding: '4px 14px'}}>{st}</div>
							</div>
							<div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 18}}>
								<Row at={b(10)} k="Balance" v="$1.000" />
								<Row at={b(12)} k="Used margin" v="$375" />
								<Row at={b(13)} k="Harga turun" v={`$${d.toFixed(2).replace('.', ',')}`} />
								<Row at={b(13)} k="Equity" v={usd(eq)} color={stc} />
								<Row at={b(13)} k="Margin level" v={`${Math.round(lvl)}%`} color={stc} size={40} />
							</div>
							<Appear at={b(13)}><div style={{fontSize: 24, color: C.muted, marginTop: 14}}>$1 gerakan = $50 di akun</div></Appear>
						</Card>
					</div>
					{f >= b(22) - 4 && (
						<div style={{position: 'absolute', left: 110, bottom: 180}}>
							<Appear at={b(22)} pop><Card accent={C.red}><div style={{fontSize: 44, fontWeight: 700}}>Stop out <span style={{color: C.red}}>≠</span> stop loss</div><div style={{fontSize: 28, color: C.muted, marginTop: 6}}>Ditutup sistem, di harga yang bukan pilihan lo</div></Card></Appear>
						</div>
					)}
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// ---------- S07 LOT TOO BIG ----------
export const SLot: React.FC<SceneProps> = ({b}) => (
	<AbsoluteFill>
		<SimBadge />
		<div style={{position: 'absolute', left: 110, top: 170}}><Appear at={4}><Badge>PENYEBAB 1</Badge></Appear><Appear at={b(1)} style={{marginTop: 16}}><Hl text="Lot *terlalu besar*" size={64} /></Appear></div>
		<div style={{position: 'absolute', left: 110, right: 110, top: 380, display: 'flex', gap: 30}}>
			<Appear at={b(4)} pop style={{flex: 1}}>
				<Card accent={C.red} style={{height: 380}}>
					<div style={{fontFamily: MONO, fontSize: 26, color: C.red, fontWeight: 700}}>0,5 LOT · AKUN $1.000</div>
					<div style={{fontFamily: MONO, fontSize: 56, fontWeight: 700, marginTop: 20}}>$1 = $50</div>
					<div style={{fontSize: 34, color: C.body, marginTop: 8}}>= 5% modal per $1 gerakan</div>
					<Appear at={b(9)}><div style={{fontSize: 34, fontWeight: 700, marginTop: 28, color: C.red}}>Turun $16 → stop out</div></Appear>
				</Card>
			</Appear>
			<Appear at={b(6)} pop style={{flex: 1}}>
				<Card accent={C.green} style={{height: 380}}>
					<div style={{fontFamily: MONO, fontSize: 26, color: C.green, fontWeight: 700}}>LOT DARI RISIKO 1%</div>
					<Appear at={b(7)}><div style={{fontFamily: MONO, fontSize: 38, fontWeight: 700, marginTop: 20}}>$10 ÷ ($5 SL × 100) = <span style={{color: C.green}}>0,02</span></div></Appear>
					<Appear at={b(8)}><div style={{fontSize: 34, color: C.body, marginTop: 12}}>$1 gerakan = $2 di akun</div></Appear>
					<Appear at={b(9) + 20}><div style={{fontSize: 34, fontWeight: 700, marginTop: 28, color: C.green}}>Keluar di SL ≈ −$10</div></Appear>
				</Card>
			</Appear>
		</div>
		<div style={{position: 'absolute', left: 110, bottom: 190}}><Appear at={b(10)}><Hl text="Lot bukan soal keyakinan. *Lot itu hasil hitungan.*" size={44} serif /></Appear></div>
	</AbsoluteFill>
);

// ---------- S08 NO STOP LOSS ----------
export const SNoSl: React.FC<SceneProps> = ({b}) => {
	const steps: [number, string, string, string][] = [
		[b(5), 'Floating minus kecil', '"Nanti juga balik."', AMBER],
		[b(6), 'Minus makin besar', '"Sayang kalau di-cut."', '#E8875A'],
		[b(7), 'Sistem yang memutuskan', 'STOP OUT', C.red],
	];
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 110, top: 170}}><Appear at={4}><Badge>PENYEBAB 2</Badge></Appear><Appear at={b(0) + 10} style={{marginTop: 16}}><Hl text="Tanpa *stop loss*" size={64} /></Appear></div>
			<div style={{position: 'absolute', right: 110, top: 190, width: 700}}><Appear at={b(2)}><Hl text="Harapan nggak punya *level harga*." size={46} serif /></Appear></div>
			<div style={{position: 'absolute', left: 110, right: 110, top: 400, display: 'flex', gap: 24, alignItems: 'stretch'}}>
				{steps.map(([at, t, q, col], i) => (
					<React.Fragment key={t}>
						<Appear at={at} pop style={{flex: 1}}>
							<Card accent={col} style={{height: 230}}>
								<div style={{fontFamily: MONO, fontSize: 24, color: col, fontWeight: 700}}>0{i + 1}</div>
								<div style={{fontSize: 36, fontWeight: 700, marginTop: 10}}>{t}</div>
								<div style={{fontSize: 34, marginTop: 12, color: i === 2 ? C.red : C.body, fontFamily: i === 2 ? MONO : SANS, fontWeight: i === 2 ? 700 : 400}}>{q}</div>
							</Card>
						</Appear>
						{i < 2 && <Appear at={steps[i + 1][0]} style={{alignSelf: 'center'}}><div style={{fontSize: 56, color: C.muted}}>→</div></Appear>}
					</React.Fragment>
				))}
			</div>
			<div style={{position: 'absolute', left: 110, right: 110, top: 680, display: 'flex', gap: 30}}>
				<Appear at={b(8)} style={{flex: 1}}><Card accent={C.green}><div style={{fontSize: 34, fontWeight: 700}}>Stop loss = keputusan saat <span style={{color: C.green}}>kepala dingin</span>, sebelum entry</div></Card></Appear>
				<Appear at={b(10)} style={{flex: 1}}><Card accent={AMBER}><div style={{fontFamily: MONO, fontSize: 22, color: AMBER}}>CATATAN</div><div style={{fontSize: 30, marginTop: 6}}>SL bisa kena slippage saat berita/gap. Rugi aktual bisa sedikit lebih besar.</div></Card></Appear>
			</div>
		</AbsoluteFill>
	);
};

// ---------- S09 AVERAGING ----------
export const SAvg: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const W = 860, H = 500, pMin = 3726, pMax = 3754;
	const y = (p: number) => H - ((p - pMin) / (pMax - pMin)) * H;
	const E: [number, number][] = [[b(3), 3750], [b(4), 3745], [b(5), 3740], [b(6), 3735]];
	const keys: [number, number][] = [[b(3), 3750], [b(4), 3745], [b(5), 3740], [b(6), 3735], [b(11), 3730]];
	let price = 3750;
	for (let k = 0; k < keys.length - 1; k++) if (f >= keys[k][0]) price = interpolate(f, [keys[k + 1][0] - 40, keys[k + 1][0]], [keys[k][1], keys[k + 1][1]], clamp);
	const n = E.filter(([at]) => f >= at).length;
	const xp = (p: number) => 60 + ((3750 - p) / 20) * (W - 220);
	const avgA = interpolate(f, [b(7), b(7) + 12], [0, 1], clamp);
	const floating = f >= b(11) ? -500 : null;
	return (
		<AbsoluteFill>
			<SimBadge />
			<div style={{position: 'absolute', left: 110, top: 160}}><Appear at={4}><Badge>PENYEBAB 3</Badge></Appear><Appear at={b(0) + 10} style={{marginTop: 14}}><Hl text="Averaging *posisi rugi*" size={60} /></Appear></div>
			{f < b(13) ? (
				<>
					<div style={{position: 'absolute', left: 90, top: 340}}>
						<svg width={W} height={H} style={{overflow: 'visible'}}>
							{[3730, 3735, 3740, 3745, 3750].map((p) => (
								<g key={p}><line x1={0} x2={W - 110} y1={y(p)} y2={y(p)} stroke="rgba(159,168,184,0.12)" /><text x={W - 100} y={y(p) + 7} fill={C.muted} fontFamily={MONO} fontSize={19}>{p.toLocaleString('de-DE')}</text></g>
							))}
							<line x1={60} x2={xp(price)} y1={y(3750)} y2={y(price)} stroke={C.gold} strokeWidth={4} />
							<circle cx={xp(price)} cy={y(price)} r={9} fill={C.text} />
							{E.map(([at, p], i) => (
								<g key={p} opacity={interpolate(f, [at, at + 10], [0, 1], clamp)}>
									<circle cx={xp(p)} cy={y(p)} r={13} fill={C.green} />
									<text x={xp(p)} y={y(p) - 22} textAnchor="middle" fill={C.green} fontFamily={MONO} fontWeight={700} fontSize={22}>BUY {i + 1}</text>
								</g>
							))}
							<g opacity={avgA}>
								<line x1={0} x2={W - 110} y1={y(3742.5)} y2={y(3742.5)} stroke={C.blue} strokeWidth={2.5} strokeDasharray="10 7" />
								<text x={W - 120} y={y(3742.5) + 32} textAnchor="end" fill={C.blue} fontFamily={MONO} fontWeight={700} fontSize={22}>RATA-RATA 3.742,5</text>
							</g>
						</svg>
					</div>
					<div style={{position: 'absolute', right: 110, top: 340, width: 600, display: 'flex', flexDirection: 'column', gap: 14}}>
						<Row at={b(3)} k="Ukuran posisi" v={`${(n * 0.1).toFixed(1).replace('.', ',')} lot`} color={n >= 4 && f >= b(9) ? C.red : undefined} size={40} />
						<Row at={b(3)} k="$1 gerakan" v={`$${n * 10}`} color={n >= 4 && f >= b(10) ? C.red : undefined} size={40} />
						{floating !== null && <Row at={b(11)} k="Floating @ 3.730" v="−$500" color={C.red} size={44} />}
						<Appear at={b(12)}><div style={{fontSize: 34, fontWeight: 700, color: C.red, marginTop: 8}}>Setengah modal.</div></Appear>
					</div>
				</>
			) : (
				<div style={{position: 'absolute', left: 110, right: 110, top: 360, display: 'flex', gap: 30}}>
					<Appear at={b(13) - 4} pop style={{flex: 1}}><Card accent={C.red} style={{height: 330}}><div style={{fontFamily: MONO, fontSize: 24, color: C.red, fontWeight: 700}}>AVERAGING 4X</div><div style={{fontSize: 38, fontWeight: 700, marginTop: 16}}>0,4 lot · tanpa batas</div><div style={{fontFamily: MONO, fontSize: 56, fontWeight: 700, color: C.red, marginTop: 20}}>−$500</div><div style={{fontSize: 28, color: C.muted}}>dan masih bisa bertambah</div></Card></Appear>
					<Appear at={b(13) + 10} pop style={{flex: 1}}><Card accent={C.green} style={{height: 330}}><div style={{fontFamily: MONO, fontSize: 24, color: C.green, fontWeight: 700}}>1 POSISI + SL</div><div style={{fontSize: 38, fontWeight: 700, marginTop: 16}}>0,1 lot · SL 3.745</div><div style={{fontFamily: MONO, fontSize: 56, fontWeight: 700, color: C.green, marginTop: 20}}>≈ −$50</div><Appear at={b(14) + 30}><div style={{fontSize: 28, color: C.body}}>Sisa $950 buat kesempatan berikutnya</div></Appear></Card></Appear>
				</div>
			)}
			<div style={{position: 'absolute', left: 110, bottom: 190}}><Appear at={b(15)}><Hl text="Memperbesar taruhan di *ide yang lagi terbukti salah*." size={44} serif /></Appear></div>
		</AbsoluteFill>
	);
};

// ---------- S10 REFUSING SMALL LOSSES ----------
export const SAccept: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const late = f >= b(9) - 6;
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 110, top: 170}}><Appear at={4}><Badge>PENYEBAB 4 · AKAR MASALAH</Badge></Appear><Appear at={b(0) + 10} style={{marginTop: 16}}><Hl text="Menolak *rugi kecil*" size={64} /></Appear></div>
			{!late ? (
				<>
					<div style={{position: 'absolute', left: 110, top: 400, display: 'flex', gap: 22}}>
						{['Hapus stop loss', 'Geser SL menjauh', 'Tambah posisi'].map((t, i) => (
							<Appear key={t} at={b(3) + i * 14} pop><div style={{fontSize: 34, fontWeight: 700, padding: '18px 28px', borderRadius: 16, border: `2px solid ${C.red}`, color: C.text, background: 'rgba(226,109,109,0.10)'}}><span style={{color: C.red, marginRight: 12}}>✗</span>{t}</div></Appear>
						))}
					</div>
					<div style={{position: 'absolute', left: 110, top: 540, width: 1300}}><Appear at={b(4)}><Hl text="Menolak rugi kecil = *membeli kemungkinan rugi besar*." size={44} serif /></Appear></div>
					<div style={{position: 'absolute', left: 110, top: 680, width: 1100}}><Appear at={b(6)}><Card accent={C.green}><div style={{fontSize: 36, fontWeight: 700}}>Rugi kecil terencana = <span style={{color: C.green}}>biaya operasional</span></div><div style={{fontSize: 28, color: C.muted, marginTop: 6}}>Seperti toko yang bayar listrik.</div></Card></Appear></div>
				</>
			) : (
				<div style={{position: 'absolute', left: 110, right: 110, top: 360}}>
					<Appear at={b(9)} style={{marginBottom: 30}}><div style={{fontSize: 34, color: C.body}}>Empat penyebab ini saling terhubung.</div></Appear>
					<div style={{display: 'flex', gap: 20, alignItems: 'center'}}>
						{CAUSES.map((t, i) => (
							<React.Fragment key={t}>
								<Appear at={b(10) + i * 10} pop style={{flex: 1}}><Card accent={i === 3 ? C.gold : C.red} style={{height: 170}}><div style={{fontFamily: MONO, fontSize: 24, color: i === 3 ? C.gold : C.red}}>0{i + 1}</div><div style={{fontSize: 34, fontWeight: 700, marginTop: 10}}>{t}</div></Card></Appear>
								{i < 3 && <Appear at={b(10) + i * 10 + 6}><div style={{fontSize: 44, color: C.muted}}>+</div></Appear>}
							</React.Fragment>
						))}
					</div>
					<Appear at={b(11)} style={{marginTop: 70}}><Hl text="Hilangkan keempatnya → risiko margin call *turun drastis*." size={46} serif /></Appear>
				</div>
			)}
		</AbsoluteFill>
	);
};

// ---------- S11 RULES ----------
export const SRules: React.FC<SceneProps> = ({b}) => (
	<>
		<div style={{position: 'absolute', right: 110, top: 136}}><Appear at={b(12)}><Badge color={C.muted}>3% & 10% = CONTOH · TENTUKAN SEBELUM TRADING</Badge></Appear></div>
		<List badge="PAGAR PENGAMAN" badgeAt={4} title="5 aturan *anti margin call*" titleAt={b(1)} mark="check" compact
			items={['Risiko maks 1–2% per posisi, dari jarak SL', 'Stop loss dipasang sebelum / saat entry', 'Tidak menambah posisi yang sedang rugi', 'Batas rugi harian (contoh 3%) → tutup platform', 'Batas drawdown (contoh 10% dari puncak) → evaluasi jurnal']}
			ats={[b(2), b(3), b(5), b(6), b(9)]} />
	</>
);

// ---------- S12 SUMMARY ----------
export const SSummary: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	return f < b(6) - 4 ? (
		<List badge="RINGKASAN" badgeAt={4} title="Yang perlu *diingat*" titleAt={b(0)} compact
			items={['Drawdown dihitung dari titik tertinggi', 'Turun 50% butuh naik 100%', 'Stop out menutup posisi di harga yang bukan pilihan lo', 'Lot besar · tanpa SL · averaging · menolak rugi kecil']}
			ats={[b(1), b(3), b(4), b(5)]} />
	) : (
		<List badge="TUGAS MINGGU INI" badgeAt={b(6)} title="Latihan di *jurnal*" titleAt={b(6) + 6} mark="check"
			items={['Buka riwayat akun demo / akun lo', 'Hitung maximum drawdown-nya', 'Cek penyebab mana yang pernah lo lakukan', 'Tulis di jurnal']}
			ats={[b(7), b(8), b(9), b(10)]} />
	);
};

// ---------- S13 DISCLAIMER ----------
export const SDisc: React.FC<SceneProps> = ({b}) => (
	<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
		<Appear at={4}><Card accent={C.gold} style={{width: 1300, padding: '44px 56px'}}>
			<div style={{fontFamily: MONO, fontSize: 28, color: C.gold, letterSpacing: 4}}>DISCLAIMER</div>
			<div style={{fontSize: 40, fontWeight: 700, marginTop: 18, lineHeight: 1.3}}>Konten edukasi, bukan ajakan transaksi atau saran keuangan pribadi.</div>
			<Appear at={b(2)}><div style={{fontSize: 32, color: C.body, marginTop: 16}}>Semua chart dan angka = simulasi.</div></Appear>
			<Appear at={b(3)}><div style={{fontSize: 32, color: C.body, marginTop: 10}}>Trading forex & emas berleverage berisiko tinggi; lo bisa kehilangan sebagian atau seluruh modal.</div></Appear>
		</Card></Appear>
	</AbsoluteFill>
);

// ---------- S14 CTA ----------
export const SCta: React.FC<SceneProps> = ({b}) => (
	<AbsoluteFill>
		<div style={{position: 'absolute', left: 110, top: 190, width: 1150}}>
			<Appear at={4}><Badge>JOIN KOMUNITAS TRADING</Badge></Appear>
			<Appear at={12}><div style={{fontWeight: 800, fontSize: 110, color: C.gold, letterSpacing: -2, marginTop: 18, fontFamily: SANS}}>dhirajkelly.id</div></Appear>
			<Appear at={b(1)} style={{marginTop: 40}}><Card><div style={{fontFamily: MONO, fontSize: 22, color: C.gold}}>TULIS DI KOMENTAR</div><div style={{fontSize: 36, fontWeight: 700, marginTop: 8}}>Penyebab margin call mana yang paling sering lo lakukan?</div></Card></Appear>
			<Appear at={b(2)} style={{marginTop: 24}}><div style={{fontSize: 32, color: C.body}}>Materi berikutnya: <span style={{color: C.gold, fontWeight: 700}}>Jurnal trading</span></div></Appear>
		</div>
	</AbsoluteFill>
);

export const SCENES: Record<string, React.FC<SceneProps>> = {
	hook: SHook,
	map: SMap,
	dd: SDd,
	math: SMath,
	streak: SStreak,
	mc: SMc,
	lot: SLot,
	nosl: SNoSl,
	avg: SAvg,
	accept: SAccept,
	rules: SRules,
	summary: SSummary,
	disc: SDisc,
	cta: SCta,
};
void SERIF;
