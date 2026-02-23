export const THEMES = [
  {
    id: "orange",
    label: "Zesty",
    primary: "#ff6b2b",
    bg: "#fff9f0",
    surface: "#ffffff",
    accent: "#ffd000",
  },
  {
    id: "teal",
    label: "Minty",
    primary: "#00c9a7",
    bg: "#f0fff8",
    surface: "#ffffff",
    accent: "#ffd000",
  },
  {
    id: "pink",
    label: "Bubbly",
    primary: "#ff4d8d",
    bg: "#fff5f9",
    surface: "#ffffff",
    accent: "#ffd000",
  },
  {
    id: "purple",
    label: "Dreamy",
    primary: "#9b5de5",
    bg: "#f8f0ff",
    surface: "#ffffff",
    accent: "#f15bb5",
  },
  {
    id: "blue",
    label: "Breezy",
    primary: "#3b82f6",
    bg: "#f0f7ff",
    surface: "#ffffff",
    accent: "#ffd000",
  },
  {
    id: "red",
    label: "Fiery",
    primary: "#ef4444",
    bg: "#fff5f5",
    surface: "#ffffff",
    accent: "#fbbf24",
  },
  {
    id: "green",
    label: "Leafy",
    primary: "#22c55e",
    bg: "#f0fdf4",
    surface: "#ffffff",
    accent: "#ffd000",
  },
  {
    id: "dark",
    label: "Midnight",
    primary: "#a78bfa",
    bg: "#0f0f1a",
    surface: "#1e1e30",
    accent: "#ffd000",
  },
];

export const getTheme = (id) => THEMES.find((t) => t.id === id) || THEMES[0];

export const buildCss = (theme) => {
  const isDark = theme.id === "dark";

  // In dark mode, borders/shadows must be light so they're visible on dark surfaces
  const borderColor = isDark ? "#4a4a6a" : "#1a1a2e";
  const shadowColor = isDark ? "#000000" : "#1a1a2e";
  const textColor = isDark ? "#e8e8ff" : "#1a1a2e";
  const mutedColor = isDark ? "#8888aa" : "#8a8a9a";
  const inputBg = isDark ? "#252540" : theme.bg;
  const selectOptBg = isDark ? "#1e1e30" : "#ffffff";
  const modalIconBg = isDark ? "#3a1a2a" : "#ffe0e9";
  const dangerZoneBg = isDark ? "#2a1520" : "#fff5f7";
  const ghostHoverBg = isDark ? `${theme.accent}22` : `${theme.accent}33`;

  const shadow = `4px 4px 0px ${shadowColor}`;
  const shadowSm = `3px 3px 0px ${shadowColor}`;

  return `
    @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:           ${theme.bg};
      --surface:      ${theme.surface};
      --primary:      ${theme.primary};
      --accent:       ${theme.accent};
      --yellow:       #ffd000;
      --pink:         #ff4d8d;
      --border:       ${borderColor};
      --shadow-col:   ${shadowColor};
      --text:         ${textColor};
      --muted:        ${mutedColor};
      --input-bg:     ${inputBg};
      --shadow:       ${shadow};
      --shadow-sm:    ${shadowSm};
      --radius:       14px;
      --font-head:    'Fredoka One', cursive;
      --font-body:    'Nunito', sans-serif;
    }

    body {
      background: var(--bg);
      font-family: var(--font-body);
      min-height: 100vh;
      color: var(--text);
      -webkit-font-smoothing: antialiased;
    }

    /* ── Page shell ── */
    .page {
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      padding: 1.5rem;
      background:
        radial-gradient(circle at 10% 15%, ${theme.primary}20 0%, transparent 40%),
        radial-gradient(circle at 90% 85%, ${theme.accent}20 0%, transparent 40%),
        var(--bg);
      position: relative; overflow: hidden;
    }

    .page-wide {
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      padding: 2rem 1.25rem;
      background:
        radial-gradient(circle at 5% 95%, ${theme.primary}18 0%, transparent 40%),
        radial-gradient(circle at 95% 5%,  ${theme.accent}18 0%, transparent 40%),
        var(--bg);
      position: relative; overflow: hidden;
    }

    /* floating deco blobs */
    .blob {
      position: absolute; border-radius: 50%;
      border: 3px solid ${borderColor}; opacity: .09;
      animation: floatBlob 7s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes floatBlob {
      0%, 100% { transform: translateY(0) rotate(0); }
      50%       { transform: translateY(-22px) rotate(10deg); }
    }

    /* ── Animations ── */
    @keyframes popIn {
      0%   { opacity: 0; transform: scale(.82) translateY(22px); }
      65%  { transform: scale(1.04) translateY(-4px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }

    @keyframes stepIn {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes wiggle {
      0%, 100% { transform: rotate(0); }
      30%       { transform: rotate(-6deg) scale(1.05); }
      70%       { transform: rotate(6deg) scale(1.05); }
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-10px); }
    }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    /* ── Card ── */
    .card {
      background: var(--surface);
      border: 3px solid var(--border);
      border-radius: var(--radius);
      padding: 2.5rem 2.25rem;
      width: 100%; max-width: 420px;
      box-shadow: 6px 6px 0 var(--shadow-col);
      animation: popIn .5s cubic-bezier(.22,1,.36,1) both;
      position: relative; z-index: 1; overflow: hidden;
    }

    .card-wide {
      background: var(--surface);
      border: 3px solid var(--border);
      border-radius: var(--radius);
      padding: 2.5rem 2.25rem;
      width: 100%;
      box-shadow: 6px 6px 0 var(--shadow-col);
      position: relative; overflow: hidden;
    }

    /* rainbow stripe */
    .card-stripe {
      position: absolute; top: 0; left: 0; right: 0; height: 6px;
      background: repeating-linear-gradient(90deg,
        ${theme.primary} 0px,  ${theme.primary} 20px,
        ${theme.accent}  20px, ${theme.accent}  40px,
        #ff4d8d          40px, #ff4d8d          60px,
        #ffd000          60px, #ffd000          80px
      );
    }

    /* ── Jar icon ── */
    .jar-icon {
      width: 64px; height: 64px;
      background: var(--accent);
      border: 3px solid var(--border); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1.25rem;
      box-shadow: var(--shadow);
      animation: wiggle 3s ease-in-out infinite;
    }

    .jar-icon svg, .icon-wrap svg {
      width: 28px; height: 28px;
      stroke: #1a1a2e; fill: none;
      stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round;
    }

    .icon-wrap {
      width: 68px; height: 68px;
      border: 3px solid var(--border); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1.25rem;
      box-shadow: var(--shadow);
      animation: bounce 2.2s ease-in-out infinite;
    }

    /* ── Typography ── */
    h1 {
      font-family: var(--font-head);
      font-size: clamp(1.8rem, 5vw, 2.8rem); color: var(--text);
      line-height: 1.08; margin-bottom: .35rem;
      letter-spacing: .01em;
    }

    h2 {
      font-family: var(--font-head);
      font-size: clamp(1.5rem, 4vw, 2rem); color: var(--text);
      margin-bottom: .25rem;
    }

    h3 {
      font-family: var(--font-head);
      font-size: 1.55rem; color: var(--text);
      margin-bottom: .25rem;
    }

    .subtitle {
      font-size: .8rem; color: var(--muted);
      font-weight: 600; margin-bottom: 1.75rem;
    }

    .eyebrow {
      font-size: .62rem; letter-spacing: .2em;
      text-transform: uppercase; color: var(--primary);
      font-weight: 800; margin-bottom: .5rem;
    }

    /* ── Brand pill ── */
    .brand-pill {
      display: inline-flex; align-items: center;
      background: var(--primary);
      border: 2.5px solid var(--border);
      border-radius: 999px; padding: .3rem .9rem;
      font-family: var(--font-head); font-size: .85rem;
      color: #fff; box-shadow: var(--shadow-sm);
      margin-bottom: 1.75rem;
    }

    /* ── Form elements ── */
    .field { margin-bottom: 1.1rem; }

    label {
      display: block; font-size: .72rem; font-weight: 800;
      color: var(--text); letter-spacing: .05em;
      text-transform: uppercase; margin-bottom: .4rem;
    }

    input {
      width: 100%; background: var(--input-bg);
      border: 2.5px solid var(--border); border-radius: 10px;
      color: var(--text); font-family: var(--font-body);
      font-size: .9rem; font-weight: 600;
      padding: .7rem 1rem; outline: none;
      box-shadow: 3px 3px 0 var(--shadow-col);
      transition: border-color .2s, box-shadow .2s, transform .15s;
    }

    input::placeholder { color: var(--muted); font-weight: 500; }

    input:focus {
      border-color: var(--primary);
      box-shadow: 3px 3px 0 var(--primary);
      transform: translate(-1px,-1px);
    }

    .select-wrap { position: relative; }

    .select-wrap::after {
      content: '▾'; position: absolute;
      right: .85rem; top: 50%; transform: translateY(-50%);
      color: var(--text); pointer-events: none;
      font-size: .8rem; font-weight: 800;
    }

    select {
      width: 100%; background: var(--input-bg);
      border: 2.5px solid var(--border); border-radius: 10px;
      color: var(--text); font-family: var(--font-body);
      font-size: .85rem; font-weight: 700;
      padding: .65rem .9rem; outline: none; appearance: none;
      cursor: pointer; box-shadow: 3px 3px 0 var(--shadow-col);
      transition: border-color .2s, box-shadow .2s, transform .15s;
    }

    select:focus {
      border-color: var(--primary);
      box-shadow: 3px 3px 0 var(--primary);
      transform: translate(-1px,-1px);
    }

    select option { 
      background: ${selectOptBg}; 
      color: ${textColor}; 
    }

    /* ── Buttons ── */
    .btn {
      width: 100%; padding: .88rem;
      background: var(--primary);
      border: 2.5px solid var(--border); border-radius: 10px;
      color: #fff; font-family: var(--font-head);
      font-size: 1.05rem; letter-spacing: .04em;
      cursor: pointer; box-shadow: var(--shadow);
      transition: transform .12s, box-shadow .12s;
      margin-top: 1.5rem; display: block;
    }

    .btn:hover  { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 var(--shadow-col); }
    .btn:active { transform: translate(2px,2px);   box-shadow: 2px 2px 0 var(--shadow-col); }
    .btn:disabled { opacity: .5; cursor: not-allowed; transform: none !important; box-shadow: var(--shadow) !important; }

    .btn-ghost {
      width: 100%; padding: .82rem;
      background: transparent;
      border: 2.5px solid var(--border); border-radius: 10px;
      color: var(--text); font-family: var(--font-head); font-size: .95rem;
      cursor: pointer; box-shadow: var(--shadow);
      transition: transform .12s, box-shadow .12s, background .15s;
      margin-top: .65rem; display: block;
    }

    .btn-ghost:hover  { background: ${ghostHoverBg}; transform: translate(-2px,-2px); box-shadow: 6px 6px 0 var(--shadow-col); }
    .btn-ghost:active { transform: translate(2px,2px); box-shadow: 2px 2px 0 var(--shadow-col); }

    .btn-danger {
      width: 100%; padding: .78rem;
      background: transparent;
      border: 2.5px solid #ff4d8d; border-radius: 10px;
      color: #ff4d8d; font-family: var(--font-head); font-size: .95rem;
      cursor: pointer; box-shadow: 3px 3px 0 #ff4d8d;
      transition: transform .12s, box-shadow .12s, background .15s, color .15s;
    }

    .btn-danger:hover  { background: #ff4d8d; color: #fff; transform: translate(-2px,-2px); box-shadow: 5px 5px 0 #c0356a; }
    .btn-danger:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 #c0356a; }
    .btn-danger:disabled { opacity: .4; cursor: not-allowed; transform: none !important; }

    .skip-link {
      display: block; text-align: center; margin-top: .9rem;
      font-size: .72rem; font-weight: 700; color: var(--muted);
      cursor: pointer; background: none; border: none; width: 100%;
      text-decoration: underline; text-underline-offset: 3px;
      transition: color .15s; padding: 0;
    }

    .skip-link:hover { color: var(--text); }

    /* ── Nav back ── */
    .top-bar {
      display: flex; align-items: center;
      justify-content: space-between; margin-bottom: 1.75rem;
    }

    .back-btn {
      display: flex; align-items: center; gap: .35rem;
      background: none; border: 2px solid var(--border);
      border-radius: 999px; padding: .3rem .8rem;
      font-family: var(--font-body); font-size: .72rem;
      font-weight: 800; color: var(--text); cursor: pointer;
      box-shadow: 2px 2px 0 var(--shadow-col);
      transition: background .15s, transform .12s, box-shadow .12s;
    }

    .back-btn:hover  { background: ${isDark ? `${theme.accent}33` : `${theme.accent}99`}; transform: translate(-1px,-1px); box-shadow: 3px 3px 0 var(--shadow-col); }
    .back-btn:active { transform: translate(1px,1px); box-shadow: 1px 1px 0 var(--shadow-col); }

    /* ── Link row ── */
    .link-row {
      margin-top: 1.25rem; text-align: center;
      font-size: .78rem; font-weight: 600; color: var(--muted);
    }

    .link-row a {
      color: var(--primary); font-weight: 800;
      text-decoration: none; border-bottom: 2px solid var(--primary);
      padding-bottom: 1px; transition: color .15s, border-color .15s;
    }

    .link-row a:hover { color: var(--text); border-color: var(--text); }

    /* ── Error ── */
    .err {
      font-size: .72rem; font-weight: 700; color: #ff4d8d;
      margin-top: .4rem; display: flex; align-items: center; gap: .3rem;
    }

    .err::before {
      content: '!'; background: #ff4d8d; color: #fff;
      border-radius: 50%; width: 16px; height: 16px;
      display: inline-flex; align-items: center; justify-content: center;
      font-size: .65rem; flex-shrink: 0;
    }

    /* ── Progress dots ── */
    .progress { display: flex; align-items: center; gap: .4rem; margin-bottom: 2rem; }

    .dot {
      height: 10px; border-radius: 999px;
      border: 2px solid var(--border);
      background: ${isDark ? "#3a3a5a" : "#e0e0e0"};
      transition: width .35s cubic-bezier(.22,1,.36,1), background .3s;
      width: 10px;
    }

    .dot.active { background: var(--primary); width: 30px; }
    .dot.done   { background: var(--accent); border-color: var(--border); }

    /* ── Toast ── */
    .toast {
      position: fixed; bottom: 2rem; left: 50%;
      transform: translateX(-50%) translateY(30px) scale(.9);
      background: var(--primary); border: 3px solid var(--border);
      border-radius: 999px; color: #fff;
      font-family: var(--font-head); font-size: .9rem;
      padding: .6rem 1.75rem; box-shadow: var(--shadow);
      opacity: 0; pointer-events: none;
      transition: all .35s cubic-bezier(.22,1,.36,1); z-index: 999;
    }

    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }

    /* ── Badge ── */
    .badge {
      display: inline-flex; align-items: center; gap: .4rem;
      border: 2.5px solid var(--border);
      border-radius: 999px; padding: .3rem .85rem;
      font-family: var(--font-head); font-size: .75rem;
      box-shadow: var(--shadow-sm); margin-bottom: 1rem;
    }

    /* ── Theme picker (shared) ── */
    .theme-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: .6rem;
      margin-bottom: .5rem;
    }

    .theme-swatch {
      position: relative; border: 2.5px solid var(--border);
      border-radius: 10px; padding: .6rem .4rem .45rem;
      cursor: pointer; background: var(--surface);
      box-shadow: 3px 3px 0 var(--shadow-col);
      transition: transform .12s, box-shadow .12s;
      display: flex; flex-direction: column;
      align-items: center; gap: .35rem; text-align: center;
    }

    .theme-swatch:hover  { transform: translate(-2px,-2px); box-shadow: 5px 5px 0 var(--shadow-col); }
    .theme-swatch:active { transform: translate(1px,1px);   box-shadow: 1px 1px 0 var(--shadow-col); }

    .theme-swatch.selected {
      border-color: var(--primary);
      box-shadow: 3px 3px 0 var(--primary);
      background: ${theme.primary}25;
    }

    .theme-swatch.selected::after {
      content: '✓'; position: absolute; top: -8px; right: -8px;
      width: 18px; height: 18px;
      background: var(--primary); border: 2px solid var(--border);
      border-radius: 50%; font-size: .6rem; font-weight: 800;
      color: #fff; display: flex; align-items: center; justify-content: center;
      line-height: 1;
    }

    .swatch-circle {
      width: 28px; height: 28px; border-radius: 50%;
      border: 2.5px solid var(--border); flex-shrink: 0;
    }

    .swatch-label {
      font-family: var(--font-head); font-size: .62rem; color: var(--text); line-height: 1;
    }

    .section-title {
      display: flex; align-items: center; gap: .5rem;
      font-family: var(--font-head); font-size: .82rem;
      color: var(--muted); letter-spacing: .06em;
      text-transform: uppercase; margin-bottom: .85rem;
    }

    .section-title::after {
      content: ''; flex: 1; height: 2px;
      background: repeating-linear-gradient(90deg, var(--border) 0, var(--border) 4px, transparent 4px, transparent 8px);
      opacity: .3;
    }

    /* ── Modal ── */
    .overlay {
      position: fixed; inset: 0;
      background: rgba(10,10,20,.72);
      backdrop-filter: blur(6px);
      display: grid; place-items: center;
      padding: 1.5rem; z-index: 200;
      animation: fadeIn .2s ease both;
    }

    .modal {
      background: var(--surface);
      border: 3px solid var(--border);
      border-radius: var(--radius);
      padding: 2.25rem 2rem;
      width: 100%; max-width: 360px;
      box-shadow: 8px 8px 0 var(--shadow-col);
      animation: popIn .4s cubic-bezier(.22,1,.36,1) both;
      text-align: center;
    }

    .modal-icon {
      width: 60px; height: 60px;
      background: ${modalIconBg};
      border: 3px solid var(--border); border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto .9rem; box-shadow: var(--shadow);
    }

    .modal-icon svg {
      width: 26px; height: 26px; stroke: #ff4d8d; fill: none;
      stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round;
    }

    .modal p  { font-size: .76rem; color: var(--muted); font-weight: 600; line-height: 1.7; margin-bottom: 1.25rem; }
    .modal p strong { color: #ff4d8d; font-weight: 800; }
    .modal-actions { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; margin-top: 1.25rem; }

    /* ── Welcome specifics ── */
    .about-wrap { max-width: 600px; margin: 0 auto; width: 100%; }

    .hero-row { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem; }

    .jar-hero {
      width: 86px; height: 86px; flex-shrink: 0;
      background: var(--accent); border: 3px solid var(--border);
      border-radius: 20px; display: flex; align-items: center; justify-content: center;
      box-shadow: var(--shadow); animation: wiggle 3s ease-in-out infinite;
    }

    .jar-hero svg {
      width: 44px; height: 44px; stroke: #1a1a2e; fill: none;
      stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
    }

    .hero-text p { font-size: .8rem; color: var(--muted); font-weight: 700; margin-top: .25rem; }

    .tagline {
      font-size: .82rem; color: var(--text); font-weight: 600; line-height: 1.85;
      background: ${isDark ? `${theme.accent}15` : `${theme.accent}22`};
      border: 2.5px solid var(--border); border-radius: var(--radius);
      padding: 1rem 1.2rem; box-shadow: var(--shadow-sm); margin-bottom: 1.5rem;
    }

    .tagline strong { color: var(--primary); }

    .features-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; margin-bottom: 1.25rem;
    }

    .feat-card {
      background: var(--surface); border: 2.5px solid var(--border);
      border-radius: 12px; padding: .9rem 1rem;
      display: flex; align-items: flex-start; gap: .7rem;
      box-shadow: var(--shadow-sm);
      transition: transform .15s, box-shadow .15s; cursor: default;
    }

    .feat-card:hover { transform: translate(-2px,-2px); box-shadow: 5px 5px 0 var(--shadow-col); }

    .feat-icon-wrap {
      width: 36px; height: 36px; flex-shrink: 0;
      border: 2px solid var(--border); border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      background: ${isDark ? `${theme.primary}25` : `${theme.primary}18`};
    }

    .feat-icon-wrap svg {
      width: 17px; height: 17px; stroke: var(--text); fill: none;
      stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;
    }

    .feat-text strong { display: block; font-size: .72rem; font-weight: 800; color: var(--text); margin-bottom: .12rem; }
    .feat-text span   { font-size: .67rem; color: var(--muted); font-weight: 600; line-height: 1.5; }

    .why-row { display: flex; flex-wrap: wrap; gap: .5rem; margin-bottom: 1.75rem; }

    .chip {
      display: flex; align-items: center; gap: .35rem;
      background: var(--surface); border: 2px solid var(--border);
      border-radius: 999px; padding: .3rem .8rem;
      font-size: .7rem; font-weight: 800; color: var(--text);
      box-shadow: 2px 2px 0 var(--shadow-col);
      transition: transform .12s, box-shadow .12s;
    }

    .chip:hover { transform: translate(-1px,-1px); box-shadow: 3px 3px 0 var(--shadow-col); }
    .chip-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--primary); }

    .prefs-wrap { max-width: 440px; margin: 0 auto; width: 100%; }

    .theme-preview-bar {
      height: 8px; border-radius: 999px;
      border: 2px solid var(--border);
      margin-bottom: 1.1rem; overflow: hidden;
      box-shadow: 2px 2px 0 var(--shadow-col);
      background: linear-gradient(90deg,
        ${theme.primary} 0%,   ${theme.primary} 35%,
        ${theme.accent}  35%,  ${theme.accent}  60%,
        #ff4d8d          60%,  #ff4d8d          80%,
        #ffd000          80%,  #ffd000          100%
      );
    }

    /* ── Danger zone ── */
    .danger-zone {
      margin-top: 2rem; border: 2.5px dashed ${isDark ? "#7a3050" : "#ffb3c6"};
      border-radius: var(--radius); padding: 1.25rem;
      background: ${dangerZoneBg};
    }

    .danger-head {
      display: flex; align-items: center; gap: .5rem;
      font-family: var(--font-head); font-size: .85rem;
      color: #ff4d8d; margin-bottom: .5rem;
    }

    .danger-head svg {
      width: 16px; height: 16px; stroke: #ff4d8d; fill: none;
      stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round;
    }

    .danger-desc { font-size: .72rem; color: var(--muted); font-weight: 600; margin-bottom: .85rem; line-height: 1.6; }

    .pref-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

    /* ── Mobile Responsive ── */
    @media (max-width: 600px) {
      .page { padding: 1rem .75rem; }
      .page-wide { padding: 1.5rem .75rem; }

      .card { padding: 1.75rem 1.25rem; max-width: 100%; }
      .card-wide { padding: 1.75rem 1.25rem; }

      h1 { font-size: 1.75rem; }
      h2 { font-size: 1.55rem; }
      h3 { font-size: 1.35rem; }

      .hero-row { flex-direction: column; align-items: flex-start; gap: .75rem; }
      .jar-hero { width: 64px; height: 64px; }
      .jar-hero svg { width: 32px; height: 32px; }

      .features-grid { grid-template-columns: 1fr; gap: .6rem; }
      .pref-row { grid-template-columns: 1fr; }
      .theme-grid { grid-template-columns: repeat(4, 1fr); gap: .4rem; }

      .swatch-circle { width: 22px; height: 22px; }
      .swatch-label { font-size: .55rem; }

      .modal { padding: 1.75rem 1.25rem; }
      .modal-actions { grid-template-columns: 1fr; gap: .5rem; }

      .top-bar { flex-wrap: wrap; gap: .5rem; }

      .btn { font-size: .95rem; padding: .8rem; }
      .btn-ghost { font-size: .88rem; padding: .75rem; }

      .toast { width: calc(100% - 2rem); text-align: center; font-size: .82rem; }
    }

    @media (max-width: 380px) {
      .theme-grid { grid-template-columns: repeat(4, 1fr); gap: .3rem; }
      .card { padding: 1.5rem 1rem; }
      h1 { font-size: 1.5rem; }
    }
  `;
};
