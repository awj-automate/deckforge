import React, { useState, useRef, useEffect, useCallback } from 'react';
import useDeckStore from '../store/deckStore';

const SYSTEM_PROMPT = `You are DeckForge AI, an expert presentation designer. You create and modify slide decks.

Canvas: 960x540 pixels (16:9). Use white (#FFFFFF) backgrounds with dark text (#1A1D23).

Deck JSON schema:
{
  "meta": { "title": "string", "created": "ISO date", "modified": "ISO date", "version": "1.0" },
  "theme": { "backgroundDefault": "#FFFFFF", "accent1": "#3B82F6", "accent2": "#8B5CF6", "fontDisplay": "Fraunces", "fontBody": "DM Sans", "fontMono": "Space Mono" },
  "slides": [{
    "id": "unique-id", "notes": "", "transition": "fade",
    "background": { "type": "solid", "color": "#FFFFFF" },
    "elements": [{
      "id": "unique-id", "type": "text|shape|code",
      "x": 0, "y": 0, "width": 960, "height": 540,
      "rotation": 0, "opacity": 1, "zIndex": 1,
      "locked": false, "hidden": false, "blendMode": "normal",
      "animation": { "type": "fadeIn", "delay": 0, "duration": 600, "easing": "ease" },
      "content": "text", "fontSize": 24, "fontFamily": "DM Sans",
      "fontWeight": "400", "fontStyle": "normal", "color": "#1A1D23",
      "lineHeight": 1.4, "letterSpacing": 0, "textAlign": "left", "verticalAlign": "top",
      "shape": "rectangle", "fill": { "type": "solid", "color": "#hex" }, "cornerRadius": 0,
      "border": { "width": 1, "color": "#E2E5EB", "dash": "solid" }
    }]
  }]
}

Available fonts: Fraunces, DM Sans, Playfair Display, Bebas Neue, Space Mono, Syne, Bricolage Grotesque.
Available animations: fadeIn, slideInLeft, slideInRight, slideInUp, slideInDown, scaleUp, scaleInX, blurIn, bounce.
Shape types: rectangle, circle, triangle, line, arrow.

CRITICAL RULES:
1. When creating or modifying slides, output ONLY valid JSON. Nothing else. No explanation. No markdown fences. Just the raw JSON object starting with { and ending with }.
2. For conversational responses (questions, advice), start with exactly "CHAT:" followed by your response.
3. Always include meta, theme, and slides in full deck output.
4. Use staggered animation delays (0, 200, 400ms).
5. Generate unique IDs (8-char hex like "a1b2c3d4").`;

function generateId() {
  return Math.random().toString(16).slice(2, 10);
}

// Robust JSON extraction — finds JSON anywhere in text
function extractJson(text) {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();

  // Skip if it starts with CHAT:
  if (trimmed.startsWith('CHAT:')) return null;

  // 1. Try code block
  const codeBlock = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlock) {
    try { return JSON.parse(codeBlock[1].trim()); } catch {}
  }

  // 2. Try whole string
  try { return JSON.parse(trimmed); } catch {}

  // 3. Find outermost { ... } by brace counting
  const start = trimmed.indexOf('{');
  if (start !== -1) {
    let depth = 0, inStr = false, esc = false;
    for (let i = start; i < trimmed.length; i++) {
      const c = trimmed[i];
      if (esc) { esc = false; continue; }
      if (c === '\\' && inStr) { esc = true; continue; }
      if (c === '"') { inStr = !inStr; continue; }
      if (inStr) continue;
      if (c === '{') depth++;
      if (c === '}') {
        depth--;
        if (depth === 0) {
          try { return JSON.parse(trimmed.substring(start, i + 1)); } catch {}
          break;
        }
      }
    }
  }

  return null;
}

function applyJsonToStore(jsonData) {
  const store = useDeckStore.getState();

  if (jsonData.meta && jsonData.slides) {
    // Full deck
    store.setDeck(jsonData);
    return `Done! Rebuilt deck with ${jsonData.slides.length} slides.`;
  }

  if (jsonData.slides && Array.isArray(jsonData.slides)) {
    // Partial — just slides
    const d = JSON.parse(JSON.stringify(store.deck));
    d.slides = jsonData.slides;
    if (jsonData.theme) d.theme = { ...d.theme, ...jsonData.theme };
    d.meta.modified = new Date().toISOString();
    store.setDeck(d);
    return `Done! Updated ${jsonData.slides.length} slides.`;
  }

  if (Array.isArray(jsonData)) {
    const d = JSON.parse(JSON.stringify(store.deck));
    d.slides = jsonData;
    d.meta.modified = new Date().toISOString();
    store.setDeck(d);
    return `Done! Replaced with ${jsonData.length} slides.`;
  }

  if (jsonData.elements) {
    // Single slide
    const d = JSON.parse(JSON.stringify(store.deck));
    const idx = store.currentSlideIndex;
    if (!jsonData.id) jsonData.id = generateId();
    if (!jsonData.background) jsonData.background = { type: 'solid', color: '#FFFFFF' };
    if (!jsonData.transition) jsonData.transition = 'fade';
    if (!jsonData.notes) jsonData.notes = '';
    d.slides[idx] = jsonData;
    d.meta.modified = new Date().toISOString();
    store.setDeck(d);
    return `Done! Updated slide ${idx + 1}.`;
  }

  return null; // couldn't determine format
}

export default function AIChatPanel() {
  const chatMessages = useDeckStore((s) => s.chatMessages);
  const chatLoading = useDeckStore((s) => s.chatLoading);
  const config = useDeckStore((s) => s.config);
  const deck = useDeckStore((s) => s.deck);
  const currentSlideIndex = useDeckStore((s) => s.currentSlideIndex);
  const setShowSettings = useDeckStore((s) => s.setShowSettings);

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || chatLoading) return;

    const store = useDeckStore.getState();

    if (!config.apiKey) {
      store.addChatMessage({ id: generateId(), role: 'error', content: 'Set your API key in Settings first.' });
      return;
    }

    store.addChatMessage({ id: generateId(), role: 'user', content: text });
    setInput('');
    store.setChatLoading(true);

    try {
      // Build messages — just the user prompt with deck context
      const currentDeck = store.deck;
      const slideIdx = store.currentSlideIndex;
      const slide = currentDeck.slides[slideIdx];

      const userContent = `${text}\n\n[Current deck (${currentDeck.slides.length} slides, viewing slide ${slideIdx + 1}):\n${JSON.stringify(currentDeck)}\n]`;

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 16384,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userContent }],
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        let msg = `API error (${res.status})`;
        try { msg = JSON.parse(body).error?.message || msg; } catch {}
        throw new Error(msg);
      }

      const data = await res.json();
      const aiText = data.content?.[0]?.text || '';

      console.log('[DeckForge AI] Raw response length:', aiText.length);
      console.log('[DeckForge AI] First 200 chars:', aiText.substring(0, 200));

      // Refresh store reference after await
      const s = useDeckStore.getState();

      // Chat response?
      if (aiText.trim().startsWith('CHAT:')) {
        s.addChatMessage({ id: generateId(), role: 'assistant', content: aiText.trim().slice(5).trim() });
        s.setChatLoading(false);
        return;
      }

      // Try to extract JSON
      const json = extractJson(aiText);
      console.log('[DeckForge AI] Extracted JSON:', json ? 'yes (' + (json.slides?.length || 'obj') + ')' : 'no');

      if (json) {
        const result = applyJsonToStore(json);
        if (result) {
          const s2 = useDeckStore.getState();
          s2.addChatMessage({ id: generateId(), role: 'assistant', content: result });
        } else {
          s.addChatMessage({ id: generateId(), role: 'assistant', content: 'Received data but couldn\'t determine format. The response may have been truncated.' });
        }
      } else {
        // No JSON found — show the text (might be advice or a truncated response)
        const preview = aiText.length > 500 ? aiText.substring(0, 500) + '...' : aiText;
        s.addChatMessage({ id: generateId(), role: 'assistant', content: preview });
      }
    } catch (err) {
      console.error('[DeckForge AI] Error:', err);
      useDeckStore.getState().addChatMessage({ id: generateId(), role: 'error', content: err.message });
    } finally {
      useDeckStore.getState().setChatLoading(false);
    }
  }, [input, chatLoading, config.apiKey]);

  if (!config.apiKey) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100%', padding: 20, color: '#6B7280', textAlign: 'center', gap: 12,
      }}>
        <div style={{ fontSize: 14 }}>No API key configured.</div>
        <button
          onClick={() => setShowSettings(true)}
          style={{
            padding: '6px 16px', background: '#3B82F6', color: '#fff',
            border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer',
          }}
        >Open Settings</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px', display: 'flex', flexDirection: 'column' }}>
        {chatMessages.length === 0 && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: '#9CA3AF', fontSize: 13, textAlign: 'center', gap: 8, padding: 20,
          }}>
            <div>Ask DeckForge AI to create or modify your slides.</div>
            <div style={{ color: '#CBD0D8', marginTop: 4 }}>
              Try: "Create a 5-slide pitch deck about AI startups"
            </div>
          </div>
        )}

        {chatMessages.map((msg, i) => (
          <div key={msg.id || i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: 10,
          }}>
            <div style={{
              maxWidth: '85%',
              padding: '8px 12px',
              borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              background: msg.role === 'error' ? '#FEE2E2' : msg.role === 'user' ? '#3B82F6' : '#F0F2F5',
              color: msg.role === 'error' ? '#991B1B' : msg.role === 'user' ? '#fff' : '#1A1D23',
              fontSize: 14, lineHeight: 1.5, wordBreak: 'break-word', whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {chatLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 10 }}>
            <div style={{
              padding: '8px 16px', borderRadius: '12px 12px 12px 2px',
              background: '#F0F2F5', color: '#9CA3AF', fontSize: 18,
            }}>...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: '1px solid #E2E5EB', padding: '8px 10px', display: 'flex', gap: 6, alignItems: 'flex-end' }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder="Ask AI to create or edit slides..."
          rows={2}
          style={{
            flex: 1, resize: 'none', background: '#fff', border: '1px solid #E2E5EB',
            borderRadius: 8, color: '#1A1D23', fontSize: 14, padding: '8px 10px',
            fontFamily: 'DM Sans, sans-serif', outline: 'none', lineHeight: 1.4,
          }}
          onFocus={(e) => { e.target.style.borderColor = '#3B82F6'; }}
          onBlur={(e) => { e.target.style.borderColor = '#E2E5EB'; }}
        />
        <button
          onClick={sendMessage}
          disabled={chatLoading || !input.trim()}
          style={{
            width: 36, height: 36, borderRadius: 8, border: 'none',
            background: chatLoading || !input.trim() ? '#F0F2F5' : '#3B82F6',
            color: chatLoading || !input.trim() ? '#CBD0D8' : '#fff',
            cursor: chatLoading || !input.trim() ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 20 20">
            <path d="M3 10 L17 10 M12 5 L17 10 L12 15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
