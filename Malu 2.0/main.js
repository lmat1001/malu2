// main.js — motor de navegação + componentes interativos de cada cena

let currentScene = 0;
const viewport = document.getElementById('viewport');
const progressEl = document.getElementById('progress');
const pageTurnEl = document.getElementById('pageTurn');

function buildProgressDots() {
  progressEl.innerHTML = SCENES.map((_, i) =>
    `<div class="dot ${i === 0 ? 'current' : ''}" data-dot="${i}"></div>`
  ).join('');
}

function updateProgressDots() {
  document.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.remove('done', 'current');
    if (i < currentScene) dot.classList.add('done');
    if (i === currentScene) dot.classList.add('current');
  });
}

function renderScene(index, direction = 'next') {
  const sceneData = SCENES[index];
  const wrap = document.createElement('div');
  wrap.className = 'scene';
  wrap.dataset.sceneId = sceneData.id;
  wrap.innerHTML = sceneData.render();
  viewport.appendChild(wrap);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      wrap.classList.add('active');
    });
  });

  // hook up advance buttons
  wrap.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => goNext());
  });

  // run scene-specific interactive setup
  initSceneInteractions(sceneData.id, wrap);

  return wrap;
}

function goNext() {
  if (currentScene >= SCENES.length - 1) return;
  const oldWrap = viewport.querySelector('.scene.active');
  const nextIndex = currentScene + 1;

  pageTurnEl.classList.remove('animate');
  void pageTurnEl.offsetWidth; // reflow restart
  pageTurnEl.classList.add('animate');

  setTimeout(() => {
    if (oldWrap) {
      oldWrap.classList.remove('active');
      oldWrap.classList.add('leaving');
      setTimeout(() => oldWrap.remove(), 700);
    }
    currentScene = nextIndex;
    renderScene(currentScene);
    updateProgressDots();
  }, 420);
}

// init
buildProgressDots();
renderScene(0);

// allow keyboard arrow / space / click-anywhere-but-interactive to advance
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
    const btn = viewport.querySelector('.scene.active [data-next]');
    if (btn) { e.preventDefault(); btn.click(); }
  }
});

/* =====================================================
   SCENE-SPECIFIC INTERACTIVE COMPONENTS
===================================================== */

function initSceneInteractions(sceneId, wrap) {
  switch (sceneId) {
    case 'roupas': initCloset(wrap); break;
    case 'flores': initGarden(wrap); break;
    case 'joias': initJewels(wrap); break;
    case 'viagem': initTravel(wrap); break;
    case 'doces': initSweets(wrap); break;
    case 'revelacao': initReveal(wrap); break;
  }
}

/* ---------- 1. CLOSET (avatar + roupas trocáveis) ---------- */
function initCloset(wrap) {
  const stage = wrap.querySelector('#closet-stage');

  const outfits = [
    { id: 'vestido', label: 'Vestido', color: '#C9A961', shape: 'dress' },
    { id: 'casual',  label: 'Casual',  color: '#7A8B5C', shape: 'top' },
    { id: 'festa',   label: 'Festa',   color: '#6B2737', shape: 'gown' },
  ];
  let activeOutfit = 0;

  stage.innerHTML = `
    <style>
      .closet-wrap { display:flex; flex-direction:column; align-items:center; gap:16px; }
      .avatar-box {
        width: 180px; height: 230px;
        position: relative;
        display:flex; align-items:flex-end; justify-content:center;
      }
      .avatar-face {
        width: 86px; height: 86px;
        border-radius: 50%;
        background: linear-gradient(160deg, #F0C9A0, #E8B07E);
        position: absolute;
        top: 0; left: 50%; transform: translateX(-50%);
        display:flex; align-items:center; justify-content:center;
        overflow: hidden;
        border: 3px solid var(--cream-warm);
        box-shadow: 0 4px 14px rgba(0,0,0,0.15);
        z-index: 5;
      }
      .avatar-face img { width:100%; height:100%; object-fit:cover; }
      .avatar-face .placeholder-icon { font-size: 2.2rem; }
      .avatar-body {
        width: 130px; height: 165px;
        position: absolute;
        bottom: 0;
        border-radius: 50px 50px 18px 18px;
        transition: background 0.4s ease, clip-path 0.4s ease;
      }
      .avatar-body.dress { border-radius: 40px 40px 70px 70px; height: 175px; }
      .avatar-body.gown { border-radius: 30px 30px 100px 100px; height: 195px; width: 150px; }
      .avatar-body.top { border-radius: 50px 50px 14px 14px; height: 150px; }

      .outfit-picker { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; }
      .outfit-chip {
        font-family: 'Quicksand', sans-serif;
        font-size: 0.85rem; font-weight: 600;
        padding: 8px 16px;
        border-radius: 999px;
        border: 1.5px solid var(--wine);
        background: transparent;
        color: var(--wine);
        cursor: pointer;
        transition: all 0.25s ease;
      }
      .outfit-chip.active, .outfit-chip:hover {
        background: var(--wine);
        color: var(--cream-warm);
      }
    </style>
    <div class="closet-wrap">
      <div class="avatar-box">
        <div class="avatar-face">
          <span class="placeholder-icon">🤎</span>
        </div>
        <div class="avatar-body dress" id="avatarBody" style="background:${outfits[0].color}"></div>
      </div>
      <div class="outfit-picker" id="outfitPicker">
        ${outfits.map((o, i) => `<button class="outfit-chip ${i===0?'active':''}" data-outfit="${i}">${o.label}</button>`).join('')}
      </div>
    </div>
  `;

  const body = stage.querySelector('#avatarBody');
  stage.querySelectorAll('.outfit-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const i = parseInt(chip.dataset.outfit);
      stage.querySelectorAll('.outfit-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      body.className = 'avatar-body ' + outfits[i].shape;
      body.style.background = outfits[i].color;
    });
  });
}

/* ---------- 2. GARDEN (flores crescendo) ---------- */
function initGarden(wrap) {
  const stage = wrap.querySelector('#garden-stage');
  stage.innerHTML = `
    <style>
      .garden-box { width: 100%; max-width: 420px; height: 220px; position: relative; overflow: hidden; }
      .flower { position: absolute; bottom: 0; transform-origin: bottom center; }
      .stem { width: 4px; background: var(--olive); margin: 0 auto; border-radius: 2px; }
      .bloom {
        width: 34px; height: 34px;
        border-radius: 50%;
        position: relative;
        margin: 0 auto;
      }
      .petal {
        width: 16px; height: 16px;
        border-radius: 50% 50% 50% 0%;
        position: absolute;
        top: 50%; left: 50%;
      }
    </style>
    <div class="garden-box" id="gardenBox"></div>
  `;

  const box = stage.querySelector('#gardenBox');
  const colors = ['#E8B4B8', '#C9A961', '#fff5e8', '#d98a9a'];
  const positions = [18, 38, 50, 62, 82];

  positions.forEach((leftPct, i) => {
    const flower = document.createElement('div');
    flower.className = 'flower';
    flower.style.left = leftPct + '%';
    flower.style.bottom = '0';
    flower.style.transform = 'scale(0)';
    const stemHeight = 70 + (i % 3) * 18;
    flower.innerHTML = `
      <div class="stem" style="height:${stemHeight}px;"></div>
      <div class="bloom" style="margin-top:-34px;">
        ${[0,1,2,3,4].map(p => `<div class="petal" style="background:${colors[i % colors.length]}; transform: translate(-50%,-50%) rotate(${p*72}deg) translateY(-8px) rotate(-${p*72}deg);"></div>`).join('')}
        <div style="width:10px;height:10px;border-radius:50%;background:#C9A961;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);"></div>
      </div>
    `;
    box.appendChild(flower);

    setTimeout(() => {
      flower.style.transition = 'transform 0.8s cubic-bezier(.34,1.56,.64,1)';
      flower.style.transform = 'scale(1)';
    }, 200 + i * 220);
  });
}

/* ---------- 3. JEWELS (joias brilhando) ---------- */
function initJewels(wrap) {
  const stage = wrap.querySelector('#jewel-stage');
  stage.innerHTML = `
    <style>
      .jewel-row { display:flex; gap: 22px; justify-content:center; align-items:center; margin: 10px 0; }
      .jewel {
        position: relative;
        width: 58px; height: 58px;
        display:flex; align-items:center; justify-content:center;
      }
      .jewel svg { width:100%; height:100%; }
      .sparkle {
        position:absolute;
        width: 6px; height: 6px;
        background: #fff;
        border-radius: 50%;
        opacity: 0;
      }
      @keyframes sparkleAnim {
        0% { opacity:0; transform: scale(0.3); }
        50% { opacity:1; transform: scale(1.3); }
        100% { opacity:0; transform: scale(0.3); }
      }
      @keyframes floatJewel {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
    </style>
    <div class="jewel-row" id="jewelRow"></div>
  `;

  const row = stage.querySelector('#jewelRow');
  const jewelSVGs = [
    // ring
    `<svg viewBox="0 0 60 60"><circle cx="30" cy="38" r="14" fill="none" stroke="#C9A961" stroke-width="4"/><polygon points="30,8 22,22 38,22" fill="#E8B4B8" stroke="#C9A961" stroke-width="1.5"/></svg>`,
    // gem
    `<svg viewBox="0 0 60 60"><polygon points="30,10 48,24 40,50 20,50 12,24" fill="#E8B4B8" stroke="#C9A961" stroke-width="2"/><polygon points="30,10 48,24 30,30 12,24" fill="#f6d6da"/></svg>`,
    // earring
    `<svg viewBox="0 0 60 60"><circle cx="30" cy="16" r="6" fill="#C9A961"/><path d="M30 22 Q22 36 30 50 Q38 36 30 22" fill="#E8B4B8" stroke="#C9A961" stroke-width="1.5"/></svg>`
  ];

  jewelSVGs.forEach((svg, i) => {
    const jewel = document.createElement('div');
    jewel.className = 'jewel';
    jewel.style.animation = `floatJewel 3s ease-in-out ${i * 0.3}s infinite`;
    jewel.innerHTML = svg;
    row.appendChild(jewel);

    // add a few sparkles around it
    for (let s = 0; s < 3; s++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = (Math.random() * 50 + 5) + 'px';
      sparkle.style.top = (Math.random() * 50 + 5) + 'px';
      sparkle.style.animation = `sparkleAnim 1.6s ease-in-out ${Math.random() * 2 + i * 0.4}s infinite`;
      jewel.appendChild(sparkle);
    }
  });
}

/* ---------- 4. TRAVEL (avião voando + mapa) ---------- */
function initTravel(wrap) {
  const stage = wrap.querySelector('#travel-stage');
  stage.innerHTML = `
    <style>
      .travel-box { width: 100%; max-width: 420px; height: 160px; position: relative; overflow: hidden; }
      .dotted-path {
        position: absolute;
        top: 50%;
        left: 5%;
        right: 5%;
        border-top: 3px dotted var(--gold);
        opacity: 0.6;
      }
      .plane {
        position: absolute;
        top: 50%;
        left: -10%;
        font-size: 2rem;
        transform: translateY(-50%);
        animation: flyPlane 3.2s ease-in-out infinite;
      }
      @keyframes flyPlane {
        0% { left: -8%; transform: translateY(-50%) rotate(0deg); }
        45% { transform: translateY(-65%) rotate(-4deg); }
        50% { left: 50%; }
        55% { transform: translateY(-35%) rotate(4deg); }
        100% { left: 105%; transform: translateY(-50%) rotate(0deg); }
      }
      .pin { position: absolute; font-size: 1.4rem; }
    </style>
    <div class="travel-box">
      <div class="dotted-path"></div>
      <div class="pin" style="left:6%; top:42%;">📍</div>
      <div class="pin" style="left:88%; top:42%;">📍</div>
      <div class="plane">✈️</div>
    </div>
  `;
}

/* ---------- 5. SWEETS (chocolates aparecendo) ---------- */
function initSweets(wrap) {
  const stage = wrap.querySelector('#sweets-stage');
  stage.innerHTML = `
    <style>
      .sweets-row { display:flex; gap:18px; justify-content:center; flex-wrap: wrap; }
      .sweet {
        font-size: 2.4rem;
        opacity: 0;
        transform: translateY(20px) scale(0.5) rotate(-10deg);
      }
    </style>
    <div class="sweets-row" id="sweetsRow"></div>
  `;
  const row = stage.querySelector('#sweetsRow');
  const items = ['🍫', '🍰', '🍓', '🧁', '🍩'];
  items.forEach((emoji, i) => {
    const el = document.createElement('div');
    el.className = 'sweet';
    el.textContent = emoji;
    row.appendChild(el);
    setTimeout(() => {
      el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(.34,1.56,.64,1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0) scale(1) rotate(0deg)';
    }, 150 + i * 180);
  });
}

/* ---------- 7. REVEAL (vale presente + confete) ---------- */
function initReveal(wrap) {
  // gift card styling injected once
  if (!document.getElementById('gift-card-style')) {
    const style = document.createElement('style');
    style.id = 'gift-card-style';
    style.textContent = `
      .gift-card {
        margin-top: 22px;
        background: linear-gradient(135deg, var(--wine) 0%, var(--wine-deep) 100%);
        border: 2px solid var(--gold);
        border-radius: 20px;
        padding: 28px 40px;
        box-shadow: 0 16px 40px rgba(74,27,39,0.4);
        transform: scale(0.7);
        opacity: 0;
        transition: transform 0.6s cubic-bezier(.34,1.56,.64,1), opacity 0.6s ease;
      }
      .gift-card.show { transform: scale(1); opacity: 1; }
      .gift-card-label {
        font-size: 0.75rem;
        letter-spacing: 0.2em;
        color: var(--gold-light);
        font-weight: 600;
        margin-bottom: 8px;
      }
      .gift-card-amount {
        font-family: 'Cormorant Garamond', serif;
        font-size: 3rem;
        font-weight: 700;
        color: var(--cream-warm);
        line-height: 1;
      }
      .gift-card-sub {
        font-size: 0.85rem;
        color: var(--gold-light);
        margin-top: 8px;
        opacity: 0.85;
      }
      #love-note { opacity: 0; transition: opacity 1s ease 0.4s; }
      #love-note.show { opacity: 1; }
      .confetti-piece {
        position: absolute;
        top: -10px;
        z-index: 100;
        pointer-events: none;
        border-radius: 2px;
      }
      @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(420px) rotate(540deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  const card = wrap.querySelector('#gift-card');
  const note = wrap.querySelector('#love-note');
  note.textContent = LOVE_NOTE;

  setTimeout(() => {
    card.classList.add('show');
    fireConfetti(wrap);
  }, 350);
  setTimeout(() => note.classList.add('show'), 900);
}

function fireConfetti(wrap) {
  const colors = ['#C9A961', '#E8B4B8', '#7A8B5C', '#F7F1E8'];
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const size = Math.random() * 6 + 4;
    piece.style.width = size + 'px';
    piece.style.height = size + 'px';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animation = `confettiFall ${Math.random() * 1.5 + 1.8}s ease-in forwards`;
    piece.style.animationDelay = (Math.random() * 0.6) + 's';
    wrap.appendChild(piece);
    setTimeout(() => piece.remove(), 3200);
  }
}
