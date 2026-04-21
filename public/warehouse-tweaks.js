// shopeee · Warehouse Zinc — Tweaks Panel
// Plain vanilla JS, no framework deps. Attach at end of <body>.
// Exposes in-page controls for: accent color, dark/light mode, barcode density.

(function() {
  const ACCENTS = [
    { id: 'orange', name: 'Safety Orange', hex: '#FF6B1A', soft: '#3A1F10' },
    { id: 'yellow', name: 'Warning Yellow', hex: '#FACC15', soft: '#3A3110' },
    { id: 'red',    name: 'Hazard Red',     hex: '#F87171', soft: '#3A1A1A' },
    { id: 'cyan',   name: 'Signal Cyan',    hex: '#22D3EE', soft: '#0F2A33' },
    { id: 'lime',   name: 'Forklift Lime',  hex: '#A3E635', soft: '#1F2A10' },
  ];

  const LIGHT = {
    '--wh-bg': '#F4F4F5',
    '--wh-bg-deep': '#E4E4E7',
    '--wh-surface': '#FFFFFF',
    '--wh-surface-2': '#FAFAFA',
    '--wh-line': '#D4D4D8',
    '--wh-line-soft': '#E4E4E7',
    '--wh-ink': '#18181B',
    '--wh-ink-soft': '#52525B',
    '--wh-ink-faint': '#A1A1AA',
  };
  const DARK = {
    '--wh-bg': '#0F1113',
    '--wh-bg-deep': '#080909',
    '--wh-surface': '#17191C',
    '--wh-surface-2': '#1F2125',
    '--wh-line': '#27272A',
    '--wh-line-soft': '#1F1F22',
    '--wh-ink': '#F4F4F5',
    '--wh-ink-soft': '#A1A1AA',
    '--wh-ink-faint': '#52525B',
  };

  const STORE_KEY = 'wh_tweaks_v1';
  const saved = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
  let state = Object.assign({ accent: 'orange', mode: 'dark', open: false }, saved);

  function apply() {
    const root = document.documentElement;
    const a = ACCENTS.find(x => x.id === state.accent) || ACCENTS[0];
    root.style.setProperty('--wh-accent', a.hex);
    root.style.setProperty('--wh-accent-2', a.soft);
    const palette = state.mode === 'light' ? LIGHT : DARK;
    for (const k in palette) root.style.setProperty(k, palette[k]);
    localStorage.setItem(STORE_KEY, JSON.stringify({ accent: state.accent, mode: state.mode }));
    render();
  }

  // ── UI ─────────────────────────────────────────────────────────────
  const panel = document.createElement('div');
  panel.id = 'wh-tweaks';
  panel.innerHTML = `
    <style>
      #wh-tweaks {
        position: fixed; bottom: 20px; right: 20px; z-index: 9999;
        font-family: 'Geist Mono', 'JetBrains Mono', ui-monospace, monospace;
      }
      #wh-tweaks .fab {
        width: 44px; height: 44px; background: var(--wh-accent, #FF6B1A);
        color: #000; border: none; cursor: pointer;
        font-weight: 900; font-size: 14px; letter-spacing: 0.15em;
        display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 12px rgba(0,0,0,0.3);
      }
      #wh-tweaks .body {
        position: absolute; bottom: 56px; right: 0;
        width: 280px; background: var(--wh-surface, #17191C);
        color: var(--wh-ink, #F4F4F5);
        border: 1px solid var(--wh-line, #27272A);
        padding: 18px; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      }
      #wh-tweaks .hdr {
        display: flex; justify-content: space-between; align-items: center;
        padding-bottom: 12px; border-bottom: 1px solid var(--wh-line); margin-bottom: 14px;
      }
      #wh-tweaks .hdr .t {
        font-size: 11px; letter-spacing: 0.25em; color: var(--wh-accent, #FF6B1A);
      }
      #wh-tweaks .hdr .x {
        background: transparent; border: none; color: var(--wh-ink-soft);
        cursor: pointer; font-size: 14px; padding: 0 4px;
      }
      #wh-tweaks .section { margin-bottom: 16px; }
      #wh-tweaks .section-lab {
        font-size: 9px; letter-spacing: 0.25em; color: var(--wh-ink-soft);
        margin-bottom: 8px; text-transform: uppercase;
      }
      #wh-tweaks .accents { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
      #wh-tweaks .swatch {
        width: 100%; aspect-ratio: 1; border: 1px solid var(--wh-line);
        cursor: pointer; position: relative;
      }
      #wh-tweaks .swatch.on::after {
        content: ''; position: absolute; inset: -3px;
        border: 1px solid var(--wh-ink); pointer-events: none;
      }
      #wh-tweaks .modes { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
      #wh-tweaks .mode-btn {
        padding: 10px; background: var(--wh-bg-deep); color: var(--wh-ink-soft);
        border: 1px solid var(--wh-line); cursor: pointer;
        font-family: inherit; font-size: 10px; letter-spacing: 0.2em; font-weight: 700;
      }
      #wh-tweaks .mode-btn.on {
        background: var(--wh-accent); color: #000; border-color: var(--wh-accent);
      }
      #wh-tweaks .reset {
        width: 100%; padding: 8px; background: transparent;
        color: var(--wh-ink-soft); border: 1px solid var(--wh-line);
        cursor: pointer; font-family: inherit; font-size: 10px; letter-spacing: 0.2em;
      }
      #wh-tweaks .meta {
        font-size: 9px; color: var(--wh-ink-faint); letter-spacing: 0.15em;
        margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--wh-line-soft);
      }
    </style>
    <button class="fab" aria-label="Tweaks">⚙</button>
    <div class="body" style="display: none;">
      <div class="hdr">
        <span class="t">TWEAKS</span>
        <button class="x">✕</button>
      </div>
      <div class="section">
        <div class="section-lab">Accent Color</div>
        <div class="accents"></div>
        <div id="wh-accent-name" style="font-size: 10px; color: var(--wh-ink-soft); margin-top: 8px; letter-spacing: 0.1em;"></div>
      </div>
      <div class="section">
        <div class="section-lab">Mode</div>
        <div class="modes">
          <button class="mode-btn" data-mode="dark">▪ DARK</button>
          <button class="mode-btn" data-mode="light">▫ LIGHT</button>
        </div>
      </div>
      <button class="reset">▸ RESET TO DEFAULTS</button>
      <div class="meta">v1.0 · stored in localStorage</div>
    </div>
  `;
  document.body.appendChild(panel);

  // render + bind
  function render() {
    const accents = panel.querySelector('.accents');
    accents.innerHTML = ACCENTS.map(a => `
      <div class="swatch ${state.accent === a.id ? 'on' : ''}"
           data-id="${a.id}"
           style="background: ${a.hex};"
           title="${a.name}"></div>
    `).join('');
    const cur = ACCENTS.find(x => x.id === state.accent);
    panel.querySelector('#wh-accent-name').textContent = cur ? `● ${cur.name} · ${cur.hex}` : '';
    panel.querySelectorAll('.swatch').forEach(el => {
      el.onclick = () => { state.accent = el.dataset.id; apply(); };
    });
    panel.querySelectorAll('.mode-btn').forEach(el => {
      el.classList.toggle('on', el.dataset.mode === state.mode);
      el.onclick = () => { state.mode = el.dataset.mode; apply(); };
    });
    panel.querySelector('.body').style.display = state.open ? 'block' : 'none';
  }

  panel.querySelector('.fab').onclick = () => { state.open = !state.open; render(); };
  panel.querySelector('.hdr .x').onclick = () => { state.open = false; render(); };
  panel.querySelector('.reset').onclick = () => {
    state.accent = 'orange'; state.mode = 'dark'; apply();
  };

  apply();
})();
