import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { BREAKEVEN, EQUITY, MODELS, fmtMoney } from "../data";
import { useCountUp, usePrefersReducedMotion, useReveal } from "../hooks";
import { Crowd, Pulse, Scale, Target } from "../icons";
import { Reveal, SectionHead } from "./Chrome";

/* ---------------- shared slider ---------------- */

function Slider({
  label,
  display,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  display: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (n: number) => void;
}) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline justify-between">
        <span className="font-mono text-[10px] tracking-[0.16em] text-dim uppercase">{label}</span>
        <span className="font-mono text-[13px] font-bold text-gold tabular-nums">{display}</span>
      </span>
      <input
        type="range"
        className="qslider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--fill": `${fill}%` } as CSSProperties}
      />
    </label>
  );
}

/* ---------------- Kelly calculator ---------------- */

export function KellyCalc() {
  const [bankroll, setBankroll] = useState(5000);
  const [dec, setDec] = useState(1.91);
  const [prob, setProb] = useState(55.2);

  const p = prob / 100;
  const breakeven = 100 / dec;
  const ev = (p * dec - 1) * 100;
  const kellyPct = Math.max(0, ((p * dec - 1) / (dec - 1)) * 100);
  const stake = (frac: number) => Math.max(0, Math.floor((bankroll * (kellyPct / 100) * frac) / 5) * 5);
  const positive = ev > 0;
  const meterPos = (Math.min(kellyPct, 15) / 15) * 100;

  return (
    <Reveal>
      <section className="h-full border border-line bg-panel p-6 md:p-7">
        <div className="flex items-center gap-3">
          <Scale className="h-5 w-5 text-gold" />
          <h3 className="font-display text-lg font-bold tracking-wider text-ink uppercase">
            Kelly Sizer <span className="text-dim">— the edge formula</span>
          </h3>
        </div>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <Slider
              label="Bankroll"
              display={fmtMoney(bankroll)}
              min={500}
              max={25000}
              step={250}
              value={bankroll}
              onChange={setBankroll}
            />
            <Slider
              label="Decimal odds"
              display={dec.toFixed(2)}
              min={1.4}
              max={4}
              step={0.01}
              value={dec}
              onChange={setDec}
            />
            <Slider
              label="Your model probability"
              display={`${prob.toFixed(1)}%`}
              min={35}
              max={75}
              step={0.1}
              value={prob}
              onChange={setProb}
            />
            {/* allocation pressure meter */}
            <div>
              <span className="mb-2 flex justify-between font-mono text-[10px] tracking-[0.16em] text-dim uppercase">
                <span>Allocation pressure</span>
                <span className={kellyPct > 10 ? "text-blood" : "text-muted"}>{kellyPct.toFixed(1)}% FULL KELLY</span>
              </span>
              <div className="relative h-3 w-full bg-line/70">
                <span className="absolute inset-y-0 left-0 w-1/3 bg-grass/25" />
                <span className="absolute inset-y-0 left-1/3 w-1/3 bg-gold/25" />
                <span className="absolute inset-y-0 left-2/3 right-0 bg-blood/25" />
                <span
                  className="absolute top-[-3px] h-[18px] w-[3px] bg-ink transition-[left] duration-300"
                  style={{ left: `calc(${meterPos}% - 1px)` }}
                />
              </div>
              <div className="mt-1 flex justify-between font-mono text-[9px] text-dim">
                <span>0%</span>
                <span>5%</span>
                <span>10%</span>
                <span>15%+</span>
              </div>
            </div>
          </div>

          <div
            className={`flex flex-col justify-between border p-5 transition-colors duration-300 ${
              positive ? "border-grass/40 bg-grass/[0.05]" : "border-blood/50 bg-blood/[0.07]"
            }`}
          >
            {positive ? (
              <>
                <div className="grid grid-cols-2 gap-px bg-line">
                  {[
                    { k: "Break-even", v: `${breakeven.toFixed(1)}%`, c: "text-muted" },
                    { k: "Expected value", v: `+${ev.toFixed(2)}%`, c: "text-grass" },
                    { k: "Full Kelly", v: fmtMoney(stake(1)), c: "text-ink" },
                    { k: "Half Kelly", v: fmtMoney(stake(0.5)), c: "text-ink" },
                  ].map((o) => (
                    <div key={o.k} className="bg-panel2 p-3">
                      <p className="font-mono text-[9px] tracking-[0.16em] text-dim uppercase">{o.k}</p>
                      <p className={`mt-1 font-mono text-[15px] font-bold tabular-nums ${o.c}`}>{o.v}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <p className="font-mono text-[10px] leading-relaxed text-dim">
                    SUGGESTED STAKE
                    <br />
                    <span className="text-muted">¼ KELLY — THE DESK STANDARD</span>
                  </p>
                  <p className="font-display text-3xl font-bold text-gold tabular-nums">{fmtMoney(stake(0.25))}</p>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-8 text-center">
                <p className="font-display text-2xl font-bold tracking-wider text-blood uppercase">No bet</p>
                <p className="max-w-[220px] font-mono text-[11px] leading-relaxed text-muted">
                  Model {prob.toFixed(1)}% sits below the {breakeven.toFixed(1)}% break-even wall.
                  EV is <span className="text-blood">{ev.toFixed(2)}%</span>. Sitting is a position.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Reveal>
  );
}

/* ---------------- public vs sharp ---------------- */

export function PublicSharp() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const tickets = 68;
  const handle = 44;
  return (
    <Reveal>
      <section ref={ref} className="flex h-full flex-col border border-line bg-panel p-6 md:p-7">
        <div className="flex items-center gap-3">
          <Crowd className="h-5 w-5 text-ice" />
          <h3 className="font-display text-lg font-bold tracking-wider text-ink uppercase">
            Public vs Sharp <span className="text-dim">— BUF @ KC</span>
          </h3>
        </div>
        <p className="mt-2 font-mono text-[11px] text-dim">
          KC -2.5 · Tickets = bet count · Handle = money volume
        </p>

        <div className="mt-6 space-y-5">
          {[
            { label: "PUBLIC TICKETS", val: tickets, cls: "bg-ice/70", txt: "text-ice", note: "squares love the Chiefs" },
            { label: "SHARP HANDLE", val: handle, cls: "bg-gold", txt: "text-gold", note: "pros lean Buffalo +2.5" },
          ].map((row) => (
            <div key={row.label}>
              <div className="mb-1.5 flex justify-between font-mono text-[10px] tracking-[0.16em] uppercase">
                <span className="text-dim">{row.label}</span>
                <span className={`font-bold ${row.txt} tabular-nums`}>{row.val}%</span>
              </div>
              <div className="h-5 w-full border border-line bg-panel2 p-[3px]">
                <div
                  className={`h-full ${row.cls} transition-[width] duration-1000 ease-out`}
                  style={{ width: inView ? `${row.val}%` : "0%" }}
                />
              </div>
              <p className="mt-1 font-mono text-[9px] text-dim">{row.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-auto space-y-3 pt-6">
          <div className="flex items-center gap-3 border border-gold/40 bg-gold/[0.07] px-4 py-3">
            <Target className="h-5 w-5 shrink-0 text-gold" />
            <p className="font-mono text-[11px] leading-relaxed text-muted">
              <span className="font-bold text-gold">−24PT DIVERGENCE.</span> Line hasn't moved toward
              the public side — a reverse-line signal. Smart money is on the dog.
            </p>
          </div>
          <p className="font-mono text-[10px] leading-relaxed text-dim">
            RULE: when 70%+ of tickets pile on one side and the handle disagrees, the book is
            inviting you to be the loser. Fade accordingly.
          </p>
        </div>
      </section>
    </Reveal>
  );
}

/* ---------------- equity curve ---------------- */

export function EquityCurve() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const pathRef = useRef<SVGPathElement | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  const W = 720;
  const H = 240;
  const PAD = { l: 46, r: 16, t: 16, b: 28 };
  const n = EQUITY.length;
  const min = Math.min(...EQUITY);
  const max = Math.max(...EQUITY);
  const span = max - min || 1;
  const x = (i: number) => PAD.l + (i / (n - 1)) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - (v - min) / span) * (H - PAD.t - PAD.b);

  const linePath = useMemo(
    () => EQUITY.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" "),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const areaPath = `${linePath} L${x(n - 1)},${H - PAD.b} L${x(0)},${H - PAD.b} Z`;

  useLayoutEffect(() => {
    if (!inView || reduced || !pathRef.current) return;
    const el = pathRef.current;
    const len = el.getTotalLength();
    el.style.strokeDasharray = `${len}`;
    el.style.strokeDashoffset = `${len}`;
    el.getBoundingClientRect();
    el.style.transition = "stroke-dashoffset 1.9s cubic-bezier(0.4,0,0.2,1)";
    el.style.strokeDashoffset = "0";
  }, [inView, reduced]);

  const gridVals = useMemo(() => {
    const step = Math.ceil(span / 4);
    const vals: number[] = [];
    for (let v = Math.ceil(min); v <= max; v += step) vals.push(v);
    return vals;
  }, [min, max, span]);

  const final = EQUITY[n - 1];
  const maxDD = useMemo(() => {
    let peak = -Infinity;
    let dd = 0;
    EQUITY.forEach((v) => {
      peak = Math.max(peak, v);
      dd = Math.min(dd, v - peak);
    });
    return dd;
  }, []);

  const statFinal = useCountUp(final, inView);
  const statDD = useCountUp(maxDD, inView);

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - PAD.l) / (W - PAD.l - PAD.r)) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };

  return (
    <Reveal>
      <section ref={ref} className="h-full border border-line bg-panel p-6 md:p-7">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Pulse className="h-5 w-5 text-grass" />
            <h3 className="font-display text-lg font-bold tracking-wider text-ink uppercase">
              Backtest Record <span className="text-dim">— 48 games</span>
            </h3>
          </div>
          <p className="font-mono text-[10px] tracking-wider text-dim">
            CUMULATIVE UNITS · ¼-KELLY STAKING
          </p>
        </div>

        <div className="relative mt-5">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full cursor-crosshair"
            onMouseMove={onMove}
            onMouseLeave={() => setHover(null)}
            role="img"
            aria-label="Cumulative backtest equity curve"
          >
            <defs>
              <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3ad17f" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#3ad17f" stopOpacity="0" />
              </linearGradient>
            </defs>
            {gridVals.map((v) => (
              <g key={v}>
                <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="#1f2c26" strokeWidth="1" />
                <text x={PAD.l - 8} y={y(v) + 3} textAnchor="end" fontSize="9" fill="#5f7468" fontFamily="IBM Plex Mono">
                  {v > 0 ? `+${v}` : v}u
                </text>
              </g>
            ))}
            {min <= 0 && max >= 0 && (
              <line
                x1={PAD.l}
                x2={W - PAD.r}
                y1={y(0)}
                y2={y(0)}
                stroke="#5f7468"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            )}
            <path d={areaPath} fill="url(#eqFill)" opacity={inView || reduced ? 1 : 0} style={{ transition: "opacity 1s ease 0.8s" }} />
            <path
              ref={pathRef}
              d={linePath}
              fill="none"
              stroke="#3ad17f"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {hover !== null && (
              <g>
                <line x1={x(hover)} x2={x(hover)} y1={PAD.t} y2={H - PAD.b} stroke="#f2b441" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx={x(hover)} cy={y(EQUITY[hover])} r="4" fill="#f2b441" stroke="#0f1613" strokeWidth="2" />
              </g>
            )}
            <text x={W - PAD.r} y={H - 8} textAnchor="end" fontSize="9" fill="#5f7468" fontFamily="IBM Plex Mono">
              GAME {n - 1}
            </text>
          </svg>
          {hover !== null && (
            <div
              className="pointer-events-none absolute -top-1 border border-gold/50 bg-panel2 px-2.5 py-1.5 font-mono text-[10px] text-ink"
              style={{
                left: `${(x(hover) / W) * 100}%`,
                transform: `translateX(${hover > n / 2 ? "-110%" : "10%"})`,
              }}
            >
              GAME {hover} · <span className={EQUITY[hover] >= 0 ? "text-grass" : "text-blood"}>{EQUITY[hover] >= 0 ? "+" : "−"}{Math.abs(EQUITY[hover]).toFixed(1)}u</span>
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
          {[
            { k: "Win rate", v: "54.6%", c: "text-ink" },
            { k: "CLV avg", v: "+2.8%", c: "text-grass" },
            { k: "Peak to trough", v: `${statDD.toFixed(1)}u`, c: "text-blood" },
            { k: "Net result", v: `${statFinal >= 0 ? "+" : "−"}${Math.abs(statFinal).toFixed(1)}u`, c: "text-gold" },
          ].map((s) => (
            <div key={s.k} className="bg-panel2 px-4 py-3">
              <p className="font-mono text-[9px] tracking-[0.16em] text-dim uppercase">{s.k}</p>
              <p className={`mt-1 font-mono text-[15px] font-bold tabular-nums ${s.c}`}>{s.v}</p>
            </div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}

/* ---------------- model lab ---------------- */

export function ModelLab() {
  const { ref, inView } = useReveal<HTMLDivElement>();
  const LO = 50;
  const HI = 65;
  const w = (acc: number) => ((acc - LO) / (HI - LO)) * 100;
  const bePos = ((BREAKEVEN - LO) / (HI - LO)) * 100;

  return (
    <Reveal>
      <section ref={ref} className="flex h-full flex-col border border-line bg-panel p-6 md:p-7">
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-ice" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3.5h6M10 3.5v5.2L4.8 18a2.4 2.4 0 0 0 2.1 3.5h10.2a2.4 2.4 0 0 0 2.1-3.5L14 8.7V3.5" />
            <path d="M7.5 14.5h9" />
          </svg>
          <h3 className="font-display text-lg font-bold tracking-wider text-ink uppercase">
            Model Lab <span className="text-dim">— 18-month backtest</span>
          </h3>
        </div>
        <p className="mt-2 font-mono text-[11px] leading-relaxed text-dim">
          Hit rate vs closing line, NBA/NFL/MLB pooled. 50% is a coin flip —{" "}
          <span className="text-blood">52.4% is the vig wall</span>.
        </p>

        <div className="relative mt-6 flex-1 space-y-4">
          <span
            className="absolute top-0 bottom-0 z-10 w-px border-l border-dashed border-blood/70"
            style={{ left: `calc(${bePos}% * 0.78)` }}
          />
          <span
            className="absolute z-10 -translate-x-1/2 font-mono text-[9px] tracking-wider text-blood"
            style={{ left: `calc(${bePos}% * 0.78)` , top: "-18px" }}
          >
            VIG WALL 52.4%
          </span>
          {MODELS.map((m, i) => (
            <div key={m.name} className="group">
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <p className="font-mono text-[11px] font-semibold text-ink">
                  {m.name}
                  <span className="ml-2 text-[9px] font-normal text-dim">{m.note}</span>
                </p>
                <p className={`font-mono text-[12px] font-bold tabular-nums ${m.acc >= 58 ? "text-grass" : "text-muted"}`}>
                  {m.acc.toFixed(1)}%
                </p>
              </div>
              <div className="h-4 w-[78%] border border-line bg-panel2 p-[2px]">
                <div
                  className={`h-full transition-[width] duration-1000 ease-out group-hover:brightness-125 ${
                    m.acc >= 58 ? "bg-grass" : m.acc >= 52.4 ? "bg-gold" : "bg-blood"
                  }`}
                  style={{
                    width: inView ? `${w(m.acc)}%` : "0%",
                    transitionDelay: `${i * 110}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 border-t border-line pt-4 font-mono text-[10px] leading-relaxed text-dim">
          DESK NOTE: XGBoost + LSTM ensemble tops the board — but every point above 52.4% gets
          taxed by the vig, the latency race, and your own tilt. Size small anyway.
        </p>
      </section>
    </Reveal>
  );
}
