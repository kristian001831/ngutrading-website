window.NGU_PROOF_FILES=["feedback_new_01.jpg", "feedback_new_02.jpg", "feedback_new_03.jpg", "feedback_new_04.jpg", "feedback_new_05.jpg", "feedback_new_06.jpg", "feedback_new_07.jpg", "feedback_new_08.jpg", "feedback_new_09.jpg", "feedback_new_10.jpg", "profit_01.jpg", "profit_01_1.jpg", "profit_02.jpg", "profit_02_1.jpg", "profit_03.jpg", "profit_03_1.jpg", "profit_04.jpg", "profit_04_1.jpg", "profit_05.jpg", "profit_05_1.jpg", "profit_06.jpg", "profit_06_1.jpg", "profit_07.jpg", "profit_07_1.jpg", "profit_08.jpg", "profit_08_1.jpg", "profit_09.jpg", "profit_09_1.jpg", "profit_10.jpg", "profit_10_1.jpg", "profit_11.jpg", "profit_11_1.jpg", "profit_12.jpg", "profit_12_1.jpg", "stats_2023_2025.jpg", "stats_2023_2025_1.jpg", "testimonial_01.png", "testimonial_01_1.png", "testimonial_02.png", "testimonial_02_1.png", "testimonial_03.png", "testimonial_03_1.png", "testimonial_04.png", "testimonial_04_1.png", "testimonial_05.png", "testimonial_05_1.png", "testimonial_06.png", "testimonial_06_1.png", "testimonial_07.png", "testimonial_07_1.png", "testimonial_08.jpg", "testimonial_08.png", "testimonial_09.png"];


const CONFIG = {
  telegramInvite: "https://t.me/nguvipgroup",
  coachBot: "https://chatgpt.com/g/g-6978f4798004819197383b0c645e6854-ngu-trading-strategy-coach",
  whopCheckout: "https://whop.com/checkout/plan_bgPFruiqerClS",
  spotsKey: "ngu_spots_data",
  minSpots: 2,
  startMin: 11,
  startMax: 11
};

(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const store = {
    get(k, d=null){ try{ const v=localStorage.getItem(k); return v===null?d:JSON.parse(v);}catch(e){return d;}},
    set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  };

  function setExternal(sel, href){
    $$(sel).forEach(a=>{
      a.setAttribute('href', href);
      a.setAttribute('target','_blank');
      a.setAttribute('rel','noopener noreferrer');
    });
  }

  function openModal(){
    const m = $('#bridgeModal');
    if(!m) return;
    m.classList.add('show');
  }
  function closeModal(){ $('#bridgeModal')?.classList.remove('show'); }

  // Countdown (end of day local)
  function tickCountdown(){
    const el = $('#countdownText');
    if(!el) return;
    const now = new Date();
    const end = new Date(now);
    end.setHours(23,59,59,999);
    const total = Math.max(0, Math.floor((end-now)/1000));
    const h = String(Math.floor(total/3600)).padStart(2,'0');
    const m = String(Math.floor((total%3600)/60)).padStart(2,'0');
    const s = String(total%60).padStart(2,'0');
    el.textContent = `${h}:${m}:${s}`;
  }

  // Spots left (random decays, never below minSpots)
  function todayKey(){
    const d=new Date();
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  }
  function initDay(){
    const start = Math.floor(Math.random()*(CONFIG.startMax-CONFIG.startMin+1))+CONFIG.startMin;
    return { date: todayKey(), spots: start, lastDrop: Date.now() };
  }
  function updateSpots(){
    let data = store.get(CONFIG.spotsKey, null);
    if(!data || data.date !== todayKey()) data = initDay();

    const now = Date.now();
    const minutesPassed = (now - data.lastDrop) / 60000;

    // drop window 25–70 min
    const threshold = Math.random()*45 + 25;
    if(minutesPassed > threshold){
      const drop = Math.random() < 0.62 ? 1 : 0; // mostly -1
      data.spots = Math.max(CONFIG.minSpots, data.spots - drop);
      data.lastDrop = now;
    }

    store.set(CONFIG.spotsKey, data);

    const el = $('#spotsText');
    if(el){
      el.textContent = data.spots;
    }
  }

  function tickGiveawayCountdown(){
    const els = document.querySelectorAll('[data-giveaway-countdown]');
    if(!els.length) return;
    const end = new Date('2026-02-02T09:00:00+01:00');
    const now = new Date();
    const total = Math.max(0, Math.floor((end - now) / 1000));
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const text = `${days}d ${String(hours).padStart(2,'0')}h ${String(minutes).padStart(2,'0')}m`;
    els.forEach((el)=>{ el.textContent = text; });
  }

  // init
  setExternal('.telegramLink', CONFIG.telegramInvite);
  setExternal('.botLink', CONFIG.coachBot);
  setExternal('.checkoutLink', CONFIG.whopCheckout);

  // Show modal after clicking external links (keeps funnel alive)
  $$('.telegramLink, .botLink').forEach(el=>{
    el.addEventListener('click', ()=>{
      setTimeout(openModal, 140);
    });
  });
  $('#mClose')?.addEventListener('click', closeModal);
  $('#mFree')?.addEventListener('click', closeModal);
  $('#bridgeModal')?.addEventListener('click', (e)=>{ if(e.target.id==='bridgeModal') closeModal(); });

  function ensureGiveawayHint(){
    if($('#giveawayHint')) return;
    const lang = document.documentElement.lang || 'en';
    const isDe = lang.toLowerCase().startsWith('de');
    const giveawayHref = isDe ? '/de/giveaway/index.html' : '/en/giveaway/index.html';
    const copy = isDe ? {
      title: '🎁 Giveaway läuft',
      body: 'Infos zum Gewinnspiel & Beispiele sind jetzt auf der Detailseite.',
      ends: 'Endet: Montag, 2. Feb · 09:00 Uhr (DE)',
      cta: 'Zur Giveaway-Seite',
      close: 'Später'
    } : {
      title: '🎁 Giveaway live',
      body: 'Details and sample images are on the giveaway page.',
      ends: 'Ends: Monday, Feb 2 · 09:00 (DE time)',
      cta: 'View giveaway details',
      close: 'Not now'
    };
    const modal = document.createElement('div');
    modal.className = 'modal giveawayHintModal';
    modal.id = 'giveawayHint';
    modal.innerHTML = `
      <div class="box giveawayHintBox" role="dialog" aria-modal="true">
        <div class="pad giveawayHintPad">
          <div class="giveawayHintHead">
            <div>
              <h3>${copy.title}</h3>
              <p>${copy.body}</p>
            </div>
            <button class="btn small" type="button" id="giveawayHintClose">✕</button>
          </div>
          <div class="giveawayHintMeta">
            <span>${copy.ends}</span>
            <span class="giveawayHintCountdown" data-giveaway-countdown>--</span>
          </div>
          <div class="row" style="margin-top:10px;">
            <a class="btn gold" href="${giveawayHref}">${copy.cta}</a>
            <button class="btn ghost" type="button" id="giveawayHintLater">${copy.close}</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const closeHint = ()=>{
      modal.classList.remove('show');
      store.set('ngu_giveaway_hint_seen', todayKey());
    };
    $('#giveawayHintClose')?.addEventListener('click', closeHint);
    $('#giveawayHintLater')?.addEventListener('click', closeHint);
    modal.addEventListener('click', (e)=>{ if(e.target.id==='giveawayHint') closeHint(); });
  }

  function maybeShowGiveawayHint(){
    if(window.location.pathname.includes('/giveaway/')) return;
    const seen = store.get('ngu_giveaway_hint_seen', null);
    if(seen === todayKey()) return;
    ensureGiveawayHint();
    setTimeout(()=>{
      $('#giveawayHint')?.classList.add('show');
      tickGiveawayCountdown();
    }, 500);
  }

  function ensureGiveawayBanner(){
    if($('#giveawayBanner')) return;
    if(window.location.pathname.includes('/giveaway/')) return;
    const header = document.querySelector('header');
    if(!header) return;
    const lang = document.documentElement.lang || 'en';
    const isDe = lang.toLowerCase().startsWith('de');
    const giveawayHref = isDe ? '/de/giveaway/index.html' : '/en/giveaway/index.html';
    const copy = isDe ? {
      text: '🎁 Giveaway läuft · Endet Montag, 2. Feb · 09:00 Uhr (DE)',
      cta: 'Zur Giveaway-Seite'
    } : {
      text: '🎁 Giveaway live · Ends Monday, Feb 2 · 09:00 (German time)',
      cta: 'View giveaway details'
    };
    const banner = document.createElement('div');
    banner.className = 'giveawayBanner';
    banner.id = 'giveawayBanner';
    banner.innerHTML = `
      <div class="container giveawayBanner__inner">
        <div class="giveawayBanner__text">
          <span>${copy.text}</span>
          <span class="giveawayBanner__countdown" data-giveaway-countdown>--</span>
        </div>
        <a class="btn small gold" href="${giveawayHref}">${copy.cta}</a>
      </div>
    `;
    header.after(banner);
  }

  // offer widgets
  tickCountdown();
  setInterval(tickCountdown, 1000);
  updateSpots();
  setInterval(updateSpots, 60*1000); // check once/min

  ensureGiveawayBanner();
  maybeShowGiveawayHint();
  tickGiveawayCountdown();
  setInterval(tickGiveawayCountdown, 60000);

  // year
  $$('.js-year').forEach(el=>el.textContent = new Date().getFullYear());
})();
