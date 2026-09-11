import { useState } from 'react';
import Header from './components/Header';
import Home from './screens/Home';
import Input from './screens/Input';
import Schedule from './screens/Schedule';
import { DEFAULT_FIXED, DEFAULT_GOALS, buildSchedule } from './lib/scheduler';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [fixed, setFixed] = useState(DEFAULT_FIXED);
  const [goals, setGoals] = useState(DEFAULT_GOALS);
  const [blocks, setBlocks] = useState([]);
  const [unplaced, setUnplaced] = useState(0);
  const [selectedId, setSelectedId] = useState(null);

  function build() {
    const result = buildSchedule(fixed, goals);
    setBlocks(result.blocks);
    setUnplaced(result.unplaced);
    setSelectedId(null);
  }

  function navigate(key) {
    setScreen(key);
  }

  function goToSchedule() {
    build();
    setScreen('schedule');
  }

  function patchBlock(id, patch) {
    setBlocks((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  function removeBlock(id) {
    setBlocks((bs) => bs.filter((b) => b.id !== id));
    setSelectedId(null);
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F7F5F0',
        color: '#1E2724',
        fontFamily: "'Instrument Sans', system-ui, sans-serif",
        fontSize: 15,
        lineHeight: 1.5,
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <Header screen={screen} onNavigate={navigate} />

      {screen === 'home' && <Home onGetStarted={() => navigate('input')} />}

      {screen === 'input' && (
        <Input
          fixed={fixed}
          goals={goals}
          onAddFixed={(item) => setFixed((f) => f.concat([item]))}
          onRemoveFixed={(id) => setFixed((f) => f.filter((x) => x.id !== id))}
          onAddGoal={(item) => setGoals((g) => g.concat([item]))}
          onRemoveGoal={(id) => setGoals((g) => g.filter((x) => x.id !== id))}
          onRaiseGoal={(id) =>
            setGoals((g) => {
              const i = g.findIndex((x) => x.id === id);
              if (i <= 0) return g;
              const arr = g.slice();
              arr.splice(i - 1, 0, arr.splice(i, 1)[0]);
              return arr;
            })
          }
          onBuild={goToSchedule}
        />
      )}

      {screen === 'schedule' && (
        <Schedule
          blocks={blocks}
          unplaced={unplaced}
          goals={goals}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onPatchBlock={patchBlock}
          onRemoveBlock={removeBlock}
          onEditInputs={() => navigate('input')}
          onRebuild={build}
        />
      )}
    </div>
  );
}
