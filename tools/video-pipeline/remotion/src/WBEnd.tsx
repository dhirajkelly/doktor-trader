import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {MARK, SANSB, W, prog} from './wb';

// 20 s end screen (space on the right for YouTube end-screen elements)
export const WBEnd: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 40%, #1d2433 0%, #0b0d12 70%)'}}>
			<div style={{position: 'absolute', left: 120, top: 300}}>
				<div style={{opacity: prog(f, 0, 12), fontFamily: SANSB, fontWeight: 900, fontSize: 84, color: '#fff'}}>JOIN KOMUNITAS TRADING</div>
				<div style={{opacity: prog(f, 8, 12), fontFamily: SANSB, fontWeight: 900, fontSize: 120, color: W.gold, letterSpacing: -2}}>dhirajkelly.id</div>
				<div style={{opacity: prog(f, 16, 12), marginTop: 36, fontFamily: MARK, fontSize: 40, color: 'rgba(255,255,255,0.85)'}}>Doktor Trader · Academy</div>
			</div>
		</AbsoluteFill>
	);
};
