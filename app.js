const CONFIG = {
  telegramInvite: "https://t.me/nguvipgroup",
  coachBot: "https://chatgpt.com/g/g-6978f4798004819197383b0c645e6854-ngu-trading-strategy-coach",
  whopCheckout: "https://whop.com/checkout/plan_bgPFruiqerClS",
  langKey: "ngu_lang"
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
    const looksDach = lang.startsWith('de') || /europe\/(berlin|zurich|vienna)/.test(tz);
    return looksDach ? 'de' : 'en';
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
  }

  function setLink(sel, href, newTab=true){
    $$(sel).forEach(a=>{
      a.setAttribute('href', href);
      if(newTab){
        a.setAttribute('target','_blank');
        a.setAttribute('rel','noopener noreferrer');
      }
    });
  }

  function toast(title, body, ctaText, ctaHref){
    const t = $('#toast');
    if(!t) return;
    $('#toastTitle').textContent = title || '';
    $('#toastBody').textContent = body || '';
    const c = $('#toastCta');
    if(c){
      c.textContent = ctaText || '';
      c.href = ctaHref || '#';
      c.target = '_self';
    }
    t.classList.add('show');
    $('#toastClose')?.addEventListener('click', ()=>t.classList.remove('show'), {once:true});
    setTimeout(()=>t.classList.remove('show'), 7000);
  }

  const lang = guessLang();
  applyLang(lang);
  $('#langDE')?.addEventListener('click', ()=>applyLang('de'));
  $('#langEN')?.addEventListener('click', ()=>applyLang('en'));

  setLink('.telegramLink', CONFIG.telegramInvite, true);
  setLink('.botLink', CONFIG.coachBot, true);
  setLink('.checkoutLink', CONFIG.whopCheckout, true);

  $$('.telegramLink, .botLink').forEach(el=>{
    el.addEventListener('click', ()=>{
      const d = (window.NGU_I18N && window.NGU_I18N[document.documentElement.lang]) ? window.NGU_I18N[document.documentElement.lang] : window.NGU_I18N.en;
      toast("✅ Unlocked", "Optional next step is available now.", d['cta_offer'] || "View advanced →", "/offer/");
    });
  });

  $$('.js-year').forEach(el=>el.textContent = new Date().getFullYear());
})();