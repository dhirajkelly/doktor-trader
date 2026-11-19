import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Appear, Background, Badge, C, MONO, SANS, SERIF} from './ui';

export const End: React.FC = () => (
	<AbsoluteFill style={{background: C.navy, fontFamily: SANS}}>
		<Background />
		<div style={{position: 'absolute', left: 110, top: 46, fontWeight: 700, fontSize: 30, color: 'rgba(244,241,234,0.85)'}}>@dhirajkelly</div>
		<div style={{position: 'absolute', left: 110, top: 150}}>
			<Appear at={0}><Badge>JOIN KOMUNITAS GRATIS</Badge></Appear>
			<Appear at={8}><div style={{fontWeight: 800, fontSize: 96, color: C.gold, letterSpacing: -2, marginTop: 18}}>dhirajkelly.id</div></Appear>
			<Appear at={16}><div style={{fontFamily: SERIF, fontSize: 40, color: C.text, marginTop: 12}}>Manage risk. Protect capital. Trade smarter.</div></Appear>
		</div>
		<div style={{position: 'absolute', left: 110, top: 520, width: 900, fontSize: 30, color: C.body, lineHeight: 1.4}}>Komen: langkah mana yang paling sering lo langgar?</div>
	</AbsoluteFill>
);
