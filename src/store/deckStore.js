import { create } from 'zustand';
import { demoDeck } from '../data/demoDeck';
import { genId, deepClone, createDefaultElement } from '../utils/helpers';

const MAX_UNDO = 60;

const useDeckStore = create((set, get) => ({
  // Deck data
  deck: deepClone(demoDeck),

  // Editor state
  currentSlideIndex: 0,
  selectedElementIds: [],
  editingTextId: null,
  clipboard: [],
  tool: 'select', // select, text, rectangle, circle, triangle, line, arrow, image, code
  zoom: 0.85,
  showGrid: false,
  isPanning: false,
  panOffset: { x: 0, y: 0 },

  // Undo/redo
  undoStack: [],
  redoStack: [],

  // UI state
  rightTab: 'properties', // properties | ai
  showSettings: false,
  showTemplates: false,
  showShortcuts: false,
  showFindReplace: false,
  saveStatus: 'saved', // saved | saving | unsaved

  // Config
  config: {
    apiKey: '',
    autoSave: true,
    autoSaveInterval: 30000,
  },

  // AI chat
  chatMessages: [],
  chatLoading: false,

  // ========== HELPERS ==========

  getCurrentSlide: () => {
    const { deck, currentSlideIndex } = get();
    return deck.slides[currentSlideIndex] || null;
  },

  getSelectedElements: () => {
    const slide = get().getCurrentSlide();
    if (!slide) return [];
    return slide.elements.filter(el => get().selectedElementIds.includes(el.id));
  },

  // ========== UNDO/REDO ==========

  _pushUndo: (label) => {
    const { deck, undoStack } = get();
    const snapshot = { label, deck: deepClone(deck), timestamp: Date.now() };
    const newStack = [...undoStack, snapshot].slice(-MAX_UNDO);
    set({ undoStack: newStack, redoStack: [], saveStatus: 'unsaved' });
  },

  undo: () => {
    const { undoStack, redoStack, deck } = get();
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    set({
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, { label: 'redo', deck: deepClone(deck), timestamp: Date.now() }],
      deck: prev.deck,
      saveStatus: 'unsaved',
    });
  },

  redo: () => {
    const { undoStack, redoStack, deck } = get();
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    set({
      redoStack: redoStack.slice(0, -1),
      undoStack: [...undoStack, { label: 'undo', deck: deepClone(deck), timestamp: Date.now() }],
      deck: next.deck,
      saveStatus: 'unsaved',
    });
  },

  // ========== DECK OPERATIONS ==========

  setDeck: (newDeck) => {
    get()._pushUndo('Set deck');
    set({ deck: deepClone(newDeck), currentSlideIndex: 0, selectedElementIds: [] });
  },

  updateTheme: (updates) => {
    get()._pushUndo('Update theme');
    const deck = deepClone(get().deck);
    deck.theme = { ...deck.theme, ...updates };
    deck.meta.modified = new Date().toISOString();
    set({ deck });
  },

  updateMeta: (updates) => {
    const deck = deepClone(get().deck);
    deck.meta = { ...deck.meta, ...updates, modified: new Date().toISOString() };
    set({ deck });
  },

  // ========== SLIDE OPERATIONS ==========

  setCurrentSlide: (index) => {
    const { deck } = get();
    if (index >= 0 && index < deck.slides.length) {
      set({ currentSlideIndex: index, selectedElementIds: [], editingTextId: null });
    }
  },

  addSlide: (slideData, insertAfter) => {
    get()._pushUndo('Add slide');
    const deck = deepClone(get().deck);
    const newSlide = slideData || {
      id: genId(),
      notes: '',
      transition: 'fade',
      background: { type: 'solid', color: deck.theme.backgroundDefault },
      elements: [],
    };
    const idx = insertAfter !== undefined ? insertAfter + 1 : deck.slides.length;
    deck.slides.splice(idx, 0, newSlide);
    deck.meta.modified = new Date().toISOString();
    set({ deck, currentSlideIndex: idx, selectedElementIds: [] });
  },

  deleteSlide: (index) => {
    get()._pushUndo('Delete slide');
    const deck = deepClone(get().deck);
    deck.slides.splice(index, 1);
    if (deck.slides.length === 0) {
      deck.slides.push({
        id: genId(),
        notes: '',
        transition: 'fade',
        background: { type: 'solid', color: deck.theme.backgroundDefault },
        elements: [],
      });
    }
    const newIndex = Math.min(get().currentSlideIndex, deck.slides.length - 1);
    deck.meta.modified = new Date().toISOString();
    set({ deck, currentSlideIndex: newIndex, selectedElementIds: [] });
  },

  duplicateSlide: (index) => {
    get()._pushUndo('Duplicate slide');
    const deck = deepClone(get().deck);
    const copy = deepClone(deck.slides[index]);
    copy.id = genId();
    copy.elements.forEach(el => { el.id = genId(); });
    deck.slides.splice(index + 1, 0, copy);
    deck.meta.modified = new Date().toISOString();
    set({ deck, currentSlideIndex: index + 1 });
  },

  reorderSlide: (fromIndex, toIndex) => {
    get()._pushUndo('Reorder slide');
    const deck = deepClone(get().deck);
    const [slide] = deck.slides.splice(fromIndex, 1);
    deck.slides.splice(toIndex, 0, slide);
    deck.meta.modified = new Date().toISOString();
    set({ deck, currentSlideIndex: toIndex });
  },

  updateSlide: (index, updates) => {
    get()._pushUndo('Update slide');
    const deck = deepClone(get().deck);
    deck.slides[index] = { ...deck.slides[index], ...updates };
    deck.meta.modified = new Date().toISOString();
    set({ deck });
  },

  // ========== ELEMENT OPERATIONS ==========

  addElement: (type, extraProps = {}) => {
    get()._pushUndo('Add element');
    const deck = deepClone(get().deck);
    const slide = deck.slides[get().currentSlideIndex];
    const maxZ = slide.elements.reduce((max, el) => Math.max(max, el.zIndex || 0), 0);
    const el = { ...createDefaultElement(type, deck.theme), zIndex: maxZ + 1, ...extraProps };
    slide.elements.push(el);
    deck.meta.modified = new Date().toISOString();
    set({ deck, selectedElementIds: [el.id], tool: 'select' });
    return el.id;
  },

  updateElement: (elementId, updates) => {
    const deck = deepClone(get().deck);
    const slide = deck.slides[get().currentSlideIndex];
    const el = slide.elements.find(e => e.id === elementId);
    if (el) {
      Object.assign(el, updates);
      deck.meta.modified = new Date().toISOString();
      set({ deck, saveStatus: 'unsaved' });
    }
  },

  updateElementWithUndo: (elementId, updates) => {
    get()._pushUndo('Update element');
    get().updateElement(elementId, updates);
  },

  deleteElements: (ids) => {
    if (!ids || ids.length === 0) return;
    get()._pushUndo('Delete elements');
    const deck = deepClone(get().deck);
    const slide = deck.slides[get().currentSlideIndex];
    slide.elements = slide.elements.filter(el => !ids.includes(el.id));
    deck.meta.modified = new Date().toISOString();
    set({ deck, selectedElementIds: [] });
  },

  duplicateElements: (ids) => {
    if (!ids || ids.length === 0) return;
    get()._pushUndo('Duplicate elements');
    const deck = deepClone(get().deck);
    const slide = deck.slides[get().currentSlideIndex];
    const newIds = [];
    ids.forEach(id => {
      const el = slide.elements.find(e => e.id === id);
      if (el) {
        const copy = deepClone(el);
        copy.id = genId();
        copy.x += 20;
        copy.y += 20;
        slide.elements.push(copy);
        newIds.push(copy.id);
      }
    });
    deck.meta.modified = new Date().toISOString();
    set({ deck, selectedElementIds: newIds });
  },

  moveElementZ: (elementId, direction) => {
    get()._pushUndo('Change layer order');
    const deck = deepClone(get().deck);
    const slide = deck.slides[get().currentSlideIndex];
    const el = slide.elements.find(e => e.id === elementId);
    if (!el) return;

    const sorted = [...slide.elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    const idx = sorted.findIndex(e => e.id === elementId);

    if (direction === 'front') {
      el.zIndex = Math.max(...sorted.map(e => e.zIndex || 0)) + 1;
    } else if (direction === 'back') {
      el.zIndex = Math.min(...sorted.map(e => e.zIndex || 0)) - 1;
    } else if (direction === 'forward' && idx < sorted.length - 1) {
      const next = sorted[idx + 1];
      const tmp = el.zIndex;
      el.zIndex = next.zIndex;
      next.zIndex = tmp;
    } else if (direction === 'backward' && idx > 0) {
      const prev = sorted[idx - 1];
      const tmp = el.zIndex;
      el.zIndex = prev.zIndex;
      prev.zIndex = tmp;
    }

    deck.meta.modified = new Date().toISOString();
    set({ deck });
  },

  // ========== SELECTION ==========

  selectElement: (id, addToSelection = false) => {
    if (addToSelection) {
      const { selectedElementIds } = get();
      if (selectedElementIds.includes(id)) {
        set({ selectedElementIds: selectedElementIds.filter(eid => eid !== id) });
      } else {
        set({ selectedElementIds: [...selectedElementIds, id] });
      }
    } else {
      set({ selectedElementIds: id ? [id] : [] });
    }
  },

  selectAll: () => {
    const slide = get().getCurrentSlide();
    if (slide) {
      set({ selectedElementIds: slide.elements.map(el => el.id) });
    }
  },

  clearSelection: () => {
    set({ selectedElementIds: [], editingTextId: null });
  },

  // ========== CLIPBOARD ==========

  copyElements: () => {
    const selected = get().getSelectedElements();
    if (selected.length > 0) {
      set({ clipboard: deepClone(selected) });
    }
  },

  pasteElements: () => {
    const { clipboard } = get();
    if (clipboard.length === 0) return;
    get()._pushUndo('Paste elements');
    const deck = deepClone(get().deck);
    const slide = deck.slides[get().currentSlideIndex];
    const newIds = [];
    clipboard.forEach(el => {
      const copy = deepClone(el);
      copy.id = genId();
      copy.x += 20;
      copy.y += 20;
      slide.elements.push(copy);
      newIds.push(copy.id);
    });
    deck.meta.modified = new Date().toISOString();
    set({ deck, selectedElementIds: newIds });
  },

  cutElements: () => {
    get().copyElements();
    get().deleteElements(get().selectedElementIds);
  },

  // ========== UI STATE ==========

  setTool: (tool) => set({ tool }),
  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(2, zoom)) }),
  toggleGrid: () => set(s => ({ showGrid: !s.showGrid })),
  setRightTab: (tab) => set({ rightTab: tab }),
  setShowSettings: (show) => set({ showSettings: show }),
  setShowTemplates: (show) => set({ showTemplates: show }),
  setShowShortcuts: (show) => set({ showShortcuts: show }),
  setShowFindReplace: (show) => set({ showFindReplace: show }),
  setEditingTextId: (id) => set({ editingTextId: id }),
  setSaveStatus: (status) => set({ saveStatus: status }),
  setPanOffset: (offset) => set({ panOffset: offset }),

  // ========== CONFIG ==========

  setConfig: (updates) => {
    set(s => ({ config: { ...s.config, ...updates } }));
  },

  // ========== AI CHAT ==========

  addChatMessage: (msg) => {
    set(s => ({ chatMessages: [...s.chatMessages, msg] }));
  },

  setChatLoading: (loading) => set({ chatLoading: loading }),

  clearChat: () => set({ chatMessages: [] }),

  // ========== FIND & REPLACE ==========

  findAndReplace: (find, replace) => {
    if (!find) return [];
    get()._pushUndo('Find & Replace');
    const deck = deepClone(get().deck);
    const affected = [];
    deck.slides.forEach((slide, si) => {
      slide.elements.forEach(el => {
        if (el.content && el.content.includes(find)) {
          el.content = el.content.replaceAll(find, replace);
          if (!affected.includes(si)) affected.push(si);
        }
      });
    });
    deck.meta.modified = new Date().toISOString();
    set({ deck });
    return affected;
  },
}));

export default useDeckStore;
