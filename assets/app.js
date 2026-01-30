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
  function closeGiveaway(){
    const m = $('#giveawayModal');
    if(!m) return;
    m.classList.remove('show');
    const today = todayKey();
    store.set('ngu_giveaway_seen', today);
  }

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

  function ensureGiveawayModal(){
    if($('#giveawayModal')) return;
    const lang = document.documentElement.lang || 'en';
    const isDe = lang.toLowerCase().startsWith('de');
    const startHref = isDe ? '/de/start/index.html' : '/en/start/index.html';
    const copy = isDe ? {
      title: 'Gewinne den kompletten NGU Trading Strategy Kurs',
      prize1Label: '🥇 1. Preis',
      prize1: '100% GRATIS – kompletter NGU Trading Strategy Kurs',
      prize2Label: '🥈 2. Preis',
      prize2: '75% RABATT',
      prize3Label: '🥉 3. Preis',
      prize3: '50% RABATT',
      enterTitle: 'So machst du mit 👇',
      enter1: 'Teile dein NGU Zertifikat oder Trading Summary als <strong>Instagram Story</strong>.',
      enter2: 'Markiere <strong>@futuremillionairego</strong> UND <strong>@kristian.ngut</strong>.',
      getTitle: 'So bekommst du Zertifikat oder Summary 👇',
      get1: 'Gehe auf ngutrading.com.',
      get2: 'Starte den FREE NGU Bot.',
      get3: 'Erzähl ihm von deinem Trading‑Tag oder deiner Woche.',
      get4: 'Frag nach einem Zertifikat oder einer Daily/Weekly Summary zum Teilen (IG Story).',
      footer: '🏆 Gewinner werden zufällig gezogen · 📅 Montag zum Market Close',
      primaryCta: 'Starte den FREE NGU Bot →',
      secondaryCta: 'Free Access sichern',
      closeCta: 'Später'
    } : {
      title: 'Win my FULL NGU Trading Strategy Course',
      prize1Label: '🥇 1st prize',
      prize1: '100% FREE – Full NGU Trading Strategy Course',
      prize2Label: '🥈 2nd prize',
      prize2: '75% OFF',
      prize3Label: '🥉 3rd prize',
      prize3: '50% OFF',
      enterTitle: 'How to enter 👇',
      enter1: 'Share your NGU certificate or trading summary as an <strong>Instagram Story</strong>.',
      enter2: 'Mention <strong>@futuremillionairego</strong> AND <strong>@kristian.ngut</strong>.',
      getTitle: 'How to get your certificate or summary 👇',
      get1: 'Go to ngutrading.com.',
      get2: 'Start the FREE NGU bot.',
      get3: 'Tell it about your trading day or week.',
      get4: 'Ask for a certificate or daily/weekly summary to share on social media (IG story).',
      footer: '🏆 Winners chosen randomly · 📅 Monday at market close',
      primaryCta: 'Start the FREE NGU bot →',
      secondaryCta: 'Get free access',
      closeCta: 'Not now'
    };
    const previewCopy = isDe ? {
      toggleLabel: 'Beispielbilder anzeigen',
      certLabel: 'Beispiel: Zertifikat',
      summaryLabel: 'Beispiel: Summary'
    } : {
      toggleLabel: 'Show sample images',
      certLabel: 'Sample: Certificate',
      summaryLabel: 'Sample: Summary'
    };
    const previewMarkup = `
      <div class="giveawayPreview">
        <div class="giveawayPreviewCard">
          <div class="giveawayPreviewLabel">${previewCopy.certLabel}</div>
          <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NGU execution certificate preview">
            <defs>
              <linearGradient id="cert-bg-popup" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#0a0712"/>
                <stop offset="100%" stop-color="#1c1422"/>
              </linearGradient>
              <linearGradient id="cert-gold-popup" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#f8d889"/>
                <stop offset="100%" stop-color="#c9973f"/>
              </linearGradient>
            </defs>
            <rect width="600" height="360" rx="22" fill="url(#cert-bg-popup)"/>
            <rect x="18" y="18" width="564" height="324" rx="18" fill="none" stroke="url(#cert-gold-popup)" stroke-width="2"/>
            <text x="300" y="70" text-anchor="middle" fill="url(#cert-gold-popup)" font-family="Georgia, serif" font-size="28" letter-spacing="2">NGU CERTIFICATE</text>
            <text x="300" y="105" text-anchor="middle" fill="#d8c8a1" font-family="Arial, sans-serif" font-size="14">NGU Trading Strategy</text>
            <text x="300" y="160" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="20">Execution Proficiency</text>
            <text x="300" y="195" text-anchor="middle" fill="#bfae88" font-family="Arial, sans-serif" font-size="13">Trader: Your Name · Score 86/100</text>
            <rect x="180" y="220" width="240" height="58" rx="12" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.12)"/>
            <text x="300" y="252" text-anchor="middle" fill="#f3d28a" font-family="Arial, sans-serif" font-size="14">Disciplined. Consistent. Professional.</text>
            <text x="300" y="300" text-anchor="middle" fill="#8f7a59" font-family="Arial, sans-serif" font-size="11">www.NGUtrading.com</text>
          </svg>
        </div>
        <div class="giveawayPreviewCard">
          <div class="giveawayPreviewLabel">${previewCopy.summaryLabel}</div>
          <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NGU execution summary preview">
            <defs>
              <linearGradient id="sum-bg-popup" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#0a0712"/>
                <stop offset="100%" stop-color="#171019"/>
              </linearGradient>
              <linearGradient id="sum-gold-popup" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#f7d17b"/>
                <stop offset="100%" stop-color="#b88432"/>
              </linearGradient>
            </defs>
            <rect width="600" height="360" rx="22" fill="url(#sum-bg-popup)"/>
            <rect x="20" y="20" width="560" height="320" rx="18" fill="none" stroke="url(#sum-gold-popup)" stroke-width="2"/>
            <text x="300" y="72" text-anchor="middle" fill="url(#sum-gold-popup)" font-family="Georgia, serif" font-size="24" letter-spacing="2">DAILY EXECUTION SUMMARY</text>
            <text x="70" y="130" fill="#f0d7a5" font-family="Arial, sans-serif" font-size="13">Session</text>
            <text x="220" y="130" fill="#ffffff" font-family="Arial, sans-serif" font-size="13">New York</text>
            <text x="70" y="160" fill="#f0d7a5" font-family="Arial, sans-serif" font-size="13">Trades</text>
            <text x="220" y="160" fill="#ffffff" font-family="Arial, sans-serif" font-size="13">9 · Win rate 56%</text>
            <text x="70" y="190" fill="#f0d7a5" font-family="Arial, sans-serif" font-size="13">Avg R</text>
            <text x="220" y="190" fill="#ffffff" font-family="Arial, sans-serif" font-size="13">+0.42</text>
            <rect x="70" y="220" width="460" height="70" rx="12" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.12)"/>
            <text x="90" y="252" fill="#f3d28a" font-family="Arial, sans-serif" font-size="14">Strength: Patience on entries</text>
            <text x="90" y="278" fill="#bfae88" font-family="Arial, sans-serif" font-size="13">Next fix: FOMO after 2nd trade</text>
            <text x="300" y="318" text-anchor="middle" fill="#8f7a59" font-family="Arial, sans-serif" font-size="11">www.NGUtrading.com</text>
          </svg>
        </div>
      </div>
    `;
    const modal = document.createElement('div');
    modal.className = 'modal giveawayModal';
    modal.id = 'giveawayModal';
    modal.innerHTML = `
      <div class="box">
        <div class="pad giveawayPad">
          <div class="giveawayHeader">🎁 GIVEAWAY 🎁</div>
          <h3>${copy.title}</h3>
          <div class="giveawayGrid">
            <div class="giveawayCard">
              <div class="giveawayTag">${copy.prize1Label}</div>
              <p>${copy.prize1}</p>
            </div>
            <div class="giveawayCard">
              <div class="giveawayTag">${copy.prize2Label}</div>
              <p>${copy.prize2}</p>
            </div>
            <div class="giveawayCard">
              <div class="giveawayTag">${copy.prize3Label}</div>
              <p>${copy.prize3}</p>
            </div>
          </div>
          <details class="giveawayPreviewToggle">
            <summary>${previewCopy.toggleLabel}</summary>
            ${previewMarkup}
          </details>
          <div class="giveawayBlock">
            <div class="giveawayTitle">${copy.enterTitle}</div>
            <ol>
              <li>${copy.enter1}</li>
              <li>${copy.enter2}</li>
            </ol>
          </div>
          <div class="giveawayBlock">
            <div class="giveawayTitle">${copy.getTitle}</div>
            <ol>
              <li>${copy.get1}</li>
              <li>${copy.get2}</li>
              <li>${copy.get3}</li>
              <li>${copy.get4}</li>
            </ol>
          </div>
          <div class="giveawayFooter">${copy.footer}</div>
          <div class="row" style="margin-top:16px;">
            <a class="btn primary botLink" href="#">${copy.primaryCta}</a>
            <a class="btn gold" href="${startHref}">${copy.secondaryCta}</a>
            <button class="btn ghost" type="button" id="giveawayClose">${copy.closeCta}</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    setExternal('.botLink', CONFIG.coachBot);
    $('#giveawayClose')?.addEventListener('click', closeGiveaway);
    modal.addEventListener('click', (e)=>{ if(e.target.id==='giveawayModal') closeGiveaway(); });
  }

  function maybeShowGiveaway(){
    const seen = store.get('ngu_giveaway_seen', null);
    if(seen === todayKey()) return;
    ensureGiveawayModal();
    setTimeout(()=>$('#giveawayModal')?.classList.add('show'), 500);
  }

  // offer widgets
  tickCountdown();
  setInterval(tickCountdown, 1000);
  updateSpots();
  setInterval(updateSpots, 60*1000); // check once/min

  maybeShowGiveaway();

  // year
  $$('.js-year').forEach(el=>el.textContent = new Date().getFullYear());
})();
