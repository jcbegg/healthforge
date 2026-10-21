/* ===== HealthForge: drone controls (needs ACT from 06-main) ===== */
Object.assign(ACT,{
  dronepreview(t){ const id=t.dataset.id; if(DR&&DR.id===id&&DR.preview) stopDrone(1.5); else startDrone(id,true); render(); },
  droneuse(t){ S.settings.drone=t.dataset.id; save(); render(); },
  coachnext(){ const e=$('#coach'); if(e) e.innerHTML=coachHtml(coachPick(COACH_MID)); },
  dronepick(t){ S.settings.drone=t.dataset.id; save(); const p=$('#dpick'); if(p) p.innerHTML=dronePills(); }
});
document.addEventListener('input',e=>{ if(e.target.id==='dronevol'){ S.settings.droneVol=e.target.value/100; setDroneVol(); save(); } });

let COACH_MID='settle';
const coachHtml=t=>`<div class="lbl">Before you begin</div><p class="coach-text">${esc(t)}</p><button class="lnk" data-act="coachnext" type="button">Show another</button>`;
