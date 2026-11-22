import React from 'react';
import {AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, Sequence} from 'remotion';
import {CandleChart, C, fmt} from './Chart';
import data from '../public/data.json';
import timing from '../public/timing.json';

const FPS = 30;
type Word = {w: string; s: number; e: number};
const T = timing as {
  total: number; s1: number; s2: number; s3: number; s4: number; rule: number; disc: number;
  words: Word[]; host: [number, number][]; cues: Record<string, number>;
};
const f = (sec: number) => Math.round(sec * FPS);
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const ramp = (fr: number, a: number, b: number) =>
  interpolate(fr, [f(a), f(b)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

type Plan = {dir: 'BUY' | 'SELL'; trigger: string; triggerShort: string; entry: number; sl: number; tp: number; expiry: string; path: [number, number][]};
const D = data as unknown as {plan: Plan | null; bias: string; noTradeReason: string; hook: {line1: string; accent: string; line2: string}};
const plan = D.plan;
const H = D.hook;
const BIAS = D.bias === 'bullish' ? {color: C.green, note: 'Cuma cari BUY'} : D.bias === 'bearish' ? {color: C.red, note: 'Cuma cari SELL'} : {color: '#64748B', note: 'Struktur vs EMA200 bentrok'};
const risk = data.risk;
const riskUsd = (risk.equity * risk.pct) / 100;
const dist = plan ? Math.abs(plan.sl - plan.entry) : 0;
const perLot = dist * risk.contract;
const costPerLot = (risk as {costPerLot?: number}).costPerLot ?? 0;
const lotRaw = perLot > 0 ? riskUsd / (perLot + costPerLot) : 0;
const lot = Math.floor(lotRaw / risk.lotStep + 1e-9) * risk.lotStep;

export const XauPlan: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const scene = t < T.s1 ? 0 : t < T.s2 ? 1 : t < T.s3 ? 2 : t < T.s4 ? 3 : t < T.rule ? 4 : t < T.disc ? 5 : 6;
  const hostOn = T.host.some(([a, b]) => t >= a && t <= b);

  return (
    <AbsoluteFill style={{background: `linear-gradient(170deg, ${C.bg1} 0%, ${C.bg2} 55%, #0A2630 100%)`, fontFamily: 'Inter'}}>
      <Grid />
      <Glow frame={frame} />
      <TopBar frame={frame} />
      {scene === 0 && <Hook frame={frame} />}
      {scene >= 1 && scene <= 5 && <StepTitle frame={frame} scene={scene} />}
      {scene === 1 && <TrendScene frame={frame} />}
      {(scene === 2 || scene === 3) && <M5Scene frame={frame} scene={scene} />}
      {scene === 4 && <RiskScene frame={frame} />}
      {scene === 5 && <RuleScene frame={frame} />}
      {scene === 6 && <Disclaimer frame={frame} />}
      <Captions t={t} lifted={hostOn || scene === 6} />
      <Flash frame={frame} />
      <Audio src={staticFile('vo.mp3')} />
      <Audio src={staticFile('bed.mp3')} volume={0.12} />
      <Audio src={staticFile('sfx.wav')} volume={0.55} />
    </AbsoluteFill>
  );
};

const Grid: React.FC = () => (
  <AbsoluteFill style={{
    backgroundImage: 'linear-gradient(rgba(46,181,196,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(46,181,196,0.06) 1px, transparent 1px)',
    backgroundSize: '54px 54px',
  }} />
);

const Glow: React.FC<{frame: number}> = ({frame}) => (
  <div style={{position: 'absolute', width: 900, height: 900, borderRadius: 450, left: -200 + Math.sin(frame / 90) * 60,
    top: 300 + Math.cos(frame / 120) * 80, background: 'radial-gradient(circle, rgba(46,181,196,0.18), transparent 65%)'}} />
);

const TopBar: React.FC<{frame: number}> = ({frame}) => {
  const a = ramp(frame, 0, 0.6);
  return (
    <div style={{position: 'absolute', top: 70, left: 50, right: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: a}}>
      <div style={{display: 'flex', gap: 14, alignItems: 'center'}}>
        <Pill bg="rgba(46,181,196,0.15)" color={C.teal} border={C.teal}>XAUUSD · H1 + M5</Pill>
        <Pill bg="rgba(201,162,74,0.18)" color={C.gold} border={C.gold}>{data.meta.badge}</Pill>
      </div>
      <Pill bg="rgba(248,250,252,0.08)" color={C.white} border="rgba(248,250,252,0.3)">@dhirajkelly</Pill>
    </div>
  );
};

const Pill: React.FC<{bg: string; color: string; border: string; children: React.ReactNode; size?: number}> = ({bg, color, border, children, size = 26}) => (
  <div style={{background: bg, color, border: `2px solid ${border}`, borderRadius: 40, padding: '10px 22px', fontSize: size, fontWeight: 800, letterSpacing: 0.5}}>{children}</div>
);

const Card: React.FC<{top: number; height: number; children: React.ReactNode; style?: React.CSSProperties}> = ({top, height, children, style}) => (
  <div style={{position: 'absolute', left: 40, right: 40, top, height, borderRadius: 32, background: 'rgba(15,30,45,0.72)',
    border: '2px solid rgba(46,181,196,0.25)', boxShadow: '0 30px 80px rgba(0,0,0,0.45)', overflow: 'hidden', ...style}}>{children}</div>
);

const Hook: React.FC<{frame: number}> = ({frame}) => {
  const {fps} = useVideoConfig();
  const s1 = spring({frame: frame - 3, fps, config: {damping: 14}});
  const s2 = spring({frame: frame - f(1.4), fps, config: {damping: 12}});
  const s3 = spring({frame: frame - f(T.cues.hook2 ?? 3), fps, config: {damping: 14}});
  const h1 = data.h1;
  return (
    <>
      <div style={{position: 'absolute', top: 210, left: 60, right: 60, transform: `translateY(${(1 - s1) * 60}px)`, opacity: s1}}>
        <div style={{color: C.white, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 92, lineHeight: 1.02}}>
          {H.line1}<br /><span style={{color: C.teal}}>{H.accent}</span> {H.line2}
        </div>
      </div>
      <Card top={520} height={470} style={{transform: `scale(${0.9 + 0.1 * s2})`, opacity: s2}}>
        <div style={{position: 'absolute', left: 20, top: 20}}>
          <CandleChart w={960} h={430} s={h1} yMin={Math.min(...h1.l) - 10} yMax={Math.max(...h1.h) + 10} reveal={interpolate(frame, [f(1.4), f(3.4)], [0, 60], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} title="XAUUSD H1 · OANDA" />
        </div>
      </Card>
      <div style={{position: 'absolute', top: 1010, left: 60, right: 60, opacity: s3, transform: `translateY(${(1 - s3) * 40}px)`}}>
        <div style={{color: C.white, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 52}}>
          Cara gua bikin <span style={{background: '#FACC15', color: '#0B1220', padding: '0 12px', borderRadius: 8}}>trading plan</span>
        </div>
        <div style={{color: C.grey, fontSize: 36, marginTop: 10, fontWeight: 600}}>Tren → Entry → SL/TP → RR → Risiko</div>
      </div>
    </>
  );
};

const STEP_TITLES = ['', 'TENTUIN TREN · H1', 'TITIK ENTRY · M5', 'STOP LOSS & TAKE PROFIT', 'RR & RISIKO PER TRADE', 'ATURAN WAJIB'];

const StepTitle: React.FC<{frame: number; scene: number}> = ({frame, scene}) => {
  const {fps} = useVideoConfig();
  const start = [0, T.s1, T.s2, T.s3, T.s4, T.rule][scene];
  const s = spring({frame: frame - f(start), fps, config: {damping: 15}});
  return (
    <div style={{position: 'absolute', top: 175, left: 50, right: 50, display: 'flex', alignItems: 'center', gap: 22,
      transform: `translateX(${(1 - s) * -80}px)`, opacity: s}}>
      {scene <= 4 ? (
        <div style={{width: 96, height: 96, borderRadius: 24, background: C.teal, color: '#0B1220', fontFamily: 'Montserrat',
          fontWeight: 900, fontSize: 60, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{scene}</div>
      ) : null}
      <div>
        <div style={{color: C.grey, fontSize: 26, fontWeight: 700, letterSpacing: 3}}>{scene <= 4 ? `LANGKAH ${scene}` : 'INGET'}</div>
        <div style={{color: C.white, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 54}}>{STEP_TITLES[scene]}</div>
      </div>
    </div>
  );
};

const TrendScene: React.FC<{frame: number}> = ({frame}) => {
  const {fps} = useVideoConfig();
  const a = T.s1;
  const cue = T.cues;
  const h1 = data.h1;
  const reveal = interpolate(frame, [f(a), f(a + 2.2)], [0, 60], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const emaP = ramp(frame, cue.ema ?? a + 2, (cue.ema ?? a + 2) + 1.2);
  const pop = (sec: number) => spring({frame: frame - f(sec), fps, config: {damping: 11}});
  const swingT = cue.swing ?? a + 4;
  const biasT = cue.bias ?? a + 7;
  const invT = cue.inv ?? a + 9;
  const biasS = pop(biasT);
  return (
    <>
      <Card top={330} height={900}>
        <div style={{position: 'absolute', left: 20, top: 20}}>
          <CandleChart w={960} h={860} s={h1} yMin={data.h1.yRange[0]} yMax={Math.max(data.h1.yRange[1], Math.max(...h1.ema200) + 10)} reveal={reveal}
            lines={[{values: h1.ema200, color: C.gold, width: 5, progress: emaP, label: 'EMA200'}]}
            hlines={[{price: h1.invalidation, color: C.red, label: 'BATAL kalau H1 close di atas', dashed: true, progress: ramp(frame, invT, invT + 0.8)}]}
            markers={h1.swings.map((sw, k) => ({i: sw.i, p: sw.p, type: sw.type as 'H' | 'L', label: sw.label, pop: pop(swingT + k * 0.35)}))}
            title="H1 · OANDA:XAUUSD" />
        </div>
      </Card>
      <div style={{position: 'absolute', top: 1260, left: 50, right: 50, display: 'flex', gap: 18, transform: `scale(${biasS})`, transformOrigin: 'left center'}}>
        <Pill bg={BIAS.color} color="#fff" border={BIAS.color} size={34}>BIAS: {data.bias.toUpperCase()}</Pill>
        <Pill bg="rgba(248,250,252,0.08)" color={C.white} border={BIAS.color} size={30}>{BIAS.note}</Pill>
      </div>
    </>
  );
};

const M5Scene: React.FC<{frame: number; scene: number}> = ({frame, scene}) => {
  const {fps} = useVideoConfig();
  const m = data.m5;
  const cue = T.cues;
  const a = T.s2;
  const n = m.c.length;
  const reveal = interpolate(frame, [f(a), f(a + 1.8)], [0, n], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const lineP = ramp(frame, cue.ind ?? a + 2, (cue.ind ?? a + 2) + 1.2);
  const keyT = cue.key ?? a + 3;
  const trigT = cue.trig ?? a + 5;
  const entT = cue.entry ?? a + 9;
  const slT = cue.sl ?? T.s3 + 1;
  const tpT = cue.tp ?? T.s3 + 5;
  const extra = 30;
  const pathPts: [number, number][] = plan ? plan.path.map(([di, p]) => [n - 1 + di, p] as [number, number]) : [];
  const [r0, r1] = m.yRange;
  const [p0, p1] = plan ? m.yRangePlan : m.yRange;
  const yScale = scene === 3 ? spring({frame: frame - f(T.s3), fps, config: {damping: 18}}) : 0;
  const yMinA = r0 + (p0 - r0) * yScale;
  const yMax = r1 + (p1 - r1) * yScale;
  const zoneA = scene === 3 ? ramp(frame, slT, slT + 0.8) : 0;
  const zoneB = scene === 3 ? ramp(frame, tpT, tpT + 0.8) : 0;
  return (
    <>
      <Card top={330} height={900}>
        <div style={{position: 'absolute', left: 20, top: 20}}>
          <CandleChart w={960} h={860} s={m} yMin={yMinA} yMax={yMax} reveal={reveal} extraSlots={extra}
            lines={[
              {values: m.vwap, color: '#A78BFA', width: 4, progress: lineP, label: 'VWAP'},
              {values: m.ema9, color: C.teal, width: 4, progress: lineP, label: 'EMA9'},
            ]}
            zones={!plan ? [] : [
              {from: plan.entry, to: plan.sl, color: C.red, opacity: zoneA * 0.28, label: `SL ${fmt(plan.sl, 0)} · risiko $${fmt(dist, 0)}`, xStart: n},
              {from: plan.tp, to: plan.entry, color: C.green, opacity: zoneB * 0.26, label: `TP ${fmt(plan.tp, 0)} · 2× risiko`, xStart: n},
            ]}
            hlines={[
              {price: m.keyLevel, color: C.gold, label: m.keyLabel, progress: ramp(frame, keyT, keyT + 0.8), glow: true, below: true},
              ...(plan ? [{price: plan.entry, color: C.white, label: `ENTRY ${plan.dir}`, dashed: true, progress: ramp(frame, entT, entT + 0.7)}] : []),
            ]}
            path={plan ? {pts: pathPts, progress: scene === 3 ? 1 : ramp(frame, trigT, trigT + 3), color: '#FACC15'} : undefined}
            title={!plan ? 'M5 · cek breakout + retest' : scene === 3 ? `M5 · posisi ${plan.dir} (skenario)` : 'M5 · tunggu breakout + retest'} />
        </div>
      </Card>
      {!plan ? (
        <div style={{position: 'absolute', top: 1255, left: 50, right: 50, display: 'flex', gap: 14, opacity: ramp(frame, trigT, trigT + 0.6)}}>
          <Pill bg={C.red} color="#fff" border={C.red} size={32}>NO TRADE</Pill>
          <Pill bg="rgba(248,250,252,0.08)" color={C.white} border="rgba(248,250,252,0.4)" size={26}>{data.noTradeReason}</Pill>
        </div>
      ) : scene === 2 ? (
        <div style={{position: 'absolute', top: 1255, left: 50, right: 50, opacity: ramp(frame, trigT, trigT + 0.6)}}>
          <Pill bg="rgba(250,204,21,0.12)" color="#FDE68A" border="#FACC15" size={28}>TRIGGER: {plan.triggerShort}</Pill>
        </div>
      ) : (
        <div style={{position: 'absolute', top: 1255, left: 50, right: 50, display: 'flex', gap: 14}}>
          <Pill bg="rgba(239,68,68,0.15)" color="#FCA5A5" border={C.red} size={28}>SL {fmt(plan.sl, 0)}</Pill>
          <Pill bg="rgba(248,250,252,0.08)" color={C.white} border="rgba(248,250,252,0.4)" size={28}>Entry {fmt(plan.entry, 0)}</Pill>
          <Pill bg="rgba(34,197,94,0.15)" color="#86EFAC" border={C.green} size={28}>TP {fmt(plan.tp, 0)}</Pill>
        </div>
      )}
    </>
  );
};

const RiskScene: React.FC<{frame: number}> = ({frame}) => {
  const {fps} = useVideoConfig();
  const a = T.s4;
  const cue = T.cues;
  const rows: {label: string; value: string; at: number; hl?: boolean}[] = [
    {label: 'RR', value: '1 : 2', at: cue.rr ?? a + 0.5, hl: true},
    {label: `Ekuitas (${risk.account.split(' (')[0]})`, value: `$${fmt(risk.equity, 2)}`, at: cue.eq ?? a + 2},
    {label: `Risiko ${fmt(risk.pct, 1)}%`, value: `$${fmt(riskUsd, 2)}`, at: (cue.eq ?? a + 2) + 0.8},
    {label: `Risiko 1 lot = $${fmt(dist, 0)} × ${risk.contract} oz`, value: `$${fmt(perLot, 0)}`, at: cue.perlot ?? a + 6},
    {label: `Lot = ${fmt(riskUsd, 2)} ÷ ${fmt(perLot + costPerLot, 0)} = ${fmt(lotRaw, 3)}`, value: `${fmt(lot, 2)} lot`, at: cue.lot ?? a + 9, hl: true},
  ];
  if (!plan) rows.splice(0, rows.length,
    {label: `Ekuitas (${risk.account.split(' (')[0]})`, value: `$${fmt(risk.equity, 2)}`, at: a + 0.5},
    {label: `Anggaran risiko ${fmt(risk.pct, 1)}%`, value: `$${fmt(riskUsd, 2)}`, at: a + 1.5},
    {label: 'Dipakai hari ini (NO TRADE)', value: '$0', at: a + 3, hl: true});
  return (
    <Card top={360} height={1000}>
      <div style={{padding: '50px 50px'}}>
        {rows.map((r, k) => {
          const s = spring({frame: frame - f(r.at), fps, config: {damping: 14}});
          return (
            <div key={k} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px 0',
              borderBottom: k < rows.length - 1 ? '2px solid rgba(148,163,184,0.15)' : 'none', opacity: s, transform: `translateX(${(1 - s) * 60}px)`}}>
              <div style={{color: C.grey, fontSize: 34, fontWeight: 600, maxWidth: 560}}>{r.label}</div>
              <div style={{color: r.hl ? '#0B1220' : C.white, background: r.hl ? '#FACC15' : 'transparent', borderRadius: 12,
                padding: r.hl ? '6px 18px' : 0, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 52}}>{r.value}</div>
            </div>
          );
        })}
        <div style={{marginTop: 26, color: C.teal, fontSize: 32, fontWeight: 800, opacity: ramp(frame, (cue.lot ?? a + 9) + 1, (cue.lot ?? a + 9) + 1.6)}}>
          Selalu bulatkan lot KE BAWAH
        </div>
      </div>
    </Card>
  );
};

const RuleScene: React.FC<{frame: number}> = ({frame}) => {
  const {fps} = useVideoConfig();
  const a = T.rule;
  const s = spring({frame: frame - f(a + 0.2), fps, config: {damping: 12}});
  const strike = ramp(frame, (T.cues.batal ?? a + 2.5), (T.cues.batal ?? a + 2.5) + 0.5);
  return (
    <Card top={380} height={760}>
      <div style={{padding: 60, transform: `scale(${0.85 + 0.15 * s})`, opacity: s}}>
        <div style={{color: C.grey, fontSize: 38, fontWeight: 700}}>Harga udah lewat entry tanpa retest?</div>
        <div style={{position: 'relative', display: 'inline-block', marginTop: 40}}>
          <div style={{color: C.white, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 88}}>KEJAR HARGA</div>
          <div style={{position: 'absolute', left: 0, top: '52%', height: 12, width: `${strike * 100}%`, background: C.red, borderRadius: 6}} />
        </div>
        <div style={{marginTop: 50, display: 'inline-block', opacity: strike}}>
          <Pill bg={C.red} color="#fff" border={C.red} size={56}>SETUP BATAL</Pill>
        </div>
      </div>
    </Card>
  );
};

const Disclaimer: React.FC<{frame: number}> = ({frame}) => {
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - f(T.disc), fps, config: {damping: 15}});
  const cta = spring({frame: frame - f(T.cues.cta ?? T.disc + 4), fps, config: {damping: 12}});
  return (
    <>
      <Card top={260} height={560} style={{opacity: s, transform: `translateY(${(1 - s) * 40}px)`, borderColor: 'rgba(201,162,74,0.6)'}}>
        <div style={{padding: 54}}>
          <Pill bg="rgba(201,162,74,0.18)" color={C.gold} border={C.gold} size={28}>DISCLAIMER</Pill>
          <div style={{color: C.white, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 60, marginTop: 30, lineHeight: 1.1}}>
            Edukasi, <span style={{color: C.teal}}>bukan ajakan trading.</span>
          </div>
          <div style={{color: C.grey, fontSize: 34, marginTop: 24, lineHeight: 1.35, fontWeight: 600}}>
            Trading berleverage bisa bikin lo rugi dan kehilangan modal. Contoh di video ini skenario edukasi dari data {data.meta.dateLabel.replace('Data close ', '')}.
          </div>
        </div>
      </Card>
      <div style={{position: 'absolute', top: 860, left: 40, right: 40, textAlign: 'center', transform: `scale(${cta})`}}>
        <div style={{display: 'inline-block', background: C.teal, color: '#0B1220', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 46,
          padding: '24px 40px', borderRadius: 24}}>Join Komunitas Trading · dhirajkelly.id</div>
      </div>
    </>
  );
};

// caption chunks: max 4 words, never across a sentence/clause end
const CHUNKS: {start: number; len: number}[] = (() => {
  const out: {start: number; len: number}[] = [];
  let s = 0;
  T.words.forEach((w, i) => {
    const len = i - s + 1;
    if (len === 4 || /[.,:!?]$/.test(w.w) || i === T.words.length - 1) { out.push({start: s, len}); s = i + 1; }
  });
  return out;
})();

const Captions: React.FC<{t: number; lifted: boolean}> = ({t, lifted}) => {
  const words = T.words;
  let idx = words.findIndex((w) => t >= w.s && t < w.e + 0.15);
  if (idx < 0) {
    const nxt = words.findIndex((w) => w.s > t);
    idx = nxt > 0 ? nxt - 1 : -1;
    if (idx >= 0 && t - words[idx].e > 0.6) idx = -1;
  }
  if (idx < 0) return null;
  const chunk = CHUNKS.find((c) => idx >= c.start && idx < c.start + c.len)!;
  const group = chunk.start;
  const chunkWords = words.slice(group, group + chunk.len);
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top: lifted ? 1190 : 1440, textAlign: 'center',
      fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, lineHeight: 1.25, textShadow: '0 6px 18px rgba(0,0,0,0.6)'}}>
      {chunkWords.map((w, k) => {
        const active = group + k === idx;
        return (
          <span key={k} style={{color: active ? '#0B1220' : C.white, background: active ? '#FACC15' : 'transparent',
            borderRadius: 10, padding: '0 10px', margin: '0 4px', display: 'inline-block',
            transform: active ? 'scale(1.06)' : 'scale(1)'}}>{w.w.toUpperCase()}</span>
        );
      })}
    </div>
  );
};

const Flash: React.FC<{frame: number}> = ({frame}) => {
  const marks = [T.s1, T.s2, T.s3, T.s4, T.rule, T.disc];
  let o = 0;
  for (const m of marks) {
    const d = frame - f(m);
    if (d >= 0 && d < 8) o = Math.max(o, interpolate(d, [0, 2, 8], [0, 0.35, 0]));
  }
  return <AbsoluteFill style={{background: `radial-gradient(circle at 80% 20%, rgba(255,170,80,${o}), transparent 60%)`, pointerEvents: 'none'}} />;
};
