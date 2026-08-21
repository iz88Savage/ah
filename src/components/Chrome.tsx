import type { ReactNode } from "react";
import { useClockET, useReveal } from "../hooks";
import { DOCTRINE, PIPELINE, REALITY, american, type Game } from "../data";
import { Bolt, Chip, Crosshair, Feed, Forge, Shield } from "../icons";

/* ---------- shared reveal wrapper ---------- */

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function SectionHead({
  index,
  kicker,
  title,
  note,
}: {
  index: string;
  kicker: string;
  title: string;
  note?: string;
}) {
  return (
    <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div>
        <p className="font-mono text-[11px] tracking-[0.22em] text-gold">
          <span className="text-dim">{"//"}</span> {index} — {kicker}
        </p>
        <h2 className="mt-1.5 font-display text-2xl font-bold uppercase tracking-wide text-ink md:text-[32px] md:leading-tight">
          {title}
        </h2>
      </div>
      {note && (
        <p className="max-w-sm font-mono text-[11px] leading-relaxed text-dim md:text-right">
          {note}
        </p>
      )}
    </Reveal>
  );
}

/* ---------- top status bar ---------- */

export function TopBar({ openPlays }: { openPlays: number }) {
  const clock = useClockET();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-base/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 md:px-8">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center border border-gold/50 bg-panel text-gold">
            <Crosshair className="h-5 w-5" />
          </span>
          <div className="leading-none">
            <p className="font-display text-[15px] font-bold tracking-[0.18em] text-ink">
              SHADOW<span className="text-gold">/</span>QUANT DESK
            </p>
            <p className="mt-1 font-mono text-[10px] tracking-[0.16em] text-dim">
              SPORTS EDGE TERMINAL · v4.2 · RESEARCH ONLY
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <span className="border border-line bg-panel px-2.5 py-1.5 font-mono text-[11px] text-grass">
            CLV +2.8%
          </span>
          <span className="border border-line bg-panel px-2.5 py-1.5 font-mono text-[11px] text-gold">
            ROI +4.1%
          </span>
          <span className="border border-line bg-panel px-2.5 py-1.5 font-mono text-[11px] text-ice">
            OPEN {openPlays}
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="pulse-dot h-2 w-2 rounded-full bg-grass" />
          <p className="font-mono text-sm font-semibold tabular-nums text-ink">
            {clock} <span className="text-[10px] text-dim">ET</span>
          </p>
        </div>
      </div>
    </header>
  );
}

/* ---------- live odds ticker ---------- */

export function Ticker({
  games,
  flashes,
}: {
  games: Game[];
  flashes: Record<string, "up" | "down" | undefined>;
}) {
  const statics = [
    "MODEL XGB-ENS v4.2 ONLINE",
    "LATENCY 186MS",
    "SESSION CLV +2.8%",
    "VIG 4.55%",
    "KELLY CAP \u00BC FRACTION",
  ];
  const items = [
    ...games.map((g) => ({
      key: g.id,
      label: `${g.away.abbr}@${g.home.abbr} ${g.line} ${american(g.bookOdds)}`,
      dir: flashes[g.id],
    })),
    ...statics.map((s, i) => ({ key: `s${i}`, label: s, dir: undefined as "up" | "down" | undefined })),
  ];
  const renderItems = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center"
    >
      {items.map((it) => (
        <span key={`${it.key}${ariaHidden ? "-b" : ""}`} className="flex items-center">
          <span
            className={`px-4 font-mono text-[11px] tracking-wider whitespace-nowrap ${
              it.dir === "up"
                ? "flash-up text-grass"
                : it.dir === "down"
                  ? "flash-down text-blood"
                  : "text-muted"
            }`}
          >
            {it.label}
            {it.dir === "up" && <span className="ml-1.5 text-grass">▲</span>}
            {it.dir === "down" && <span className="ml-1.5 text-blood">▼</span>}
          </span>
          <span className="text-[9px] text-gold/70">◆</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="ticker-wrap overflow-hidden border-b border-line bg-panel2">
      <div className="ticker-track flex w-max">
        {renderItems(false)}
        {renderItems(true)}
      </div>
    </div>
  );
}

/* ---------- pipeline ---------- */

const STEP_ICONS = { feed: Feed, forge: Forge, chip: Chip, bolt: Bolt };

export function Pipeline() {
  return (
    <section className="mt-20">
      <SectionHead
        index="07"
        kicker="PIPELINE"
        title="From feed to fill"
        note="The same four stages a prop desk runs — pointed at a scoreboard instead of an order book."
      />
      <div className="relative">
        <div className="dash-line absolute top-7 right-[12%] left-[12%] hidden h-[2px] lg:block" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PIPELINE.map((step, i) => {
            const Icon = STEP_ICONS[step.icon];
            return (
              <Reveal key={step.code} delay={i * 120}>
                <div className="group relative h-full border border-line bg-panel p-5 transition-colors duration-300 hover:border-gold/50">
                  <div className="flex items-center justify-between">
                    <span className="grid h-14 w-14 place-items-center border border-line2 bg-panel2 text-gold transition-transform duration-300 group-hover:-translate-y-1">
                      <Icon className="h-7 w-7" />
                    </span>
                    <span className="font-display text-3xl font-bold text-line2 transition-colors duration-300 group-hover:text-gold/60">
                      {step.code}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-wider text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-0.5 font-mono text-[11px] text-gold/90">{step.sub}</p>
                  <ul className="mt-3 space-y-1.5">
                    {step.bullets.map((b) => (
                      <li key={b} className="flex gap-2 font-mono text-[11px] leading-relaxed text-muted">
                        <span className="text-grass">▸</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- reality check / doctrine ---------- */

export function RealityCheck() {
  return (
    <section className="mt-20">
      <SectionHead
        index="08"
        kicker="DOCTRINE"
        title="The bitter truth, priced in"
        note="Everything above is a framework. These numbers are the rent."
      />
      <div className="grid gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <div className="scanline flex h-full flex-col justify-between border border-line bg-panel p-7 md:p-9">
            <p className="font-display text-2xl font-bold leading-snug text-ink md:text-[34px] md:leading-[1.15]">
              THE HOUSE SELLS <span className="text-gold">VOLATILITY</span>.
              <br />
              YOU MANAGE <span className="text-grass">RISK</span>.
            </p>
            <ol className="mt-8 space-y-4">
              {DOCTRINE.map((d, i) => (
                <li key={i} className="flex gap-4 border-t border-line pt-4">
                  <span className="font-display text-xl font-bold text-gold/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed text-muted">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 lg:col-span-5">
          {REALITY.map((r, i) => (
            <Reveal key={r.label} delay={i * 100} className={i % 2 === 1 ? "translate-y-0 lg:translate-y-6" : ""}>
              <div className="h-full border border-line bg-panel2 p-5 transition-colors duration-300 hover:border-blood/50">
                <p className="font-display text-3xl font-bold text-blood md:text-4xl">{r.big}</p>
                <p className="mt-2 font-mono text-[11px] font-semibold tracking-wider text-ink uppercase">
                  {r.label}
                </p>
                <p className="mt-1 font-mono text-[10px] leading-relaxed text-dim">{r.sub}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={380} className="col-span-2">
            <div className="flex items-start gap-3 border border-gold/35 bg-gold/[0.06] p-4">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <p className="font-mono text-[11px] leading-relaxed text-muted">
                <span className="font-semibold text-gold">RESPONSIBLE PLAY.</span> 21+. This terminal
                places no real wagers. Bet only what you can lose twice — and if it stops being a
                game, call <span className="text-ink">1-800-GAMBLER</span>.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- footer ---------- */

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-panel">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-10 md:grid-cols-3 md:px-8">
        <div>
          <p className="flex items-center gap-2 font-display text-sm font-bold tracking-[0.18em] text-ink">
            <Crosshair className="h-4 w-4 text-gold" />
            SHADOW<span className="text-gold">/</span>QUANT DESK
          </p>
          <p className="mt-3 max-w-xs font-mono text-[11px] leading-relaxed text-dim">
            A research terminal for the disciplined. Find the gap between implied and true
            probability — then let Kelly decide how much you're allowed to care.
          </p>
        </div>
        <div className="font-mono text-[11px] leading-relaxed text-dim">
          <p className="mb-2 tracking-[0.18em] text-muted">DISCLAIMER</p>
          <p>
            Simulated odds, model outputs and backtests for education only. Nothing here is wagering
            advice or an offer to bet. Past backtests do not survive contact with a hot streak of
            bad variance.
          </p>
        </div>
        <div className="font-mono text-[11px] leading-relaxed text-dim md:text-right">
          <p className="mb-2 tracking-[0.18em] text-muted">BUILD</p>
          <p>
            ENGINE XGB-ENS v4.2 · FEED DELAY 3S
            <br />
            PAPER DESK · NO LIVE BOOKS CONNECTED
            <br />
            <span className="text-gold">STAY IN THE SHADOWS. MOVE ON THE MATH.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
