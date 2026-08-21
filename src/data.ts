export type Sport = "NBA" | "NFL" | "EPL" | "NHL" | "MLB";

export interface Team {
  abbr: string;
  name: string;
}

export interface Game {
  id: string;
  sport: Sport;
  time: string;
  away: Team;
  home: Team;
  market: "Spread" | "Moneyline" | "Total" | "Prop";
  line: string;
  bookOdds: number; // decimal
  modelProb: number; // model's true probability, 0..1
  publicPct: number; // % of tickets (bet count)
  moneyPct: number; // % of handle (money)
  engine: string;
}

export const GAMES: Game[] = [
  {
    id: "g1", sport: "NBA", time: "19:10",
    away: { abbr: "BOS", name: "Celtics" }, home: { abbr: "NYK", name: "Knicks" },
    market: "Spread", line: "BOS -5.5", bookOdds: 1.91, modelProb: 0.552,
    publicPct: 74, moneyPct: 58, engine: "XGB-ENS",
  },
  {
    id: "g2", sport: "NFL", time: "20:20",
    away: { abbr: "BUF", name: "Bills" }, home: { abbr: "KC", name: "Chiefs" },
    market: "Spread", line: "KC -2.5", bookOdds: 1.9, modelProb: 0.557,
    publicPct: 68, moneyPct: 44, engine: "XGB-ENS",
  },
  {
    id: "g3", sport: "NHL", time: "21:00",
    away: { abbr: "EDM", name: "Oilers" }, home: { abbr: "COL", name: "Avalanche" },
    market: "Moneyline", line: "COL ML", bookOdds: 1.83, modelProb: 0.571,
    publicPct: 39, moneyPct: 52, engine: "LSTM-4",
  },
  {
    id: "g4", sport: "NBA", time: "21:30",
    away: { abbr: "DEN", name: "Nuggets" }, home: { abbr: "LAL", name: "Lakers" },
    market: "Spread", line: "LAL +4.5", bookOdds: 1.87, modelProb: 0.549,
    publicPct: 31, moneyPct: 40, engine: "XGB-ENS",
  },
  {
    id: "g5", sport: "MLB", time: "22:10",
    away: { abbr: "LAD", name: "Dodgers" }, home: { abbr: "SD", name: "Padres" },
    market: "Moneyline", line: "LAD ML", bookOdds: 1.78, modelProb: 0.579,
    publicPct: 66, moneyPct: 61, engine: "POIS-X",
  },
  {
    id: "g6", sport: "EPL", time: "12:30",
    away: { abbr: "ARS", name: "Arsenal" }, home: { abbr: "LIV", name: "Liverpool" },
    market: "Prop", line: "BTTS YES", bookOdds: 1.72, modelProb: 0.588,
    publicPct: 57, moneyPct: 55, engine: "POIS-X",
  },
  {
    id: "g7", sport: "NBA", time: "22:00",
    away: { abbr: "GSW", name: "Warriors" }, home: { abbr: "SAC", name: "Kings" },
    market: "Spread", line: "SAC +2.5", bookOdds: 1.93, modelProb: 0.538,
    publicPct: 42, moneyPct: 49, engine: "XGB-ENS",
  },
  {
    id: "g8", sport: "NFL", time: "13:00",
    away: { abbr: "PHI", name: "Eagles" }, home: { abbr: "DET", name: "Lions" },
    market: "Moneyline", line: "DET ML", bookOdds: 2.1, modelProb: 0.494,
    publicPct: 35, moneyPct: 47, engine: "LSTM-4",
  },
  {
    id: "g9", sport: "NBA", time: "20:00",
    away: { abbr: "OKC", name: "Thunder" }, home: { abbr: "MIN", name: "Timberwolves" },
    market: "Total", line: "O 224.5", bookOdds: 1.95, modelProb: 0.521,
    publicPct: 61, moneyPct: 59, engine: "POIS-X",
  },
  {
    id: "g10", sport: "NHL", time: "22:30",
    away: { abbr: "TOR", name: "Maple Leafs" }, home: { abbr: "VGK", name: "Golden Knights" },
    market: "Spread", line: "VGK -1.5", bookOdds: 2.35, modelProb: 0.431,
    publicPct: 29, moneyPct: 33, engine: "XGB-ENS",
  },
  {
    id: "g11", sport: "EPL", time: "15:00",
    away: { abbr: "CHE", name: "Chelsea" }, home: { abbr: "MCI", name: "Man City" },
    market: "Spread", line: "MCI -1.5", bookOdds: 2.05, modelProb: 0.461,
    publicPct: 81, moneyPct: 74, engine: "XGB-ENS",
  },
  {
    id: "g12", sport: "MLB", time: "14:10",
    away: { abbr: "NYY", name: "Yankees" }, home: { abbr: "HOU", name: "Astros" },
    market: "Spread", line: "NYY -1.5", bookOdds: 2.55, modelProb: 0.383,
    publicPct: 58, moneyPct: 51, engine: "POIS-X",
  },
];

/* ---------------- odds math ---------------- */

export const impliedProb = (dec: number) => 1 / dec;

export const edgePts = (g: Game) => (g.modelProb - impliedProb(g.bookOdds)) * 100;

export const evPct = (g: Game) => (g.modelProb * (g.bookOdds - 1) - (1 - g.modelProb)) * 100;

export const kellyFull = (g: Game) => {
  const b = g.bookOdds - 1;
  return Math.max(0, (g.modelProb * g.bookOdds - 1) / b);
};

export function american(dec: number): string {
  if (dec >= 2) return "+" + Math.round((dec - 1) * 100);
  return "\u2212" + Math.round(100 / (dec - 1));
}

export type Signal = "STRONG" | "LEAN" | "WATCH" | "FADE";

export function signalOf(ev: number): Signal {
  if (ev >= 4) return "STRONG";
  if (ev >= 2) return "LEAN";
  if (ev > 0) return "WATCH";
  return "FADE";
}

export const fmtPct = (x: number, dp = 1) =>
  (x > 0 ? "+" : x < 0 ? "\u2212" : "") + Math.abs(x).toFixed(dp) + "%";

export const fmtMoney = (x: number) =>
  (x < 0 ? "\u2212$" : "$") + Math.abs(x).toLocaleString("en-US", { maximumFractionDigits: 0 });

/* ---------------- backtest equity curve (units, deterministic walk) ---------------- */

export const EQUITY: number[] = (() => {
  let v = 0;
  let s = 20260214;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
  const out = [0];
  for (let i = 1; i <= 47; i++) {
    v += (rnd() - 0.452) * 2.4;
    out.push(+v.toFixed(2));
  }
  return out;
})();

/* ---------------- model lab ---------------- */

export interface ModelSpec {
  name: string;
  acc: number;
  note: string;
}

export const MODELS: ModelSpec[] = [
  { name: "Logistic Regression", acc: 56.4, note: "linear baseline" },
  { name: "Poisson xG", acc: 57.2, note: "score-level" },
  { name: "Random Forest", acc: 57.8, note: "bagged trees" },
  { name: "XGBoost", acc: 58.9, note: "feature-importance king" },
  { name: "LSTM", acc: 60.8, note: "sequence memory" },
  { name: "Stacked Ensemble", acc: 63.1, note: "meta-learner" },
];

export const BREAKEVEN = 52.4; // % needed at -110

/* ---------------- pipeline ---------------- */

export interface PipeStep {
  icon: "feed" | "forge" | "chip" | "bolt";
  code: string;
  title: string;
  sub: string;
  bullets: string[];
}

export const PIPELINE: PipeStep[] = [
  {
    icon: "feed", code: "01", title: "Ingest", sub: "20+ sports · 3,900 leagues",
    bullets: ["Opta / Sportradar feeds", "ESPN + public APIs", "weather, refs, travel, sentiment"],
  },
  {
    icon: "forge", code: "02", title: "Engineer", sub: "features that actually price",
    bullets: ["recency-weighted form (L5)", "home/away splits, rest days", "injury impact 5–10 pts"],
  },
  {
    icon: "chip", code: "03", title: "Model", sub: "XGBoost ⨯ LSTM stack",
    bullets: ["gradient boosting core", "LSTM momentum layer", "stacked meta-learner"],
  },
  {
    icon: "bolt", code: "04", title: "Execute", sub: "edge → stake → fill",
    bullets: ["implied vs true prob", "Kelly-fraction sizing", "live fills < 200ms"],
  },
];

/* ---------------- reality check ---------------- */

export const REALITY = [
  { big: "52.4%", label: "break-even hit rate", sub: "on two-way −110 pricing" },
  { big: "4.55%", label: "the vig you pay", sub: "standard two-sided book cut" },
  { big: "1–3%", label: "real edge vs closing", sub: "even for elite models" },
  { big: "2–5%", label: "max risk per play", sub: "Kelly-capped, always" },
];

export const DOCTRINE = [
  "Price is a probability. If your number beats the implied number, you buy. Otherwise you sit. Sitting is a position.",
  "Spreads misprice faster than moneylines. When the model says win by 10 and the line says 5, you take the points — not the headline.",
  "Bankroll discipline outranks prediction accuracy. You can hit 55% and still go broke sizing like a tourist.",
];
