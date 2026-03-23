import { useState } from 'react';
import useDeckStore from '../store/deckStore';

export default function FindReplace() {
  const { setShowFindReplace, findAndReplace, deck } = useDeckStore();
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [results, setResults] = useState(null);

  const handlePreview = () => {
    if (!find) return;
    const affected = [];
    deck.slides.forEach((slide, si) => {
      slide.elements.forEach(el => {
        if (el.content && el.content.includes(find)) {
          if (!affected.includes(si)) affected.push(si);
        }
      });
    });
    setResults(affected);
  };

  const handleReplace = () => {
    if (!find) return;
    const affected = findAndReplace(find, replace);
    setResults(affected);
    if (affected.length > 0) {
      setFind('');
      setReplace('');
      setResults(null);
      setShowFindReplace(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShowFindReplace(false)}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>Find & Replace</h2>
          <button
            onClick={() => setShowFindReplace(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: 18, padding: 4 }}
          >✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          <input
            type="text"
            placeholder="Find..."
            value={find}
            onChange={e => { setFind(e.target.value); setResults(null); }}
            onKeyDown={e => e.key === 'Enter' && handlePreview()}
            style={{ width: '100%', padding: '8px 12px' }}
            autoFocus
          />
          <input
            type="text"
            placeholder="Replace with..."
            value={replace}
            onChange={e => setReplace(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleReplace()}
            style={{ width: '100%', padding: '8px 12px' }}
          />
        </div>

        {results !== null && (
          <div style={{
            padding: '8px 12px',
            background: 'var(--bg-surface)',
            borderRadius: 6,
            fontSize: 12,
            color: results.length > 0 ? 'var(--text-secondary)' : 'var(--text-tertiary)',
            marginBottom: 12,
          }}>
            {results.length > 0
              ? `Found in ${results.length} slide${results.length > 1 ? 's' : ''}: ${results.map(i => `#${i + 1}`).join(', ')}`
              : 'No matches found'
            }
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button
            onClick={handlePreview}
            style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border-color)',
              borderRadius: 6, color: 'var(--text-secondary)', padding: '8px 16px', fontSize: 12,
            }}
          >Preview</button>
          <button
            onClick={handleReplace}
            disabled={!find}
            style={{
              background: find ? 'var(--accent)' : 'var(--bg-surface)',
              border: 'none', borderRadius: 6, color: '#fff',
              padding: '8px 16px', fontSize: 12, fontWeight: 600,
              opacity: find ? 1 : 0.5,
            }}
          >Replace All</button>
        </div>
      </div>
    </div>
  );
}
