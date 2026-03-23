import React, { useState, useRef, useEffect, useCallback } from 'react';
import useDeckStore from '../store/deckStore';

const SYSTEM_PROMPT = `You are DeckForge AI, an expert presentation designer and content strategist. You help users create visually stunning, professional presentations.

Your capabilities:
- Create complete presentation decks from scratch based on a topic or description
- Modify existing slides: change content, layout, styling, and animations
- Suggest improvements for visual design, content flow, and storytelling
- Add, remove, or reorder slides
- Apply consistent themes, color palettes, and typography

Design principles you follow:
- Visual Excellence: Use bold colors, strong contrast, generous whitespace, and modern typography
- Hierarchy: Clear visual hierarchy with titles, subtitles, body text, and accent elements
- Consistency: Maintain consistent styling across all slides (fonts, colors, spacing)
- Animation: Thoughtful entrance animations (fadeIn, slideInUp, scaleUp) with staggered delays for visual flow
- Simplicity: One key idea per slide, avoid clutter, use visuals over text walls

Deck JSON structure you output:
{
  "meta": { "title": "string", "author": "string", "created": "ISO date", "modified": "ISO date" },
  "theme": {
    "backgroundDefault": "#hex",
    "accent1": "#hex",
    "accent2": "#hex",
    "fontHeading": "font name",
    "fontBody": "font name",
    "fontMono": "font name"
  },
  "slides": [
    {
      "id": "unique-id",
      "notes": "speaker notes",
      "transition": "fade|slideLeft|slideRight|zoom|flip|none",
      "background": { "type": "solid|gradient|image", "color": "#hex", "colors": ["#hex","#hex"], "angle": 135 },
      "elements": [
        {
          "id": "unique-id",
          "type": "text|shape|image|code|divider",
          "x": 0, "y": 0, "width": 960, "height": 540,
          "rotation": 0, "opacity": 1, "zIndex": 1,
          "locked": false, "hidden": false, "blendMode": "normal",
          "animation": { "type": "fadeIn|slideInUp|slideInLeft|slideInRight|slideInDown|scaleUp|scaleInX|typewriter|blurIn|bounce", "delay": 0, "duration": 600, "easing": "ease" },

          // Text-specific:
          "content": "string", "fontSize": 24, "fontFamily": "DM Sans",
          "fontWeight": "400|700", "fontStyle": "normal|italic",
          "color": "#hex", "lineHeight": 1.4, "letterSpacing": 0,
          "textAlign": "left|center|right", "verticalAlign": "top|middle|bottom",
          "textShadow": null, "background": null, "border": null,

          // Shape-specific:
          "shape": "rectangle|circle|triangle|line|arrow",
          "fill": { "type": "solid|linear|radial", "color": "#hex", "colors": ["#hex","#hex"], "angle": 0 },
          "cornerRadius": 0,

          // Image-specific:
          "src": "url", "objectFit": "cover|contain", "borderRadius": 0, "shadow": null,

          // Code-specific:
          "language": "javascript", "codeTheme": "dark"
        }
      ]
    }
  ]
}

Slide canvas is 960x540 pixels (16:9).

Available fonts: Fraunces, DM Sans, Playfair Display, Bebas Neue, Space Mono, Syne, Bricolage Grotesque, Inter, Arial, Georgia, Times New Roman.
Available animations: none, fadeIn, slideInLeft, slideInRight, slideInUp, slideInDown, scaleUp, scaleInX, typewriter, blurIn, bounce.
Available transitions: none, fade, slideLeft, slideRight, zoom, flip.
Available shapes: rectangle, circle, triangle, line, arrow.

IMPORTANT OUTPUT FORMAT:
- When creating or modifying a deck, output ONLY the valid JSON object (the full deck or partial updates)
- Wrap your JSON in a code block with \`\`\`json ... \`\`\` markers
- If just answering a question or giving advice, respond in plain text
- For partial updates, you can output just the slides array or a single slide object
- Always generate unique IDs for new elements (use random 8-char hex strings like "a1b2c3d4")
- Use staggered animation delays (0, 200, 400, 600ms) for elements appearing sequentially`;

function generateId() {
  return Math.random().toString(16).slice(2, 10);
}

function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const isError = message.role === 'error';

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 10,
    }}>
      <div style={{
        maxWidth: '85%',
        padding: '8px 12px',
        borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
        background: isError ? '#7f1d1d' : isUser ? '#6366F1' : '#2a2a2a',
        color: isError ? '#fca5a5' : '#e0e0e0',
        fontSize: 13,
        lineHeight: 1.5,
        fontFamily: 'DM Sans, sans-serif',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
      }}>
        {message.content}
      </div>
    </div>
  );
}

function LoadingDots() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-start',
      marginBottom: 10,
    }}>
      <div style={{
        padding: '8px 16px',
        borderRadius: '12px 12px 12px 2px',
        background: '#2a2a2a',
        color: '#888',
        fontSize: 18,
        fontFamily: 'monospace',
        minWidth: 40,
      }}>
        {dots || '\u00A0'}
      </div>
    </div>
  );
}

function ApplyButton({ jsonData, onApply }) {
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    onApply(jsonData);
    setApplied(true);
  };

  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 6, marginBottom: 6, justifyContent: 'flex-start' }}>
      {!applied ? (
        <button
          onClick={handleApply}
          style={{
            padding: '5px 14px',
            background: '#6366F1',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#5254cc'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#6366F1'; }}
        >
          Apply Changes
        </button>
      ) : (
        <span style={{ fontSize: 12, color: '#4ade80', fontFamily: 'DM Sans, sans-serif' }}>
          Changes applied
        </span>
      )}
    </div>
  );
}

function UndoAIButton({ onUndo }) {
  return (
    <button
      onClick={onUndo}
      style={{
        padding: '4px 10px',
        background: 'transparent',
        color: '#f87171',
        border: '1px solid #f87171',
        borderRadius: 4,
        fontSize: 11,
        cursor: 'pointer',
        fontFamily: 'DM Sans, sans-serif',
        marginTop: 2,
        marginBottom: 6,
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = '#7f1d1d33'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      Undo AI Change
    </button>
  );
}

export default function AIChatPanel() {
  const chatMessages = useDeckStore((s) => s.chatMessages);
  const chatLoading = useDeckStore((s) => s.chatLoading);
  const addChatMessage = useDeckStore((s) => s.addChatMessage);
  const setChatLoading = useDeckStore((s) => s.setChatLoading);
  const config = useDeckStore((s) => s.config);
  const deck = useDeckStore((s) => s.deck);
  const setDeck = useDeckStore((s) => s.setDeck);
  const undo = useDeckStore((s) => s.undo);
  const currentSlideIndex = useDeckStore((s) => s.currentSlideIndex);
  const setShowSettings = useDeckStore((s) => s.setShowSettings);

  const [input, setInput] = useState('');
  const [appliedMessageIds, setAppliedMessageIds] = useState(new Set());
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, chatLoading]);

  const extractJson = useCallback((text) => {
    // Try to extract JSON from markdown code block
    const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (codeBlockMatch) {
      try {
        return JSON.parse(codeBlockMatch[1].trim());
      } catch (e) {
        // not valid JSON
      }
    }

    // Try parsing the whole text as JSON
    try {
      return JSON.parse(text.trim());
    } catch (e) {
      // not valid JSON
    }

    return null;
  }, []);

  const buildConversationHistory = useCallback(() => {
    const messages = [];
    for (const msg of chatMessages) {
      if (msg.role === 'user') {
        messages.push({ role: 'user', content: msg.content });
      } else if (msg.role === 'assistant') {
        messages.push({ role: 'assistant', content: msg.content });
      }
      // Skip 'error' role messages
    }
    return messages;
  }, [chatMessages]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || chatLoading) return;

    if (!config.apiKey) {
      addChatMessage({ id: generateId(), role: 'error', content: 'No API key configured. Please set your Anthropic API key in Settings.' });
      return;
    }

    // Build context about current state
    const currentSlide = deck.slides[currentSlideIndex];
    let contextPrefix = '';
    if (currentSlide) {
      contextPrefix = `[Context: Currently viewing slide ${currentSlideIndex + 1} of ${deck.slides.length}. Slide has ${currentSlide.elements.length} element(s).]\n\n`;
    }

    const userMessage = { id: generateId(), role: 'user', content: text };
    addChatMessage(userMessage);
    setInput('');
    setChatLoading(true);

    try {
      const conversationHistory = buildConversationHistory();

      // Add current user message with context
      conversationHistory.push({
        role: 'user',
        content: contextPrefix + text + `\n\n[Current deck.json for reference:\n${JSON.stringify(deck, null, 2)}\n]`,
      });

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 8192,
          system: SYSTEM_PROMPT,
          messages: conversationHistory,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        let errorMsg = `API error (${response.status})`;
        try {
          const parsed = JSON.parse(errorBody);
          errorMsg = parsed.error?.message || errorMsg;
        } catch (e) {
          // use default
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      const assistantText = data.content?.[0]?.text || 'No response received.';

      const assistantMessage = { id: generateId(), role: 'assistant', content: assistantText };
      addChatMessage(assistantMessage);

      // Check if response contains JSON
      const jsonData = extractJson(assistantText);
      if (jsonData) {
        assistantMessage._jsonData = jsonData;
      }
    } catch (err) {
      addChatMessage({
        id: generateId(),
        role: 'error',
        content: `Error: ${err.message}`,
      });
    } finally {
      setChatLoading(false);
    }
  }, [input, chatLoading, config.apiKey, deck, currentSlideIndex, addChatMessage, setChatLoading, buildConversationHistory, extractJson]);

  const handleApplyJson = useCallback((jsonData) => {
    try {
      // Determine what kind of data this is
      if (jsonData.slides && jsonData.meta) {
        // Full deck replacement
        setDeck(jsonData);
      } else if (Array.isArray(jsonData.slides)) {
        // Replace just the slides array
        const newDeck = JSON.parse(JSON.stringify(deck));
        newDeck.slides = jsonData.slides;
        if (jsonData.theme) newDeck.theme = { ...newDeck.theme, ...jsonData.theme };
        newDeck.meta.modified = new Date().toISOString();
        setDeck(newDeck);
      } else if (Array.isArray(jsonData)) {
        // Array of slides
        const newDeck = JSON.parse(JSON.stringify(deck));
        newDeck.slides = jsonData;
        newDeck.meta.modified = new Date().toISOString();
        setDeck(newDeck);
      } else if (jsonData.id && jsonData.elements) {
        // Single slide - replace the current slide
        const newDeck = JSON.parse(JSON.stringify(deck));
        newDeck.slides[currentSlideIndex] = jsonData;
        newDeck.meta.modified = new Date().toISOString();
        setDeck(newDeck);
      } else {
        addChatMessage({
          id: generateId(),
          role: 'error',
          content: 'Could not determine how to apply this JSON. Expected a full deck, slides array, or single slide object.',
        });
        return;
      }
      addChatMessage({
        id: generateId(),
        role: 'assistant',
        content: 'Changes applied successfully.',
      });
    } catch (err) {
      addChatMessage({
        id: generateId(),
        role: 'error',
        content: `Failed to apply changes: ${err.message}`,
      });
    }
  }, [deck, currentSlideIndex, setDeck, addChatMessage]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // No API key state
  if (!config.apiKey) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: 20,
        fontFamily: 'DM Sans, sans-serif',
        color: '#888',
        textAlign: 'center',
        gap: 12,
      }}>
        <svg width="32" height="32" viewBox="0 0 20 20" style={{ color: '#555' }}>
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <path d="M10 6 L10 11 M10 13 L10 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <div style={{ fontSize: 13 }}>
          No API key configured.
        </div>
        <div style={{ fontSize: 12, color: '#666' }}>
          Set your Anthropic API key in Settings to use AI features.
        </div>
        <button
          onClick={() => setShowSettings(true)}
          style={{
            marginTop: 8,
            padding: '6px 16px',
            background: '#6366F1',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          Open Settings
        </button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      {/* Messages area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 10px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {chatMessages.length === 0 && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#555',
            fontSize: 12,
            textAlign: 'center',
            gap: 8,
            padding: 20,
          }}>
            <svg width="28" height="28" viewBox="0 0 20 20" style={{ color: '#444' }}>
              <path d="M3 3 L17 3 L17 13 L10 13 L6 16 L6 13 L3 13 Z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
            </svg>
            <div>Ask DeckForge AI to create or modify your presentation.</div>
            <div style={{ color: '#444', marginTop: 4 }}>
              Try: "Create a 5-slide pitch deck about AI startups"
            </div>
          </div>
        )}

        {chatMessages.map((msg, i) => {
          const jsonData = msg._jsonData || (msg.role === 'assistant' ? extractJson(msg.content) : null);
          const hasJson = !!jsonData;
          const wasApplied = appliedMessageIds.has(msg.id);

          return (
            <React.Fragment key={msg.id || i}>
              <ChatMessage message={msg} />
              {hasJson && !wasApplied && (
                <ApplyButton
                  jsonData={jsonData}
                  onApply={(data) => {
                    handleApplyJson(data);
                    setAppliedMessageIds((prev) => new Set([...prev, msg.id]));
                  }}
                />
              )}
              {hasJson && wasApplied && (
                <UndoAIButton onUndo={undo} />
              )}
            </React.Fragment>
          );
        })}

        {chatLoading && <LoadingDots />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={{
        borderTop: '1px solid #2a2a2a',
        padding: '8px 10px',
        display: 'flex',
        gap: 6,
        alignItems: 'flex-end',
      }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask AI to help with your deck..."
          rows={2}
          style={{
            flex: 1,
            resize: 'none',
            background: '#1e1e1e',
            border: '1px solid #333',
            borderRadius: 8,
            color: '#e0e0e0',
            fontSize: 13,
            padding: '8px 10px',
            fontFamily: 'DM Sans, sans-serif',
            outline: 'none',
            lineHeight: 1.4,
            transition: 'border-color 0.15s ease',
          }}
          onFocus={(e) => { e.target.style.borderColor = '#6366F1'; }}
          onBlur={(e) => { e.target.style.borderColor = '#333'; }}
        />
        <button
          onClick={sendMessage}
          disabled={chatLoading || !input.trim()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: 'none',
            background: chatLoading || !input.trim() ? '#333' : '#6366F1',
            color: chatLoading || !input.trim() ? '#666' : '#fff',
            cursor: chatLoading || !input.trim() ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.15s ease',
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
