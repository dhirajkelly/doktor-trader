// Synthetic (SIMULASI) XAUUSD candle data. Deterministic.
export type Candle = {o: number; h: number; l: number; c: number; v: number};

const rng = (seed: number) => {
	let s = seed >>> 0;
	return () => {
		s = (s * 1664525 + 1013904223) >>> 0;
		return s / 4294967296;
	};
};

// anchors: [index, close]; closes are interpolated between anchors with noise.
export const build = (
	anchors: [number, number][],
	opts: {seed: number; noise: number; wick: number; overrides?: Record<number, Partial<Candle>>},
): Candle[] => {
	const r = rng(opts.seed);
	const n = anchors[anchors.length - 1][0] + 1;
	const closes: number[] = [];
	for (let i = 0; i < n; i++) {
		let k = 0;
		while (k < anchors.length - 1 && anchors[k + 1][0] < i) k++;
		const [i0, p0] = anchors[k];
		const [i1, p1] = anchors[Math.min(k + 1, anchors.length - 1)];
		const t = i1 === i0 ? 0 : (i - i0) / (i1 - i0);
		const base = p0 + (p1 - p0) * t;
		const isAnchor = anchors.some((a) => a[0] === i);
		closes.push(isAnchor ? base : base + (r() - 0.5) * 2 * opts.noise);
	}
	const out: Candle[] = [];
	for (let i = 0; i < n; i++) {
		const o = i === 0 ? closes[0] - opts.noise * 0.5 : closes[i - 1];
		const c = closes[i];
		const h = Math.max(o, c) + r() * opts.wick;
		const l = Math.min(o, c) - r() * opts.wick;
		const v = 0.6 + r() * 0.8 + Math.abs(c - o) / (opts.noise + 0.01) * 0.3;
		out.push({o, h, l, c, v, ...(opts.overrides?.[i] ?? {})});
	}
	return out;
};

export const vwap = (cs: Candle[]) => {
	let pv = 0;
	let vv = 0;
	return cs.map((c) => {
		const tp = (c.h + c.l + c.c) / 3;
		pv += tp * c.v;
		vv += c.v;
		return pv / vv;
	});
};

export const ema = (cs: Candle[], n = 9) => {
	const k = 2 / (n + 1);
	let e = cs[0].c;
	return cs.map((c) => (e = c.c * k + e * (1 - k)));
};

// ---- datasets ----
// Hook: rally, late buy at top, drop, late sell at bottom, bounce
export const HOOK = build(
	[[0, 4380], [12, 4386], [30, 4404], [42, 4418], [46, 4416], [58, 4392], [62, 4394], [72, 4410]],
	{seed: 3, noise: 1.6, wick: 1.4},
);
export const HOOK_LATE_BUY = 42;
export const HOOK_LATE_SELL = 58;

// Trend: up / down / chop (M15)
export const TREND_UP = build([[0, 4380], [10, 4384], [25, 4398], [40, 4408], [55, 4420]], {seed: 11, noise: 1.8, wick: 1.5});
export const TREND_DOWN = build([[0, 4420], [12, 4414], [28, 4400], [42, 4392], [55, 4380]], {seed: 12, noise: 1.8, wick: 1.5});
export const TREND_CHOP = build(
	[[0, 4400], [6, 4404], [12, 4397], [18, 4405], [24, 4398], [30, 4404], [36, 4397], [42, 4403], [48, 4398], [55, 4401]],
	{seed: 13, noise: 1.2, wick: 1.6},
);

// Area: uptrend, OB (red candle) at 24, impulse 25-27 leaves FVG, continue, pullback into zone, bounce
const areaOv: Record<number, Partial<Candle>> = {
	24: {o: 4394.6, c: 4392.4, h: 4395.0, l: 4391.6},
	25: {o: 4392.4, c: 4397.8, h: 4398.1, l: 4392.1},
	26: {o: 4397.8, c: 4404.6, h: 4405.0, l: 4397.5},
	27: {o: 4404.6, c: 4408.2, h: 4409.0, l: 4403.9},
};
export const AREA = build(
	[[0, 4382], [10, 4386], [20, 4392], [23, 4394.6], [24, 4392.4], [27, 4408.2], [33, 4413], [36, 4410], [42, 4397.4], [44, 4396.6], [48, 4404], [56, 4416]],
	{seed: 21, noise: 1.2, wick: 1.0, overrides: areaOv},
);
export const AREA_OB = 24;
// FVG between candle 25 high (4398.1) and candle 27 low (4403.9) -> but overlap zone with OB uses candle 25
export const AREA_FVG = {lo: 4398.1, hi: 4403.9, from: 25};
export const AREA_OB_ZONE = {lo: 4391.6, hi: 4395.0};
// For the "best area" we use OB top to FVG low region (overlap band as taught visually)
export const AREA_ZONE = {lo: 4394.0, hi: 4399.2};
export const AREA_RETURN = 42;

// Confirm (M1): lower highs into zone, CHoCH break, FVG, retest entry
const cfOv: Record<number, Partial<Candle>> = {
	31: {o: 4407.0, c: 4409.6, h: 4409.9, l: 4406.8},
	32: {o: 4409.6, c: 4413.8, h: 4414.1, l: 4409.3},
	33: {o: 4413.8, c: 4415.4, h: 4416.2, l: 4411.6},
};
export const CONFIRM = build(
	[[0, 4420], [5, 4423.5], [10, 4417], [14, 4420.4], [19, 4413], [22, 4415.6], [27, 4408.2], [30, 4407.0], [31, 4409.6], [33, 4415.4], [36, 4413.0], [38, 4412.4], [41, 4414.5], [50, 4424]],
	{seed: 31, noise: 0.7, wick: 0.7, overrides: cfOv},
);
export const CF_ZONE = {lo: 4404.5, hi: 4409.5};
export const CF_LH = [{i: 5, p: 4423.9}, {i: 14, p: 4420.8}, {i: 22, p: 4416.0}];
export const CF_LOW = {i: 29, p: 4407.5 - 0.0};
export const CF_FVG = {lo: 4409.9, hi: 4411.6, from: 31}; // c31 high .. c33 low
export const CF_ENTRY = {i: 38, p: 4412.5};
export const CF_SL = 4407.5;
export const CF_TP = 4422.5;

// Loss example: same structure, after entry price drops through SL
export const LOSS = build(
	[[0, 4420], [5, 4423.5], [10, 4417], [14, 4420.4], [19, 4413], [22, 4415.6], [27, 4408.2], [30, 4407.0], [31, 4409.6], [33, 4415.4], [36, 4413.0], [38, 4412.4], [40, 4414.2], [43, 4411.0], [47, 4405.8], [52, 4401]],
	{seed: 31, noise: 0.7, wick: 0.7, overrides: cfOv},
);
export const LOSS_HIT = 46;
