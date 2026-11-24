import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Appear, Badge, C, Card, Hl, MONO, SANS, SERIF, useIn, useSpring} from './ui';

type P = {b: (k: number) => number; dur: number};
const RED = '#FF5A5F';
const TEAL = '#2EB5C4';

const fmt = (v: number, dec = 0) => {
	const s = v.toFixed(dec);
	const [i, d] = s.split('.');
	const ii = i.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	return d ? `${ii},${d}` : ii;
};

// Beats: show one visual at a time, switching at sentence starts
const Beats: React.FC<{b: P['b']; dur: number; items: [number, React.ReactNode][]}> = ({b, dur, items}) => {
	const f = useCurrentFrame();
	const starts = items.map(([k], i) => (i === 0 ? 0 : b(k)));
	let idx = 0;
	starts.forEach((s, i) => {
		if (f >= s) idx = i;
	});
	const s0 = starts[idx];
	const s1 = idx + 1 < starts.length ? starts[idx + 1] : dur;
	const a = interpolate(f, [s0, s0 + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const o = interpolate(f, [s1 - 8, s1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const z = interpolate(f, [s0, s1], [1, 1.035], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{opacity: a * (idx + 1 < starts.length ? o : 1), transform: `scale(${z}) translateY(${(1 - a) * 30}px)`}}>
			<Shift at={s0}>{items[idx][1]}</Shift>
		</AbsoluteFill>
	);
};
// re-base child animations at beat start
const Shift: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => <Rebase at={at}>{children}</Rebase>;
const Ctx = React.createContext(0);
const Rebase: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => <Ctx.Provider value={at}>{children}</Ctx.Provider>;
const useT0 = () => React.useContext(Ctx);

const Src: React.FC<{t: string}> = ({t}) => (
	<div style={{position: 'absolute', left: 110, bottom: 232, fontFamily: MONO, fontSize: 20, color: C.muted, letterSpacing: 1}}>Sumber: {t}</div>
);
const Contoh: React.FC = () => (
	<div style={{position: 'absolute', right: 110, top: 120}}>
		<Badge color={RED}>CONTOH HITUNGAN</Badge>
	</div>
);
const Pill: React.FC<{t: string; color?: string}> = ({t, color = TEAL}) => (
	<div style={{display: 'inline-block', background: color, color: '#071226', fontFamily: SANS, fontWeight: 800, fontSize: 26, letterSpacing: 2, padding: '10px 22px', borderRadius: 999}}>{t}</div>
);

const Title: React.FC<{k?: string; t: string; size?: number; sub?: string; color?: string}> = ({k, t, size = 96, sub, color}) => {
	const t0 = useT0();
	return (
		<AbsoluteFill style={{justifyContent: 'center', padding: '0 140px'}}>
			{k && (
				<Appear at={t0}>
					<Pill t={k} color={color} />
				</Appear>
			)}
			<Appear at={t0 + 4} pop>
				<Hl text={t} size={size} style={{marginTop: 26, maxWidth: 1600}} />
			</Appear>
			{sub && (
				<Appear at={t0 + 14}>
					<div style={{fontFamily: SANS, fontSize: 40, color: C.body, marginTop: 26, maxWidth: 1500, lineHeight: 1.3}}>{sub}</div>
				</Appear>
			)}
		</AbsoluteFill>
	);
};

const Big: React.FC<{label: string; to: number; from?: number; prefix?: string; suffix?: string; dec?: number; color?: string; note?: string; src?: string; contoh?: boolean}> = ({label, to, from = 0, prefix = '', suffix = '', dec = 0, color = C.gold, note, src, contoh}) => {
	const t0 = useT0();
	const f = useCurrentFrame();
	const p = interpolate(f, [t0 + 4, t0 + 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (x) => 1 - Math.pow(1 - x, 3)});
	const s = useSpring(t0 + 2);
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
			{contoh && <Contoh />}
			<div style={{fontFamily: MONO, fontSize: 32, letterSpacing: 4, color: C.muted, marginBottom: 18}}>{label.toUpperCase()}</div>
			<div style={{fontFamily: SANS, fontWeight: 800, fontSize: 190, color, letterSpacing: -4, transform: `scale(${0.8 + 0.2 * s})`}}>
				{prefix}
				{fmt(from + (to - from) * p, dec)}
				{suffix}
			</div>
			{note && (
				<Appear at={t0 + 24}>
					<div style={{fontFamily: SANS, fontSize: 44, color: C.text, marginTop: 10, textAlign: 'center', maxWidth: 1400}}>{note}</div>
				</Appear>
			)}
			{src && <Src t={src} />}
		</AbsoluteFill>
	);
};

type Bar = {name: string; v: number; txt: string; color?: string};
const Bars: React.FC<{title: string; items: Bar[]; foot?: string; src?: string; max?: number; contoh?: boolean; line?: {v: number; txt: string}}> = ({title, items, foot, src, max, contoh, line}) => {
	const t0 = useT0();
	const f = useCurrentFrame();
	const mx = max ?? Math.max(...items.map((i) => i.v), line?.v ?? 0);
	const H = 470;
	return (
		<AbsoluteFill style={{padding: '120px 140px 0'}}>
			{contoh && <Contoh />}
			<Appear at={t0}>
				<Hl text={title} size={60} />
				{src && <div style={{fontFamily: MONO, fontSize: 20, color: C.muted, letterSpacing: 1, marginTop: 10}}>Sumber: {src}</div>}
			</Appear>
			<div style={{position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 90, height: H + 120, marginTop: 30}}>
				{line && (
					<div style={{position: 'absolute', left: 0, right: 0, bottom: 60 + (H * line.v) / mx, borderTop: `3px dashed ${RED}`, opacity: useIn(t0 + 30)}}>
						<div style={{position: 'absolute', right: 0, top: -44, fontFamily: MONO, fontSize: 24, color: RED}}>{line.txt}</div>
					</div>
				)}
				{items.map((it, i) => {
					const p = interpolate(f, [t0 + 8 + i * 12, t0 + 34 + i * 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (x) => 1 - Math.pow(1 - x, 3)});
					const h = (H * it.v * p) / mx;
					return (
						<div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 300}}>
							<div style={{fontFamily: SANS, fontWeight: 800, fontSize: 46, color: C.text, opacity: p, marginBottom: 12}}>{it.txt}</div>
							<div style={{width: 230, height: h, background: it.color ?? C.gold, borderRadius: '16px 16px 0 0', boxShadow: '0 0 40px rgba(201,162,74,0.25)'}} />
							<div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, color: C.body, marginTop: 16, textAlign: 'center', height: 44}}>{it.name}</div>
						</div>
					);
				})}
			</div>
			{foot && (
				<Appear at={t0 + 40}>
					<div style={{fontFamily: SANS, fontSize: 36, color: C.gold, textAlign: 'center', marginTop: 8}}>{foot}</div>
				</Appear>
			)}
		</AbsoluteFill>
	);
};

const Quote: React.FC<{text: string; hl: string; src: string}> = ({text, hl, src}) => {
	const t0 = useT0();
	const f = useCurrentFrame();
	const w = interpolate(f, [t0 + 18, t0 + 40], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const [a, c] = text.split(hl);
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
			<Appear at={t0} pop>
				<div style={{background: '#ECEAE4', width: 1380, padding: '56px 70px', borderRadius: 10, transform: 'rotate(-1.2deg)', boxShadow: '0 30px 80px rgba(0,0,0,0.45)'}}>
					<div style={{fontFamily: MONO, fontSize: 22, color: '#666', letterSpacing: 2, marginBottom: 20}}>KUTIPAN · {src}</div>
					<div style={{fontFamily: SERIF, fontSize: 54, lineHeight: 1.3, color: '#151515'}}>
						“{a}
						<span style={{position: 'relative', display: 'inline'}}>
							<span style={{background: `linear-gradient(90deg, rgba(255,90,95,0.45) ${w}%, transparent ${w}%)`}}>{hl}</span>
						</span>
						{c}”
					</div>
				</div>
			</Appear>
		</AbsoluteFill>
	);
};

const Chips: React.FC<{title: string; items: string[]; color?: string; src?: string}> = ({title, items, color = RED, src}) => {
	const t0 = useT0();
	return (
		<AbsoluteFill style={{padding: '150px 140px 0'}}>
			<Appear at={t0}>
				<Hl text={title} size={64} />
			</Appear>
			<div style={{display: 'flex', flexWrap: 'wrap', gap: 22, marginTop: 50, maxWidth: 1640}}>
				{items.map((it, i) => (
					<Appear key={i} at={t0 + 8 + i * 4} pop>
						<div style={{border: `2px solid ${color}`, color: C.text, background: 'rgba(255,90,95,0.10)', fontFamily: SANS, fontWeight: 700, fontSize: 38, padding: '14px 28px', borderRadius: 14}}>{it}</div>
					</Appear>
				))}
			</div>
			{src && <Src t={src} />}
		</AbsoluteFill>
	);
};

const Chain: React.FC<{title: string; items: string[]; contoh?: boolean}> = ({title, items, contoh}) => {
	const t0 = useT0();
	return (
		<AbsoluteFill style={{padding: '170px 120px 0'}}>
			{contoh && <Contoh />}
			<Appear at={t0}>
				<Hl text={title} size={64} />
			</Appear>
			<div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 110, flexWrap: 'nowrap'}}>
				{items.map((it, i) => (
					<React.Fragment key={i}>
						<Appear at={t0 + 10 + i * 14} pop>
							<Card style={{width: 300, minHeight: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 36, fontWeight: 700, padding: '20px 22px'}}>{it}</Card>
						</Appear>
						{i < items.length - 1 && (
							<Appear at={t0 + 16 + i * 14}>
								<div style={{fontFamily: SANS, fontSize: 64, color: C.gold}}>→</div>
							</Appear>
						)}
					</React.Fragment>
				))}
			</div>
		</AbsoluteFill>
	);
};

const Steps: React.FC<{b: P['b']; at: number[]; items: [string, string][]}> = ({b, at, items}) => (
	<AbsoluteFill style={{padding: '140px 140px 0'}}>
		<Appear at={0}>
			<Hl text="3 hal yang *bisa lo kontrol*" size={72} />
		</Appear>
		<div style={{display: 'flex', flexDirection: 'column', gap: 26, marginTop: 50}}>
			{items.map(([h, s], i) => (
				<Appear key={i} at={b(at[i])} dx={-80} dy={0}>
					<Card style={{display: 'flex', alignItems: 'center', gap: 34, padding: '24px 36px'}}>
						<div style={{width: 84, height: 84, borderRadius: 42, background: TEAL, color: '#071226', fontWeight: 800, fontSize: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{i + 1}</div>
						<div>
							<div style={{fontSize: 44, fontWeight: 800}}>{h}</div>
							<div style={{fontSize: 30, color: C.body, marginTop: 6}}>{s}</div>
						</div>
					</Card>
				</Appear>
			))}
		</div>
	</AbsoluteFill>
);

const Stamp: React.FC<{t: string}> = ({t}) => {
	const t0 = useT0();
	const s = useSpring(t0 + 16, 9);
	return (
		<div style={{position: 'absolute', right: 160, top: 210, transform: `rotate(-10deg) scale(${2 - s})`, opacity: Math.min(1, s * 1.4), border: `6px solid ${RED}`, color: RED, fontFamily: SANS, fontWeight: 900, fontSize: 56, padding: '10px 28px', borderRadius: 12, letterSpacing: 3}}>{t}</div>
	);
};

const S_KEPGUB = 'Kepgub Jabar 561/Kep.728-Kesra/2026; Antara, Kompas (21/11/2026)';
const S_DEPE = 'Media Indonesia, Tribun Jabar (21/11/2026)';
const S_BKS = 'Antara (23/11/2026), iNews Bekasi (22/11/2026). Rekomendasi, belum SK Gubernur';

export const SCENES: Record<string, React.FC<P>> = {
	hook: ({b, dur}) => (
		<Beats b={b} dur={dur} items={[
			[0, <Big label="UMP Jawa Barat 2027" to={29.44} dec={2} prefix="+" suffix="%" note="Rp2.317.601 → Rp3.000.000" src={S_KEPGUB} />],
			[2, <><Title k="BURUH BEKASI" t="Dapet dari angka ini: *Rp0*" /><Stamp t="NGGAK KEBAGIAN" /></>],
			[3, <Title k="YANG TERIAK" color={RED} t="Pabrik garmen di *Garut* & *Majalengka*" />],
			[5, <Chips title="Gue bedah *3 hal*" color={TEAL} items={['1. Dari mana angka Rp3 juta', '2. Siapa yang beneran kena', '3. ???  (paling jarang dibahas)']} />],
			[8, <Title k="HAL KETIGA" color={RED} t="Rp3 juta itu baru *setengah jalan*" sub="Jawabannya di akhir. Ini yang nentuin dompet lo 2 tahun ke depan." />],
		]} />
	),
	context: ({b, dur}) => (
		<Beats b={b} dur={dur} items={[
			[0, <Title k="FAKTA" t="Keputusan Gubernur Jabar, *20 November 2026*" sub="Kepgub 561/Kep.728-Kesra/2026" />],
			[2, <Bars title="UMP Jawa Barat" items={[{name: 'UMP 2026', v: 2317601, txt: 'Rp2,32 jt', color: '#5A6B85'}, {name: 'UMP 2027', v: 3000000, txt: 'Rp3,00 jt', color: C.gold}]} foot="+Rp682.399 sebulan" src={S_KEPGUB} />],
			[4, <Bars title="Usulan vs keputusan (persen dari KHL)" items={[{name: 'Buruh minta', v: 80, txt: '80%', color: TEAL}, {name: 'Diputuskan', v: 70, txt: '70%', color: C.gold}]} max={100} src="Kompas (20/11/2026), CNBC Indonesia (20/11/2026)" />],
			[7, <Bars title="Kenaikan UMP 2027" items={[{name: 'DKI Jakarta', v: 7.1, txt: '+7,1%', color: '#5A6B85'}, {name: 'Jawa Barat', v: 29.44, txt: '+29,44%', color: RED}]} foot="Lebih dari 4x lipat" src="Pemprov DKI via iNews (22/11/2026); Kepgub Jabar" />],
			[10, <Title k="PERTANYAANNYA" t="Rumus apa yang dipakai, dan kenapa beda *jauh banget*?" size={84} />],
		]} />
	),
	formula: ({b, dur}) => (
		<Beats b={b} dur={dur} items={[
			[0, <Title k="DEWAN PENGUPAHAN" t="Ada *3 angka* di meja" />],
			[2, <Bars title="3 angka UMP Jabar 2027" items={[{name: 'Usulan Apindo', v: 2485256, txt: 'Rp2,49 jt', color: '#5A6B85'}, {name: 'Rumus lama (alfa 1)', v: 2525722, txt: 'Rp2,53 jt', color: '#7B8BA5'}, {name: 'KHL × 70%', v: 3000000, txt: 'Rp3,00 jt', color: C.gold}]} line={{v: 4248132, txt: 'KHL Jabar Rp4.248.132'}} src={S_DEPE} />],
			[5, <Big label="Rumus lama = persen dari KHL" to={59.45} dec={2} suffix="%" color={C.red} note="Bahkan dengan alfa paling tinggi" src={S_DEPE} />],
			[6, <Card style={{position: 'absolute', left: 260, right: 260, top: 300, padding: '50px 60px', textAlign: 'center'}}>
				<div style={{fontFamily: MONO, fontSize: 30, color: C.muted, letterSpacing: 3}}>UU 27/2026 PASAL 139 AYAT (1)</div>
				<div style={{fontFamily: SANS, fontWeight: 800, fontSize: 84, marginTop: 24}}>KHL × 70%</div>
				<div style={{fontFamily: MONO, fontSize: 46, color: C.gold, marginTop: 24}}>Rp4.248.132 × 70% = Rp2.973.692</div>
				<div style={{fontFamily: SANS, fontSize: 40, color: C.body, marginTop: 20}}>dibulatkan → <b style={{color: C.text}}>Rp3.000.000</b></div>
			</Card>],
			[9, <Title k="DASAR HUKUM" t="UU No. 27 Tahun 2026 tentang *Pelindungan Ketenagakerjaan*" size={76} sub="Pasal 139 ayat (1): UM = KHL × 70%" />],
			[10, <Big label="Selisih usulan Apindo vs keputusan" to={514744} prefix="Rp" note="per orang, per bulan" src={S_DEPE} />],
			[11, <Title k="PERNYATAAN PANAS" color={RED} t="Naik 7% dari angka yang kerendahan, ya *tetap kerendahan*" size={84} />],
		]} />
	),
	bekasi: ({b, dur}) => (
		<Beats b={b} dur={dur} items={[
			[0, <Title k="UMP vs UMK" t="UMP itu *lantai*, bukan gaji pabrik" />],
			[3, <Bars title="Upah minimum 2026" items={[{name: 'UMP Jabar', v: 2317601, txt: 'Rp2,32 jt', color: '#5A6B85'}, {name: 'UMK Kab. Bekasi', v: 5938885, txt: 'Rp5,94 jt', color: C.gold}]} line={{v: 3000000, txt: 'UMP 2027 Rp3 jt'}} src="iNews Bekasi, SPSI Bekasi (20-22/11/2026)" />],
			[6, <Title k="CIKARANG" t="Slip gaji di kawasan industri: *nggak berubah* karena UMP" size={84} />],
			[7, <Quote text="Upah ini tidak akan ada arti bagi kawasan-kawasan tersebut, karena mereka upahnya sudah di atas Rp3.000.000." hl="tidak akan ada arti" src="GUBERNUR JABAR, ANTARA 21/11/2026" />],
			[8, <Big label="UMK Kab. Bekasi 2027 (rekomendasi)" to={6427655} prefix="Rp" note="+8,23% = inflasi 3,16% + pertumbuhan 5,07% × alfa 1" src={S_BKS} />],
			[11, <Bars title="Upah Kab. Bekasi berapa kali UMP Jabar?" items={[{name: '2026', v: 2.56, txt: '2,56x', color: '#7B8BA5'}, {name: '2027*', v: 2.14, txt: '2,14x', color: TEAL}]} max={3} foot="*kalau rekomendasi UMK disahkan. Jarak menyempit." src={S_BKS} contoh />],
		]} />
	),
	daerah: ({b, dur}) => (
		<Beats b={b} dur={dur} items={[
			[0, <Title k="YANG BENERAN KENA" color={RED} t="Daerah yang upahnya *di bawah Rp3 juta*" />],
			[2, <Chips title="Batas dasar baru untuk *13 daerah*" items={['Pangandaran', 'Kota Banjar', 'Kuningan', 'Ciamis', 'Majalengka', 'Indramayu', 'Kab. Cirebon', 'Kota Cirebon', 'Garut', 'Kab. Sukabumi', 'Kota Sukabumi', 'Kab. Tasikmalaya', 'Kota Tasikmalaya']} src="Tribun Jabar (22/11/2026)" />],
			[4, <Title k="PADAT KARYA" t="Garmen · Tekstil · *Alas kaki*" sub="Pekerjanya kebanyakan perempuan" />],
			[6, <Bars title="Contoh: Garut" items={[{name: 'UMK 2026 (±)', v: 2470000, txt: 'Rp2,47 jt', color: '#5A6B85'}, {name: 'Lantai 2027', v: 3000000, txt: 'Rp3,00 jt', color: RED}]} foot="±21% dalam setahun" src="Apindo Jabar via Kompas (23/11/2026)" contoh />],
			[8, <Big label="Pabrik 10.000 karyawan: tambahan upah pokok" to={6.82} dec={2} prefix="Rp" suffix=" M" note="per bulan (10.000 × Rp682.399), belum BPJS, lembur, THR" contoh />],
			[11, <Title k="PERNYATAAN PANAS" color={RED} t="Alasan pabrik pindah ke sini *dipotong hampir sepertiga*" size={84} />],
			[14, <Chips title="Pilihan pabrik kalau pesanan lemah" color={C.gold} items={['Efisiensi', 'Minta pengecualian', 'Pindah lagi']} src="Gubernur buka jalur pengecualian: Kompas (22/11/2026)" />],
		]} />
	),
	dompet: ({b, dur}) => (
		<Beats b={b} dur={dur} items={[
			[0, <Title k="DOMPET LO" t="Naik di atas kertas vs *naik beneran*" />],
			[1, <Big label="Inflasi tahunan Oktober 2026" to={3.23} dec={2} suffix="%" color={C.text} src="BPS (2/11/2026), BI Analisis Inflasi Okt 2026" />],
			[2, <Bars title="Kenaikan riil setelah inflasi 3,23%" items={[{name: 'Lantai UMP Jabar', v: 25.4, txt: '±25%', color: C.green}, {name: 'UMK Kab. Bekasi*', v: 4.8, txt: '±4,8%', color: '#7B8BA5'}]} foot="*rekomendasi 8,23%. Hitungan: (1+kenaikan)/(1+inflasi) − 1" contoh />],
			[6, <Bars title="UMP sebulan = berapa gram emas Antam?" items={[{name: 'UMP 2026', v: 0.92, txt: '0,92 g', color: '#5A6B85'}, {name: 'UMP 2027', v: 1.2, txt: '±1,2 g', color: C.gold}]} foot="Harga jual Antam 23/11/2026: Rp2.505.000/gram. Bukan ajakan beli." src="Kontan, FortuneIDN (23/11/2026)" contoh />],
			[10, <Chain title="Rantai efek ke *dompet lo*" items={['Upah pokok naik', 'Biaya pabrik naik', 'Harga / rekrut / lembur', 'Slip gaji lo']} />],
			[12, <Big label="Kalau upah = 25% biaya operasional" to={7.36} dec={1} prefix="+" suffix="%" color={RED} note="total biaya naik ±7% (25% × 29,44%)" contoh />],
			[14, <Title k="DETAIL YANG KELEWAT" color={RED} t="Garut: banyak yang sudah bawa pulang *Rp3,4 sampai 3,7 juta*" sub="karena lembur Sabtu (Apindo Jabar). Kalau lembur dipangkas, slip gaji bisa nggak jauh beda." size={76} />],
		]} />
	),
	khl: ({b, dur}) => (
		<Beats b={b} dur={dur} items={[
			[0, <Title k="HAL KETIGA" color={RED} t="Rp3 juta baru *70%* dari hidup layak" />],
			[2, <Bars title="Target: 100% KHL bertahap sampai 2029" items={[{name: 'UMP 2026', v: 2317601, txt: 'Rp2,32 jt', color: '#5A6B85'}, {name: 'UMP 2027', v: 3000000, txt: 'Rp3,00 jt', color: C.gold}, {name: '100% KHL', v: 4248132, txt: 'Rp4,25 jt', color: TEAL}]} foot="Kalau KHL tetap: masih ±41,6% lagi. Ini TARGET, bukan keputusan." src="Media Indonesia (21/11/2026)" contoh />],
			[4, <><Title t="Ini *TARGET*, bukan keputusan" size={100} sub="Angkanya bisa berubah." /><Stamp t="TARGET 2029" /></>],
			[7, <Card style={{position: 'absolute', left: 240, right: 240, top: 260, padding: '50px 60px'}}>
				<div style={{fontFamily: MONO, fontSize: 28, color: C.muted, letterSpacing: 3}}>UU 27/2026 · DUA PEDOMAN</div>
				<div style={{display: 'flex', gap: 40, marginTop: 30}}>
					<div style={{flex: 1, fontSize: 46, fontWeight: 800}}>Rumus pertumbuhan<div style={{fontSize: 30, color: C.body, fontWeight: 400, marginTop: 10}}>inflasi + pertumbuhan × alfa</div></div>
					<div style={{flex: 1, fontSize: 46, fontWeight: 800, color: C.gold}}>KHL<div style={{fontSize: 30, color: C.body, fontWeight: 400, marginTop: 10}}>kebutuhan hidup layak</div></div>
				</div>
				<div style={{fontSize: 34, color: C.text, marginTop: 34}}>Menurut serikat buruh Bekasi: diambil nilai tertinggi</div>
				<div style={{fontFamily: MONO, fontSize: 20, color: C.muted, marginTop: 18}}>Sumber: Antara (23/11/2026), Suara (24/11/2026)</div>
			</Card>],
			[10, <Bars title="Dua tahun ke depan" items={[{name: 'Pengusaha', v: 1, txt: 'Asumsi upah ↑', color: C.gold}, {name: 'Pekerja', v: 1, txt: 'Naik lagi + risiko efisiensi', color: TEAL}]} />],
			[12, <><Title t="Kenaikan gaji di atas kertas = *0*, kalau pabriknya tutup" size={88} /><Stamp t="HAL KETIGA" /></>],
		]} />
	),
	langkah: ({b}) => (
		<Steps b={b} at={[2, 5, 8]} items={[
			['Tahan gaya hidup & cicilan', 'Tunggu 3 bulan: lembur & tunjangan tetap? Harga sekitar ikut naik?'],
			['Dana darurat 3–6 bulan', 'CONTOH: pengeluaran Rp2,5 jt → 3 bulan = Rp7,5 jt'],
			['Naikin nilai lo sendiri', 'UMK itu lantai. Sertifikasi, mesin, bahasa: susah diganti'],
		]} />
	),
	cta: ({b, dur}) => (
		<Beats b={b} dur={dur} items={[
			[0, <Chips title="Ringkasnya" color={C.gold} items={['UMP Jabar 2027 Rp3 jt (+29,44%)', 'Rumus KHL × 70%', 'Bekasi: lewat UMK (+8,23% rekomendasi)', 'Kena: 13 daerah padat karya', 'Target 100% KHL s.d. 2029']} />],
			[3, <Title k="DISCLAIMER" t="Edukasi, bukan ajakan transaksi atau *saran keuangan pribadi*" size={70} sub="UMK Bekasi masih rekomendasi. Hitungan di video ini adalah contoh." />],
			[5, <AbsoluteFill style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 70}}>
				<Card accent={C.gold} style={{width: 640, textAlign: 'center', padding: '50px 40px'}}><div style={{fontSize: 110, fontWeight: 900, color: C.gold}}>29%</div><div style={{fontSize: 36, marginTop: 10}}>Pekerja harus dibayar layak, pengusaha yang adaptasi</div></Card>
				<div style={{fontFamily: SERIF, fontSize: 72, color: C.muted}}>vs</div>
				<Card accent={TEAL} style={{width: 640, textAlign: 'center', padding: '50px 40px'}}><div style={{fontSize: 110, fontWeight: 900, color: TEAL}}>7%</div><div style={{fontSize: 36, marginTop: 10}}>Yang penting pabrik tetap buka, orang tetap kerja</div></Card>
				<div style={{position: 'absolute', bottom: 200, fontSize: 46, fontWeight: 800, color: C.text}}>Lo tim mana? Tulis di komentar + alasannya</div>
			</AbsoluteFill>],
			[9, <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
				<Pill t="JOIN KOMUNITAS TRADING" />
				<div style={{fontFamily: SANS, fontWeight: 900, fontSize: 130, color: C.gold, marginTop: 30}}>dhirajkelly.id</div>
				<div style={{fontSize: 40, color: C.body, marginTop: 20}}>Subscribe buat bedah ekonomi berikutnya</div>
			</AbsoluteFill>],
		]} />
	),
};
