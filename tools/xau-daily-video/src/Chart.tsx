import React from 'react';
import {interpolate, Easing} from 'remotion';

export const C = {
  bg1: '#0C1320', bg2: '#0B1E2C', teal: '#2EB5C4', gold: '#C9A24A',
  red: '#EF4444', green: '#22C55E', grey: '#94A3B8', white: '#F8FAFC',
  bull: '#26A69A', bear: '#EF5350',
};

export type Series = {o: number[]; h: number[]; l: number[]; c: number[]};

export type HLine = {
  price: number; color: string; label: string; dashed?: boolean;
  progress: number; // 0..1 draw-in
  glow?: boolean;
  below?: boolean;
};

export type Zone = {from: number; to: number; color: string; opacity: number; label?: string; xStart?: number};

type Props = {
  w: number; h: number; s: Series;
  yMin: number; yMax: number;
  reveal: number; // number of candles visible (float)
  extraSlots?: number; // empty future slots on right
  lines?: {values: number[]; color: string; width: number; progress: number; label?: string}[];
  hlines?: HLine[];
  zones?: Zone[];
  markers?: {i: number; p: number; type: 'H' | 'L'; label: string; pop: number}[];
  path?: {pts: [number, number][]; progress: number; color: string}; // [slotIndex, price]
  title?: string;
};

export const CandleChart: React.FC<Props> = ({
  w, h, s, yMin, yMax, reveal, extraSlots = 0, lines = [], hlines = [], zones = [], markers = [], path, title,
}) => {
  const n = s.c.length;
  const padR = 150, padL = 20, padT = 30, padB = 30;
  const slots = n + extraSlots;
  const cw = (w - padL - padR) / slots;
  const x = (i: number) => padL + cw * (i + 0.5);
  const y = (p: number) => padT + (1 - (p - yMin) / (yMax - yMin)) * (h - padT - padB);
  const grid = [] as number[];
  const step = niceStep((yMax - yMin) / 6);
  for (let g = Math.ceil(yMin / step) * step; g <= yMax; g += step) grid.push(g);

  return (
    <svg width={w} height={h} style={{overflow: 'visible'}}>
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {grid.map((g) => (
        <g key={g}>
          <line x1={padL} x2={w - padR} y1={y(g)} y2={y(g)} stroke="rgba(148,163,184,0.12)" strokeWidth={1} />
          <text x={w - padR + 12} y={y(g) + 8} fill="rgba(148,163,184,0.7)" fontSize={22} fontFamily="Inter">
            {fmt(g, 0)}
          </text>
        </g>
      ))}
      {zones.map((z, k) => {
        const x0 = z.xStart !== undefined ? x(z.xStart) - cw / 2 : padL;
        return (
          <g key={k}>
            <rect x={x0} width={w - padR - x0} y={y(Math.max(z.from, z.to))}
              height={Math.abs(y(z.from) - y(z.to))} fill={z.color} opacity={z.opacity} />
            {z.label && z.opacity > 0.05 ? (
              <text x={x0 + 14} y={(y(z.from) + y(z.to)) / 2 + 10} fill={C.white} fontSize={28}
                fontWeight={800} fontFamily="Montserrat" opacity={Math.min(1, z.opacity * 4)}>{z.label}</text>
            ) : null}
          </g>
        );
      })}
      {s.c.map((c, i) => {
        const a = Math.max(0, Math.min(1, reveal - i));
        if (a <= 0) return null;
        const o = s.o[i];
        const up = c >= o;
        const col = up ? C.bull : C.bear;
        const bodyTop = y(Math.max(o, c));
        const bodyH = Math.max(2, Math.abs(y(o) - y(c)));
        const grow = Easing.out(Easing.cubic)(a);
        const mid = (bodyTop + bodyTop + bodyH) / 2;
        return (
          <g key={i} opacity={a}>
            <line x1={x(i)} x2={x(i)} y1={mid + (y(s.h[i]) - mid) * grow} y2={mid + (y(s.l[i]) - mid) * grow}
              stroke={col} strokeWidth={Math.max(1.5, cw * 0.12)} />
            <rect x={x(i) - cw * 0.36} width={cw * 0.72} y={mid - (bodyH / 2) * grow} height={bodyH * grow} fill={col} rx={1} />
          </g>
        );
      })}
      {lines.map((ln, k) => {
        const m = Math.max(1, Math.floor(ln.progress * ln.values.length));
        const d = ln.values.slice(0, m).map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ');
        const last = ln.values[m - 1];
        return (
          <g key={k}>
            <path d={d} fill="none" stroke={ln.color} strokeWidth={ln.width} strokeLinejoin="round" />
            {ln.label && ln.progress > 0.98 ? (
              <g>
                <rect x={w - padR + 4} y={y(last) - 20} width={140} height={40} rx={8} fill={ln.color} />
                <text x={w - padR + 74} y={y(last) + 9} textAnchor="middle" fill="#0B1220" fontSize={22}
                  fontWeight={800} fontFamily="Inter">{ln.label}</text>
              </g>
            ) : null}
          </g>
        );
      })}
      {hlines.map((hl, k) => {
        if (hl.progress <= 0) return null;
        const x2 = padL + (w - padR - padL) * Easing.out(Easing.cubic)(Math.min(1, hl.progress));
        return (
          <g key={k} filter={hl.glow ? 'url(#glow)' : undefined}>
            <line x1={padL} x2={x2} y1={y(hl.price)} y2={y(hl.price)} stroke={hl.color} strokeWidth={4}
              strokeDasharray={hl.dashed ? '16 12' : undefined} />
            {hl.progress > 0.6 ? (
              <g opacity={interpolate(hl.progress, [0.6, 1], [0, 1], {extrapolateRight: 'clamp'})}>
                <rect x={w - padR + 4} y={y(hl.price) - 22} width={140} height={44} rx={8} fill={hl.color} />
                <text x={w - padR + 74} y={y(hl.price) + 9} textAnchor="middle" fill="#0B1220" fontSize={23}
                  fontWeight={800} fontFamily="Inter">{fmt(hl.price, 1)}</text>
                <text x={padL + 10} y={y(hl.price) + (hl.below ? 34 : -14)} fill={hl.color} fontSize={26} fontWeight={800}
                  fontFamily="Montserrat">{hl.label}</text>
              </g>
            ) : null}
          </g>
        );
      })}
      {path && path.progress > 0 ? (() => {
        const pts = path.pts;
        const segs = pts.length - 1;
        const prog = path.progress * segs;
        const out: string[] = [];
        for (let k = 0; k <= Math.min(segs, Math.floor(prog)); k++) {
          out.push(`${k === 0 ? 'M' : 'L'}${x(pts[k][0])},${y(pts[k][1])}`);
        }
        const kk = Math.floor(prog);
        if (kk < segs) {
          const f = prog - kk;
          const xa = x(pts[kk][0]) + (x(pts[kk + 1][0]) - x(pts[kk][0])) * f;
          const ya = y(pts[kk][1]) + (y(pts[kk + 1][1]) - y(pts[kk][1])) * f;
          out.push(`L${xa},${ya}`);
        }
        return <path d={out.join(' ')} fill="none" stroke={path.color} strokeWidth={6} strokeDasharray="14 10"
          strokeLinecap="round" filter="url(#glow)" />;
      })() : null}
      {markers.map((mk, k) => {
        if (mk.pop <= 0) return null;
        const sc = mk.pop;
        const yy = y(mk.p) + (mk.type === 'H' ? -46 : 46);
        const col = mk.type === 'H' ? C.red : C.teal;
        return (
          <g key={k} transform={`translate(${x(mk.i)},${yy}) scale(${sc})`}>
            <rect x={-92} y={-24} width={184} height={48} rx={24} fill={col} />
            <text x={0} y={9} textAnchor="middle" fill="#0B1220" fontSize={24} fontWeight={800} fontFamily="Montserrat">{mk.label}</text>
          </g>
        );
      })}
      {title ? (
        <text x={padL + 6} y={padT + 6} fill="rgba(248,250,252,0.55)" fontSize={24} fontWeight={700} fontFamily="Inter">{title}</text>
      ) : null}
    </svg>
  );
};

function niceStep(raw: number) {
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const r = raw / p;
  return (r < 1.5 ? 1 : r < 3 ? 2 : r < 7 ? 5 : 10) * p;
}

export function fmt(v: number, d = 1) {
  return v.toLocaleString('id-ID', {minimumFractionDigits: d, maximumFractionDigits: d});
}
