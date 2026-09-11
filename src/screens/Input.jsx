import { useState } from 'react';
import { DAYS, DAY_START, DAY_END, WINDOW_LABELS, fmt, dur } from '../lib/scheduler';

const TIME_OPTIONS = (() => {
  const opts = [];
  for (let t = DAY_START * 60; t <= DAY_END * 60; t += 15) opts.push({ value: String(t), label: fmt(t) });
  return opts;
})();
const LENGTH_OPTIONS = [30, 45, 60, 90, 120].map((m) => ({ value: String(m), label: dur(m) }));
const PER_WEEK_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: n === 1 ? 'Once' : n + '×' }));
const WINDOW_KEYS = ['morning', 'afternoon', 'evening', 'any'];

const fieldLabel = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#8A8E85',
  marginBottom: 8,
};

const textInput = {
  width: '100%',
  border: '1px solid #DCD7CC',
  borderRadius: 4,
  background: '#FCFBF8',
  padding: '12px 14px',
  outline: 'none',
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

function chipStyle(on) {
  return {
    border: `1px solid ${on ? '#35665A' : '#DCD7CC'}`,
    background: on ? '#35665A' : '#FCFBF8',
    color: on ? '#FFFFFF' : '#55605B',
    borderRadius: 999,
    padding: '8px 14px',
    fontSize: 13,
    cursor: 'pointer',
  };
}

export default function Input({ fixed, goals, onAddFixed, onRemoveFixed, onAddGoal, onRemoveGoal, onRaiseGoal, onBuild }) {
  const [draftFixed, setDraftFixed] = useState({ title: '', days: [], start: '540', end: '615' });
  const [draftGoal, setDraftGoal] = useState({ title: '', perWeek: '3', minutes: '60', window: 'morning' });

  function toggleDay(k) {
    setDraftFixed((s) => ({
      ...s,
      days: s.days.includes(k) ? s.days.filter((x) => x !== k) : s.days.concat([k]),
    }));
  }

  function handleFixedStart(e) {
    const v = e.target.value;
    setDraftFixed((s) => ({
      ...s,
      start: v,
      end: Number(s.end) <= Number(v) ? String(Number(v) + 60) : s.end,
    }));
  }

  function addFixed() {
    if (!draftFixed.title.trim() || !draftFixed.days.length) return;
    onAddFixed({
      id: 'f' + Date.now(),
      title: draftFixed.title.trim(),
      days: draftFixed.days,
      start: Number(draftFixed.start),
      end: Math.max(Number(draftFixed.start) + 15, Number(draftFixed.end)),
    });
    setDraftFixed({ title: '', days: [], start: '540', end: '615' });
  }

  function addGoal() {
    if (!draftGoal.title.trim()) return;
    onAddGoal({
      id: 'g' + Date.now(),
      title: draftGoal.title.trim(),
      perWeek: Number(draftGoal.perWeek),
      minutes: Number(draftGoal.minutes),
      window: draftGoal.window,
    });
    setDraftGoal({ title: '', perWeek: '3', minutes: '60', window: 'morning' });
  }

  const inputSummary =
    fixed.length + (fixed.length === 1 ? ' fixed commitment' : ' fixed commitments') +
    ' · ' + goals.length + (goals.length === 1 ? ' goal' : ' goals') + ' to place';

  return (
    <>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '56px 40px 140px' }}>
        <div style={{ maxWidth: '62ch', marginBottom: 44 }}>
          <h2 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400, fontSize: 40, lineHeight: 1.12, margin: '0 0 12px' }}>
            What's already set, and what you want to make room for.
          </h2>
          <p style={{ fontSize: 16, color: '#55605B', margin: 0 }}>
            Add the hours you can't move first. Then the goals you'd like the week to protect.
          </p>
        </div>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 28, alignItems: 'start' }}
          className="input-grid"
        >
          <section style={{ border: '1px solid #E6E2D9', borderRadius: 6, background: '#FFFFFF', padding: 26 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8A8E85' }}>
                Step 1
              </div>
              <h3 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400, fontSize: 26, margin: 0 }}>
                Fixed hours
              </h3>
            </div>
            <p style={{ fontSize: 13, color: '#77807B', margin: '0 0 22px' }}>
              Classes, shifts, standing meetings, commutes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input
                value={draftFixed.title}
                onChange={(e) => setDraftFixed((s) => ({ ...s, title: e.target.value }))}
                placeholder="e.g. BIO 210 Lecture"
                style={textInput}
                onFocus={(e) => { e.target.style.borderColor = '#35665A'; e.target.style.background = '#FFFFFF'; }}
                onBlur={(e) => { e.target.style.borderColor = '#DCD7CC'; e.target.style.background = '#FCFBF8'; }}
              />
              <div>
                <div style={fieldLabel}>Days</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {DAYS.map((d) => (
                    <button key={d.k} onClick={() => toggleDay(d.k)} style={chipStyle(draftFixed.days.includes(d.k))}>
                      {d.short.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                <label style={{ flex: 1, display: 'block' }}>
                  <div style={fieldLabel}>Starts</div>
                  <select value={draftFixed.start} onChange={handleFixedStart} style={selectInput}>
                    {TIME_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </label>
                <label style={{ flex: 1, display: 'block' }}>
                  <div style={fieldLabel}>Ends</div>
                  <select value={draftFixed.end} onChange={(e) => setDraftFixed((s) => ({ ...s, end: e.target.value }))} style={selectInput}>
                    {TIME_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </label>
                <button
                  onClick={addFixed}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#16302A')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#23443C')}
                  style={{ border: '1px solid #23443C', background: '#23443C', color: '#F7F5F0', borderRadius: 4, padding: '11px 20px', fontWeight: 500, cursor: 'pointer' }}
                >
                  Add
                </button>
              </div>
            </div>

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #EFEBE3', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {fixed.map((f) => (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 4px', borderBottom: '1px solid #F3F0EA' }}>
                  <div style={{ width: 3, alignSelf: 'stretch', background: '#2A332F', borderRadius: 2 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500 }}>{f.title}</div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#8A8E85', marginTop: 2 }}>
                      {f.days.map((k) => (DAYS.find((d) => d.k === k) || {}).short).map((x) => (x ? x.slice(0, 3) : '')).join(' · ')}
                      {'   '}
                      {fmt(f.start)} – {fmt(f.end)}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveFixed(f.id)}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#8C3A2B')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#A3A79F')}
                    style={{ border: 'none', background: 'none', color: '#A3A79F', fontSize: 12, cursor: 'pointer', padding: '4px 6px' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section style={{ border: '1px solid #E6E2D9', borderRadius: 6, background: '#FFFFFF', padding: 26 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8A8E85' }}>
                Step 2
              </div>
              <h3 style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400, fontSize: 26, margin: 0 }}>
                Goals to fit in
              </h3>
            </div>
            <p style={{ fontSize: 13, color: '#77807B', margin: '0 0 22px' }}>
              Studying, gym, hobbies, people you want to see. Top of the list gets placed first.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input
                value={draftGoal.title}
                onChange={(e) => setDraftGoal((s) => ({ ...s, title: e.target.value }))}
                placeholder="e.g. Gym"
                style={textInput}
                onFocus={(e) => { e.target.style.borderColor = '#35665A'; e.target.style.background = '#FFFFFF'; }}
                onBlur={(e) => { e.target.style.borderColor = '#DCD7CC'; e.target.style.background = '#FCFBF8'; }}
              />
              <div style={{ display: 'flex', gap: 12 }}>
                <label style={{ flex: 1, display: 'block' }}>
                  <div style={fieldLabel}>Times a week</div>
                  <select value={draftGoal.perWeek} onChange={(e) => setDraftGoal((s) => ({ ...s, perWeek: e.target.value }))} style={selectInput}>
                    {PER_WEEK_OPTIONS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </label>
                <label style={{ flex: 1, display: 'block' }}>
                  <div style={fieldLabel}>Each session</div>
                  <select value={draftGoal.minutes} onChange={(e) => setDraftGoal((s) => ({ ...s, minutes: e.target.value }))} style={selectInput}>
                    {LENGTH_OPTIONS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div>
                <div style={fieldLabel}>Best time of day</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {WINDOW_KEYS.map((w) => (
                    <button
                      key={w}
                      onClick={() => setDraftGoal((s) => ({ ...s, window: w }))}
                      style={chipStyle(draftGoal.window === w)}
                    >
                      {WINDOW_LABELS[w]}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={addGoal}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#EEF3F0')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                style={{ alignSelf: 'flex-start', border: '1px solid #23443C', background: '#FFFFFF', color: '#23443C', borderRadius: 4, padding: '11px 20px', fontWeight: 500, cursor: 'pointer' }}
              >
                Add goal
              </button>
            </div>

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #EFEBE3', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {goals.map((g, i) => (
                <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 4px', borderBottom: '1px solid #F3F0EA' }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#A3A79F', width: 16 }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500 }}>{g.title}</div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#8A8E85', marginTop: 2 }}>
                      {(g.perWeek === 1 ? 'Once' : g.perWeek + '× ')} a week · {dur(g.minutes)} · {WINDOW_LABELS[g.window]}
                    </div>
                  </div>
                  <button
                    onClick={() => onRaiseGoal(g.id)}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#23443C')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#A3A79F')}
                    style={{ border: 'none', background: 'none', color: '#A3A79F', fontSize: 12, cursor: 'pointer', padding: '4px 6px' }}
                  >
                    Raise
                  </button>
                  <button
                    onClick={() => onRemoveGoal(g.id)}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#8C3A2B')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#A3A79F')}
                    style={{ border: 'none', background: 'none', color: '#A3A79F', fontSize: 12, cursor: 'pointer', padding: '4px 6px' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div style={{ position: 'sticky', bottom: 0, background: 'rgba(247, 245, 240, 0.94)', backdropFilter: 'blur(8px)', borderTop: '1px solid #E6E2D9' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 14, color: '#55605B' }}>{inputSummary}</div>
          <button
            onClick={onBuild}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#16302A')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#23443C')}
            style={{ border: 'none', borderRadius: 999, background: '#23443C', color: '#F7F5F0', padding: '15px 32px', fontSize: 16, fontWeight: 500, cursor: 'pointer' }}
          >
            Build my week
          </button>
        </div>
      </div>
    </>
  );
}
