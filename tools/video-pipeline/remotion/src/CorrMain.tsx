// Main composition (Risiko tersembunyi: posisi ganda & korelasi), format L (whiteboard) + host kartun (pose P01–P40, keyed PNG/WebP frames in public/host/<pose>/fNNN.webp)
import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {SCENES} from './CorrScenes';
import COUNTS from './host_counts.json';
import {HAND, MARK, SANSB, Stroke, W, Write, prog, underD} from './wb';

export const FPS = 30;
export type Sent = {text: string; sub: string; start: number; end: number};
export type SceneT = {id: string; chapter: string; visual: string; audioDur: number; duration: number; sentences: Sent[]};

export const CARD: Record<string, [string, string]> = {
	stack: ['BAGIAN 1', 'Posisi Ganda'],
	pair: ['BAGIAN 2', 'Korelasi'],
	total: ['BAGIAN 3', 'Total Risiko Terbuka'],
	mistakes: ['3 KESALAHAN', 'Risiko Numpuk Tanpa Sadar'],
	summary: ['RANGKUMAN', '3 Langkah Mulai Besok'],
};
export const PAD = 1.6;
export const TAIL = 0.9;
export const layout = (scenes: SceneT[]) => {
	let t = 0;
	return scenes.map((s) => {
		const pad = CARD[s.visual] ? PAD : s.visual === 'hook' ? 0.1 : 0.3;
		const len = pad + s.audioDur + TAIL;
		const o = {s, start: t, pad, len};
		t += len;
		return o;
	});
};

// ---------------- host ----------------
const POSES: Record<string, string[]> = {
	hook: ['P13', 'P04', 'P03', 'P32', 'P18', 'P36', 'P22', 'P26', 'P11', 'P09'],
	map: ['P10', 'P12', 'P11', 'P09', 'P05'],
	stack: ['P01', 'P32', 'P10', 'P25', 'P26', 'P18', 'P28', 'P36', 'P08', 'P04', 'P22'],
	pair: ['P10', 'P04', 'P26', 'P32', 'P34', 'P28', 'P36', 'P14', 'P21'],
	usd: ['P28', 'P26', 'P13', 'P04'],
	total: ['P32', 'P34', 'P12', 'P11', 'P14', 'P10', 'P21', 'P36'],
	rules: ['P04', 'P08', 'P22', 'P21', 'P05', 'P26'],
	mistakes: ['P12', 'P22', 'P11', 'P18', 'P09', 'P36'],
	summary: ['P12', 'P11', 'P09', 'P21', 'P05'],
	disclaimer: ['P36'],
	cta: ['P05', 'P13'],
};
const HAVE = new Set(Object.keys(COUNTS as Record<string, number>));
const FLIP = new Set(['P01']); // P01 points to the right of the frame; host stands bottom-right so mirror it to point at the board
export type HostSeg = {from: number; pose: string};
export const hostPlan = (scenes: SceneT[]): HostSeg[] => {
	const L = layout(scenes);
	const segs: HostSeg[] = [];
	const lastUse: Record<string, number> = {};
	for (const {s, start, pad} of L) {
		const list = (POSES[s.visual] ?? ['P10']).filter((p) => HAVE.has(p));
		let li = 0;
		s.sentences.forEach((x, k) => {
			const t = Math.round((start + (k === 0 ? 0 : pad + x.start)) * FPS);
			const prev = segs[segs.length - 1];
			if (prev && t - prev.from < 3.6 * FPS && k !== 0) return;
			// pick next pose in the scene list not used in the last 20 s
			let pose = list[li % list.length];
			for (let tries = 0; tries < list.length; tries++) {
				const cand = list[(li + tries) % list.length];
				if (lastUse[cand] === undefined || t - lastUse[cand] > 20 * FPS) {
					pose = cand;
					li = li + tries;
					break;
				}
			}
			li++;
			if (prev && prev.pose === pose) return;
			segs.push({from: t, pose});
			lastUse[pose] = t;
		});
	}
	return segs;
};

const HostFrame: React.FC<{pose: string; local: number; flip: boolean; H: number; opacity: number}> = ({pose, local, flip, H, opacity}) => {
	const n = (COUNTS as Record<string, number>)[pose] ?? 121;
	const per = 2 * (n - 1);
	const p = Math.floor((local * 24) / 30) % per;
	const idx = p < n ? p : per - p;
	return (
		<Img
			src={staticFile(`host/${pose}/f${String(Math.min(n - 1, idx)).padStart(3, '0')}.webp`)}
			style={{position: 'absolute', right: 0, bottom: 0, height: H, opacity, transform: flip ? 'scaleX(-1)' : undefined, transformOrigin: '50% 50%'}}
		/>
	);
};
const Host: React.FC<{segs: HostSeg[]; total: number; ctaFrom: number}> = ({segs, total, ctaFrom}) => {
	const f = useCurrentFrame();
	let i = 0;
	while (i + 1 < segs.length && segs[i + 1].from <= f) i++;
	const cur = segs[i];
	const prev = i > 0 ? segs[i - 1] : null;
	const xf = Math.min(1, (f - cur.from) / 6);
	const inCta = f >= ctaFrom;
	const H = inCta ? 560 : 350;
	const pop = interpolate(f, [cur.from, cur.from + 6], [0.96, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const bob = Math.sin(f / 22) * 3;
	return (
		<div style={{position: 'absolute', right: inCta ? 90 : 24, bottom: 0, width: 900, height: H + 20, transform: `translateY(${bob}px) scale(${pop})`, transformOrigin: '100% 100%'}}>
			{prev && xf < 1 && <HostFrame pose={prev.pose} local={f - prev.from} flip={FLIP.has(prev.pose)} H={H} opacity={1 - xf} />}
			<HostFrame pose={cur.pose} local={f - cur.from} flip={FLIP.has(cur.pose)} H={H} opacity={xf} />
		</div>
	);
};

// ---------------- subtitles ----------------
const KEY = ['total risiko terbuka', 'satu taruhan', 'korelasi', 'diversifikasi', 'break even', 'slippage', 'averaging', 'satu ide', 'dolar melemah', 'dolar menguat', '$280', '2,8%', '0,91', '104 candle', '2–3%', '3%', '2%', '1%', '$100', '$300', '$200', 'simulasi', 'data asli', 'dhirajkelly.id', 'margin call', 'jangan ditambah'];
type Cue = {t0: number; t1: number; text: string};
const cues = (sents: Sent[]): Cue[] => {
	const out: Cue[] = [];
	for (const s of sents) {
		const words = s.sub.split(/\s+/);
		const chunks: string[] = [];
		let cur: string[] = [];
		for (const w of words) {
			cur.push(w);
			if (cur.length >= 6 || cur.join(' ').length > 34 || (/[,;:]$/.test(w) && cur.length >= 3)) {
				chunks.push(cur.join(' '));
				cur = [];
			}
		}
		if (cur.length) {
			if (cur.length <= 1 && chunks.length) chunks[chunks.length - 1] += ' ' + cur.join(' ');
			else chunks.push(cur.join(' '));
		}
		const total = chunks.reduce((a, c) => a + c.length, 0);
		let t = s.start;
		for (const c of chunks) {
			const d = ((s.end - s.start) * c.length) / total;
			out.push({t0: t, t1: t + d, text: c});
			t += d;
		}
	}
	return out;
};
const Subtitle: React.FC<{sents: Sent[]; offset: number; wide: boolean}> = ({sents, offset, wide}) => {
	const f = useCurrentFrame();
	const t = f / FPS - offset;
	const cs = React.useMemo(() => cues(sents), [sents]);
	const c = cs.find((x) => t >= x.t0 && t < x.t1 + 0.1);
	if (!c) return null;
	let node: React.ReactNode = c.text;
	for (const k of KEY) {
		const re = new RegExp(`(^|[^\\wÀ-ÿ])(${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?=$|[^\\wÀ-ÿ])`);
		const m = c.text.match(re);
		if (m && m.index !== undefined) {
			const i = m.index + m[1].length;
			node = (
				<>
					{c.text.slice(0, i)}
					<span style={{color: W.gold}}>{k}</span>
					{c.text.slice(i + k.length)}
				</>
			);
			break;
		}
	}
	return (
		<div style={{position: 'absolute', left: 0, right: wide ? 780 : 440, bottom: 54, display: 'flex', justifyContent: 'center'}}>
			<div style={{maxWidth: 1300, textAlign: 'center', fontFamily: SANSB, fontWeight: 900, fontSize: 54, lineHeight: 1.18, color: '#fff', WebkitTextStroke: '8px #000', paintOrder: 'stroke fill', textShadow: '0 4px 10px rgba(0,0,0,0.35)'}}>{node}</div>
		</div>
	);
};

// ---------------- chapter card + chrome ----------------
const ChapterCard: React.FC<{k: string; t: string; len: number}> = ({k, t, len}) => {
	const f = useCurrentFrame();
	const out = interpolate(f, [len - 6, len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{background: W.paper, opacity: out}}>
			<div style={{position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,0,0,0.07) 1.2px, transparent 1.2px)', backgroundSize: '34px 34px'}} />
			<div style={{position: 'absolute', left: 200, top: 330}}>
				<Write at={0} dur={10}>
					<div style={{fontFamily: MARK, fontSize: 52, color: W.red}}>{k}</div>
				</Write>
				<Write at={6} dur={16}>
					<div style={{fontFamily: MARK, fontSize: 120, color: W.ink, marginTop: 10}}>{t}</div>
				</Write>
			</div>
			<Stroke d={underD(200, 560, Math.min(1400, 70 * t.length))} at={14} color={W.yellow} width={22} />
		</AbsoluteFill>
	);
};
const Chrome: React.FC<{total: number; dark: boolean}> = ({total, dark}) => {
	const f = useCurrentFrame();
	const c = dark ? 'rgba(255,255,255,0.85)' : W.ink;
	return (
		<>
			<div style={{position: 'absolute', left: 0, top: 0, height: 6, width: `${(f / total) * 100}%`, background: W.orange}} />
			<div style={{position: 'absolute', left: 110, top: 34, display: 'flex', gap: 14, alignItems: 'center'}}>
				<div style={{border: `3px solid ${c}`, color: c, borderRadius: 30, padding: '2px 18px', fontFamily: MARK, fontSize: 24}}>ACADEMY · MANAJEMEN RISIKO #13</div>
				<div style={{fontFamily: MARK, fontSize: 26, color: c}}>Doktor Trader</div>
			</div>
			<div style={{position: 'absolute', right: 60, top: 40, fontFamily: HAND, fontWeight: 700, fontSize: 30, color: dark ? 'rgba(255,255,255,0.7)' : W.grey}}>EDUKASI · BUKAN SINYAL</div>
		</>
	);
};

export const Main: React.FC<{scenes: SceneT[]}> = ({scenes}) => {
	const L = layout(scenes);
	const total = Math.round((L[L.length - 1].start + L[L.length - 1].len) * FPS);
	const segs = React.useMemo(() => hostPlan(scenes), [scenes]);
	const cta = L.find((x) => x.s.visual === 'cta');
	const ctaFrom = cta ? Math.round(cta.start * FPS) : total;
	const f = useCurrentFrame();
	const hookCardEnd = Math.round((L[0].pad + (L[0].s.sentences[1]?.start ?? 0)) * FPS);
	const dark = f < hookCardEnd || f >= ctaFrom;
	return (
		<AbsoluteFill style={{background: W.paper}}>
			{L.map(({s, start, pad, len}) => {
				const Comp = SCENES[s.visual];
				const b = (k: number) => Math.round((pad + (s.sentences[Math.min(k, s.sentences.length - 1)]?.start ?? 0)) * FPS);
				const from = Math.round(start * FPS);
				const dur = Math.round(len * FPS);
				return (
					<Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
						<Comp b={b} dur={dur} />
						{CARD[s.visual] && (
							<Sequence durationInFrames={Math.round(pad * FPS)} name={`card_${s.id}`}>
								<ChapterCard k={CARD[s.visual][0]} t={CARD[s.visual][1]} len={Math.round(pad * FPS)} />
							</Sequence>
						)}
						<Sequence from={Math.round(pad * FPS)} name={`vo_${s.id}`}>
							<Audio src={staticFile(`vo/${s.id}.mp3`)} />
						</Sequence>
						<Audio src={staticFile('sfx/whoosh.wav')} volume={0.18} />
					</Sequence>
				);
			})}
			<Chrome total={total} dark={dark} />
			<Host segs={segs} total={total} ctaFrom={ctaFrom} />
			{L.map(({s, start, pad, len}) => (
				<Sequence key={'sub' + s.id} from={Math.round(start * FPS)} durationInFrames={Math.round(len * FPS)}>
					<Subtitle sents={s.sentences} offset={pad} wide={s.visual === 'cta'} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
void prog;
