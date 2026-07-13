/* ============================================================
   NGU TRADING — app.js
   Central config + link wiring + copy buttons + affiliate render
   + mobile nav + language toggle. No i18n runtime, no upsell modal.
   ============================================================ */

window.NGU_PROOF_FILES = ["feedback_new_01.jpg","feedback_new_02.jpg","feedback_new_03.jpg","feedback_new_04.jpg","feedback_new_05.jpg","feedback_new_06.jpg","feedback_new_07.jpg","feedback_new_08.jpg","feedback_new_09.jpg","feedback_new_10.jpg","profit_01.jpg","profit_02.jpg","profit_03.jpg","profit_04.jpg","profit_05.jpg","profit_06.jpg","profit_07.jpg","profit_08.jpg","profit_09.jpg","profit_10.jpg","profit_11.jpg","profit_12.jpg","stats_2023_2025.jpg","testimonial_01.png","testimonial_02.png","testimonial_03.png","testimonial_04.png","testimonial_05.png","testimonial_06.png","testimonial_07.png","testimonial_08.jpg","testimonial_09.png"];

/* Language-neutral destinations — edit here, never in the HTML */
const CONFIG = {
  app:        "https://ngutrading.app",
  discord:    "https://urlgeni.us/discord/fmg",
  instagram:  "https://instagram.com/futuremillionairego",
  youtube:    "https://youtube.com/@fmg.trading",
  interview:  "https://www.youtube.com/embed/DM4sUQYr46o"
};

/* Affiliate programs — add a new object to extend the Recommended page.
   Each carries EN + DE copy; the page renders by <html lang>. */
const AFFILIATES = [
  {
    name:"Alpha Futures", url:"https://app.alpha-futures.com/signup/Kristian020613/",
    code:"Kristian020613", discount:"10% OFF",
    market:"Futures",
    tags:["Futures-native","Clean rules","Payouts every 5 days"],
    tags_de:["Futures-nativ","Klare Regeln","Payout alle 5 Tage"],
    why:"Sharper futures structure with fast payouts every 5 days. Best if you care about rule clarity and a cleaner, operator-grade feel over promotional noise.",
    why_de:"Schärfere Futures-Struktur mit schnellen Payouts alle 5 Tage. Am besten, wenn dir Regelklarheit und ein sauberes, operator-artiges Gefühl wichtiger sind als Werbelärm."
  },
  {
    name:"FundedHero", url:"https://fundedhero.com",
    code:"FMG", discount:"50% OFF",
    market:"CFD / Multi",
    tags:["Lowest friction","Widest route library","1-to-3 step"],
    tags_de:["Geringste Hürde","Größte Routen-Auswahl","1- bis 3-Step"],
    why:"The easiest first swing into prop trading. Broadest set of routes if you are testing structure for the first time.",
    why_de:"Der einfachste erste Einstieg ins Prop-Trading. Die breiteste Auswahl an Routen, wenn du zum ersten Mal testest."
  },
  {
    name:"FundedHero Futures", url:"https://fundedherofutures.com",
    code:"FMG", discount:"50% OFF",
    market:"Futures",
    tags:["Futures-specific","Plan variety","Instant + step"],
    tags_de:["Futures-spezifisch","Plan-Vielfalt","Instant + Step"],
    why:"Futures-specific with multiple formats. Strongest if you want plan variety before committing to one route shape.",
    why_de:"Futures-spezifisch mit mehreren Formaten. Am stärksten, wenn du Plan-Vielfalt willst, bevor du dich festlegst."
  },
  {
    name:"10four", url:"https://10four.com/?ref=FMG",
    code:"FMG", discount:"CODE FMG",
    market:"Prop",
    tags:["Modern rules","Fast onboarding"],
    tags_de:["Moderne Regeln","Schnelles Onboarding"],
    why:"A newer prop route worth comparing. Use the code and read the drawdown model before you buy.",
    why_de:"Eine neuere Prop-Route, die einen Vergleich wert ist. Nutze den Code und lies das Drawdown-Modell, bevor du kaufst."
  },
  {
    name:"OneFunded", url:"https://onefunded.com/?utm_medium=aff&utm_term=356&utm_source=tracknow&campaign_id=7&ref_id=356",
    code:"FMG", discount:"25% OFF",
    market:"Prop",
    tags:["Safe choice","Reliable","Discounted entry"],
    tags_de:["Sichere Wahl","Verlässlich","Rabattierter Einstieg"],
    why:"The safe, steady pick — a reliable route when you want fewer surprises. Still check payout cadence and rules for how you actually trade.",
    why_de:"Die sichere, ruhige Wahl — eine verlässliche Route, wenn du weniger Überraschungen willst. Prüfe trotzdem Payout-Rhythmus und Regeln für deinen Stil."
  },
  {
    name:"IQ Capital", url:"https://checkout.iqcapital.io/products?aff=fmg",
    code:"fmg", discount:"$9 / $1 START",
    market:"Futures + CFD",
    tags:["50K futures eval $9","10K CFD $1","Cheapest test"],
    tags_de:["50K-Futures-Eval $9","10K CFD $1","Günstigster Test"],
    why:"Cheapest way to test a route: first 50K futures eval is just $9 and the first 10K CFD is $1. Great for a low-risk first attempt.",
    why_de:"Der günstigste Weg, eine Route zu testen: erste 50K-Futures-Eval nur $9 und erste 10K CFD für $1. Ideal für einen risikoarmen ersten Versuch."
  }
];

(function(){
  const $  = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  /* wire external links by class → CONFIG value */
  function setExternal(sel, href){
    $$(sel).forEach(a=>{
      a.setAttribute("href", href);
      a.setAttribute("target","_blank");
      a.setAttribute("rel","noopener noreferrer");
    });
  }

  /* copy-to-clipboard for affiliate codes */
  function copyText(v){
    if(navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(v);
    return new Promise((res,rej)=>{
      try{
        const t=document.createElement("textarea");
        t.value=v; t.setAttribute("readonly",""); t.style.position="absolute"; t.style.left="-9999px";
        document.body.appendChild(t); t.select(); document.execCommand("copy"); document.body.removeChild(t); res();
      }catch(e){ rej(e); }
    });
  }
  function initCopy(root=document){
    $$("[data-copy]", root).forEach(btn=>{
      if(btn.dataset.wired) return; btn.dataset.wired="1";
      btn.addEventListener("click", async ()=>{
        const val=btn.getAttribute("data-copy"); if(!val) return;
        const label=btn.textContent;
        try{ await copyText(val); btn.textContent="Copied ✓"; btn.classList.add("ok"); }
        catch(e){ btn.textContent="Copy failed"; }
        setTimeout(()=>{ btn.textContent=label; btn.classList.remove("ok"); }, 1400);
      });
    });
  }

  /* render the affiliate cards from data (bilingual by <html lang>) */
  function renderAffiliates(){
    const mount=$("#affMount"); if(!mount) return;
    const de = (document.documentElement.lang||"en").toLowerCase().startsWith("de");
    const t = de
      ? { copy:"Code kopieren", open:"Öffnen", market:"Markt" }
      : { copy:"Copy code",     open:"Open",   market:"Market" };
    mount.innerHTML = AFFILIATES.map((a,i)=>{
      const why  = de && a.why_de  ? a.why_de  : a.why;
      const tags = de && a.tags_de ? a.tags_de : a.tags;
      return `
      <article class="card aff card-hover reveal" style="--i:${i%3}">
        <div class="aff-top">
          <div>
            <div class="idx">${String(i+1).padStart(2,"0")}</div>
            <h3>${a.name}</h3>
          </div>
          <span class="disc">${a.discount}</span>
        </div>
        <p class="why">${why}</p>
        <div class="aff-meta">
          <span class="k">${t.market}: ${a.market}</span>
          ${tags.map(x=>`<span class="k">${x}</span>`).join("")}
        </div>
        <div class="code-row">
          <span class="code">${a.code}</span>
          <button class="copy-chip" type="button" data-copy="${a.code}">${t.copy}</button>
          <a class="btn sm primary" href="${a.url}" target="_blank" rel="noopener noreferrer">${t.open} ${a.name} <span class="arw">→</span></a>
        </div>
      </article>`;
    }).join("");
    initCopy(mount);
    if(window.NGU_observeReveal) window.NGU_observeReveal(mount);
  }

  /* mobile nav toggle */
  function initNav(){
    const burger=$(".burger"), nav=$(".nav");
    if(!burger||!nav) return;
    burger.addEventListener("click", ()=>{
      const open=nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open?"true":"false");
    });
    $$(".nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
  }

  /* proof scroller mount (optional) */
  function initProofScroller(){
    const mount=$("#proofScroller"); if(!mount) return;
    const files=(window.NGU_PROOF_FILES||[]).slice(0,12);
    mount.innerHTML='<div class="scroller">'+files.map((f,i)=>
      `<div class="fr"><img loading="lazy" decoding="async" src="/assets/proof/${f}" alt="Community feedback or performance screenshot ${i+1}"></div>`
    ).join("")+'</div>';
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    setExternal(".discordLink", CONFIG.discord);
    setExternal(".appLink",     CONFIG.app);
    setExternal(".igLink",      CONFIG.instagram);
    setExternal(".ytLink",      CONFIG.youtube);
    renderAffiliates();
    initCopy();
    initNav();
    initProofScroller();
    $$(".js-year").forEach(el=>el.textContent = new Date().getFullYear());
  });
})();
