import { useEffect } from 'react';
import useDeckStore from '../store/deckStore';

export default function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e) => {
      const state = useDeckStore.getState();
      const { editingTextId } = state;

      // Don't handle shortcuts when editing text (except Escape)
      if (editingTextId && e.key !== 'Escape') return;

      // Don't handle when typing in inputs
      const tag = e.target.tagName;
      if ((tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') && e.key !== 'Escape') return;

      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const key = e.key.toLowerCase();

      // Undo/Redo
      if (ctrl && !shift && key === 'z') {
        e.preventDefault();
        state.undo();
        return;
      }
      if (ctrl && shift && key === 'z') {
        e.preventDefault();
        state.redo();
        return;
      }

      // Copy/Paste/Cut
      if (ctrl && key === 'c') {
        e.preventDefault();
        state.copyElements();
        return;
      }
      if (ctrl && key === 'v') {
        e.preventDefault();
        state.pasteElements();
        return;
      }
      if (ctrl && key === 'x') {
        e.preventDefault();
        state.cutElements();
        return;
      }

      // Duplicate
      if (ctrl && key === 'd') {
        e.preventDefault();
        state.duplicateElements(state.selectedElementIds);
        return;
      }

      // Select All
      if (ctrl && key === 'a') {
        e.preventDefault();
        state.selectAll();
        return;
      }

      // Save
      if (ctrl && key === 's') {
        e.preventDefault();
        // Trigger save via download
        const blob = new Blob([JSON.stringify(state.deck, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'deck.json';
        a.click();
        URL.revokeObjectURL(url);
        state.setSaveStatus('saved');
        return;
      }

      // Present
      if (ctrl && key === 'p') {
        e.preventDefault();
        const deckData = encodeURIComponent(JSON.stringify(state.deck));
        window.open(`/present.html?deck=${deckData}`, '_blank');
        return;
      }

      // Find & Replace
      if (ctrl && shift && key === 'h') {
        e.preventDefault();
        state.setShowFindReplace(true);
        return;
      }

      // Z-order
      if (ctrl && key === ']') {
        e.preventDefault();
        if (state.selectedElementIds.length === 1) {
          state.moveElementZ(state.selectedElementIds[0], 'forward');
        }
        return;
      }
      if (ctrl && key === '[') {
        e.preventDefault();
        if (state.selectedElementIds.length === 1) {
          state.moveElementZ(state.selectedElementIds[0], 'backward');
        }
        return;
      }

      // Delete
      if (key === 'delete' || key === 'backspace') {
        e.preventDefault();
        state.deleteElements(state.selectedElementIds);
        return;
      }

      // Escape
      if (key === 'escape') {
        e.preventDefault();
        if (state.editingTextId) {
          useDeckStore.setState({ editingTextId: null });
        } else {
          state.clearSelection();
        }
        return;
      }

      // Arrow nudge
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        if (state.selectedElementIds.length > 0) {
          e.preventDefault();
          const delta = shift ? 10 : 1;
          const dx = key === 'arrowleft' ? -delta : key === 'arrowright' ? delta : 0;
          const dy = key === 'arrowup' ? -delta : key === 'arrowdown' ? delta : 0;
          state.selectedElementIds.forEach(id => {
            const slide = state.getCurrentSlide();
            const el = slide.elements.find(el => el.id === id);
            if (el && !el.locked) {
              state.updateElement(id, { x: el.x + dx, y: el.y + dy });
            }
          });
          return;
        }
      }

      // Tool shortcuts (only when no modifier)
      if (!ctrl && !shift) {
        switch (key) {
          case 'v': state.setTool('select'); break;
          case 't': state.setTool('text'); break;
          case 'r': state.setTool('rectangle'); break;
          case 'i': state.setTool('image'); break;
          case 'g': state.toggleGrid(); break;
          case '?': state.setShowShortcuts(true); break;
          case '[':
            e.preventDefault();
            state.setCurrentSlide(Math.max(0, state.currentSlideIndex - 1));
            break;
          case ']':
            e.preventDefault();
            state.setCurrentSlide(Math.min(state.deck.slides.length - 1, state.currentSlideIndex + 1));
            break;
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
