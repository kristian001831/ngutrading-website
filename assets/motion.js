/* ============================================================
   NGU TRADING — motion.js
   Vanilla, dependency-free, all ambient. Every effect is gated on
   prefers-reduced-motion. Nothing here is required for comprehension.
   ============================================================ */
(function(){
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine   = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  /* ---- Scroll reveals ---- */
  let io = null;
  function observeReveal(root=document){
    const items = $$(".reveal:not(.in)", root);
    if(reduce){ items.forEach(el=>el.classList.add("in")); return; }
    if(!("IntersectionObserver" in window)){ items.forEach(el=>el.classList.add("in")); return; }
    if(!io){
      io = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
      }, { threshold:0.12, rootMargin:"0px 0px -8% 0px" });
    }
    items.forEach(el=>io.observe(el));
  }
  window.NGU_observeReveal = observeReveal;

  /* ---- Count-ups ---- */
  function countUp(el){
    const target = parseFloat(el.getAttribute("data-count"));
    const dec = (el.getAttribute("data-dec")|0);
    const prefix = el.getAttribute("data-prefix")||"";
    const suffix = el.getAttribute("data-suffix")||"";
    if(reduce || isNaN(target)){ el.textContent = prefix+target.toFixed(dec)+suffix; return; }
    const dur = 1300; let start = null;
    function frame(t){
      if(start===null) start=t;
      const p = Math.min((t-start)/dur, 1);
      const eased = 1-Math.pow(1-p,3);
      el.textContent = prefix + (target*eased).toFixed(dec) + suffix;
      if(p<1) requestAnimationFrame(frame); else el.textContent = prefix+target.toFixed(dec)+suffix;
    }
    requestAnimationFrame(frame);
  }
  function initCounts(){
    const els = $$("[data-count]");
    if(!els.length) return;
    if(reduce || !("IntersectionObserver" in window)){ els.forEach(countUp); return; }
    const cio = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ countUp(e.target); cio.unobserve(e.target); } });
    }, { threshold:0.6 });
    els.forEach(el=>cio.observe(el));
  }

  /* ---- Magnetic CTAs (primary only, desktop/fine-pointer) ---- */
  function initMagnetic(){
    if(reduce || !fine) return;
    $$(".magnetic").forEach(btn=>{
      const strength = 0.28;
      btn.addEventListener("pointermove", (e)=>{
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width/2) * strength;
        const y = (e.clientY - r.top - r.height/2) * strength;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener("pointerleave", ()=>{ btn.style.transform=""; });
    });
  }

  /* ---- Hero cursor spotlight ---- */
  function initSpotlight(){
    if(reduce || !fine) return;
    $$(".has-spot").forEach(box=>{
      box.addEventListener("pointermove",(e)=>{
        const r = box.getBoundingClientRect();
        box.style.setProperty("--mx", ((e.clientX-r.left)/r.width*100)+"%");
        box.style.setProperty("--my", ((e.clientY-r.top)/r.height*100)+"%");
      });
    });
  }

  /* ---- Light hero parallax ---- */
  function initParallax(){
    if(reduce || !fine) return;
    const els = $$("[data-parallax]");
    if(!els.length) return;
    let ticking=false;
    function update(){
      const vh = window.innerHeight;
      els.forEach(el=>{
        const speed = parseFloat(el.getAttribute("data-parallax"))||0.06;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height/2 - vh/2;
        el.style.transform = `translateY(${(-center*speed).toFixed(1)}px)`;
      });
      ticking=false;
    }
    window.addEventListener("scroll", ()=>{ if(!ticking){ requestAnimationFrame(update); ticking=true; } }, {passive:true});
    update();
  }

  /* ---- Animated bars (fill on reveal) ---- */
  function initBars(){
    const bars = $$(".mv-bar i[data-w]");
    if(reduce){ bars.forEach(b=>b.style.width=b.getAttribute("data-w")); return; }
    if(!("IntersectionObserver" in window)){ bars.forEach(b=>b.style.width=b.getAttribute("data-w")); return; }
    bars.forEach(b=>{ b.style.width="0%"; b.style.transition="width 1.1s cubic-bezier(.16,1,.3,1)"; });
    const bio = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.style.width=e.target.getAttribute("data-w"); bio.unobserve(e.target); } });
    }, { threshold:0.4 });
    bars.forEach(b=>bio.observe(b));
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    observeReveal();
    initCounts();
    initMagnetic();
    initSpotlight();
    initParallax();
    initBars();
  });
})();
