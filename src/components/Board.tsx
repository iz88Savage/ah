import { useMemo, useState, type ReactNode } from "react";
import {
  american,
  edgePts,
  evPct,
  fmtPct,
  impliedProb,
  signalOf,
  type Game,
  type Sport,
} from "../data";
import { Radar } from "../icons";
import { Reveal } from "./Chrome";

type SortKey = "ev" | "model" | "time";

const SPORTS: Array<"ALL" | Sport> = ["ALL", "NBA", "NFL", "EPL", "NHL", "MLB"];

const SIGNAL_STYLE: Record<string, string> = {
  STRONG: "border-grass/50 bg-grass/10 text-grass",
  LEAN: "border-gold/50 bg-gold/10 text-gold",
  WATCH: "border-ice/40 bg-ice/10 text-ice",
  FADE: "border-blood/50 bg-blood/10 text-blood",
};

const SIGNAL_BAR: Record<string, string> = {
  STRONG: "bg-grass",
  LEAN: "bg-gold",
  WATCH: "bg-ice",
  FADE: "bg-blood",
};

export function Board({
  games,
  flashes,
  slipIds,
  onAdd,
}: {
  games: Game[];
  flashes: Record<string, "up" | "down" | undefined>;
  slipIds: string[];
  onAdd: (g: Game) => void;
}) {
  const [sport, setSport] = useState<"ALL" | Sport>("ALL");
  const [evOnly, setEvOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("ev");

  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: games.length };
    games.forEach((g) => (c[g.sport] = (c[g.sport] ?? 0) + 1));
    return c;
  }, [games]);

  const rows = useMemo(() => {
    let list = games.filter((g) => (sport === "ALL" ? true : g.sport === sport));
    if (evOnly) list = list.filter((g) => evPct(g) > 0);
    return [...list].sort((a, b) => {
      if (sortKey === "ev") return evPct(b) - evPct(a);
      if (sortKey === "model") return b.modelProb - a.modelProb;
      return a.time.localeCompare(b.time);
    });
  }, [games, sport, evOnly, sortKey]);

  const SortBtn = ({ k, children }: { k: SortKey; children: ReactNode }) => (
    <button
      onClick={() => setSortKey(k)}
      className={`inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors ${
        sortKey === k ? "text-gold" : "text-dim hover:text-muted"
      }`}
    >
      {children}
      {sortKey === k && <span className="text-gold">▾</span>}
    </button>
  );

  return (
    <Reveal>
      <section className="border border-line bg-panel" id="board">
        {/* header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div className="flex items-center gap-3">
            <Radar className="h-5 w-5 text-gold" />
            <h2 className="font-display text-lg font-bold tracking-wider text-ink uppercase">
              Edge Finder <span className="text-dim">— Tonight's Board</span>
            </h2>
            <span className="flex items-center gap-1.5 border border-grass/40 bg-grass/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-grass">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-grass" /> LIVE
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-dim">
            {["IMPLIED 1/d", "EV p·(d−1)−(1−p)", "KELLY (pd−1)/(d−1)"].map((f) => (
              <span key={f} className="border border-line bg-panel2 px-2 py-1 tracking-wider text-muted">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
          <div className="flex flex-wrap gap-1.5">
            {SPORTS.map((s) => (
              <button
                key={s}
                onClick={() => setSport(s)}
                className={`border px-3 py-1.5 font-mono text-[11px] tracking-wider transition-all duration-200 ${
                  sport === s
                    ? "border-gold bg-gold text-[#171006]"
                    : "border-line bg-panel2 text-muted hover:border-gold/50 hover:text-ink"
                }`}
              >
                {s} <span className={sport === s ? "opacity-70" : "text-dim"}>{counts[s] ?? 0}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setEvOnly((v) => !v)}
            className={`flex items-center gap-2 border px-3 py-1.5 font-mono text-[11px] tracking-wider transition-all duration-200 ${
              evOnly
                ? "border-grass bg-grass/15 text-grass"
                : "border-line bg-panel2 text-muted hover:border-grass/50"
            }`}
          >
            <span
              className={`grid h-3.5 w-3.5 place-items-center border transition-colors ${
                evOnly ? "border-grass bg-grass text-[#08130c]" : "border-line2"
              }`}
            >
              {evOnly && (
                <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1.5 5.5 4 8l4.5-6" />
                </svg>
              )}
            </span>
            +EV ONLY
          </button>
        </div>

        {/* table */}
        <div className="thin-scroll overflow-x-auto">
          <div className="min-w-[1020px]">
            <div className="grid grid-cols-[64px_1fr_104px_86px_128px_140px_92px_92px_52px] items-center gap-x-3 border-b border-line bg-panel2 px-5 py-2.5">
              <SortBtn k="time">Time ET</SortBtn>
              <span className="font-mono text-[10px] tracking-[0.14em] text-dim uppercase">Matchup</span>
              <span className="font-mono text-[10px] tracking-[0.14em] text-dim uppercase">Odds</span>
              <span className="font-mono text-[10px] tracking-[0.14em] text-dim uppercase">Implied</span>
              <SortBtn k="model">Model</SortBtn>
              <span className="font-mono text-[10px] tracking-[0.14em] text-dim uppercase">
                Tickets <span className="text-muted">/</span> Money
              </span>
              <SortBtn k="ev">EV</SortBtn>
              <span className="font-mono text-[10px] tracking-[0.14em] text-dim uppercase">Signal</span>
              <span />
            </div>

            {rows.map((g) => {
              const ev = evPct(g);
              const sig = signalOf(ev);
              const inSlip = slipIds.includes(g.id);
              const flash = flashes[g.id];
              return (
                <button
                  key={g.id}
                  onClick={() => onAdd(g)}
                  className={`group relative grid w-full grid-cols-[64px_1fr_104px_86px_128px_140px_92px_92px_52px] items-center gap-x-3 border-b border-line/60 px-5 py-3 text-left transition-colors duration-150 last:border-b-0 hover:bg-panel3 ${
                    inSlip ? "opacity-70" : ""
                  }`}
                >
                  <span className={`absolute top-0 left-0 h-full w-[3px] ${SIGNAL_BAR[sig]} opacity-70`} />
                  <span className="font-mono text-[11px] text-dim tabular-nums">{g.time}</span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-[13px] font-semibold tracking-wide text-ink">
                      {g.away.abbr} <span className="text-dim">@</span> {g.home.abbr}
                      <span className="ml-2 font-mono text-[10px] font-normal text-muted">
                        {g.line} · {g.market.toUpperCase()}
                      </span>
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.14em] text-dim">
                      {g.sport} · {g.away.name} / {g.home.name}
                    </span>
                  </span>
                  <span
                    className={`border border-transparent px-1 py-0.5 font-mono text-[13px] font-semibold text-ink tabular-nums ${
                      flash === "up" ? "flash-up" : flash === "down" ? "flash-down" : ""
                    }`}
                  >
                    {american(g.bookOdds)}
                    <span className="ml-1.5 text-[10px] font-normal text-dim">{g.bookOdds.toFixed(2)}</span>
                  </span>
                  <span className="font-mono text-[12px] text-muted tabular-nums">
                    {(impliedProb(g.bookOdds) * 100).toFixed(1)}%
                  </span>
                  <span>
                    <span className="block font-mono text-[13px] font-semibold text-ice tabular-nums">
                      {(g.modelProb * 100).toFixed(1)}%
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.12em] text-dim">
                      {g.engine} · EDGE {fmtPct(edgePts(g), 1)}
                    </span>
                  </span>
                  <span className="space-y-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 font-mono text-[9px] text-dim">T</span>
                      <span className="h-[5px] flex-1 bg-line/70">
                        <span
                          className="block h-full bg-ice/70 transition-[width] duration-500"
                          style={{ width: `${g.publicPct}%` }}
                        />
                      </span>
                      <span className="w-6 text-right font-mono text-[9px] text-muted tabular-nums">{g.publicPct}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 font-mono text-[9px] text-dim">$</span>
                      <span className="h-[5px] flex-1 bg-line/70">
                        <span
                          className="block h-full bg-gold transition-[width] duration-500"
                          style={{ width: `${g.moneyPct}%` }}
                        />
                      </span>
                      <span className="w-6 text-right font-mono text-[9px] text-muted tabular-nums">{g.moneyPct}</span>
                    </span>
                  </span>
                  <span
                    className={`font-mono text-[13px] font-bold tabular-nums ${
                      ev >= 4 ? "text-grass" : ev >= 2 ? "text-grass/80" : ev > 0 ? "text-ice" : "text-blood"
                    }`}
                  >
                    {fmtPct(ev, 1)}
                  </span>
                  <span
                    className={`inline-block w-fit border px-2 py-1 font-mono text-[9px] font-semibold tracking-[0.14em] ${SIGNAL_STYLE[sig]}`}
                  >
                    {sig}
                  </span>
                  <span
                    className={`grid h-7 w-7 place-items-center border font-mono text-sm transition-all duration-200 ${
                      inSlip
                        ? "border-grass/50 bg-grass/15 text-grass"
                        : "border-line2 text-dim group-hover:border-gold group-hover:bg-gold group-hover:text-[#171006]"
                    }`}
                  >
                    {inSlip ? "✓" : "+"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3">
          <p className="font-mono text-[10px] tracking-wider text-dim">
            {rows.length} PLAYS SHOWN · MODEL PROBS XGB-ENS v4.2 · 3S REFRESH CADENCE
          </p>
          <p className="font-mono text-[10px] tracking-wider text-dim">
            CLICK A ROW TO LOAD IT INTO THE SLIP →
          </p>
        </div>
      </section>
    </Reveal>
  );
}
