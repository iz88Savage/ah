import { useCallback, useEffect, useRef, useState } from "react";
import { american, evPct, GAMES, type Game } from "./data";
import { Footer, Pipeline, RealityCheck, SectionHead, Ticker, TopBar } from "./components/Chrome";
import { Board } from "./components/Board";
import { Slip, stakeFor, type LedgerEntry } from "./components/Slip";
import { EquityCurve, KellyCalc, ModelLab, PublicSharp } from "./components/Analytics";

interface Toast {
  id: number;
  msg: string;
  tone: "gold" | "grass" | "blood";
}

let toastSeq = 0;

export default function App() {
  const [games, setGames] = useState<Game[]>(GAMES);
  const [flashes, setFlashes] = useState<Record<string, "up" | "down" | undefined>>({});
  const [slipIds, setSlipIds] = useState<string[]>([]);
  const [bankroll, setBankroll] = useState(5000);
  const [mult, setMult] = useState(0.25);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const gamesRef = useRef(games);
  gamesRef.current = games;

  /* ----- live odds drift ----- */
  useEffect(() => {
    const id = setInterval(() => {
      const gs = gamesRef.current;
      const picks = new Set<number>();
      while (picks.size < 3) picks.add(Math.floor(Math.random() * gs.length));
      const fl: Record<string, "up" | "down"> = {};
      let changed = false;
      const next = gs.map((g, i) => {
        if (!picks.has(i)) return g;
        const dir = Math.random() > 0.45 ? 1 : -1;
        const d = dir * (0.01 + Math.random() * 0.03);
        const o = +(g.bookOdds + d).toFixed(2);
        if (o <= 1.25 || o >= 3.8) return g;
        changed = true;
        fl[g.id] = d > 0 ? "up" : "down";
        return { ...g, bookOdds: o };
      });
      if (!changed) return;
      setGames(next);
      setFlashes((f) => ({ ...f, ...fl }));
      window.setTimeout(() => {
        setFlashes((f) => {
          const c = { ...f };
          Object.keys(fl).forEach((k) => delete c[k]);
          return c;
        });
      }, 950);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  /* ----- toasts ----- */
  const pushToast = useCallback((msg: string, tone: Toast["tone"] = "gold") => {
    const id = ++toastSeq;
    setToasts((t) => [...t.slice(-2), { id, msg, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  /* ----- slip actions ----- */
  const slipGames = slipIds.map((id) => games.find((g) => g.id === id)!).filter(Boolean);

  const addToSlip = useCallback(
    (g: Game) => {
      if (slipIds.includes(g.id)) {
        pushToast(`ALREADY LOADED · ${g.line}`, "blood");
        return;
      }
      setSlipIds((s) => [...s, g.id]);
      pushToast(`LOADED · ${g.line} @ ${american(g.bookOdds)}`, "grass");
    },
    [slipIds, pushToast]
  );

  const removeFromSlip = useCallback((id: string) => {
    setSlipIds((s) => s.filter((x) => x !== id));
  }, []);

  const logToLedger = useCallback(() => {
    if (slipGames.length === 0) return;
    const time = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());
    const entries: LedgerEntry[] = slipGames.map((g, i) => ({
      id: Date.now() + i,
      label: `${g.line} · ${g.away.abbr}@${g.home.abbr}`,
      stake: stakeFor(g, bankroll, mult),
      odds: g.bookOdds,
      ev: stakeFor(g, bankroll, mult) * (evPct(g) / 100),
      time,
    }));
    setLedger((l) => [...entries.reverse(), ...l]);
    pushToast(`LOGGED ${entries.length} ${entries.length === 1 ? "PLAY" : "PLAYS"} TO PAPER LEDGER`, "gold");
    setSlipIds([]);
  }, [slipGames, bankroll, mult, pushToast]);

  return (
    <div className="relative z-10 min-h-screen">
      <TopBar openPlays={slipIds.length} />
      <Ticker games={games} flashes={flashes} />

      <main className="mx-auto max-w-[1440px] px-4 pb-4 md:px-8">
        {/* ---- 01/02 board + desk ---- */}
        <section className="pt-10">
          <SectionHead
            index="01"
            kicker="THE BOARD"
            title="Tonight's mispricings"
            note="Implied probability vs model probability. Green means the book is wrong enough to matter. Odds drift on a 3-second feed."
          />
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_370px]">
            <Board games={games} flashes={flashes} slipIds={slipIds} onAdd={addToSlip} />
            <div className="lg:sticky lg:top-20">
              <Slip
                slipGames={slipGames}
                onRemove={removeFromSlip}
                bankroll={bankroll}
                setBankroll={setBankroll}
                mult={mult}
                setMult={setMult}
                onLog={logToLedger}
                onClear={() => setSlipIds([])}
                ledger={ledger}
              />
            </div>
          </div>
        </section>

        {/* ---- 03/04 sizing + flow ---- */}
        <section className="mt-20">
          <SectionHead
            index="03"
            kicker="SIZING & FLOW"
            title="Bet the gap, not the team"
            note="Kelly converts an edge into a stake. Ticket/handle divergence tells you which side the room is on — and which side the pros are on."
          />
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <KellyCalc />
            </div>
            <div className="lg:col-span-5">
              <PublicSharp />
            </div>
          </div>
        </section>

        {/* ---- 05/06 record + lab ---- */}
        <section className="mt-20">
          <SectionHead
            index="05"
            kicker="THE RECORD"
            title="Prove it before you pay for it"
            note="500+ simulated bets, quarter-Kelly staking, priced against the closing line. Hover the curve — every unit has a story."
          />
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <EquityCurve />
            </div>
            <div className="lg:col-span-5">
              <ModelLab />
            </div>
          </div>
        </section>

        <Pipeline />
        <RealityCheck />
      </main>

      <Footer />

      {/* ---- toasts ---- */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rise-in border-l-2 bg-panel2 px-4 py-2.5 font-mono text-[11px] tracking-wider shadow-lg shadow-black/40 ${
              t.tone === "grass"
                ? "border-grass text-grass"
                : t.tone === "blood"
                  ? "border-blood text-blood"
                  : "border-gold text-gold"
            }`}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  );
}
