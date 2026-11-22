import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {XauPlan} from './Video';
import timing from '../public/timing.json';

const Root: React.FC = () => (
  <Composition id="XauPlan" component={XauPlan} durationInFrames={Math.ceil((timing as {total: number}).total * 30)}
    fps={30} width={1080} height={1920} />
);

registerRoot(Root);
