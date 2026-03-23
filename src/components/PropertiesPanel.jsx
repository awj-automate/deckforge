import React, { useState, useCallback, useMemo } from 'react';
import useDeckStore from '../store/deckStore';
import {
  FONTS,
  BLEND_MODES,
  TRANSITIONS,
  ANIMATIONS,
  EASINGS,
  SHAPE_TYPES,
} from '../utils/helpers';

// ─── Inline styles ──────────────────────────────────────────────────────────
const styles = {
  panel: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    background: 'var(--bg-panel, #1a1a2e)',
    color: 'var(--text-primary, #e0e0e0)',
    fontSize: 12,
    fontFamily: 'inherit',
    userSelect: 'none',
    padding: '0 0 24px 0',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px 4px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-muted, #888)',
  },
  chevron: {
    fontSize: 10,
    color: 'var(--text-muted, #888)',
    transition: 'transform 0.15s',
  },
  sectionBody: {
    padding: '4px 14px 8px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    color: 'var(--text-muted, #888)',
    minWidth: 52,
    flexShrink: 0,
  },
  input: {
    width: '100%',
    background: 'var(--bg-input, #12122a)',
    color: 'var(--text-primary, #e0e0e0)',
    border: '1px solid var(--border, #2a2a4a)',
    borderRadius: 4,
    padding: '4px 6px',
    fontSize: 11,
    outline: 'none',
    boxSizing: 'border-box',
  },
  numberInput: {
    width: 60,
    background: 'var(--bg-input, #12122a)',
    color: 'var(--text-primary, #e0e0e0)',
    border: '1px solid var(--border, #2a2a4a)',
    borderRadius: 4,
    padding: '4px 6px',
    fontSize: 11,
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    background: 'var(--bg-input, #12122a)',
    color: 'var(--text-primary, #e0e0e0)',
    border: '1px solid var(--border, #2a2a4a)',
    borderRadius: 4,
    padding: '4px 6px',
    fontSize: 11,
    outline: 'none',
    boxSizing: 'border-box',
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 4,
    border: '1px solid var(--border, #2a2a4a)',
    cursor: 'pointer',
    padding: 0,
    overflow: 'hidden',
    flexShrink: 0,
    position: 'relative',
  },
  colorInput: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    opacity: 0,
  },
  slider: {
    flex: 1,
    accentColor: 'var(--accent, #6366F1)',
    height: 4,
  },
  textarea: {
    width: '100%',
    minHeight: 60,
    resize: 'vertical',
    background: 'var(--bg-input, #12122a)',
    color: 'var(--text-primary, #e0e0e0)',
    border: '1px solid var(--border, #2a2a4a)',
    borderRadius: 4,
    padding: '6px 8px',
    fontSize: 11,
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  iconBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 4,
    border: '1px solid var(--border, #2a2a4a)',
    background: 'var(--bg-input, #12122a)',
    color: 'var(--text-primary, #e0e0e0)',
    cursor: 'pointer',
    fontSize: 12,
    flexShrink: 0,
    padding: 0,
  },
  iconBtnActive: {
    background: 'var(--accent, #6366F1)',
    borderColor: 'var(--accent, #6366F1)',
    color: '#fff',
  },
  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  divider: {
    height: 1,
    background: 'var(--border, #2a2a4a)',
    margin: '6px 14px',
  },
};

// ─── Tiny sub-components ─────────────────────────────────────────────────────

function ColorPicker({ value, onChange }) {
  return (
    <div style={styles.colorSwatch}>
      <div style={{ width: '100%', height: '100%', background: value || '#000000' }} />
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        style={styles.colorInput}
        title="Pick color"
      />
    </div>
  );
}

function Section({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <div style={styles.sectionHeader} onClick={() => setOpen(!open)}>
        <span style={styles.sectionTitle}>{title}</span>
        <span style={{ ...styles.chevron, transform: open ? 'rotate(0)' : 'rotate(-90deg)' }}>
          &#9662;
        </span>
      </div>
      {open && <div style={styles.sectionBody}>{children}</div>}
    </div>
  );
}

function NumberField({ label, value, onChange, min, max, step = 1, width }) {
  const [local, setLocal] = useState(String(value ?? ''));
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setLocal(String(value ?? ''));
    }
  }, [value]);

  const commit = () => {
    let v = parseFloat(local);
    if (isNaN(v)) { setLocal(String(value ?? '')); return; }
    if (min !== undefined) v = Math.max(min, v);
    if (max !== undefined) v = Math.min(max, v);
    setLocal(String(v));
    onChange(v);
  };

  return (
    <div style={{ ...styles.row, marginBottom: 4 }}>
      {label && <span style={styles.label}>{label}</span>}
      <input
        ref={inputRef}
        type="number"
        style={{ ...styles.numberInput, ...(width ? { width } : {}) }}
        value={local}
        min={min}
        max={max}
        step={step}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') commit(); }}
      />
    </div>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <div style={styles.row}>
      {label && <span style={styles.label}>{label}</span>}
      <select
        style={styles.select}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return <option key={val} value={val}>{lbl}</option>;
        })}
      </select>
    </div>
  );
}

function ToggleButton({ active, title, onClick, children, style: extraStyle }) {
  return (
    <button
      style={{
        ...styles.iconBtn,
        ...(active ? styles.iconBtnActive : {}),
        ...(extraStyle || {}),
      }}
      title={title}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// ─── SLIDE PROPERTIES ────────────────────────────────────────────────────────

function SlideProperties() {
  const currentSlideIndex = useDeckStore((s) => s.currentSlideIndex);
  const slide = useDeckStore((s) => s.deck.slides[s.currentSlideIndex]);
  const updateSlide = useDeckStore((s) => s.updateSlide);

  const bg = slide?.background || { type: 'solid', color: '#1a1a2e' };
  const isGradient = bg.type === 'gradient' || bg.type === 'linear';

  const setBg = useCallback((updates) => {
    updateSlide(currentSlideIndex, { background: { ...bg, ...updates } });
  }, [bg, currentSlideIndex, updateSlide]);

  if (!slide) return null;

  return (
    <>
      <Section title="Slide Background">
        <div style={styles.row}>
          <span style={styles.label}>Type</span>
          <div style={styles.toggleRow}>
            <ToggleButton
              active={!isGradient}
              title="Solid color"
              onClick={() => setBg({ type: 'solid', color: bg.color || bg.colors?.[0] || '#1a1a2e' })}
            >
              Solid
            </ToggleButton>
            <ToggleButton
              active={isGradient}
              title="Gradient"
              onClick={() =>
                setBg({
                  type: 'linear',
                  colors: bg.colors || [bg.color || '#1a1a2e', '#6366F1'],
                  angle: bg.angle ?? 135,
                })
              }
            >
              Grad
            </ToggleButton>
          </div>
        </div>

        {!isGradient && (
          <div style={styles.row}>
            <span style={styles.label}>Color</span>
            <ColorPicker
              value={bg.color || '#1a1a2e'}
              onChange={(c) => setBg({ color: c })}
            />
            <span style={{ fontSize: 10, color: 'var(--text-muted, #888)' }}>{bg.color}</span>
          </div>
        )}

        {isGradient && (
          <>
            <div style={styles.row}>
              <span style={styles.label}>Color 1</span>
              <ColorPicker
                value={(bg.colors && bg.colors[0]) || '#1a1a2e'}
                onChange={(c) => {
                  const cols = [...(bg.colors || ['#1a1a2e', '#6366F1'])];
                  cols[0] = c;
                  setBg({ colors: cols });
                }}
              />
            </div>
            <div style={styles.row}>
              <span style={styles.label}>Color 2</span>
              <ColorPicker
                value={(bg.colors && bg.colors[1]) || '#6366F1'}
                onChange={(c) => {
                  const cols = [...(bg.colors || ['#1a1a2e', '#6366F1'])];
                  cols[1] = c;
                  setBg({ colors: cols });
                }}
              />
            </div>
            <NumberField
              label="Angle"
              value={bg.angle ?? 135}
              min={0}
              max={360}
              onChange={(v) => setBg({ angle: v })}
            />
          </>
        )}
      </Section>

      <div style={styles.divider} />

      <Section title="Transition">
        <SelectField
          value={slide.transition || 'none'}
          options={TRANSITIONS}
          onChange={(v) => updateSlide(currentSlideIndex, { transition: v })}
        />
      </Section>

      <div style={styles.divider} />

      <Section title="Slide Notes" defaultOpen={false}>
        <textarea
          style={styles.textarea}
          value={slide.notes || ''}
          placeholder="Speaker notes..."
          onChange={(e) => updateSlide(currentSlideIndex, { notes: e.target.value })}
        />
      </Section>
    </>
  );
}

// ─── ELEMENT PROPERTIES ──────────────────────────────────────────────────────

function ElementProperties() {
  const selectedElementIds = useDeckStore((s) => s.selectedElementIds);
  const slide = useDeckStore((s) => s.deck.slides[s.currentSlideIndex]);
  const updateElementWithUndo = useDeckStore((s) => s.updateElementWithUndo);
  const moveElementZ = useDeckStore((s) => s.moveElementZ);

  const [lockAspect, setLockAspect] = useState(false);

  const elements = useMemo(() => {
    if (!slide) return [];
    return slide.elements.filter((el) => selectedElementIds.includes(el.id));
  }, [slide, selectedElementIds]);

  // For single-element editing we use the first selected
  const el = elements[0];
  if (!el) return null;

  const update = (updates) => updateElementWithUndo(el.id, updates);

  const handleSizeChange = (dim, val) => {
    if (lockAspect && el.width && el.height) {
      const ratio = el.width / el.height;
      if (dim === 'width') {
        update({ width: val, height: Math.round(val / ratio) });
      } else {
        update({ width: Math.round(val * ratio), height: val });
      }
    } else {
      update({ [dim]: val });
    }
  };

  return (
    <>
      {/* ── Common: Transform ── */}
      <Section title="Position & Size">
        <div style={{ display: 'flex', gap: 6 }}>
          <NumberField label="X" value={Math.round(el.x)} onChange={(v) => update({ x: v })} width={52} />
          <NumberField label="Y" value={Math.round(el.y)} onChange={(v) => update({ y: v })} width={52} />
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
          <NumberField
            label="W"
            value={Math.round(el.width)}
            min={1}
            onChange={(v) => handleSizeChange('width', v)}
            width={52}
          />
          <NumberField
            label="H"
            value={Math.round(el.height)}
            min={1}
            onChange={(v) => handleSizeChange('height', v)}
            width={52}
          />
          <ToggleButton
            active={lockAspect}
            title="Lock aspect ratio"
            onClick={() => setLockAspect(!lockAspect)}
            style={{ marginBottom: 4 }}
          >
            {lockAspect ? '\u{1F517}' : '\u26D3\uFE0F'}
          </ToggleButton>
        </div>
        <NumberField
          label="Rotation"
          value={el.rotation ?? 0}
          min={0}
          max={360}
          onChange={(v) => update({ rotation: v })}
        />
      </Section>

      <div style={styles.divider} />

      {/* ── Common: Appearance ── */}
      <Section title="Appearance">
        <div style={styles.row}>
          <span style={styles.label}>Opacity</span>
          <input
            type="range"
            style={styles.slider}
            min={0}
            max={1}
            step={0.01}
            value={el.opacity ?? 1}
            onChange={(e) => update({ opacity: parseFloat(e.target.value) })}
          />
          <span style={{ fontSize: 10, width: 30, textAlign: 'right' }}>
            {Math.round((el.opacity ?? 1) * 100)}%
          </span>
        </div>
        <SelectField
          label="Blend"
          value={el.blendMode || 'normal'}
          options={BLEND_MODES}
          onChange={(v) => update({ blendMode: v })}
        />
      </Section>

      <div style={styles.divider} />

      {/* ── Common: Layer order ── */}
      <Section title="Layer">
        <div style={{ ...styles.row, gap: 4 }}>
          <ToggleButton title="Bring to front" onClick={() => moveElementZ(el.id, 'front')}>
            &#x21C8;
          </ToggleButton>
          <ToggleButton title="Forward one" onClick={() => moveElementZ(el.id, 'forward')}>
            &#x2191;
          </ToggleButton>
          <ToggleButton title="Backward one" onClick={() => moveElementZ(el.id, 'backward')}>
            &#x2193;
          </ToggleButton>
          <ToggleButton title="Send to back" onClick={() => moveElementZ(el.id, 'back')}>
            &#x21CA;
          </ToggleButton>
          <div style={{ flex: 1 }} />
          <ToggleButton
            active={el.locked}
            title={el.locked ? 'Unlock' : 'Lock'}
            onClick={() => update({ locked: !el.locked })}
          >
            {el.locked ? '\u{1F512}' : '\u{1F513}'}
          </ToggleButton>
          <ToggleButton
            active={el.hidden}
            title={el.hidden ? 'Show' : 'Hide'}
            onClick={() => update({ hidden: !el.hidden })}
          >
            {el.hidden ? '\u{1F648}' : '\u{1F441}'}
          </ToggleButton>
        </div>
      </Section>

      <div style={styles.divider} />

      {/* ── Type-specific ── */}
      {el.type === 'text' && <TextControls el={el} update={update} />}
      {el.type === 'shape' && <ShapeControls el={el} update={update} />}
      {el.type === 'image' && <ImageControls el={el} update={update} />}
      {el.type === 'code' && <CodeControls el={el} update={update} />}

      <div style={styles.divider} />

      {/* ── Animation ── */}
      <AnimationControls el={el} update={update} />
    </>
  );
}

// ─── TEXT CONTROLS ───────────────────────────────────────────────────────────

function TextControls({ el, update }) {
  return (
    <Section title="Text">
      <SelectField
        label="Font"
        value={el.fontFamily || 'DM Sans'}
        options={FONTS}
        onChange={(v) => update({ fontFamily: v })}
      />
      <NumberField
        label="Size"
        value={el.fontSize ?? 24}
        min={1}
        max={400}
        onChange={(v) => update({ fontSize: v })}
      />
      <SelectField
        label="Weight"
        value={el.fontWeight || '400'}
        options={['300', '400', '500', '600', '700']}
        onChange={(v) => update({ fontWeight: v })}
      />
      <div style={styles.row}>
        <span style={styles.label}>Color</span>
        <ColorPicker
          value={el.color || '#FFFFFF'}
          onChange={(c) => update({ color: c })}
        />
        <span style={{ fontSize: 10, color: 'var(--text-muted, #888)' }}>{el.color}</span>
      </div>
      <NumberField
        label="Line H"
        value={el.lineHeight ?? 1.4}
        min={0.5}
        max={3}
        step={0.1}
        onChange={(v) => update({ lineHeight: v })}
      />
      <NumberField
        label="Spacing"
        value={el.letterSpacing ?? 0}
        min={-5}
        max={20}
        step={0.5}
        onChange={(v) => update({ letterSpacing: v })}
      />

      {/* Text align */}
      <div style={styles.row}>
        <span style={styles.label}>Align</span>
        <div style={styles.toggleRow}>
          {['left', 'center', 'right', 'justify'].map((a) => (
            <ToggleButton
              key={a}
              active={el.textAlign === a}
              title={a}
              onClick={() => update({ textAlign: a })}
            >
              {a === 'left' && '\u2261'}
              {a === 'center' && '\u2261'}
              {a === 'right' && '\u2261'}
              {a === 'justify' && '\u2261'}
            </ToggleButton>
          ))}
        </div>
      </div>

      {/* Vertical align */}
      <div style={styles.row}>
        <span style={styles.label}>V-Align</span>
        <div style={styles.toggleRow}>
          {['top', 'middle', 'bottom'].map((a) => (
            <ToggleButton
              key={a}
              active={el.verticalAlign === a}
              title={a}
              onClick={() => update({ verticalAlign: a })}
            >
              {a[0].toUpperCase()}
            </ToggleButton>
          ))}
        </div>
      </div>

      {/* Decorations */}
      <div style={styles.row}>
        <span style={styles.label}>Style</span>
        <div style={styles.toggleRow}>
          <ToggleButton
            active={el.fontWeight === '700'}
            title="Bold"
            onClick={() => update({ fontWeight: el.fontWeight === '700' ? '400' : '700' })}
          >
            <b>B</b>
          </ToggleButton>
          <ToggleButton
            active={el.fontStyle === 'italic'}
            title="Italic"
            onClick={() =>
              update({ fontStyle: el.fontStyle === 'italic' ? 'normal' : 'italic' })
            }
          >
            <i>I</i>
          </ToggleButton>
          <ToggleButton
            active={el.textDecoration === 'underline'}
            title="Underline"
            onClick={() =>
              update({
                textDecoration: el.textDecoration === 'underline' ? 'none' : 'underline',
              })
            }
          >
            <u>U</u>
          </ToggleButton>
          <ToggleButton
            active={el.textDecoration === 'line-through'}
            title="Strikethrough"
            onClick={() =>
              update({
                textDecoration:
                  el.textDecoration === 'line-through' ? 'none' : 'line-through',
              })
            }
          >
            <s>S</s>
          </ToggleButton>
        </div>
      </div>
    </Section>
  );
}

// ─── SHAPE CONTROLS ──────────────────────────────────────────────────────────

function ShapeControls({ el, update }) {
  const fill = el.fill || { type: 'solid', color: '#6366F1' };
  const border = el.border || { width: 0, color: '#FFFFFF', dash: 'solid' };

  const updateFill = (updates) => update({ fill: { ...fill, ...updates } });
  const updateBorder = (updates) => update({ border: { ...border, ...updates } });

  return (
    <Section title="Shape">
      <SelectField
        label="Shape"
        value={el.shape || 'rectangle'}
        options={SHAPE_TYPES}
        onChange={(v) => update({ shape: v })}
      />

      {/* Fill type */}
      <div style={styles.row}>
        <span style={styles.label}>Fill</span>
        <div style={styles.toggleRow}>
          {[
            { key: 'solid', label: 'Solid' },
            { key: 'linear', label: 'Linear' },
            { key: 'radial', label: 'Radial' },
          ].map((f) => (
            <ToggleButton
              key={f.key}
              active={fill.type === f.key}
              title={f.label}
              onClick={() =>
                updateFill({
                  type: f.key,
                  ...(f.key !== 'solid' && !fill.colors
                    ? { colors: [fill.color || '#6366F1', '#818CF8'] }
                    : {}),
                  ...(f.key === 'solid' && fill.colors
                    ? { color: fill.colors[0] || '#6366F1' }
                    : {}),
                })
              }
            >
              {f.label[0]}
            </ToggleButton>
          ))}
        </div>
      </div>

      {/* Fill colors */}
      {fill.type === 'solid' && (
        <div style={styles.row}>
          <span style={styles.label}>Color</span>
          <ColorPicker
            value={fill.color || '#6366F1'}
            onChange={(c) => updateFill({ color: c })}
          />
        </div>
      )}
      {(fill.type === 'linear' || fill.type === 'radial') && (
        <>
          <div style={styles.row}>
            <span style={styles.label}>Color 1</span>
            <ColorPicker
              value={(fill.colors && fill.colors[0]) || '#6366F1'}
              onChange={(c) => {
                const cols = [...(fill.colors || ['#6366F1', '#818CF8'])];
                cols[0] = c;
                updateFill({ colors: cols });
              }}
            />
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Color 2</span>
            <ColorPicker
              value={(fill.colors && fill.colors[1]) || '#818CF8'}
              onChange={(c) => {
                const cols = [...(fill.colors || ['#6366F1', '#818CF8'])];
                cols[1] = c;
                updateFill({ colors: cols });
              }}
            />
          </div>
          {fill.type === 'linear' && (
            <NumberField
              label="Angle"
              value={fill.angle ?? 0}
              min={0}
              max={360}
              onChange={(v) => updateFill({ angle: v })}
            />
          )}
        </>
      )}

      {/* Border */}
      <div style={{ ...styles.row, marginTop: 8 }}>
        <span style={{ ...styles.label, fontWeight: 600 }}>Border</span>
      </div>
      <NumberField
        label="Width"
        value={border.width ?? 0}
        min={0}
        max={50}
        onChange={(v) => updateBorder({ width: v })}
      />
      <div style={styles.row}>
        <span style={styles.label}>Color</span>
        <ColorPicker
          value={border.color || '#FFFFFF'}
          onChange={(c) => updateBorder({ color: c })}
        />
      </div>
      <SelectField
        label="Dash"
        value={border.dash || 'solid'}
        options={['solid', 'dashed', 'dotted']}
        onChange={(v) => updateBorder({ dash: v })}
      />

      {/* Corner radius (rectangles only) */}
      {(el.shape === 'rectangle' || !el.shape) && (
        <NumberField
          label="Radius"
          value={el.cornerRadius ?? 0}
          min={0}
          max={200}
          onChange={(v) => update({ cornerRadius: v })}
        />
      )}
    </Section>
  );
}

// ─── IMAGE CONTROLS ──────────────────────────────────────────────────────────

function ImageControls({ el, update }) {
  const shadow = el.shadow || { x: 0, y: 0, blur: 0, spread: 0, color: '#00000080' };
  const updateShadow = (updates) => update({ shadow: { ...shadow, ...updates } });

  return (
    <Section title="Image">
      <SelectField
        label="Fit"
        value={el.objectFit || 'cover'}
        options={['cover', 'contain', 'fill', 'none']}
        onChange={(v) => update({ objectFit: v })}
      />
      <NumberField
        label="Radius"
        value={el.borderRadius ?? 0}
        min={0}
        max={200}
        onChange={(v) => update({ borderRadius: v })}
      />

      <div style={{ ...styles.row, marginTop: 8 }}>
        <span style={{ ...styles.label, fontWeight: 600 }}>Shadow</span>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <NumberField label="X" value={shadow.x ?? 0} onChange={(v) => updateShadow({ x: v })} width={44} />
        <NumberField label="Y" value={shadow.y ?? 0} onChange={(v) => updateShadow({ y: v })} width={44} />
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <NumberField
          label="Blur"
          value={shadow.blur ?? 0}
          min={0}
          onChange={(v) => updateShadow({ blur: v })}
          width={44}
        />
        <NumberField
          label="Spread"
          value={shadow.spread ?? 0}
          onChange={(v) => updateShadow({ spread: v })}
          width={44}
        />
      </div>
      <div style={styles.row}>
        <span style={styles.label}>Color</span>
        <ColorPicker
          value={shadow.color || '#00000080'}
          onChange={(c) => updateShadow({ color: c })}
        />
      </div>
    </Section>
  );
}

// ─── CODE CONTROLS ───────────────────────────────────────────────────────────

const CODE_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'html',
  'css',
  'json',
  'bash',
  'sql',
  'go',
  'rust',
  'java',
  'c',
  'cpp',
  'ruby',
  'php',
  'swift',
  'kotlin',
  'yaml',
  'markdown',
];

function CodeControls({ el, update }) {
  return (
    <Section title="Code">
      <SelectField
        label="Lang"
        value={el.language || 'javascript'}
        options={CODE_LANGUAGES}
        onChange={(v) => update({ language: v })}
      />
      <NumberField
        label="Size"
        value={el.fontSize ?? 14}
        min={8}
        max={48}
        onChange={(v) => update({ fontSize: v })}
      />
      <SelectField
        label="Theme"
        value={el.codeTheme || 'dark'}
        options={['dark', 'light']}
        onChange={(v) => update({ codeTheme: v })}
      />
    </Section>
  );
}

// ─── ANIMATION CONTROLS ─────────────────────────────────────────────────────

function AnimationControls({ el, update }) {
  const anim = el.animation || { type: 'none', duration: 500, delay: 0, easing: 'ease' };

  const updateAnim = (updates) => {
    update({ animation: { ...anim, ...updates } });
  };

  return (
    <Section title="Animation" defaultOpen={false}>
      <SelectField
        label="Type"
        value={anim.type || 'none'}
        options={ANIMATIONS}
        onChange={(v) => updateAnim({ type: v })}
      />
      <NumberField
        label="Duration"
        value={anim.duration ?? 500}
        min={0}
        max={10000}
        step={50}
        onChange={(v) => updateAnim({ duration: v })}
      />
      <NumberField
        label="Delay"
        value={anim.delay ?? 0}
        min={0}
        max={10000}
        step={50}
        onChange={(v) => updateAnim({ delay: v })}
      />
      <SelectField
        label="Easing"
        value={anim.easing || 'ease'}
        options={EASINGS.map((e) => ({ value: e, label: e }))}
        onChange={(v) => updateAnim({ easing: v })}
      />
    </Section>
  );
}

// ─── MAIN PANEL ──────────────────────────────────────────────────────────────

function PropertiesPanel() {
  const selectedElementIds = useDeckStore((s) => s.selectedElementIds);
  const hasSelection = selectedElementIds.length > 0;

  return (
    <div style={styles.panel}>
      <div
        style={{
          padding: '12px 14px 6px',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--text-primary, #e0e0e0)',
          borderBottom: '1px solid var(--border, #2a2a4a)',
          marginBottom: 4,
        }}
      >
        {hasSelection ? 'Element Properties' : 'Slide Properties'}
      </div>

      {hasSelection ? <ElementProperties /> : <SlideProperties />}
    </div>
  );
}

export default PropertiesPanel;
