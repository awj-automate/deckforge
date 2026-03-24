import { v4 as uuidv4 } from 'uuid';

export const genId = () => uuidv4();

export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export const snapToGrid = (val, gridSize = 16) => Math.round(val / gridSize) * gridSize;

export const cssGradient = (fill) => {
  if (!fill) return 'transparent';
  if (fill.type === 'solid') return fill.color;
  if (fill.type === 'linear') {
    const angle = fill.angle ?? 0;
    return `linear-gradient(${angle}deg, ${fill.colors[0]}, ${fill.colors[1]})`;
  }
  if (fill.type === 'radial') {
    return `radial-gradient(circle, ${fill.colors[0]}, ${fill.colors[1]})`;
  }
  return 'transparent';
};

export const cssBackground = (bg) => {
  if (!bg) return 'transparent';
  if (bg.type === 'solid') return bg.color;
  if (bg.type === 'gradient' || bg.type === 'linear') {
    return cssGradient(bg);
  }
  if (bg.type === 'image' && bg.url) {
    return `url(${bg.url}) center/cover no-repeat`;
  }
  return bg.color || 'transparent';
};

export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

export const createDefaultElement = (type, theme) => {
  const base = {
    id: genId(),
    type,
    x: 100, y: 100,
    width: 200, height: 100,
    rotation: 0,
    opacity: 1,
    locked: false,
    hidden: false,
    blendMode: 'normal',
    zIndex: 100,
    animation: null,
  };

  switch (type) {
    case 'text':
      return {
        ...base,
        width: 400, height: 60,
        content: 'New text',
        fontSize: 24,
        fontFamily: theme?.fontBody || 'DM Sans',
        fontWeight: '400',
        fontStyle: 'normal',
        color: '#1A1D23',
        lineHeight: 1.4,
        letterSpacing: 0,
        textAlign: 'left',
        verticalAlign: 'top',
        textShadow: null,
        background: null,
        border: null,
      };
    case 'shape':
      return {
        ...base,
        shape: 'rectangle',
        width: 200, height: 150,
        fill: { type: 'solid', color: theme?.accent1 || '#3B82F6' },
        border: null,
        cornerRadius: 0,
      };
    case 'image':
      return {
        ...base,
        width: 300, height: 200,
        src: '',
        objectFit: 'cover',
        borderRadius: 0,
        shadow: null,
      };
    case 'code':
      return {
        ...base,
        width: 400, height: 200,
        content: '// Your code here\nconsole.log("Hello");',
        language: 'javascript',
        codeTheme: 'dark',
        fontSize: 14,
        fontFamily: theme?.fontMono || 'Space Mono',
        color: '#374151',
        background: null,
        border: null,
      };
    case 'divider':
      return {
        ...base,
        width: 400, height: 2,
        color: '#1A1D23',
        thickness: 2,
        dash: 'solid',
      };
    default:
      return base;
  }
};

export const FONTS = [
  'Fraunces', 'DM Sans', 'Playfair Display', 'Bebas Neue',
  'Space Mono', 'Syne', 'Bricolage Grotesque',
  'Inter', 'Arial', 'Georgia', 'Times New Roman',
];

export const BLEND_MODES = [
  'normal', 'multiply', 'screen', 'overlay', 'darken',
  'lighten', 'color-dodge', 'color-burn', 'hard-light',
  'soft-light', 'difference', 'exclusion',
];

export const TRANSITIONS = ['none', 'fade', 'slideLeft', 'slideRight', 'zoom', 'flip'];

export const ANIMATIONS = [
  'none', 'fadeIn', 'slideInLeft', 'slideInRight', 'slideInUp',
  'slideInDown', 'scaleUp', 'scaleInX', 'typewriter', 'blurIn', 'bounce',
];

export const EASINGS = [
  'ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear',
  'cubic-bezier(0.16, 1, 0.3, 1)',
  'cubic-bezier(0.34, 1.56, 0.64, 1)',
];

export const SHAPE_TYPES = ['rectangle', 'circle', 'triangle', 'line', 'arrow'];
