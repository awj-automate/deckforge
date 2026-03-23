import React, { useState, useRef, useEffect, useCallback } from 'react';
import useDeckStore from '../store/deckStore';

// ========== TOOL DEFINITIONS ==========

const TOOLS = [
  { id: 'select',    label: 'Select',    shortcut: 'V', icon: <path d="M4 2 L4 18 L8 14 L12 20 L15 18 L11 12 L16 12 Z" fill="currentColor"/> },
  { id: 'text',      label: 'Text',      shortcut: 'T', icon: <text x="5" y="16" fontSize="16" fontWeight="bold" fill="currentColor">T</text> },
  { id: 'rectangle', label: 'Rectangle', shortcut: 'R', icon: <rect x="3" y="5" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/> },
  { id: 'circle',    label: 'Circle',    shortcut: '',  icon: <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" fill="none"/> },
  { id: 'triangle',  label: 'Triangle',  shortcut: '',  icon: <polygon points="10,3 18,17 2,17" stroke="currentColor" strokeWidth="1.5" fill="none"/> },
  { id: 'line',      label: 'Line',      shortcut: '',  icon: <line x1="3" y1="17" x2="17" y2="3" stroke="currentColor" strokeWidth="1.5"/> },
  { id: 'arrow',     label: 'Arrow',     shortcut: '',  icon: <><line x1="3" y1="17" x2="17" y2="3" stroke="currentColor" strokeWidth="1.5"/><polyline points="10,3 17,3 17,10" stroke="currentColor" strokeWidth="1.5" fill="none"/></> },
  { id: 'image',     label: 'Image',     shortcut: 'I', icon: <><rect x="3" y="4" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none"/><circle cx="7" cy="8" r="1.5" fill="currentColor"/><polyline points="3,14 7,10 10,13 13,9 17,14" stroke="currentColor" strokeWidth="1.2" fill="none"/></> },
  { id: 'code',      label: 'Code',      shortcut: '',  icon: <><polyline points="6,6 2,10 6,14" stroke="currentColor" strokeWidth="1.5" fill="none"/><polyline points="14,6 18,10 14,14" stroke="currentColor" strokeWidth="1.5" fill="none"/></> },
];

const ZOOM_PRESETS = [
  { label: '50%',  value: 0.5 },
  { label: '75%',  value: 0.75 },
  { label: '100%', value: 1 },
  { label: '125%', value: 1.25 },
  { label: '150%', value: 1.5 },
  { label: '200%', value: 2 },
  { label: 'Fit',  value: 'fit' },
];

const EXPORT_OPTIONS = [
  { label: 'PDF',             id: 'pdf' },
  { label: 'PNG',             id: 'png' },
  { label: 'PNG ZIP',         id: 'pngzip' },
  { label: 'deck.json',       id: 'json' },
  { label: 'Standalone HTML', id: 'html' },
];

// ========== SMALL HELPER COMPONENTS ==========

function ToolBtn({ id, label, shortcut, icon, isActive, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={() => onClick(id)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: 30,
          height: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          borderRadius: 4,
          background: isActive ? '#6366F1' : hovered ? '#333' : 'transparent',
          color: isActive ? '#fff' : '#bbb',
          cursor: 'pointer',
          padding: 0,
          transition: 'background 0.12s ease, color 0.12s ease',
        }}
        aria-label={label}
      >
        <svg width="20" height="20" viewBox="0 0 20 20">{icon}</svg>
      </button>
      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: 6,
          background: '#222',
          color: '#ddd',
          fontSize: 11,
          padding: '3px 8px',
          borderRadius: 4,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          {label}{shortcut ? ` (${shortcut})` : ''}
        </div>
      )}
    </div>
  );
}

function IconButton({ label, onClick, disabled, children, shortcut }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          height: 28,
          minWidth: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          border: 'none',
          borderRadius: 4,
          background: hovered && !disabled ? '#333' : 'transparent',
          color: disabled ? '#555' : '#bbb',
          cursor: disabled ? 'default' : 'pointer',
          padding: '0 6px',
          fontSize: 13,
          fontFamily: 'DM Sans, sans-serif',
          transition: 'background 0.12s ease, color 0.12s ease',
        }}
      >
        {children}
      </button>
      {hovered && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: 6,
          background: '#222',
          color: '#ddd',
          fontSize: 11,
          padding: '3px 8px',
          borderRadius: 4,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          {label}{shortcut ? ` (${shortcut})` : ''}
        </div>
      )}
    </div>
  );
}

function Dropdown({ trigger, children, align = 'left' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex' }}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div style={{
          position: 'absolute',
          top: '100%',
          [align === 'right' ? 'right' : 'left']: 0,
          marginTop: 4,
          background: '#1e1e1e',
          border: '1px solid #333',
          borderRadius: 6,
          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
          zIndex: 9999,
          minWidth: 140,
          padding: '4px 0',
          fontFamily: 'DM Sans, sans-serif',
        }}>
          {typeof children === 'function' ? children(() => setOpen(false)) : children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({ label, onClick, closeDropdown }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { onClick(); closeDropdown(); }}
      style={{
        display: 'block',
        width: '100%',
        padding: '6px 14px',
        border: 'none',
        background: hovered ? '#333' : 'transparent',
        color: '#ddd',
        fontSize: 12,
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      {label}
    </button>
  );
}

// ========== MAIN TOOLBAR ==========

export default function Toolbar() {
  const tool = useDeckStore((s) => s.tool);
  const setTool = useDeckStore((s) => s.setTool);
  const zoom = useDeckStore((s) => s.zoom);
  const setZoom = useDeckStore((s) => s.setZoom);
  const showGrid = useDeckStore((s) => s.showGrid);
  const toggleGrid = useDeckStore((s) => s.toggleGrid);
  const undo = useDeckStore((s) => s.undo);
  const redo = useDeckStore((s) => s.redo);
  const undoStack = useDeckStore((s) => s.undoStack);
  const redoStack = useDeckStore((s) => s.redoStack);
  const saveStatus = useDeckStore((s) => s.saveStatus);
  const deck = useDeckStore((s) => s.deck);
  const updateMeta = useDeckStore((s) => s.updateMeta);
  const setShowSettings = useDeckStore((s) => s.setShowSettings);
  const addElement = useDeckStore((s) => s.addElement);

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');
  const titleInputRef = useRef(null);

  const handleTitleClick = useCallback(() => {
    setTitleValue(deck.meta.title || 'Untitled Deck');
    setEditingTitle(true);
  }, [deck.meta.title]);

  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [editingTitle]);

  const commitTitle = useCallback(() => {
    setEditingTitle(false);
    const trimmed = titleValue.trim();
    if (trimmed && trimmed !== deck.meta.title) {
      updateMeta({ title: trimmed });
    }
  }, [titleValue, deck.meta.title, updateMeta]);

  const handleToolSelect = useCallback((toolId) => {
    if (toolId === 'text') {
      setTool('text');
    } else if (toolId === 'rectangle') {
      setTool('rectangle');
    } else if (toolId === 'circle') {
      setTool('circle');
    } else if (toolId === 'triangle') {
      setTool('triangle');
    } else if (toolId === 'line') {
      setTool('line');
    } else if (toolId === 'arrow') {
      setTool('arrow');
    } else if (toolId === 'image') {
      setTool('image');
    } else if (toolId === 'code') {
      setTool('code');
    } else {
      setTool('select');
    }
  }, [setTool]);

  const handlePresent = useCallback(() => {
    // Save deck to localStorage for present.html to pick up
    try {
      localStorage.setItem('deckforge-present', JSON.stringify(deck));
    } catch (e) {
      // ignore
    }
    window.open('present.html', '_blank');
  }, [deck]);

  const handleExport = useCallback((format) => {
    switch (format) {
      case 'json': {
        const blob = new Blob([JSON.stringify(deck, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${deck.meta.title || 'deck'}.json`;
        a.click();
        URL.revokeObjectURL(url);
        break;
      }
      case 'html': {
        // Create a self-contained HTML file with deck data embedded
        const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${deck.meta.title || 'Presentation'}</title>
<style>body{margin:0;background:#000;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;}
.slide{width:960px;height:540px;position:relative;overflow:hidden;}</style></head>
<body><div class="slide" id="slide"></div>
<script>const deck=${JSON.stringify(deck)};let i=0;
function render(){const s=deck.slides[i];if(!s)return;
document.getElementById('slide').style.background=s.background?.color||'#1a1a2e';
document.getElementById('slide').innerHTML=s.elements.map(e=>'<div style="position:absolute;left:'+e.x+'px;top:'+e.y+'px;width:'+e.width+'px;height:'+e.height+'px;color:'+(e.color||'#fff')+';font-size:'+(e.fontSize||16)+'px">'+(e.content||'')+'</div>').join('');}
render();document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key===' '){i=Math.min(i+1,deck.slides.length-1);render();}
if(e.key==='ArrowLeft'){i=Math.max(i-1,0);render();}});</script></body></html>`;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${deck.meta.title || 'presentation'}.html`;
        a.click();
        URL.revokeObjectURL(url);
        break;
      }
      case 'pdf':
      case 'png':
      case 'pngzip':
        // These require canvas rendering - emit a custom event for the main app to handle
        window.dispatchEvent(new CustomEvent('deckforge-export', { detail: { format } }));
        break;
      default:
        break;
    }
  }, [deck]);

  const handleZoomSelect = useCallback((preset) => {
    if (preset === 'fit') {
      // Approximate fit: assume a typical canvas area of ~700px wide
      setZoom(0.85);
    } else {
      setZoom(preset);
    }
  }, [setZoom]);

  const saveLabel = saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Unsaved changes';
  const saveColor = saveStatus === 'saved' ? '#4ade80' : saveStatus === 'saving' ? '#facc15' : '#f87171';

  return (
    <div style={{
      height: 40,
      minHeight: 40,
      background: '#1a1a1a',
      borderBottom: '1px solid #2a2a2a',
      display: 'flex',
      alignItems: 'center',
      padding: '0 10px',
      gap: 6,
      fontFamily: 'DM Sans, sans-serif',
      userSelect: 'none',
    }}>
      {/* ===== LEFT SECTION ===== */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flexShrink: 0 }}>
        {/* Logo */}
        <span style={{
          fontWeight: 700,
          fontSize: 14,
          color: '#6366F1',
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
        }}>
          DeckForge
        </span>

        {/* Divider */}
        <div style={{ width: 1, height: 18, background: '#333' }} />

        {/* Editable title */}
        {editingTitle ? (
          <input
            ref={titleInputRef}
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitTitle();
              if (e.key === 'Escape') setEditingTitle(false);
            }}
            style={{
              background: '#2a2a2a',
              border: '1px solid #6366F1',
              borderRadius: 3,
              color: '#eee',
              fontSize: 13,
              padding: '2px 6px',
              width: 180,
              outline: 'none',
              fontFamily: 'DM Sans, sans-serif',
            }}
          />
        ) : (
          <span
            onClick={handleTitleClick}
            style={{
              color: '#ccc',
              fontSize: 13,
              cursor: 'pointer',
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title="Click to rename"
          >
            {deck.meta.title || 'Untitled Deck'}
          </span>
        )}
      </div>

      {/* ===== CENTER SECTION ===== */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        {TOOLS.map((t) => (
          <ToolBtn
            key={t.id}
            id={t.id}
            label={t.label}
            shortcut={t.shortcut}
            icon={t.icon}
            isActive={tool === t.id}
            onClick={handleToolSelect}
          />
        ))}

        {/* Separator */}
        <div style={{ width: 1, height: 18, background: '#333', margin: '0 6px' }} />

        {/* Undo */}
        <IconButton label="Undo" shortcut="Ctrl+Z" onClick={undo} disabled={undoStack.length === 0}>
          <svg width="16" height="16" viewBox="0 0 20 20">
            <path d="M4 10 L8 6 L8 9 L14 9 C16 9 17 10.5 17 12 C17 13.5 16 15 14 15 L12 15" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
        </IconButton>

        {/* Redo */}
        <IconButton label="Redo" shortcut="Ctrl+Shift+Z" onClick={redo} disabled={redoStack.length === 0}>
          <svg width="16" height="16" viewBox="0 0 20 20" style={{ transform: 'scaleX(-1)' }}>
            <path d="M4 10 L8 6 L8 9 L14 9 C16 9 17 10.5 17 12 C17 13.5 16 15 14 15 L12 15" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          </svg>
        </IconButton>
      </div>

      {/* ===== RIGHT SECTION ===== */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {/* Zoom dropdown */}
        <Dropdown
          align="right"
          trigger={
            <IconButton label="Zoom">
              <span style={{ fontSize: 11, minWidth: 36, textAlign: 'center' }}>
                {Math.round(zoom * 100)}%
              </span>
            </IconButton>
          }
        >
          {(close) => (
            ZOOM_PRESETS.map((p) => (
              <DropdownItem
                key={p.label}
                label={p.label}
                onClick={() => handleZoomSelect(p.value)}
                closeDropdown={close}
              />
            ))
          )}
        </Dropdown>

        {/* Grid toggle */}
        <IconButton label="Toggle Grid" shortcut="G" onClick={toggleGrid}>
          <svg width="16" height="16" viewBox="0 0 20 20">
            <rect x="2" y="2" width="7" height="7" stroke="currentColor" strokeWidth="1.2" fill={showGrid ? '#6366F1' : 'none'} rx="1"/>
            <rect x="11" y="2" width="7" height="7" stroke="currentColor" strokeWidth="1.2" fill={showGrid ? '#6366F1' : 'none'} rx="1"/>
            <rect x="2" y="11" width="7" height="7" stroke="currentColor" strokeWidth="1.2" fill={showGrid ? '#6366F1' : 'none'} rx="1"/>
            <rect x="11" y="11" width="7" height="7" stroke="currentColor" strokeWidth="1.2" fill={showGrid ? '#6366F1' : 'none'} rx="1"/>
          </svg>
        </IconButton>

        {/* Save status */}
        <div style={{
          fontSize: 10,
          color: saveColor,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          whiteSpace: 'nowrap',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: saveColor, display: 'inline-block',
          }} />
          {saveLabel}
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 18, background: '#333' }} />

        {/* Present button */}
        <IconButton label="Present" shortcut="Ctrl+Shift+P" onClick={handlePresent}>
          <svg width="16" height="16" viewBox="0 0 20 20">
            <polygon points="6,4 16,10 6,16" fill="currentColor"/>
          </svg>
          <span style={{ fontSize: 11 }}>Present</span>
        </IconButton>

        {/* Export dropdown */}
        <Dropdown
          align="right"
          trigger={
            <IconButton label="Export">
              <svg width="14" height="14" viewBox="0 0 20 20">
                <path d="M10 3 L10 13 M6 9 L10 13 L14 9 M4 16 L16 16" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <span style={{ fontSize: 11 }}>Export</span>
            </IconButton>
          }
        >
          {(close) => (
            EXPORT_OPTIONS.map((opt) => (
              <DropdownItem
                key={opt.id}
                label={opt.label}
                onClick={() => handleExport(opt.id)}
                closeDropdown={close}
              />
            ))
          )}
        </Dropdown>

        {/* Settings gear */}
        <IconButton label="Settings" onClick={() => setShowSettings(true)}>
          <svg width="16" height="16" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.3" fill="none"/>
            <path d="M10 2 L10 4 M10 16 L10 18 M2 10 L4 10 M16 10 L18 10 M4.2 4.2 L5.6 5.6 M14.4 14.4 L15.8 15.8 M15.8 4.2 L14.4 5.6 M5.6 14.4 L4.2 15.8" stroke="currentColor" strokeWidth="1.3"/>
          </svg>
        </IconButton>
      </div>
    </div>
  );
}
