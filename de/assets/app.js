window.NGU_PROOF_FILES=["feedback_new_01.jpg", "feedback_new_02.jpg", "feedback_new_03.jpg", "feedback_new_04.jpg", "feedback_new_05.jpg", "feedback_new_06.jpg", "feedback_new_07.jpg", "feedback_new_08.jpg", "feedback_new_09.jpg", "feedback_new_10.jpg", "profit_01.jpg", "profit_01_1.jpg", "profit_02.jpg", "profit_02_1.jpg", "profit_03.jpg", "profit_03_1.jpg", "profit_04.jpg", "profit_04_1.jpg", "profit_05.jpg", "profit_05_1.jpg", "profit_06.jpg", "profit_06_1.jpg", "profit_07.jpg", "profit_07_1.jpg", "profit_08.jpg", "profit_08_1.jpg", "profit_09.jpg", "profit_09_1.jpg", "profit_10.jpg", "profit_10_1.jpg", "profit_11.jpg", "profit_11_1.jpg", "profit_12.jpg", "profit_12_1.jpg", "stats_2023_2025.jpg", "stats_2023_2025_1.jpg", "testimonial_01.png", "testimonial_01_1.png", "testimonial_02.png", "testimonial_02_1.png", "testimonial_03.png", "testimonial_03_1.png", "testimonial_04.png", "testimonial_04_1.png", "testimonial_05.png", "testimonial_05_1.png", "testimonial_06.png", "testimonial_06_1.png", "testimonial_07.png", "testimonial_07_1.png", "testimonial_08.jpg", "testimonial_08.png", "testimonial_09.png"];


const CONFIG = {
  discordInvite: "https://urlgeni.us/discord/fmgd",
  coachBot: "https://chatgpt.com/g/g-6978f4798004819197383b0c645e6854-ngu-trading-strategy-coach",
  whopCheckout: "https://whop.com/checkout/plan_bgPFruiqerClS",
  alphaFutures: "https://app.alpha-futures.com/signup/Kristian020613/",
  fundedHero: "https://fundedhero.com",
  fundedHeroFutures: "https://fundedherofutures.com",
  langKey: "ngu_lang"
};

(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  let activeModal = null;
  let lastFocusedElement = null;

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
      el.hidden = !show;
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

  function initMotion(){
    const items = $$('.motion-enter');
    if(!items.length) return;
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    items.forEach(item=>io.observe(item));
  }

  function copyText(value){
    if(navigator.clipboard && navigator.clipboard.writeText){
      return navigator.clipboard.writeText(value);
    }
    return new Promise((resolve, reject)=>{
      try{
        const input = document.createElement('textarea');
        input.value = value;
        input.setAttribute('readonly', '');
        input.style.position = 'absolute';
        input.style.left = '-9999px';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        resolve();
      }catch(error){
        reject(error);
      }
    });
  }

  function initCopyButtons(){
    $$('[data-copy]').forEach(button=>{
      button.addEventListener('click', async ()=>{
        const value = button.getAttribute('data-copy');
        if(!value) return;
        const original = button.getAttribute('data-label') || button.textContent;
        const successLabel = button.getAttribute('data-copied') || 'Copied';
        const failLabel = button.getAttribute('data-copy-failed') || 'Copy failed';
        try{
          await copyText(value);
          button.textContent = successLabel;
          setTimeout(()=>{ button.textContent = original; }, 1400);
        }catch(error){
          button.textContent = failLabel;
          setTimeout(()=>{ button.textContent = original; }, 1600);
        }
      });
    });
  }

  function initFirmCompare(){
    const switches = $$('[data-compare-target]');
    if(!switches.length) return;

    function setActive(target){
      switches.forEach(button=>{
        const active = button.getAttribute('data-compare-target') === target;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
      });

      $$('[data-compare-panel]').forEach(panel=>{
        panel.classList.toggle('is-active', panel.getAttribute('data-compare-panel') === target);
      });

      $$('[data-firm-card]').forEach(card=>{
        card.classList.toggle('is-focus', card.getAttribute('data-firm-card') === target);
      });
    }

    switches.forEach(button=>{
      button.addEventListener('click', ()=>{
        const target = button.getAttribute('data-compare-target');
        if(target) setActive(target);
      });
    });

    setActive(switches[0].getAttribute('data-compare-target'));
  }

  function getFocusable(root){
    return $$(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      root
    ).filter(el => !el.hasAttribute('hidden') && el.getAttribute('aria-hidden') !== 'true');
  }

  function syncModalState(modal, open){
    if(!modal) return;
    modal.classList.toggle('show', open);
    modal.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function openModal(trigger){
    const m = $('#bridgeModal');
    if(!m) return;
    const d = dict();
    lastFocusedElement = trigger || document.activeElement;
    $('#mTitle').textContent = d.modal_h || "✅ Opened";
    $('#mBody').textContent = d.modal_p || "";
    $('#mFree').textContent = d.modal_free || "Continue";
    $('#mAdv').textContent = d.modal_adv || "View advanced";
    syncModalState(m, true);
    activeModal = m;
    const focusables = getFocusable(m);
    (focusables[0] || $('.box', m))?.focus();
  }
  function closeModal(){
    const m = $('#bridgeModal');
    if(!m) return;
    syncModalState(m, false);
    activeModal = null;
    lastFocusedElement?.focus?.();
  }

  function handleModalKeydown(e){
    if(!activeModal) return;
    if(e.key === 'Escape'){
      e.preventDefault();
      closeModal();
      return;
    }
    if(e.key !== 'Tab') return;

    const focusables = getFocusable(activeModal);
    if(!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if(e.shiftKey && document.activeElement === first){
      e.preventDefault();
      last.focus();
    } else if(!e.shiftKey && document.activeElement === last){
      e.preventDefault();
      first.focus();
    }
  }

  // init
  const lang = guessLang();
  applyLang(lang);
  $('#langDE')?.addEventListener('click', ()=>applyLang('de'));
  $('#langEN')?.addEventListener('click', ()=>applyLang('en'));

  setExternal('.telegramLink, .discordLink', CONFIG.discordInvite);
  setExternal('.botLink', CONFIG.coachBot);
  setExternal('.checkoutLink', CONFIG.whopCheckout);
  setExternal('.alphaLink', CONFIG.alphaFutures);
  setExternal('.fundedHeroLink', CONFIG.fundedHero);
  setExternal('.fundedHeroFuturesLink', CONFIG.fundedHeroFutures);
  initMotion();
  initCopyButtons();
  initFirmCompare();

  // Show modal after clicking external links (keeps funnel alive)
  $$('.telegramLink, .discordLink, .botLink').forEach(el=>{
    el.addEventListener('click', ()=>{
      setTimeout(() => openModal(el), 140);
    });
  });
  $('#mClose')?.addEventListener('click', closeModal);
  $('#mFree')?.addEventListener('click', closeModal);
  $('#bridgeModal')?.addEventListener('click', (e)=>{ if(e.target.id==='bridgeModal') closeModal(); });
  window.addEventListener('keydown', handleModalKeydown);

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
