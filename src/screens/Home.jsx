const PREVIEW_COLUMNS = [
  { day: 'M', heights: [30, 54, 22], kinds: ['goal', 'fixed', 'goal'] },
  { day: 'T', heights: [44, 26, 38], kinds: ['fixed', 'goal', 'fixed'] },
  { day: 'W', heights: [30, 34, 48], kinds: ['goal', 'fixed', 'goal'] },
  { day: 'T', heights: [44, 20, 44], kinds: ['fixed', 'goal', 'fixed'] },
  { day: 'F', heights: [30, 40, 28], kinds: ['goal', 'fixed', 'goal'] },
];

export default function Home({ onGetStarted }) {
  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', padding: '88px 40px 96px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
          gap: 72,
          alignItems: 'center',
        }}
        className="home-grid"
      >
        <div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#8A8E85',
              marginBottom: 28,
            }}
          >
            New semester · New job · New city
          </div>
          <h1
            style={{
              fontFamily: "'Instrument Serif', Georgia, serif",
              fontWeight: 400,
              fontSize: 58,
              lineHeight: 1.08,
              letterSpacing: '-0.01em',
              margin: '0 0 24px',
              textWrap: 'pretty',
            }}
          >
            Tell us your fixed hours and the goals you want to keep. Get a balanced week in about two minutes.
          </h1>
          <p
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: '#55605B',
              margin: '0 0 36px',
              maxWidth: '46ch',
              textWrap: 'pretty',
            }}
          >
            Classes, shifts, and commutes come first. Everything you care about fitting in gets placed around them,
            in the part of the day you actually have energy for it. Nothing to figure out on your own.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <button
              onClick={onGetStarted}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#16302A')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#23443C')}
              style={{
                border: 'none',
                borderRadius: 999,
                background: '#23443C',
                color: '#F7F5F0',
                padding: '16px 34px',
                fontSize: 16,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Get started
            </button>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#8A8E85' }}>
              No account. Edit anything after.
            </div>
          </div>
        </div>

        <div style={{ border: '1px solid #E6E2D9', borderRadius: 6, background: '#FFFFFF', padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#8A8E85',
              }}
            >
              A week, prioritized
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 7 }}>
            {PREVIEW_COLUMNS.map((col, ci) => (
              <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                <div
                  style={{
                    height: 11,
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 9,
                    color: '#A3A79F',
                    letterSpacing: '0.06em',
                  }}
                >
                  {col.day}
                </div>
                {col.heights.map((h, hi) => (
                  <div
                    key={hi}
                    style={{
                      height: h,
                      borderRadius: 3,
                      background: col.kinds[hi] === 'goal' ? '#E9F0EC' : '#F1EEE7',
                      borderLeft: `2px solid ${col.kinds[hi] === 'goal' ? '#35665A' : '#2A332F'}`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 20, paddingTop: 16, borderTop: '1px solid #EFEBE3' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#55605B' }}>
              <div style={{ width: 9, height: 9, borderRadius: 2, background: '#2A332F' }} />
              Fixed
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#55605B' }}>
              <div style={{ width: 9, height: 9, borderRadius: 2, background: '#35665A' }} />
              Your goals
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 40,
          marginTop: 88,
          paddingTop: 40,
          borderTop: '1px solid #E6E2D9',
        }}
      >
        <div>
          <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 24, marginBottom: 8 }}>
            Prioritized for you
          </div>
          <div style={{ fontSize: 14, color: '#55605B', lineHeight: 1.6 }}>
            The things you can't move anchor the week. Goals fill the gaps in order of how much they matter to you.
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 24, marginBottom: 8 }}>
            Laid out already
          </div>
          <div style={{ fontSize: 14, color: '#55605B', lineHeight: 1.6 }}>
            You start from a finished week, not an empty calendar. Change a block if it doesn't feel right.
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 24, marginBottom: 8 }}>
            Steady by Monday
          </div>
          <div style={{ fontSize: 14, color: '#55605B', lineHeight: 1.6 }}>
            One routine to follow all week, so a new schedule stops being something you have to keep solving.
          </div>
        </div>
      </div>
    </div>
  );
}
