// Academy: Fondasi Trading > Jenis order: market, limit, stop. All prices are SIMULASI.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Chart, HLine, Tag, Zone, useReveal, fmt} from './Chart';
import * as D from './data';
import {Appear, Badge, C, Card, Hl, MONO, SANS, SERIF, useOut} from './ui';

export type SceneProps = {b: (k: number) => number; dur: number};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const SimBadge: React.FC<{text?: string}> = ({text = 'SIMULASI · EDUKASI · BUKAN SINYAL'}) => (
	<div style={{position: 'absolute', left: 110, top: 104}}>
		<Badge color={C.muted}>{text}</Badge>
	</div>
);
const useA = () => {
	const f = useCurrentFrame();
	return (k: number, d = 12) => interpolate(f, [k, k + d], [0, 1], clamp);
};

const Row: React.FC<{at: number; k: string; v: string; gold?: boolean; color?: string; size?: number}> = ({at, k, v, gold, color, size = 32}) => (
	<Appear at={at} dx={30} dy={0}>
		<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20, padding: '12px 22px', borderRadius: 14, background: gold ? 'rgba(201,162,74,0.16)' : 'rgba(20,40,80,0.85)', border: `1.5px solid ${gold ? C.gold : color ?? 'rgba(159,168,184,0.25)'}`}}>
			<div style={{fontSize: size - 6, color: C.body}}>{k}</div>
			<div style={{fontFamily: MONO, fontSize: size, fontWeight: 700, color: gold ? C.gold : color ?? C.text, whiteSpace: 'nowrap'}}>{v}</div>
		</div>
	</Appear>
);

const List: React.FC<{badge: string; badgeAt: number; title: string; titleAt: number; items: string[]; ats: number[]; mark?: 'num' | 'check'; footer?: string; footerAt?: number; compact?: boolean}> = ({badge, badgeAt, title, titleAt, items, ats, mark = 'num', footer, footerAt = 0, compact}) => {
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
							<div style={{display: 'flex', alignItems: 'center', gap: 24, background: 'rgba(20,40,80,0.85)', border: '1.5px solid rgba(159,168,184,0.25)', borderRadius: 18, padding: compact ? '11px 26px' : '16px 28px', maxWidth: 1250}}>
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

// ---------- datasets (SIMULASI) ----------
const HOOK = D.build([[0, 3738], [8, 3746], [16, 3755], [22, 3757], [28, 3750]], {seed: 41, noise: 1.2, wick: 1.0});
const LIM_HIT = D.build([[0, 3736], [8, 3745], [14, 3756], [18, 3754], [22, 3750]], {seed: 52, noise: 1.0, wick: 0.9});
const LIM_FUT = D.build([[0, 3750], [4, 3743.2], [5, 3743.5], [12, 3756]], {seed: 53, noise: 0.9, wick: 0.8, overrides: {4: {l: 3741.8}}});
const LIM_MISS = D.build([[0, 3750], [4, 3744], [5, 3744.4], [12, 3758]], {seed: 54, noise: 0.9, wick: 0.7, overrides: {4: {l: 3743.1}}});
const STOP_R = D.build([[0, 3744], [4, 3756], [8, 3745], [12, 3757], [16, 3744.5], [20, 3756.5], [24, 3750]], {seed: 61, noise: 1.0, wick: 1.0});
const STOP_FAKE = D.build([[0, 3750], [3, 3756], [5, 3761.5], [7, 3755], [10, 3748]], {seed: 62, noise: 0.8, wick: 0.8, overrides: {5: {h: 3763}}});
const GAP = D.build([[0, 3748], [6, 3752], [12, 3745], [16, 3741]], {seed: 71, noise: 1.0, wick: 0.9});
GAP.push({o: 3730, h: 3732.5, l: 3728.8, c: 3731.5, v: 1.4});
GAP.push({o: 3731.5, h: 3734, l: 3730.2, c: 3733.2, v: 1});

// ---------- S01 HOOK ----------
export const SHook: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const a = useA();
	const N = HOOK.length;
	const late = f >= b(7) - 6;
	const out1 = useOut(b(7) - 8, 10);
	const rv = useReveal(0, b(1), 10, N);
	return (
		<AbsoluteFill>
			{!late && (
				<div style={{opacity: out1}}>
					<SimBadge />
					<div style={{position: 'absolute', left: 110, top: 220}}>
						<Chart data={HOOK} reveal={rv} yMin={3730} yMax={3762} W={1060} H={640} label="XAUUSD · H1 · SIMULASI" slots={N + 6}
							under={(s) => <Zone s={s} lo={3740.8} hi={3743} from={0} color={C.gold} prog={a(b(1) + 20)} label="SUPPORT 3.742" labelSide="bottom" />}
							overlay={(s) => (
								<>
									<HLine s={s} p={3750} color={C.text} label="A 3.750" prog={a(b(2))} dash="2 0" from={N - 2} />
									<HLine s={s} p={3742} color={C.gold} label="B 3.742" prog={a(b(3))} from={N - 2} />
									<HLine s={s} p={3736} color={C.red} label="SL 3.736" prog={a(b(4))} from={N - 2} />
									<g opacity={a(b(5))}>
										<line x1={s.x(N + 2)} x2={s.x(N + 2)} y1={s.y(3750)} y2={s.y(3736)} stroke={C.text} strokeWidth={4} />
										<text x={s.x(N + 2) - 14} y={s.y(3747) + 8} textAnchor="end" fill={C.text} fontFamily={MONO} fontWeight={700} fontSize={26}>$14</text>
										<line x1={s.x(N + 4)} x2={s.x(N + 4)} y1={s.y(3742)} y2={s.y(3736)} stroke={C.gold} strokeWidth={4} />
										<text x={s.x(N + 4) - 14} y={s.y(3739) + 8} textAnchor="end" fill={C.gold} fontFamily={MONO} fontWeight={700} fontSize={26}>$6</text>
									</g>
								</>
							)} />
					</div>
					<div style={{position: 'absolute', right: 100, top: 220, width: 600, display: 'flex', flexDirection: 'column', gap: 22}}>
						<Appear at={4}><Hl text="Analisa sama, *tombol beda.*" size={56} /></Appear>
						<Appear at={b(2)} dx={40} dy={0}><Card accent={C.text}><div style={{fontFamily: MONO, fontSize: 22, color: C.text, fontWeight: 700}}>TRADER A · MARKET</div><div style={{fontSize: 34, fontWeight: 700, marginTop: 8}}>Buy sekarang di 3.750</div></Card></Appear>
						<Appear at={b(3)} dx={40} dy={0}><Card accent={C.gold}><div style={{fontFamily: MONO, fontSize: 22, color: C.gold, fontWeight: 700}}>TRADER B · BUY LIMIT</div><div style={{fontSize: 34, fontWeight: 700, marginTop: 8}}>Tunggu di 3.742</div></Card></Appear>
						<Row at={b(5)} k="Jarak SL Trader A" v="$14" />
						<Row at={b(5) + 18} k="Jarak SL Trader B" v="$6" gold />
						<Appear at={b(6)}><Hl text="Risiko beda *> 2 kali lipat.*" size={44} serif /></Appear>
					</div>
				</div>
			)}
			{late && (
				<AbsoluteFill style={{padding: '210px 110px'}}>
					<Appear at={b(7)}><Hl text="3 jenis order di *MT4 & MT5*" size={68} /></Appear>
					<div style={{display: 'flex', gap: 26, marginTop: 50}}>
						{[['MARKET', 'Masuk sekarang', C.text], ['LIMIT', 'Tunggu harga lebih bagus', C.gold], ['STOP', 'Masuk setelah konfirmasi', C.blue]].map(([n, t, col], i) => (
							<Appear key={n} at={b(7) + 24 + i * 12} pop style={{flex: 1}}>
								<Card accent={col} style={{height: 210}}>
									<div style={{fontFamily: MONO, color: col, fontSize: 34, fontWeight: 700}}>{n}</div>
									<div style={{fontSize: 38, fontWeight: 700, marginTop: 20}}>{t}</div>
								</Card>
							</Appear>
						))}
					</div>
					<Appear at={b(9)} style={{marginTop: 40}}>
						<Card accent={C.red} style={{display: 'inline-block'}}><div style={{fontSize: 36, fontWeight: 700}}>Order yang lo pakai tiap hari = <span style={{color: C.red}}>stop order?</span></div></Card>
					</Appear>
					<Appear at={b(10)} style={{marginTop: 36}}><Hl text="Milih tombol pakai perasaan = *mahal.*" size={50} serif /></Appear>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// ---------- S02 MAP ----------
export const SMap: React.FC<SceneProps> = ({b}) => (
	<>
		<div style={{position: 'absolute', right: 110, top: 136}}><Appear at={b(1)}><Badge color={C.muted}>SEMUA CHART & HARGA = SIMULASI · BUKAN SINYAL</Badge></Appear></div>
		<List badge="FONDASI TRADING · MATERI 4" badgeAt={4} title="Jenis order: *market, limit, stop*" titleAt={b(1)}
			items={['Market order: masuk sekarang', 'Limit order: harga lebih bagus', 'Stop order: masuk setelah konfirmasi', 'Stop loss & take profit juga order', 'Cara memilih order yang tepat', 'Cara pasang di MT5 + tugas akun demo']}
			ats={[b(3), b(4), b(5), b(6), b(7), b(8)]} compact />
	</>
);

// ---------- S03 MARKET ----------
const Quote: React.FC<{label: string; v: string; color: string; a: number}> = ({label, v, color, a}) => (
	<div style={{opacity: a, flex: 1, background: 'rgba(20,40,80,0.9)', border: `2px solid ${color}`, borderRadius: 20, padding: '22px 28px'}}>
		<div style={{fontFamily: MONO, fontSize: 24, color, fontWeight: 700, letterSpacing: 2}}>{label}</div>
		<div style={{fontFamily: MONO, fontSize: 66, fontWeight: 700, color: C.text, marginTop: 6}}>{v}</div>
	</div>
);
export const SMarket: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const a = useA();
	const slip = f >= b(11) - 6;
	const out1 = useOut(b(11) - 8, 10);
	return (
		<AbsoluteFill>
			<SimBadge />
			{!slip && (
				<div style={{opacity: out1}}>
					<div style={{position: 'absolute', left: 110, top: 190, width: 900}}>
						<Appear at={b(0)}><Hl text="Market order = masuk *sekarang*" size={58} /></Appear>
						<Appear at={b(2)} style={{marginTop: 18}}><div style={{fontSize: 32, color: C.body}}>Harga yang berjalan ada <b style={{color: C.text}}>dua</b>:</div></Appear>
						<div style={{display: 'flex', gap: 24, marginTop: 30}}>
							<Quote label="BID · pembeli bayar" v={b(5) <= f ? '3.750,00' : '·····'} color={C.red} a={a(b(3))} />
							<Quote label="ASK · penjual minta" v={b(5) <= f ? '3.750,30' : '·····'} color={C.green} a={a(b(4))} />
						</div>
						<div style={{fontFamily: MONO, fontSize: 22, color: C.muted, marginTop: 12, opacity: a(b(5))}}>XAUUSD · CONTOH / SIMULASI</div>
						<Appear at={b(6)} style={{marginTop: 22}}>
							<Card accent={C.gold} style={{display: 'inline-block'}}><div style={{fontSize: 36, fontWeight: 700}}>Spread = ask − bid = <span style={{color: C.gold, fontFamily: MONO}}>0,30</span></div></Card>
						</Appear>
					</div>
					<div style={{position: 'absolute', right: 100, top: 300, width: 680, display: 'flex', flexDirection: 'column', gap: 18}}>
						<Row at={b(7)} k="BUY dibuka di" v="ASK 3.750,30" color={C.green} />
						<Row at={b(8)} k="SELL dibuka di" v="BID 3.750,00" color={C.red} />
						<Row at={b(9)} k="Posisi baru kebuka" v="− spread" gold />
						<Appear at={b(10)}><div style={{fontSize: 30, color: C.body, marginTop: 6}}>Normal. Itu <b style={{color: C.text}}>biaya</b>, bukan analisa salah.</div></Appear>
					</div>
				</div>
			)}
			{slip && (
				<>
					<div style={{position: 'absolute', left: 110, top: 200, width: 860}}>
						<Appear at={b(11)}><Badge>SLIPPAGE</Badge></Appear>
						<Appear at={b(12)} style={{marginTop: 22}}><Hl text="Pasar cepat → harga isi *bisa beda*" size={54} /></Appear>
						<div style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 34, width: 700}}>
							<Row at={b(13)} k="Harga di layar saat klik" v="3.750,00" />
							<Row at={b(13) + 22} k="Harga terisi (contoh)" v="3.750,80" color={C.red} />
							<Row at={b(13) + 44} k="Selisih" v="0,80" gold />
						</div>
					</div>
					<div style={{position: 'absolute', right: 100, top: 240, width: 640, display: 'flex', flexDirection: 'column', gap: 22}}>
						<Appear at={b(14)} dx={40} dy={0}><Card><div style={{fontSize: 34, fontWeight: 700}}>Cepat <span style={{color: C.green}}>✓</span></div><div style={{fontSize: 34, fontWeight: 700, marginTop: 10}}>Harga persis <span style={{color: C.red}}>✕</span></div></Card></Appear>
						<Appear at={b(15)} dx={40} dy={0}><Card accent={C.gold}><div style={{fontFamily: MONO, fontSize: 22, color: C.gold, fontWeight: 700}}>PAKAI KALAU</div><div style={{fontSize: 32, fontWeight: 700, marginTop: 8}}>Harga sudah di area rencana</div></Card></Appear>
						<Appear at={b(16)}><Hl text="Bukan karena *takut ketinggalan.*" size={42} serif /></Appear>
					</div>
				</>
			)}
		</AbsoluteFill>
	);
};

// ---------- S04 LIMIT ----------
export const SLimit: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const a = useA();
	const miss = f >= b(10) - 4;
	const N0 = LIM_HIT.length;
	const fut = miss ? LIM_MISS : LIM_FUT;
	const futStart = miss ? b(11) : b(6);
	const futRev = interpolate(f, [futStart, futStart + 80], [0, fut.length], clamp);
	const data = [...LIM_HIT, ...fut.slice(1)];
	const reveal = N0 + Math.max(0, futRev - 1);
	const touched = !miss && futRev > 5;
	return (
		<AbsoluteFill>
			<SimBadge />
			<div style={{position: 'absolute', left: 110, top: 220}}>
				<Chart data={data} reveal={reveal} yMin={3732} yMax={3764} W={1060} H={640} label="XAUUSD · H1 · SIMULASI" slots={data.length + 3}
					under={(s) => (
						<>
							<Zone s={s} lo={3740.8} hi={3743} from={0} color={C.gold} prog={a(b(4))} label="SUPPORT" labelSide="bottom" />
							<Zone s={s} lo={3757} hi={3759.2} from={0} color={C.blue} prog={a(b(8))} label="RESISTANCE" />
						</>
					)}
					overlay={(s) => (
						<>
							<HLine s={s} p={3750} color={C.muted} label="NOW 3.750" prog={a(b(2) - 10)} dash="3 6" from={N0 - 1} />
							<HLine s={s} p={3742} color={C.gold} label="B.LIMIT" prog={a(b(5))} from={N0 - 1} />
							<HLine s={s} p={3758} color={C.blue} label="S.LIMIT" prog={a(b(7))} from={N0 - 1} />
							{touched && <Tag x={s.x(N0 + 3)} y={s.y(3741.8) + 50} text="TERISI 3.742" color={C.green} prog={a(b(6) + 50)} />}
							{miss && <Tag x={s.x(N0 + 3)} y={s.y(3736.5)} text="MANTUL 3.743 · TIDAK TERISI" color={C.red} prog={interpolate(futRev, [5, 6], [0, 1], clamp)} />}
						</>
					)} />
			</div>
			<div style={{position: 'absolute', right: 90, top: 200, width: 620, display: 'flex', flexDirection: 'column', gap: 16}}>
				<Appear at={b(1)}><Hl text="LIMIT = tunggu harga *lebih bagus*" size={48} /></Appear>
				<Row at={b(2)} k="Buy limit" v="di BAWAH harga" gold />
				<Row at={b(7)} k="Sell limit" v="di ATAS harga" color={C.blue} />
				{!miss && <Appear at={b(9)}><Card accent={C.green}><div style={{fontSize: 30, fontWeight: 700}}>+ Entry presisi, SL lebih pendek</div></Card></Appear>}
				{miss && (
					<>
						<Appear at={b(10)}><Card accent={C.red}><div style={{fontSize: 30, fontWeight: 700}}>− Bisa nggak pernah terisi</div></Card></Appear>
						<Appear at={b(13)}><div style={{fontSize: 32, color: C.body}}>Nggak terisi ≠ rugi. <b style={{color: C.text}}>Bagian dari rencana.</b></div></Appear>
						<Appear at={b(15)}><Card accent={C.muted}><div style={{fontSize: 28, color: C.body}}>Buy limit melawan tren turun kuat = <b style={{color: C.text}}>nangkep pisau jatuh</b></div></Card></Appear>
						<Appear at={b(16)}><Hl text="Level harus punya *alasan.*" size={42} serif /></Appear>
					</>
				)}
			</div>
		</AbsoluteFill>
	);
};

// ---------- S05 STOP ----------
export const SStop: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const a = useA();
	const fake = f >= b(11) - 4;
	const N0 = STOP_R.length;
	const fr = interpolate(f, [b(12), b(12) + 70], [0, STOP_FAKE.length], clamp);
	const data = fake ? [...STOP_R, ...STOP_FAKE.slice(1)] : STOP_R;
	const rv = useReveal(0, b(3), 8, N0);
	const reveal = fake ? N0 + Math.max(0, fr - 1) : rv;
	return (
		<AbsoluteFill>
			<SimBadge />
			<div style={{position: 'absolute', left: 110, top: 220}}>
				<Chart data={data} reveal={reveal} yMin={3734} yMax={3768} W={1060} H={640} label="XAUUSD · H1 · SIMULASI" slots={N0 + STOP_FAKE.length + 2}
					under={(s) => (
						<>
							<Zone s={s} lo={3757} hi={3759} from={0} color={C.blue} prog={a(b(4))} label="RESISTANCE 3.758" />
							<Zone s={s} lo={3743} hi={3745} from={0} color={C.gold} prog={a(b(7))} label="SUPPORT" labelSide="bottom" />
						</>
					)}
					overlay={(s) => (
						<>
							<HLine s={s} p={3760} color={C.green} label="B.STOP" prog={a(b(6))} from={N0 - 1} />
							<HLine s={s} p={3741} color={C.red} label="S.STOP" prog={a(b(7) + 10)} from={N0 - 1} />
							{fake && <Tag x={s.x(N0 + 4)} y={s.y(3763) - 40} text="TERISI 3.760" color={C.green} prog={interpolate(fr, [4, 5], [0, 1], clamp)} />}
							{fake && <Tag x={s.x(N0 + 8)} y={s.y(3748) + 54} text="BREAKOUT PALSU" color={C.red} prog={interpolate(fr, [8, 9], [0, 1], clamp)} />}
						</>
					)} />
			</div>
			<div style={{position: 'absolute', right: 90, top: 200, width: 620, display: 'flex', flexDirection: 'column', gap: 16}}>
				<Appear at={b(2)}><Hl text="STOP = bayar untuk *konfirmasi*" size={48} /></Appear>
				<Row at={b(3)} k="Buy stop" v="di ATAS harga" color={C.green} />
				<Row at={b(7)} k="Sell stop" v="di BAWAH harga" color={C.red} />
				{!fake && <Appear at={b(9)}><Card accent={C.gold}><div style={{fontSize: 30, fontWeight: 700}}>Harga lebih jelek = bayaran untuk <span style={{color: C.gold}}>bukti arah</span></div></Card></Appear>}
				{fake && (
					<>
						<Appear at={b(11)}><Card accent={C.red}><div style={{fontFamily: MONO, fontSize: 22, color: C.red, fontWeight: 700}}>JEBAKAN 1</div><div style={{fontSize: 30, fontWeight: 700, marginTop: 6}}>Breakout palsu</div></Card></Appear>
						<Appear at={b(13)}><Card accent={C.red}><div style={{fontFamily: MONO, fontSize: 22, color: C.red, fontWeight: 700}}>JEBAKAN 2</div><div style={{fontSize: 30, fontWeight: 700, marginTop: 6}}>Slippage: tersentuh → jadi market order</div></Card></Appear>
						<Appear at={b(15)}><Hl text="SL ditentukan *sebelum* kebuka." size={40} serif /></Appear>
					</>
				)}
			</div>
		</AbsoluteFill>
	);
};

// ---------- S06 SL / TP ----------
const Cell: React.FC<{t: string; v: string; color: string; at: number}> = ({t, v, color, at}) => (
	<Appear at={at} pop style={{flex: 1}}>
		<div style={{background: 'rgba(20,40,80,0.9)', border: `2px solid ${color}`, borderRadius: 18, padding: '18px 24px'}}>
			<div style={{fontFamily: MONO, fontSize: 22, color: C.muted, fontWeight: 700}}>{t}</div>
			<div style={{fontFamily: MONO, fontSize: 38, color, fontWeight: 700, marginTop: 6}}>{v}</div>
		</div>
	</Appear>
);
export const SSltp: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const a = useA();
	const gap = f >= b(8) - 6;
	const out1 = useOut(b(8) - 8, 10);
	const N = GAP.length;
	return (
		<AbsoluteFill>
			<SimBadge />
			{!gap && (
				<div style={{opacity: out1, position: 'absolute', left: 160, top: 200, right: 160}}>
					<Appear at={b(0)}><Badge>PLOT TWIST</Badge></Appear>
					<Appear at={b(1)} style={{marginTop: 18}}><Hl text="Stop loss = *stop order*" size={72} /></Appear>
					<div style={{marginTop: 40, display: 'flex', flexDirection: 'column', gap: 20}}>
						<div style={{display: 'flex', gap: 20, alignItems: 'center'}}>
							<div style={{width: 260, fontSize: 34, fontWeight: 700, color: C.text, opacity: a(b(2))}}>Posisi <span style={{color: C.green}}>BUY</span></div>
							<Cell t="STOP LOSS =" v="SELL STOP" color={C.red} at={b(2)} />
							<Cell t="TAKE PROFIT =" v="SELL LIMIT" color={C.gold} at={b(3)} />
						</div>
						<div style={{display: 'flex', gap: 20, alignItems: 'center'}}>
							<div style={{width: 260, fontSize: 34, fontWeight: 700, color: C.text, opacity: a(b(4))}}>Posisi <span style={{color: C.red}}>SELL</span></div>
							<Cell t="STOP LOSS =" v="BUY STOP" color={C.red} at={b(5)} />
							<Cell t="TAKE PROFIT =" v="BUY LIMIT" color={C.gold} at={b(5) + 14} />
						</div>
					</div>
					<Appear at={b(7)} style={{marginTop: 40}}><Hl text="SL ikut mewarisi *slippage.*" size={48} serif /></Appear>
				</div>
			)}
			{gap && (
				<>
					<div style={{position: 'absolute', left: 110, top: 220}}>
						<Chart data={GAP} reveal={interpolate(f, [b(8), b(9) + 20], [N - 2, N], clamp)} yMin={3724} yMax={3758} W={1000} H={640} label="XAUUSD · H1 · SIMULASI" slots={N + 4}
							overlay={(s) => (
								<>
									<HLine s={s} p={3736} color={C.red} label="SL 3.736" prog={a(b(8))} dash="10 8" />
									<line x1={s.x(N - 2.5)} x2={s.x(N - 2.5)} y1={60} y2={600} stroke={C.muted} strokeWidth={2} strokeDasharray="6 8" opacity={a(b(9))} />
									<text x={s.x(N - 2.5) - 12} y={84} textAnchor="end" fill={C.muted} fontFamily={MONO} fontSize={20} opacity={a(b(9))}>JUMAT TUTUP</text>
									<text x={s.x(N - 2.5) + 12} y={84} fill={C.muted} fontFamily={MONO} fontSize={20} opacity={a(b(9))}>SENIN</text>
									<Tag x={s.x(N - 2)} y={s.y(3728.8) + 46} text="BUKA 3.730 · GAP" color={C.red} prog={a(b(9) + 20)} />
								</>
							)} />
					</div>
					<div style={{position: 'absolute', right: 90, top: 220, width: 640, display: 'flex', flexDirection: 'column', gap: 16}}>
						<Row at={b(8)} k="Stop loss dipasang" v="3.736" />
						<Row at={b(9)} k="Senin harga dibuka" v="3.730" color={C.red} />
						<Row at={b(11)} k="SL terisi (contoh)" v="≈ 3.730" color={C.red} />
						<Appear at={b(12)} style={{marginTop: 10}}><Hl text="SL = batas *rencana*, bukan jaminan." size={42} serif /></Appear>
						<Appear at={b(13)}><Card accent={C.gold}><div style={{fontSize: 28, fontWeight: 700}}>Lot dari risiko · risiko per posisi kecil</div></Card></Appear>
					</div>
				</>
			)}
		</AbsoluteFill>
	);
};

// ---------- S07 PILIH ----------
export const SPilih: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const a = useA();
	const lad = f >= b(10) - 6;
	const out1 = useOut(b(10) - 8, 10);
	const cell = (t: string, d: string, col: string, at: number) => (
		<Appear at={at} pop style={{flex: 1}}>
			<div style={{height: 150, background: 'rgba(20,40,80,0.9)', border: `2px solid ${col}`, borderRadius: 18, padding: '18px 26px'}}>
				<div style={{fontFamily: MONO, fontSize: 40, fontWeight: 700, color: col}}>{t}</div>
				<div style={{fontSize: 26, color: C.body, marginTop: 10}}>{d}</div>
			</div>
		</Appear>
	);
	return (
		<AbsoluteFill>
			{!lad && (
				<div style={{opacity: out1, position: 'absolute', left: 160, right: 160, top: 150}}>
					<div style={{display: 'flex', gap: 20}}>
						<Appear at={b(2)} style={{flex: 1}}><Badge>1 · BUY ATAU SELL?</Badge></Appear>
						<Appear at={b(3)} style={{flex: 2}}><Badge>2 · HARGA LEBIH BAGUS ATAU KONFIRMASI?</Badge></Appear>
					</div>
					<div style={{display: 'flex', gap: 20, marginTop: 30, marginLeft: 220}}>
						<div style={{flex: 1, fontFamily: MONO, fontSize: 24, color: C.gold, opacity: a(b(3))}}>HARGA LEBIH BAGUS</div>
						<div style={{flex: 1, fontFamily: MONO, fontSize: 24, color: C.blue, opacity: a(b(3))}}>BUTUH KONFIRMASI</div>
					</div>
					<div style={{display: 'flex', gap: 20, marginTop: 14, alignItems: 'center'}}>
						<div style={{width: 200, fontSize: 40, fontWeight: 700, color: C.green, opacity: a(b(4))}}>BUY</div>
						{cell('BUY LIMIT', 'beli lebih murah', C.gold, b(4))}
						{cell('BUY STOP', 'beli setelah tembus ke atas', C.blue, b(5))}
					</div>
					<div style={{display: 'flex', gap: 20, marginTop: 20, alignItems: 'center'}}>
						<div style={{width: 200, fontSize: 40, fontWeight: 700, color: C.red, opacity: a(b(6))}}>SELL</div>
						{cell('SELL LIMIT', 'jual lebih mahal', C.gold, b(6))}
						{cell('SELL STOP', 'jual setelah jebol ke bawah', C.blue, b(7))}
					</div>
					<Appear at={b(8)} style={{marginTop: 24, marginLeft: 220}}><Card accent={C.text} style={{padding: '16px 26px'}}><div style={{fontSize: 30, fontWeight: 700}}>Harga sudah di area rencana → <span style={{fontFamily: MONO}}>MARKET</span></div></Card></Appear>
					<div style={{display: 'flex', gap: 18, marginTop: 26, marginLeft: 220}}>
						{[['LIMIT', 'sabar', C.gold], ['STOP', 'konfirmasi', C.blue], ['MARKET', 'sekarang', C.text]].map(([k, v, col], i) => (
							<Appear key={k} at={b(9) + i * 12} pop><Badge color={col} style={{fontSize: 26}}>{k} = {v}</Badge></Appear>
						))}
					</div>
				</div>
			)}
			{lad && (
				<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
					<Appear at={b(10)}><Hl text="Yang paling sering *ketuker*" size={60} /></Appear>
					<svg width={1100} height={520} style={{marginTop: 30, overflow: 'visible'}}>
						{[[110, 'BUY STOP', 'di ATAS harga', C.blue, b(12) + 10], [260, 'HARGA SEKARANG', '', C.text, b(11)], [410, 'BUY LIMIT', 'di BAWAH harga', C.gold, b(12)]].map(([y, t, d, col, at]) => (
							<g key={t as string} opacity={a(at as number)}>
								<line x1={80} x2={1020} y1={y as number} y2={y as number} stroke={col as string} strokeWidth={4} strokeDasharray={t === 'HARGA SEKARANG' ? '2 0' : '14 10'} />
								<text x={90} y={(y as number) - 18} fill={col as string} fontFamily={MONO} fontWeight={700} fontSize={36}>{t}</text>
								<text x={1010} y={(y as number) - 18} textAnchor="end" fill={C.body} fontFamily={SANS} fontWeight={700} fontSize={32}>{d}</text>
							</g>
						))}
					</svg>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// ---------- S08 MT5 ----------
const Field: React.FC<{k: string; v: string; at: number; f: number; hi?: boolean}> = ({k, v, at, f, hi}) => {
	const on = f >= at;
	const glow = interpolate(f, [at, at + 10, at + 40], [0, 1, 0.35], clamp);
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 14}}>
			<div style={{width: 230, fontSize: 26, color: C.muted}}>{k}</div>
			<div style={{flex: 1, fontFamily: MONO, fontSize: 30, fontWeight: 700, color: on ? (hi ? C.gold : C.text) : 'rgba(159,168,184,0.35)', padding: '10px 18px', borderRadius: 10, background: 'rgba(7,18,38,0.85)', border: `2px solid rgba(201,162,74,${0.15 + glow * 0.85})`}}>{on ? v : '—'}</div>
		</div>
	);
};
export const SMt5: React.FC<SceneProps> = ({b}) => {
	const f = useCurrentFrame();
	const warn = f >= b(12) - 6;
	return (
		<AbsoluteFill>
			<SimBadge text="ILUSTRASI · CONTOH ANGKA · BUKAN SINYAL" />
			<div style={{position: 'absolute', left: 110, top: 190, width: 900}}>
				<Appear at={b(0)}>
					<div style={{background: 'linear-gradient(160deg, rgba(25,48,92,0.97), rgba(16,33,66,0.97))', border: '1.5px solid rgba(201,162,74,0.4)', borderRadius: 22, padding: '26px 34px', boxShadow: '0 20px 60px rgba(0,0,0,0.35)'}}>
						<div style={{fontFamily: MONO, fontSize: 22, color: C.gold, letterSpacing: 2, fontWeight: 700}}>ORDER BARU · MT5 (ILUSTRASI)</div>
						<Field k="Simbol" v="XAUUSD" at={b(1)} f={f} />
						<Field k="Tipe" v="Pending Order" at={b(2)} f={f} hi />
						<Field k="Jenis" v="Buy Limit" at={b(3)} f={f} hi />
						<Field k="Harga" v="3.742,00" at={b(4)} f={f} />
						<Field k="Stop Loss" v="3.736,00" at={b(5)} f={f} />
						<Field k="Take Profit" v="3.754,00" at={b(5) + 15} f={f} />
						<Field k="Volume" v="0,08" at={b(9)} f={f} hi />
						<Field k="Masa berlaku" v="Hari ini / tanggal" at={b(10)} f={f} />
					</div>
				</Appear>
			</div>
			<div style={{position: 'absolute', right: 90, top: 200, width: 700, display: 'flex', flexDirection: 'column', gap: 12}}>
				{!warn && (
					<>
						<Appear at={b(6)}><Badge>HITUNG LOT · CONTOH</Badge></Appear>
						<Row at={b(7)} k="Modal" v="$5.000" size={30} />
						<Row at={b(7) + 22} k="Risiko 1%" v="$50" size={30} />
						<Row at={b(8)} k="Jarak stop" v="$6" size={30} />
						<Row at={b(8) + 22} k="1 lot = 100 oz → $6 × 100" v="$600 / lot" size={30} />
						<Row at={b(9)} k="$50 ÷ $600 ≈ 0,083" v="0,08 lot" gold size={30} />
						<Appear at={b(9) + 24}><div style={{fontSize: 22, color: C.muted}}>Rugi di SL ≈ $48, bisa lebih besar karena slippage / spread melebar</div></Appear>
						<Appear at={b(11)}><Card accent={C.muted} style={{marginTop: 8}}><div style={{fontSize: 26, color: C.body}}>Pending order dibiarkan berhari-hari bisa terisi di kondisi yang <b style={{color: C.text}}>sudah beda</b></div></Card></Appear>
					</>
				)}
				{warn && (
					<>
						<Appear at={b(12)}><Card accent={C.red}><div style={{fontFamily: MONO, fontSize: 22, color: C.red, fontWeight: 700}}>"HARGA TIDAK VALID"?</div><div style={{fontSize: 30, fontWeight: 700, marginTop: 8}}>Cek arah: buy limit di atas harga = kebalik</div></Card></Appear>
						<Appear at={b(13)}><Card accent={C.gold}><div style={{fontFamily: MONO, fontSize: 22, color: C.gold, fontWeight: 700}}>JARAK MINIMUM</div><div style={{fontSize: 30, fontWeight: 700, marginTop: 8}}>Cek spesifikasi simbol di broker</div></Card></Appear>
					</>
				)}
			</div>
		</AbsoluteFill>
	);
};

// ---------- S09 TASK ----------
export const STask: React.FC<SceneProps> = ({b}) => (
	<List badge="TUGAS · AKUN DEMO" badgeAt={4} title="Latihan *4 pending order*" titleAt={b(0)} mark="check"
		items={['Buy limit + sell limit di area chart H1', 'Buy stop di atas resistance, sell stop di bawah support', 'SL & TP diisi sebelum klik', 'Jurnal: terisi atau nggak, selisih harga isi']}
		ats={[b(1), b(2), b(3), b(4)]} footer="Hafalin tombolnya *sebelum* pakai uang sungguhan." footerAt={b(5)} />
);

// ---------- S10 SUMMARY ----------
export const SSum: React.FC<SceneProps> = ({b}) => (
	<List badge="RINGKASAN" badgeAt={4} title="Jenis order dalam *1 layar*" titleAt={b(0)} compact
		items={['Market: sekarang · buy di ask, sell di bid · bisa slippage', 'Limit: harga lebih bagus · buy di bawah, sell di atas', 'Stop: konfirmasi · buy di atas, sell di bawah', 'SL = stop order · TP = limit order', 'SL = batas rencana, bukan jaminan', 'Entry, SL, TP, lot: semua sebelum klik']}
		ats={[b(1), b(2), b(3), b(4), b(5), b(6)]} />
);

// ---------- S11 CTA ----------
export const SCta: React.FC<SceneProps> = ({b}) => (
	<AbsoluteFill style={{padding: '150px 160px'}}>
		<Appear at={b(0)}><Card accent={C.muted} style={{fontSize: 30, color: C.body, maxWidth: 1180}}>Konten edukasi umum. Trading derivatif berleverage dapat menyebabkan kerugian dan kehilangan modal.</Card></Appear>
		<Appear at={b(2)} style={{marginTop: 56}}>
			<div style={{fontFamily: MONO, color: C.muted, fontSize: 26, letterSpacing: 2}}>JOIN KOMUNITAS TRADING</div>
			<div style={{fontFamily: SANS, fontWeight: 800, fontSize: 110, color: C.gold, letterSpacing: -2, marginTop: 6}}>dhirajkelly.id</div>
		</Appear>
		<Appear at={b(3)} style={{marginTop: 36}}>
			<Card style={{display: 'inline-block', fontSize: 34, fontWeight: 700}}>💬 Lo paling sering pakai market order atau pending order?</Card>
		</Appear>
		<Appear at={b(5)} style={{marginTop: 50}}>
			<div style={{fontFamily: SERIF, fontSize: 44, color: C.text}}>Dr. Dhiraj Kelly Sawlani</div>
			<Appear at={b(6)}><div style={{fontFamily: MONO, fontSize: 26, color: C.gold, marginTop: 10, letterSpacing: 2}}>MANAGE RISK · PROTECT CAPITAL · TRADE SMARTER</div></Appear>
		</Appear>
	</AbsoluteFill>
);

export const SCENES: Record<string, React.FC<SceneProps>> = {
	hook: SHook, roadmap: SMap, market: SMarket, limit: SLimit, stop: SStop, sltp: SSltp, pilih: SPilih, mt5: SMt5, task: STask, summary: SSum, cta: SCta,
};
void fmt;
