(() => {
  'use strict';

  const APP_CONFIG = Object.assign({
    SEND_ENDPOINT_URL: '',
    DEVICE_ID: 'iPad01',
    EVENT_ID: 'OC2026_01',
    SOURCE: 'opencampus',
    SEND_MODE: 'no-cors',
    ENABLE_AUDIO: true,
    BGM_SOURCE: 'audio/bgm.mp3',
    CLICK_SOURCE: 'audio/click.mp3',
    COUNTDOWN_SECONDS: 3,
    THANKS_SECONDS: 2
  }, window.UI_TIME_ATTACK_CONFIG || {});

  const STORAGE = {
    endpoint: 'ui_order_endpoint_url',
    deviceId: 'ui_order_device_id',
    sendMode: 'ui_order_send_mode',
    audioEnabled: 'ui_order_audio_enabled',
    nextOrder: 'ui_order_next_planned_order',
    unsent: 'ui_order_unsent_payloads'
  };

  const app = document.getElementById('app');

  const MENU_A_CATEGORIES = [
    {
      title: '定食',
      items: [
        'とんかつ定食',
        'チキン南蛮定食',
        'エビフライ定食',
        '唐揚げ定食',
        'ハンバーグ定食',
        '生姜焼き定食',
        'サバの味噌煮定食',
        '焼き魚定食'
      ]
    },
    {
      title: 'カレー・丼もの',
      items: [
        '野菜カレー',
        'ポークカレー',
        'カツカレー',
        '親子丼',
        'カツ丼',
        '牛丼',
        '天丼',
        '中華丼'
      ]
    },
    {
      title: '麺類',
      items: [
        '醤油ラーメン',
        '塩ラーメン',
        '味噌ラーメン',
        'かけうどん',
        'きつねうどん',
        '天ぷらうどん',
        'ミートソースパスタ',
        'ナポリタン'
      ]
    }
  ];

  const MENU_B_CATEGORIES = [
    {
      title: 'おすすめ',
      items: [
        'とんかつ定食',
        '野菜カレー',
        '醤油ラーメン',
        '唐揚げ定食',
        '天丼',
        'ナポリタン',
        '焼き魚定食',
        '天ぷらうどん'
      ]
    },
    {
      title: '人気',
      items: [
        'カツカレー',
        'きつねうどん',
        'ハンバーグ定食',
        'チキン南蛮定食',
        'カツ丼',
        'ミートソースパスタ',
        'ポークカレー',
        '塩ラーメン'
      ]
    },
    {
      title: '定番',
      items: [
        '生姜焼き定食',
        '牛丼',
        'サバの味噌煮定食',
        '親子丼',
        'かけうどん',
        '味噌ラーメン',
        'エビフライ定食',
        '中華丼'
      ]
    }
  ];

  const IMAGE_MAP = {
    'とんかつ定食': 'tonkatsu.jpg',
    'チキン南蛮定食': 'chikinnanban.jpg',
    'エビフライ定食': 'ebifurai.jpg',
    '唐揚げ定食': 'karaage.jpg',
    'ハンバーグ定食': 'hanbagu.jpg',
    '生姜焼き定食': 'syougayaki.jpg',
    'サバの味噌煮定食': 'sabanomisoni.jpg',
    '焼き魚定食': 'yakizakana.jpg',
    '野菜カレー': 'yasaikare.jpg',
    'ポークカレー': 'pokukare.jpg',
    'カツカレー': 'katsukare.jpg',
    '親子丼': 'oyakodon.jpg',
    'カツ丼': 'katsudon.jpg',
    '牛丼': 'gyuudon.jpg',
    '天丼': 'tendon.jpg',
    '中華丼': 'chuukadon.jpg',
    '醤油ラーメン': 'syouyuramen.jpg',
    '塩ラーメン': 'shioramen.jpg',
    '味噌ラーメン': 'misoramen.jpg',
    'かけうどん': 'kakeudon.jpg',
    'きつねうどん': 'kitsuneudon.jpg',
    '天ぷらうどん': 'tenpuraudon.jpg',
    'ミートソースパスタ': 'mitososupasuta.jpg',
    'ナポリタン': 'naporitan.jpg'
  };

  const DETAILS = {
    'とんかつ定食': ['サクサクの衣と豚肉のうま味を楽しめる定番の定食です．', '小麦，卵，大豆，豚肉', 980, 730],
    'チキン南蛮定食': ['甘酢だれとタルタルソースがよく合う，食べ応えのある定食です．', '小麦，卵，大豆，鶏肉', 980, 740],
    'エビフライ定食': ['ぷりっとしたエビフライを楽しめる人気の定食です．', '小麦，卵，えび，大豆', 880, 760],
    '唐揚げ定食': ['カリッとした唐揚げとご飯を楽しめる人気の定食です．', '小麦，卵，大豆，鶏肉', 900, 690],
    'ハンバーグ定食': ['ふっくらハンバーグを主役にした食べやすい定食です．', '小麦，卵，乳，牛肉，豚肉，大豆', 850, 720],
    '生姜焼き定食': ['生姜の香りと甘辛い味付けでご飯が進む定食です．', '小麦，大豆，豚肉', 900, 700],
    'サバの味噌煮定食': ['味噌で煮込んだサバを楽しめる和風定食です．', '小麦，大豆，さば', 780, 710],
    '焼き魚定食': ['香ばしく焼いた魚を中心にした落ち着いた味わいの定食です．', '小麦，大豆，さけ又はさば', 650, 690],
    '野菜カレー': ['野菜の甘みを感じられる，食べやすいカレーです．', '小麦，乳，大豆，りんご', 700, 580],
    'ポークカレー': ['豚肉のうま味が溶け込んだ食べやすいカレーです．', '小麦，乳，大豆，豚肉，りんご', 780, 620],
    'カツカレー': ['カレーにサクサクのカツを合わせた満足感のあるメニューです．', '小麦，卵，乳，大豆，豚肉，りんご', 1050, 780],
    '親子丼': ['鶏肉と卵をやさしい味付けでまとめた定番の丼です．', '小麦，卵，大豆，鶏肉', 680, 590],
    'カツ丼': ['だしの効いた卵とカツを合わせた人気の丼メニューです．', '小麦，卵，大豆，豚肉', 920, 690],
    '牛丼': ['甘辛い牛肉をご飯にのせた定番の丼メニューです．', '小麦，大豆，牛肉', 730, 600],
    '天丼': ['甘辛いたれと天ぷらをご飯に合わせた食べ応えのある丼です．', '小麦，卵，えび，大豆', 820, 660],
    '中華丼': ['野菜と具材をあんかけでまとめた食べやすい丼です．', '小麦，大豆，豚肉，鶏肉，ごま', 760, 640],
    '醤油ラーメン': ['すっきりした醤油スープで食べやすい定番ラーメンです．', '小麦，卵，大豆，豚肉，鶏肉', 520, 590],
    '塩ラーメン': ['あっさりした塩味のスープで食べやすいラーメンです．', '小麦，卵，大豆，豚肉，鶏肉', 510, 590],
    '味噌ラーメン': ['味噌のコクが広がる，満足感のあるラーメンです．', '小麦，卵，大豆，豚肉，ごま', 650, 620],
    'かけうどん': ['だしの風味をシンプルに味わえる軽めのうどんです．', '小麦，大豆', 350, 430],
    'きつねうどん': ['甘く煮た油揚げとだしの相性がよいうどんです．', '小麦，大豆', 480, 500],
    '天ぷらうどん': ['サクッとした天ぷらとかけだしを楽しめるうどんです．', '小麦，卵，えび，大豆', 610, 560],
    'ミートソースパスタ': ['ひき肉のうま味が広がる，食べやすいパスタです．', '小麦，乳，大豆，牛肉，豚肉', 760, 620],
    'ナポリタン': ['ケチャップの甘みと具材のうま味を楽しめる洋食メニューです．', '小麦，乳，大豆，豚肉', 720, 590]
  };

  const ORDER_CARDS = [
    { card_id: 'C01', label: '①', menu: '唐揚げ定食', amount: '大盛', add_on: 'ウーロン茶', payment: '現金' },
    { card_id: 'C02', label: '②', menu: 'ポークカレー', amount: '普通', add_on: 'オレンジ', payment: 'ICカード' },
    { card_id: 'C03', label: '③', menu: '醤油ラーメン', amount: '少なめ', add_on: 'なし', payment: 'QR決済' },
    { card_id: 'C04', label: '④', menu: 'サバの味噌煮定食', amount: '普通', add_on: 'コーヒー', payment: '現金' },
    { card_id: 'C05', label: '⑤', menu: '牛丼', amount: '大盛', add_on: 'ウーロン茶', payment: 'ICカード' },
    { card_id: 'C06', label: '⑥', menu: 'きつねうどん', amount: '普通', add_on: 'オレンジ', payment: 'QR決済' }
  ];

  const CHOICES = {
    amount: ['普通', '大盛', '少なめ'],
    add_on: ['なし', 'ウーロン茶', 'コーヒー', 'オレンジ'],
    payment: ['現金', 'ICカード', 'QR決済']
  };

  const PRICE_ADJUSTMENTS = {
    amount: { '大盛': 50, '普通': 0, '少なめ': -30 },
    add_on: { 'ウーロン茶': 80, 'コーヒー': 80, 'オレンジ': 80, 'なし': 0 },
    payment: { '現金': 0, 'ICカード': 0, 'QR決済': 0 }
  };

  const state = {
    screen: 'home',
    session: null,
    currentTrial: null,
    modalItem: null,
    lastError: ''
  };

  const audioState = {
    ctx: null,
    bgmTimer: null,
    bgmGain: null,
    bgmAudio: null,
    clickAudio: null,
    bgmExternalFailed: false,
    clickExternalFailed: false,
    enabled: APP_CONFIG.ENABLE_AUDIO !== false
  };

  function isAudioEnabled() {
    const saved = localStorage.getItem(STORAGE.audioEnabled);
    if (saved === 'true') return true;
    if (saved === 'false') return false;
    return APP_CONFIG.ENABLE_AUDIO !== false;
  }

  function setAudioEnabled(value) {
    localStorage.setItem(STORAGE.audioEnabled, value ? 'true' : 'false');
    audioState.enabled = !!value;
    if (!audioState.enabled) stopBgm();
  }

  function getAudioContext() {
    audioState.enabled = isAudioEnabled();
    if (!audioState.enabled) return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioState.ctx) audioState.ctx = new AudioCtx();
    if (audioState.ctx.state === 'suspended') audioState.ctx.resume().catch(() => {});
    return audioState.ctx;
  }

  function playTone(freq, duration = 0.07, type = 'triangle', gainValue = 0.05) {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainValue, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  function playClickSound() {
    audioState.enabled = isAudioEnabled();
    if (!audioState.enabled) return;
    const source = APP_CONFIG.CLICK_SOURCE || '';
    if (source && !audioState.clickExternalFailed) {
      try {
        if (!audioState.clickAudio) {
          audioState.clickAudio = new Audio(source);
          audioState.clickAudio.preload = 'auto';
          audioState.clickAudio.volume = 0.34;
          audioState.clickAudio.addEventListener('error', () => { audioState.clickExternalFailed = true; }, { once: true });
        }
        audioState.clickAudio.currentTime = 0;
        const p = audioState.clickAudio.play();
        if (p && typeof p.catch === 'function') p.catch(() => {
          audioState.clickExternalFailed = true;
          playTone(880, 0.055, 'square', 0.035);
        });
        return;
      } catch (_) {
        audioState.clickExternalFailed = true;
      }
    }
    playTone(880, 0.055, 'square', 0.035);
  }

  function startGeneratedBgm() {
    stopBgm();
    const ctx = getAudioContext();
    if (!ctx) return;
    audioState.bgmGain = ctx.createGain();
    audioState.bgmGain.gain.value = 0.025;
    audioState.bgmGain.connect(ctx.destination);
    const notes = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880.00, 698.46];
    let step = 0;
    const playStep = () => {
      if (!audioState.bgmGain || !audioState.ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = notes[step % notes.length];
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.7, ctx.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.16);
      osc.connect(gain).connect(audioState.bgmGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
      step += 1;
    };
    playStep();
    audioState.bgmTimer = setInterval(playStep, 190);
  }

  function startBgm() {
    stopBgm();
    audioState.enabled = isAudioEnabled();
    if (!audioState.enabled) return;
    const source = APP_CONFIG.BGM_SOURCE || '';
    if (source && !audioState.bgmExternalFailed) {
      try {
        audioState.bgmAudio = new Audio(source);
        audioState.bgmAudio.loop = true;
        audioState.bgmAudio.volume = 0.34;
        audioState.bgmAudio.addEventListener('error', () => {
          audioState.bgmExternalFailed = true;
          if (state.currentTrial) startGeneratedBgm();
        }, { once: true });
        const playPromise = audioState.bgmAudio.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {
            audioState.bgmExternalFailed = true;
            startGeneratedBgm();
          });
        }
        return;
      } catch (_) {
        audioState.bgmExternalFailed = true;
      }
    }
    startGeneratedBgm();
  }

  function stopBgm() {
    if (audioState.bgmAudio) {
      try {
        audioState.bgmAudio.pause();
        audioState.bgmAudio.currentTime = 0;
      } catch (_) {}
      audioState.bgmAudio = null;
    }
    if (audioState.bgmTimer) {
      clearInterval(audioState.bgmTimer);
      audioState.bgmTimer = null;
    }
    if (audioState.bgmGain) {
      try { audioState.bgmGain.disconnect(); } catch (_) {}
      audioState.bgmGain = null;
    }
  }

  function getSetting(key, fallback) {
    return localStorage.getItem(key) || fallback;
  }

  function setSetting(key, value) {
    localStorage.setItem(key, value || '');
  }

  function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>'"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
  }

  function sanitizeNickname(raw) {
    const cleaned = String(raw || '').trim().replace(/\s+/g, ' ');
    return cleaned.slice(0, 8);
  }

  function clearNicknameError() {
    const input = document.getElementById('nickname');
    const error = document.getElementById('nickname-error');
    input?.classList.remove('input-error');
    if (error) error.textContent = '';
  }

  function showNicknameError() {
    const input = document.getElementById('nickname');
    const error = document.getElementById('nickname-error');
    if (input) {
      input.classList.add('input-error');
      input.focus();
    }
    if (error) error.textContent = 'ニックネームを入力してください．';
  }

  function pad2(n) { return String(n).padStart(2, '0'); }

  function makeId(prefix) {
    const d = new Date();
    const stamp = `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}`;
    const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `${prefix}${stamp}_${rand}`;
  }

  function choosePlannedOrder() {
    let next = localStorage.getItem(STORAGE.nextOrder);
    if (next !== 'AB' && next !== 'BA') {
      next = Math.random() < 0.5 ? 'AB' : 'BA';
    }
    const planned = next;
    localStorage.setItem(STORAGE.nextOrder, planned === 'AB' ? 'BA' : 'AB');
    return planned;
  }

  function startSession(nicknameRaw) {
    const nickname = sanitizeNickname(nicknameRaw);
    if (!nickname) {
      showNicknameError();
      return;
    }
    clearNicknameError();
    const planned_order = choosePlannedOrder();
    const pair_id = makeId('P');
    state.session = {
      pair_id,
      participant_id: pair_id,
      nickname,
      display_name: nickname,
      planned_order,
      orderApps: planned_order === 'AB' ? ['A', 'B'] : ['B', 'A'],
      trialIndex: 0,
      usedCards: [],
      results: [],
      device_id: getSetting(STORAGE.deviceId, APP_CONFIG.DEVICE_ID),
      event_id: APP_CONFIG.EVENT_ID,
      source: APP_CONFIG.SOURCE,
      created_at: new Date().toISOString()
    };
    renderAppStart();
  }

  function currentAppId() {
    return state.session.orderApps[state.session.trialIndex];
  }

  function renderTopActions() {
    return `<div class="top-actions"><button class="icon-button" data-action="settings">設定</button></div>`;
  }

  function renderHome() {
    state.screen = 'home';
    app.innerHTML = `
      ${renderTopActions()}
      <section class="screen">
        <div class="hero">
          <div class="hero-card">
            <h1 class="hero-title">UIタイムアタック</h1>
            <p class="hero-subtitle">これから，食堂の注文アプリを2種類体験していただきます．<br>本名ではなくニックネームを入力し，開始ボタンを押してください．<br>結果は，体験後に大型モニターで確認できます．</p>
            <div class="form-row">
              <input id="nickname" class="input-large" type="text" maxlength="8" autocomplete="off" placeholder="ニックネーム（最大８文字）" />
              <button class="brown-button" data-action="start-session">開始</button>
            </div>
            <div id="nickname-error" class="nickname-error" aria-live="polite"></div>
          </div>
        </div>
      </section>`;
    setTimeout(() => document.getElementById('nickname')?.focus(), 50);
  }

  function renderAppStart() {
    state.screen = 'app-start';
    const appId = currentAppId();
    const trialNo = state.session.trialIndex + 1;
    app.innerHTML = `
      <section class="screen">
        <div class="hero">
          <div class="hero-card">
            <div class="app-start-title">${trialNo}回目</div>
            <div class="app-start-appname">注文アプリ${appId}</div>
            <p class="helper-text">紙の注文カードを確認してから，はじめてください．</p>
            <button class="brown-button" data-action="go-card-select">はじめる</button>
          </div>
        </div>
      </section>`;
  }

  function renderCardSelect() {
    state.screen = 'card-select';
    const trialNo = state.session.trialIndex + 1;
    const appId = currentAppId();
    const used = new Set(state.session.usedCards);
    const buttons = ORDER_CARDS.map((card) => {
      const disabled = trialNo === 2 && used.has(card.card_id) ? 'disabled' : '';
      return `<button class="order-card-button" data-action="select-card" data-card-id="${card.card_id}" ${disabled}>${card.label}</button>`;
    }).join('');
    app.innerHTML = `
      <section class="screen">
        <div class="hero">
          <div class="hero-card">
            <div class="app-start-title">${trialNo}回目　注文アプリ${appId}</div>
            <h1 class="hero-title">注文カードを選択</h1>
            <p class="hero-subtitle">紙の注文カードに書かれている番号を押して注文を開始します．<br>${trialNo === 2 ? '1回目と同じ注文カードは選べません．' : ''}</p>
            <div class="card-select-grid">${buttons}</div>
          </div>
        </div>
      </section>`;
  }

  function startCountdown(cardId) {
    const card = ORDER_CARDS.find(c => c.card_id === cardId);
    if (!card) return;
    const appId = currentAppId();
    state.currentTrial = {
      trial_no: state.session.trialIndex + 1,
      app_id: appId,
      card_id: card.card_id,
      order_card_label: card.label,
      selections: {
        menu: '',
        amount: '',
        add_on: '',
        payment: ''
      },
      start_perf: 0,
      end_perf: 0,
      time_ms: 0
    };
    runCountdown(APP_CONFIG.COUNTDOWN_SECONDS);
  }

  function runCountdown(seconds) {
    state.screen = 'countdown';
    let count = seconds;
    function draw(label, sub) {
      app.innerHTML = `
        <section class="screen countdown-screen">
          <div>
            <div class="countdown-number ${label === 'Go!' ? 'countdown-go' : ''}">${label}</div>
            <div class="countdown-label">${sub || ''}</div>
          </div>
        </section>`;
    }
    draw(count, 'まもなく開始します');
    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        draw(count, 'まもなく開始します');
      } else {
        clearInterval(timer);
        draw('Go!', '注文開始');
        startBgm();
        setTimeout(() => {
          state.currentTrial.start_perf = performance.now();
          renderMenu();
        }, 700);
      }
    }, 850);
  }

  function renderOrderHeader(title) {
    const trialNo = state.currentTrial?.trial_no || 1;
    const appId = state.currentTrial?.app_id || 'A';
    return `
      <header class="order-header">
        <h1 class="order-title">${escapeHtml(title)}</h1>
        <div class="order-meta">${trialNo}回目　注文アプリ${appId}</div>
      </header>`;
  }

  function getCardLabel(cardId) {
    return ORDER_CARDS.find(c => c.card_id === cardId)?.label || '';
  }

  function getDetail(name) {
    const [talk, allergy, kcal, price] = DETAILS[name] || ['説明情報を準備中です．', '確認中', 0, 0];
    return { talk, allergy, kcal, price };
  }

  function formatYen(value) {
    const n = Number(value || 0);
    return `${n.toLocaleString('ja-JP')}円`;
  }

  function formatPriceDelta(value) {
    const n = Number(value || 0);
    if (n > 0) return `＋${n.toLocaleString('ja-JP')}円`;
    if (n < 0) return `－${Math.abs(n).toLocaleString('ja-JP')}円`;
    return '0円';
  }

  function optionLabelHtml(key, value) {
    if (key === 'amount' || key === 'add_on') {
      const delta = PRICE_ADJUSTMENTS[key]?.[value] ?? 0;
      return `${escapeHtml(value)} <span class="price-muted option-price">${escapeHtml(formatPriceDelta(delta))}</span>`;
    }
    return escapeHtml(value);
  }

  function getBasePrice(menuName) {
    return getDetail(menuName).price || 0;
  }

  function calcTotalPrice(selections) {
    if (!selections) return 0;
    return getBasePrice(selections.menu)
      + (PRICE_ADJUSTMENTS.amount?.[selections.amount] || 0)
      + (PRICE_ADJUSTMENTS.add_on?.[selections.add_on] || 0)
      + (PRICE_ADJUSTMENTS.payment?.[selections.payment] || 0);
  }

  function renderMenu() {
    state.screen = 'menu';
    const appId = state.currentTrial.app_id;
    const body = appId === 'A' ? renderMenuA() : renderMenuB();
    app.innerHTML = `
      <section class="order-screen">
        ${renderOrderHeader('メニューを選んでください')}
        <main class="order-body">
          <div class="screen-guidance">注文するメニューをタップしてください．</div>
          ${body}
        </main>
      </section>`;
  }

  function getActiveCategoryIndex(categories) {
    const idx = Number(state.currentTrial?.activeCategoryIndex || 0);
    if (Number.isNaN(idx) || idx < 0 || idx >= categories.length) return 0;
    return idx;
  }

  function renderCategoryTabs(categories, activeIndex, appId) {
    const tabClass = appId === 'A' ? 'category-tab-a' : 'category-tab-b';
    return `
      <div class="category-tabs category-tabs-${appId.toLowerCase()}" role="tablist">
        ${categories.map((cat, idx) => `
          <button
            class="category-tab ${tabClass} ${idx === activeIndex ? 'is-active' : ''}"
            data-action="select-category"
            data-category-index="${idx}"
            type="button"
            role="tab"
            aria-selected="${idx === activeIndex ? 'true' : 'false'}">
            ${escapeHtml(cat.title)}
          </button>
        `).join('')}
      </div>`;
  }

  function renderMenuA() {
    const activeIndex = getActiveCategoryIndex(MENU_A_CATEGORIES);
    const activeCategory = MENU_A_CATEGORIES[activeIndex];
    const cards = activeCategory.items.map((name) => {
      const detail = getDetail(name);
      const img = IMAGE_MAP[name] || 'tonkatsu.jpg';
      return `
        <div class="menu-card-a" data-action="select-menu" data-menu="${escapeHtml(name)}" role="button" tabindex="0">
          <img src="images/${img}" alt="${escapeHtml(name)}" />
          <div class="menu-info-a">
            <div class="menu-name-a">${escapeHtml(name)}</div>
            <div class="menu-price-a">${detail.price}円</div>
            <div class="menu-actions-a">
              <button class="small-detail" data-action="show-detail" data-menu="${escapeHtml(name)}">詳細</button>
            </div>
          </div>
        </div>`;
    }).join('');
    return `
      <div class="menu-switch-board menu-switch-board-a">
        ${renderCategoryTabs(MENU_A_CATEGORIES, activeIndex, 'A')}
        <section class="active-category-panel active-category-panel-a">
          <div class="active-category-title active-category-title-a">${escapeHtml(activeCategory.title)}</div>
          <div class="menu-grid-a">${cards}</div>
        </section>
      </div>`;
  }

  function renderMenuB() {
    const activeIndex = getActiveCategoryIndex(MENU_B_CATEGORIES);
    const activeCategory = MENU_B_CATEGORIES[activeIndex];
    const items = activeCategory.items.map((name) => `
      <button class="menu-item-b" data-action="open-detail-page" data-menu="${escapeHtml(name)}" type="button">
        ${escapeHtml(name)}
      </button>
    `).join('');
    return `
      <div class="menu-switch-board menu-switch-board-b">
        ${renderCategoryTabs(MENU_B_CATEGORIES, activeIndex, 'B')}
        <section class="active-category-panel active-category-panel-b">
          <div class="active-category-title active-category-title-b">${escapeHtml(activeCategory.title)}</div>
          <div class="menu-grid-b">${items}</div>
        </section>
      </div>`;
  }

  function showDetailModal(menuName) {
    const d = getDetail(menuName);
    const modal = document.createElement('div');
    modal.className = 'detail-modal-backdrop';
    modal.innerHTML = `
      <div class="detail-modal">
        <h2 class="detail-name">${escapeHtml(menuName)}</h2>
        <div class="detail-talk">${escapeHtml(d.talk)}</div>
        <div class="detail-meta">
          <div>価格：${d.price}円</div>
          <div>アレルギー：${escapeHtml(d.allergy)}</div>
          <div>カロリー目安：約${d.kcal}kcal</div>
        </div>
        <div class="detail-actions">
          <button class="secondary-button" data-action="close-modal">閉じる</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
  }

  function renderDetailPage(menuName) {
    state.screen = 'detail-page';
    state.modalItem = menuName;
    const d = getDetail(menuName);
    app.innerHTML = `
      <section class="order-screen">
        ${renderOrderHeader('メニュー詳細')}
        <main class="detail-page-wrap">
          <div class="detail-page">
            <h2 class="detail-name">${escapeHtml(menuName)}</h2>
            <div class="detail-talk">${escapeHtml(d.talk)}</div>
            <div class="detail-meta">
              <div>価格：${d.price}円</div>
              <div>アレルギー：${escapeHtml(d.allergy)}</div>
              <div>カロリー目安：約${d.kcal}kcal</div>
            </div>
            <div class="detail-actions detail-actions-b">
              <button class="secondary-button" data-action="select-menu" data-menu="${escapeHtml(menuName)}">選択する</button>
              <button class="secondary-button" data-action="back-menu">メニュー選択に戻る</button>
            </div>
          </div>
        </main>
      </section>`;
  }

  function resetOptionsAfterMenuChange() {
    if (!state.currentTrial || !state.currentTrial.selections) return;
    state.currentTrial.selections.amount = '';
    state.currentTrial.selections.add_on = '';
    state.currentTrial.selections.payment = '';
  }

  function selectMenu(menuName) {
    if (!state.currentTrial || !state.currentTrial.selections) return;
    state.currentTrial.selections.menu = menuName;
    resetOptionsAfterMenuChange();
    if (state.currentTrial.app_id === 'A') {
      renderQuickOptions();
    } else {
      renderChoice('amount', '量を選んでください');
    }
  }

  function renderQuickOptions() {
    state.screen = 'quick-options';
    const s = state.currentTrial.selections;
    const sectionData = [
      { key: 'amount', title: '量', values: CHOICES.amount, enabled: true },
      { key: 'add_on', title: '追加ドリンク', values: CHOICES.add_on, enabled: Boolean(s.amount) },
      { key: 'payment', title: '支払い方法', values: CHOICES.payment, enabled: Boolean(s.add_on) }
    ];
    const sections = sectionData.map((section) => {
      const buttons = section.values.map((value) => {
        const isSelected = value === s[section.key];
        const selectedClass = isSelected ? ' selected' : '';
        const disabledAttr = section.enabled ? '' : ' disabled aria-disabled="true"';
        const cls = `choice-button quick-choice${selectedClass}`;
        const checkMark = isSelected ? '<span class="choice-check" aria-hidden="true">✓</span>' : '';
        return `<button class="${cls}" data-action="select-quick-choice" data-key="${section.key}" data-value="${escapeHtml(value)}"${disabledAttr}>${checkMark}<span class="choice-text">${optionLabelHtml(section.key, value)}</span></button>`;
      }).join('');
      const sectionClass = section.enabled ? 'quick-section' : 'quick-section quick-section-disabled';
      return `
        <section class="${sectionClass}" data-section-key="${section.key}">
          <h3 class="quick-section-title">${escapeHtml(section.title)}</h3>
          <div class="quick-choice-grid quick-choice-grid-${section.key}">${buttons}</div>
        </section>`;
    }).join('');
    const ready = s.amount && s.add_on && s.payment;
    const selectedMenu = s.menu || '未選択';
    app.innerHTML = `
      <section class="order-screen">
        ${renderOrderHeader('量・追加ドリンク・支払い方法を選んでください')}
        <main class="choice-area quick-choice-area">
          <div class="selected-menu-summary">選択メニュー：${escapeHtml(selectedMenu)}</div>
          <div class="quick-sections">${sections}</div>
          <div class="footer-actions choice-footer quick-footer">
            <button class="secondary-button" data-action="back-menu">メニュー選択に戻る</button>
            <button class="brown-button" data-action="quick-confirm" ${ready ? '' : 'disabled'}>注文内容を確認へ</button>
          </div>
        </main>
      </section>`;
  }

  function selectQuickChoice(key, value) {
    const s = state.currentTrial.selections;
    if (key === 'add_on' && !s.amount) return;
    if (key === 'payment' && !s.add_on) return;
    state.currentTrial.selections[key] = value;
    renderQuickOptions();
  }
  function renderOptionReview() {
    state.screen = 'option-review';
    const s = state.currentTrial.selections;
    app.innerHTML = `
      <section class="order-screen">
        ${renderOrderHeader('選択内容を確認してください')}
        <main class="choice-area">
          <div class="confirm-box option-review-box">
            <h2 class="choice-title">この内容でよろしいですか？</h2>
            <div class="confirm-list option-review-list">
              <div class="confirm-label">量</div><div>${escapeHtml(s.amount)}</div>
              <div class="confirm-label">追加ドリンク</div><div>${escapeHtml(s.add_on)}</div>
            </div>
            <div class="footer-actions">
              <button class="secondary-button" data-action="back-add_on">戻る</button>
              <button class="secondary-button" data-action="go-payment">次へ</button>
            </div>
          </div>
        </main>
      </section>`;
  }

  function getChoiceTitle(key) {
    if (key === 'amount') return '量を選んでください';
    if (key === 'add_on') return '追加ドリンクを選んでください';
    if (key === 'payment') return '支払い方法を選んでください';
    return '選んでください';
  }

  function renderChoice(key, title) {
    state.screen = `choice-${key}`;
    const selected = state.currentTrial?.selections?.[key] || '';
    const buttons = CHOICES[key].map((value) => {
      const cls = value === selected ? 'choice-button selected' : 'choice-button';
      return `<button class="${cls}" data-action="select-choice" data-key="${key}" data-value="${escapeHtml(value)}">${optionLabelHtml(key, value)}</button>`;
    }).join('');
    const backAction = key === 'amount'
      ? 'back-menu'
      : (key === 'add_on' ? 'back-amount' : (state.currentTrial?.app_id === 'B' ? 'back-option-review' : 'back-add_on'));
    const shouldShowMenuSummary = state.currentTrial?.app_id === 'B' && (key === 'amount' || key === 'add_on') && state.currentTrial?.selections?.menu;
    const selectedMenuSummary = shouldShowMenuSummary
      ? `<div class="selected-menu-summary choice-selected-summary">選択メニュー：${escapeHtml(state.currentTrial.selections.menu)}</div>`
      : '';
    app.innerHTML = `
      <section class="order-screen">
        ${renderOrderHeader(title)}
        <main class="choice-area ${shouldShowMenuSummary ? 'choice-area-with-summary' : ''}">
          ${selectedMenuSummary}
          <div class="choice-card choice-card-single">
            <div class="choice-grid choice-grid-${escapeHtml(key)}">${buttons}</div>
            <div class="footer-actions choice-footer">
              <button class="secondary-button" data-action="${backAction}">戻る</button>
              <button class="secondary-button" data-action="next-choice" data-key="${key}" ${selected ? '' : 'disabled'}>次へ</button>
            </div>
          </div>
        </main>
      </section>`;
  }
  function selectChoice(key, value) {
    state.currentTrial.selections[key] = value;
    renderChoice(key, getChoiceTitle(key));
  }

  function advanceChoice(key) {
    if (!state.currentTrial?.selections?.[key]) return renderChoice(key, getChoiceTitle(key));
    if (key === 'amount') return renderChoice('add_on', '追加ドリンクを選んでください');
    if (key === 'add_on') {
      if (state.currentTrial.app_id === 'B') return renderOptionReview();
      return renderChoice('payment', '支払い方法を選んでください');
    }
    if (key === 'payment') return renderConfirm();
  }

  function renderConfirm() {
    state.screen = 'confirm';
    const s = state.currentTrial.selections;
    const totalPrice = calcTotalPrice(s);
    app.innerHTML = `
      <section class="order-screen">
        ${renderOrderHeader('注文内容を確認してください')}
        <main class="choice-area">
          <div class="confirm-box">
            <div class="confirm-list">
              <div class="confirm-label">メニュー</div><div class="confirm-value"><span>${escapeHtml(s.menu)}</span><span class="price-muted confirm-price">${formatYen(getBasePrice(s.menu))}</span></div>
              <div class="confirm-label">量</div><div class="confirm-value"><span>${escapeHtml(s.amount)}</span><span class="price-muted confirm-price">${formatPriceDelta(PRICE_ADJUSTMENTS.amount?.[s.amount] || 0)}</span></div>
              <div class="confirm-label">追加ドリンク</div><div class="confirm-value"><span>${escapeHtml(s.add_on)}</span><span class="price-muted confirm-price">${formatPriceDelta(PRICE_ADJUSTMENTS.add_on?.[s.add_on] || 0)}</span></div>
              <div class="confirm-label">支払い</div><div class="confirm-value"><span>${escapeHtml(s.payment)}</span><span class="confirm-price"></span></div>
              <div class="confirm-label confirm-total-label">合計金額</div><div class="confirm-value confirm-total-value"><span></span><span class="confirm-total-price">${formatYen(totalPrice)}</span></div>
            </div>
            ${state.currentTrial?.app_id === 'B' ? `
            <div class="footer-actions">
              <button class="red-button" data-action="finish-trial">注文確定</button>
              <button class="secondary-button" data-action="back-payment">戻る</button>
            </div>` : `
            <div class="footer-actions">
              <button class="secondary-button" data-action="back-quick-options">戻る</button>
              <button class="brown-button" data-action="finish-trial">注文確定</button>
            </div>`}
          </div>
        </main>
      </section>`;
  }

  function finishTrial() {
    stopBgm();
    const trial = state.currentTrial;
    trial.end_perf = performance.now();
    trial.time_ms = Math.max(0, Math.round(trial.end_perf - trial.start_perf));
    const result = {
      trial_no: trial.trial_no,
      app_id: trial.app_id,
      card_id: trial.card_id,
      order_card_label: trial.order_card_label,
      time_ms: trial.time_ms,
      time_sec: Math.round((trial.time_ms / 1000) * 10) / 10,
      selected_menu: trial.selections.menu,
      selected_amount: trial.selections.amount,
      selected_addon: trial.selections.add_on,
      selected_payment: trial.selections.payment,
      completed_at: new Date().toISOString()
    };
    state.session.results.push(result);
    state.session.usedCards.push(trial.card_id);
    state.currentTrial = null;

    if (state.session.trialIndex === 0) {
      state.session.trialIndex = 1;
      renderBreak();
    } else {
      renderSend();
      sendCurrentPayload();
    }
  }

  function renderBreak() {
    state.screen = 'break';
    app.innerHTML = `
      <section class="screen break-screen">
        <div class="hero">
          <div class="hero-card">
            <h1 class="message-title">1回目の注文が完了しました</h1>
            <p class="message-body">次の紙の注文カードを受け取ってください．</p>
            <button class="brown-button" data-action="continue-second">2回目に進む</button>
          </div>
        </div>
      </section>`;
  }

  function makePayload() {
    const s = state.session;
    return {
      pair_id: s.pair_id,
      participant_id: s.participant_id,
      nickname: s.nickname,
      display_name: s.display_name,
      device_id: getSetting(STORAGE.deviceId, APP_CONFIG.DEVICE_ID),
      planned_order: s.planned_order,
      event_id: s.event_id,
      source: s.source,
      client_timestamp: new Date().toISOString(),
      results: s.results.map(r => ({
        trial_no: r.trial_no,
        app_id: r.app_id,
        card_id: r.card_id,
        order_card_label: r.order_card_label,
        time_ms: r.time_ms,
        time_sec: r.time_sec,
        selected_menu: r.selected_menu,
        selected_amount: r.selected_amount,
        selected_addon: r.selected_addon,
        selected_payment: r.selected_payment,
        completed_at: r.completed_at
      }))
    };
  }

  function getEndpoint() {
    return getSetting(STORAGE.endpoint, APP_CONFIG.SEND_ENDPOINT_URL);
  }

  function getSendMode() {
    return getSetting(STORAGE.sendMode, APP_CONFIG.SEND_MODE) || 'no-cors';
  }

  async function sendPayload(payload) {
    const endpoint = getEndpoint();
    if (!endpoint) throw new Error('送信先URLが設定されていません');
    const mode = getSendMode();
    if (mode === 'cors') {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`送信エラー：${res.status}`);
      try { return await res.json(); } catch (_) { return { ok: true }; }
    }
    await fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    return { ok: true, opaque: true };
  }

  function saveUnsent(payload) {
    const list = JSON.parse(localStorage.getItem(STORAGE.unsent) || '[]');
    list.push({ saved_at: new Date().toISOString(), payload });
    localStorage.setItem(STORAGE.unsent, JSON.stringify(list));
  }

  function getUnsentCount() {
    return JSON.parse(localStorage.getItem(STORAGE.unsent) || '[]').length;
  }

  async function retryUnsent() {
    let list = JSON.parse(localStorage.getItem(STORAGE.unsent) || '[]');
    if (!list.length) return { ok: true, count: 0 };
    const remain = [];
    let success = 0;
    for (const item of list) {
      try {
        await sendPayload(item.payload);
        success += 1;
      } catch (e) {
        remain.push(item);
      }
    }
    localStorage.setItem(STORAGE.unsent, JSON.stringify(remain));
    return { ok: remain.length === 0, count: success, remain: remain.length };
  }

  function renderSend(message = '結果を送信しています...', error = '') {
    state.screen = 'send';
    app.innerHTML = `
      <section class="screen send-screen">
        <div class="hero">
          <div class="hero-card">
            <h1 class="message-title">UIタイムアタック終了</h1>
            <p class="message-body">${escapeHtml(message)}<br>タイムと結果は大型モニターで確認してください．</p>
            ${error ? `<div class="error-banner">${escapeHtml(error)}</div>` : ''}
            <div class="footer-actions" style="justify-content:center;margin-top:24px;">
              ${error ? `<button class="secondary-button" data-action="retry-send">再送信</button>` : ''}
              <button class="brown-button" data-action="finish-home">最初の画面に戻る</button>
            </div>
          </div>
        </div>
      </section>`;
  }

  async function sendCurrentPayload() {
    const payload = makePayload();
    try {
      await sendPayload(payload);
      renderSend('送信が完了しました．');
    } catch (err) {
      saveUnsent(payload);
      renderSend('送信できませんでした．スタッフに知らせてください．', `${err.message || err}．未送信データとして端末に保存しました．`);
    }
  }

  function renderSettings() {
    state.screen = 'settings';
    const endpoint = getEndpoint();
    const deviceId = getSetting(STORAGE.deviceId, APP_CONFIG.DEVICE_ID);
    const sendMode = getSendMode();
    const nextOrder = localStorage.getItem(STORAGE.nextOrder) || '未設定';
    const audioEnabled = isAudioEnabled();
    const unsent = getUnsentCount();
    app.innerHTML = `
      <section class="screen">
        <div class="settings-panel">
          <h2>端末設定</h2>
          <div class="settings-grid">
            <label>端末ID</label>
            <input id="setting-device" value="${escapeHtml(deviceId)}" />
            <label>送信先URL</label>
            <input id="setting-endpoint" value="${escapeHtml(endpoint)}" placeholder="Google Apps Script WebアプリURL" />
            <label>送信モード</label>
            <select id="setting-mode">
              <option value="no-cors" ${sendMode === 'no-cors' ? 'selected' : ''}>no-cors（通常）</option>
              <option value="cors" ${sendMode === 'cors' ? 'selected' : ''}>cors（応答確認）</option>
            </select>
            <label>音声</label>
            <label class="settings-check"><input id="setting-audio" type="checkbox" ${audioEnabled ? 'checked' : ''} /> 音を出す</label>
            <label>次回の順番</label>
            <div style="font-size:22px;font-weight:900;">${escapeHtml(nextOrder)}</div>
            <label>未送信データ</label>
            <div style="font-size:22px;font-weight:900;">${unsent}件</div>
          </div>
          <div class="settings-actions">
            <button class="secondary-button" data-action="retry-unsent">未送信を再送</button>
            <button class="secondary-button danger-outline" data-action="clear-unsent">未送信データをクリア</button>
            <button class="secondary-button" data-action="reset-order">順番をリセット</button>
            <button class="secondary-button" data-action="settings-cancel">戻る</button>
            <button class="brown-button" data-action="settings-save">保存</button>
          </div>
          <p class="helper-text" style="font-size:18px;margin-top:22px;">送信モードは通常 no-cors を使用します．Apps ScriptのWebアプリへ送信する場合，応答内容は確認できませんが，送信自体は行えます．</p>
        </div>
      </section>`;
  }

  function saveSettings() {
    setSetting(STORAGE.deviceId, document.getElementById('setting-device').value.trim());
    setSetting(STORAGE.endpoint, document.getElementById('setting-endpoint').value.trim());
    setSetting(STORAGE.sendMode, document.getElementById('setting-mode').value);
    setAudioEnabled(document.getElementById('setting-audio')?.checked);
    renderHome();
  }

  function closeModal() {
    document.querySelector('.detail-modal-backdrop')?.remove();
  }

  function handleClick(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (state.currentTrial?.app_id === 'A' && ['select-category', 'select-menu', 'show-detail', 'select-choice', 'select-quick-choice', 'quick-confirm', 'finish-trial'].includes(action)) {
      playClickSound();
    }
    if (action === 'settings') return renderSettings();
    if (action === 'settings-cancel') return renderHome();
    if (action === 'settings-save') return saveSettings();
    if (action === 'reset-order') { localStorage.removeItem(STORAGE.nextOrder); return renderSettings(); }
    if (action === 'clear-unsent') {
      const count = getUnsentCount();
      if (count <= 0) return renderSettings();
      const ok = window.confirm(`未送信データ ${count}件を削除します．よろしいですか？`);
      if (!ok) return;
      localStorage.setItem(STORAGE.unsent, JSON.stringify([]));
      return renderSettings();
    }
    if (action === 'retry-unsent') {
      target.disabled = true;
      retryUnsent().then(() => renderSettings()).catch(() => renderSettings());
      return;
    }
    if (action === 'start-session') {
      const nick = document.getElementById('nickname')?.value || '';
      startSession(nick);
      return;
    }
    if (action === 'go-card-select') return renderCardSelect();
    if (action === 'select-card') return startCountdown(target.dataset.cardId);
    if (action === 'show-detail') return showDetailModal(target.dataset.menu);
    if (action === 'close-modal') return closeModal();
    if (action === 'open-detail-page') return renderDetailPage(target.dataset.menu);
    if (action === 'select-category') {
      if (state.currentTrial) state.currentTrial.activeCategoryIndex = Number(target.dataset.categoryIndex || 0);
      return renderMenu();
    }
    if (action === 'back-menu') return renderMenu();
    if (action === 'back-amount') return renderChoice('amount', '量を選んでください');
    if (action === 'back-add_on') return renderChoice('add_on', '追加ドリンクを選んでください');
    if (action === 'back-option-review') return renderOptionReview();
    if (action === 'back-quick-options') return renderQuickOptions();
    if (action === 'go-payment') return renderChoice('payment', '支払い方法を選んでください');
    if (action === 'select-menu') { closeModal(); return selectMenu(target.dataset.menu); }
    if (action === 'select-choice') return selectChoice(target.dataset.key, target.dataset.value);
    if (action === 'next-choice') return advanceChoice(target.dataset.key);
    if (action === 'select-quick-choice') return selectQuickChoice(target.dataset.key, target.dataset.value);
    if (action === 'quick-confirm') return renderConfirm();
    if (action === 'back-payment') return renderChoice('payment', '支払い方法を選んでください');
    if (action === 'finish-trial') return finishTrial();
    if (action === 'continue-second') return renderAppStart();
    if (action === 'retry-send') return sendCurrentPayload();
    if (action === 'finish-home') { stopBgm(); state.session = null; state.currentTrial = null; return renderHome(); }
  }

  document.addEventListener('click', handleClick);
  document.addEventListener('input', (e) => {
    if (e.target && e.target.id === 'nickname') {
      clearNicknameError();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && state.screen === 'home') {
      const nick = document.getElementById('nickname')?.value || '';
      startSession(nick);
    }
  });

  renderHome();
})();
