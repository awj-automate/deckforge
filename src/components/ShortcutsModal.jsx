import useDeckStore from '../store/deckStore';

const shortcuts = [
  { category: 'TOOLS', items: [
    ['V', 'Select tool'],
    ['T', 'Add text'],
    ['R', 'Add rectangle'],
    ['I', 'Add image'],
  ]},
  { category: 'EDITING', items: [
    ['Ctrl+Z', 'Undo'],
    ['Ctrl+Shift+Z', 'Redo'],
    ['Ctrl+C', 'Copy'],
    ['Ctrl+V', 'Paste'],
    ['Ctrl+X', 'Cut'],
    ['Ctrl+D', 'Duplicate'],
    ['Delete', 'Delete selected'],
    ['Ctrl+A', 'Select all'],
  ]},
  { category: 'ELEMENTS', items: [
    ['Arrow keys', 'Nudge 1px'],
    ['Shift+Arrow', 'Nudge 10px'],
    ['Ctrl+]', 'Bring forward'],
    ['Ctrl+[', 'Send backward'],
    ['Ctrl+G', 'Group'],
    ['Ctrl+Shift+G', 'Ungroup'],
  ]},
  { category: 'NAVIGATION', items: [
    ['[', 'Previous slide'],
    [']', 'Next slide'],
    ['Ctrl+P', 'Present'],
    ['Ctrl+S', 'Save'],
    ['Space+Drag', 'Pan canvas'],
    ['Ctrl+Scroll', 'Zoom'],
  ]},
  { category: 'OTHER', items: [
    ['Ctrl+Shift+H', 'Find & Replace'],
    ['?', 'Keyboard shortcuts'],
    ['G', 'Toggle grid'],
  ]},
];

export default function ShortcutsModal() {
  const { setShowShortcuts } = useDeckStore();

  return (
    <div className="modal-overlay" onClick={() => setShowShortcuts(false)}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0 }}>Keyboard Shortcuts</h2>
          <button
            onClick={() => setShowShortcuts(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: 18, padding: 4 }}
          >✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {shortcuts.map(group => (
            <div key={group.category}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 2,
                color: 'var(--text-tertiary)', marginBottom: 8,
              }}>{group.category}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {group.items.map(([key, desc]) => (
                  <div key={key} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '4px 0',
                  }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{desc}</span>
                    <kbd style={{
                      background: 'var(--bg-surface)', border: '1px solid var(--border-color)',
                      borderRadius: 4, padding: '2px 8px', fontSize: 11, color: 'var(--text-primary)',
                      fontFamily: 'system-ui', minWidth: 24, textAlign: 'center',
                    }}>{key}</kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
