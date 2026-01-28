window.NGU_PROOF_FILES=["feedback_new_01.jpg", "feedback_new_02.jpg", "feedback_new_03.jpg", "feedback_new_04.jpg", "feedback_new_05.jpg", "feedback_new_06.jpg", "feedback_new_07.jpg", "feedback_new_08.jpg", "feedback_new_09.jpg", "feedback_new_10.jpg", "profit_01.jpg", "profit_01_1.jpg", "profit_02.jpg", "profit_02_1.jpg", "profit_03.jpg", "profit_03_1.jpg", "profit_04.jpg", "profit_04_1.jpg", "profit_05.jpg", "profit_05_1.jpg", "profit_06.jpg", "profit_06_1.jpg", "profit_07.jpg", "profit_07_1.jpg", "profit_08.jpg", "profit_08_1.jpg", "profit_09.jpg", "profit_09_1.jpg", "profit_10.jpg", "profit_10_1.jpg", "profit_11.jpg", "profit_11_1.jpg", "profit_12.jpg", "profit_12_1.jpg", "stats_2023_2025.jpg", "stats_2023_2025_1.jpg", "testimonial_01.png", "testimonial_01_1.png", "testimonial_02.png", "testimonial_02_1.png", "testimonial_03.png", "testimonial_03_1.png", "testimonial_04.png", "testimonial_04_1.png", "testimonial_05.png", "testimonial_05_1.png", "testimonial_06.png", "testimonial_06_1.png", "testimonial_07.png", "testimonial_07_1.png", "testimonial_08.jpg", "testimonial_08.png", "testimonial_09.png"];


const CONFIG = {
  telegramInvite: "https://t.me/nguvipgroup",
  coachBot: "https://chatgpt.com/g/g-6978f4798004819197383b0c645e6854-ngu-trading-strategy-coach",
  whopCheckout: "https://whop.com/checkout/plan_bgPFruiqerClS",
  langKey: "ngu_lang",
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

  function guessLang(){
    const saved = store.get(CONFIG.langKey, null);
    if(saved) return saved;
    const lang = (navigator.language||'').toLowerCase();
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone||'').toLowerCase();
    const looksDACH = lang.startsWith('de') || /europe\/(berlin|zurich|vienna)/.test(tz);
    return looksDACH ? 'de' : 'en';
  }

  function dict(){
    const code = document.documentElement.getAttribute('lang') || 'en';
    return (window.NGU_I18N && window.NGU_I18N[code]) ? window.NGU_I18N[code] : window.NGU_I18N.en;
  }


  function toggleLegalBlocks(){
    const code = document.documentElement.getAttribute('lang') || 'en';
    $$('[data-lang-block]').forEach(el=>{
      const show = (el.getAttribute('data-lang-block') === code);
      el.style.display = show ? '' : 'none';
    });
  }

  function applyLang(code){
    const d = (window.NGU_I18N && window.NGU_I18N[code]) ? window.NGU_I18N[code] : window.NGU_I18N.en;
    document.documentElement.setAttribute('lang', code);
    store.set(CONFIG.langKey, code);
    $$('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      el.textContent = d[key] ?? '';
    });
    $('#langDE')?.classList.toggle('active', code==='de');
    $('#langEN')?.classList.toggle('active', code==='en');
    toggleLegalBlocks();
  }

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
    const d = dict();
    $('#mTitle').textContent = d.modal_h || "✅ Opened";
    $('#mBody').textContent = d.modal_p || "";
    $('#mFree').textContent = d.modal_free || "Continue";
    $('#mAdv').textContent = d.modal_adv || "View advanced";
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

  // init
  const lang = guessLang();
  applyLang(lang);
  $('#langDE')?.addEventListener('click', ()=>applyLang('de'));
  $('#langEN')?.addEventListener('click', ()=>applyLang('en'));

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

  // offer widgets
  tickCountdown();
  setInterval(tickCountdown, 1000);
  updateSpots();
  setInterval(updateSpots, 60*1000); // check once/min

  // year
  $$('.js-year').forEach(el=>el.textContent = new Date().getFullYear());
})();

// --- Language via URL (?lang=en|de) ---
(function(){
  try{
    const p=new URLSearchParams(window.location.search);
    const q=p.get('lang');
    if(q==='en'||q==='de'){
      localStorage.setItem('ngu_lang', q);
    }
  }catch(e){}
})();


(function(){
  function setShareLinks(){
    var de=document.querySelectorAll('[data-share="de"]');
    var en=document.querySelectorAll('[data-share="en"]');
    try{
      var u=new URL(window.location.href);
      u.searchParams.set('lang','de'); de.forEach(function(a){a.href=u.toString();});
      u.searchParams.set('lang','en'); en.forEach(function(a){a.href=u.toString();});
    }catch(e){}
  }
  document.addEventListener('DOMContentLoaded', setShareLinks);
})();
