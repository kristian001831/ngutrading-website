
const dict={
de:{
hero:"Free Community + Coach Bot – handle nach System, nicht Emotion.",
sub:"Starte kostenlos mit Community, NGU Coach Bot und strukturiertem Trading Framework.",
cta:"Gratis starten",
stack:"Dein Free Stack",
stats:"Performance Übersicht 2023–2025",
how:"So funktioniert NGU",
proof:"Community Feedback",
profit:"Trade Ergebnisse",
footer:"Bildungsangebot. Keine Anlageberatung."
},
en:{
hero:"Free Community + Coach Bot – trade a system, not emotions.",
sub:"Start free with the community, NGU coach bot and structured trading framework.",
cta:"Start free",
stack:"Your Free Stack",
stats:"Performance Summary 2023–2025",
how:"How NGU Works",
proof:"Community Feedback",
profit:"Trade Results",
footer:"Educational content. No financial advice."
}
};

function setLang(l){
document.querySelectorAll("[data-key]").forEach(e=>{
e.innerText=dict[l][e.dataset.key];
});
localStorage.setItem("lang",l);
}

const saved=localStorage.getItem("lang")||((navigator.language||"").startsWith("de")?"de":"en");
setLang(saved);
