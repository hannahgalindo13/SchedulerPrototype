// Core data + scheduling logic ported from the original Cadence design prototype.

export const ACCENT = '#35665A';
export const DAY_START = 7;
export const DAY_END = 22;
export const PX_PER_HOUR = 58;

export const DAYS = [
  { k: 'mon', short: 'Monday', label: 'Monday' },
  { k: 'tue', short: 'Tuesday', label: 'Tuesday' },
  { k: 'wed', short: 'Wednesday', label: 'Wednesday' },
  { k: 'thu', short: 'Thursday', label: 'Thursday' },
  { k: 'fri', short: 'Friday', label: 'Friday' },
];

export const WINDOWS = {
  morning: [420, 720],
  afternoon: [720, 1020],
  evening: [1020, 1320],
  any: [0, 1440],
};

export const WINDOW_LABELS = { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening', any: 'Anytime' };

export function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

export function fmt(min) {
  const h = Math.floor(min / 60), m = min % 60;
  const ap = h < 12 || h >= 24 ? 'AM' : 'PM';
  const hh = h % 12 === 0 ? 12 : h % 12;
  return hh + ':' + pad(m) + ' ' + ap;
}

export function dur(min) {
  const h = Math.floor(min / 60), m = min % 60;
  if (h && m) return h + 'h ' + m + 'm';
  if (h) return h + 'h';
  return m + 'm';
}

export function mixHex(hex, t) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  const f = (c) => Math.round(c + (255 - c) * t);
  return '#' + pad(f(r).toString(16)) + pad(f(g).toString(16)) + pad(f(b).toString(16));
}

export const DEFAULT_FIXED = [
  { id: 'f1', title: 'BIO 210 Lecture', days: ['mon', 'wed', 'fri'], start: 540, end: 615 },
  { id: 'f2', title: 'STAT 118 Lecture', days: ['tue', 'thu'], start: 660, end: 735 },
  { id: 'f3', title: 'Campus job — front desk', days: ['tue', 'thu'], start: 840, end: 1080 },
  { id: 'f4', title: 'BIO lab section', days: ['wed'], start: 780, end: 900 },
];

export const DEFAULT_GOALS = [
  { id: 'g1', title: 'Study block', perWeek: 4, minutes: 90, window: 'afternoon' },
  { id: 'g2', title: 'Gym', perWeek: 3, minutes: 60, window: 'morning' },
  { id: 'g3', title: 'Read for fun', perWeek: 2, minutes: 45, window: 'evening' },
  { id: 'g4', title: 'Call home', perWeek: 1, minutes: 30, window: 'evening' },
];

// Places fixed commitments first, then packs goals into the lightest-loaded
// open day/window, in priority order. Returns { blocks, unplaced }.
export function buildSchedule(fixed, goals) {
  const days = DAYS.map((d) => d.k);
  const gs = DAY_START * 60, ge = DAY_END * 60;
  const blocks = [];
  let uid = 0;

  fixed.forEach((f) => f.days.forEach((d) => {
    if (days.indexOf(d) === -1) return;
    blocks.push({ id: 'b' + uid++, title: f.title, day: d, start: f.start, minutes: Math.max(15, f.end - f.start), kind: 'fixed' });
  }));

  const load = {};
  days.forEach((d) => { load[d] = 0; });
  let unplaced = 0;

  goals.forEach((g) => {
    for (let i = 0; i < g.perWeek; i++) {
      const used = {};
      blocks.forEach((b) => { if (b.goalId === g.id) used[b.day] = true; });
      const order = days.filter((d) => !used[d]).sort((a, b) => load[a] - load[b]);
      const win = WINDOWS[g.window] || WINDOWS.any;
      const lo = Math.max(win[0], gs), hi = Math.min(win[1], ge);
      let placed = false;
      for (let di = 0; di < order.length && !placed; di++) {
        const d = order[di];
        for (let t = lo; t + g.minutes <= hi; t += 15) {
          const clash = blocks.some((b) => b.day === d && t < b.start + b.minutes + 10 && b.start < t + g.minutes + 10);
          if (!clash) {
            blocks.push({ id: 'b' + uid++, title: g.title, day: d, start: t, minutes: g.minutes, kind: 'goal', goalId: g.id });
            load[d] += g.minutes;
            placed = true;
            break;
          }
        }
      }
      if (!placed) unplaced++;
    }
  });

  return { blocks, unplaced };
}
