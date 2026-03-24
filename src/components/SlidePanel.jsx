import React, { useState, useRef, useCallback } from 'react';
import useDeckStore from '../store/deckStore';
import { cssBackground } from '../utils/helpers';

const THUMB_WIDTH = 220;
const SLIDE_WIDTH = 960;
const SLIDE_HEIGHT = 540;
const SCALE = THUMB_WIDTH / SLIDE_WIDTH;
const THUMB_HEIGHT = SLIDE_HEIGHT * SCALE;

function SlideThumbnail({ slide, index, isActive, onSelect, onDragStart, onDragOver, onDrop, onContextMenu }) {
  const renderElement = (el) => {
    if (el.hidden) return null;

    const baseStyle = {
      position: 'absolute',
      left: el.x,
      top: el.y,
      width: el.width,
      height: el.height,
      opacity: el.opacity ?? 1,
      transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
      zIndex: el.zIndex || 0,
      overflow: 'hidden',
      pointerEvents: 'none',
    };

    if (el.type === 'text') {
      return (
        <div
          key={el.id}
          style={{
            ...baseStyle,
            color: el.color || '#1A1D23',
            fontSize: el.fontSize || 24,
            fontFamily: el.fontFamily || 'DM Sans',
            fontWeight: el.fontWeight || '400',
            fontStyle: el.fontStyle || 'normal',
            lineHeight: el.lineHeight || 1.4,
            letterSpacing: el.letterSpacing || 0,
            textAlign: el.textAlign || 'left',
            display: 'flex',
            alignItems: el.verticalAlign === 'middle' ? 'center' : el.verticalAlign === 'bottom' ? 'flex-end' : 'flex-start',
            background: el.background ? cssBackground(el.background) : undefined,
            borderRadius: el.cornerRadius || 0,
          }}
        >
          <span style={{ width: '100%' }}>{el.content}</span>
        </div>
      );
    }

    if (el.type === 'shape') {
      const fill = el.fill ? cssBackground(el.fill) : '#3B82F6';
      if (el.shape === 'circle') {
        return (
          <div
            key={el.id}
            style={{
              ...baseStyle,
              background: fill,
              borderRadius: '50%',
              border: el.border ? `${el.border.width || 1}px ${el.border.dash || el.border.style || 'solid'} ${el.border.color || '#fff'}` : undefined,
            }}
          />
        );
      }
      if (el.shape === 'triangle') {
        return (
          <div
            key={el.id}
            style={{
              ...baseStyle,
              background: 'transparent',
              width: 0,
              height: 0,
              borderLeft: `${el.width / 2}px solid transparent`,
              borderRight: `${el.width / 2}px solid transparent`,
              borderBottom: `${el.height}px solid ${typeof fill === 'string' && fill.startsWith('#') ? fill : '#3B82F6'}`,
            }}
          />
        );
      }
      if (el.shape === 'line' || el.shape === 'arrow') {
        return (
          <div
            key={el.id}
            style={{
              ...baseStyle,
              height: 2,
              background: fill,
              top: el.y + el.height / 2,
            }}
          />
        );
      }
      // rectangle default
      return (
        <div
          key={el.id}
          style={{
            ...baseStyle,
            background: fill,
            borderRadius: el.cornerRadius || 0,
            border: el.border ? `${el.border.width || 1}px ${el.border.dash || el.border.style || 'solid'} ${el.border.color || '#fff'}` : undefined,
          }}
        />
      );
    }

    if (el.type === 'image') {
      return (
        <div
          key={el.id}
          style={{
            ...baseStyle,
            borderRadius: el.borderRadius || 0,
          }}
        >
          {el.src ? (
            <img
              src={el.src}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: el.objectFit || 'cover' }}
              draggable={false}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: '#F0F2F5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#9CA3AF', fontSize: 14,
            }}>
              IMG
            </div>
          )}
        </div>
      );
    }

    if (el.type === 'code') {
      return (
        <div
          key={el.id}
          style={{
            ...baseStyle,
            background: '#F0F2F5',
            color: el.color || '#374151',
            fontSize: el.fontSize || 14,
            fontFamily: el.fontFamily || 'Space Mono, monospace',
            padding: 8,
            whiteSpace: 'pre-wrap',
            borderRadius: 4,
          }}
        >
          {el.content}
        </div>
      );
    }

    if (el.type === 'divider') {
      return (
        <div
          key={el.id}
          style={{
            ...baseStyle,
            height: el.thickness || 2,
            background: el.color || '#1A1D23',
          }}
        />
      );
    }

    return null;
  };

  const bg = slide.background ? cssBackground(slide.background) : '#FFFFFF';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      onContextMenu={(e) => onContextMenu(e, index)}
      onClick={() => onSelect(index)}
      style={{
        cursor: 'pointer',
        marginBottom: 8,
        borderRadius: 4,
        border: isActive ? '2px solid #3B82F6' : '2px solid transparent',
        padding: 2,
        transition: 'border-color 0.15s ease',
      }}
    >
      {/* Slide number */}
      <div style={{
        fontSize: 13,
        color: isActive ? '#3B82F6' : '#6B7280',
        marginBottom: 3,
        paddingLeft: 2,
        fontWeight: 500,
        fontFamily: 'DM Sans, sans-serif',
      }}>
        {index + 1}
      </div>

      {/* Miniature slide rendering */}
      <div style={{
        width: THUMB_WIDTH,
        height: THUMB_HEIGHT,
        overflow: 'hidden',
        borderRadius: 3,
        position: 'relative',
        boxShadow: isActive ? '0 0 8px rgba(59,130,246,0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          transform: `scale(${SCALE})`,
          transformOrigin: 'top left',
          background: bg,
          position: 'relative',
        }}>
          {slide.elements.map(renderElement)}
        </div>
      </div>

      {/* Notes preview */}
      {slide.notes && (
        <div style={{
          fontSize: 11,
          color: '#9CA3AF',
          marginTop: 4,
          paddingLeft: 2,
          paddingRight: 2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          fontFamily: 'DM Sans, sans-serif',
          maxWidth: THUMB_WIDTH,
        }}>
          {slide.notes}
        </div>
      )}
    </div>
  );
}

export default function SlidePanel() {
  const deck = useDeckStore((s) => s.deck);
  const currentSlideIndex = useDeckStore((s) => s.currentSlideIndex);
  const setCurrentSlide = useDeckStore((s) => s.setCurrentSlide);
  const reorderSlide = useDeckStore((s) => s.reorderSlide);
  const duplicateSlide = useDeckStore((s) => s.duplicateSlide);
  const deleteSlide = useDeckStore((s) => s.deleteSlide);
  const setShowTemplates = useDeckStore((s) => s.setShowTemplates);

  const [dragIndex, setDragIndex] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const panelRef = useRef(null);

  const handleDragStart = useCallback((e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  }, []);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget(index);
  }, []);

  const handleDrop = useCallback((e, toIndex) => {
    e.preventDefault();
    const fromIndex = dragIndex;
    setDragIndex(null);
    setDropTarget(null);
    if (fromIndex !== null && fromIndex !== toIndex) {
      reorderSlide(fromIndex, toIndex);
    }
  }, [dragIndex, reorderSlide]);

  const handleContextMenu = useCallback((e, index) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, index });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleContextAction = useCallback((action) => {
    if (!contextMenu) return;
    const idx = contextMenu.index;

    switch (action) {
      case 'duplicate':
        duplicateSlide(idx);
        break;
      case 'delete':
        deleteSlide(idx);
        break;
      case 'moveUp':
        if (idx > 0) reorderSlide(idx, idx - 1);
        break;
      case 'moveDown':
        if (idx < deck.slides.length - 1) reorderSlide(idx, idx + 1);
        break;
      default:
        break;
    }
    setContextMenu(null);
  }, [contextMenu, duplicateSlide, deleteSlide, reorderSlide, deck.slides.length]);

  // Close context menu on click outside
  React.useEffect(() => {
    const handler = () => setContextMenu(null);
    if (contextMenu) {
      window.addEventListener('click', handler);
      return () => window.removeEventListener('click', handler);
    }
  }, [contextMenu]);

  return (
    <div
      ref={panelRef}
      style={{
        width: 300,
        minWidth: 300,
        maxWidth: 300,
        height: '100%',
        background: '#FFFFFF',
        borderRight: '1px solid #E2E5EB',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '12px 16px 8px',
        fontSize: 13,
        fontWeight: 600,
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        borderBottom: '1px solid #E2E5EB',
      }}>
        Slides ({deck.slides.length})
      </div>

      {/* Slide list */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '10px 16px',
      }}>
        {deck.slides.map((slide, index) => (
          <div
            key={slide.id}
            style={{
              opacity: dragIndex === index ? 0.4 : 1,
              borderTop: dropTarget === index && dragIndex !== null && dragIndex !== index
                ? '2px solid #3B82F6'
                : '2px solid transparent',
              transition: 'opacity 0.15s ease',
            }}
          >
            <SlideThumbnail
              slide={slide}
              index={index}
              isActive={index === currentSlideIndex}
              onSelect={setCurrentSlide}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onContextMenu={handleContextMenu}
            />
          </div>
        ))}
      </div>

      {/* Add slide button */}
      <div style={{
        padding: '10px 16px',
        borderTop: '1px solid #E2E5EB',
      }}>
        <button
          onClick={() => setShowTemplates(true)}
          style={{
            width: '100%',
            height: 40,
            background: '#3B82F6',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500,
            fontFamily: 'DM Sans, sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#2563EB'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#3B82F6'; }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
          <span>Add Slide</span>
        </button>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            background: '#FFFFFF',
            border: '1px solid #E2E5EB',
            borderRadius: 6,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            zIndex: 10000,
            minWidth: 160,
            padding: '4px 0',
            fontFamily: 'DM Sans, sans-serif',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <ContextMenuItem
            label="Duplicate"
            shortcut="Ctrl+D"
            onClick={() => handleContextAction('duplicate')}
          />
          <ContextMenuItem
            label="Delete"
            shortcut="Del"
            onClick={() => handleContextAction('delete')}
            disabled={deck.slides.length <= 1}
          />
          <div style={{ height: 1, background: '#E2E5EB', margin: '4px 0' }} />
          <ContextMenuItem
            label="Move Up"
            onClick={() => handleContextAction('moveUp')}
            disabled={contextMenu.index === 0}
          />
          <ContextMenuItem
            label="Move Down"
            onClick={() => handleContextAction('moveDown')}
            disabled={contextMenu.index === deck.slides.length - 1}
          />
        </div>
      )}
    </div>
  );
}

function ContextMenuItem({ label, shortcut, onClick, disabled }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '6px 12px',
        border: 'none',
        background: hovered && !disabled ? '#F0F2F5' : 'transparent',
        color: disabled ? '#CBD0D8' : '#1A1D23',
        fontSize: 12,
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: 'DM Sans, sans-serif',
        textAlign: 'left',
      }}
    >
      <span>{label}</span>
      {shortcut && (
        <span style={{ fontSize: 10, color: '#9CA3AF', marginLeft: 16 }}>{shortcut}</span>
      )}
    </button>
  );
}
