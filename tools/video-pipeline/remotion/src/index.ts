import React from 'react';
import {Composition, registerRoot, staticFile} from 'remotion';
import {Main, FPS, layout, SceneT} from './Main';
import {Thumb} from './Thumb';
import {End} from './End';
import timings from '../public/timings.json';

const scenes = timings as unknown as SceneT[];
const L = layout(scenes);
const total = Math.round((L[L.length - 1].start + L[L.length - 1].len) * FPS);

const Root: React.FC = () =>
	React.createElement(React.Fragment, null, React.createElement(Composition, {id: 'End', component: End, durationInFrames: 600, fps: 30, width: 1920, height: 1080}), React.createElement(Composition, {id: 'Thumb', component: Thumb, durationInFrames: 1, fps: 30, width: 1280, height: 720}), React.createElement(Composition, {
		id: 'Main',
		component: Main as any,
		durationInFrames: total,
		fps: FPS,
		width: 1920,
		height: 1080,
		defaultProps: {scenes},
	}));

registerRoot(Root);
void staticFile;
