const STEPS = [
  { key: 'home', label: 'Start' },
  { key: 'input', label: 'Your inputs' },
  { key: 'schedule', label: 'Your week' },
];

export default function Header({ screen, onNavigate }) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        padding: '20px 40px',
        borderBottom: '1px solid #E6E2D9',
        flexWrap: 'wrap',
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        onClick={() => onNavigate('home')}
      >
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#35665A' }} />
        <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 22, letterSpacing: '0.01em' }}>
          Cadence
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {STEPS.map((s) => (
          <div
            key={s.key}
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
            onClick={() => onNavigate(s.key)}
          >
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: screen === s.key ? '#1E2724' : '#A3A79F',
              }}
            >
              {s.label}
            </div>
            <div style={{ width: 22, height: 1, background: '#DCD7CC' }} />
          </div>
        ))}
      </div>
    </header>
  );
}
