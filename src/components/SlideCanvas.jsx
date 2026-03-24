import React, { useRef, useState, useEffect, useCallback } from 'react';
import useDeckStore from '../store/deckStore';
import { cssGradient, cssBackground, snapToGrid } from '../utils/helpers';

const CANVAS_W = 960;
const CANVAS_H = 540;
const GRID_SIZE = 16;
const SNAP_THRESHOLD = 5;
const HANDLE_SIZE = 8;

// ============================================================
// Checkerboard + chrome styles (inline, no CSS modules needed)
// ============================================================

const checkerboardBg = `
  repeating-conic-gradient(#F0F2F5 0% 25%, #E8EBF0 0% 50%) 0 0 / 24px 24px
`;

const canvasWrapStyle = {
  flex: 1,
  position: 'relative',
  overflow: 'hidden',
  background: checkerboardBg,
  cursor: 'default',
  userSelect: 'none',
  outline: 'none',
};

// ============================================================
// Helpers
// ============================================================

function getAlignmentGuides(movingBounds, otherElements, selectedIds) {
  const guides = [];
  const targets = [];

  // Canvas center + edges
  targets.push({ left: 0, right: CANVAS_W, top: 0, bottom: CANVAS_H, cx: CANVAS_W / 2, cy: CANVAS_H / 2 });

  otherElements.forEach(el => {
    if (selectedIds.includes(el.id)) return;
    targets.push({
      left: el.x,
      right: el.x + el.width,
      top: el.y,
      bottom: el.y + el.height,
      cx: el.x + el.width / 2,
      cy: el.y + el.height / 2,
    });
  });

  const mCx = movingBounds.x + movingBounds.width / 2;
  const mCy = movingBounds.y + movingBounds.height / 2;

  let snapX = null;
  let snapY = null;

  const checkVals = [
    { mVal: movingBounds.x, key: 'left' },
    { mVal: movingBounds.x + movingBounds.width, key: 'right' },
    { mVal: mCx, key: 'cx' },
  ];

  const checkValsY = [
    { mVal: movingBounds.y, key: 'top' },
    { mVal: movingBounds.y + movingBounds.height, key: 'bottom' },
    { mVal: mCy, key: 'cy' },
  ];

  targets.forEach(t => {
    const xEdges = [t.left, t.right, t.cx];
    const yEdges = [t.top, t.bottom, t.cy];

    checkVals.forEach(({ mVal }) => {
      xEdges.forEach(edge => {
        if (Math.abs(mVal - edge) < SNAP_THRESHOLD) {
          guides.push({ axis: 'x', pos: edge });
          if (snapX === null) snapX = edge - (mVal - movingBounds.x);
        }
      });
    });

    checkValsY.forEach(({ mVal }) => {
      yEdges.forEach(edge => {
        if (Math.abs(mVal - edge) < SNAP_THRESHOLD) {
          guides.push({ axis: 'y', pos: edge });
          if (snapY === null) snapY = edge - (mVal - movingBounds.y);
        }
      });
    });
  });

  return { guides, snapX, snapY };
}

function boundsIntersect(a, b) {
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
}

// ============================================================
// Sub-components
// ============================================================

function ResizeHandles({ el, onResizeStart, onRotateStart }) {
  const hw = HANDLE_SIZE;
  const hh = HANDLE_SIZE;
  const positions = [
    { key: 'tl', x: -hw / 2, y: -hh / 2, cursor: 'nwse-resize' },
    { key: 'tc', x: el.width / 2 - hw / 2, y: -hh / 2, cursor: 'ns-resize' },
    { key: 'tr', x: el.width - hw / 2, y: -hh / 2, cursor: 'nesw-resize' },
    { key: 'ml', x: -hw / 2, y: el.height / 2 - hh / 2, cursor: 'ew-resize' },
    { key: 'mr', x: el.width - hw / 2, y: el.height / 2 - hh / 2, cursor: 'ew-resize' },
    { key: 'bl', x: -hw / 2, y: el.height - hh / 2, cursor: 'nesw-resize' },
    { key: 'bc', x: el.width / 2 - hw / 2, y: el.height - hh / 2, cursor: 'ns-resize' },
    { key: 'br', x: el.width - hw / 2, y: el.height - hh / 2, cursor: 'nwse-resize' },
  ];

  const handleStyle = (pos) => ({
    position: 'absolute',
    left: pos.x,
    top: pos.y,
    width: hw,
    height: hh,
    background: '#FFFFFF',
    border: '1.5px solid #3B82F6',
    borderRadius: 1,
    cursor: pos.cursor,
    zIndex: 9999,
    boxSizing: 'border-box',
  });

  return (
    <>
      {/* Selection border */}
      <div style={{
        position: 'absolute',
        inset: -1,
        border: '1.5px solid #3B82F6',
        pointerEvents: 'none',
        borderRadius: 1,
      }} />

      {/* Resize handles */}
      {positions.map(pos => (
        <div
          key={pos.key}
          style={handleStyle(pos)}
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeStart(e, el.id, pos.key);
          }}
        />
      ))}

      {/* Rotation handle line */}
      <div style={{
        position: 'absolute',
        left: el.width / 2,
        top: -30,
        width: 1,
        height: 26,
        background: '#3B82F6',
        transformOrigin: 'bottom center',
        pointerEvents: 'none',
      }} />

      {/* Rotation handle circle */}
      <div
        style={{
          position: 'absolute',
          left: el.width / 2 - 6,
          top: -36,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#FFFFFF',
          border: '1.5px solid #3B82F6',
          cursor: 'grab',
          zIndex: 9999,
          boxSizing: 'border-box',
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          onRotateStart(e, el.id);
        }}
      />
    </>
  );
}

function ContextMenu({ x, y, onAction, onClose }) {
  const items = [
    { label: 'Add Text', shortcut: 'T', action: 'addText' },
    { label: 'Add Shape', shortcut: 'R', action: 'addShape' },
    { label: 'Add Image', shortcut: 'I', action: 'addImage' },
    { type: 'separator' },
    { label: 'Paste', shortcut: 'Cmd+V', action: 'paste' },
    { label: 'Select All', shortcut: 'Cmd+A', action: 'selectAll' },
    { type: 'separator' },
    { label: 'Delete', shortcut: 'Del', action: 'delete' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        background: '#FFFFFF',
        border: '1px solid #E2E5EB',
        borderRadius: 8,
        padding: '4px 0',
        minWidth: 200,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        zIndex: 10000,
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 13,
        color: '#1A1D23',
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {items.map((item, i) => {
        if (item.type === 'separator') {
          return <div key={`sep-${i}`} style={{ height: 1, background: '#E2E5EB', margin: '4px 8px' }} />;
        }
        return (
          <div
            key={item.action}
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#F0F2F5'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            onClick={() => {
              onAction(item.action);
              onClose();
            }}
          >
            <span>{item.label}</span>
            <span style={{ color: '#9CA3AF', fontSize: 11, marginLeft: 24 }}>{item.shortcut}</span>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Element renderer
// ============================================================

function borderToCss(b) {
  if (!b) return undefined;
  if (typeof b === 'string') return b;
  return `${b.width || 1}px ${b.dash || 'solid'} ${b.color || '#fff'}`;
}

function shadowToCss(s) {
  if (!s) return undefined;
  if (typeof s === 'string') return s;
  return `${s.x || 0}px ${s.y || 0}px ${s.blur || 0}px ${s.color || 'rgba(0,0,0,0.3)'}`;
}

function renderElementContent(el) {
  switch (el.type) {
    case 'text': {
      const alignItems = el.verticalAlign === 'middle' ? 'center'
        : el.verticalAlign === 'bottom' ? 'flex-end' : 'flex-start';
      return (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems,
          fontFamily: el.fontFamily || 'DM Sans',
          fontSize: el.fontSize || 24,
          fontWeight: el.fontWeight || '400',
          fontStyle: el.fontStyle || 'normal',
          color: el.color || '#1A1D23',
          lineHeight: el.lineHeight || 1.4,
          letterSpacing: el.letterSpacing != null ? `${el.letterSpacing}px` : undefined,
          textAlign: el.textAlign || 'left',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          textShadow: shadowToCss(el.textShadow),
          background: el.background || undefined,
          border: borderToCss(el.border),
          overflow: 'hidden',
          boxSizing: 'border-box',
          padding: el.background ? '8px' : undefined,
        }}>
          <div style={{ width: '100%', textAlign: el.textAlign || 'left' }}>
            {el.content}
          </div>
        </div>
      );
    }

    case 'shape': {
      const bg = el.fill ? cssGradient(el.fill) : 'transparent';
      const commonShapeStyle = {
        width: '100%',
        height: '100%',
        background: bg,
        border: borderToCss(el.border),
        boxSizing: 'border-box',
      };

      switch (el.shape) {
        case 'rectangle':
          return <div style={{ ...commonShapeStyle, borderRadius: el.cornerRadius || 0 }} />;
        case 'circle':
          return <div style={{ ...commonShapeStyle, borderRadius: '50%' }} />;
        case 'triangle':
          return <div style={{ ...commonShapeStyle, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />;
        case 'line':
          return (
            <div style={{
              width: '100%',
              height: 2,
              background: el.fill ? cssGradient(el.fill) : '#1A1D23',
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
            }} />
          );
        case 'arrow':
          return (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <div style={{
                width: 'calc(100% - 8px)',
                height: 2,
                background: el.fill ? cssGradient(el.fill) : '#1A1D23',
                position: 'absolute',
                top: '50%',
                left: 0,
                transform: 'translateY(-50%)',
              }} />
              <div style={{
                position: 'absolute',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 0,
                height: 0,
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderLeft: `10px solid ${el.fill ? (el.fill.color || '#1A1D23') : '#1A1D23'}`,
              }} />
            </div>
          );
        default:
          return <div style={commonShapeStyle} />;
      }
    }

    case 'image':
      return (
        <img
          src={el.src}
          alt=""
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: el.objectFit || 'cover',
            borderRadius: el.borderRadius || 0,
            boxShadow: shadowToCss(el.shadow),
            display: 'block',
          }}
        />
      );

    case 'code':
      return (
        <pre style={{
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 16,
          background: el.background || '#F0F2F5',
          borderRadius: 8,
          border: borderToCss(el.border) || '1px solid #E2E5EB',
          overflow: 'auto',
          boxSizing: 'border-box',
          fontSize: el.fontSize || 14,
          fontFamily: el.fontFamily || 'Space Mono, monospace',
          color: el.color || '#E0E0E0',
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}>
          <code className={`language-${el.language || 'javascript'}`}>
            {el.content}
          </code>
        </pre>
      );

    case 'divider':
      return (
        <div style={{
          width: '100%',
          position: 'absolute',
          top: '50%',
          borderTop: `${el.thickness || 2}px ${el.dash || 'solid'} ${el.color || '#1A1D23'}`,
        }} />
      );

    default:
      return null;
  }
}

// ============================================================
// Main component
// ============================================================

export default function SlideCanvas() {
  const wrapRef = useRef(null);
  const slideRef = useRef(null);

  // Store selectors
  const getCurrentSlide = useDeckStore(s => s.getCurrentSlide);
  const selectedElementIds = useDeckStore(s => s.selectedElementIds);
  const editingTextId = useDeckStore(s => s.editingTextId);
  const zoom = useDeckStore(s => s.zoom);
  const showGrid = useDeckStore(s => s.showGrid);
  const panOffset = useDeckStore(s => s.panOffset);
  const tool = useDeckStore(s => s.tool);

  const selectElement = useDeckStore(s => s.selectElement);
  const selectAll = useDeckStore(s => s.selectAll);
  const clearSelection = useDeckStore(s => s.clearSelection);
  const setZoom = useDeckStore(s => s.setZoom);
  const setPanOffset = useDeckStore(s => s.setPanOffset);
  const setEditingTextId = useDeckStore(s => s.setEditingTextId);
  const updateElement = useDeckStore(s => s.updateElement);
  const updateElementWithUndo = useDeckStore(s => s.updateElementWithUndo);
  const addElement = useDeckStore(s => s.addElement);
  const deleteElements = useDeckStore(s => s.deleteElements);
  const pasteElements = useDeckStore(s => s.pasteElements);
  const copyElements = useDeckStore(s => s.copyElements);
  const cutElements = useDeckStore(s => s.cutElements);

  const slide = getCurrentSlide();

  // Local interaction state
  const [dragging, setDragging] = useState(null);        // { startX, startY, origPositions: {id:{x,y}}, elementIds }
  const [resizing, setResizing] = useState(null);         // { handle, elementId, startX, startY, origRect }
  const [rotating, setRotating] = useState(null);         // { elementId, startAngle, origRotation, cx, cy }
  const [panning, setPanning] = useState(null);           // { startX, startY, origOffset }
  const [dragSelect, setDragSelect] = useState(null);     // { startX, startY, curX, curY } in slide coords
  const [contextMenu, setContextMenu] = useState(null);   // { x, y }
  const [guides, setGuides] = useState([]);
  const [dragTooltip, setDragTooltip] = useState(null);   // { x, y, elX, elY }
  const [spaceHeld, setSpaceHeld] = useState(false);

  // Convert page coords to slide coords
  const pageToSlide = useCallback((pageX, pageY) => {
    if (!slideRef.current) return { x: 0, y: 0 };
    const rect = slideRef.current.getBoundingClientRect();
    return {
      x: (pageX - rect.left) / zoom,
      y: (pageY - rect.top) / zoom,
    };
  }, [zoom]);

  // ============================================================
  // Keyboard events
  // ============================================================

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (editingTextId) return; // Let text editing handle keys

      if (e.code === 'Space' && !e.repeat && !['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName) && !e.target.isContentEditable) {
        e.preventDefault();
        setSpaceHeld(true);
      }

      // Arrow key nudge
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && selectedElementIds.length > 0) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        let dx = 0, dy = 0;
        if (e.key === 'ArrowUp') dy = -step;
        if (e.key === 'ArrowDown') dy = step;
        if (e.key === 'ArrowLeft') dx = -step;
        if (e.key === 'ArrowRight') dx = step;

        selectedElementIds.forEach(id => {
          const el = slide?.elements.find(el => el.id === id);
          if (el && !el.locked) {
            updateElementWithUndo(id, { x: el.x + dx, y: el.y + dy });
          }
        });
      }

      // Delete
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElementIds.length > 0) {
        e.preventDefault();
        deleteElements(selectedElementIds);
      }

      // Escape
      if (e.key === 'Escape') {
        clearSelection();
        setContextMenu(null);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setSpaceHeld(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedElementIds, editingTextId, slide, updateElementWithUndo, deleteElements, clearSelection]);

  // ============================================================
  // Mouse move / up handlers (window level for dragging)
  // ============================================================

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Panning
      if (panning) {
        const dx = e.clientX - panning.startX;
        const dy = e.clientY - panning.startY;
        setPanOffset({
          x: panning.origOffset.x + dx,
          y: panning.origOffset.y + dy,
        });
        return;
      }

      // Dragging elements
      if (dragging) {
        const dx = (e.clientX - dragging.startX) / zoom;
        const dy = (e.clientY - dragging.startY) / zoom;

        const newPositions = {};
        dragging.elementIds.forEach(id => {
          const orig = dragging.origPositions[id];
          let nx = orig.x + dx;
          let ny = orig.y + dy;
          newPositions[id] = { x: nx, y: ny };
        });

        // Smart guides (use first element for guide calculations)
        const firstId = dragging.elementIds[0];
        const firstEl = slide?.elements.find(el => el.id === firstId);
        if (firstEl) {
          const movingBounds = {
            x: newPositions[firstId].x,
            y: newPositions[firstId].y,
            width: firstEl.width,
            height: firstEl.height,
          };

          const { guides: newGuides, snapX, snapY } = getAlignmentGuides(
            movingBounds,
            slide.elements,
            selectedElementIds
          );

          if (showGrid && newGuides.length === 0) {
            // Grid snap if no smart guides
            const snappedX = snapToGrid(movingBounds.x, GRID_SIZE);
            const snappedY = snapToGrid(movingBounds.y, GRID_SIZE);
            const offsetX = snappedX - movingBounds.x;
            const offsetY = snappedY - movingBounds.y;
            dragging.elementIds.forEach(id => {
              newPositions[id].x += offsetX;
              newPositions[id].y += offsetY;
            });
          } else {
            // Snap to guides
            if (snapX !== null) {
              const offsetX = snapX - newPositions[firstId].x;
              dragging.elementIds.forEach(id => {
                newPositions[id].x += offsetX;
              });
            }
            if (snapY !== null) {
              const offsetY = snapY - newPositions[firstId].y;
              dragging.elementIds.forEach(id => {
                newPositions[id].y += offsetY;
              });
            }
          }

          setGuides(newGuides);
          setDragTooltip({
            x: e.clientX + 12,
            y: e.clientY + 12,
            elX: Math.round(newPositions[firstId].x),
            elY: Math.round(newPositions[firstId].y),
          });
        }

        // Apply positions
        dragging.elementIds.forEach(id => {
          updateElement(id, {
            x: Math.round(newPositions[id].x),
            y: Math.round(newPositions[id].y),
          });
        });
        return;
      }

      // Resizing
      if (resizing) {
        const dx = (e.clientX - resizing.startX) / zoom;
        const dy = (e.clientY - resizing.startY) / zoom;
        const { handle, origRect } = resizing;
        const constrain = e.shiftKey;

        let newX = origRect.x;
        let newY = origRect.y;
        let newW = origRect.width;
        let newH = origRect.height;

        const aspect = origRect.width / origRect.height;

        // Calculate new dimensions based on handle
        if (handle.includes('r')) newW = Math.max(10, origRect.width + dx);
        if (handle.includes('l')) {
          newW = Math.max(10, origRect.width - dx);
          newX = origRect.x + origRect.width - newW;
        }
        if (handle.includes('b')) newH = Math.max(10, origRect.height + dy);
        if (handle.includes('t')) {
          newH = Math.max(10, origRect.height - dy);
          newY = origRect.y + origRect.height - newH;
        }

        // Constrain proportions
        if (constrain) {
          if (handle === 'tl' || handle === 'tr' || handle === 'bl' || handle === 'br') {
            const newAspect = newW / newH;
            if (newAspect > aspect) {
              newW = newH * aspect;
            } else {
              newH = newW / aspect;
            }
            if (handle.includes('l')) newX = origRect.x + origRect.width - newW;
            if (handle.includes('t')) newY = origRect.y + origRect.height - newH;
          }
        }

        // Edge-only handles
        if (handle === 'tc' || handle === 'bc') newW = origRect.width;
        if (handle === 'ml' || handle === 'mr') newH = origRect.height;
        if (handle === 'tc') { newX = origRect.x; }
        if (handle === 'bc') { newX = origRect.x; }
        if (handle === 'ml') { newY = origRect.y; }
        if (handle === 'mr') { newY = origRect.y; }

        updateElement(resizing.elementId, {
          x: Math.round(newX),
          y: Math.round(newY),
          width: Math.round(newW),
          height: Math.round(newH),
        });
        return;
      }

      // Rotating
      if (rotating) {
        const rect = slideRef.current.getBoundingClientRect();
        const cx = rect.left + rotating.cx * zoom;
        const cy = rect.top + rotating.cy * zoom;
        const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI) + 90;
        const delta = angle - rotating.startAngle;
        let newRotation = rotating.origRotation + delta;
        // Snap to 15 degree increments when shift held
        if (e.shiftKey) {
          newRotation = Math.round(newRotation / 15) * 15;
        }
        updateElement(rotating.elementId, { rotation: newRotation });
        return;
      }

      // Drag select
      if (dragSelect) {
        const coords = pageToSlide(e.clientX, e.clientY);
        setDragSelect(prev => ({ ...prev, curX: coords.x, curY: coords.y }));
        return;
      }
    };

    const handleMouseUp = (e) => {
      if (dragging) {
        // Push undo after drag completes
        const store = useDeckStore.getState();
        store._pushUndo('Move element');
        setDragging(null);
        setGuides([]);
        setDragTooltip(null);
      }
      if (resizing) {
        const store = useDeckStore.getState();
        store._pushUndo('Resize element');
        setResizing(null);
      }
      if (rotating) {
        const store = useDeckStore.getState();
        store._pushUndo('Rotate element');
        setRotating(null);
      }
      if (panning) {
        setPanning(null);
      }
      if (dragSelect && slide) {
        // Determine which elements intersect the selection rectangle
        const left = Math.min(dragSelect.startX, dragSelect.curX);
        const top = Math.min(dragSelect.startY, dragSelect.curY);
        const right = Math.max(dragSelect.startX, dragSelect.curX);
        const bottom = Math.max(dragSelect.startY, dragSelect.curY);

        const selRect = { left, top, right, bottom };
        const hitIds = slide.elements
          .filter(el => !el.hidden && !el.locked)
          .filter(el => boundsIntersect(
            { left: el.x, top: el.y, right: el.x + el.width, bottom: el.y + el.height },
            selRect
          ))
          .map(el => el.id);

        if (hitIds.length > 0) {
          useDeckStore.getState().selectElement(null);
          useDeckStore.setState({ selectedElementIds: hitIds });
        }
        setDragSelect(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, resizing, rotating, panning, dragSelect, zoom, showGrid, slide, selectedElementIds, updateElement, pageToSlide, setPanOffset]);

  // ============================================================
  // Scroll to zoom
  // ============================================================

  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setZoom(zoom + delta);
    }
  }, [zoom, setZoom]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // ============================================================
  // Canvas mousedown
  // ============================================================

  const handleCanvasMouseDown = (e) => {
    if (e.button === 2) return; // right-click handled by context menu
    setContextMenu(null);

    // Space+drag = pan
    if (spaceHeld) {
      setPanning({
        startX: e.clientX,
        startY: e.clientY,
        origOffset: { ...panOffset },
      });
      return;
    }

    // Clicked on empty canvas area - start drag-select or deselect
    const coords = pageToSlide(e.clientX, e.clientY);
    clearSelection();
    setDragSelect({ startX: coords.x, startY: coords.y, curX: coords.x, curY: coords.y });
  };

  // ============================================================
  // Element mousedown
  // ============================================================

  const handleElementMouseDown = (e, el) => {
    e.stopPropagation();
    if (el.locked) return;
    setContextMenu(null);

    if (e.shiftKey) {
      selectElement(el.id, true);
    } else if (!selectedElementIds.includes(el.id)) {
      selectElement(el.id, false);
    }

    // Determine which elements to drag
    const idsToMove = selectedElementIds.includes(el.id)
      ? selectedElementIds
      : [el.id];

    const origPositions = {};
    idsToMove.forEach(id => {
      const element = slide.elements.find(e => e.id === id);
      if (element && !element.locked) {
        origPositions[id] = { x: element.x, y: element.y };
      }
    });

    setDragging({
      startX: e.clientX,
      startY: e.clientY,
      origPositions,
      elementIds: Object.keys(origPositions),
    });
  };

  // ============================================================
  // Double-click for text editing
  // ============================================================

  const handleElementDoubleClick = (e, el) => {
    e.stopPropagation();
    if (el.type === 'text' && !el.locked) {
      setEditingTextId(el.id);
    }
  };

  // ============================================================
  // Resize start
  // ============================================================

  const handleResizeStart = (e, elementId, handle) => {
    const el = slide.elements.find(el => el.id === elementId);
    if (!el) return;
    setResizing({
      handle,
      elementId,
      startX: e.clientX,
      startY: e.clientY,
      origRect: { x: el.x, y: el.y, width: el.width, height: el.height },
    });
  };

  // ============================================================
  // Rotate start
  // ============================================================

  const handleRotateStart = (e, elementId) => {
    const el = slide.elements.find(el => el.id === elementId);
    if (!el) return;
    const cx = el.x + el.width / 2;
    const cy = el.y + el.height / 2;
    const rect = slideRef.current.getBoundingClientRect();
    const screenCx = rect.left + cx * zoom;
    const screenCy = rect.top + cy * zoom;
    const startAngle = Math.atan2(e.clientY - screenCy, e.clientX - screenCx) * (180 / Math.PI) + 90;
    setRotating({
      elementId,
      startAngle,
      origRotation: el.rotation || 0,
      cx,
      cy,
    });
  };

  // ============================================================
  // Context menu
  // ============================================================

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleContextAction = (action) => {
    switch (action) {
      case 'addText':
        addElement('text');
        break;
      case 'addShape':
        addElement('shape');
        break;
      case 'addImage':
        addElement('image');
        break;
      case 'paste':
        pasteElements();
        break;
      case 'selectAll':
        selectAll();
        break;
      case 'delete':
        deleteElements(selectedElementIds);
        break;
    }
  };

  // ============================================================
  // Render
  // ============================================================

  if (!slide) {
    return (
      <div style={{ ...canvasWrapStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
        No slide selected
      </div>
    );
  }

  const sortedElements = [...slide.elements]
    .filter(el => !el.hidden)
    .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  const slideBackground = slide.background ? cssBackground(slide.background) : '#FFFFFF';

  // Drag-select rect in slide coords
  let dragSelectRect = null;
  if (dragSelect) {
    const left = Math.min(dragSelect.startX, dragSelect.curX);
    const top = Math.min(dragSelect.startY, dragSelect.curY);
    const w = Math.abs(dragSelect.curX - dragSelect.startX);
    const h = Math.abs(dragSelect.curY - dragSelect.startY);
    if (w > 2 || h > 2) {
      dragSelectRect = { left, top, width: w, height: h };
    }
  }

  return (
    <div
      ref={wrapRef}
      style={{
        ...canvasWrapStyle,
        cursor: spaceHeld ? (panning ? 'grabbing' : 'grab') : 'default',
      }}
      tabIndex={0}
      onMouseDown={handleCanvasMouseDown}
      onContextMenu={handleContextMenu}
    >
      {/* Transformed container for zoom + pan */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
        transformOrigin: 'center center',
      }}>
        {/* The 960x540 slide */}
        <div
          ref={slideRef}
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            position: 'relative',
            background: slideBackground,
            boxShadow: '0 4px 40px rgba(0,0,0,0.12)',
            overflow: 'hidden',
          }}
        >
          {/* Grid overlay */}
          {showGrid && (
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 1px)`,
              backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
              pointerEvents: 'none',
              zIndex: 9000,
            }} />
          )}

          {/* Elements */}
          {sortedElements.map(el => {
            const isSelected = selectedElementIds.includes(el.id);
            const isEditing = editingTextId === el.id;

            return (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                  transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                  transformOrigin: 'center center',
                  opacity: el.opacity != null ? el.opacity : 1,
                  mixBlendMode: el.blendMode || 'normal',
                  cursor: el.locked ? 'not-allowed' : 'move',
                  zIndex: el.zIndex || 0,
                  outline: 'none',
                }}
                onMouseDown={(e) => handleElementMouseDown(e, el)}
                onDoubleClick={(e) => handleElementDoubleClick(e, el)}
              >
                {/* Content */}
                {isEditing && el.type === 'text' ? (
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: el.verticalAlign === 'middle' ? 'center'
                        : el.verticalAlign === 'bottom' ? 'flex-end' : 'flex-start',
                      fontFamily: el.fontFamily || 'DM Sans',
                      fontSize: el.fontSize || 24,
                      fontWeight: el.fontWeight || '400',
                      fontStyle: el.fontStyle || 'normal',
                      color: el.color || '#1A1D23',
                      lineHeight: el.lineHeight || 1.4,
                      letterSpacing: el.letterSpacing != null ? `${el.letterSpacing}px` : undefined,
                      textAlign: el.textAlign || 'left',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      textShadow: el.textShadow || undefined,
                      background: el.background || undefined,
                      border: el.border || undefined,
                      overflow: 'hidden',
                      boxSizing: 'border-box',
                      padding: el.background ? '8px' : undefined,
                      outline: '2px solid #3B82F6',
                      cursor: 'text',
                    }}
                    onBlur={(e) => {
                      updateElementWithUndo(el.id, { content: e.currentTarget.innerText });
                      setEditingTextId(null);
                    }}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === 'Escape') {
                        updateElementWithUndo(el.id, { content: e.currentTarget.innerText });
                        setEditingTextId(null);
                      }
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    ref={(node) => {
                      if (node && !node.dataset.focused) {
                        node.dataset.focused = 'true';
                        node.focus();
                        // Place cursor at end
                        const range = document.createRange();
                        range.selectNodeContents(node);
                        range.collapse(false);
                        const sel = window.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(range);
                      }
                    }}
                  >
                    {el.content}
                  </div>
                ) : (
                  renderElementContent(el)
                )}

                {/* Selection UI */}
                {isSelected && !isEditing && !el.locked && (
                  <ResizeHandles
                    el={el}
                    onResizeStart={handleResizeStart}
                    onRotateStart={handleRotateStart}
                  />
                )}
              </div>
            );
          })}

          {/* Smart guides */}
          {guides.map((g, i) => (
            g.axis === 'x' ? (
              <div
                key={`guide-${i}`}
                style={{
                  position: 'absolute',
                  left: g.pos,
                  top: 0,
                  width: 1,
                  height: CANVAS_H,
                  background: '#EF4444',
                  pointerEvents: 'none',
                  zIndex: 9500,
                }}
              />
            ) : (
              <div
                key={`guide-${i}`}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: g.pos,
                  width: CANVAS_W,
                  height: 1,
                  background: '#EF4444',
                  pointerEvents: 'none',
                  zIndex: 9500,
                }}
              />
            )
          ))}

          {/* Drag-select rectangle */}
          {dragSelectRect && (
            <div style={{
              position: 'absolute',
              left: dragSelectRect.left,
              top: dragSelectRect.top,
              width: dragSelectRect.width,
              height: dragSelectRect.height,
              background: 'rgba(59, 130, 246, 0.12)',
              border: '1px solid rgba(59, 130, 246, 0.5)',
              pointerEvents: 'none',
              zIndex: 9600,
            }} />
          )}
        </div>
      </div>

      {/* Drag tooltip (fixed position, outside canvas transform) */}
      {dragTooltip && (
        <div style={{
          position: 'fixed',
          left: dragTooltip.x,
          top: dragTooltip.y,
          background: '#FFFFFF',
          color: '#1A1D23',
          fontSize: 11,
          fontFamily: 'Space Mono, monospace',
          padding: '3px 8px',
          borderRadius: 4,
          border: '1px solid #E2E5EB',
          pointerEvents: 'none',
          zIndex: 10001,
          whiteSpace: 'nowrap',
        }}>
          X: {dragTooltip.elX} &nbsp; Y: {dragTooltip.elY}
        </div>
      )}

      {/* Context menu */}
      {contextMenu && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
            onClick={() => setContextMenu(null)}
            onContextMenu={(e) => { e.preventDefault(); setContextMenu(null); }}
          />
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onAction={handleContextAction}
            onClose={() => setContextMenu(null)}
          />
        </>
      )}
    </div>
  );
}
