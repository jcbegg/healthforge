/* ===== HealthForge: walk form, minutes / speed / distance stay linked while you type ===== */
document.addEventListener('input',e=>{
  const t=e.target; if(!t||!['min','speed','dist'].includes(t.name)) return;
  const f=t.closest('form'); if(!f||!(f.dataset.form==='walk'||(f.dataset.form==='edit'&&f.dataset.t==='walk'))) return;
  const g=n=>f.elements[n]; if(!g('min')||!g('speed')||!g('dist')) return;
  const min=num(g('min').value), sp=num(g('speed').value), di=num(g('dist').value);
  if(t.name==='dist'){ if(di>0&&min>0) g('speed').value=r2(di*60/min); }
  else if(sp>0&&min>0) g('dist').value=r2(sp*min/60);
  else if(t.name==='speed'&&!(sp>0)) g('dist').value='';
});
