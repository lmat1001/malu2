// scenes.js — conteúdo de cada cena da experiência
// Cada cena é uma função que retorna o HTML interno

const SCENES = [
  // ---------- 0. ABERTURA ----------
  {
    id: 'abertura',
    render: () => `
      <div class="eyebrow">25 de Junho · Dia da Malu</div>
      <h1 class="scene-title" style="font-size: clamp(2.1rem, 6vw, 3.2rem);">
        O que será que a<br>Malu vai querer<br>de presente?
      </h1>
      <p class="scene-sub">
        Eu fiquei pensando bastante nisso. Acho que já sei algumas coisas...
        vem ver comigo?
      </p>
      <button class="btn-advance" data-next>Vamos ver ✨</button>
    `
  },

  // ---------- 1. ROUPAS ----------
  {
    id: 'roupas',
    render: () => `
      <div class="eyebrow">Opção 01</div>
      <h2 class="scene-title">Roupas novas?</h2>
      <p class="scene-sub">Bota um look bonito nela e vê como fica 👗</p>
      <div id="closet-stage"></div>
      <button class="btn-advance" data-next style="margin-top: 28px;">Continuar</button>
    `
  },

  // ---------- 2. FLORES ----------
  {
    id: 'flores',
    render: () => `
      <div class="eyebrow">Opção 02</div>
      <h2 class="scene-title">Quem sabe... flores?</h2>
      <p class="scene-sub">Toda mulher merece um jardim só dela</p>
      <div id="garden-stage"></div>
      <button class="btn-advance" data-next style="margin-top: 18px;">Continuar</button>
    `
  },

  // ---------- 3. JOIAS ----------
  {
    id: 'joias',
    render: () => `
      <div class="eyebrow">Opção 03</div>
      <h2 class="scene-title">Ou algo que brilha?</h2>
      <p class="scene-sub">Porque ela já brilha sozinha, mas um mimo não faz mal</p>
      <div id="jewel-stage"></div>
      <button class="btn-advance" data-next style="margin-top: 18px;">Continuar</button>
    `
  },

  // ---------- 4. VIAGEM ----------
  {
    id: 'viagem',
    render: () => `
      <div class="eyebrow">Opção 04</div>
      <h2 class="scene-title">Uma viagem, talvez?</h2>
      <p class="scene-sub">Pra colocar o pé na estrada (ou no céu) e esquecer da rotina</p>
      <div id="travel-stage"></div>
      <button class="btn-advance" data-next style="margin-top: 18px;">Continuar</button>
    `
  },

  // ---------- 5. DOCES ----------
  {
    id: 'doces',
    render: () => `
      <div class="eyebrow">Opção 05</div>
      <h2 class="scene-title">Ou só um docinho mesmo?</h2>
      <p class="scene-sub">Porque dia de aniversário pede chocolate, sim ou não?</p>
      <div id="sweets-stage"></div>
      <button class="btn-advance" data-next style="margin-top: 18px;">Continuar</button>
    `
  },

  // ---------- 6. TRANSIÇÃO PRÉ-REVELAÇÃO ----------
  {
    id: 'transicao',
    render: () => `
      <div class="eyebrow">Pensando bem...</div>
      <h2 class="scene-title">Bom, a verdade é que...</h2>
      <p class="scene-sub" style="font-size: 1.1rem;">
        você poderia ganhar qualquer uma dessas coisas.<br>
        Roupa, flor, joia, viagem, docinho — tudo combina com você.
      </p>
      <button class="btn-advance" data-next style="margin-top: 10px;">Então...?</button>
    `
  },

  // ---------- 7. REVELAÇÃO FINAL ----------
  {
    id: 'revelacao',
    render: () => `
      <div id="confetti-canvas-wrap"></div>
      <div class="eyebrow" style="color: var(--gold); opacity: 1;">Feliz aniversário, Malu 🤎</div>
      <h2 class="scene-title" style="font-size: clamp(1.9rem, 5.5vw, 2.6rem);">
        Você acaba de ganhar<br>todas elas de uma vez:
      </h2>
      <div class="gift-card" id="gift-card">
        <div class="gift-card-label">VALE-PRESENTE</div>
        <div class="gift-card-amount">R$ 150,00</div>
        <div class="gift-card-sub">pra escolher exatamente o que você quiser</div>
      </div>
      <p class="scene-sub" style="margin-top: 26px; font-style: italic; max-width: 480px;" id="love-note"></p>
    `
  }
];

const LOVE_NOTE = "Eu queria te dar o mundo, mas hoje vou começar com isso. Te amo e espero que esse aniversário seja tão especial quanto você é pra mim. 🤍";
