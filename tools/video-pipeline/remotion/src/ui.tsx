import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import '@fontsource/playfair-display/700.css';
import '@fontsource/playfair-display/700-italic.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/700.css';

export const C = {
	navy: '#0B1B33',
	navyDeep: '#071226',
	panel: '#142850',
	gold: '#C9A24A',
	goldSoft: 'rgba(201,162,74,0.18)',
	text: '#F4F1EA',
	body: '#D9D4C7',
	muted: '#9FA8B8',
	green: '#5FD3A6',
	red: '#E26D6D',
	blue: '#7FB2FF',
};
export const SANS = "Helvetica, 'Liberation Sans', Arial, sans-serif";
export const SERIF = "'Playfair Display', Georgia, serif";
export const MONO = "'JetBrains Mono', monospace";

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// Keyframed fade/slide-in starting at frame `at` (relative to sequence)
export const useIn = (at: number, dur = 14) => {
	const f = useCurrentFrame();
	return interpolate(f, [at, at + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
};
export const useOut = (at: number, dur = 10) => {
	const f = useCurrentFrame();
	return interpolate(f, [at, at + dur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
};
export const useSpring = (at: number, damping = 14) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: f - at, fps, config: {damping, stiffness: 140, mass: 0.8}});
};

export const Appear: React.FC<{at: number; out?: number; dy?: number; dx?: number; children: React.ReactNode; style?: React.CSSProperties; pop?: boolean}> = ({at, out, dy = 24, dx = 0, children, style, pop}) => {
	const a = useIn(at);
	const s = useSpring(at);
	const o = out !== undefined ? useOut(out) : 1;
	const scale = pop ? interpolate(s, [0, 1], [0.86, 1]) : 1;
	return (
		<div style={{opacity: a * o, transform: `translate(${(1 - a) * dx}px, ${(1 - a) * dy}px) scale(${scale})`, ...style}}>{children}</div>
	);
};

export const Background: React.FC = () => {
	const f = useCurrentFrame();
	const drift = (f * 0.15) % 60;
	return (
		<div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 30% 20%, #122a4f 0%, ${C.navy} 45%, ${C.navyDeep} 100%)`}}>
			<div
				style={{
					position: 'absolute',
					inset: -60,
					backgroundImage: `linear-gradient(rgba(201,162,74,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,74,0.07) 1px, transparent 1px)`,
					backgroundSize: '60px 60px',
					transform: `translate(${drift}px, ${drift}px)`,
				}}
			/>
		</div>
	);
};

export const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties; accent?: string}> = ({children, style, accent}) => (
	<div
		style={{
			background: 'linear-gradient(160deg, rgba(25,48,92,0.96), rgba(16,33,66,0.96))',
			border: `1.5px solid ${accent ?? 'rgba(201,162,74,0.35)'}`,
			borderRadius: 22,
			padding: '28px 34px',
			boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
			color: C.text,
			fontFamily: SANS,
			...style,
		}}
	>
		{children}
	</div>
);

export const Badge: React.FC<{children: React.ReactNode; color?: string; style?: React.CSSProperties}> = ({children, color = C.gold, style}) => (
	<div
		style={{
			display: 'inline-block',
			border: `1.5px solid ${color}`,
			color,
			fontFamily: MONO,
			fontWeight: 700,
			fontSize: 20,
			letterSpacing: 2,
			padding: '8px 16px',
			borderRadius: 999,
			background: 'rgba(7,18,38,0.7)',
			...style,
		}}
	>
		{children}
	</div>
);

// Typewriter-free headline with highlighted words wrapped in *asterisks*
export const Hl: React.FC<{text: string; size?: number; serif?: boolean; color?: string; style?: React.CSSProperties}> = ({text, size = 72, serif, color = C.text, style}) => {
	const parts = text.split('*');
	return (
		<div style={{fontFamily: serif ? SERIF : SANS, fontWeight: 700, fontSize: size, lineHeight: 1.12, color, letterSpacing: serif ? 0 : -1, ...style}}>
			{parts.map((p, i) => (
				<span key={i} style={{color: i % 2 ? C.gold : undefined}}>
					{p}
				</span>
			))}
		</div>
	);
};
