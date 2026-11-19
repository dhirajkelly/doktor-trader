import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Candle} from './data';
import {C, MONO} from './ui';

export type Scale = {x: (i: number) => number; y: (p: number) => number; cw: number; W: number; H: number};

type Props = {
	data: Candle[];
	reveal: number; // number of candles visible (float)
	yMin: number;
	yMax: number;
	W?: number;
	H?: number;
	label?: string;
	slots?: number; // horizontal slots (defaults to data length + margin)
	overlay?: (s: Scale) => React.ReactNode;
	under?: (s: Scale) => React.ReactNode;
	lines?: {values: number[]; color: string; width?: number; dash?: string; draw?: number}[];
	opacity?: number;
};

export const Chart: React.FC<Props> = ({data, reveal, yMin, yMax, W = 1680, H = 700, label, slots, overlay, under, lines, opacity = 1}) => {
	const padR = 110;
	const n = slots ?? data.length + 4;
	const cw = (W - padR - 20) / n;
	const x = (i: number) => 20 + cw * (i + 0.5);
	const y = (p: number) => H - ((p - yMin) / (yMax - yMin)) * H;
	const s: Scale = {x, y, cw, W, H};
	const vis = Math.max(0, Math.min(data.length, reveal));
	const step = niceStep((yMax - yMin) / 6);
	const ticks: number[] = [];
	for (let p = Math.ceil(yMin / step) * step; p <= yMax; p += step) ticks.push(p);
	return (
		<svg width={W} height={H} style={{overflow: 'visible', opacity}}>
			{ticks.map((p) => (
				<g key={p}>
					<line x1={0} x2={W - padR + 10} y1={y(p)} y2={y(p)} stroke="rgba(159,168,184,0.12)" strokeWidth={1} />
					<text x={W - padR + 22} y={y(p) + 7} fill={C.muted} fontFamily={MONO} fontSize={19}>
						{fmt(p, step < 1 ? 1 : 0)}
					</text>
				</g>
			))}
			{under?.(s)}
			{data.map((c, i) => {
				if (i >= Math.ceil(vis)) return null;
				const a = i < Math.floor(vis) ? 1 : vis - Math.floor(vis);
				const up = c.c >= c.o;
				const col = up ? C.green : C.red;
				const top = y(Math.max(c.o, c.c));
				const bot = y(Math.min(c.o, c.c));
				return (
					<g key={i} opacity={a}>
						<line x1={x(i)} x2={x(i)} y1={y(c.h)} y2={y(c.l)} stroke={col} strokeWidth={2} />
						<rect x={x(i) - cw * 0.34} y={top} width={cw * 0.68} height={Math.max(2, bot - top)} fill={col} rx={1.5} />
					</g>
				);
			})}
			{lines?.map((ln, k) => {
				const upto = Math.min(ln.draw ?? vis, vis);
				const pts: string[] = [];
				for (let i = 0; i < Math.floor(upto); i++) pts.push(`${x(i)},${y(ln.values[i])}`);
				if (pts.length < 2) return null;
				return <polyline key={k} points={pts.join(' ')} fill="none" stroke={ln.color} strokeWidth={ln.width ?? 3.5} strokeDasharray={ln.dash} strokeLinejoin="round" />;
			})}
			{overlay?.(s)}
			{label && (
				<text x={6} y={-18} fill={C.muted} fontFamily={MONO} fontSize={22} letterSpacing={1}>
					{label}
				</text>
			)}
		</svg>
	);
};

const niceStep = (raw: number) => {
	const p = Math.pow(10, Math.floor(Math.log10(raw)));
	const m = raw / p;
	return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
};
export const fmt = (p: number, d = 2) => p.toLocaleString('id-ID', {minimumFractionDigits: d, maximumFractionDigits: d});

// Zone rectangle with label, extends from candle index to right edge; animated width
export const Zone: React.FC<{s: Scale; lo: number; hi: number; from: number; to?: number; color: string; label?: string; prog: number; labelSide?: 'top' | 'bottom'; labelRight?: boolean}> = ({s, lo, hi, from, to, color, label, prog, labelSide = 'top', labelRight}) => {
	const x0 = s.x(from) - s.cw * 0.5;
	const x1full = to !== undefined ? s.x(to) + s.cw * 0.5 : s.W - 110;
	const x1 = x0 + (x1full - x0) * prog;
	const y0 = s.y(hi);
	const y1 = s.y(lo);
	return (
		<g opacity={Math.min(1, prog * 2)}>
			<rect x={x0} y={y0} width={Math.max(0, x1 - x0)} height={y1 - y0} fill={color} fillOpacity={0.18} stroke={color} strokeOpacity={0.8} strokeWidth={2} rx={4} />
			{label && (
				<text x={labelRight ? x1 - 10 : x0 + 10} textAnchor={labelRight ? 'end' : 'start'} y={labelSide === 'top' ? y0 - 12 : y1 + 30} fill={color} fontFamily={MONO} fontWeight={700} fontSize={22}>
					{label}
				</text>
			)}
		</g>
	);
};

export const HLine: React.FC<{s: Scale; p: number; color: string; label?: string; prog: number; dash?: string; from?: number}> = ({s, p, color, label, prog, dash = '10 8', from = 0}) => {
	const x0 = from ? s.x(from) : 0;
	const x1 = x0 + (s.W - 110 - x0) * prog;
	return (
		<g opacity={Math.min(1, prog * 3)}>
			<line x1={x0} x2={x1} y1={s.y(p)} y2={s.y(p)} stroke={color} strokeWidth={3} strokeDasharray={dash} />
			{label && (
				<g>
					<rect x={s.W - 108} y={s.y(p) - 17} width={108} height={34} rx={6} fill={color} />
					<text x={s.W - 54} y={s.y(p) + 7} fill="#0B1630" fontFamily={MONO} fontWeight={700} fontSize={18} textAnchor="middle">
						{label}
					</text>
				</g>
			)}
		</g>
	);
};

export const Tag: React.FC<{x: number; y: number; text: string; color: string; prog: number; anchor?: 'start' | 'middle' | 'end'}> = ({x, y, text, color, prog, anchor = 'middle'}) => {
	const w = text.length * 13 + 28;
	const ox = anchor === 'middle' ? -w / 2 : anchor === 'end' ? -w : 0;
	return (
		<g opacity={prog} transform={`translate(${x + ox}, ${y - 20 + (1 - prog) * 14})`}>
			<rect width={w} height={40} rx={20} fill="rgba(7,18,38,0.92)" stroke={color} strokeWidth={2} />
			<text x={w / 2} y={27} fill={color} fontFamily={MONO} fontWeight={700} fontSize={20} textAnchor="middle">
				{text}
			</text>
		</g>
	);
};

export const useReveal = (from: number, to: number, a: number, b: number) => {
	const f = useCurrentFrame();
	return interpolate(f, [from, to], [a, b], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
};
