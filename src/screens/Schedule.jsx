import { DAYS, DAY_START, DAY_END, PX_PER_HOUR, ACCENT, mixHex, fmt, dur } from '../lib/scheduler';

const TIME_OPTIONS = (() => {
  const opts = [];
  for (let t = DAY_START * 60; t <= DAY_END * 60; t += 15) opts.push({ value: String(t), label: fmt(t) });
  return opts;
})();
const LENGTH_OPTIONS = [30, 45, 60, 90, 120].map((m) => ({ value: String(m), label: dur(m) }));

const fieldLabel = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#8A8E85',
  marginBottom: 7,
};

const selectInput = {
  width: '100%',
  border: '1px solid #DCD7CC',
  borderRadius: 4,
  background: '#FCFBF8',
  padding: '11px 12px',
  outline: 'none',
  cursor: 'pointer',
};

export default function Schedule({ blocks, unplaced, goals, selectedId, onSelect, onPatchBlock, onRemoveBlock, onEditInputs, onRebuild }) {
  const gs = DAY_START, ge = DAY_END;
  const pph = PX_PER_HOUR;
  const goalBg = mixHex(ACCENT, 0.88);
  const goalBorder = mixHex(ACCENT, 0.62);

  const week = (() => {
    return DAYS.map((d) => {
      const items = blocks.filter((b) => b.day === d.k).sort((a, b) => a.start - b.start);
      const lanes = [];
      items.forEach((b) => {
        let li = 0;
        while (lanes[li] && lanes[li] > b.start) li++;
        lanes[li] = b.start + b.minutes;
        b._lane = li;
      });
      const laneCount = Math.max(1, lanes.length);
      const goalMin = items.filter((b) => b.kind === 'goal').reduce((a, b) => a + b.minutes, 0);
      return {
        short: d.short.slice(0, 3),
        load: items.length ? items.length + ' blocks · ' + dur(goalMin) + ' for you' : 'Open',
        blocks: items.map((b) => {
          const w = 100 / laneCount;
          const isGoal = b.kind === 'goal';
          return {
            id: b.id,
            title: b.title,
            timeLabel: fmt(b.start) + ' – ' + fmt(b.start + b.minutes),
            top: ((b.start - gs * 60) / 60) * pph,
            height: Math.max(26, (b.minutes / 60) * pph - 3),
            left: `calc(${b._lane * w}% + 3px)`,
            width: `calc(${w}% - 6px)`,
            bg: isGoal ? goalBg : '#F7F5F0',
            border: isGoal ? goalBorder : '#E0DCD2',
            bar: isGoal ? ACCENT : '#2A332F',
            fg: isGoal ? '#1B302A' : '#1E2724',
            subFg: isGoal ? '#4A625A' : '#77807B',
            selected: selectedId === b.id,
          };
        }),
      };
    });
  })();

  const hourLines = [];
  for (let h = gs; h <= ge; h++) hourLines.push({ label: fmt(h * 60).replace(':00', ''), top: (h - gs) * pph });

  const tally = goals.map((g) => {
    const mins = blocks.filter((b) => b.goalId === g.id).reduce((a, b) => a + b.minutes, 0);
    const n = blocks.filter((b) => b.goalId === g.id).length;
    return { key: g.id, title: g.title, dot: ACCENT, amount: n + '× · ' + dur(mins) };
  });
  const fixedMins = blocks.filter((b) => b.kind === 'fixed').reduce((a, b) => a + b.minutes, 0);
  tally.unshift({ key: 'fixed', title: 'Fixed hours', dot: '#2A332F', amount: dur(fixedMins) });

  const selBlock = blocks.find((b) => b.id === selectedId) || null;
  const gridColumns = `52px repeat(${DAYS.length}, minmax(0, 1fr))`;
  const gridHeight = (ge - gs) * pph;

  const scheduleNote = unplaced > 0
    ? `Your fixed hours are locked in and your goals are placed around them. ${unplaced} session${unplaced === 1 ? '' : 's'} couldn't fit in its preferred window — widen the time of day or shorten it.`
    : 'Your fixed hours are locked in first. Goals are placed around them, in the part of the day you asked for, higher priorities first.';

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '48px 40px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap', marginBottom: 28 }}>
        <div style={{ maxWidth: '58ch' }}>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400, fontSize: 40, lineHeight: 1.12, margin: '0 0 10px' }}>
            Here's your week.
          </h2>
          <p style={{ fontSize: 16, color: '#55605B', margin: 0 }}>{scheduleNote}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onEditInputs}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#23443C')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#DCD7CC')}
            style={{ border: '1px solid #DCD7CC', background: '#FFFFFF', color: '#1E2724', borderRadius: 999, padding: '12px 22px', cursor: 'pointer' }}
          >
            Edit inputs
          </button>
          <button
            onClick={onRebuild}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#EEF3F0')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
            style={{ border: '1px solid #23443C', background: '#FFFFFF', color: '#23443C', borderRadius: 999, padding: '12px 22px', fontWeight: 500, cursor: 'pointer' }}
          >
            Rebuild
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 296px', gap: 24, alignItems: 'start' }} className="schedule-grid">
        <div style={{ border: '1px solid #E6E2D9', borderRadius: 6, background: '#FFFFFF', overflow: 'hidden', overflowX: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '14px 16px', borderBottom: '1px solid #E6E2D9', minWidth: 560 }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8A8E85' }}>
              Key
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#55605B' }}>
              <div style={{ width: 9, height: 9, borderRadius: 2, background: '#2A332F' }} />
              Fixed
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#55605B' }}>
              <div style={{ width: 9, height: 9, borderRadius: 2, background: ACCENT }} />
              Your goals
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: gridColumns, borderBottom: '1px solid #E6E2D9', minWidth: 560 }}>
            <div />
            {week.map((d) => (
              <div key={d.short} style={{ padding: '14px 12px', borderLeft: '1px solid #EFEBE3' }}>
                <div style={{ fontWeight: 500 }}>{d.short}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#8A8E85', marginTop: 2 }}>{d.load}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: gridColumns, minWidth: 560 }}>
            <div style={{ position: 'relative', height: gridHeight }}>
              {hourLines.map((h) => (
                <div
                  key={h.label + h.top}
                  style={{ position: 'absolute', top: h.top, right: 10, transform: 'translateY(-50%)', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#A3A79F' }}
                >
                  {h.label}
                </div>
              ))}
            </div>
            {week.map((d, di) => (
              <div key={di} style={{ position: 'relative', height: gridHeight, borderLeft: '1px solid #EFEBE3' }}>
                {hourLines.map((h) => (
                  <div key={h.top} style={{ position: 'absolute', left: 0, right: 0, top: h.top, height: 1, background: '#F3F0EA' }} />
                ))}
                {d.blocks.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => onSelect(b.id)}
                    style={{
                      position: 'absolute',
                      top: b.top,
                      height: b.height,
                      left: b.left,
                      width: b.width,
                      background: b.bg,
                      border: `1px solid ${b.border}`,
                      borderLeft: `3px solid ${b.bar}`,
                      borderRadius: 4,
                      padding: '7px 9px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      boxShadow: b.selected ? `0 0 0 2px ${ACCENT}` : 'none',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 500, color: b.fg, lineHeight: 1.25 }}>{b.title}</div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: b.subFg, marginTop: 3 }}>{b.timeLabel}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {selBlock ? (
            <div style={{ border: '1px solid #DCD7CC', borderRadius: 6, background: '#FFFFFF', padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8A8E85' }}>
                  Edit block
                </div>
                <button
                  onClick={() => onSelect(null)}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#1E2724')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#A3A79F')}
                  style={{ border: 'none', background: 'none', color: '#A3A79F', fontSize: 12, cursor: 'pointer' }}
                >
                  Done
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input
                  value={selBlock.title}
                  onChange={(e) => onPatchBlock(selBlock.id, { title: e.target.value })}
                  style={{ width: '100%', border: '1px solid #DCD7CC', borderRadius: 4, background: '#FCFBF8', padding: '11px 12px', outline: 'none' }}
                  onFocus={(e) => { e.target.style.borderColor = '#35665A'; e.target.style.background = '#FFFFFF'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#DCD7CC'; e.target.style.background = '#FCFBF8'; }}
                />
                <label style={{ display: 'block' }}>
                  <div style={fieldLabel}>Day</div>
                  <select value={selBlock.day} onChange={(e) => onPatchBlock(selBlock.id, { day: e.target.value })} style={selectInput}>
                    {DAYS.map((d) => (
                      <option key={d.k} value={d.k}>{d.label}</option>
                    ))}
                  </select>
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <label style={{ flex: 1, display: 'block' }}>
                    <div style={fieldLabel}>Starts</div>
                    <select
                      value={String(selBlock.start)}
                      onChange={(e) => onPatchBlock(selBlock.id, { start: Number(e.target.value) })}
                      style={selectInput}
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </label>
                  <label style={{ flex: 1, display: 'block' }}>
                    <div style={fieldLabel}>Length</div>
                    <select
                      value={String(selBlock.minutes)}
                      onChange={(e) => onPatchBlock(selBlock.id, { minutes: Number(e.target.value) })}
                      style={selectInput}
                    >
                      {LENGTH_OPTIONS.map((m) => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <button
                  onClick={() => onRemoveBlock(selBlock.id)}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#FBF2F0')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                  style={{ border: '1px solid #E3D5D1', background: '#FFFFFF', color: '#8C3A2B', borderRadius: 4, padding: '10px 16px', cursor: 'pointer' }}
                >
                  Remove from week
                </button>
              </div>
            </div>
          ) : (
            <div style={{ border: '1px solid #E6E2D9', borderRadius: 6, background: '#FFFFFF', padding: 20 }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8A8E85', marginBottom: 12 }}>
                Yours to adjust
              </div>
              <div style={{ fontSize: 14, color: '#55605B', lineHeight: 1.6 }}>
                Tap any block to rename it, move it to another day, or change how long it runs. Your fixed hours stay put unless you move them.
              </div>
            </div>
          )}

          <div style={{ border: '1px solid #E6E2D9', borderRadius: 6, background: '#FFFFFF', padding: 20 }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8A8E85', marginBottom: 14 }}>
              This week holds
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {tally.map((t) => (
                <div key={t.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 9, height: 9, borderRadius: 2, background: t.dot }} />
                  <div style={{ flex: 1, minWidth: 0, fontSize: 14 }}>{t.title}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#77807B' }}>{t.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
