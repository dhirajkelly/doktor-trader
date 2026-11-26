// Scenes for Academy "Jurnal trading" (format L whiteboard + T1 hook card). b(k) = frame where sentence k starts.
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
const Ilus: React.FC<{x?: number; y?: number; label?: string}> = ({x = 1490, y = 112, label = 'ILUSTRASI · SIMULASI'}) => (
	<Abs x={x} y={y}>
		<Tag color={W.red}>{label}</Tag>
	</Abs>
);

// ---------- HOOK (dark cinematic card 0-3s, then board) ----------
const Hook: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const card = b(4);
	const z = interpolate(f, [0, card], [1, 1.08], {extrapolateRight: 'clamp'});
	const fade = interpolate(f, [card - 8, card], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill>
			<Board dur={dur}>
				<Abs x={110} y={150}>
					<Write at={card + 4}>
						<M s={70}>JURNAL 10 TRADE <span style={{color: W.grey, fontSize: 44}}>(ilustrasi)</span></M>
					</Write>
				</Abs>
				{/* two bars */}
				{[
					{lab: '6 trade sesuai rencana', v: 3, c: W.green, txt: '+3R', y: 330, at: b(5) + 10},
					{lab: '4 trade di luar rencana', v: -3.1, c: W.red, txt: '−3,1R', y: 470, at: b(5) + 40},
				].map((r) => {
					const p = prog(f, r.at, 22);
					return (
						<div key={r.lab} style={{position: 'absolute', left: 110, top: r.y}}>
							<Write at={r.at - 8}>
								<T s={48}>{r.lab}</T>
							</Write>
							<div style={{marginTop: 8, height: 58, width: 120 * Math.abs(r.v) * p * 2.2, background: r.c, opacity: 0.85, borderRadius: 8, border: `4px solid ${W.ink}`}} />
							<div style={{position: 'absolute', left: 120 * Math.abs(r.v) * p * 2.2 + 24, top: 58, fontFamily: MARK, fontSize: 56, color: r.c, opacity: p}}>{r.txt}</div>
						</div>
					);
				})}
				<Abs x={110} y={640}>
					<Write at={b(6)}>
						<M s={54}>STRATEGI <span style={{color: W.green}}>OK</span>. YANG BOCOR: <Hi at={b(7)}>KEBIASAAN</Hi></M>
					</Write>
				</Abs>
				<Abs x={110} y={760} w={1250}>
					<div style={{display: 'flex', gap: 22, flexWrap: 'wrap'}}>
						{['CARA ISI', 'CONTOH DI CHART ASLI', 'REVIEW MINGGUAN'].map((t, i) => (
							<Pop key={t} at={b(8) + 20 + i * 40}>
								<Tag color={[W.blue, W.orange, W.green][i]} style={{fontSize: 34}}>{`${i + 1}. ${t}`}</Tag>
							</Pop>
						))}
					</div>
				</Abs>
				<Stroke d={underD(110, 728, 1060)} at={b(7) + 20} color={W.red} width={6} />
			</Board>
			{f < card && (
				<AbsoluteFill style={{opacity: fade, background: 'radial-gradient(ellipse at 60% 40%, #1d2433 0%, #0b0d12 70%)'}}>
					<div style={{position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '80px 80px', transform: `scale(${z})`}} />
					<div style={{position: 'absolute', left: 120, top: 150, transform: `scale(${z})`, transformOrigin: '0 0'}}>
						<div style={{fontFamily: SANSB, fontWeight: 900, fontSize: 104, color: '#fff', lineHeight: 1.02, letterSpacing: -2, textTransform: 'uppercase'}}>
							<div style={{opacity: prog(f, 0, 8)}}>Trade rugi terakhir lo,</div>
							<div style={{opacity: prog(f, b(1), 8)}}>
								<span style={{color: W.gold}}>alasannya apa?</span>
							</div>
						</div>
						<div style={{marginTop: 40, display: 'flex', gap: 26}}>
							{[
								['JAM BERAPA?', b(2)],
								['PERASAAN LO?', b(3)],
							].map(([t, at]) => (
								<div key={t as string} style={{opacity: prog(f, at as number, 8), border: '3px solid rgba(255,255,255,0.8)', color: '#fff', fontFamily: SANSB, fontWeight: 800, fontSize: 44, padding: '8px 22px', borderRadius: 12}}>
									{t}
								</div>
							))}
						</div>
					</div>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

// ---------- MAP ----------
const MapS: React.FC<SP> = ({b, dur}) => {
	const items = ['Kenapa jurnal = alat belajar paling murah', 'Kolom yang wajib dicatat', 'Contoh 1 baris + itungan lot', 'Review 10–20 trade tiap akhir pekan', '3 kesalahan yang bikin jurnal percuma'];
	return (
		<Board dur={dur}>
			<Title>PETA VIDEO</Title>
			{items.map((t, i) => (
				<Abs key={t} x={140} y={250 + i * 112}>
					<Write at={b(i + 1)} dur={20}>
						<div style={{display: 'flex', alignItems: 'center', gap: 26}}>
							<div style={{width: 74, height: 74, borderRadius: 40, border: `5px solid ${[W.blue, W.orange, W.red, W.green, W.ink][i]}`, fontFamily: MARK, fontSize: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: [W.blue, W.orange, W.red, W.green, W.ink][i]}}>{i + 1}</div>
							<T s={56}>{t}</T>
						</div>
					</Write>
				</Abs>
			))}
			<Abs x={1150} y={140}>
				<Pop at={b(6)}>
					<Tag color={W.red} style={{fontSize: 30}}>SEMUA CHART & ANGKA = SIMULASI</Tag>
				</Pop>
			</Abs>
		</Board>
	);
};

// ---------- WHY ----------
const Why: React.FC<SP> = ({b, dur}) => (
	<Board dur={dur}>
		<Title>INGATAN vs JURNAL</Title>
		<Abs x={110} y={260} w={600}>
			<Write at={b(1)}>
				<M s={50} c={W.red}>INGATAN 🧠</M>
			</Write>
			<Write at={b(2)}>
				<T s={50} style={{marginTop: 24}}>Profit → "gue jago"</T>
			</Write>
			<Write at={b(3)}>
				<T s={50} style={{marginTop: 14}}>Rugi → "sial, spread, market aneh"</T>
			</Write>
			<Write at={b(4)}>
				<T s={50} c={W.red} style={{marginTop: 14}}>= nggak belajar apa-apa</T>
			</Write>
		</Abs>
		<Stroke d="M 760 250 L 760 600" at={b(5) - 6} color={W.ink} width={4} />
		<Abs x={820} y={260} w={600}>
			<Write at={b(5)}>
				<M s={50} c={W.green}>JURNAL ✍️</M>
			</Write>
			<Write at={b(6)}>
				<T s={50} style={{marginTop: 24}}>Alasan ditulis <Hi at={b(6) + 20}>SEBELUM</Hi> hasil</T>
			</Write>
			<Write at={b(7)}>
				<T s={50} style={{marginTop: 14}}>Mikir 2x sebelum klik</T>
			</Write>
		</Abs>
		<Note at={b(8)} x={140} y={650} w={420} rot={-2}>
			Biaya: <b style={{color: W.green}}>Rp0</b>
			<br />± 2 menit / trade
		</Note>
		<Note at={b(10)} x={640} y={650} w={560} color="#FFD6D6" rot={1.5}>
			Biaya belajar dari <b style={{color: W.red}}>margin call</b>: jauh lebih mahal
		</Note>
		<Stroke d={arrowD(570, 720, 630, 720)} at={b(10) + 10} color={W.ink} width={5} />
	</Board>
);

// ---------- COLS (5 groups) ----------
const Cols: React.FC<SP> = ({b, dur}) => {
	const groups = [
		{h: '1. DATA POSISI', t: 'tanggal · jam · pair · buy/sell · lot', c: W.blue, at: b(2)},
		{h: '2. RENCANA HARGA', t: 'entry · stop loss · take profit', c: W.orange, at: b(3), note: 'diisi SEBELUM klik'},
		{h: '3. ALASAN MASUK', t: 'setup apa? 1 kalimat', c: W.red, at: b(5), note: 'nggak bisa 1 kalimat = perasaan'},
		{h: '4. HASIL (dalam R)', t: 'R = kelipatan risiko awal', c: W.green, at: b(9)},
		{h: '5. EMOSI + BUKTI', t: 'perasaan masuk/keluar · screenshot', c: W.ink, at: b(15)},
	];
	const f = useCurrentFrame();
	return (
		<Board dur={dur}>
			<Title>5 KELOMPOK KOLOM WAJIB</Title>
			{groups.map((g, i) => (
				<div key={g.h} style={{position: 'absolute', left: 110, top: 240 + i * 128, width: 1280, opacity: prog(f, g.at - 4, 8)}}>
					<Write at={g.at} dur={18}>
						<div style={{display: 'flex', alignItems: 'baseline', gap: 26}}>
							<M s={44} c={g.c} style={{width: 470}}>{g.h}</M>
							<T s={46}>{g.t}</T>
						</div>
					</Write>
					{g.note && (
						<Write at={g.at + (i === 1 ? b(4) - b(3) : b(8) - b(5))} dur={14}>
							<T s={38} c={W.red} style={{marginLeft: 496, marginTop: -4}}>→ {g.note}</T>
						</Write>
					)}
				</div>
			))}
			{/* R explainer */}
			<Note at={b(12)} x={1430} y={540} w={420} color="#E3F6EA" rot={2}>
				SL kena = <b style={{color: W.red}}>−1R</b>
				<br />
				<span style={{opacity: prog(f, b(13), 8)}}>
					2× jarak SL = <b style={{color: W.green}}>+2R</b>
				</span>
			</Note>
			<Stroke d={circleD(602, 236 + 2 * 128, 340, 40)} at={b(7)} color={W.red} width={4} />
		</Board>
	);
};

// ---------- TEMPLATE (spreadsheet) ----------
const Template: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const cols = ['Tgl', 'Jam', 'Pair', 'B/S', 'Lot', 'Entry', 'SL', 'TP', 'Alasan', 'Risiko $', 'Hasil R', 'Tag'];
	const wds = [80, 80, 100, 70, 70, 100, 100, 100, 170, 120, 110, 120];
	const xs = wds.reduce<number[]>((a, w, i) => [...a, (a[i] ?? 0) + w], [0]);
	const X0 = 110, Y0 = 230;
	return (
		<Board dur={dur}>
			<Title>TEMPLATE SPREADSHEET</Title>
			<div style={{position: 'absolute', left: X0, top: Y0, opacity: prog(f, b(1), 12)}}>
				{cols.map((c, i) => {
					const isHelper = i === 9 || i === 10;
					const isTag = i === 11;
					const at = isHelper ? (i === 9 ? b(3) : b(4)) : isTag ? b(6) : b(1) + i * 4;
					return (
						<div key={c} style={{position: 'absolute', left: xs[i], top: 0, width: wds[i], height: 64, border: `3px solid ${W.ink}`, marginLeft: -3, background: isHelper ? '#E3F6EA' : isTag ? '#FFF3A8' : '#fff', opacity: prog(f, at, 8), display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HAND, fontWeight: 700, fontSize: 32}}>
							{c}
						</div>
					);
				})}
				{[0, 1, 2].map((r) => (
					<div key={r} style={{position: 'absolute', left: -3, top: 64 + r * 54, width: xs[12] + 3, height: 54, borderBottom: '2px dashed #aaa', opacity: prog(f, b(1) + 30 + r * 6, 8)}} />
				))}
			</div>
			<Note at={b(4) + 10} x={130} y={500} w={620} color="#E3F6EA" rot={-1.5}>
				Hasil R = hasil $ ÷ risiko $
				<div style={{opacity: prog(f, b(5), 10), marginTop: 8}}>
					contoh: $100 ÷ $50 = <b style={{color: W.green}}>+2R</b>
				</div>
			</Note>
			<Abs x={840} y={490} w={560}>
				<Write at={b(6)}>
					<M s={40} c={W.ink}>TAG (pilihan tetap):</M>
				</Write>
				<div style={{display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 14}}>
					{['sesuai rencana', 'FOMO', 'geser stop loss', 'revenge', 'entry pas berita'].map((t, i) => (
						<Pop key={t} at={b(6) + 30 + i * 22}>
							<Tag color={i === 0 ? W.green : W.red} style={{fontSize: 30}}>
								{t}
							</Tag>
						</Pop>
					))}
				</div>
			</Abs>
			<Abs x={130} y={790} w={700}>
				<Write at={b(8)}>
					<T s={44} c={W.grey}>buku tulis juga boleh: yang penting format sama tiap hari</T>
				</Write>
			</Abs>
		</Board>
	);
};

// ---------- CHART (real XAUUSD H1 data, whiteboard style) ----------
const I0 = 14, I1 = 39;
const CX = 130, CY = 250, CW = 1150, CH = 560, PMIN = 3405, PMAX = 3615;
const px = (i: number) => CX + ((i - I0 + 0.5) / (I1 - I0 + 1)) * CW;
const py = (p: number) => CY + ((PMAX - p) / (PMAX - PMIN)) * CH;
const ENTRY = 3468, SL = 3492, TP = 3420;
const Chart: React.FC<SP & {annot?: boolean}> = ({b, dur}) => {
	const f = useCurrentFrame();
	const n = I1 - I0 + 1;
	const bw = (CW / n) * 0.55;
	const lvl = (p: number, c: string, lab: string, at: number, from = 29) => {
		const x1 = px(from) - 10, x2 = CX + CW + 10;
		const pp = prog(f, at, 16);
		return (
			<g key={lab} opacity={pp > 0 ? 1 : 0}>
				<line x1={x1} y1={py(p)} x2={x1 + (x2 - x1) * pp} y2={py(p)} stroke={c} strokeWidth={4} strokeDasharray="16 12" strokeLinecap="round" />
				<text x={x2 + 14} y={py(p) + 12} fontFamily={HAND} fontWeight={700} fontSize={38} fill={c} opacity={pp}>
					{lab}
				</text>
			</g>
		);
	};
	return (
		<Board dur={dur}>
			<Title sub="XAUUSD · H1 · OANDA">CHART EMAS ASLI</Title>
			<Abs x={1360} y={130}>
				<Tag color={W.red} style={{fontSize: 28}}>SIMULASI · BUKAN SINYAL</Tag>
			</Abs>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<defs>
					<filter id="rough">
						<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={3} />
						<feDisplacementMap in="SourceGraphic" scale={2.2} />
					</filter>
				</defs>
				{/* axes */}
				<path d={`M ${CX} ${CY - 10} L ${CX} ${CY + CH} L ${CX + CW} ${CY + CH}`} stroke={W.ink} strokeWidth={4} fill="none" filter="url(#rough)" opacity={prog(f, 0, 10)} />
				{[3450, 3500, 3550, 3600].map((p) => (
					<g key={p} opacity={prog(f, 6, 10)}>
						<line x1={CX - 10} x2={CX} y1={py(p)} y2={py(p)} stroke={W.ink} strokeWidth={3} />
						<text x={CX - 18} y={py(p) + 11} textAnchor="end" fontFamily={HAND} fontWeight={700} fontSize={32} fill={W.grey}>
							{p.toLocaleString('de-DE')}
						</text>
					</g>
				))}
				{[
					[14, '25/11 08:00'],
					[24, '25/11 18:00'],
					[34, '26/11 04:00'],
				].map(([i, t]) => (
					<text key={t as string} x={px(i as number)} y={CY + CH + 44} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={32} fill={W.grey} opacity={prog(f, 6, 10)}>
						{t} WIB
					</text>
				))}
				{/* candles appear sequentially */}
				<g filter="url(#rough)">
					{Array.from({length: n}).map((_, k) => {
						const i = I0 + k;
						const o = D.o[i], h = D.h[i], l = D.l[i], c = D.c[i];
						const up = c >= o;
						const col = up ? W.green : W.red;
						const at = b(1) + k * 3;
						const pp = prog(f, at, 6);
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
				{/* drop arrow + low label */}
				<g opacity={prog(f, b(2) + 20, 10)}>
					<text x={px(28) + 18} y={py(3426.805) + 52} textAnchor="end" fontFamily={HAND} fontWeight={700} fontSize={36} fill={W.ink}>
						low 3.427
					</text>
				</g>
				{lvl(ENTRY, W.orange, 'SELL 3.468', b(4) + 50)}
				{lvl(SL, W.red, 'SL 3.492', b(5) + 20)}
				{lvl(TP, W.green, 'TP 2R 3.420', b(6) + 30)}
			</svg>
			<Stroke d={arrowD(px(21), py(3478), px(27) - 22, py(3436))} at={b(2)} color={W.red} width={6} />
			{/* entry marker on bar 29 */}
			<Stroke d={circleD(px(29) - 22, py(3469) - 22, 44, 44)} at={b(4) + 40} color={W.orange} width={5} />
			{/* SL hit on bar 30 */}
			<Stroke d={circleD(px(30) - 24, py(3527.7) - 10, 48, 60)} at={b(7)} color={W.red} width={6} />
			<Abs x={px(30) - 70} y={py(3527.7) - 110}>
				<Pop at={b(7) + 14}>
					<M s={40} c={W.red}>SL KENA!</M>
				</Pop>
			</Abs>
			<Abs x={130} y={128 + 120}>
				<div />
			</Abs>
			<Note at={b(8)} x={1340} y={560} w={500} color="#FFD6D6" rot={2}>
				Pasar cepat = bisa <b>slippage</b>: rugi riil bisa sedikit lebih besar dari rencana
			</Note>
			<Abs x={CX} y={CY + CH + 70}>
				<T s={28} c={W.grey}>Data asli XAUUSD · H1 · 25–26 Nov 2026 WIB · TradingView (OANDA)</T>
			</Abs>
		</Board>
	);
};

// ---------- LOT + journal row ----------
const Lot: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const row = b(7);
	const rows: [string, string, number][] = [
		['Saldo (simulasi)', '$5.000', b(1)],
		['Risiko 1%', '$50', b(1) + 50],
		['Jarak SL', '3.492 − 3.468 = $24', b(2) + 20],
		['Lot', '50 ÷ (24 × 100) = 0,0208 → 0,02', b(3)],
		['Rugi kalau SL kena', '0,02 × 24 × 100 = $48 = −1R', b(4)],
		['TP 2R', '3.468 − 48 = 3.420', b(6)],
	];
	const fade = interpolate(f, [row - 10, row], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const cells: [string, string, number, string?][] = [
		['Tanggal', '25/11 23:00', row + 4],
		['Pair', 'XAUUSD', row + 8],
		['B/S', 'SELL', row + 12],
		['Lot', '0,02', row + 16],
		['Entry', '3.468', row + 20],
		['SL', '3.492', row + 24],
		['TP', '3.420', row + 28],
		['Alasan', 'ikut candle merah, takut ketinggalan', b(8), W.red],
		['Emosi', 'panik', b(9), W.red],
		['Hasil', '−1R (−$48)', b(10), W.red],
	];
	return (
		<Board dur={dur}>
			<Title>ITUNG LOT DARI RISIKO</Title>
			<Ilus />
			<div style={{opacity: fade}}>
				{rows.map(([k, v, at], i) => (
					<Abs key={k} x={130} y={250 + i * 96} w={1250}>
						<Write at={at} dur={18}>
							<div style={{display: 'flex', gap: 30, alignItems: 'baseline'}}>
								<T s={46} c={W.grey} style={{width: 400}}>{k}</T>
								<M s={50} c={i === 3 ? W.blue : i === 4 ? W.red : i === 5 ? W.green : W.ink}>{v}</M>
							</div>
						</Write>
					</Abs>
				))}
				<Stroke d={circleD(560, 250 + 3 * 96, 760, 56)} at={b(3) + 30} color={W.blue} width={5} />
			</div>
			{f >= row - 10 && (
				<div style={{position: 'absolute', left: 110, top: 240, opacity: prog(f, row - 6, 10)}}>
					<M s={46} c={W.ink}>BARIS JURNAL #1</M>
					<div style={{marginTop: 20, display: 'grid', gridTemplateColumns: '260px 900px', rowGap: 6}}>
						{cells.map(([k, v, at, c]) => (
							<React.Fragment key={k}>
								<T s={42} c={W.grey} style={{opacity: prog(f, at, 8)}}>{k}</T>
								<Write at={at} dur={14}>
									<T s={44} c={c ?? W.ink}>{v}</T>
								</Write>
							</React.Fragment>
						))}
					</div>
					<Abs x={980} y={420}>
						<Pop at={b(12) + 10}>
							<div style={{transform: 'rotate(-8deg)', border: `6px solid ${W.red}`, color: W.red, fontFamily: MARK, fontSize: 72, padding: '4px 26px', borderRadius: 14}}>FOMO</div>
						</Pop>
					</Abs>
				</div>
			)}
			{f >= row && <Stroke d={circleD(370, 702, 560, 50)} at={b(11)} color={W.red} width={5} />}
		</Board>
	);
};

// ---------- REVIEW table ----------
export const TRADES: [string, string, string, number][] = [
	['1', 'Sen 15:10', 'sesuai rencana', 2],
	['2', 'Sen 21:40', 'FOMO', -1],
	['3', 'Sel 14:30', 'sesuai rencana', -1],
	['4', 'Sel 22:15', 'geser SL', -1.6],
	['5', 'Rab 15:05', 'sesuai rencana', 2],
	['6', 'Rab 16:20', 'revenge', 0.5],
	['7', 'Kam 14:45', 'sesuai rencana', -1],
	['8', 'Kam 23:00', 'FOMO', -1],
	['9', 'Jum 15:30', 'sesuai rencana', -1],
	['10', 'Jum 16:10', 'sesuai rencana', 2],
];
const fmtR = (r: number) => (r > 0 ? '+' : '−') + Math.abs(r).toString().replace('.', ',') + 'R';
const Review: React.FC<SP & {mode?: 'review' | 'pattern'}> = ({b, dur, mode = 'review'}) => {
	const f = useCurrentFrame();
	const plan = TRADES.filter((t) => t[2] === 'sesuai rencana');
	const off = TRADES.filter((t) => t[2] !== 'sesuai rencana');
	const sum = (a: typeof TRADES) => Math.round(a.reduce((s, t) => s + t[3], 0) * 10) / 10;
	const tableAt = mode === 'review' ? b(3) : 0;
	const colorAt = mode === 'review' ? b(4) : 0;
	const offAt = mode === 'review' ? b(6) : 0;
	return (
		<Board dur={dur}>
			<Title>{mode === 'review' ? 'REVIEW MINGGUAN' : '3 PERTANYAAN REVIEW'}</Title>
			<Ilus label="JURNAL ILUSTRASI" />
			{mode === 'review' && (
				<Abs x={110} y={215} w={1250}>
					<Write at={b(2)}>
						<T s={42} c={W.grey}>buka 10–20 trade terakhir → pisahin: sesuai rencana vs di luar rencana</T>
					</Write>
				</Abs>
			)}
			<div style={{position: 'absolute', left: 110, top: 290}}>
				{TRADES.map((t, i) => {
					const isPlan = t[2] === 'sesuai rencana';
					const hl = isPlan ? prog(f, colorAt + plan.indexOf(t) * 12, 8) : prog(f, offAt + off.indexOf(t) * 20, 8);
					const late = parseInt(t[1].slice(4, 6), 10) >= 21;
					const lateHl = mode === 'pattern' ? prog(f, b(4) + 20, 10) : 0;
					return (
						<div key={t[0]} style={{display: 'flex', alignItems: 'center', height: 54, opacity: prog(f, tableAt + i * 4, 8), background: hl > 0 ? (isPlan ? `rgba(24,147,90,${0.14 * hl})` : `rgba(214,40,57,${0.14 * hl})`) : 'transparent', borderBottom: '2px dashed #bbb'}}>
							<T s={38} c={W.grey} style={{width: 60}}>#{t[0]}</T>
							<T s={40} style={{width: 210, color: late && lateHl > 0 ? W.red : W.ink, fontWeight: 700}}>{t[1]}</T>
							<T s={40} style={{width: 280}}>{t[2]}</T>
							<M s={38} c={t[3] > 0 ? W.green : W.red} style={{width: 120, textAlign: 'right'}}>{fmtR(t[3])}</M>
						</div>
					);
				})}
			</div>
			{mode === 'review' && (
				<>
					<Note at={b(5)} x={880} y={300} w={460} color="#E3F6EA" rot={-1.5}>
						6 sesuai rencana
						<div style={{fontFamily: MARK, fontSize: 56, color: W.green}}>{fmtR(sum(plan))}</div>
					</Note>
					<Note at={b(7)} x={880} y={510} w={460} color="#FFD6D6" rot={1.5}>
						4 di luar rencana
						<div style={{fontFamily: MARK, fontSize: 56, color: W.red}}>{fmtR(sum(off))}</div>
					</Note>
					<Abs x={1400} y={420} w={460}>
						<Pop at={b(8)}>
							<M s={44}>TOTAL MINGGU</M>
							<M s={86} c={W.red}>−0,1R</M>
						</Pop>
					</Abs>
					<Abs x={880} y={760} w={900}>
						<Write at={b(11)}>
							<T s={40} c={W.grey}>kenapa min. 10 trade? 2–3 trade masih bisa kebetulan. Sampel tetap kecil.</T>
						</Write>
					</Abs>
				</>
			)}
			{mode === 'pattern' && (
				<>
					<Abs x={880} y={290} w={1000}>
						<Write at={b(1)}>
							<T s={44}>
								<b style={{color: W.blue}}>1.</b> Setup mana paling sering sesuai rencana? → <Hi at={b(2)}>pertahankan</Hi>
							</T>
						</Write>
						<Write at={b(3)}>
							<T s={44} style={{marginTop: 22}}>
								<b style={{color: W.blue}}>2.</b> Jam berapa paling sering salah?
							</T>
						</Write>
						<Write at={b(4) + 20}>
							<T s={44} c={W.red} style={{marginLeft: 40}}>3 dari 4 di luar rencana: setelah 21:00</T>
						</Write>
						<Write at={b(5)}>
							<T s={44} style={{marginTop: 22}}>
								<b style={{color: W.blue}}>3.</b> Kesalahan apa yang berulang?
							</T>
						</Write>
						<div style={{marginLeft: 40, marginTop: 10}}>
							{[
								['FOMO', 2],
								['geser SL', 1],
								['revenge', 1],
							].map(([t, v], i) => (
								<div key={t as string} style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 6, opacity: prog(f, b(6) + i * 20, 8)}}>
									<T s={38} style={{width: 150}}>{t}</T>
									<div style={{height: 34, width: 110 * (v as number) * prog(f, b(6) + i * 20, 16), background: W.red, opacity: 0.8, border: `3px solid ${W.ink}`, borderRadius: 6}} />
									<M s={34}>{v}×</M>
								</div>
							))}
						</div>
					</Abs>
					<Note at={b(8)} x={880} y={700} w={600} color="#FFF3A8" rot={-1}>
						Aturan baru: no entry setelah 21:00 · SL nggak digeser menjauh
						<div style={{color: W.green, opacity: prog(f, b(9), 8)}}>1 aturan / minggu cukup ✔</div>
					</Note>
				</>
			)}
		</Board>
	);
};
const Pattern: React.FC<SP> = (p) => <Review {...p} mode="pattern" />;

// ---------- MISTAKES ----------
const Mistakes: React.FC<SP> = ({b, dur}) => {
	const items: [string, string, number, number][] = [
		['Cuma nyatet trade profit', 'pelajarannya justru di trade rugi', b(1), b(2)],
		['Isi alasan SETELAH close', 'isi alasan sebelum klik buy/sell', b(3), b(5)],
		['Nyatet, tapi nggak pernah review', 'jadwal tetap: Sabtu pagi 30 menit', b(6), b(8)],
	];
	return (
		<Board dur={dur}>
			<Title>3 KESALAHAN UMUM</Title>
			{items.map(([h, fix, at, at2], i) => (
				<Abs key={h} x={130} y={250 + i * 170} w={1300}>
					<div style={{display: 'flex', alignItems: 'center', gap: 28}}>
						<Pop at={at}>
							<M s={80} c={W.red}>✗</M>
						</Pop>
						<div>
							<Write at={at}>
								<M s={50}>{h}</M>
							</Write>
							<Write at={at2}>
								<T s={44} c={W.green}>→ {fix}</T>
							</Write>
						</div>
					</div>
				</Abs>
			))}
			<Note at={b(9)} x={130} y={735} w={760} color="#E8EEFF" rot={1.5}>
				Baca juga kolom emosi: kesel, capek, abis rugi = <b>data, bukan aib</b>
			</Note>
		</Board>
	);
};

// ---------- SUMMARY ----------
const Summary: React.FC<SP> = ({b, dur}) => {
	const f = useCurrentFrame();
	const steps: [string, number][] = [
		['Sebelum klik: entry, SL, TP + alasan 1 kalimat', b(4)],
		['Setelah close: hasil dalam R + emosi', b(5)],
		['Akhir pekan: review 10–20 trade → 1 aturan baru', b(6)],
	];
	return (
		<Board dur={dur}>
			<Title>RANGKUMAN</Title>
			<Abs x={110} y={235} w={1300}>
				<Write at={b(2)} dur={24}>
					<T s={42} c={W.grey}>5 kolom: posisi · rencana harga · alasan · hasil (R) · emosi + screenshot</T>
				</Write>
			</Abs>
			<Abs x={110} y={330}>
				<Write at={b(3)}>
					<M s={52}>MULAI BESOK:</M>
				</Write>
			</Abs>
			{steps.map(([t, at], i) => (
				<Abs key={t} x={140} y={430 + i * 120} w={1300}>
					<div style={{display: 'flex', alignItems: 'center', gap: 26}}>
						<div style={{width: 64, height: 64, border: `5px solid ${W.ink}`, borderRadius: 10, position: 'relative', opacity: prog(f, at - 6, 6)}}>
							<div style={{position: 'absolute', left: 4, top: -18, fontFamily: MARK, fontSize: 70, color: W.green, opacity: prog(f, at + 24, 6)}}>✓</div>
						</div>
						<Write at={at}>
							<T s={52}>{t}</T>
						</Write>
					</div>
				</Abs>
			))}
			<Abs x={140} y={800} w={1200}>
				<Write at={b(7)}>
					<T s={42} c={W.blue}>latihan itung lot di akun demo sampai jadi refleks</T>
				</Write>
			</Abs>
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
					<T s={50} style={{marginTop: 18, opacity: 1}}>Edukasi umum, bukan ajakan transaksi atau sinyal.</T>
					<Write at={b(2)}>
						<T s={50} style={{marginTop: 8}}>Chart & angka di video ini contoh simulasi.</T>
					</Write>
					<Write at={b(3)}>
						<T s={50} c={W.red} style={{marginTop: 8}}>Trading berleverage bisa menyebabkan rugi & kehilangan modal.</T>
					</Write>
				</div>
			</Pop>
		</Abs>
	</Board>
);

// ---------- CTA (dark spotlight end card) ----------
const Cta: React.FC<SP> = ({b}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 75% 70%, #2a3140 0%, #0b0d12 60%)'}}>
			<div style={{position: 'absolute', right: 120, bottom: 0, width: 700, height: 900, background: 'radial-gradient(ellipse at 50% 100%, rgba(255,230,160,0.22), transparent 65%)'}} />
			<div style={{position: 'absolute', left: 120, top: 190}}>
				<div style={{opacity: prog(f, 4, 10), fontFamily: SANSB, fontWeight: 900, fontSize: 92, color: '#fff', letterSpacing: -1}}>JOIN KOMUNITAS TRADING</div>
				<div style={{opacity: prog(f, 14, 10), fontFamily: SANSB, fontWeight: 900, fontSize: 120, color: W.gold, letterSpacing: -2}}>dhirajkelly.id</div>
				<div style={{opacity: prog(f, b(1), 10), marginTop: 50, fontFamily: SANSB, fontWeight: 700, fontSize: 46, color: '#fff'}}>
					Komen: <span style={{color: W.gold}}>tim punya jurnal</span> atau <span style={{color: W.gold}}>tim ngandelin ingetan?</span>
				</div>
				<div style={{opacity: prog(f, b(2), 10), marginTop: 30, display: 'inline-block', background: '#E62117', color: '#fff', fontFamily: SANSB, fontWeight: 800, fontSize: 42, padding: '10px 28px', borderRadius: 10}}>SUBSCRIBE · Doktor Trader</div>
			</div>
		</AbsoluteFill>
	);
};

export const SCENES: Record<string, React.FC<SP>> = {
	hook: Hook,
	map: MapS,
	why: Why,
	cols: Cols,
	template: Template,
	chart: Chart,
	lot: Lot,
	review: Review,
	pattern: Pattern,
	mistakes: Mistakes,
	summary: Summary,
	disclaimer: Disclaimer,
	cta: Cta,
};
