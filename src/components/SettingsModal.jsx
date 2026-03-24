import { useState } from 'react';
import useDeckStore from '../store/deckStore';
import { FONTS, TRANSITIONS } from '../utils/helpers';

export default function SettingsModal() {
  const { deck, config, setConfig, updateTheme, updateMeta, setShowSettings, _pushUndo } = useDeckStore();
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [title, setTitle] = useState(deck.meta.title);

  const theme = deck.theme;

  const handleSave = () => {
    setConfig({ apiKey });
    updateMeta({ title });
    setShowSettings(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setShowSettings(false)}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0 }}>Settings</h2>
          <button
            onClick={() => setShowSettings(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: 18, padding: 4 }}
          >✕</button>
        </div>

        {/* Deck Title */}
        <Section title="DECK">
          <Row label="Title">
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ width: '100%' }}
            />
          </Row>
        </Section>

        {/* Theme */}
        <Section title="THEME">
          <Row label="Background">
            <input
              type="color"
              value={theme.backgroundDefault}
              onChange={e => updateTheme({ backgroundDefault: e.target.value })}
            />
            <span style={{ color: 'var(--text-tertiary)', fontSize: 11, marginLeft: 8 }}>{theme.backgroundDefault}</span>
          </Row>
          <Row label="Accent 1">
            <input
              type="color"
              value={theme.accent1}
              onChange={e => updateTheme({ accent1: e.target.value })}
            />
            <span style={{ color: 'var(--text-tertiary)', fontSize: 11, marginLeft: 8 }}>{theme.accent1}</span>
          </Row>
          <Row label="Accent 2">
            <input
              type="color"
              value={theme.accent2}
              onChange={e => updateTheme({ accent2: e.target.value })}
            />
            <span style={{ color: 'var(--text-tertiary)', fontSize: 11, marginLeft: 8 }}>{theme.accent2}</span>
          </Row>
          <Row label="Display Font">
            <select
              value={theme.fontDisplay}
              onChange={e => updateTheme({ fontDisplay: e.target.value })}
              style={{ width: '100%' }}
            >
              {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </Row>
          <Row label="Body Font">
            <select
              value={theme.fontBody}
              onChange={e => updateTheme({ fontBody: e.target.value })}
              style={{ width: '100%' }}
            >
              {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </Row>
          <Row label="Mono Font">
            <select
              value={theme.fontMono}
              onChange={e => updateTheme({ fontMono: e.target.value })}
              style={{ width: '100%' }}
            >
              {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </Row>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 11, margin: '4px 0 0' }}>
            These fonts are used for new elements. Use the button below to apply to all existing text.
          </p>
          <button
            onClick={() => {
              _pushUndo('Apply theme fonts');
              const updatedDeck = JSON.parse(JSON.stringify(deck));
              updatedDeck.slides.forEach(slide => {
                slide.elements.forEach(el => {
                  if (el.type === 'text') {
                    // Large text (>=32px) gets display font, smaller gets body font
                    el.fontFamily = (el.fontSize && el.fontSize >= 32) ? theme.fontDisplay : theme.fontBody;
                  }
                  if (el.type === 'code') {
                    el.fontFamily = theme.fontMono;
                  }
                });
              });
              useDeckStore.getState().setDeck(updatedDeck);
            }}
            style={{
              background: 'var(--accent)',
              border: 'none',
              borderRadius: 6,
              color: '#fff',
              padding: '8px 14px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 4,
            }}
          >
            Apply fonts to all existing text
          </button>
        </Section>

        {/* AI */}
        <Section title="AI (CLAUDE API)">
          <Row label="API Key">
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              style={{ width: '100%' }}
            />
          </Row>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 11, margin: '4px 0 0' }}>
            Your key is stored locally and never sent anywhere except the Anthropic API.
          </p>
        </Section>

        {/* Auto-save */}
        <Section title="EDITOR">
          <Row label="Auto-save">
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={config.autoSave}
                onChange={e => setConfig({ autoSave: e.target.checked })}
              />
              <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                Save every 30 seconds
              </span>
            </label>
          </Row>
        </Section>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
          <button
            onClick={() => setShowSettings(false)}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 6,
              color: 'var(--text-secondary)',
              padding: '8px 16px',
              fontSize: 13,
            }}
          >Cancel</button>
          <button
            onClick={handleSave}
            style={{
              background: 'var(--accent)',
              border: 'none',
              borderRadius: 6,
              color: '#fff',
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 600,
            }}
          >Save</button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 2,
        color: 'var(--text-tertiary)',
        marginBottom: 10,
        paddingBottom: 6,
        borderBottom: '1px solid var(--border-color)',
      }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: 12, width: 90, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
        {children}
      </div>
    </div>
  );
}
