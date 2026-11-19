import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Chart, HLine, Tag, Zone, useReveal, fmt} from './Chart';
import * as D from './data';
import {Appear, Badge, C, Card, Hl, MONO, SANS, SERIF, useIn, useOut, useSpring} from './ui';

export type SceneProps = {b: (k: number) => number; dur: number};

const ChartBox: React.FC<{children: React.ReactNode; x?: number; y?: number}> = ({children, x = 110, y = 210}) => (
	<div style={{position: 'absolute', left: x, top: y}}>{children}</div>
);
const SimBadge: React.FC = () => (
	<div style={{position: 'absolute', left: 110, top: 104}}>
		<Badge color={C.muted}>SIMULASI · EDUKASI · BUKAN SINYAL</Badge>
	</div>
);
const RightCol: React.FC<{children: React.ReactNode; top?: number}> = ({children, top = 190}) => (
	<div style={{position: 'absolute', right: 90, top, width: 560, display: 'flex', flexDirection: 'column', gap: 22}}>{children}</div>
);
const Rule: React.FC<{at: number; out?: number; title: string; body: string; color: string}> = ({at, out, title, body, color}) => (
	<Appear at={at} out={out} dx={40} dy={0}>
		<Card accent={color}>
			<div style={{fontFamily: MONO, fontSize: 22, color, letterSpacing: 2, fontWeight: 700}}>{title}</div>
			<div style={{fontSize: 34, fontWeight: 700, marginTop: 10, lineHeight: 1.2}}>{body}</div>
		</Card>
	</Appear>
);

// ---------- S01 HOOK ----------
export const SHook: React.FC<SceneProps> = ({b}) => {
	const rev = useReveal(0, b(2) + 10, 8, D.HOOK_LATE_BUY + 1) + useReveal(b(3) - 20, b(3) + 25, 0, D.HOOK.length - D.HOOK_LATE_BUY - 1);
	const buy = useIn(b(2) + 8);
	const sell = useIn(b(3) + 18);
	const chartOut = useOut(b(4) - 4, 16);
	const f = useCurrentFrame();
	return (
		<AbsoluteFill>
			<div style={{opacity: chartOut}}>
				<ChartBox x={110} y={240}>
					<Chart data={D.HOOK} reveal={rev} yMin={4374} yMax={4426} W={1100} H={600} label="XAUUSD · M15 · SIMULASI"
						overlay={(s) => (
							<>
								<Tag x={s.x(D.HOOK_LATE_BUY)} y={s.y(D.HOOK[D.HOOK_LATE_BUY].h) - 40} text="BUY TELAT" color={C.red} prog={buy} />
								<circle cx={s.x(D.HOOK_LATE_BUY)} cy={s.y(D.HOOK[D.HOOK_LATE_BUY].c)} r={10 * buy} fill="none" stroke={C.red} strokeWidth={3} />
								<Tag x={s.x(D.HOOK_LATE_SELL)} y={s.y(D.HOOK[D.HOOK_LATE_SELL].l) + 44} text="SELL TELAT" color={C.red} prog={sell} />
								<circle cx={s.x(D.HOOK_LATE_SELL)} cy={s.y(D.HOOK[D.HOOK_LATE_SELL].c)} r={10 * sell} fill="none" stroke={C.red} strokeWidth={3} />
							</>
						)}
					/>
				</ChartBox>
				<div style={{position: 'absolute', right: 100, top: 300, width: 600}}>
					<Appear at={4}><Hl text="Bukan analisanya yang salah." size={64} /></Appear>
					<Appear at={b(1)}><Hl text="*Entry-nya.*" size={96} serif style={{marginTop: 24}} /></Appear>
				</div>
			</div>
			{f >= b(4) - 4 && (
				<AbsoluteFill style={{padding: '230px 110px'}}>
					<Appear at={b(4)}><Hl text="Cara nentuin entry *XAUUSD* dari nol" size={68} /></Appear>
					<div style={{display: 'flex', gap: 26, marginTop: 60}}>
						{[['01', 'Arah trend', 'EMA 9 + VWAP'], ['02', 'Area entry', 'Order Block + FVG'], ['03', 'Konfirmasi', 'CHoCH + FVG'], ['04', 'SL & Target', 'RR 1:2']].map(([n, t, d], i) => (
							<Appear key={n} at={b(5) + i * 10} pop style={{flex: 1}}>
								<Card style={{height: 230}}>
									<div style={{fontFamily: MONO, color: C.gold, fontSize: 28, fontWeight: 700}}>{n}</div>
									<div style={{fontSize: 40, fontWeight: 700, marginTop: 18}}>{t}</div>
									<div style={{fontSize: 26, color: C.muted, marginTop: 12}}>{d}</div>
								</Card>
							</Appear>
						))}
					</div>
					<Appear at={b(6) + 20} style={{marginTop: 34}}><Badge>+ CHECKLIST SEBELUM KLIK BUY / SELL</Badge></Appear>
					<Appear at={b(8)} style={{marginTop: 30}}><Hl text="Nebak itu *mahal.*" size={54} serif /></Appear>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// ---------- S02 SETUP ----------
export const SSetup: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const tags = ['VWAP', 'EMA 9', 'Order Block', 'Fair Value Gap', 'CHoCH'];
	const order = useIn(b(5), 24);
	return (
		<AbsoluteFill style={{padding: '170px 110px'}}>
			<Appear at={b(1)}><Badge color={C.muted} style={{fontSize: 26}}>SEMUA CHART = SIMULASI · EDUKASI · BUKAN SINYAL</Badge></Appear>
			<Appear at={b(2)} style={{marginTop: 34}}><Hl text="Pahami *logikanya*, bukan nyalin levelnya." size={60} /></Appear>
			<div style={{display: 'flex', gap: 20, marginTop: 80, flexWrap: 'wrap'}}>
				{tags.map((t, i) => {
					const a = interpolate(f, [b(4) + i * 8, b(4) + i * 8 + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
					return (
						<div key={t} style={{opacity: a * (1 - order * 0.6), transform: `scale(${0.8 + a * 0.2})`, fontFamily: MONO, fontSize: 34, color: C.text, border: '1.5px solid rgba(159,168,184,0.5)', borderRadius: 999, padding: '14px 28px'}}>
							{t}
						</div>
					);
				})}
			</div>
			<div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 70, opacity: order, transform: `translateY(${(1 - order) * 20}px)`}}>
				{['1 · Arah', '2 · Area', '3 · Konfirmasi', '4 · SL / TP'].map((t, i) => (
					<React.Fragment key={t}>
						<div style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, color: C.navy, background: C.gold, borderRadius: 16, padding: '18px 30px'}}>{t}</div>
						{i < 3 && <div style={{color: C.gold, fontSize: 44}}>→</div>}
					</React.Fragment>
				))}
			</div>
			<Appear at={b(6)} style={{marginTop: 60}}><Hl text="Urutan jelas → keputusan *nggak pakai perasaan.*" size={46} serif /></Appear>
		</AbsoluteFill>
	);
};

// ---------- S03 TREND ----------
const TrendChart: React.FC<{data: D.Candle[]; reveal: number; vw: number; em: number; opacity: number; yMin: number; yMax: number}> = ({data, reveal, vw, em, opacity, yMin, yMax}) => {
	const V = D.vwap(data);
	const E = D.ema(data);
	return (
		<Chart data={data} reveal={reveal} yMin={yMin} yMax={yMax} W={1080} H={640} label="XAUUSD · M15 · SIMULASI" opacity={opacity}
			lines={[{values: V, color: C.gold, width: 4, draw: vw}, {values: E, color: C.blue, width: 3, draw: em}]}
			overlay={(s) => (
				<>
					{vw > 3 && <Tag x={s.x(Math.min(Math.floor(vw) - 1, data.length - 1))} y={s.y(V[Math.min(Math.floor(vw) - 1, data.length - 1)]) + 44} text="VWAP" color={C.gold} prog={Math.min(1, vw / 10)} />}
					{em > 3 && <Tag x={s.x(Math.min(Math.floor(em) - 1, data.length - 1)) - 60} y={s.y(E[Math.min(Math.floor(em) - 1, data.length - 1)]) - 46} text="EMA 9" color={C.blue} prog={Math.min(1, em / 10)} />}
				</>
			)}
		/>
	);
};
export const STrend: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const N = D.TREND_UP.length;
	const rev = useReveal(4, b(2), 6, N);
	const vw = useReveal(b(3), b(4) + 10, 0, N);
	const em = useReveal(b(5), b(6) + 10, 0, N);
	const phase = f < b(9) - 6 ? 0 : f < b(10) - 6 ? 1 : 2;
	const fadeIn = (at: number) => interpolate(f, [at - 6, at + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill>
			<SimBadge />
			<ChartBox>
				{phase === 0 && <TrendChart data={D.TREND_UP} reveal={rev} vw={vw} em={em} opacity={1} yMin={4374} yMax={4426} />}
				{phase === 1 && <TrendChart data={D.TREND_DOWN} reveal={N} vw={N} em={N} opacity={fadeIn(b(9))} yMin={4374} yMax={4426} />}
				{phase === 2 && <TrendChart data={D.TREND_CHOP} reveal={N} vw={N} em={N} opacity={fadeIn(b(10))} yMin={4386} yMax={4416} />}
			</ChartBox>
			<RightCol>
				<Appear at={b(3)} out={b(5) - 4}><Card><div style={{fontFamily: MONO, color: C.gold, fontSize: 22, letterSpacing: 2}}>VWAP</div><div style={{fontSize: 32, fontWeight: 700, marginTop: 8}}>Harga rata-rata tertimbang volume sejak sesi dimulai</div><div style={{fontSize: 26, color: C.muted, marginTop: 10}}>≈ "harga wajar" hari itu</div></Card></Appear>
				{f >= b(5) - 4 && f < b(8) && <Appear at={b(5)} out={b(8) - 8}><Card><div style={{fontFamily: MONO, color: C.blue, fontSize: 22, letterSpacing: 2}}>EMA 9</div><div style={{fontSize: 32, fontWeight: 700, marginTop: 8}}>Rata-rata 9 candle terakhir</div><div style={{fontSize: 26, color: C.muted, marginTop: 10}}>Cepat → nunjukin momentum sekarang</div></Card></Appear>}
				{f >= b(8) - 4 && f < b(9) && <Rule at={b(8)} title="HARGA & EMA 9 > VWAP" body="Cuma cari BUY" color={C.green} />}
				{f >= b(9) - 4 && f < b(10) && <Rule at={b(9)} title="HARGA & EMA 9 < VWAP" body="Cuma cari SELL" color={C.red} />}
				{f >= b(10) - 4 && <Rule at={b(10)} title="NYILANG-NYILANG VWAP" body="Pasar tanpa arah → NO TRADE" color={C.muted} />}
				{f >= b(12) && <Appear at={b(12)}><Hl text="Jangan *lawan arus.*" size={54} serif /></Appear>}
			</RightCol>
		</AbsoluteFill>
	);
};

// ---------- S04 AREA ----------
export const SArea: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const rev = useReveal(4, b(2), 10, 34) + useReveal(b(10), b(11) + 20, 0, D.AREA_RETURN + 1 - 34) + useReveal(b(13) - 10, b(13) + 40, 0, D.AREA.length - D.AREA_RETURN - 1);
	const ob = useReveal(b(3), b(3) + 30, 0, 1);
	const fvg = useReveal(b(6), b(6) + 30, 0, 1);
	const zone = useReveal(b(7), b(7) + 24, 0, 1);
	const dim = interpolate(f, [b(7), b(7) + 20], [1, 0.35], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const ret = useIn(b(11));
	const hlOB = interpolate(f, [b(3), b(3) + 10, b(5), b(5) + 10], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill>
			<SimBadge />
			<ChartBox>
				<Chart data={D.AREA} reveal={rev} yMin={4378} yMax={4420} W={1080} H={640} label="XAUUSD · M15 · SIMULASI"
					under={(s) => (
						<>
							<g opacity={dim}>
								<Zone s={s} lo={D.AREA_OB_ZONE.lo} hi={D.AREA_OB_ZONE.hi} from={D.AREA_OB} color={C.blue} label="ORDER BLOCK" prog={ob} labelSide="bottom" />
								<Zone s={s} lo={D.AREA_FVG.lo} hi={D.AREA_FVG.hi} from={D.AREA_FVG.from + 1} color={C.green} label="FVG" prog={fvg} />
							</g>
							<Zone s={s} lo={D.AREA_ZONE.lo} hi={D.AREA_ZONE.hi} from={D.AREA_OB} color={C.gold} label="AREA ENTRY" prog={zone} labelRight />
						</>
					)}
					overlay={(s) => (
						<>
							<rect x={s.x(D.AREA_OB) - s.cw * 0.7} y={s.y(D.AREA[D.AREA_OB].h) - 10} width={s.cw * 1.4} height={s.y(D.AREA[D.AREA_OB].l) - s.y(D.AREA[D.AREA_OB].h) + 20} fill="none" stroke={C.gold} strokeWidth={3} opacity={hlOB} rx={6} />
							{/* three-candle bracket for FVG */}
							<g opacity={interpolate(f, [b(6), b(6) + 12, b(7), b(7) + 12], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}>
								<rect x={s.x(25) - s.cw * 0.6} y={s.y(4409.6)} width={s.cw * 3.2} height={s.y(4391.6) - s.y(4409.6)} fill="none" stroke={C.green} strokeDasharray="6 6" strokeWidth={2} rx={6} />
								<text x={s.x(26)} y={s.y(4409.6) - 12} fill={C.green} fontFamily={MONO} fontSize={18} textAnchor="middle">3 candle</text>
							</g>
							<Tag x={s.x(D.AREA_RETURN)} y={s.y(D.AREA[D.AREA_RETURN].l) + 48} text="HARGA BALIK" color={C.gold} prog={ret} />
						</>
					)}
				/>
			</ChartBox>
			<RightCol>
				{f < b(5) && <Rule at={b(2)} out={b(5) - 8} title="ORDER BLOCK" body="Candle terakhir berlawanan arah sebelum harga gerak kuat" color={C.blue} />}
				{f >= b(5) - 4 && f < b(7) && <Rule at={b(5)} out={b(7) - 8} title="FAIR VALUE GAP" body="Celah di 3 candle saat harga gerak terlalu cepat" color={C.green} />}
				{f >= b(7) - 4 && f < b(10) && (
					<>
						<Rule at={b(7)} title="AREA TERBAIK" body="OB + FVG tumpang tindih" color={C.gold} />
						<Appear at={b(8)}><Card style={{fontSize: 30}}><div style={{color: C.green, fontWeight: 700}}>✓ Masih segar</div><div style={{color: C.red, fontWeight: 700, marginTop: 10}}>✗ Udah sering dites</div></Card></Appear>
					</>
				)}
				{f >= b(10) - 4 && (
					<>
						<Appear at={b(10)}><Hl text="Tunggu harga *balik.*" size={58} /></Appear>
						<Appear at={b(11)}><Hl text="Jangan ngejar." size={58} color={C.muted} /></Appear>
						<Appear at={b(12)}><Card style={{fontSize: 30}}>Harga nggak balik? <b style={{color: C.gold}}>Lo nggak rugi apa-apa.</b></Card></Appear>
					</>
				)}
			</RightCol>
		</AbsoluteFill>
	);
};

// ---------- confirm chart helper ----------
const ConfirmChart: React.FC<{data: D.Candle[]; reveal: number; zone: number; lh: number; choch: number; fvg: number; entry: number; sl?: number; tp?: number; box?: number; prices?: boolean; hit?: number; W?: number}> = ({data, reveal, zone, lh, choch, fvg, entry, sl = 0, tp = 0, box = 0, prices, hit = 0, W = 1080}) => {
	const last = D.CF_LH[D.CF_LH.length - 1];
	return (
		<Chart data={data} reveal={reveal} yMin={4400} yMax={4428} W={W} H={640} label="XAUUSD · M1 · SIMULASI"
			under={(s) => (
				<>
					<Zone s={s} lo={D.CF_ZONE.lo} hi={D.CF_ZONE.hi} from={0} color={C.gold} label="AREA M15" prog={zone} labelSide="bottom" />
					<Zone s={s} lo={D.CF_FVG.lo} hi={D.CF_FVG.hi} from={D.CF_FVG.from + 1} color={C.green} label="FVG" prog={fvg} />
					{box > 0 && (
						<g opacity={box}>
							<rect x={s.x(D.CF_ENTRY.i)} y={s.y(D.CF_TP)} width={(s.W - 110 - s.x(D.CF_ENTRY.i)) * box} height={s.y(D.CF_ENTRY.p) - s.y(D.CF_TP)} fill={C.green} fillOpacity={0.12} />
							<rect x={s.x(D.CF_ENTRY.i)} y={s.y(D.CF_ENTRY.p)} width={(s.W - 110 - s.x(D.CF_ENTRY.i)) * box} height={s.y(D.CF_SL) - s.y(D.CF_ENTRY.p)} fill={C.red} fillOpacity={0.14} />
						</g>
					)}
				</>
			)}
			overlay={(s) => (
				<>
					{D.CF_LH.map((p, k) => (
						<g key={k} opacity={interpolate(lh, [k / 3, (k + 1) / 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}>
							<circle cx={s.x(p.i)} cy={s.y(p.p) - 14} r={6} fill={C.red} />
							<text x={s.x(p.i)} y={s.y(p.p) - 30} fill={C.red} fontFamily={MONO} fontSize={18} fontWeight={700} textAnchor="middle">LH</text>
						</g>
					))}
					<g opacity={choch}>
						<line x1={s.x(last.i)} x2={s.x(last.i) + (s.x(33) - s.x(last.i)) * choch} y1={s.y(last.p)} y2={s.y(last.p)} stroke={C.gold} strokeWidth={3} strokeDasharray="8 6" />
						<Tag x={s.x(28)} y={s.y(last.p) - 34} text="CHoCH" color={C.gold} prog={choch} />
					</g>
					<HLine s={s} p={D.CF_ENTRY.p} color={C.text} label={prices ? '4.412,50' : 'ENTRY'} prog={entry} dash="2 0" from={D.CF_ENTRY.i - 2} />
					{entry > 0 && <circle cx={s.x(D.CF_ENTRY.i)} cy={s.y(D.CF_ENTRY.p)} r={11 * entry} fill={C.gold} />}
					<HLine s={s} p={D.CF_SL} color={C.red} label={prices ? '4.407,50' : 'SL'} prog={sl} from={D.CF_ENTRY.i - 2} />
					<HLine s={s} p={D.CF_TP} color={C.green} label={prices ? '4.422,50' : 'TP 2R'} prog={tp} from={D.CF_ENTRY.i - 2} />
					{hit > 0 && <Tag x={s.x(D.LOSS_HIT)} y={s.y(D.CF_SL) + 50} text="STOP LOSS KENA · −1R" color={C.red} prog={hit} />}
				</>
			)}
		/>
	);
};

// ---------- S05 CONFIRM ----------
export const SConfirm: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const rev = useReveal(b(4), b(5) + 30, 4, 30) + useReveal(b(6), b(7), 0, 4) + useReveal(b(10) - 10, b(10) + 30, 0, D.CF_ENTRY.i + 1 - 34);
	const zone = useReveal(b(2), b(2) + 24, 0, 1);
	return (
		<AbsoluteFill>
			<SimBadge />
			<ChartBox>
				<ConfirmChart data={D.CONFIRM} reveal={f < b(4) ? 0 : rev} zone={zone} lh={useReveal(b(5), b(5) + 50, 0, 1)} choch={useReveal(b(7) - 10, b(7) + 16, 0, 1)} fvg={useReveal(b(9), b(9) + 24, 0, 1)} entry={useReveal(b(10) + 20, b(10) + 34, 0, 1)} />
			</ChartBox>
			<RightCol>
				{f < b(4) && <Rule at={b(2)} out={b(4) - 8} title="HARGA NYENTUH AREA" body="≠ langsung entry. Area cuma tempat mulai memperhatikan." color={C.gold} />}
				{f >= b(4) - 4 && f < b(7) && <Rule at={b(4)} out={b(7) - 8} title="TURUN KE M1 / M3" body="Harga masih bikin lower high (LH)" color={C.red} />}
				{f >= b(7) - 4 && f < b(11) && (
					<>
						<Rule at={b(7)} title="CHoCH" body="Harga nembus LH terakhir → tekanan jual mulai kalah" color={C.gold} />
						<Appear at={b(9)}><Card accent={C.green} style={{fontSize: 30}}>Syarat: tembusannya ninggalin <b style={{color: C.green}}>FVG</b> → entry saat FVG dites</Card></Appear>
					</>
				)}
				{f >= b(11) - 4 && <Appear at={b(11)} pop><Card accent={C.red} style={{textAlign: 'center'}}><div style={{fontSize: 54, fontWeight: 800, color: C.red}}>NO CHoCH</div><div style={{fontSize: 54, fontWeight: 800}}>= NO ENTRY</div></Card></Appear>}
			</RightCol>
		</AbsoluteFill>
	);
};

// ---------- S06 SL/TP ----------
export const SSlTp: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const N = D.CF_ENTRY.i + 1;
	const toMath = f >= b(6) - 6;
	const mathIn = useIn(b(6), 18);
	const slP = useReveal(b(1), b(1) + 24, 0, 1), tpP = useReveal(b(3), b(3) + 24, 0, 1), boxP = useReveal(b(4), b(4) + 20, 0, 1);
	return (
		<AbsoluteFill>
			{!toMath && (
				<>
					<SimBadge />
					<ChartBox>
						<ConfirmChart data={D.CONFIRM} reveal={N} zone={1} lh={1} choch={1} fvg={1} entry={1} sl={slP} tp={tpP} box={boxP} />
					</ChartBox>
					<RightCol>
						<Rule at={b(1)} title="STOP LOSS" body="Di bawah low CHoCH + buffer 5 pips" color={C.red} />
						<Appear at={b(2)}><Card style={{fontSize: 28, color: C.body}}>Buffer = biar nggak kena cuma gara-gara spread melebar</Card></Appear>
						<Rule at={b(3)} title="TARGET" body="2 × jarak SL → RR 1:2" color={C.green} />
					</RightCol>
				</>
			)}
			{toMath && (
				<AbsoluteFill style={{padding: '150px 110px', opacity: mathIn}}>
					<Hl text="Kenapa *1:2?* Coba itung." size={62} />
					<div style={{fontFamily: MONO, color: C.muted, fontSize: 24, marginTop: 14}}>SIMULASI · 10 TRADE · WIN RATE 40%</div>
					<div style={{display: 'flex', gap: 16, marginTop: 50}}>
						{Array.from({length: 10}).map((_, i) => {
							const win = i < 4;
							const at = win ? b(7) + i * 6 : b(9) + (i - 4) * 5;
							return (
								<Appear key={i} at={at} pop style={{flex: 1}}>
									<div style={{height: 150, borderRadius: 16, background: win ? 'rgba(95,211,166,0.16)' : 'rgba(226,109,109,0.16)', border: `2px solid ${win ? C.green : C.red}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONO, fontWeight: 700, fontSize: 36, color: win ? C.green : C.red}}>
										{win ? '+2R' : '−1R'}
									</div>
								</Appear>
							);
						})}
					</div>
					<div style={{display: 'flex', gap: 60, marginTop: 50, fontFamily: MONO, fontSize: 44, fontWeight: 700}}>
						<Appear at={b(8)}><span style={{color: C.green}}>4 × 2R = +8R</span></Appear>
						<Appear at={b(9)}><span style={{color: C.red}}>6 × 1R = −6R</span></Appear>
						<Appear at={b(10)} pop><span style={{color: C.gold}}>Total = +2R</span></Appear>
					</div>
					<Appear at={b(10) + 20}><div style={{fontSize: 24, color: C.muted, marginTop: 16, fontFamily: SANS}}>Sebelum biaya (spread, komisi, swap). Hasil simulasi, bukan jaminan.</div></Appear>
					<Appear at={b(11)} style={{marginTop: 40}}><Hl text="Nggak harus sering benar. Harus *disiplin sama rasio.*" size={46} serif /></Appear>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// ---------- S07 LOT ----------
const Row: React.FC<{at: number; k: string; v: string; gold?: boolean}> = ({at, k, v, gold}) => (
	<Appear at={at} dx={-30} dy={0}>
		<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '18px 0', borderBottom: '1px solid rgba(159,168,184,0.18)'}}>
			<div style={{fontSize: 32, color: C.body}}>{k}</div>
			<div style={{fontFamily: MONO, fontSize: gold ? 54 : 38, fontWeight: 700, color: gold ? C.gold : C.text}}>{v}</div>
		</div>
	</Appear>
);
export const SLot: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const quote = f < b(3) - 4;
	return (
		<AbsoluteFill>
			{quote && (
				<AbsoluteFill style={{padding: '200px 180px', justifyContent: 'center'}}>
					<Appear at={b(0)}><Badge>UKURAN POSISI</Badge></Appear>
					<Appear at={b(1)} style={{marginTop: 40}}><Hl text="Banyak orang ngajarin cara nyari profit." size={58} serif color={C.muted} /></Appear>
					<Appear at={b(2)} style={{marginTop: 26}}><Hl text="Gue lebih tertarik ngajarin cara *ngebangun modal tanpa ngancurin modal itu.*" size={58} serif /></Appear>
				</AbsoluteFill>
			)}
			{!quote && (
				<AbsoluteFill style={{padding: '130px 110px', flexDirection: 'row', gap: 70}}>
					<div style={{flex: 1.15}}>
						<Appear at={b(3)}><Badge color={C.muted}>SIMULASI · XAUUSD</Badge></Appear>
						<Card style={{marginTop: 26, padding: '16px 40px 26px'}}>
							<Row at={b(4)} k="Modal" v="$10.000" />
							<Row at={b(5)} k="Risiko 1% per trade" v="$100" />
							<Row at={b(6)} k="Jarak stop loss" v="$5" />
							<Row at={b(7)} k="1 lot = 100 oz → gerak $1" v="$100/lot" />
							<Row at={b(8)} k="SL $5 per 1 lot" v="$500" />
							<Row at={b(9)} k="Lot = $100 ÷ $500" v="0,20 lot" gold />
						</Card>
					</div>
					<div style={{flex: 0.85, paddingTop: 70}}>
						<Appear at={b(10)}><div style={{fontFamily: MONO, color: C.muted, fontSize: 24, letterSpacing: 2}}>URUTANNYA</div></Appear>
						{['1 · Risiko', '2 · Jarak SL', '3 · Lot'].map((t, i) => (
							<Appear key={t} at={b(10) + 8 + i * 12} pop style={{marginTop: 20}}>
								<div style={{fontSize: 46, fontWeight: 700, color: i === 2 ? C.gold : C.text, background: 'rgba(20,40,80,0.9)', border: '1.5px solid rgba(201,162,74,0.4)', borderRadius: 18, padding: '18px 28px'}}>{t}</div>
							</Appear>
						))}
						<Appear at={b(12)} style={{marginTop: 40}}>
							<Card accent={C.red}><div style={{fontSize: 32, fontWeight: 700}}>Lot dari perasaan = <span style={{color: C.red}}>jalan tercepat ke margin call</span></div></Card>
						</Appear>
					</div>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// ---------- S08 EXAMPLE ----------
export const SExample: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const m1 = f >= b(5) - 6;
	const N = D.AREA.length;
	const V = D.vwap(D.AREA);
	const E = D.ema(D.AREA);
	const r15 = useReveal(4, b(3) + 30, 20, D.AREA_RETURN + 1), z15 = useReveal(b(3), b(3) + 20, 0, 1);
	const r1 = useReveal(b(5), b(7) + 20, 12, D.CF_ENTRY.i + 1), lh = useReveal(b(5), b(6), 0, 1), ch = useReveal(b(6), b(6) + 20, 0, 1), fv = useReveal(b(6) + 20, b(6) + 40, 0, 1);
	const en = useReveal(b(8), b(8) + 14, 0, 1), sl = useReveal(b(9), b(9) + 20, 0, 1), tp = useReveal(b(10), b(10) + 20, 0, 1), bx = useReveal(b(11), b(11) + 20, 0, 1);
	return (
		<AbsoluteFill>
			<SimBadge />
			{!m1 && (
				<ChartBox>
					<Chart data={D.AREA} reveal={r15} yMin={4378} yMax={4420} W={1080} H={640} label="XAUUSD · M15 · SIMULASI"
						lines={[{values: V, color: C.gold, width: 4}, {values: E, color: C.blue, width: 3}]}
						under={(s) => <Zone s={s} lo={D.AREA_ZONE.lo} hi={D.AREA_ZONE.hi} from={D.AREA_OB} color={C.gold} label="OB + FVG" prog={z15} />}
					/>
				</ChartBox>
			)}
			{m1 && (
				<ChartBox>
					<ConfirmChart data={D.CONFIRM} reveal={r1} zone={1} lh={lh} choch={ch} fvg={fv} entry={en} sl={sl} tp={tp} box={bx} prices />
				</ChartBox>
			)}
			<RightCol>
				{f < b(5) && (
					<>
						<Appear at={b(0)}><Badge>CONTOH 1 · SIMULASI</Badge></Appear>
						<Rule at={b(1)} title="M15 · HARGA & EMA 9 > VWAP" body="Cuma cari BUY" color={C.green} />
						<Rule at={b(3)} title="HARGA MASUK AREA" body="Belum entry. Tunggu konfirmasi." color={C.gold} />
					</>
				)}
				{f >= b(5) && f < b(11) && (
					<>
						<Rule at={b(5)} title="M1" body="CHoCH + FVG → entry saat FVG dites" color={C.gold} />
						<Appear at={b(8)}><Card style={{fontFamily: MONO, fontSize: 30, lineHeight: 1.7}}>
							<div>ENTRY <b style={{float: 'right'}}>4.412,50</b></div>
							<Appear at={b(9)} dy={8}><div style={{color: C.red}}>SL <b style={{float: 'right'}}>4.407,50 (−$5)</b></div></Appear>
							<Appear at={b(10)} dy={8}><div style={{color: C.green}}>TP <b style={{float: 'right'}}>4.422,50 (+$10)</b></div></Appear>
						</Card></Appear>
					</>
				)}
				{f >= b(11) && (
					<>
						<Appear at={b(11)}><Card style={{fontFamily: MONO, fontSize: 30, lineHeight: 1.7}}>
							<div>LOT <b style={{float: 'right'}}>0,20</b></div>
							<div style={{color: C.red}}>RISIKO <b style={{float: 'right'}}>$100 (1R)</b></div>
							<div style={{color: C.green}}>POTENSI <b style={{float: 'right'}}>$200 (2R)</b></div>
						</Card></Appear>
						<Appear at={b(12)}><Card accent={C.red} style={{fontSize: 27, color: C.body}}>Kena SL ≈ −$100. Bisa lebih kalau ada <b style={{color: C.text}}>slippage.</b></Card></Appear>
						<Appear at={b(13)}><Hl text="Rugi diterima *sebelum* klik buy." size={44} serif /></Appear>
					</>
				)}
			</RightCol>
		</AbsoluteFill>
	);
};

// ---------- S08b LOSS ----------
export const SLoss: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const post = f >= b(6) - 6;
	const rv = useReveal(b(2), b(3) + 20, 20, D.CF_ENTRY.i + 1) + useReveal(b(4), b(4) + 60, 0, D.LOSS.length - D.CF_ENTRY.i - 1);
	const ch = useReveal(b(3), b(3) + 20, 0, 1), en = useReveal(b(3) + 20, b(3) + 34, 0, 1), sltp = useReveal(b(3) + 30, b(3) + 44, 0, 1), hit = useReveal(b(4) + 50, b(4) + 64, 0, 1);
	return (
		<AbsoluteFill>
			{!post && (
				<>
					<SimBadge />
					<ChartBox>
						<ConfirmChart data={D.LOSS} reveal={rv} zone={1} lh={1} choch={ch} fvg={ch} entry={en} sl={sltp} tp={sltp} hit={hit} />
					</ChartBox>
					<RightCol>
						<Appear at={b(0)}><Badge color={C.red}>CONTOH 2 · GAGAL · SIMULASI</Badge></Appear>
						<Appear at={b(2)}><Card style={{fontSize: 30, lineHeight: 1.6}}>
							{['Trend naik di atas VWAP', 'Harga balik ke area', 'CHoCH di M1', 'Entry di FVG'].map((t, i) => (
								<Appear key={t} at={b(3) + i * 8} dy={6}><div><span style={{color: C.green}}>✓</span> {t}</div></Appear>
							))}
						</Card></Appear>
						<Appear at={b(5)} pop><Card accent={C.red}><div style={{fontFamily: MONO, fontSize: 52, fontWeight: 700, color: C.red}}>−1R ≈ −$100</div></Card></Appear>
					</RightCol>
				</>
			)}
			{post && (
				<AbsoluteFill style={{padding: '150px 110px'}}>
					<Appear at={b(6)}><Hl text="Apa yang salah?" size={66} /></Appear>
					<Appear at={b(7)} style={{marginTop: 18}}><Hl text="Bisa jadi *nggak ada.* Setup bagus tetap bisa kalah." size={50} serif /></Appear>
					<Appear at={b(9)} style={{marginTop: 50}}>
						<div style={{fontFamily: MONO, color: C.muted, fontSize: 24}}>RISIKO PER TRADE · 1% DARI EKUITAS</div>
						<div style={{position: 'relative', height: 56, background: 'rgba(95,211,166,0.2)', border: `2px solid ${C.green}`, borderRadius: 12, marginTop: 14, overflow: 'hidden'}}>
							<div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${interpolate(f, [b(10), b(10) + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}%`, background: C.red}} />
							<div style={{position: 'absolute', left: 20, top: 10, fontFamily: MONO, fontSize: 28, fontWeight: 700, color: C.text}}>99% modal tetap utuh</div>
						</div>
					</Appear>
					<div style={{display: 'flex', gap: 30, marginTop: 60}}>
						<Appear at={b(12)} style={{flex: 1}}><Card accent={C.green}><div style={{fontSize: 28, color: C.muted}}>Aturan diikutin</div><div style={{fontSize: 42, fontWeight: 700, color: C.green, marginTop: 8}}>→ Biaya bisnis</div></Card></Appear>
						<Appear at={b(13)} style={{flex: 1}}><Card accent={C.gold}><div style={{fontSize: 28, color: C.muted}}>Aturan dilanggar</div><div style={{fontSize: 42, fontWeight: 700, color: C.gold, marginTop: 8}}>→ Pelajaran</div></Card></Appear>
					</div>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// ---------- S09 SKIP / S10 CHECKLIST ----------
const ListScene: React.FC<SceneProps & {title: string; badge: string; items: string[]; startIdx: number; mark: 'x' | 'check'; footer: string; footerAt: number; badgeAt: number}> = ({b, title, badge, items, startIdx, mark, footer, footerAt, badgeAt}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{padding: '130px 160px'}}>
			<Appear at={badgeAt}><Badge color={mark === 'x' ? C.red : C.gold}>{badge}</Badge></Appear>
			<Appear at={b(0)} style={{marginTop: 22}}><Hl text={title} size={62} /></Appear>
			<div style={{marginTop: 36, display: 'flex', flexDirection: 'column', gap: 18}}>
				{items.map((t, i) => {
					const at = b(startIdx + i);
					const tick = interpolate(f, [at + 10, at + 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
					const col = mark === 'x' ? C.red : C.green;
					return (
						<Appear key={t} at={at} dx={-30} dy={0}>
							<div style={{display: 'flex', alignItems: 'center', gap: 26, background: 'rgba(20,40,80,0.85)', border: '1.5px solid rgba(159,168,184,0.25)', borderRadius: 18, padding: '16px 28px'}}>
								<div style={{width: 52, height: 52, borderRadius: 12, border: `3px solid ${col}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 800, color: col, transform: `scale(${0.6 + tick * 0.4})`, opacity: 0.3 + tick * 0.7}}>{mark === 'x' ? '✕' : '✓'}</div>
								<div style={{fontFamily: MONO, color: C.gold, fontSize: 28, fontWeight: 700}}>{String(i + 1).padStart(2, '0')}</div>
								<div style={{fontSize: 34, fontWeight: 700, color: C.text}}>{t}</div>
							</div>
						</Appear>
					);
				})}
			</div>
			<Appear at={footerAt} style={{marginTop: 34}}><Hl text={footer} size={46} serif /></Appear>
		</AbsoluteFill>
	);
};
export const SSkip: React.FC<SceneProps> = (p) => (
	<ListScene {...p} badgeAt={4} badge="KAPAN NGGAK ENTRY" title="Skip kalau ada salah satu ini" startIdx={1} mark="x" footerAt={p.b(6)} footer="Skip itu *juga keputusan.*"
		items={['Harga bolak-balik di sekitar VWAP', 'Area udah dites berkali-kali', 'Berita besar dekat: NFP, CPI, FOMC', 'CHoCH nggak muncul', 'Target 2R ketutup level lain']} />
);
export const SChecklist: React.FC<SceneProps> = (p) => (
	<ListScene {...p} badgeAt={p.b(1)} badge="SCREENSHOT / SIMPAN" title="Checklist *sebelum entry*" startIdx={2} mark="check" footerAt={p.b(7)} footer="Satu aja nggak terpenuhi → *jangan entry.*"
		items={['M15: harga & EMA 9 di sisi yang sama dari VWAP', 'Harga balik ke area OB + FVG', 'CHoCH di M1/M3 + ninggalin FVG', 'SL di bawah low + buffer · target ≥ 2R', 'Lot dihitung dari risiko 1%']} />
);

// ---------- S11 CTA ----------
export const SCta: React.FC<SceneProps> = ({b}) => (
	<AbsoluteFill style={{padding: '150px 160px'}}>
		<Appear at={b(0)}><Card accent={C.muted} style={{fontSize: 30, color: C.body}}>Konten edukasi umum. Trading derivatif berleverage dapat menyebabkan kerugian dan kehilangan modal.</Card></Appear>
		<Appear at={b(2)} style={{marginTop: 60}}>
			<div style={{fontFamily: MONO, color: C.muted, fontSize: 26, letterSpacing: 2}}>JOIN KOMUNITAS GRATIS</div>
			<div style={{fontFamily: SANS, fontWeight: 800, fontSize: 110, color: C.gold, letterSpacing: -2, marginTop: 6}}>dhirajkelly.id</div>
		</Appear>
		<Appear at={b(3)} style={{marginTop: 40}}>
			<Card style={{display: 'inline-block', fontSize: 36, fontWeight: 700}}>💬 Dari 5 langkah tadi, mana yang paling sering lo langgar?</Card>
		</Appear>
		<Appear at={b(4)} style={{marginTop: 60}}>
			<div style={{fontFamily: SERIF, fontSize: 44, color: C.text}}>Dr. Dhiraj Kelly Sawlani</div>
			<Appear at={b(5)}><div style={{fontFamily: MONO, fontSize: 26, color: C.gold, marginTop: 10, letterSpacing: 2}}>MANAGE RISK · PROTECT CAPITAL · TRADE SMARTER</div></Appear>
		</Appear>
	</AbsoluteFill>
);

export const SCENES: Record<string, React.FC<SceneProps>> = {
	hook: SHook, roadmap: SSetup, trend: STrend, area: SArea, confirm: SConfirm, sltp: SSlTp, lot: SLot, example: SExample, loss: SLoss, skip: SSkip, checklist: SChecklist, cta: SCta,
};
