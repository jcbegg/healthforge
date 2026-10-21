/* ===== HealthForge: bespoke form controls =====
   Replaces native dropdowns, date pickers, number spinners and confirm boxes with custom ones.
   The native elements stay in the DOM (hidden) so forms and existing handlers keep working. */
const UI_CHEV='<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8l5 5 5-5"/></svg>';
const UI_MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const p2=n=>String(n).padStart(2,'0');
const ymdOf=d=>d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate());
const dateOfYmd=s=>{ const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s||''); return m?new Date(+m[1],+m[2]-1,+m[3]):null; };
let UIPOP=null;   // the one open popover: {el, owner, close}

function uiClosePop(){ if(UIPOP){ const p=UIPOP; UIPOP=null; p.el.remove(); p.owner&&p.owner.classList.remove('open'); if(p.onclose) p.onclose(); } }
function uiPlace(pop,anchor,minW){
  const r=anchor.getBoundingClientRect(); pop.style.minWidth=Math.max(minW||0,r.width)+'px';
  document.body.appendChild(pop);
  const ph=pop.offsetHeight, below=innerHeight-r.bottom-12, above=r.top-12;
  let top, maxH;
  if(ph<=below||below>=above){ top=r.bottom+6; maxH=below; } else { maxH=above; top=Math.max(8,r.top-6-Math.min(ph,above)); }
  pop.style.maxHeight=Math.max(140,maxH)+'px'; pop.style.top=top+'px';
  const w=pop.offsetWidth; pop.style.left=Math.max(8,Math.min(r.left,innerWidth-w-8))+'px';
}
document.addEventListener('pointerdown',e=>{ if(UIPOP&&!UIPOP.el.contains(e.target)&&!(UIPOP.owner&&UIPOP.owner.contains(e.target))) uiClosePop(); },true);
window.addEventListener('resize',uiClosePop);
document.addEventListener('scroll',e=>{ if(UIPOP&&!UIPOP.el.contains(e.target)) uiClosePop(); },true);

/* ---------- dropdown ---------- */
function uiSelect(sel){
  if(sel.dataset.ui) return; sel.dataset.ui='1';
  const wrap=document.createElement('div'); wrap.className='sel'; sel.parentNode.insertBefore(wrap,sel); wrap.appendChild(sel);
  sel.classList.add('ui-native'); sel.tabIndex=-1; sel.setAttribute('aria-hidden','true');
  const btn=document.createElement('button'); btn.type='button'; btn.className='sel-btn'; btn.setAttribute('aria-haspopup','listbox');
  btn.innerHTML='<span class="sel-val"></span>'+UI_CHEV; wrap.appendChild(btn);
  const lab=sel.id&&document.querySelector('label[for="'+sel.id+'"]'); if(lab) btn.setAttribute('aria-label',lab.textContent);
  const paint=()=>{ const o=sel.options[sel.selectedIndex]; btn.querySelector('.sel-val').textContent=o?o.text:''; btn.disabled=sel.disabled; };
  sel.addEventListener('change',paint); paint(); sel._uiPaint=paint;
  const open=()=>{
    if(UIPOP&&UIPOP.owner===wrap){ uiClosePop(); return; } uiClosePop(); paint();
    const pop=document.createElement('div'); pop.className='ui-pop sel-pop'; pop.setAttribute('role','listbox');
    const opts=[...sel.options]; let act=Math.max(0,sel.selectedIndex), buf='', bt=0;
    pop.innerHTML=opts.map((o,i)=>`<div class="sel-opt${i===sel.selectedIndex?' on':''}" role="option" data-i="${i}"${o.disabled?' data-dis="1"':''}><span>${esc(o.text)}</span></div>`).join('');
    wrap.classList.add('open'); uiPlace(pop,btn,180);
    UIPOP={el:pop,owner:wrap,onclose:()=>{ document.removeEventListener('keydown',key,true); }};
    const els=[...pop.children]; const mark=()=>{ els.forEach((e,i)=>e.classList.toggle('act',i===act)); els[act]&&els[act].scrollIntoView({block:'nearest'}); }; mark();
    const pick=i=>{ if(opts[i]&&!opts[i].disabled){ const changed=sel.selectedIndex!==i; sel.selectedIndex=i; if(changed){ sel.dispatchEvent(new Event('input',{bubbles:true})); sel.dispatchEvent(new Event('change',{bubbles:true})); } paint(); } uiClosePop(); btn.focus(); };
    pop.addEventListener('click',e=>{ const o=e.target.closest('.sel-opt'); if(o) pick(+o.dataset.i); });
    pop.addEventListener('pointermove',e=>{ const o=e.target.closest('.sel-opt'); if(o&&+o.dataset.i!==act){ act=+o.dataset.i; mark(); } });
    function key(e){ const k=e.key;
      if(k==='Escape'){ e.preventDefault(); e.stopPropagation(); uiClosePop(); btn.focus(); }
      else if(k==='ArrowDown'){ e.preventDefault(); act=Math.min(opts.length-1,act+1); mark(); }
      else if(k==='ArrowUp'){ e.preventDefault(); act=Math.max(0,act-1); mark(); }
      else if(k==='Home'){ e.preventDefault(); act=0; mark(); } else if(k==='End'){ e.preventDefault(); act=opts.length-1; mark(); }
      else if(k==='Enter'||k===' '){ e.preventDefault(); pick(act); }
      else if(k==='Tab'){ uiClosePop(); }
      else if(k.length===1){ const n=Date.now(); buf=(n-bt>700?'':buf)+k.toLowerCase(); bt=n; const i=opts.findIndex(o=>o.text.toLowerCase().startsWith(buf)); if(i>=0){ act=i; mark(); } } }
    document.addEventListener('keydown',key,true);
  };
  btn.addEventListener('click',open);
  btn.addEventListener('keydown',e=>{ if(['ArrowDown','ArrowUp'].includes(e.key)){ e.preventDefault(); open(); } });
}

/* ---------- date picker ---------- */
function uiDate(inp){
  if(inp.dataset.ui) return; inp.dataset.ui='1';
  const wrap=document.createElement('div'); wrap.className='sel dp'; inp.parentNode.insertBefore(wrap,inp); wrap.appendChild(inp);
  inp.classList.add('ui-native'); inp.tabIndex=-1;
  const btn=document.createElement('button'); btn.type='button'; btn.className='sel-btn'; btn.setAttribute('aria-haspopup','dialog');
  btn.innerHTML='<span class="sel-val"></span><svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="14" height="12.5" rx="2.5"/><path d="M3 8.5h14M7 2.8v3.4M13 2.8v3.4"/></svg>'; wrap.appendChild(btn);
  const paint=()=>{ const d=dateOfYmd(inp.value); btn.querySelector('.sel-val').textContent=d?d.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}):'Choose a date'; };
  inp.addEventListener('change',paint); inp.addEventListener('input',paint); paint(); inp._uiPaint=paint;
  btn.addEventListener('click',()=>{
    if(UIPOP&&UIPOP.owner===wrap){ uiClosePop(); return; } uiClosePop();
    const min=dateOfYmd(inp.getAttribute('min')), max=dateOfYmd(inp.getAttribute('max')); const today=new Date(); today.setHours(0,0,0,0);
    let cur=dateOfYmd(inp.value)||(max&&max<today?max:today); let view=new Date(cur.getFullYear(),cur.getMonth(),1);
    const pop=document.createElement('div'); pop.className='ui-pop dp-pop'; pop.setAttribute('role','dialog');
    const inRange=d=>(!min||d>=min)&&(!max||d<=max);
    const draw=()=>{
      const y=view.getFullYear(), m=view.getMonth(), first=new Date(y,m,1).getDay(), days=new Date(y,m+1,0).getDate(); let cells='';
      for(let i=0;i<first;i++) cells+='<span></span>';
      for(let d=1;d<=days;d++){ const dt=new Date(y,m,d), ok=inRange(dt), sel=inp.value===ymdOf(dt), t=+dt===+today, ac=+dt===+cur;
        cells+=`<button type="button" class="dp-day${sel?' on':''}${t?' today':''}${ac?' act':''}" data-d="${d}"${ok?'':' disabled'}>${d}</button>`; }
      pop.innerHTML=`<div class="dp-head"><button type="button" class="dp-nav" data-n="-12" aria-label="Previous year">&laquo;</button><button type="button" class="dp-nav" data-n="-1" aria-label="Previous month">&lsaquo;</button><b>${UI_MONTHS[m]} ${y}</b><button type="button" class="dp-nav" data-n="1" aria-label="Next month">&rsaquo;</button><button type="button" class="dp-nav" data-n="12" aria-label="Next year">&raquo;</button></div>
        <div class="dp-dow">${['Su','Mo','Tu','We','Th','Fr','Sa'].map(x=>`<span>${x}</span>`).join('')}</div><div class="dp-grid">${cells}</div>
        <div class="dp-foot"><button type="button" class="lnk" data-today="1"${inRange(today)?'':' disabled'}>Today</button></div>`;
    };
    draw(); wrap.classList.add('open'); uiPlace(pop,btn,296);
    const pick=dt=>{ if(!inRange(dt)) return; inp.value=ymdOf(dt); inp.dispatchEvent(new Event('input',{bubbles:true})); inp.dispatchEvent(new Event('change',{bubbles:true})); paint(); uiClosePop(); btn.focus(); };
    pop.addEventListener('click',e=>{
      const n=e.target.closest('[data-n]'), d=e.target.closest('.dp-day'), t=e.target.closest('[data-today]');
      if(n){ view=new Date(view.getFullYear(),view.getMonth()+ +n.dataset.n,1); cur=new Date(view.getFullYear(),view.getMonth(),Math.min(cur.getDate(),new Date(view.getFullYear(),view.getMonth()+1,0).getDate())); draw(); }
      else if(d) pick(new Date(view.getFullYear(),view.getMonth(),+d.dataset.d));
      else if(t) pick(today); });
    const key=e=>{ const k=e.key; let step=0;
      if(k==='Escape'){ e.preventDefault(); e.stopPropagation(); uiClosePop(); btn.focus(); return; }
      if(k==='ArrowLeft') step=-1; else if(k==='ArrowRight') step=1; else if(k==='ArrowUp') step=-7; else if(k==='ArrowDown') step=7;
      else if(k==='PageUp'||k==='PageDown'){ e.preventDefault(); cur=new Date(cur.getFullYear(),cur.getMonth()+(k==='PageUp'?-1:1),cur.getDate()); view=new Date(cur.getFullYear(),cur.getMonth(),1); draw(); return; }
      else if(k==='Enter'){ if(e.target.closest&&e.target.closest('.dp-nav,[data-today]')) return; e.preventDefault(); pick(cur); return; } else return;
      e.preventDefault(); cur=new Date(cur.getFullYear(),cur.getMonth(),cur.getDate()+step); view=new Date(cur.getFullYear(),cur.getMonth(),1); draw(); };
    document.addEventListener('keydown',key,true); UIPOP={el:pop,owner:wrap,onclose:()=>document.removeEventListener('keydown',key,true)};
  });
  btn.addEventListener('keydown',e=>{ if(['ArrowDown','ArrowUp'].includes(e.key)){ e.preventDefault(); btn.click(); } });
}

/* ---------- number stepper ---------- */
function uiNumber(inp){
  if(inp.dataset.ui) return; inp.dataset.ui='1';
  const wrap=document.createElement('div'); wrap.className='num'; inp.parentNode.insertBefore(wrap,inp); wrap.appendChild(inp);
  const mk=(dir)=>{ const b=document.createElement('button'); b.type='button'; b.tabIndex=-1; b.className='num-b '+(dir>0?'up':'dn'); b.setAttribute('aria-label',dir>0?'Increase':'Decrease');
    b.innerHTML='<svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'+(dir>0?'<path d="M5 12l5-5 5 5"/>':'<path d="M5 8l5 5 5-5"/>')+'</svg>';
    b.addEventListener('click',()=>{ const step=parseFloat(inp.step)||1, min=inp.min!==''?parseFloat(inp.min):-Infinity, max=inp.max!==''?parseFloat(inp.max):Infinity; let v=parseFloat(inp.value); if(!isFinite(v)) v=isFinite(min)?min:0; else v+=dir*step;
      v=Math.min(max,Math.max(min,Math.round(v*1e6)/1e6)); inp.value=v; inp.dispatchEvent(new Event('input',{bubbles:true})); inp.dispatchEvent(new Event('change',{bubbles:true})); });
    wrap.appendChild(b); };
  mk(1); mk(-1);
}

/* ---------- confirm dialog (replaces window.confirm) ---------- */
function uiConfirm(message,opt){
  opt=opt||{}; return new Promise(res=>{
    const prev=document.activeElement; const el=document.createElement('div'); el.className='dlg';
    el.innerHTML=`<div class="dlg-scrim"></div><div class="dlg-box" role="alertdialog" aria-modal="true"><h3>${esc(opt.title||'Please confirm')}</h3><p>${esc(message)}</p><div class="dlg-act"><button class="btn ghost" data-r="0">${esc(opt.no||'Cancel')}</button><button class="btn ${opt.danger===false?'pri':'danger'}" data-r="1">${esc(opt.yes||'Delete')}</button></div></div>`;
    document.body.appendChild(el);
    const done=v=>{ document.removeEventListener('keydown',key,true); el.remove(); if(prev&&prev.focus) try{prev.focus();}catch(e){} res(v); };
    const key=e=>{ if(e.key==='Escape'){ e.preventDefault(); e.stopPropagation(); done(false); } else if(e.key==='Tab'){ const b=[...el.querySelectorAll('button')]; const i=b.indexOf(document.activeElement); e.preventDefault(); b[(i+(e.shiftKey?-1:1)+b.length)%b.length].focus(); } };
    document.addEventListener('keydown',key,true);
    el.addEventListener('click',e=>{ if(e.target.classList.contains('dlg-scrim')) done(false); const b=e.target.closest('[data-r]'); if(b) done(b.dataset.r==='1'); });
    el.querySelector('[data-r="0"]').focus();
  });
}

/* ---------- wire up ---------- */
function uiEnhance(root){
  (root||document).querySelectorAll('select:not([data-ui])').forEach(uiSelect);
  (root||document).querySelectorAll('input[type="date"]:not([data-ui])').forEach(uiDate);
  (root||document).querySelectorAll('.field > input.inp[type="number"]:not([data-ui])').forEach(uiNumber);
  document.querySelectorAll('select[data-ui]').forEach(s=>{ if(s._uiPaint) s._uiPaint(); });
}
let uiQ=0; new MutationObserver(()=>{ if(uiQ) return; uiQ=requestAnimationFrame(()=>{ uiQ=0; uiEnhance(); }); }).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('DOMContentLoaded',()=>uiEnhance());
