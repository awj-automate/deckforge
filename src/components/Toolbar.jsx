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
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          borderRadius: 4,
          background: isActive ? '#3B82F6' : hovered ? '#F0F2F5' : 'transparent',
          color: isActive ? '#fff' : '#4B5563',
          cursor: 'pointer',
          padding: 0,
          transition: 'background 0.12s ease, color 0.12s ease',
        }}
        aria-label={label}
      >
        <svg width="22" height="22" viewBox="0 0 20 20">{icon}</svg>
      </button>
      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: 6,
          background: '#FFFFFF',
          color: '#1A1D23',
          fontSize: 12,
          padding: '4px 9px',
          borderRadius: 4,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #E2E5EB',
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
          height: 32,
          minWidth: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          border: 'none',
          borderRadius: 4,
          background: hovered && !disabled ? '#F0F2F5' : 'transparent',
          color: disabled ? '#CBD0D8' : '#4B5563',
          cursor: disabled ? 'default' : 'pointer',
          padding: '0 8px',
          fontSize: 14,
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
          background: '#FFFFFF',
          color: '#1A1D23',
          fontSize: 12,
          padding: '4px 9px',
          borderRadius: 4,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 9999,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #E2E5EB',
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
          background: '#FFFFFF',
          border: '1px solid #E2E5EB',
          borderRadius: 6,
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
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
        padding: '7px 16px',
        border: 'none',
        background: hovered ? '#F0F2F5' : 'transparent',
        color: '#1A1D23',
        fontSize: 13,
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      {label}
    </button>
  );
}

// ========== EXPORT HELPER ==========

async function exportSlides(deck, format) {
  const { default: html2canvas } = await import('html2canvas');

  // Create offscreen container
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;left:-9999px;top:0;z-index:-1;';
  document.body.appendChild(container);

  const canvases = [];

  for (let i = 0; i < deck.slides.length; i++) {
    const slide = deck.slides[i];
    const slideDiv = document.createElement('div');
    slideDiv.style.cssText = `width:960px;height:540px;position:relative;overflow:hidden;background:${slide.background?.color || '#FFFFFF'};`;

    const sorted = [...slide.elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    sorted.forEach(el => {
      if (el.hidden) return;
      const d = document.createElement('div');
      d.style.cssText = `position:absolute;left:${el.x}px;top:${el.y}px;width:${el.width}px;height:${el.height}px;opacity:${el.opacity != null ? el.opacity : 1};`;
      if (el.rotation) d.style.transform = `rotate(${el.rotation}deg)`;

      if (el.type === 'text') {
        d.style.fontFamily = (el.fontFamily || 'DM Sans') + ',sans-serif';
        d.style.fontSize = (el.fontSize || 24) + 'px';
        d.style.fontWeight = el.fontWeight || '400';
        d.style.color = el.color || '#1A1D23';
        d.style.lineHeight = el.lineHeight || 1.4;
        d.style.letterSpacing = (el.letterSpacing || 0) + 'px';
        d.style.textAlign = el.textAlign || 'left';
        d.style.whiteSpace = 'pre-wrap';
        d.style.display = 'flex';
        d.style.alignItems = el.verticalAlign === 'middle' ? 'center' : el.verticalAlign === 'bottom' ? 'flex-end' : 'flex-start';
        const inner = document.createElement('div');
        inner.style.width = '100%';
        inner.textContent = el.content || '';
        d.appendChild(inner);
      } else if (el.type === 'shape') {
        if (el.fill?.type === 'solid') d.style.background = el.fill.color;
        else if (el.fill?.type === 'linear') d.style.background = `linear-gradient(${el.fill.angle||0}deg,${el.fill.colors[0]},${el.fill.colors[1]})`;
        else if (el.fill?.type === 'radial') d.style.background = `radial-gradient(circle,${el.fill.colors[0]},${el.fill.colors[1]})`;
        if (el.shape === 'circle') d.style.borderRadius = '50%';
        if (el.cornerRadius) d.style.borderRadius = el.cornerRadius + 'px';
        if (el.border) d.style.border = `${el.border.width||1}px ${el.border.dash||'solid'} ${el.border.color||'#ccc'}`;
      } else if (el.type === 'code') {
        d.style.fontFamily = (el.fontFamily || 'Space Mono') + ',monospace';
        d.style.fontSize = (el.fontSize || 14) + 'px';
        d.style.color = el.color || '#374151';
        d.style.whiteSpace = 'pre-wrap';
        d.style.padding = '16px';
        d.style.background = '#F0F2F5';
        d.style.borderRadius = '8px';
        d.textContent = el.content || '';
      }
      slideDiv.appendChild(d);
    });

    container.appendChild(slideDiv);
    const canvas = await html2canvas(slideDiv, { scale: 2, useCORS: true, backgroundColor: null });
    canvases.push(canvas);
    container.removeChild(slideDiv);
  }

  document.body.removeChild(container);

  if (format === 'png') {
    // Download first slide as PNG
    const link = document.createElement('a');
    link.download = 'slide-1.png';
    link.href = canvases[0].toDataURL('image/png');
    link.click();
  } else if (format === 'pngzip') {
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();
    canvases.forEach((c, i) => {
      const data = c.toDataURL('image/png').split(',')[1];
      zip.file(`slide-${i + 1}.png`, data, { base64: true });
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.download = 'slides.zip';
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  } else if (format === 'pdf') {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [960, 540] });
    canvases.forEach((c, i) => {
      if (i > 0) pdf.addPage([960, 540], 'landscape');
      pdf.addImage(c.toDataURL('image/png'), 'PNG', 0, 0, 960, 540);
    });
    pdf.save((deck.meta.title || 'presentation') + '.pdf');
  }
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

  const setShowSettings = useDeckStore((s) => s.setShowSettings);
  const addElement = useDeckStore((s) => s.addElement);

  const handleToolSelect = useCallback((toolId) => {
    setTool(toolId);
    // For element tools, also add an element immediately
    if (toolId !== 'select') {
      const typeMap = {
        text: 'text',
        rectangle: 'shape',
        circle: 'shape',
        triangle: 'shape',
        line: 'shape',
        arrow: 'shape',
        image: 'image',
        code: 'code',
      };
      const elType = typeMap[toolId];
      if (elType) {
        const shapeMap = { rectangle: 'rectangle', circle: 'circle', triangle: 'triangle', line: 'line', arrow: 'arrow' };
        const extraProps = {};
        if (elType === 'shape') {
          extraProps.shape = shapeMap[toolId] || 'rectangle';
        }
        if (toolId === 'image') {
          // Open file picker for images
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => {
                addElement('image', { src: ev.target.result, x: 200, y: 100 });
              };
              reader.readAsDataURL(file);
            }
          };
          input.click();
          return;
        }
        // Center the new element
        extraProps.x = 280;
        extraProps.y = 170;
        addElement(elType, extraProps);
      }
    }
  }, [setTool, addElement]);

  const handlePresent = useCallback(() => {
    const deckData = JSON.stringify(deck);
    const win = window.open('', '_blank');
    if (!win) return;

    // Build a complete presentation viewer inline
    win.document.write(`<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${deck.meta.title || 'Presentation'}</title>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,700&family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&family=Playfair+Display:wght@400;600;700&family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=Bricolage+Grotesque:wght@400;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;overflow:hidden;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center}
.slide-container{width:960px;height:540px;position:relative;overflow:hidden;transition:opacity 0.4s}
.slide-counter{position:fixed;bottom:16px;right:24px;color:rgba(255,255,255,0.5);font:13px system-ui;z-index:100}
.progress{position:fixed;bottom:0;left:0;height:3px;background:#3B82F6;transition:width 0.3s;z-index:100}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideInLeft{from{transform:translateX(-60px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes slideInRight{from{transform:translateX(60px);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes slideInUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes slideInDown{from{transform:translateY(-40px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes scaleUp{from{transform:scale(0.85);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes scaleInX{from{transform:scaleX(0);opacity:0}to{transform:scaleX(1);opacity:1}}
@keyframes blurIn{from{filter:blur(10px);opacity:0}to{filter:blur(0);opacity:1}}
@keyframes bounce{0%{transform:scale(0.3);opacity:0}50%{transform:scale(1.05)}70%{transform:scale(0.95)}100%{transform:scale(1);opacity:1}}
</style></head><body>
<div class="slide-container" id="slide"></div>
<div class="slide-counter" id="counter"></div>
<div class="progress" id="progress"></div>
<script>
const deck=${deckData};
let idx=0;
const sc=document.getElementById('slide');
const ct=document.getElementById('counter');
const pr=document.getElementById('progress');

// Scale to fit
function fitSlide(){
  const sx=window.innerWidth/960, sy=window.innerHeight/540;
  const s=Math.min(sx,sy);
  sc.style.transform='scale('+s+')';
  sc.style.transformOrigin='center center';
}
fitSlide();
window.addEventListener('resize',fitSlide);

function gradient(f){
  if(!f)return 'transparent';
  if(f.type==='solid')return f.color;
  if(f.type==='linear')return 'linear-gradient('+((f.angle||0))+'deg,'+f.colors[0]+','+f.colors[1]+')';
  if(f.type==='radial')return 'radial-gradient(circle,'+f.colors[0]+','+f.colors[1]+')';
  return f.color||'transparent';
}

function borderCss(b){
  if(!b)return '';
  if(typeof b==='string')return b;
  return (b.width||1)+'px '+(b.dash||'solid')+' '+(b.color||'#ccc');
}

function render(){
  const s=deck.slides[idx];
  if(!s)return;
  const bg=s.background?(s.background.type==='solid'?s.background.color:gradient(s.background)):'#fff';
  sc.style.background=bg;
  sc.innerHTML='';
  const els=[...s.elements].sort((a,b)=>(a.zIndex||0)-(b.zIndex||0));
  els.forEach(el=>{
    if(el.hidden)return;
    const d=document.createElement('div');
    d.style.cssText='position:absolute;left:'+el.x+'px;top:'+el.y+'px;width:'+el.width+'px;height:'+el.height+'px;opacity:'+(el.opacity!=null?el.opacity:1)+';mix-blend-mode:'+(el.blendMode||'normal')+';';
    if(el.rotation)d.style.transform='rotate('+el.rotation+'deg)';

    if(el.type==='text'){
      const va=el.verticalAlign==='middle'?'center':el.verticalAlign==='bottom'?'flex-end':'flex-start';
      d.style.cssText+=';display:flex;align-items:'+va+';font-family:'+(el.fontFamily||'DM Sans')+',sans-serif;font-size:'+(el.fontSize||24)+'px;font-weight:'+(el.fontWeight||400)+';font-style:'+(el.fontStyle||'normal')+';color:'+(el.color||'#1A1D23')+';line-height:'+(el.lineHeight||1.4)+';letter-spacing:'+(el.letterSpacing||0)+'px;text-align:'+(el.textAlign||'left')+';white-space:pre-wrap;word-break:break-word;overflow:hidden;';
      const inner=document.createElement('div');
      inner.style.width='100%';
      inner.style.textAlign=el.textAlign||'left';
      inner.textContent=el.content||'';
      d.appendChild(inner);
    } else if(el.type==='shape'){
      d.style.background=gradient(el.fill);
      if(el.border)d.style.border=borderCss(el.border);
      if(el.shape==='circle')d.style.borderRadius='50%';
      else if(el.shape==='triangle')d.style.cssText+=';clip-path:polygon(50% 0%, 0% 100%, 100% 100%);';
      if(el.cornerRadius)d.style.borderRadius=el.cornerRadius+'px';
    } else if(el.type==='code'){
      d.style.cssText+=';font-family:'+(el.fontFamily||'Space Mono')+',monospace;font-size:'+(el.fontSize||14)+'px;color:'+(el.color||'#374151')+';white-space:pre-wrap;overflow:auto;padding:16px;background:'+(el.background||'#F0F2F5')+';border-radius:8px;';
      d.textContent=el.content||'';
    }

    // Animation
    if(el.animation&&el.animation.type&&el.animation.type!=='none'){
      d.style.opacity='0';
      const anim=el.animation;
      setTimeout(()=>{
        d.style.animation=anim.type+' '+(anim.duration||500)+'ms '+(anim.easing||'ease-out')+' forwards';
      },anim.delay||0);
    }

    sc.appendChild(d);
  });
  ct.textContent=(idx+1)+' / '+deck.slides.length;
  pr.style.width=((idx+1)/deck.slides.length*100)+'%';
}

render();
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();idx=Math.min(idx+1,deck.slides.length-1);render();}
  if(e.key==='ArrowLeft'){e.preventDefault();idx=Math.max(idx-1,0);render();}
  if(e.key==='Escape')window.close();
  if(e.key==='f'||e.key==='F'){document.documentElement.requestFullscreen?.();}
});
document.addEventListener('click',()=>{idx=Math.min(idx+1,deck.slides.length-1);render();});
document.documentElement.requestFullscreen?.().catch(()=>{});
<\/script></body></html>`);
    win.document.close();
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
<style>body{margin:0;background:#F8F9FB;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;}
.slide{width:960px;height:540px;position:relative;overflow:hidden;}</style></head>
<body><div class="slide" id="slide"></div>
<script>const deck=${JSON.stringify(deck)};let i=0;
function render(){const s=deck.slides[i];if(!s)return;
document.getElementById('slide').style.background=s.background?.color||'#FFFFFF';
document.getElementById('slide').innerHTML=s.elements.map(e=>'<div style="position:absolute;left:'+e.x+'px;top:'+e.y+'px;width:'+e.width+'px;height:'+e.height+'px;color:'+(e.color||'#1A1D23')+';font-size:'+(e.fontSize||16)+'px">'+(e.content||'')+'</div>').join('');}
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
        exportSlides(deck, format);
        break;
      default:
        break;
    }
  }, [deck]);

  const handleZoomSelect = useCallback((preset) => {
    if (preset === 'fit') {
      // Approximate fit: assume a typical canvas area of ~700px wide
      setZoom(1.05);
    } else {
      setZoom(preset);
    }
  }, [setZoom]);

  const saveLabel = saveStatus === 'saved' ? 'Saved' : saveStatus === 'saving' ? 'Saving...' : 'Unsaved changes';
  const saveColor = saveStatus === 'saved' ? '#4ade80' : saveStatus === 'saving' ? '#facc15' : '#f87171';

  return (
    <div style={{
      height: 48,
      minHeight: 48,
      background: '#FFFFFF',
      borderBottom: '1px solid #E2E5EB',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="14" height="10" rx="2" fill="#3B82F6" opacity="0.3"/>
            <rect x="5" y="6" width="14" height="10" rx="2" fill="#3B82F6" opacity="0.6"/>
            <rect x="7" y="8" width="14" height="10" rx="2" fill="#3B82F6"/>
          </svg>
          <span style={{
            fontWeight: 700,
            fontSize: 16,
            color: '#1A1D23',
            letterSpacing: '-0.03em',
          }}>
            DeckForge
          </span>
        </div>
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
        <div style={{ width: 1, height: 18, background: '#E2E5EB', margin: '0 6px' }} />

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
              <span style={{ fontSize: 12, minWidth: 36, textAlign: 'center' }}>
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
            <rect x="2" y="2" width="7" height="7" stroke="currentColor" strokeWidth="1.2" fill={showGrid ? '#3B82F6' : 'none'} rx="1"/>
            <rect x="11" y="2" width="7" height="7" stroke="currentColor" strokeWidth="1.2" fill={showGrid ? '#3B82F6' : 'none'} rx="1"/>
            <rect x="2" y="11" width="7" height="7" stroke="currentColor" strokeWidth="1.2" fill={showGrid ? '#3B82F6' : 'none'} rx="1"/>
            <rect x="11" y="11" width="7" height="7" stroke="currentColor" strokeWidth="1.2" fill={showGrid ? '#3B82F6' : 'none'} rx="1"/>
          </svg>
        </IconButton>

        {/* Save status */}
        <div style={{
          fontSize: 11,
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
        <div style={{ width: 1, height: 18, background: '#E2E5EB' }} />

        {/* Present button */}
        <IconButton label="Present" shortcut="Ctrl+Shift+P" onClick={handlePresent}>
          <svg width="16" height="16" viewBox="0 0 20 20">
            <polygon points="6,4 16,10 6,16" fill="currentColor"/>
          </svg>
          <span style={{ fontSize: 13 }}>Present</span>
        </IconButton>

        {/* Export dropdown */}
        <Dropdown
          align="right"
          trigger={
            <IconButton label="Export">
              <svg width="14" height="14" viewBox="0 0 20 20">
                <path d="M10 3 L10 13 M6 9 L10 13 L14 9 M4 16 L16 16" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <span style={{ fontSize: 13 }}>Export</span>
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
