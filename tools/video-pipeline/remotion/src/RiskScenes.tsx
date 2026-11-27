// Scenes for Academy "Batas rugi harian dan mingguan" (Manajemen Risiko #12, format L whiteboard). b(k) = frame where sentence k starts.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Board, HAND, Hi, MARK, Note, Pop, SANSB, Stroke, Tag, Title, W, Write, arrowD, circleD, prog, underD} from './wb';
import D from './ohlcv.json';

type SP = {b: (k: number) => number; dur: number};
const T: React.FC<{s?: number; c?: string; w?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({s = 46, c = W.ink, w = 700, children, style}) => (
	<div style={{fontFamily: HAND, fontWeight: w, fontSize: s, color: c, lineHeight: 1.15, ...style}}>{children}</div>
);
const M: React.FC<{s?: number; c?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({s = 56, c = W.ink, children, style}) => (
	<div style={{fontFamily: MARK, fontSize: s, color: c, lineHeight: 1.1, ...style}}>{children}</div>
);
const Abs: React.FC<{x: number; y: number; w?: number; children: React.ReactNode}> = ({x, y, w, children}) => <div style={{position: 'absolute', left: x, top: y, width: w}}>{children}</div>;
const Ilus: React.FC<{x?: number; y?: number; label?: string}> = ({x = 1400, y = 120, label = 'CONTOH SIMULASI'}) => (
	<Abs x={x} y={y}>
		<Tag color={W.red} style={{fontSize: 30}}>{label}</Tag>
	</Abs>
);
const rp = (n: number) => 'Rp' + Math.round(n).toLocaleString('de-DE');

// equity after k stop losses of 1% of current balance (Python-checked: 8 SL = −772.553)
const EQ = Array.from({length: 9}, (_, k) => 10_000_000 * Math.pow(0.99, k));

// ---------- HOOK ----------
const Hook: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const card = b(1);
	const z = interpolate(f, [0, card], [1, 1.07], {extrapolateRight: 'clamp'});
	const fade = interpolate(f, [card - 8, card], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const times = ['09.00', '12.00', '13.00', '15.00', '18.00', '19.00', '20.00', '22.00'];
	const ats = [b(1), b(3), b(4) + 10, b(5) - 20, b(5), b(5) + 40, b(6) - 20, b(6)];
	let shown = 0;
	ats.forEach((a) => {
		if (f >= a) shown++;
	});
	const after = f >= b(8);
	return (
		<AbsoluteFill>
			<Board dur={dur}>
				<Title sub="modal Rp10 juta · risiko 1% per trade">SATU HARI JELEK</Title>
				<Ilus />
				{/* timeline of stop losses */}
				<div style={{position: 'absolute', left: 120, top: 300, opacity: after ? 0 : 1}}>
					{times.map((t, i) => (
						<div key={t} style={{position: 'absolute', left: (i % 4) * 300, top: Math.floor(i / 4) * 150, opacity: prog(f, ats[i], 8)}}>
							<T s={40} c={W.grey}>jam {t}</T>
							<div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
								<Tag color={W.red} style={{fontSize: 30}}>SL #{i + 1}</Tag>
								<T s={36} c={W.red}>−{rp(EQ[i] - EQ[i + 1]).replace('Rp', '')}</T>
							</div>
						</div>
					))}
				</div>
				<Abs x={120} y={640}>
					<div style={{opacity: after ? 0 : 1}}>
						<T s={44} c={W.grey}>saldo:</T>
						<M s={96} c={shown >= 8 ? W.red : W.ink}>{rp(EQ[shown])}</M>
					</div>
				</Abs>
				<Abs x={720} y={660}>
					<div style={{opacity: after ? 0 : 1}}>
						<Pop at={b(7)}>
							<M s={64} c={W.red}>−7,7% SEHARI</M>
							<T s={40}>0 trade yang langgar aturan 1%</T>
						</Pop>
					</div>
				</Abs>
				{/* the core idea */}
				{after && (
					<>
						<Abs x={120} y={300} w={1300}>
							<Write at={b(8)}>
								<M s={58}>
									ATURAN 1% <span style={{color: W.grey}}>→</span> 1 TRADE JELEK
								</M>
							</Write>
							<Write at={b(10)}>
								<M s={58} style={{marginTop: 30}}>
									BATAS HARIAN <span style={{color: W.grey}}>→</span> <Hi at={b(10) + 16}>1 HARI JELEK</Hi>
								</M>
							</Write>
						</Abs>
						<Note at={b(11)} x={120} y={560} w={640} color="#FFD6D6" rot={-1.5}>
							Gue margin call: nambah posisi pas harga lawan arah + nggak tau kapan berhenti
						</Note>
						<Abs x={860} y={580} w={600}>
							{['ANGKA PASTINYA', 'ATURAN < 3% SEHARI', 'KESALAHAN #3'].map((t, i) => (
								<div key={t} style={{marginBottom: 18}}>
									<Pop at={b(12) + 30 + i * 50}>
										<Tag color={[W.blue, W.green, W.red][i]} style={{fontSize: 36}}>{`${i + 1}. ${t}`}</Tag>
									</Pop>
								</div>
							))}
						</Abs>
					</>
				)}
			</Board>
			{f < card && (
				<AbsoluteFill style={{opacity: fade, background: 'radial-gradient(ellipse at 60% 40%, #1d2433 0%, #0b0d12 70%)'}}>
					<div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '80px 80px', transform: `scale(${z})`}} />
					<div style={{position: 'absolute', left: 120, top: 170, transform: `scale(${z})`, transformOrigin: '0 0'}}>
						<div style={{fontFamily: SANSB, fontWeight: 900, fontSize: 100, color: '#fff', lineHeight: 1.04, letterSpacing: -2, textTransform: 'uppercase'}}>
							<div style={{opacity: prog(f, 0, 8)}}>Modal 10 juta lo</div>
							<div style={{opacity: prog(f, 30, 8)}}>
								<span style={{color: '#FF5A5A'}}>−Rp772 ribu</span> sehari?
							</div>
						</div>
						<div style={{marginTop: 40, display: 'flex', gap: 26, opacity: prog(f, 110, 8)}}>
							<div style={{border: '3px solid rgba(255,255,255,0.8)', color: '#fff', fontFamily: SANSB, fontWeight: 800, fontSize: 44, padding: '8px 22px', borderRadius: 12}}>RISIKO CUMA 1% PER TRADE</div>
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
	const items = ['Kenapa risiko 1% per trade belum cukup (chart emas asli)', 'Cara nentuin batas harian & mingguan + itungan', 'Rencana berhenti, ditulis sebelum market buka', '3 kesalahan yang bikin batasnya jebol'];
	const cols = [W.blue, W.orange, W.green, W.red];
	return (
		<Board dur={dur}>
			<Title sub="Academy Doktor Trader · Manajemen Risiko · materi 12">PETA VIDEO</Title>
			{items.map((t, i) => (
				<Abs key={t} x={140} y={300 + i * 120}>
					<Write at={b(i + 2)} dur={20}>
						<div style={{display: 'flex', alignItems: 'center', gap: 26}}>
							<div style={{width: 74, height: 74, borderRadius: 40, border: `5px solid ${cols[i]}`, fontFamily: MARK, fontSize: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: cols[i]}}>{i + 1}</div>
							<T s={54}>{t}</T>
						</div>
					</Write>
				</Abs>
			))}
			<Abs x={1300} y={150}>
				<Pop at={b(1)}>
					<Tag color={W.red} style={{fontSize: 30}}>ANGKA HITUNGAN = SIMULASI</Tag>
				</Pop>
			</Abs>
		</Board>
	);
};

// ---------- WHY: real chart XAUUSD H1 25 Nov 2026 (ohlcv.json idx 12..29) ----------
const I0 = 12, I1 = 29;
const CX = 150, CY = 260, CW = 1180, CH = 520, PMIN = 3415, PMAX = 3590;
const px = (i: number) => CX + ((i - I0 + 0.5) / (I1 - I0 + 1)) * CW;
const py = (p: number) => CY + ((PMAX - p) / (PMAX - PMIN)) * CH;
const hour = (i: number) => new Date((D.t[i] + 7 * 3600) * 1000).getUTCHours();
const Why: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const n = I1 - I0 + 1;
	const bw = (CW / n) * 0.55;
	const big = (i: number) => D.h[i] - D.l[i] > 15;
	const callouts: [number, string][] = [
		[24, '$48'],
		[25, '$41'],
		[26, '$56'],
	];
	return (
		<Board dur={dur}>
			<Title sub="XAUUSD · H1 · OANDA · 25 Nov 2026">CHART EMAS ASLI</Title>
			<Abs x={1380} y={130}>
				<Tag color={W.ink} style={{fontSize: 28}}>DATA ASLI · BUKAN SINYAL</Tag>
			</Abs>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<defs>
					<filter id="rough2">
						<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={5} />
						<feDisplacementMap in="SourceGraphic" scale={2.2} />
					</filter>
				</defs>
				<path d={`M ${CX} ${CY - 10} L ${CX} ${CY + CH} L ${CX + CW} ${CY + CH}`} stroke={W.ink} strokeWidth={4} fill="none" filter="url(#rough2)" opacity={prog(f, 0, 10)} />
				{[3450, 3500, 3550].map((p) => (
					<g key={p} opacity={prog(f, 6, 10)}>
						<line x1={CX - 10} x2={CX} y1={py(p)} y2={py(p)} stroke={W.ink} strokeWidth={3} />
						<text x={CX - 18} y={py(p) + 11} textAnchor="end" fontFamily={HAND} fontWeight={700} fontSize={32} fill={W.grey}>
							{p.toLocaleString('de-DE')}
						</text>
					</g>
				))}
				{[12, 18, 24, 29].map((i) => (
					<text key={i} x={px(i)} y={CY + CH + 44} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={32} fill={W.grey} opacity={prog(f, 6, 10)}>
						{String(hour(i)).padStart(2, '0')}.00
					</text>
				))}
				<g filter="url(#rough2)">
					{Array.from({length: n}).map((_, k) => {
						const i = I0 + k;
						const o = D.o[i], h = D.h[i], l = D.l[i], c = D.c[i];
						const col = c >= o ? W.green : W.red;
						const pp = prog(f, 10 + k * 4, 6);
						if (pp <= 0) return null;
						const yT = py(Math.max(o, c)), yB = py(Math.min(o, c));
						return (
							<g key={i} opacity={pp}>
								<line x1={px(i)} x2={px(i)} y1={py(h)} y2={py(l)} stroke={W.ink} strokeWidth={3} />
								<rect x={px(i) - bw / 2} y={yT} width={bw} height={Math.max(3, yB - yT)} fill={col} fillOpacity={0.8} stroke={W.ink} strokeWidth={3} />
							</g>
						);
					})}
				</g>
				{/* dots under candles whose high-low range > $15 */}
				{Array.from({length: n}).map((_, k) => {
					const i = I0 + k;
					if (!big(i)) return null;
					return <circle key={'d' + i} cx={px(i)} cy={CY + CH - 16} r={9} fill={W.orange} opacity={prog(f, b(4) + k * 3, 6)} />;
				})}
				{/* high / low labels */}
				<g opacity={prog(f, b(1), 10)}>
					<line x1={px(15) - 30} x2={CX + CW} y1={py(3575.29)} y2={py(3575.29)} stroke={W.green} strokeWidth={3} strokeDasharray="14 10" />
					<text x={px(15) + 26} y={py(3575.29) - 12} fontFamily={HAND} fontWeight={700} fontSize={38} fill={W.green}>
						high 3.575,29 (09.00)
					</text>
				</g>
				<g opacity={prog(f, b(1) + 40, 10)}>
					<line x1={px(15) - 30} x2={CX + CW} y1={py(3426.805)} y2={py(3426.805)} stroke={W.red} strokeWidth={3} strokeDasharray="14 10" />
					<text x={px(22)} y={py(3426.805) - 14} textAnchor="end" fontFamily={HAND} fontWeight={700} fontSize={38} fill={W.red}>
						low 3.426,81 (22.00)
					</text>
				</g>
				{/* range bracket */}
				<g opacity={prog(f, b(2), 10)}>
					<line x1={CX + CW + 30} x2={CX + CW + 30} y1={py(3575.29)} y2={py(3426.805)} stroke={W.ink} strokeWidth={5} />
					<line x1={CX + CW + 18} x2={CX + CW + 42} y1={py(3575.29)} y2={py(3575.29)} stroke={W.ink} strokeWidth={5} />
					<line x1={CX + CW + 18} x2={CX + CW + 42} y1={py(3426.805)} y2={py(3426.805)} stroke={W.ink} strokeWidth={5} />
				</g>
				{callouts.map(([i, t], k) => (
					<text key={t} x={px(i)} y={py(D.h[i]) - 18} textAnchor="middle" fontFamily={MARK} fontSize={34} fill={W.red} opacity={prog(f, b(5) + 20 + k * 40, 8)}>
						{t}
					</text>
				))}
				{/* $15 stop-loss ruler */}
				<g opacity={prog(f, b(6), 10)}>
					<rect x={px(13) - 20} y={py(3460)} width={40} height={py(3445) - py(3460)} fill={W.blue} fillOpacity={0.35} stroke={W.blue} strokeWidth={4} />
					<text x={px(13) + 34} y={py(3452) + 12} fontFamily={HAND} fontWeight={700} fontSize={36} fill={W.blue}>
						SL $15
					</text>
				</g>
			</svg>
			<Abs x={1205} y={py(3560)}>
				<Pop at={b(2)}>
					<M s={60} c={W.ink}>$148</M>
					<T s={34}>sehari</T>
				</Pop>
			</Abs>
			<Abs x={720} y={150}>
				<Pop at={b(4) + 30}>
					<div style={{background: '#fff', border: `3px solid ${W.orange}`, borderRadius: 12, padding: '6px 16px'}}>
						<T s={34} c={W.orange}>● 14 dari 18 candle: high–low &gt; $15</T>
					</div>
				</Pop>
			</Abs>
			<Note at={b(7)} x={1430} y={300} w={420} color="#E8EEFF" rot={2}>
				Bukan salah analisa. Ini karakter emas di hari volatil.
			</Note>
			<Note at={b(10)} x={1430} y={540} w={420} color="#FFD6D6" rot={-2}>
				Aturan 1% ngatur <b>ukuran</b> 1 trade, bukan <b>berapa kali</b> lo klik
			</Note>
			<Abs x={CX} y={CY + CH + 70}>
				<T s={28} c={W.grey}>Data asli XAUUSD · H1 · 25 Nov 2026 WIB · TradingView (OANDA)</T>
			</Abs>
		</Board>
	);
};

// ---------- SIM: Trader A (no limit) vs Trader B (3% limit) ----------
const Sim: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const rowA = (k: number) => b(4) + k * 14;
	const rowB = (k: number) => b(8) - 30 + k * 16;
	const recov = f >= b(11);
	return (
		<Board dur={dur}>
			<Title sub="modal Rp10 juta · risiko 1% dari saldo terakhir">TRADER A vs TRADER B</Title>
			<Ilus />
			<div style={{opacity: recov ? 0 : 1}}>
				<Abs x={120} y={270} w={640}>
					<Write at={b(2)}>
						<M s={46} c={W.red}>A · TANPA BATAS HARIAN</M>
					</Write>
					{Array.from({length: 8}).map((_, k) => (
						<div key={k} style={{display: 'flex', gap: 18, alignItems: 'center', marginTop: 6, opacity: prog(f, rowA(k), 6)}}>
							<T s={34} c={W.grey} style={{width: 120}}>SL #{k + 1}</T>
							<div style={{height: 26, width: ((EQ[k] - EQ[k + 1]) / 100000) * 260, background: W.red, opacity: 0.8, border: `3px solid ${W.ink}`, borderRadius: 6}} />
							<T s={34}>−{rp(EQ[k] - EQ[k + 1]).replace('Rp', '')}</T>
						</div>
					))}
					<Pop at={b(6)}>
						<div style={{marginTop: 16, border: `5px solid ${W.red}`, borderRadius: 14, padding: '8px 18px', display: 'inline-block', background: '#fff'}}>
							<M s={44} c={W.red}>−Rp772.553 (−7,7%)</M>
						</div>
					</Pop>
				</Abs>
				<Stroke d="M 820 280 L 820 820" at={b(7) - 6} color={W.ink} width={4} />
				<Abs x={880} y={270} w={600}>
					<Write at={b(7)}>
						<M s={46} c={W.green}>B · BATAS 3% SEHARI</M>
					</Write>
					{Array.from({length: 3}).map((_, k) => (
						<div key={k} style={{display: 'flex', gap: 18, alignItems: 'center', marginTop: 6, opacity: prog(f, rowB(k), 6)}}>
							<T s={34} c={W.grey} style={{width: 120}}>SL #{k + 1}</T>
							<div style={{height: 26, width: ((EQ[k] - EQ[k + 1]) / 100000) * 260, background: W.red, opacity: 0.8, border: `3px solid ${W.ink}`, borderRadius: 6}} />
							<T s={34}>−{rp(EQ[k] - EQ[k + 1]).replace('Rp', '')}</T>
						</div>
					))}
					<Pop at={b(8) + 30}>
						<div style={{marginTop: 16, border: `5px solid ${W.green}`, borderRadius: 14, padding: '8px 18px', display: 'inline-block', background: '#fff'}}>
							<M s={44} c={W.green}>−Rp297.010 (−2,97%)</M>
						</div>
					</Pop>
					<Pop at={b(9)}>
						<div style={{marginTop: 24, display: 'inline-block', transform: 'rotate(-4deg)', border: `6px solid ${W.red}`, color: W.red, fontFamily: MARK, fontSize: 52, padding: '4px 22px', borderRadius: 10}}>STOP · TUTUP PLATFORM</div>
					</Pop>
				</Abs>
				<Abs x={880} y={720}>
					<Write at={b(10)}>
						<M s={44}>
							selisih <Hi at={b(10) + 14}>Rp475 ribu</Hi>
						</M>
						<T s={36} c={W.grey}>strategi & setup yang sama</T>
					</Write>
				</Abs>
			</div>
			{recov && (
				<Abs x={140} y={290} w={1300}>
					<Write at={b(11)}>
						<M s={54}>BIAYA BALIK MODAL</M>
					</Write>
					{[
						['rugi 2,97%', 'butuh naik 3,06%', W.green, b(12)],
						['rugi 7,73%', 'butuh naik 8,38%', W.red, b(13)],
					].map(([a, c2, col, at], i) => (
						<div key={a as string} style={{display: 'flex', gap: 40, alignItems: 'center', marginTop: 34, opacity: prog(f, at as number, 8)}}>
							<M s={64} c={col as string} style={{width: 420}}>
								{a}
							</M>
							<T s={56} style={{width: 90}}>→</T>
							<M s={64} c={col as string}>
								{c2}
							</M>
						</div>
					))}
					<Write at={b(14)}>
						<T s={50} c={W.grey} style={{marginTop: 44}}>
							makin dalam lubangnya, makin jauh jalan pulangnya
						</T>
					</Write>
					<Stroke d={underD(0 + 140, 760, 900)} at={b(14) + 16} color={W.yellow} width={16} />
				</Abs>
			)}
		</Board>
	);
};

// ---------- REVENGE: doubling risk ----------
const Revenge: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const steps: [string, number, number, number][] = [
		['1%', 100000, 100000, b(4)],
		['2%', 198000, 298000, b(5)],
		['4%', 388080, 686080, b(7)],
		['8%', 745114, 1431194, b(9)],
	];
	const base = 820;
	return (
		<Board dur={dur}>
			<Title sub="lot digedein buat balikin rugi">REVENGE TRADING</Title>
			<Ilus />
			{f < b(3) && (
				<Abs x={140} y={330} w={1200}>
					<Write at={b(0)}>
						<T s={54} c={W.grey}>Trader A masih "sopan": tetap 1% tiap trade.</T>
					</Write>
					<Write at={b(1)}>
						<M s={58} style={{marginTop: 30}}>
							setelah 3x kena: <Hi at={b(1) + 30} color="#FFB3B3">lot digedein</Hi>
						</M>
					</Write>
					<Pop at={b(2)}>
						<div style={{marginTop: 40, display: 'inline-block', border: `6px solid ${W.red}`, color: W.red, fontFamily: MARK, fontSize: 64, padding: '6px 26px', borderRadius: 12, transform: 'rotate(-3deg)'}}>REVENGE TRADING</div>
					</Pop>
				</Abs>
			)}
			{f >= b(3) &&
				steps.map(([pct, loss, cum, at], i) => {
					const p = prog(f, at, 14);
					const h = (cum / 1431194) * 470 * p;
					const x = 200 + i * 270;
					return (
						<React.Fragment key={pct}>
							<div style={{position: 'absolute', left: x, top: base - h, width: 170, height: h, background: W.red, opacity: 0.25 + 0.15 * i, border: `4px solid ${W.ink}`, borderRadius: 8}} />
							<div style={{position: 'absolute', left: x - 10, top: base + 14, width: 200, textAlign: 'center', opacity: p}}>
								<T s={36}>trade {i + 1}</T>
								<M s={40} c={W.red}>risiko {pct}</M>
							</div>
							<div style={{position: 'absolute', left: x - 30, top: base - h - 70, width: 240, textAlign: 'center', opacity: prog(f, at + 14, 8)}}>
								<M s={38} c={W.ink}>−{rp(cum).replace('Rp', '')}</M>
							</div>
						</React.Fragment>
					);
				})}
			{f >= b(3) && (
				<>
					<Abs x={1290} y={300}>
						<Pop at={b(10)}>
							<div style={{border: `5px solid ${W.red}`, borderRadius: 14, padding: '10px 20px', background: '#fff'}}>
								<M s={50} c={W.red}>−14,3%</M>
								<T s={34}>cuma 4 trade</T>
							</div>
						</Pop>
					</Abs>
					<Abs x={1290} y={500}>
						<Pop at={b(11) + 30}>
							<M s={66} c={W.red}>14× lipat</M>
							<T s={34}>dari rugi rencana Rp100 ribu</T>
						</Pop>
					</Abs>
					<Note at={b(12)} x={300} y={300} w={640} color="#E8F7EE" rot={-1.5}>
						Batas harian = <b>rem</b> pas kepala lo udah nggak bisa dipercaya
					</Note>
				</>
			)}
		</Board>
	);
};

// ---------- RULES ----------
const Rules: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const late = f >= b(9);
	return (
		<Board dur={dur}>
			<Title sub="kerangka yang bisa disesuaikan, bukan angka sakral">CARA NENTUIN BATAS</Title>
			<div style={{opacity: late ? 0 : 1}}>
				{[
					['HARIAN', '3%', 'dari saldo awal hari', 'berhenti sampai besok', 'Rp300 ribu', W.orange, b(2), b(3)],
					['MINGGUAN', '6%', 'dari saldo awal minggu', 'berhenti + buka jurnal', 'Rp600 ribu', W.blue, b(4), b(5)],
				].map(([h, pct, base, act, rpv, col, at, at2], i) => (
					<div key={h as string} style={{position: 'absolute', left: 130 + i * 640, top: 270, width: 580}}>
						<Pop at={at as number}>
							<div style={{border: `6px solid ${col}`, borderRadius: 22, padding: '20px 30px', background: '#fff'}}>
								<M s={40} c={col as string}>BATAS {h}</M>
								<M s={110} c={W.ink}>
									{pct}
								</M>
								<T s={38} c={W.grey}>{base}</T>
								<div style={{opacity: prog(f, at2 as number, 8)}}>
									<T s={40} c={W.red} style={{marginTop: 8}}>kena → {act}</T>
								</div>
								<div style={{opacity: prog(f, b(6) + i * 40, 8), marginTop: 12}}>
									<T s={36} c={W.grey}>modal 10 juta =</T>
									<M s={52} c={col as string}>{rpv}</M>
								</div>
							</div>
						</Pop>
					</div>
				))}
				<Abs x={130} y={830} w={1250}>
					<Write at={b(7)}>
						<T s={42}>risiko 1%/trade → ±3 SL beruntun</T>
					</Write>
					<Write at={b(8)}>
						<T s={42}>risiko 0,5%/trade → ±6 SL beruntun</T>
					</Write>
				</Abs>
			</div>
			{late && (
				<Abs x={140} y={300} w={1250}>
					<Write at={b(9)}>
						<M s={58}>
							HITUNG PAKAI <Hi at={b(9) + 16}>EQUITY</Hi>
						</M>
					</Write>
					<Write at={b(10)}>
						<T s={44} c={W.grey} style={{marginTop: 10}}>posisi floating minus ikut dihitung</T>
					</Write>
					<div style={{display: 'flex', gap: 30, alignItems: 'center', marginTop: 50, opacity: prog(f, b(11), 10)}}>
						<div style={{border: `4px solid ${W.ink}`, borderRadius: 14, padding: '12px 20px', background: '#fff'}}>
							<T s={34} c={W.grey}>rugi closed</T>
							<M s={50} c={W.red}>−Rp100 rb</M>
						</div>
						<M s={60}>+</M>
						<div style={{border: `4px solid ${W.ink}`, borderRadius: 14, padding: '12px 20px', background: '#fff'}}>
							<T s={34} c={W.grey}>floating</T>
							<M s={50} c={W.red}>−Rp200 rb</M>
						</div>
						<M s={60}>=</M>
						<div style={{border: `6px solid ${W.red}`, borderRadius: 14, padding: '12px 20px', background: '#FFE9E9'}}>
							<T s={34} c={W.grey}>3% = batas</T>
							<M s={50} c={W.red}>−Rp300 rb</M>
						</div>
					</div>
					<Pop at={b(12)}>
						<div style={{marginTop: 40, display: 'inline-block', border: `6px solid ${W.red}`, color: W.red, fontFamily: MARK, fontSize: 50, padding: '4px 22px', borderRadius: 10, transform: 'rotate(-3deg)'}}>JANGAN BUKA POSISI BARU</div>
					</Pop>
				</Abs>
			)}
		</Board>
	);
};

// ---------- WEEK ----------
const Week: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const days: [string, string, string, number][] = [
		['SEN', '−3%', W.red, b(3)],
		['SEL', '−3%', W.red, b(4)],
		['RAB', 'STOP', W.grey, b(7)],
		['KAM', 'EVALUASI', W.grey, b(7) + 20],
		['JUM', 'EVALUASI', W.grey, b(7) + 40],
	];
	return (
		<Board dur={dur}>
			<Title sub="hari jelek suka datang berurutan">KENAPA BATAS MINGGUAN</Title>
			<Ilus />
			{days.map(([d, v, c, at], i) => (
				<div key={d} style={{position: 'absolute', left: 130 + i * 250, top: 290, width: 220, opacity: prog(f, at - 6, 8)}}>
					<div style={{border: `5px solid ${W.ink}`, borderRadius: 16, background: i < 2 ? '#FFE9E9' : '#F1F1EC', height: 190, padding: '10px 14px'}}>
						<M s={40}>{d}</M>
						<M s={i < 2 ? 64 : 36} c={c} style={{marginTop: 18}}>
							{v}
						</M>
					</div>
				</div>
			))}
			<Abs x={130} y={530} w={1250}>
				<Write at={b(5)}>
					<M s={50}>
						total −5,91% <span style={{color: W.grey}}>(−Rp591 ribu)</span>
					</M>
				</Write>
				<Write at={b(6)}>
					<M s={50} style={{marginTop: 14}}>
						sisa jatah 6%: <Hi at={b(6) + 14}>0,09%</Hi> → minggu selesai Selasa
					</M>
				</Write>
			</Abs>
			<Note at={b(8)} x={130} y={730} w={760} color="#FFD6D6" rot={-1}>
				Tanpa batas, 8 SL di 2 hari: <b>−14,85%</b>. Butuh naik <b>17,48%</b> buat balik ke 10 juta
			</Note>
			<Abs x={960} y={760} w={500}>
				<Write at={b(10)}>
					<T s={40} c={W.green}>sisa minggu = evaluasi, bukan ngejar</T>
				</Write>
			</Abs>
		</Board>
	);
};

// ---------- PLAN ----------
const Plan: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const lines: [string, string, number][] = [
		['1. Saldo awal hari ini', 'Rp10.000.000', b(4)],
		['2. Batas rugi harian (angka!)', 'Rp300.000', b(5)],
		['3. Sisa jatah minggu ini', 'Rp600.000', b(6)],
		['4. Kalau batas kena', 'tutup posisi · logout · tutup app HP · isi jurnal', b(7)],
	];
	const late = f >= b(9);
	return (
		<Board dur={dur}>
			<Title sub="ditulis SEBELUM market buka, bukan pas lagi rugi">RENCANA BERHENTI</Title>
			<Note at={b(2)} x={1360} y={130} w={420} color="#FFD6D6" rot={3}>
				Pas rugi, otak selalu nemu alasan "satu lagi"
			</Note>
			<div style={{position: 'absolute', left: 130, top: 280, width: 1150, background: '#fff', border: `5px solid ${W.ink}`, borderRadius: 18, padding: '26px 40px', boxShadow: '0 12px 30px rgba(0,0,0,0.12)', backgroundImage: 'repeating-linear-gradient(transparent, transparent 66px, rgba(36,98,168,0.18) 67px)', opacity: prog(f, b(3) - 6, 10)}}>
				<M s={40} c={W.blue}>CATATAN PAGI · contoh</M>
				{lines.map(([h, v, at], i) => (
					<div key={h} style={{marginTop: 18}}>
						<Write at={at}>
							<T s={42}>{h}:</T>
						</Write>
						<Write at={i === 3 ? b(8) : at + 18}>
							<M s={i === 3 ? 36 : 46} c={i === 3 ? W.red : W.ink}>
								{v}
							</M>
						</Write>
					</div>
				))}
			</div>
			{late && (
				<>
					<Abs x={1320} y={330} w={540}>
						<Pop at={b(9)}>
							<div style={{display: 'inline-block', border: `6px solid ${W.red}`, color: W.red, fontFamily: MARK, fontSize: 40, padding: '4px 22px', borderRadius: 10, background: '#fff', transform: 'rotate(-2deg)'}}>MANTAU DOANG = PINTU REVENGE TRADING</div>
						</Pop>
					</Abs>
					<Note at={b(11)} x={1340} y={560} w={460} color="#E8F7EE" rot={-2}>
						Sering melanggar? Pakai alat <b>auto-close</b> saat batas harian kena
					</Note>
				</>
			)}
		</Board>
	);
};

// ---------- MISTAKES ----------
const Mistakes: React.FC<SP> = ({b, dur}) => {
	const items: [string, string, number, number][] = [
		['Batas cuma di kepala', '"ah tanggung, satu lagi" pas −2,8%', b(1), b(2)],
		['Ngitung dari posisi closed aja', 'floating −2% tanpa SL ikut lupa dihitung', b(3), b(4)],
		['Reset batas di tengah hari', '"sesi baru" = sama aja nggak punya batas', b(5), b(6)],
	];
	return (
		<Board dur={dur}>
			<Title>3 KESALAHAN UMUM</Title>
			{items.map(([h, fix, at, at2], i) => (
				<Abs key={h} x={130} y={260 + i * 175} w={1300}>
					<div style={{display: 'flex', alignItems: 'center', gap: 28}}>
						<Pop at={at}>
							<M s={80} c={W.red}>✗</M>
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
			<Note at={b(8)} x={130} y={800} w={720} color="#E8EEFF" rot={1.5}>
				1 hari = 1 hari. Jatah balik <b>besok pagi</b>.
			</Note>
		</Board>
	);
};

// ---------- SUMMARY ----------
const Summary: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const tiers: [string, string, number][] = [
		['Aturan 1%', '1 trade jelek', b(1)],
		['Batas harian', '1 hari jelek', b(2)],
		['Batas mingguan', '1 minggu jelek', b(3)],
	];
	const steps: [string, number][] = [
		['Tulis saldo awal + batas harian (Rp) sebelum market buka', b(6)],
		['Hitung pakai equity, termasuk floating', b(7)],
		['Batas kena: tutup platform, isi jurnal. Nggak ada "satu lagi"', b(8)],
	];
	const late = f >= b(5);
	return (
		<Board dur={dur}>
			<Title>RANGKUMAN</Title>
			{!late &&
				tiers.map(([a, c, at], i) => (
					<Abs key={a} x={140} y={280 + i * 120} w={1200}>
						<Write at={at}>
							<M s={56}>
								{a} <span style={{color: W.grey}}>→</span> <span style={{color: [W.blue, W.orange, W.green][i]}}>{c}</span>
							</M>
						</Write>
					</Abs>
				))}
			{!late && (
				<Note at={b(4)} x={140} y={680} w={820} color="#E8F7EE" rot={-1}>
					Contoh simulasi: rugi sehari −7,7% → <b>−2,97%</b> dengan batas 3%
				</Note>
			)}
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
									<T s={50}>{t}</T>
								</Write>
							</div>
						</Abs>
					))}
				</>
			)}
		</Board>
	);
};

// ---------- DISCLAIMER ----------
const Disclaimer: React.FC<SP> = ({b, dur}) => (
	<Board dur={dur}>
		<Abs x={200} y={260} w={1300}>
			<Pop at={2}>
				<div style={{border: `6px solid ${W.ink}`, borderRadius: 24, padding: '40px 54px', background: '#fff'}}>
					<M s={56} c={W.red}>⚠ PENGINGAT</M>
					<T s={50} style={{marginTop: 18}}>Edukasi umum, bukan ajakan transaksi atau saran keuangan pribadi.</T>
					<Write at={b(1)}>
						<T s={50} style={{marginTop: 8}}>Semua angka hitungan di video ini contoh simulasi.</T>
					</Write>
					<Write at={b(2)}>
						<T s={50} c={W.red} style={{marginTop: 8}}>Trading berleverage bisa menyebabkan rugi & kehilangan modal. Stop loss bisa kena slippage.</T>
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
					Komen: <span style={{color: W.gold}}>tim berhenti di −3%</span> atau <span style={{color: W.gold}}>tim "batas bikin kehilangan peluang"?</span>
				</div>
				<div style={{opacity: prog(f, b(3), 10), marginTop: 60, fontFamily: SANSB, fontWeight: 900, fontSize: 92, color: '#fff', letterSpacing: -1}}>JOIN KOMUNITAS TRADING</div>
				<div style={{opacity: prog(f, b(3) + 10, 10), fontFamily: SANSB, fontWeight: 900, fontSize: 120, color: W.gold, letterSpacing: -2}}>dhirajkelly.id</div>
				<div style={{opacity: prog(f, b(4), 10), marginTop: 30, display: 'inline-block', background: '#E62117', color: '#fff', fontFamily: SANSB, fontWeight: 800, fontSize: 42, padding: '10px 28px', borderRadius: 10}}>SUBSCRIBE · Doktor Trader</div>
			</div>
		</AbsoluteFill>
	);
};

void arrowD;
void circleD;
export const SCENES: Record<string, React.FC<SP>> = {
	hook: Hook,
	map: MapS,
	why: Why,
	sim: Sim,
	revenge: Revenge,
	rules: Rules,
	week: Week,
	plan: Plan,
	mistakes: Mistakes,
	summary: Summary,
	disclaimer: Disclaimer,
	cta: Cta,
};
