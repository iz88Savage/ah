import { american, evPct, fmtMoney, kellyFull, type Game } from "../data";
import { Ledger } from "../icons";

export interface LedgerEntry {
  id: number;
  label: string;
  stake: number;
  odds: number;
  ev: number;
  time: string;
}

export const stakeFor = (g: Game, bankroll: number, mult: number): number => {
  if (evPct(g) <= 0) return 0;
  const raw = bankroll * kellyFull(g) * mult;
  const capped = Math.min(raw, bankroll * 0.05);
  return Math.max(0, Math.floor(capped / 5) * 5);
};

export function Slip({
  slipGames,
  onRemove,
  bankroll,
  setBankroll,
  mult,
  setMult,
  onLog,
  onClear,
  ledger,
}: {
  slipGames: Game[];
  onRemove: (id: string) => void;
  bankroll: number;
  setBankroll: (n: number) => void;
  mult: number;
  setMult: (n: number) => void;
  onLog: () => void;
  onClear: () => void;
  ledger: LedgerEntry[];
}) {
  const totalStake = slipGames.reduce((s, g) => s + stakeFor(g, bankroll, mult), 0);
  const totalEv = slipGames.reduce((s, g) => s + stakeFor(g, bankroll, mult) * (evPct(g) / 100), 0);
  const blended = totalStake > 0 ? (totalEv / totalStake) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* -------- slip -------- */}
      <section className="border border-gold/35 bg-panel">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-bold tracking-wider text-ink uppercase">
            Bet Slip <span className="text-dim">— Paper Desk</span>
          </h2>
          <span className="grid h-7 min-w-7 place-items-center border border-gold/50 bg-gold/10 px-1 font-mono text-[12px] font-bold text-gold">
            {slipGames.length}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-3">
          <label className="flex items-center gap-2 font-mono text-[10px] tracking-wider text-dim uppercase">
            Bankroll
            <span className="flex items-center border border-line bg-panel2 px-2 py-1">
              <span className="text-gold">$</span>
              <input
                type="number"
                min={100}
                step={100}
                value={bankroll}
                onChange={(e) => setBankroll(Math.max(0, Number(e.target.value) || 0))}
                className="w-20 bg-transparent pl-1 font-mono text-[12px] text-ink outline-none"
              />
            </span>
          </label>
          <div className="flex items-center gap-1 font-mono text-[10px] tracking-wider text-dim uppercase">
            Kelly
            <div className="flex border border-line">
              {[
                { label: "FULL", v: 1 },
                { label: "½", v: 0.5 },
                { label: "¼", v: 0.25 },
              ].map((o) => (
                <button
                  key={o.v}
                  onClick={() => setMult(o.v)}
                  className={`px-2.5 py-1 transition-colors duration-150 ${
                    mult === o.v ? "bg-gold font-bold text-[#171006]" : "bg-panel2 text-muted hover:text-ink"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="thin-scroll max-h-[300px] overflow-y-auto">
          {slipGames.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-line2" fill="none" stroke="currentColor" strokeWidth="1.4">
                <circle cx="12" cy="12" r="7.2" />
                <path d="M12 1.8v4M12 18.2v4M1.8 12h4M18.2 12h4" />
              </svg>
              <p className="font-mono text-[11px] leading-relaxed text-dim">
                SLIP EMPTY.
                <br />
                Click a row on the board to load a play.
              </p>
            </div>
          ) : (
            slipGames.map((g) => {
              const stake = stakeFor(g, bankroll, mult);
              const ev = evPct(g);
              return (
                <div
                  key={g.id}
                  className="rise-in group flex items-center justify-between gap-3 border-b border-line/60 px-5 py-3 last:border-b-0 hover:bg-panel2"
                >
                  <div className="min-w-0">
                    <p className="truncate font-display text-[13px] font-semibold tracking-wide text-ink">
                      {g.line}
                      <span className="ml-2 font-mono text-[10px] font-normal text-muted">
                        {g.away.abbr}@{g.home.abbr}
                      </span>
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-dim tabular-nums">
                      {american(g.bookOdds)} · MODEL {(g.modelProb * 100).toFixed(1)}% ·{" "}
                      <span className={ev > 0 ? "text-grass" : "text-blood"}>EV {ev > 0 ? "+" : ""}{ev.toFixed(1)}%</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-mono text-[13px] font-bold text-gold tabular-nums">
                        {stake > 0 ? fmtMoney(stake) : "PASS"}
                      </p>
                      <p className="font-mono text-[9px] text-dim tabular-nums">
                        {stake > 0 ? `to win ${fmtMoney(stake * (g.bookOdds - 1))}` : "no +EV"}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemove(g.id)}
                      aria-label={`Remove ${g.line}`}
                      className="grid h-6 w-6 place-items-center border border-line font-mono text-[11px] text-dim transition-all duration-150 hover:border-blood hover:bg-blood/15 hover:text-blood"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {slipGames.length > 0 && (
          <div className="grid grid-cols-3 gap-px border-t border-line bg-line">
            <div className="bg-panel2 px-4 py-3">
              <p className="font-mono text-[9px] tracking-[0.16em] text-dim uppercase">Total Stake</p>
              <p className="mt-1 font-mono text-[14px] font-bold text-ink tabular-nums">{fmtMoney(totalStake)}</p>
            </div>
            <div className="bg-panel2 px-4 py-3">
              <p className="font-mono text-[9px] tracking-[0.16em] text-dim uppercase">Exp. Value</p>
              <p className={`mt-1 font-mono text-[14px] font-bold tabular-nums ${totalEv >= 0 ? "text-grass" : "text-blood"}`}>
                {totalEv >= 0 ? "+" : "−"}${Math.abs(totalEv).toFixed(0)}
              </p>
            </div>
            <div className="bg-panel2 px-4 py-3">
              <p className="font-mono text-[9px] tracking-[0.16em] text-dim uppercase">Blended EV</p>
              <p className={`mt-1 font-mono text-[14px] font-bold tabular-nums ${blended >= 0 ? "text-grass" : "text-blood"}`}>
                {blended >= 0 ? "+" : "−"}{Math.abs(blended).toFixed(1)}%
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-2 border-t border-line p-4">
          <button
            onClick={onLog}
            disabled={slipGames.length === 0}
            className="flex-1 border border-gold bg-gold px-4 py-2.5 font-display text-[12px] font-bold tracking-[0.14em] text-[#171006] uppercase transition-all duration-200 enabled:hover:brightness-110 enabled:active:translate-y-px disabled:cursor-not-allowed disabled:opacity-35"
          >
            Log to Ledger
          </button>
          <button
            onClick={onClear}
            disabled={slipGames.length === 0}
            className="border border-line px-4 py-2.5 font-mono text-[11px] tracking-wider text-muted transition-colors duration-200 enabled:hover:border-blood/60 enabled:hover:text-blood disabled:cursor-not-allowed disabled:opacity-35"
          >
            CLEAR
          </button>
        </div>
      </section>

      {/* -------- ledger -------- */}
      <section className="border border-line bg-panel">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <p className="flex items-center gap-2 font-display text-[13px] font-bold tracking-wider text-ink uppercase">
            <Ledger className="h-4 w-4 text-ice" /> Paper Ledger
          </p>
          <span className="font-mono text-[10px] text-dim">{ledger.length} LOGGED</span>
        </div>
        <div className="thin-scroll max-h-[220px] overflow-y-auto">
          {ledger.length === 0 ? (
            <p className="px-5 py-6 font-mono text-[11px] text-dim">
              Nothing logged yet. Size a slip and commit it to the record.
            </p>
          ) : (
            ledger.map((e) => (
              <div key={e.id} className="rise-in flex items-center justify-between gap-3 border-b border-line/60 px-5 py-2.5 last:border-b-0">
                <div className="min-w-0">
                  <p className="truncate font-mono text-[11px] font-semibold text-ink">{e.label}</p>
                  <p className="font-mono text-[10px] text-dim tabular-nums">
                    {fmtMoney(e.stake)} @ {e.odds.toFixed(2)} · EV{" "}
                    <span className={e.ev >= 0 ? "text-grass" : "text-blood"}>
                      {e.ev >= 0 ? "+" : "−"}${Math.abs(e.ev).toFixed(0)}
                    </span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="font-mono text-[10px] text-dim tabular-nums">{e.time}</span>
                  <span className="flex items-center gap-1.5 border border-ice/40 bg-ice/10 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-ice">
                    <span className="pulse-dot h-1 w-1 rounded-full bg-ice" /> OPEN
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
