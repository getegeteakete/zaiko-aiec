// shopeee · Theme Tweaks Panel
// Color scheme switcher for the storefront

(function() {
  const THEMES = [
    { id: 'blue',   name: 'スカイブルー', primary: '#2563EB', dark: '#1E40AF', light: '#EFF6FF', hero: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 50%, #1E40AF 100%)' },
    { id: 'navy',   name: 'ネイビー',     primary: '#1E3A5F', dark: '#0F172A', light: '#F0F4F8', hero: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #334155 100%)' },
    { id: 'green',  name: 'フォレスト',   primary: '#059669', dark: '#065F46', light: '#ECFDF5', hero: 'linear-gradient(135deg, #064E3B 0%, #059669 50%, #047857 100%)' },
    { id: 'brown',  name: 'クラフト',     primary: '#92400E', dark: '#78350F', light: '#FFFBEB', hero: 'linear-gradient(135deg, #451A03 0%, #92400E 50%, #B45309 100%)' },
    { id: 'wine',   name: 'ワインレッド', primary: '#9F1239', dark: '#881337', light: '#FFF1F2', hero: 'linear-gradient(135deg, #4C0519 0%, #9F1239 50%, #BE123C 100%)' },
    { id: 'purple', name: 'ロイヤル',     primary: '#7C3AED', dark: '#6D28D9', light: '#F5F3FF', hero: 'linear-gradient(135deg, #3B0764 0%, #7C3AED 50%, #6D28D9 100%)' },
    { id: 'black',  name: 'モノトーン',   primary: '#374151', dark: '#111827', light: '#F9FAFB', hero: 'linear-gradient(135deg, #111827 0%, #374151 50%, #1F2937 100%)' },
    { id: 'teal',   name: 'ティール',     primary: '#0D9488', dark: '#0F766E', light: '#F0FDFA', hero: 'linear-gradient(135deg, #134E4A 0%, #0D9488 50%, #0F766E 100%)' },
  ];

  const KEY = 'shopeee_theme_v2';
  const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
  let state = { theme: saved.theme || 'blue', open: false };

  function apply() {
    const t = THEMES.find(x => x.id === state.theme) || THEMES[0];
    const root = document.documentElement;

    root.style.setProperty('--steel-500', t.primary);
    root.style.setProperty('--steel-400', t.primary);
    root.style.setProperty('--steel-300', t.light);
    root.style.setProperty('--steel-50', t.light);
    root.style.setProperty('--amber-500', t.primary);
    root.style.setProperty('--amber-400', t.primary);
    root.style.setProperty('--amber-300', t.primary);
    root.style.setProperty('--wh-accent', t.primary);

    document.querySelectorAll('.hero-banner').forEach(h => { h.style.background = t.hero; });

    localStorage.setItem(KEY, JSON.stringify({ theme: state.theme }));
    render();
  }

  new MutationObserver(() => {
    const t = THEMES.find(x => x.id === state.theme) || THEMES[0];
    document.querySelectorAll('.hero-banner').forEach(h => { h.style.background = t.hero; });
  }).observe(document.body, { childList: true, subtree: true });

  const panel = document.createElement('div');
  panel.id = 'wh-tweaks';
  panel.innerHTML = `
    <style>
      #wh-tweaks { position:fixed; bottom:20px; right:20px; z-index:9999; font-family:-apple-system,'Noto Sans JP',sans-serif; }
      #wh-tweaks .fab { width:44px; height:44px; background:var(--steel-500,#2563EB); color:#fff; border:none; border-radius:50%; cursor:pointer; font-size:18px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 16px rgba(0,0,0,.2); transition:transform .2s; }
      #wh-tweaks .fab:hover { transform:scale(1.1); }
      #wh-tweaks .body { position:absolute; bottom:56px; right:0; width:280px; background:#fff; border:1px solid #E2E8F0; border-radius:12px; padding:16px; box-shadow:0 12px 40px rgba(0,0,0,.15); display:none; }
      #wh-tweaks .hdr { display:flex; justify-content:space-between; align-items:center; padding-bottom:12px; border-bottom:1px solid #F1F5F9; margin-bottom:12px; }
      #wh-tweaks .hdr .t { font-size:13px; font-weight:700; color:#1E293B; }
      #wh-tweaks .hdr .x { background:#F1F5F9; border:none; color:#64748B; width:24px; height:24px; border-radius:6px; cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; }
      #wh-tweaks .lab { font-size:10px; color:#94A3B8; font-weight:600; letter-spacing:.08em; margin-bottom:8px; }
      #wh-tweaks .grid { display:grid; grid-template-columns:repeat(4,1fr); gap:6px; margin-bottom:14px; }
      #wh-tweaks .chip { display:flex; flex-direction:column; align-items:center; gap:4px; padding:8px 2px; border:2px solid transparent; border-radius:8px; cursor:pointer; transition:all .15s; background:#F8FAFC; }
      #wh-tweaks .chip:hover { background:#F1F5F9; }
      #wh-tweaks .chip.on { border-color:var(--steel-500,#2563EB); background:#EFF6FF; }
      #wh-tweaks .dot { width:28px; height:28px; border-radius:50%; box-shadow:0 2px 4px rgba(0,0,0,.15); }
      #wh-tweaks .chip-name { font-size:8px; color:#64748B; font-weight:500; white-space:nowrap; }
      #wh-tweaks .preview { margin-top:6px; padding:10px; border-radius:8px; color:#fff; font-size:11px; font-weight:600; text-align:center; }
      #wh-tweaks .meta { font-size:9px; color:#CBD5E1; margin-top:8px; text-align:center; }
    </style>
    <button class="fab" aria-label="テーマ変更">🎨</button>
    <div class="body">
      <div class="hdr"><span class="t">カラーテーマ</span><button class="x">✕</button></div>
      <div class="lab">配色を選択</div>
      <div class="grid"></div>
      <div class="preview"></div>
      <div class="meta">設定はブラウザに保存されます</div>
    </div>
  `;
  document.body.appendChild(panel);

  function render() {
    const grid = panel.querySelector('.grid');
    grid.innerHTML = THEMES.map(t => `
      <div class="chip ${state.theme===t.id?'on':''}" data-id="${t.id}">
        <div class="dot" style="background:${t.hero}"></div>
        <span class="chip-name">${t.name}</span>
      </div>
    `).join('');
    grid.querySelectorAll('.chip').forEach(el => {
      el.onclick = () => { state.theme = el.dataset.id; apply(); };
    });
    const cur = THEMES.find(x => x.id === state.theme);
    const pv = panel.querySelector('.preview');
    pv.style.background = cur.hero;
    pv.textContent = cur.name + ' テーマ';
    panel.querySelector('.body').style.display = state.open ? 'block' : 'none';
    panel.querySelector('.fab').style.background = cur.primary;
  }

  panel.querySelector('.fab').onclick = () => { state.open = !state.open; render(); };
  panel.querySelector('.hdr .x').onclick = () => { state.open = false; render(); };
  apply();
})();

// ── Scroll to Top Button ──
(function(){
  const btn = document.createElement('button');
  btn.id = 'scroll-top';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label','ページ上部へ');
  const s = btn.style;
  s.cssText = 'position:fixed;bottom:76px;right:24px;z-index:9998;width:40px;height:40px;border-radius:50%;background:#fff;color:#64748B;border:1px solid #E2E8F0;cursor:pointer;font-size:16px;font-weight:700;display:none;align-items:center;justify-content:center;box-shadow:0 2px 12px rgba(0,0,0,.1);transition:all .2s;';
  btn.onmouseenter = () => { btn.style.background='#F1F5F9'; btn.style.transform='scale(1.1)'; };
  btn.onmouseleave = () => { btn.style.background='#fff'; btn.style.transform='scale(1)'; };
  btn.onclick = () => window.scrollTo({top:0,behavior:'smooth'});
  document.body.appendChild(btn);
  let ticking = false;
  window.addEventListener('scroll', () => {
    if(!ticking){requestAnimationFrame(()=>{btn.style.display=window.scrollY>300?'flex':'none';ticking=false;});ticking=true;}
  });
})();
