import React from 'react';
import {AbsoluteFill, Audio, Loop, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {SCENES} from './OrderScenes';
import {Background, C, MONO, SANS, SERIF, useIn} from './ui';

export const FPS = 30;
export type Sent = {text: string; sub: string; start: number; end: number};
export type SceneT = {id: string; chapter: string; visual: string; audioDur: number; duration: number; sentences: Sent[]};

const CARD: Record<string, [string, string]> = {
	market: ['BAGIAN 1', 'Market Order'],
	limit: ['BAGIAN 2', 'Limit Order'],
	stop: ['BAGIAN 3', 'Stop Order'],
	sltp: ['BAGIAN 4', 'Stop Loss & Take Profit'],
	pilih: ['BAGIAN 5', 'Cara Memilih'],
	mt5: ['BAGIAN 6', 'Cara Pasang di MT5'],
	task: ['LATIHAN', 'Tugas Akun Demo'],
	summary: ['RINGKASAN', 'Yang Perlu Diingat'],
};
export const PAD = 1.6; // seconds of chapter card before VO
export const TAIL = 0.9;

export const layout = (scenes: SceneT[]) => {
	let t = 0;
	return scenes.map((s) => {
		const pad = CARD[s.visual] ? PAD : s.visual === 'hook' ? 0.15 : 0.3;
		const len = pad + s.audioDur + TAIL;
		const o = {s, start: t, pad, len};
		t += len;
		return o;
	});
};

const KEY = ['market order', 'Market order', 'buy limit', 'Buy limit', 'sell limit', 'Sell limit', 'buy stop', 'Buy stop', 'sell stop', 'Sell stop', 'limit order', 'stop order', 'Stop loss', 'stop loss', 'take profit', 'slippage', 'spread', 'bid', 'ask', 'konfirmasi', 'lot', '1%', 'dhirajkelly.id', 'MT5', 'pending order'];

type Cue = {t0: number; t1: number; text: string};
const cues = (sents: Sent[]): Cue[] => {
	const out: Cue[] = [];
	for (const s of sents) {
		const words = s.sub.split(/\s+/);
		const chunks: string[] = [];
		let cur: string[] = [];
		for (const w of words) {
			cur.push(w);
			const len = cur.join(' ').length;
			if (cur.length >= 8 || len > 46 || (/[,;:]$/.test(w) && cur.length >= 4)) {
				chunks.push(cur.join(' '));
				cur = [];
			}
		}
		if (cur.length) {
			if (cur.length <= 2 && chunks.length) chunks[chunks.length - 1] += ' ' + cur.join(' ');
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

const Subtitle: React.FC<{sents: Sent[]; offset: number; host?: [number, number][]}> = ({sents, offset, host = []}) => {
	const f = useCurrentFrame();
	const t = f / FPS - offset;
	const cs = React.useMemo(() => cues(sents), [sents]);
	const c = cs.find((x) => t >= x.t0 && t < x.t1 + 0.12);
	if (!c) return null;
	const side = host.some(([h0, h1]) => f >= h0 - 6 && f < h1 + 6);
	const a = interpolate(t, [c.t0, c.t0 + 0.12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	// highlight first keyword occurrence in gold
	let html: React.ReactNode = c.text;
	for (const k of KEY) {
		const i = c.text.indexOf(k);
		if (i >= 0) {
			html = (
				<>
					{c.text.slice(0, i)}
					<span style={{color: C.gold}}>{k}</span>
					{c.text.slice(i + k.length)}
				</>
			);
			break;
		}
	}
	return (
		<div style={{position: 'absolute', left: 0, right: side ? 560 : 0, bottom: 74, display: 'flex', justifyContent: 'center', opacity: a}}>
			<div style={{maxWidth: side ? 1150 : 1400, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 46, lineHeight: 1.25, color: '#FFFFFF', background: 'rgba(5,12,26,0.72)', padding: '10px 26px', borderRadius: 12, WebkitTextStroke: '0px'}}>
				{html}
			</div>
		</div>
	);
};

// Host avatar (approved cartoon of Dhiraj, white bg removed by multiply on a light card in the same stacking context)
const HOST_LOOP = 302;
const HostIn: React.FC<{len: number}> = ({len}) => {
	const f = useCurrentFrame();
	const sp = spring({frame: f, fps: FPS, config: {damping: 12, stiffness: 160, mass: 0.7}});
	const out = interpolate(f, [len - 10, len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const bob = Math.sin(f / 18) * 5;
	const H = 380;
	return (
		<div style={{position: 'absolute', right: 40, bottom: 0, width: 470, height: H + 20, opacity: out, transform: `translateY(${(1 - sp) * 220 + bob}px) scale(${0.85 + sp * 0.15})`, transformOrigin: '50% 100%'}}>
			<div style={{position: 'absolute', inset: 0, isolation: 'isolate', overflow: 'hidden', borderRadius: '28px 28px 0 0', background: '#F4F1EA', borderTop: `5px solid ${C.gold}`, boxShadow: '0 -10px 40px rgba(0,0,0,0.35)'}}>
				<div style={{position: 'absolute', left: -118, top: 26, width: 676, height: H, mixBlendMode: 'multiply'}}>
					<Loop durationInFrames={HOST_LOOP}>
						<OffthreadVideo src={staticFile('host/host.mp4')} muted style={{width: 676, height: H}} />
					</Loop>
				</div>
			</div>
		</div>
	);
};
const Host: React.FC<{wins: [number, number][]}> = ({wins}) => (
	<>
		{wins.map(([a, b]) => (
			<Sequence key={a} from={a} durationInFrames={Math.max(1, b - a)} name="host">
				<HostIn len={b - a} />
			</Sequence>
		))}
	</>
);
export const hostWins = (visual: string, pad: number, dur: number): [number, number][] => {
	const F = (t: number) => Math.round(t * FPS);
	if (visual === 'hook') return [[F(0.2), F(5.5)]];
	if (visual === 'cta') return [[F(pad + 0.3), dur - 2]];
	if (CARD[visual]) return [[F(pad + 0.1), F(pad + 4.6)]];
	return [];
};

const ChapterCard: React.FC<{k: string; t: string; len: number}> = ({k, t, len}) => {
	const f = useCurrentFrame();
	const a = useIn(0, 10);
	const out = interpolate(f, [len - 8, len], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const w = interpolate(f, [4, 22], [0, 520], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: a * out, background: 'rgba(7,18,38,0.94)'}}>
			<div style={{fontFamily: MONO, fontSize: 30, letterSpacing: 6, color: C.gold}}>{k}</div>
			<div style={{height: 3, width: w, background: C.gold, margin: '20px 0'}} />
			<div style={{fontFamily: SERIF, fontSize: 96, fontWeight: 700, color: C.text, transform: `translateY(${(1 - a) * 20}px)`}}>{t}</div>
		</AbsoluteFill>
	);
};

const Chrome: React.FC<{total: number; chapter: string}> = ({total, chapter}) => {
	const f = useCurrentFrame();
	return (
		<>
			<div style={{position: 'absolute', left: 0, top: 0, height: 5, width: `${(f / total) * 100}%`, background: C.gold}} />
			<div style={{position: 'absolute', left: 110, top: 46, fontFamily: SANS, fontWeight: 700, fontSize: 30, color: 'rgba(244,241,234,0.85)'}}>@dhirajkelly</div>
			<div style={{position: 'absolute', right: 90, top: 50, fontFamily: MONO, fontSize: 22, letterSpacing: 2, color: C.muted}}>{chapter.toUpperCase()}</div>
		</>
	);
};

export const Main: React.FC<{scenes: SceneT[]}> = ({scenes}) => {
	const L = layout(scenes);
	const total = Math.round((L[L.length - 1].start + L[L.length - 1].len) * FPS);
	return (
		<AbsoluteFill style={{background: C.navy, fontFamily: SANS}}>
			<Background />
			{L.map(({s, start, pad, len}) => {
				const Comp = SCENES[s.visual];
				const b = (k: number) => Math.round((pad + (s.sentences[Math.min(k, s.sentences.length - 1)]?.start ?? 0)) * FPS);
				const from = Math.round(start * FPS);
				const dur = Math.round(len * FPS);
				return (
					<Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
						<Comp b={b} dur={dur} />
						<Chrome total={total} chapter={s.chapter} />
						<Subtitle sents={s.sentences} offset={pad} host={hostWins(s.visual, pad, dur)} />
						<Sequence from={Math.round(pad * FPS)} name={`vo_${s.id}`}>
							<Audio src={staticFile(`vo/${s.id}.mp3`)} />
						</Sequence>
						<Audio src={staticFile('sfx/whoosh.wav')} volume={0.22} />
						<Host wins={hostWins(s.visual, pad, dur)} />
						{CARD[s.visual] && (
							<Sequence durationInFrames={Math.round(pad * FPS)} name={`card_${s.id}`}>
								<ChapterCard k={CARD[s.visual][0]} t={CARD[s.visual][1]} len={Math.round(pad * FPS)} />
							</Sequence>
						)}
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};
