import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BigCandle} from './LessonScenes';
import {Background, C, MONO, SANS} from './ui';

export const Thumb: React.FC = () => (
	<AbsoluteFill style={{background: C.navy, fontFamily: SANS}}>
		<Background />
		<div style={{position: 'absolute', left: 90, top: 110}}>
			<BigCandle o={3750} h={3758} l={3746} c={3752} yMin={3745} yMax={3759} H={520} W={560} bw={130} axis={false}
				marks={[{p: 3758, label: 'HIGH', color: C.gold, a: 1}, {p: 3746, label: 'LOW', color: C.gold, a: 1}, {p: 3752, label: 'CLOSE', color: C.green, a: 1, side: 'l'}, {p: 3750, label: 'OPEN', color: C.text, a: 1, side: 'l'}]} />
		</div>
		<div style={{position: 'absolute', left: 40, top: 34, fontFamily: MONO, fontWeight: 700, fontSize: 32, color: C.gold, letterSpacing: 3}}>CANDLESTICK · SIMULASI</div>
		<div style={{position: 'absolute', right: 0, top: 230, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14}}>
			<div style={{background: C.gold, color: '#0B1630', fontWeight: 900, fontSize: 100, padding: '6px 34px 6px 40px', letterSpacing: -2, lineHeight: 1.05}}>BACA CANDLE</div>
			<div style={{background: '#000', color: '#fff', fontWeight: 900, fontSize: 100, padding: '6px 34px 6px 40px', letterSpacing: -2, lineHeight: 1.05}}>CUMA WARNA<span style={{color: '#FF2D2D'}}>?</span></div>
		</div>
		<div style={{position: 'absolute', right: 40, bottom: 40, fontWeight: 700, fontSize: 34, color: C.text}}>@dhirajkelly</div>
	</AbsoluteFill>
);
