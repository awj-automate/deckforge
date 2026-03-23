import useDeckStore from '../store/deckStore';
import { genId } from '../utils/helpers';

const templates = [
  {
    name: 'Blank',
    icon: '☐',
    create: (theme) => ({
      id: genId(),
      notes: '',
      transition: 'fade',
      background: { type: 'solid', color: theme.backgroundDefault },
      elements: [],
    }),
  },
  {
    name: 'Title Slide',
    icon: '▣',
    create: (theme) => ({
      id: genId(),
      notes: '',
      transition: 'fade',
      background: { type: 'solid', color: theme.backgroundDefault },
      elements: [
        {
          id: genId(), type: 'text', x: 80, y: 160, width: 800, height: 120,
          rotation: 0, opacity: 1, locked: false, hidden: false, blendMode: 'normal', zIndex: 2,
          content: 'Your Title Here', fontSize: 72, fontFamily: theme.fontDisplay,
          fontWeight: '700', fontStyle: 'normal', color: '#FFFFFF',
          lineHeight: 1.1, letterSpacing: -2, textAlign: 'center', verticalAlign: 'top',
          textShadow: null, background: null, border: null,
          animation: { type: 'scaleUp', duration: 600, delay: 0, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        },
        {
          id: genId(), type: 'text', x: 180, y: 300, width: 600, height: 40,
          rotation: 0, opacity: 0.6, locked: false, hidden: false, blendMode: 'normal', zIndex: 3,
          content: 'A compelling subtitle that sets the stage', fontSize: 20, fontFamily: theme.fontBody,
          fontWeight: '400', fontStyle: 'normal', color: '#FFFFFF',
          lineHeight: 1.5, letterSpacing: 0, textAlign: 'center', verticalAlign: 'top',
          textShadow: null, background: null, border: null,
          animation: { type: 'fadeIn', duration: 500, delay: 300, easing: 'ease-out' },
        },
        {
          id: genId(), type: 'shape', shape: 'rectangle',
          x: 400, y: 370, width: 160, height: 3, rotation: 0, opacity: 1,
          locked: false, hidden: false, blendMode: 'normal', zIndex: 1,
          fill: { type: 'solid', color: theme.accent1 }, border: null,
          animation: { type: 'scaleInX', duration: 500, delay: 200, easing: 'ease-out' },
        },
      ],
    }),
  },
  {
    name: 'Title + Content',
    icon: '◧',
    create: (theme) => ({
      id: genId(),
      notes: '',
      transition: 'fade',
      background: { type: 'solid', color: theme.backgroundDefault },
      elements: [
        {
          id: genId(), type: 'text', x: 80, y: 40, width: 200, height: 30,
          rotation: 0, opacity: 0.4, locked: false, hidden: false, blendMode: 'normal', zIndex: 1,
          content: 'SECTION', fontSize: 12, fontFamily: theme.fontBody,
          fontWeight: '700', fontStyle: 'normal', color: theme.accent1,
          lineHeight: 1.4, letterSpacing: 4, textAlign: 'left', verticalAlign: 'top',
          textShadow: null, background: null, border: null,
          animation: { type: 'fadeIn', duration: 400, delay: 0, easing: 'ease-out' },
        },
        {
          id: genId(), type: 'text', x: 80, y: 80, width: 400, height: 100,
          rotation: 0, opacity: 1, locked: false, hidden: false, blendMode: 'normal', zIndex: 2,
          content: 'Main heading goes here', fontSize: 40, fontFamily: theme.fontDisplay,
          fontWeight: '700', fontStyle: 'normal', color: '#FFFFFF',
          lineHeight: 1.15, letterSpacing: -1, textAlign: 'left', verticalAlign: 'top',
          textShadow: null, background: null, border: null,
          animation: { type: 'slideInLeft', duration: 600, delay: 100, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        },
        {
          id: genId(), type: 'text', x: 80, y: 220, width: 400, height: 200,
          rotation: 0, opacity: 0.6, locked: false, hidden: false, blendMode: 'normal', zIndex: 3,
          content: 'Add your supporting content here. Break it into short, digestible points that reinforce your main message.',
          fontSize: 16, fontFamily: theme.fontBody,
          fontWeight: '400', fontStyle: 'normal', color: '#FFFFFF',
          lineHeight: 1.6, letterSpacing: 0, textAlign: 'left', verticalAlign: 'top',
          textShadow: null, background: null, border: null,
          animation: { type: 'fadeIn', duration: 500, delay: 300, easing: 'ease-out' },
        },
        {
          id: genId(), type: 'shape', shape: 'rectangle',
          x: 540, y: 80, width: 360, height: 380, rotation: 0, opacity: 1,
          locked: false, hidden: false, blendMode: 'normal', zIndex: 1,
          fill: { type: 'solid', color: '#131318' },
          border: { width: 1, color: '#2a2a35', dash: 'solid' }, cornerRadius: 12,
          animation: { type: 'slideInRight', duration: 500, delay: 200, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        },
      ],
    }),
  },
  {
    name: 'Full Image',
    icon: '▥',
    create: (theme) => ({
      id: genId(),
      notes: '',
      transition: 'fade',
      background: { type: 'solid', color: theme.backgroundDefault },
      elements: [
        {
          id: genId(), type: 'shape', shape: 'rectangle',
          x: 0, y: 0, width: 960, height: 540, rotation: 0, opacity: 0.5,
          locked: false, hidden: false, blendMode: 'normal', zIndex: 0,
          fill: { type: 'linear', colors: [theme.accent1, theme.backgroundDefault], angle: 180 },
          border: null,
          animation: { type: 'fadeIn', duration: 800, delay: 0, easing: 'ease-out' },
        },
        {
          id: genId(), type: 'text', x: 80, y: 360, width: 500, height: 80,
          rotation: 0, opacity: 1, locked: false, hidden: false, blendMode: 'normal', zIndex: 2,
          content: 'Bold statement overlay', fontSize: 48, fontFamily: theme.fontDisplay,
          fontWeight: '700', fontStyle: 'normal', color: '#FFFFFF',
          lineHeight: 1.1, letterSpacing: -1, textAlign: 'left', verticalAlign: 'top',
          textShadow: { x: 0, y: 2, blur: 8, color: 'rgba(0,0,0,0.5)' },
          background: null, border: null,
          animation: { type: 'slideInUp', duration: 600, delay: 200, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        },
        {
          id: genId(), type: 'text', x: 80, y: 450, width: 500, height: 40,
          rotation: 0, opacity: 0.7, locked: false, hidden: false, blendMode: 'normal', zIndex: 3,
          content: 'Supporting context beneath the image', fontSize: 16, fontFamily: theme.fontBody,
          fontWeight: '400', fontStyle: 'normal', color: '#FFFFFF',
          lineHeight: 1.5, letterSpacing: 0, textAlign: 'left', verticalAlign: 'top',
          textShadow: null, background: null, border: null,
          animation: { type: 'fadeIn', duration: 400, delay: 400, easing: 'ease-out' },
        },
      ],
    }),
  },
  {
    name: 'Two Column',
    icon: '▦',
    create: (theme) => ({
      id: genId(),
      notes: '',
      transition: 'fade',
      background: { type: 'solid', color: theme.backgroundDefault },
      elements: [
        {
          id: genId(), type: 'text', x: 80, y: 60, width: 380, height: 80,
          rotation: 0, opacity: 1, locked: false, hidden: false, blendMode: 'normal', zIndex: 2,
          content: 'Left Column', fontSize: 32, fontFamily: theme.fontDisplay,
          fontWeight: '700', fontStyle: 'normal', color: '#FFFFFF',
          lineHeight: 1.2, letterSpacing: -1, textAlign: 'left', verticalAlign: 'top',
          textShadow: null, background: null, border: null,
          animation: { type: 'slideInLeft', duration: 500, delay: 0, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        },
        {
          id: genId(), type: 'text', x: 80, y: 150, width: 380, height: 300,
          rotation: 0, opacity: 0.6, locked: false, hidden: false, blendMode: 'normal', zIndex: 3,
          content: 'Describe the first point in detail here. Use specific examples and data.', fontSize: 16, fontFamily: theme.fontBody,
          fontWeight: '400', fontStyle: 'normal', color: '#FFFFFF',
          lineHeight: 1.6, letterSpacing: 0, textAlign: 'left', verticalAlign: 'top',
          textShadow: null, background: null, border: null,
          animation: { type: 'fadeIn', duration: 400, delay: 200, easing: 'ease-out' },
        },
        {
          id: genId(), type: 'shape', shape: 'rectangle',
          x: 478, y: 60, width: 1, height: 420, rotation: 0, opacity: 0.15,
          locked: false, hidden: false, blendMode: 'normal', zIndex: 1,
          fill: { type: 'solid', color: '#FFFFFF' }, border: null,
          animation: { type: 'fadeIn', duration: 400, delay: 100, easing: 'ease-out' },
        },
        {
          id: genId(), type: 'text', x: 520, y: 60, width: 380, height: 80,
          rotation: 0, opacity: 1, locked: false, hidden: false, blendMode: 'normal', zIndex: 2,
          content: 'Right Column', fontSize: 32, fontFamily: theme.fontDisplay,
          fontWeight: '700', fontStyle: 'normal', color: '#FFFFFF',
          lineHeight: 1.2, letterSpacing: -1, textAlign: 'left', verticalAlign: 'top',
          textShadow: null, background: null, border: null,
          animation: { type: 'slideInRight', duration: 500, delay: 100, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        },
        {
          id: genId(), type: 'text', x: 520, y: 150, width: 380, height: 300,
          rotation: 0, opacity: 0.6, locked: false, hidden: false, blendMode: 'normal', zIndex: 3,
          content: 'And the second point here. Mirror the structure for visual balance.', fontSize: 16, fontFamily: theme.fontBody,
          fontWeight: '400', fontStyle: 'normal', color: '#FFFFFF',
          lineHeight: 1.6, letterSpacing: 0, textAlign: 'left', verticalAlign: 'top',
          textShadow: null, background: null, border: null,
          animation: { type: 'fadeIn', duration: 400, delay: 300, easing: 'ease-out' },
        },
      ],
    }),
  },
  {
    name: 'Three Stats',
    icon: '▤',
    create: (theme) => ({
      id: genId(),
      notes: '',
      transition: 'fade',
      background: { type: 'solid', color: theme.backgroundDefault },
      elements: [
        {
          id: genId(), type: 'text', x: 80, y: 40, width: 800, height: 60,
          rotation: 0, opacity: 1, locked: false, hidden: false, blendMode: 'normal', zIndex: 2,
          content: 'Key metrics that matter', fontSize: 40, fontFamily: theme.fontDisplay,
          fontWeight: '700', fontStyle: 'normal', color: '#FFFFFF',
          lineHeight: 1.1, letterSpacing: -1, textAlign: 'left', verticalAlign: 'top',
          textShadow: null, background: null, border: null,
          animation: { type: 'slideInLeft', duration: 600, delay: 0, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        },
        ...[0, 1, 2].flatMap(i => {
          const colors = [theme.accent1, theme.accent2, theme.accent1];
          const bx = 80 + i * 280;
          return [
            {
              id: genId(), type: 'shape', shape: 'rectangle',
              x: bx, y: 160, width: 250, height: 300, rotation: 0, opacity: 1,
              locked: false, hidden: false, blendMode: 'normal', zIndex: 1,
              fill: { type: 'solid', color: '#131318' },
              border: { width: 1, color: '#2a2a35', dash: 'solid' }, cornerRadius: 12,
              animation: { type: 'slideInUp', duration: 500, delay: 200 + i * 150, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
            },
            {
              id: genId(), type: 'text',
              x: bx + 25, y: 200, width: 200, height: 60,
              rotation: 0, opacity: 1, locked: false, hidden: false, blendMode: 'normal', zIndex: 2,
              content: ['100K+', '99.9%', '3.5x'][i], fontSize: 48, fontFamily: theme.fontDisplay,
              fontWeight: '700', fontStyle: 'normal', color: colors[i],
              lineHeight: 1.0, letterSpacing: -2, textAlign: 'left', verticalAlign: 'top',
              textShadow: null, background: null, border: null,
              animation: { type: 'scaleUp', duration: 400, delay: 400 + i * 150, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
            },
            {
              id: genId(), type: 'text',
              x: bx + 25, y: 270, width: 200, height: 60,
              rotation: 0, opacity: 0.5, locked: false, hidden: false, blendMode: 'normal', zIndex: 2,
              content: ['Active users', 'Uptime SLA', 'ROI average'][i], fontSize: 14, fontFamily: theme.fontBody,
              fontWeight: '400', fontStyle: 'normal', color: '#FFFFFF',
              lineHeight: 1.5, letterSpacing: 0, textAlign: 'left', verticalAlign: 'top',
              textShadow: null, background: null, border: null,
              animation: { type: 'fadeIn', duration: 400, delay: 500 + i * 150, easing: 'ease-out' },
            },
          ];
        }),
      ],
    }),
  },
  {
    name: 'Quote',
    icon: '❝',
    create: (theme) => ({
      id: genId(),
      notes: '',
      transition: 'fade',
      background: { type: 'solid', color: theme.backgroundDefault },
      elements: [
        {
          id: genId(), type: 'text', x: 80, y: 80, width: 100, height: 120,
          rotation: 0, opacity: 0.15, locked: false, hidden: false, blendMode: 'normal', zIndex: 1,
          content: '"', fontSize: 200, fontFamily: theme.fontDisplay,
          fontWeight: '700', fontStyle: 'normal', color: theme.accent1,
          lineHeight: 0.8, letterSpacing: 0, textAlign: 'left', verticalAlign: 'top',
          textShadow: null, background: null, border: null,
          animation: { type: 'scaleUp', duration: 500, delay: 0, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        },
        {
          id: genId(), type: 'text', x: 120, y: 160, width: 720, height: 160,
          rotation: 0, opacity: 1, locked: false, hidden: false, blendMode: 'normal', zIndex: 2,
          content: 'This product changed how our entire leadership team makes decisions. We went from gut feelings to data-backed strategy overnight.',
          fontSize: 28, fontFamily: theme.fontDisplay,
          fontWeight: '400', fontStyle: 'italic', color: '#FFFFFF',
          lineHeight: 1.4, letterSpacing: 0, textAlign: 'left', verticalAlign: 'top',
          textShadow: null, background: null, border: null,
          animation: { type: 'fadeIn', duration: 600, delay: 200, easing: 'ease-out' },
        },
        {
          id: genId(), type: 'shape', shape: 'rectangle',
          x: 120, y: 370, width: 60, height: 3, rotation: 0, opacity: 1,
          locked: false, hidden: false, blendMode: 'normal', zIndex: 1,
          fill: { type: 'solid', color: theme.accent1 }, border: null,
          animation: { type: 'scaleInX', duration: 400, delay: 400, easing: 'ease-out' },
        },
        {
          id: genId(), type: 'text', x: 120, y: 390, width: 400, height: 60,
          rotation: 0, opacity: 0.6, locked: false, hidden: false, blendMode: 'normal', zIndex: 3,
          content: 'Sarah Johnson\nVP of Operations, Acme Corp', fontSize: 16, fontFamily: theme.fontBody,
          fontWeight: '500', fontStyle: 'normal', color: '#FFFFFF',
          lineHeight: 1.5, letterSpacing: 0, textAlign: 'left', verticalAlign: 'top',
          textShadow: null, background: null, border: null,
          animation: { type: 'fadeIn', duration: 400, delay: 500, easing: 'ease-out' },
        },
      ],
    }),
  },
  {
    name: 'Team Member',
    icon: '👤',
    create: (theme) => ({
      id: genId(),
      notes: '',
      transition: 'fade',
      background: { type: 'solid', color: theme.backgroundDefault },
      elements: [
        {
          id: genId(), type: 'shape', shape: 'circle',
          x: 380, y: 60, width: 200, height: 200, rotation: 0, opacity: 1,
          locked: false, hidden: false, blendMode: 'normal', zIndex: 1,
          fill: { type: 'linear', colors: [theme.accent1, theme.accent2], angle: 135 },
          border: null,
          animation: { type: 'scaleUp', duration: 500, delay: 0, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        },
        {
          id: genId(), type: 'text', x: 260, y: 290, width: 440, height: 40,
          rotation: 0, opacity: 1, locked: false, hidden: false, blendMode: 'normal', zIndex: 2,
          content: 'Team Member Name', fontSize: 32, fontFamily: theme.fontDisplay,
          fontWeight: '700', fontStyle: 'normal', color: '#FFFFFF',
          lineHeight: 1.2, letterSpacing: -1, textAlign: 'center', verticalAlign: 'top',
          textShadow: null, background: null, border: null,
          animation: { type: 'fadeIn', duration: 400, delay: 200, easing: 'ease-out' },
        },
        {
          id: genId(), type: 'text', x: 260, y: 340, width: 440, height: 30,
          rotation: 0, opacity: 0.6, locked: false, hidden: false, blendMode: 'normal', zIndex: 3,
          content: 'Title & Role', fontSize: 18, fontFamily: theme.fontBody,
          fontWeight: '500', fontStyle: 'normal', color: theme.accent1,
          lineHeight: 1.4, letterSpacing: 0, textAlign: 'center', verticalAlign: 'top',
          textShadow: null, background: null, border: null,
          animation: { type: 'fadeIn', duration: 400, delay: 300, easing: 'ease-out' },
        },
        {
          id: genId(), type: 'text', x: 200, y: 390, width: 560, height: 80,
          rotation: 0, opacity: 0.45, locked: false, hidden: false, blendMode: 'normal', zIndex: 3,
          content: 'Brief bio and key accomplishments. Previously at Company. Led notable projects or achievements.',
          fontSize: 14, fontFamily: theme.fontBody,
          fontWeight: '400', fontStyle: 'normal', color: '#FFFFFF',
          lineHeight: 1.6, letterSpacing: 0, textAlign: 'center', verticalAlign: 'top',
          textShadow: null, background: null, border: null,
          animation: { type: 'fadeIn', duration: 400, delay: 400, easing: 'ease-out' },
        },
      ],
    }),
  },
  {
    name: 'Code Slide',
    icon: '</>',
    create: (theme) => ({
      id: genId(),
      notes: '',
      transition: 'fade',
      background: { type: 'solid', color: theme.backgroundDefault },
      elements: [
        {
          id: genId(), type: 'text', x: 80, y: 40, width: 400, height: 60,
          rotation: 0, opacity: 1, locked: false, hidden: false, blendMode: 'normal', zIndex: 2,
          content: 'Code Example', fontSize: 32, fontFamily: theme.fontDisplay,
          fontWeight: '700', fontStyle: 'normal', color: '#FFFFFF',
          lineHeight: 1.2, letterSpacing: -1, textAlign: 'left', verticalAlign: 'top',
          textShadow: null, background: null, border: null,
          animation: { type: 'slideInLeft', duration: 500, delay: 0, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        },
        {
          id: genId(), type: 'shape', shape: 'rectangle',
          x: 80, y: 120, width: 800, height: 380, rotation: 0, opacity: 1,
          locked: false, hidden: false, blendMode: 'normal', zIndex: 1,
          fill: { type: 'solid', color: '#0D1117' },
          border: { width: 1, color: '#2a2a35', dash: 'solid' }, cornerRadius: 12,
          animation: { type: 'scaleUp', duration: 500, delay: 100, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        },
        {
          id: genId(), type: 'code',
          x: 110, y: 150, width: 740, height: 320,
          rotation: 0, opacity: 1, locked: false, hidden: false, blendMode: 'normal', zIndex: 2,
          content: '// Your code here\nconst result = await api.query({\n  question: "What drove growth?",\n  sources: ["salesforce", "stripe"],\n});\n\nconsole.log(result.answer);',
          language: 'javascript', codeTheme: 'dark',
          fontSize: 14, fontFamily: theme.fontMono, color: '#E0E0E0',
          background: null, border: null,
          animation: { type: 'fadeIn', duration: 500, delay: 300, easing: 'ease-out' },
        },
      ],
    }),
  },
  {
    name: 'Thank You / CTA',
    icon: '★',
    create: (theme) => ({
      id: genId(),
      notes: '',
      transition: 'fade',
      background: { type: 'solid', color: theme.backgroundDefault },
      elements: [
        {
          id: genId(), type: 'shape', shape: 'rectangle',
          x: 0, y: 0, width: 960, height: 540, rotation: 0, opacity: 0.08,
          locked: false, hidden: false, blendMode: 'screen', zIndex: 0,
          fill: { type: 'radial', colors: [theme.accent1, theme.backgroundDefault] },
          border: null,
          animation: { type: 'fadeIn', duration: 1000, delay: 0, easing: 'ease-out' },
        },
        {
          id: genId(), type: 'text', x: 160, y: 140, width: 640, height: 80,
          rotation: 0, opacity: 1, locked: false, hidden: false, blendMode: 'normal', zIndex: 2,
          content: 'Thank You', fontSize: 64, fontFamily: theme.fontDisplay,
          fontWeight: '700', fontStyle: 'normal', color: '#FFFFFF',
          lineHeight: 1.1, letterSpacing: -2, textAlign: 'center', verticalAlign: 'top',
          textShadow: null, background: null, border: null,
          animation: { type: 'scaleUp', duration: 600, delay: 100, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        },
        {
          id: genId(), type: 'shape', shape: 'rectangle',
          x: 350, y: 280, width: 260, height: 50, rotation: 0, opacity: 1,
          locked: false, hidden: false, blendMode: 'normal', zIndex: 1,
          fill: { type: 'linear', colors: [theme.accent1, theme.accent2], angle: 90 },
          border: null, cornerRadius: 25,
          animation: { type: 'scaleUp', duration: 500, delay: 400, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
        },
        {
          id: genId(), type: 'text', x: 350, y: 280, width: 260, height: 50,
          rotation: 0, opacity: 1, locked: false, hidden: false, blendMode: 'normal', zIndex: 2,
          content: 'Get in Touch', fontSize: 18, fontFamily: theme.fontBody,
          fontWeight: '600', fontStyle: 'normal', color: '#FFFFFF',
          lineHeight: 1.0, letterSpacing: 0, textAlign: 'center', verticalAlign: 'middle',
          textShadow: null, background: null, border: null,
          animation: { type: 'fadeIn', duration: 400, delay: 600, easing: 'ease-out' },
        },
        {
          id: genId(), type: 'text', x: 260, y: 370, width: 440, height: 30,
          rotation: 0, opacity: 0.5, locked: false, hidden: false, blendMode: 'normal', zIndex: 3,
          content: 'hello@yourcompany.com  ·  yourcompany.com', fontSize: 14, fontFamily: theme.fontBody,
          fontWeight: '400', fontStyle: 'normal', color: '#FFFFFF',
          lineHeight: 1.4, letterSpacing: 1, textAlign: 'center', verticalAlign: 'top',
          textShadow: null, background: null, border: null,
          animation: { type: 'fadeIn', duration: 400, delay: 800, easing: 'ease-out' },
        },
      ],
    }),
  },
];

export default function TemplatePicker() {
  const { deck, currentSlideIndex, addSlide, setShowTemplates } = useDeckStore();
  const theme = deck.theme;

  const handleSelect = (template) => {
    const slide = template.create(theme);
    addSlide(slide, currentSlideIndex);
    setShowTemplates(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setShowTemplates(false)}>
      <div
        className="modal"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 720, maxHeight: '80vh' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0 }}>Add Slide</h2>
          <button
            onClick={() => setShowTemplates(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', fontSize: 18, padding: 4 }}
          >✕</button>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 12,
        }}>
          {templates.map(template => (
            <button
              key={template.name}
              onClick={() => handleSelect(template)}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 8,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.background = 'var(--accent-muted)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.background = 'var(--bg-surface)';
              }}
            >
              <span style={{ fontSize: 28, opacity: 0.6 }}>{template.icon}</span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', textAlign: 'center' }}>
                {template.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
