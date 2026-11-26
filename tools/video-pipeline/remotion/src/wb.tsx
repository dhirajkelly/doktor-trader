// Whiteboard primitives (aturan L1: papan terang, tulisan spidol, coretan yang tergambar bertahap)
import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/permanent-marker/400.css';
import '@fontsource/caveat/700.css';

export const W = {
	paper: '#FBFAF5',
	ink: '#1C1C1E',
	red: '#D62839',
	green: '#18935A',
	orange: '#EE7B1C',
	blue: '#2462A8',
	yellow: '#FFE15C',
	grey: '#7A7A7A',
	dark: '#0D0F14',
	gold: '#FFD84D',
};
export const MARK = "'Permanent Marker', 'Comic Sans MS', cursive";
export const HAND = "'Caveat', 'Comic Sans MS', cursive";
export const SANSB = "Helvetica, 'Liberation Sans', Arial, sans-serif";

const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const prog = (f: number, at: number, dur = 14) => interpolate(f, [at, at + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

// Text that is "written" left to right (clip reveal) starting at frame `at`
export const Write: React.FC<{at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, dur = 16, children, style}) => {
	const f = useCurrentFrame();
	const p = prog(f, at, dur);
	return <div style={{clipPath: `inset(-20% ${(1 - p) * 100}% -20% -5%)`, opacity: p > 0 ? 1 : 0, ...style}}>{children}</div>;
};

// Pop-in (spring scale)
export const Pop: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: f - at, fps, config: {damping: 12, stiffness: 170, mass: 0.7}});
	const o = interpolate(f, [at, at + 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return <div style={{opacity: o, transform: `scale(${0.8 + 0.2 * s})`, transformOrigin: '50% 50%', ...style}}>{children}</div>;
};

// Highlighter sweep behind inline content
export const Hi: React.FC<{at: number; color?: string; children: React.ReactNode}> = ({at, color = W.yellow, children}) => {
	const f = useCurrentFrame();
	const p = prog(f, at, 12);
	return (
		<span style={{position: 'relative', display: 'inline-block'}}>
			<span style={{position: 'absolute', left: -6, right: -6, top: '22%', bottom: '6%', background: color, opacity: 0.75, transform: `scaleX(${p})`, transformOrigin: 'left', borderRadius: 6, zIndex: 0}} />
			<span style={{position: 'relative', zIndex: 1}}>{children}</span>
		</span>
	);
};

// SVG stroke drawn progressively. d in absolute 1920x1080 coordinates.
export const Stroke: React.FC<{d: string; at: number; dur?: number; color?: string; width?: number; dash?: boolean}> = ({d, at, dur = 16, color = W.red, width = 6, dash}) => {
	const f = useCurrentFrame();
	const p = prog(f, at, dur);
	if (p <= 0) return null;
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
			{dash ? (
				<path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray="18 14" style={{clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`}} />
			) : (
				<path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
			)}
		</svg>
	);
};

// hand-drawn ellipse around a box
export const circleD = (x: number, y: number, w: number, h: number) => {
	const cx = x + w / 2, cy = y + h / 2, rx = w / 2 + 18, ry = h / 2 + 14;
	return `M ${cx - rx * 0.2} ${cy - ry} C ${cx + rx * 0.9} ${cy - ry * 1.08}, ${cx + rx * 1.05} ${cy + ry * 0.9}, ${cx} ${cy + ry} C ${cx - rx * 1.1} ${cy + ry * 1.02}, ${cx - rx * 1.02} ${cy - ry * 0.85}, ${cx + rx * 0.15} ${cy - ry * 1.05}`;
};
export const underD = (x: number, y: number, w: number) => `M ${x} ${y} Q ${x + w * 0.5} ${y + 7} ${x + w} ${y - 3}`;
export const arrowD = (x1: number, y1: number, x2: number, y2: number) => {
	const a = Math.atan2(y2 - y1, x2 - x1), L = 26;
	const mx = (x1 + x2) / 2 + (y2 - y1) * 0.08, my = (y1 + y2) / 2 - (x2 - x1) * 0.08;
	return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2} M ${x2} ${y2} L ${x2 - L * Math.cos(a - 0.45)} ${y2 - L * Math.sin(a - 0.45)} M ${x2} ${y2} L ${x2 - L * Math.cos(a + 0.45)} ${y2 - L * Math.sin(a + 0.45)}`;
};

// Paper board with slow camera push-in; children are positioned absolutely in 1920x1080 space
export const Board: React.FC<{dur: number; children: React.ReactNode; zoom?: [number, number, number, number]}> = ({dur, children, zoom}) => {
	const f = useCurrentFrame();
	const s = interpolate(f, [0, dur], [1, 1.035], {extrapolateRight: 'clamp'});
	// optional zoom: [atFrame, scale, originX, originY]
	let zs = 1, ox = 960, oy = 540;
	if (zoom) {
		const p = prog(f, zoom[0], 20);
		zs = 1 + (zoom[1] - 1) * p;
		ox = zoom[2];
		oy = zoom[3];
	}
	return (
		<div style={{position: 'absolute', inset: 0, background: W.paper, overflow: 'hidden'}}>
			<div style={{position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,0,0,0.07) 1.2px, transparent 1.2px)', backgroundSize: '34px 34px'}} />
			<div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 160px rgba(120,110,90,0.18)'}} />
			<div style={{position: 'absolute', inset: 0, transform: `scale(${s * zs})`, transformOrigin: `${ox}px ${oy}px`}}>{children}</div>
		</div>
	);
};

// Handwritten title at top-left with yellow highlighter
export const Title: React.FC<{at?: number; children: React.ReactNode; sub?: string}> = ({at = 0, children, sub}) => (
	<div style={{position: 'absolute', left: 110, top: 112}}>
		<Write at={at} dur={18}>
			<div style={{fontFamily: MARK, fontSize: 64, color: W.ink, lineHeight: 1.05}}>
				<Hi at={at + 14}>{children}</Hi>
			</div>
		</Write>
		{sub && (
			<Write at={at + 14} dur={14}>
				<div style={{fontFamily: HAND, fontWeight: 700, fontSize: 40, color: W.grey, marginTop: 6}}>{sub}</div>
			</Write>
		)}
	</div>
);

// Sticky note card
export const Note: React.FC<{at: number; x: number; y: number; w: number; color?: string; rot?: number; children: React.ReactNode}> = ({at, x, y, w, color = '#FFF3A8', rot = -1.5, children}) => (
	<div style={{position: 'absolute', left: x, top: y, width: w}}>
		<Pop at={at}>
			<div style={{background: color, padding: '22px 28px', boxShadow: '0 10px 24px rgba(0,0,0,0.15)', transform: `rotate(${rot}deg)`, fontFamily: HAND, fontWeight: 700, fontSize: 44, color: W.ink, lineHeight: 1.15}}>{children}</div>
		</Pop>
	</div>
);

export const Tag: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({children, color = W.ink, style}) => (
	<span style={{display: 'inline-block', border: `3px solid ${color}`, color, borderRadius: 10, padding: '2px 14px', fontFamily: MARK, fontSize: 26, letterSpacing: 1, transform: 'rotate(-2deg)', ...style}}>{children}</span>
);
