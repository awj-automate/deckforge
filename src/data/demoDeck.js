export const demoDeck = {
  meta: {
    title: "Lumen — AI That Understands Your Business",
    created: "2026-03-23T00:00:00.000Z",
    modified: "2026-03-23T00:00:00.000Z",
    version: "1.0"
  },
  theme: {
    backgroundDefault: "#09090B",
    accent1: "#6366F1",
    accent2: "#A855F7",
    fontDisplay: "Fraunces",
    fontBody: "DM Sans",
    fontMono: "Space Mono"
  },
  slides: [
    {
      id: "slide-001",
      notes: "Open with energy. Pause after the tagline.",
      transition: "fade",
      background: { type: "solid", color: "#09090B" },
      elements: [
        {
          id: "el-001a", type: "shape", shape: "circle",
          x: 680, y: 60, width: 400, height: 400,
          rotation: 0, opacity: 0.08, locked: false, hidden: false,
          blendMode: "screen", zIndex: 0,
          fill: { type: "radial", colors: ["#6366F1", "#09090B"] },
          border: null,
          animation: { type: "fadeIn", duration: 1200, delay: 0, easing: "ease-out" }
        },
        {
          id: "el-001b", type: "shape", shape: "rectangle",
          x: 80, y: 440, width: 120, height: 4,
          rotation: 0, opacity: 1, locked: false, hidden: false,
          blendMode: "normal", zIndex: 1,
          fill: { type: "solid", color: "#6366F1" },
          border: null,
          animation: { type: "scaleInX", duration: 600, delay: 200, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        },
        {
          id: "el-001c", type: "text",
          x: 80, y: 120, width: 520, height: 200,
          rotation: 0, opacity: 1, locked: false, hidden: false,
          blendMode: "normal", zIndex: 2,
          content: "Lumen",
          fontSize: 120, fontFamily: "Fraunces", fontWeight: "700", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.0, letterSpacing: -4,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "slideInLeft", duration: 700, delay: 100, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        },
        {
          id: "el-001d", type: "text",
          x: 80, y: 310, width: 480, height: 80,
          rotation: 0, opacity: 0.7, locked: false, hidden: false,
          blendMode: "normal", zIndex: 3,
          content: "AI that understands your business\nlike a co-founder would.",
          fontSize: 24, fontFamily: "DM Sans", fontWeight: "400", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.5, letterSpacing: 0,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "fadeIn", duration: 600, delay: 400, easing: "ease-out" }
        },
        {
          id: "el-001e", type: "text",
          x: 80, y: 460, width: 300, height: 30,
          rotation: 0, opacity: 0.4, locked: false, hidden: false,
          blendMode: "normal", zIndex: 4,
          content: "Series A  ·  $18M Raise  ·  2026",
          fontSize: 14, fontFamily: "DM Sans", fontWeight: "500", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.4, letterSpacing: 2,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "fadeIn", duration: 600, delay: 600, easing: "ease-out" }
        }
      ]
    },
    {
      id: "slide-002",
      notes: "Paint the pain. Let the numbers land.",
      transition: "slideLeft",
      background: { type: "solid", color: "#09090B" },
      elements: [
        {
          id: "el-002a", type: "text",
          x: 80, y: 40, width: 200, height: 30,
          rotation: 0, opacity: 0.4, locked: false, hidden: false,
          blendMode: "normal", zIndex: 1,
          content: "THE PROBLEM", fontSize: 12, fontFamily: "DM Sans", fontWeight: "700", fontStyle: "normal",
          color: "#6366F1", lineHeight: 1.4, letterSpacing: 4,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "fadeIn", duration: 400, delay: 0, easing: "ease-out" }
        },
        {
          id: "el-002b", type: "text",
          x: 80, y: 80, width: 500, height: 140,
          rotation: 0, opacity: 1, locked: false, hidden: false,
          blendMode: "normal", zIndex: 2,
          content: "Executives make critical decisions with 4% of their company's data.",
          fontSize: 44, fontFamily: "Fraunces", fontWeight: "700", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.15, letterSpacing: -1,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "slideInLeft", duration: 600, delay: 100, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        },
        {
          id: "el-002c", type: "text",
          x: 80, y: 250, width: 460, height: 80,
          rotation: 0, opacity: 0.55, locked: false, hidden: false,
          blendMode: "normal", zIndex: 3,
          content: "The rest is buried in Slack threads, stale dashboards, tribal knowledge, and tools nobody opens after onboarding.",
          fontSize: 16, fontFamily: "DM Sans", fontWeight: "400", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.6, letterSpacing: 0,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "fadeIn", duration: 500, delay: 400, easing: "ease-out" }
        },
        {
          id: "el-002d", type: "shape", shape: "rectangle",
          x: 600, y: 60, width: 300, height: 160,
          rotation: 0, opacity: 1, locked: false, hidden: false,
          blendMode: "normal", zIndex: 2,
          fill: { type: "solid", color: "#131318" },
          border: { width: 1, color: "#2a2a35", dash: "solid" },
          cornerRadius: 12,
          animation: { type: "slideInRight", duration: 500, delay: 200, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        },
        {
          id: "el-002e", type: "text",
          x: 630, y: 85, width: 240, height: 50,
          rotation: 0, opacity: 1, locked: false, hidden: false,
          blendMode: "normal", zIndex: 3,
          content: "$2.7T", fontSize: 48, fontFamily: "Fraunces", fontWeight: "700", fontStyle: "normal",
          color: "#6366F1", lineHeight: 1.0, letterSpacing: -2,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "scaleUp", duration: 500, delay: 400, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        },
        {
          id: "el-002f", type: "text",
          x: 630, y: 145, width: 240, height: 50,
          rotation: 0, opacity: 0.5, locked: false, hidden: false,
          blendMode: "normal", zIndex: 3,
          content: "Lost annually to poor\ndecision-making at scale",
          fontSize: 13, fontFamily: "DM Sans", fontWeight: "400", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.5, letterSpacing: 0,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "fadeIn", duration: 400, delay: 550, easing: "ease-out" }
        },
        {
          id: "el-002g", type: "shape", shape: "rectangle",
          x: 600, y: 260, width: 300, height: 160,
          rotation: 0, opacity: 1, locked: false, hidden: false,
          blendMode: "normal", zIndex: 2,
          fill: { type: "solid", color: "#131318" },
          border: { width: 1, color: "#2a2a35", dash: "solid" },
          cornerRadius: 12,
          animation: { type: "slideInRight", duration: 500, delay: 350, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        },
        {
          id: "el-002h", type: "text",
          x: 630, y: 285, width: 240, height: 50,
          rotation: 0, opacity: 1, locked: false, hidden: false,
          blendMode: "normal", zIndex: 3,
          content: "68%", fontSize: 48, fontFamily: "Fraunces", fontWeight: "700", fontStyle: "normal",
          color: "#A855F7", lineHeight: 1.0, letterSpacing: -2,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "scaleUp", duration: 500, delay: 550, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        },
        {
          id: "el-002i", type: "text",
          x: 630, y: 345, width: 240, height: 50,
          rotation: 0, opacity: 0.5, locked: false, hidden: false,
          blendMode: "normal", zIndex: 3,
          content: "Of leaders say they can't access\ninsights when they need them",
          fontSize: 13, fontFamily: "DM Sans", fontWeight: "400", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.5, letterSpacing: 0,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "fadeIn", duration: 400, delay: 700, easing: "ease-out" }
        }
      ]
    },
    {
      id: "slide-003",
      notes: "This is the 'aha' moment. Lumen is the answer.",
      transition: "fade",
      background: { type: "solid", color: "#09090B" },
      elements: [
        {
          id: "el-003a", type: "shape", shape: "rectangle",
          x: 0, y: 0, width: 960, height: 540,
          rotation: 0, opacity: 0.06, locked: false, hidden: false,
          blendMode: "screen", zIndex: 0,
          fill: { type: "linear", colors: ["#6366F1", "#09090B"], angle: 135 },
          border: null,
          animation: { type: "fadeIn", duration: 1000, delay: 0, easing: "ease-out" }
        },
        {
          id: "el-003b", type: "text",
          x: 160, y: 100, width: 640, height: 80,
          rotation: 0, opacity: 1, locked: false, hidden: false,
          blendMode: "normal", zIndex: 2,
          content: "Meet Lumen.", fontSize: 64, fontFamily: "Fraunces", fontWeight: "700", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.1, letterSpacing: -2,
          textAlign: "center", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "scaleUp", duration: 600, delay: 100, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        },
        {
          id: "el-003c", type: "text",
          x: 180, y: 200, width: 600, height: 60,
          rotation: 0, opacity: 0.6, locked: false, hidden: false,
          blendMode: "normal", zIndex: 3,
          content: "An AI layer that connects to every tool your team uses, learns your business context, and delivers answers — not dashboards.",
          fontSize: 18, fontFamily: "DM Sans", fontWeight: "400", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.6, letterSpacing: 0,
          textAlign: "center", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "fadeIn", duration: 500, delay: 400, easing: "ease-out" }
        },
        ...["Connect", "Understand", "Deliver"].map((title, i) => {
          const colors = { Connect: "#6366F1", Understand: "#A855F7", Deliver: "#6366F1" };
          const descs = [
            "Plugs into Slack, Notion, Salesforce, your data warehouse — 40+ integrations.",
            "Builds a living knowledge graph of your business — relationships, metrics, decisions.",
            "Ask in plain English. Get answers with sources, charts, and recommended actions."
          ];
          const baseX = 120 + i * 270;
          return [
            {
              id: `el-003-card${i}`, type: "shape", shape: "rectangle",
              x: baseX, y: 300, width: 240, height: 180,
              rotation: 0, opacity: 1, locked: false, hidden: false,
              blendMode: "normal", zIndex: 2,
              fill: { type: "solid", color: "#131318" },
              border: { width: 1, color: "#2a2a35", dash: "solid" },
              cornerRadius: 12,
              animation: { type: "slideInUp", duration: 500, delay: 500 + i * 150, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
            },
            {
              id: `el-003-title${i}`, type: "text",
              x: baseX + 20, y: 325, width: 200, height: 30,
              rotation: 0, opacity: 1, locked: false, hidden: false,
              blendMode: "normal", zIndex: 3,
              content: title, fontSize: 22, fontFamily: "Fraunces", fontWeight: "600", fontStyle: "normal",
              color: colors[title], lineHeight: 1.2, letterSpacing: 0,
              textAlign: "left", verticalAlign: "top",
              textShadow: null, background: null, border: null,
              animation: { type: "fadeIn", duration: 400, delay: 650 + i * 150, easing: "ease-out" }
            },
            {
              id: `el-003-desc${i}`, type: "text",
              x: baseX + 20, y: 360, width: 200, height: 80,
              rotation: 0, opacity: 0.5, locked: false, hidden: false,
              blendMode: "normal", zIndex: 3,
              content: descs[i], fontSize: 13, fontFamily: "DM Sans", fontWeight: "400", fontStyle: "normal",
              color: "#FFFFFF", lineHeight: 1.5, letterSpacing: 0,
              textAlign: "left", verticalAlign: "top",
              textShadow: null, background: null, border: null,
              animation: { type: "fadeIn", duration: 400, delay: 700 + i * 150, easing: "ease-out" }
            }
          ];
        }).flat()
      ]
    },
    {
      id: "slide-004",
      notes: "Show a concrete example. This is what using Lumen feels like.",
      transition: "slideLeft",
      background: { type: "solid", color: "#09090B" },
      elements: [
        {
          id: "el-004a", type: "text",
          x: 80, y: 40, width: 200, height: 30,
          rotation: 0, opacity: 0.4, locked: false, hidden: false,
          blendMode: "normal", zIndex: 1,
          content: "PRODUCT", fontSize: 12, fontFamily: "DM Sans", fontWeight: "700", fontStyle: "normal",
          color: "#6366F1", lineHeight: 1.4, letterSpacing: 4,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "fadeIn", duration: 400, delay: 0, easing: "ease-out" }
        },
        {
          id: "el-004b", type: "text",
          x: 80, y: 75, width: 400, height: 70,
          rotation: 0, opacity: 1, locked: false, hidden: false,
          blendMode: "normal", zIndex: 2,
          content: "Ask anything.\nGet the real answer.",
          fontSize: 36, fontFamily: "Fraunces", fontWeight: "700", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.15, letterSpacing: -1,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "slideInLeft", duration: 600, delay: 100, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        },
        {
          id: "el-004c", type: "shape", shape: "rectangle",
          x: 80, y: 180, width: 800, height: 320,
          rotation: 0, opacity: 1, locked: false, hidden: false,
          blendMode: "normal", zIndex: 1,
          fill: { type: "solid", color: "#111118" },
          border: { width: 1, color: "#2a2a35", dash: "solid" },
          cornerRadius: 16,
          animation: { type: "scaleUp", duration: 500, delay: 300, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        },
        {
          id: "el-004d", type: "code",
          x: 110, y: 210, width: 740, height: 260,
          rotation: 0, opacity: 1, locked: false, hidden: false,
          blendMode: "normal", zIndex: 2,
          content: `You:  Why did Enterprise ARR drop 12% last quarter?

Lumen: Three factors drove the decline:

  1. Churn: 4 enterprise accounts ($2.1M combined)
     churned in Q3 — all citing 'lack of integrations'
     [Source: Salesforce exit surveys, Sep 2025]

  2. Delayed closes: 6 deals ($3.4M pipeline) slipped
     to Q4 due to procurement freezes at Fortune 500s
     [Source: Salesforce stage history]

  3. Downgrade: Acme Corp moved from Enterprise to Pro
     tier (-$480K ARR) after headcount reduction
     [Source: Stripe billing events, Aug 14]

  → Recommended action: Prioritize integration roadmap.
    3 of 4 churned accounts listed Snowflake + dbt.`,
          language: "plaintext", codeTheme: "dark",
          fontSize: 13, fontFamily: "Space Mono", color: "#E0E0E0",
          background: null, border: null,
          animation: { type: "typewriter", duration: 2000, delay: 600, easing: "linear" }
        }
      ]
    },
    {
      id: "slide-005",
      notes: "Market size — make investors see the scale.",
      transition: "fade",
      background: { type: "solid", color: "#09090B" },
      elements: [
        {
          id: "el-005a", type: "text",
          x: 80, y: 40, width: 200, height: 30,
          rotation: 0, opacity: 0.4, locked: false, hidden: false,
          blendMode: "normal", zIndex: 1,
          content: "MARKET", fontSize: 12, fontFamily: "DM Sans", fontWeight: "700", fontStyle: "normal",
          color: "#6366F1", lineHeight: 1.4, letterSpacing: 4,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "fadeIn", duration: 400, delay: 0, easing: "ease-out" }
        },
        {
          id: "el-005b", type: "text",
          x: 80, y: 80, width: 500, height: 80,
          rotation: 0, opacity: 1, locked: false, hidden: false,
          blendMode: "normal", zIndex: 2,
          content: "A $340B wave is forming.",
          fontSize: 44, fontFamily: "Fraunces", fontWeight: "700", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.1, letterSpacing: -1,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "slideInLeft", duration: 600, delay: 100, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        },
        {
          id: "el-005c", type: "shape", shape: "rectangle",
          x: 80, y: 200, width: 380, height: 280,
          rotation: 0, opacity: 1, locked: false, hidden: false,
          blendMode: "normal", zIndex: 1,
          fill: { type: "linear", colors: ["#6366F1", "#4338CA"], angle: 135 },
          border: null, cornerRadius: 16,
          animation: { type: "slideInUp", duration: 500, delay: 300, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        },
        {
          id: "el-005d", type: "text",
          x: 110, y: 230, width: 320, height: 80,
          rotation: 0, opacity: 1, locked: false, hidden: false,
          blendMode: "normal", zIndex: 2,
          content: "$340B", fontSize: 72, fontFamily: "Fraunces", fontWeight: "700", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.0, letterSpacing: -3,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "scaleUp", duration: 500, delay: 500, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        },
        {
          id: "el-005e", type: "text",
          x: 110, y: 320, width: 320, height: 60,
          rotation: 0, opacity: 0.8, locked: false, hidden: false,
          blendMode: "normal", zIndex: 2,
          content: "TAM: Enterprise AI + Business Intelligence by 2028",
          fontSize: 16, fontFamily: "DM Sans", fontWeight: "500", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.5, letterSpacing: 0,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "fadeIn", duration: 400, delay: 650, easing: "ease-out" }
        },
        {
          id: "el-005f", type: "text",
          x: 520, y: 220, width: 380, height: 50,
          rotation: 0, opacity: 1, locked: false, hidden: false,
          blendMode: "normal", zIndex: 2,
          content: "$84B SAM", fontSize: 28, fontFamily: "Fraunces", fontWeight: "600", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.2, letterSpacing: -1,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "slideInRight", duration: 500, delay: 500, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        },
        {
          id: "el-005g", type: "text",
          x: 520, y: 260, width: 380, height: 40,
          rotation: 0, opacity: 0.5, locked: false, hidden: false,
          blendMode: "normal", zIndex: 2,
          content: "Mid-market & enterprise knowledge platforms",
          fontSize: 14, fontFamily: "DM Sans", fontWeight: "400", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.5, letterSpacing: 0,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "fadeIn", duration: 400, delay: 600, easing: "ease-out" }
        },
        {
          id: "el-005h", type: "shape", shape: "rectangle",
          x: 520, y: 310, width: 380, height: 1,
          rotation: 0, opacity: 0.2, locked: false, hidden: false,
          blendMode: "normal", zIndex: 1,
          fill: { type: "solid", color: "#FFFFFF" },
          border: null,
          animation: { type: "scaleInX", duration: 400, delay: 650, easing: "ease-out" }
        },
        {
          id: "el-005i", type: "text",
          x: 520, y: 330, width: 380, height: 50,
          rotation: 0, opacity: 1, locked: false, hidden: false,
          blendMode: "normal", zIndex: 2,
          content: "$12B SOM by 2028", fontSize: 28, fontFamily: "Fraunces", fontWeight: "600", fontStyle: "normal",
          color: "#6366F1", lineHeight: 1.2, letterSpacing: -1,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "slideInRight", duration: 500, delay: 700, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        },
        {
          id: "el-005j", type: "text",
          x: 520, y: 375, width: 380, height: 40,
          rotation: 0, opacity: 0.5, locked: false, hidden: false,
          blendMode: "normal", zIndex: 2,
          content: "English-speaking enterprises, 500+ employees",
          fontSize: 14, fontFamily: "DM Sans", fontWeight: "400", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.5, letterSpacing: 0,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "fadeIn", duration: 400, delay: 800, easing: "ease-out" }
        }
      ]
    },
    {
      id: "slide-006",
      notes: "Traction proves this isn't just an idea.",
      transition: "slideLeft",
      background: { type: "solid", color: "#09090B" },
      elements: [
        {
          id: "el-006a", type: "text",
          x: 80, y: 40, width: 200, height: 30,
          rotation: 0, opacity: 0.4, locked: false, hidden: false,
          blendMode: "normal", zIndex: 1,
          content: "TRACTION", fontSize: 12, fontFamily: "DM Sans", fontWeight: "700", fontStyle: "normal",
          color: "#6366F1", lineHeight: 1.4, letterSpacing: 4,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "fadeIn", duration: 400, delay: 0, easing: "ease-out" }
        },
        {
          id: "el-006b", type: "text",
          x: 80, y: 80, width: 800, height: 60,
          rotation: 0, opacity: 1, locked: false, hidden: false,
          blendMode: "normal", zIndex: 2,
          content: "18 months. Zero to $4.2M ARR.",
          fontSize: 44, fontFamily: "Fraunces", fontWeight: "700", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.1, letterSpacing: -1,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "slideInLeft", duration: 600, delay: 100, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        },
        ...[
          { val: "47", label: "Enterprise\ncustomers", color: "#6366F1" },
          { val: "3.2x", label: "Net revenue\nretention", color: "#A855F7" },
          { val: "94%", label: "Weekly active\nusage rate", color: "#6366F1" },
          { val: "<1%", label: "Monthly\nchurn", color: "#22C55E" }
        ].map((stat, i) => {
          const baseX = 80 + i * 220;
          const w = i === 3 ? 140 : 190;
          return [
            {
              id: `el-006-card${i}`, type: "shape", shape: "rectangle",
              x: baseX, y: 190, width: w, height: 160,
              rotation: 0, opacity: 1, locked: false, hidden: false,
              blendMode: "normal", zIndex: 1,
              fill: { type: "solid", color: "#131318" },
              border: { width: 1, color: "#2a2a35", dash: "solid" },
              cornerRadius: 12,
              animation: { type: "slideInUp", duration: 500, delay: 300 + i * 150, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
            },
            {
              id: `el-006-val${i}`, type: "text",
              x: baseX + 20, y: 215, width: w - 40, height: 50,
              rotation: 0, opacity: 1, locked: false, hidden: false,
              blendMode: "normal", zIndex: 2,
              content: stat.val, fontSize: 48, fontFamily: "Fraunces", fontWeight: "700", fontStyle: "normal",
              color: stat.color, lineHeight: 1.0, letterSpacing: -2,
              textAlign: "left", verticalAlign: "top",
              textShadow: null, background: null, border: null,
              animation: { type: "scaleUp", duration: 400, delay: 450 + i * 150, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
            },
            {
              id: `el-006-label${i}`, type: "text",
              x: baseX + 20, y: 275, width: w - 40, height: 40,
              rotation: 0, opacity: 0.5, locked: false, hidden: false,
              blendMode: "normal", zIndex: 2,
              content: stat.label, fontSize: 13, fontFamily: "DM Sans", fontWeight: "400", fontStyle: "normal",
              color: "#FFFFFF", lineHeight: 1.5, letterSpacing: 0,
              textAlign: "left", verticalAlign: "top",
              textShadow: null, background: null, border: null,
              animation: { type: "fadeIn", duration: 400, delay: 550 + i * 150, easing: "ease-out" }
            }
          ];
        }).flat(),
        {
          id: "el-006o", type: "text",
          x: 80, y: 400, width: 800, height: 80,
          rotation: 0, opacity: 0.45, locked: false, hidden: false,
          blendMode: "normal", zIndex: 2,
          content: "Logos: Stripe, Notion, Figma, Ramp, Vercel, Mercury, Linear, Deel",
          fontSize: 14, fontFamily: "DM Sans", fontWeight: "500", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.4, letterSpacing: 3,
          textAlign: "center", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "fadeIn", duration: 600, delay: 1100, easing: "ease-out" }
        }
      ]
    },
    {
      id: "slide-007",
      notes: "The team. Keep it brief.",
      transition: "fade",
      background: { type: "solid", color: "#09090B" },
      elements: [
        {
          id: "el-007a", type: "text",
          x: 80, y: 40, width: 200, height: 30,
          rotation: 0, opacity: 0.4, locked: false, hidden: false,
          blendMode: "normal", zIndex: 1,
          content: "TEAM", fontSize: 12, fontFamily: "DM Sans", fontWeight: "700", fontStyle: "normal",
          color: "#6366F1", lineHeight: 1.4, letterSpacing: 4,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "fadeIn", duration: 400, delay: 0, easing: "ease-out" }
        },
        {
          id: "el-007b", type: "text",
          x: 80, y: 80, width: 500, height: 70,
          rotation: 0, opacity: 1, locked: false, hidden: false,
          blendMode: "normal", zIndex: 2,
          content: "Built by operators\nwho lived this pain.",
          fontSize: 38, fontFamily: "Fraunces", fontWeight: "700", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.15, letterSpacing: -1,
          textAlign: "left", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "slideInLeft", duration: 600, delay: 100, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        },
        ...[
          { name: "Maya Chen", role: "CEO", desc: "Ex-Stripe, Stanford CS\nBuilt Stripe Atlas from 0→1", grad: ["#6366F1", "#4338CA"] },
          { name: "Kai Patel", role: "CTO", desc: "Ex-Google Brain, MIT PhD\nLed knowledge graph at Google", grad: ["#A855F7", "#7C3AED"] },
          { name: "Sofia Reyes", role: "Head of Revenue", desc: "Ex-Notion, YC alum\n$0→$30M ARR at prior startup", grad: ["#6366F1", "#A855F7"] }
        ].map((person, i) => {
          const cx = 100 + i * 240;
          return [
            {
              id: `el-007-avatar${i}`, type: "shape", shape: "circle",
              x: cx, y: 210, width: 80, height: 80,
              rotation: 0, opacity: 1, locked: false, hidden: false,
              blendMode: "normal", zIndex: 1,
              fill: { type: "linear", colors: person.grad, angle: 135 },
              border: null,
              animation: { type: "scaleUp", duration: 400, delay: 300 + i * 150, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
            },
            {
              id: `el-007-name${i}`, type: "text",
              x: cx - 20, y: 310, width: 160, height: 80,
              rotation: 0, opacity: 1, locked: false, hidden: false,
              blendMode: "normal", zIndex: 2,
              content: `${person.name}\n${person.role}`,
              fontSize: 16, fontFamily: "DM Sans", fontWeight: "600", fontStyle: "normal",
              color: "#FFFFFF", lineHeight: 1.4, letterSpacing: 0,
              textAlign: "center", verticalAlign: "top",
              textShadow: null, background: null, border: null,
              animation: { type: "fadeIn", duration: 400, delay: 400 + i * 150, easing: "ease-out" }
            },
            {
              id: `el-007-desc${i}`, type: "text",
              x: cx - 30, y: 355, width: 170, height: 40,
              rotation: 0, opacity: 0.4, locked: false, hidden: false,
              blendMode: "normal", zIndex: 2,
              content: person.desc, fontSize: 11, fontFamily: "DM Sans", fontWeight: "400", fontStyle: "normal",
              color: "#FFFFFF", lineHeight: 1.5, letterSpacing: 0,
              textAlign: "center", verticalAlign: "top",
              textShadow: null, background: null, border: null,
              animation: { type: "fadeIn", duration: 400, delay: 450 + i * 150, easing: "ease-out" }
            }
          ];
        }).flat(),
        {
          id: "el-007l", type: "text",
          x: 80, y: 440, width: 800, height: 40,
          rotation: 0, opacity: 0.35, locked: false, hidden: false,
          blendMode: "normal", zIndex: 2,
          content: "32 engineers  ·  12 from FAANG  ·  4 PhDs  ·  Backed by a16z, Sequoia scouts",
          fontSize: 13, fontFamily: "DM Sans", fontWeight: "400", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.4, letterSpacing: 1,
          textAlign: "center", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "fadeIn", duration: 400, delay: 900, easing: "ease-out" }
        }
      ]
    },
    {
      id: "slide-008",
      notes: "Close strong. Be specific about the ask.",
      transition: "fade",
      background: { type: "solid", color: "#09090B" },
      elements: [
        {
          id: "el-008a", type: "shape", shape: "rectangle",
          x: 0, y: 0, width: 960, height: 540,
          rotation: 0, opacity: 0.1, locked: false, hidden: false,
          blendMode: "screen", zIndex: 0,
          fill: { type: "radial", colors: ["#6366F1", "#09090B"] },
          border: null,
          animation: { type: "fadeIn", duration: 1200, delay: 0, easing: "ease-out" }
        },
        {
          id: "el-008b", type: "text",
          x: 160, y: 120, width: 640, height: 120,
          rotation: 0, opacity: 1, locked: false, hidden: false,
          blendMode: "normal", zIndex: 2,
          content: "Let's build the future\nof business intelligence.",
          fontSize: 48, fontFamily: "Fraunces", fontWeight: "700", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.15, letterSpacing: -2,
          textAlign: "center", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "scaleUp", duration: 700, delay: 200, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        },
        {
          id: "el-008c", type: "shape", shape: "rectangle",
          x: 350, y: 280, width: 260, height: 56,
          rotation: 0, opacity: 1, locked: false, hidden: false,
          blendMode: "normal", zIndex: 1,
          fill: { type: "linear", colors: ["#6366F1", "#A855F7"], angle: 90 },
          border: null, cornerRadius: 28,
          animation: { type: "scaleUp", duration: 500, delay: 600, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
        },
        {
          id: "el-008d", type: "text",
          x: 350, y: 280, width: 260, height: 56,
          rotation: 0, opacity: 1, locked: false, hidden: false,
          blendMode: "normal", zIndex: 2,
          content: "Raising $18M Series A",
          fontSize: 18, fontFamily: "DM Sans", fontWeight: "600", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.0, letterSpacing: 0,
          textAlign: "center", verticalAlign: "middle",
          textShadow: null, background: null, border: null,
          animation: { type: "fadeIn", duration: 400, delay: 800, easing: "ease-out" }
        },
        {
          id: "el-008e", type: "text",
          x: 260, y: 380, width: 440, height: 40,
          rotation: 0, opacity: 0.5, locked: false, hidden: false,
          blendMode: "normal", zIndex: 2,
          content: "maya@lumen.ai  ·  lumen.ai/investors",
          fontSize: 16, fontFamily: "DM Sans", fontWeight: "400", fontStyle: "normal",
          color: "#FFFFFF", lineHeight: 1.4, letterSpacing: 1,
          textAlign: "center", verticalAlign: "top",
          textShadow: null, background: null, border: null,
          animation: { type: "fadeIn", duration: 400, delay: 1000, easing: "ease-out" }
        },
        {
          id: "el-008f", type: "shape", shape: "rectangle",
          x: 380, y: 460, width: 200, height: 3,
          rotation: 0, opacity: 0.3, locked: false, hidden: false,
          blendMode: "normal", zIndex: 1,
          fill: { type: "linear", colors: ["#6366F1", "#A855F7"], angle: 90 },
          border: null,
          animation: { type: "scaleInX", duration: 600, delay: 1200, easing: "ease-out" }
        }
      ]
    }
  ]
};
