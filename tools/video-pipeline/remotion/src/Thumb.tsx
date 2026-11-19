import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Chart, HLine, Zone, Tag} from './Chart';
import * as D from './data';
import {Background, C, MONO, SANS} from './ui';

export const Thumb: React.FC = () => (
	<AbsoluteFill style={{background: C.navy, fontFamily: SANS}}>
		<Background />
		<div style={{position: 'absolute', left: 30, top: 120, transform: 'scale(1.0)'}}>
			<Chart data={D.CONFIRM} reveal={D.CF_ENTRY.i + 6} yMin={4400} yMax={4428} W={760} H={520}
				under={(s) => (<>
					<Zone s={s} lo={D.CF_ZONE.lo} hi={D.CF_ZONE.hi} from={0} color={C.gold} prog={1} />
					<Zone s={s} lo={D.CF_FVG.lo} hi={D.CF_FVG.hi} from={D.CF_FVG.from + 1} color={C.green} prog={1} />
				</>)}
				overlay={(s) => (<>
					<HLine s={s} p={D.CF_ENTRY.p} color={C.text} label="ENTRY" prog={1} dash="2 0" from={D.CF_ENTRY.i - 2} />
					<HLine s={s} p={D.CF_SL} color={C.red} label="SL" prog={1} from={D.CF_ENTRY.i - 2} />
					<HLine s={s} p={D.CF_TP} color={C.green} label="TP" prog={1} from={D.CF_ENTRY.i - 2} />
					<Tag x={s.x(28)} y={s.y(4416) - 34} text="CHoCH" color={C.gold} prog={1} />
				</>)}
			/>
		</div>
		<div style={{position: 'absolute', left: 40, top: 34, fontFamily: MONO, fontWeight: 700, fontSize: 34, color: C.gold, letterSpacing: 3}}>XAUUSD · STEP BY STEP</div>
		<div style={{position: 'absolute', right: 0, top: 210, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14}}>
			<div style={{background: C.gold, color: '#0B1630', fontWeight: 900, fontSize: 104, padding: '6px 34px 6px 40px', letterSpacing: -2, lineHeight: 1.05}}>ENTRY GOLD</div>
			<div style={{background: '#000', color: '#fff', fontWeight: 900, fontSize: 104, padding: '6px 34px 6px 40px', letterSpacing: -2, lineHeight: 1.05}}>LO TELAT<span style={{color: '#FF2D2D'}}>?</span></div>
		</div>
		<div style={{position: 'absolute', right: 40, bottom: 40, fontWeight: 700, fontSize: 34, color: C.text}}>@dhirajkelly</div>
	</AbsoluteFill>
);
