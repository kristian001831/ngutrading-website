
const CONFIG = {
  telegramInvite: "https://t.me/nguvipgroup",
  coachBot: "https://chatgpt.com/g/g-6978f4798004819197383b0c645e6854-ngu-trading-strategy-coach",
  members: 300
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

  function applyLang(code){
    const dict = (window.NGU_I18N && window.NGU_I18N[code]) ? window.NGU_I18N[code] : window.NGU_I18N.en;
    document.documentElement.setAttribute('lang', code);
    store.set('nguLang', code);

    $$('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      let txt = dict[key] ?? '';
      txt = txt.replace('{members}', String(CONFIG.members));
      el.textContent = txt;
    });

    $('#langDE')?.classList.toggle('active', code==='de');
    $('#langEN')?.classList.toggle('active', code==='en');
  }

  // bind toggles
  $('#langDE')?.addEventListener('click', ()=>applyLang('de'));
  $('#langEN')?.addEventListener('click', ()=>applyLang('en'));

  // links new tab
  function setLink(sel, href){
    $$(sel).forEach(a=>{
      a.setAttribute('href', href);
      a.setAttribute('target','_blank');
      a.setAttribute('rel','noopener noreferrer');
    });
  }
  setLink('#telegramLink', CONFIG.telegramInvite);
  setLink('#botLink', CONFIG.coachBot);

  // smooth anchors
  $$('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',(e)=>{
      const id=a.getAttribute('href');
      const el=document.querySelector(id);
      if(!el) return;
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });

  applyLang(guessLang());
})();
