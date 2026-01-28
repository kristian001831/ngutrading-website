
const CONFIG = {
  telegramInvite: "https://t.me/nguvipgroup",
  coachBot: "https://chatgpt.com/g/g-6978f4798004819197383b0c645e6854-ngu-trading-strategy-coach",
  members: 300,
  unlockKey: "ngu_unlocked",
  offerPath: "offer.html"
};

(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const store = {
    get(k, d=null){ try{ const v=localStorage.getItem(k); return v===null?d:JSON.parse(v);}catch(e){return d;}},
    set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  };

  function guessLang(){
    const saved = store.get('nguLang', null);
    if(saved) return saved;
    const lang = (navigator.language||'').toLowerCase();
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone||'').toLowerCase();
    const looksDach = lang.startsWith('de') || /europe\/(berlin|zurich|vienna)/.test(tz);
    return looksDach ? 'de' : 'en';
  }

  function dict(){
    const code = store.get('nguLang', null) || guessLang();
    return (window.NGU_I18N && window.NGU_I18N[code]) ? window.NGU_I18N[code] : (window.NGU_I18N?.en || {});
  }

  function applyLang(code){
    const d = (window.NGU_I18N && window.NGU_I18N[code]) ? window.NGU_I18N[code] : window.NGU_I18N.en;
    document.documentElement.setAttribute('lang', code);
    store.set('nguLang', code);

    $$('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      let txt = d[key] ?? '';
      txt = txt.replace('{members}', String(CONFIG.members));
      el.textContent = txt;
    });

    $('#langDE')?.classList.toggle('active', code==='de');
    $('#langEN')?.classList.toggle('active', code==='en');

    // toast CTA label
    const cta = $('#toastCta');
    if(cta) cta.textContent = d['unlock_cta'] || (code==='de' ? 'Next Step ansehen →' : 'View next step →');
  }

  function setLink(sel, href){
    $$(sel).forEach(a=>{
      a.setAttribute('href', href);
      a.setAttribute('target','_blank');
      a.setAttribute('rel','noopener noreferrer');
    });
  }

  function isUnlocked(){
    return store.get(CONFIG.unlockKey, false) === true;
  }
  function unlock(){
    store.set(CONFIG.unlockKey, true);
  }

  function revealAdvanced(){
    const adv = $('#advanced');
    if(!adv) return;
    adv.style.display = 'block';
  }

  function showToast(){
    const t = $('#toast');
    if(!t) return;
    const d = dict();
    $('#toastTitle').textContent = d.unlock_title || '✅ Access unlocked';
    $('#toastBody').textContent = d.unlock_body || 'You can now view the next step.';
    t.classList.add('show');
  }
  function hideToast(){ $('#toast')?.classList.remove('show'); }

  function bindUnlockClicks(){
    // We bind to all buttons that open Telegram/Bot.
    $$('#telegramLink, #botLink').forEach(el=>{
      el.addEventListener('click', ()=>{
        // Unlock immediately, then external opens in new tab (already set).
        unlock();
        revealAdvanced();
        showToast();
      });
    });
    $('#toastClose')?.addEventListener('click', hideToast);
  }

  function startCountdown(){
    const el = $('#countdownText');
    if(!el) return;
    // Artificial countdown: resets daily at midnight local time.
    function tick(){
      const now = new Date();
      const end = new Date(now);
      end.setHours(23,59,59,999);
      const ms = Math.max(0, end - now);
      const total = Math.floor(ms/1000);
      const h = String(Math.floor(total/3600)).padStart(2,'0');
      const m = String(Math.floor((total%3600)/60)).padStart(2,'0');
      const s = String(total%60).padStart(2,'0');
      el.textContent = `${h}:${m}:${s}`;
    }
    tick();
    setInterval(tick, 1000);
  }

  // smooth anchors
  $$('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',(e)=>{
      const id=a.getAttribute('href');
      const target=document.querySelector(id);
      if(!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  // init
  setLink('#telegramLink', CONFIG.telegramInvite);
  setLink('#botLink', CONFIG.coachBot);

  const initial = guessLang();
  applyLang(initial);
  $('#langDE')?.addEventListener('click', ()=>applyLang('de'));
  $('#langEN')?.addEventListener('click', ()=>applyLang('en'));

  if(isUnlocked()){
    revealAdvanced();
  }

  bindUnlockClicks();
  startCountdown();
})();
