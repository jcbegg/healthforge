/* ===== HealthForge: custom strength and mobility routines (Move > Routines) =====
   S.routines = [{id, kind:'s'|'t', name, items}]  strength items: [exerciseId, sets, reps]   mobility items: [stretchId, seconds] */
let ER=null;   // routine being edited: {id, kind, name, items, q, cat, joint}
const routineById=id=>(S.routines||[]).find(r=>r.id===id)||(typeof GENTMP!=='undefined'&&GENTMP&&GENTMP.id===id?GENTMP:null);
const routineLabel=id=>{ const r=id&&id.startsWith('my:')?routineById(id.slice(3)):null; return r?r.name:(id==='my:gen'?'Smart routine':null); };
const routineMin=r=>r.kind==='s'?Math.max(1,Math.round(r.items.reduce((a,i)=>a+i[1]*(40+S.settings.restSec),0)/60)):Math.max(1,Math.round(r.items.reduce((a,i)=>a+i[1],0)/60));

function vRoutines(){
  if(ER) return routineEditor();
  const mk=k=>(S.routines||[]).filter(r=>r.kind===k);
  const card=r=>`<div class="li" style="flex-wrap:wrap;align-items:flex-start"><div class="grow" style="min-width:200px"><div class="t">${esc(r.name)} <span class="chip">${r.items.length} ${r.kind==='s'?'exercises':'stretches'}</span> <span class="chip b">about ${routineMin(r)} min</span></div>
    <div class="s">${esc(r.items.map(i=>(r.kind==='s'?EXERCISES:STRETCHES)[i[0]].name).join(', '))}</div></div>
    <div class="row" style="gap:6px"><button class="btn sm pri" data-act="rstart" data-id="${r.id}">${ico('play')} Start</button><button class="btn sm" data-act="redit" data-id="${r.id}">Edit</button><button class="btn sm ghost" data-act="rdup" data-id="${r.id}">Copy</button><button class="icon-btn" style="width:34px;height:34px" data-act="rdel" data-id="${r.id}" aria-label="Delete">${ico('trash')}</button></div></div>`;
  const sec=(k,title,icon,none)=>panel(title,icon,`<div class="row wrap" style="gap:8px"><button class="btn sm pri" data-act="rnew" data-k="${k}">${ico('plus')} New routine</button>${k==='s'&&S.queue.length?`<button class="btn sm ghost" data-act="rfromq" data-k="s">Save my workout list (${S.queue.length})</button>`:''}${k==='t'&&S.stretchQueue.length?`<button class="btn sm ghost" data-act="rfromq" data-k="t">Save my stretch flow (${S.stretchQueue.length})</button>`:''}</div>
    ${mk(k).length?`<div class="list mt12">${mk(k).map(card).join('')}</div>`:`<div class="empty">${emptyArt('list')}<div>${none}</div></div>`}`);
  return `<div class="grid"><div class="c12">${genPanel()}</div><div class="c6">${sec('s','Strength routines','dumbbell','No custom strength routines yet. Pick exercises from the library, set your sets and reps, and save it.')}</div>
    <div class="c6">${sec('t','Mobility routines','move','No custom mobility routines yet. Choose stretches, set the hold time for each, and save the flow.')}</div></div>`;
}

function routineEditor(){
  const isS=ER.kind==='s', lib=isS?EXERCISES:STRETCHES;
  return `<div class="grid"><div class="c7">${panel((ER.id?'Edit ':'New ')+(isS?'strength':'mobility')+' routine','edit',`
    <div class="field"><label>Routine name</label><input class="inp" id="rname" value="${esc(ER.name)}" placeholder="${isS?'e.g. Quick upper body':'e.g. Evening wind-down'}" autocomplete="off"></div>
    <div class="lbl mt16">In this routine <span class="mono mut" id="rsum"></span></div><div id="rlist" class="mt8"></div>
    <div class="row wrap mt16" style="gap:8px"><button class="btn pri" data-act="rsave">Save routine</button>${ER.id?`<button class="btn" data-act="rsave" data-start="1">${ico('play')} Save and start</button>`:''}<button class="btn ghost" data-act="rcancel">Cancel</button>${isS?`<button class="btn sm ghost" data-act="rsuggest">${ico('spark')} Fill with a suggestion</button>`:''}</div>`)}</div>
   <div class="c5">${panel('Add '+(isS?'exercises':'stretches'),'plus',`<input class="inp" id="rsearch" placeholder="Search by name, muscle or equipment" value="${esc(ER.q)}" autocomplete="off">
    <div class="pill-row mt8" id="rcats"></div>${isS?`<label class="row mt8" style="cursor:pointer;gap:10px;font-size:13px;color:var(--mut)"><input type="checkbox" data-act="rjoint" ${ER.joint?'checked':''}> Hide joint cautions</label>`:''}
    <div id="rres" class="list mt8" style="max-height:520px;overflow:auto"></div>`)}</div></div>`;
}
function paintRoutine(){
  if(!ER) return; const isS=ER.kind==='s', lib=isS?EXERCISES:STRETCHES;
  const l=$('#rlist'); if(!l) return;
  l.innerHTML=ER.items.length?`<div class="list">${ER.items.map((it,i)=>{ const x=lib[it[0]]; return `<div class="li ex-card" style="flex-wrap:wrap">${figure(x.fig,{view:'side',pose:0})}<div class="grow" style="min-width:150px"><div class="t">${esc(x.name)}</div>
     <div class="row mt8" style="gap:8px;flex-wrap:wrap">${isS?`<label class="note">Sets <input class="inp" data-rs="${i}" data-f="1" type="number" min="1" max="10" value="${it[1]}" style="width:64px;display:inline-block"></label><label class="note">Reps <input class="inp" data-rs="${i}" data-f="2" value="${esc(String(it[2]))}" style="width:96px;display:inline-block"></label>`:`<label class="note">Hold (sec) <input class="inp" data-rs="${i}" data-f="1" type="number" min="10" max="300" step="5" value="${it[1]}" style="width:84px;display:inline-block"></label>`}</div></div>
     <div class="row" style="gap:4px"><button class="icon-btn" style="width:34px;height:34px" data-act="rmove" data-i="${i}" data-d="-1" aria-label="Move up" ${i?'':'disabled style="opacity:.35;width:34px;height:34px"'}>${ico('chevL').replace('<svg','<svg style="transform:rotate(90deg)"')}</button><button class="icon-btn" style="width:34px;height:34px" data-act="rmove" data-i="${i}" data-d="1" aria-label="Move down" ${i<ER.items.length-1?'':'disabled style="opacity:.35;width:34px;height:34px"'}>${ico('chevR').replace('<svg','<svg style="transform:rotate(90deg)"')}</button><button class="icon-btn" style="width:34px;height:34px" data-act="rrm" data-i="${i}" aria-label="Remove">${ico('close')}</button></div></div>`; }).join('')}</div>`:`<div class="note" style="padding:6px 2px">Nothing added yet. Search on the right and tap Add.</div>`;
  const r={kind:ER.kind,items:ER.items}; $('#rsum').textContent=ER.items.length?' '+ER.items.length+' items, about '+routineMin(r)+' min':'';
  const cats=isS?CATS:AREAS; $('#rcats').innerHTML=`<button class="pill ${ER.cat?'':'on'}" data-act="rcat" data-v="">All</button>`+cats.map(c=>`<button class="pill ${ER.cat===c?'on':''}" data-act="rcat" data-v="${esc(c)}">${c}</button>`).join('');
  paintRRes();
}
let RR=[];
function paintRRes(){
  const r=$('#rres'); if(!r||!ER) return; const isS=ER.kind==='s', q=ER.q.trim().toLowerCase();
  const src=Object.values(isS?EXERCISES:STRETCHES).filter(x=>(!ER.cat||(x.cat||x.area)===ER.cat)&&(!ER.joint||!(x.j||[]).some(v=>v>=3))&&(!q||q.split(/\s+/).every(w=>(x.name+' '+(x.cat||x.area)+' '+x.eq.map(e=>EQ_LABEL[e]||e).join(' ')+' '+(x.cue||'')).toLowerCase().includes(w))));
  RR=src.slice(0,60);
  r.innerHTML=RR.length?RR.map((x,i)=>{ const inn=ER.items.some(it=>it[0]===x.id); return `<div class="li"><div class="grow"><div class="t">${esc(x.name)}</div><div class="s">${esc(x.cat||x.area)} &middot; ${isS?x.sets+' x '+esc(x.reps):x.sec+' sec'}</div></div><button class="btn sm ${inn?'ghost':''}" data-act="radd" data-i="${i}">${inn?'Add again':ico('plus')+' Add'}</button></div>`; }).join('')+(src.length>RR.length?`<div class="note" style="padding:8px 2px">Showing ${RR.length} of ${src.length}. Search to narrow.</div>`:''):`<div class="note" style="padding:8px 2px">No matches.</div>`;
}
const openRoutineEd=()=>{ render(); paintRoutine(); window.scrollTo(0,0); };

Object.assign(ACT,{
  rnew(t){ ER={id:null,kind:t.dataset.k,name:'',items:[],q:'',cat:'',joint:false}; openRoutineEd(); },
  redit(t){ const r=routineById(t.dataset.id); if(!r) return; ER={id:r.id,kind:r.kind,name:r.name,items:r.items.map(i=>i.slice()),q:'',cat:'',joint:false}; openRoutineEd(); },
  rdup(t){ const r=routineById(t.dataset.id); if(!r) return; S.routines.push({...r,id:uid(),name:r.name+' (copy)',items:r.items.map(i=>i.slice())}); touch('Routine copied'); },
  async rdel(t){ const r=routineById(t.dataset.id); if(!r||!await uiConfirm('Sessions you already logged are kept.',{title:'Delete "'+r.name+'"?'})) return; S.routines=S.routines.filter(x=>x.id!==r.id); touch('Routine deleted'); },
  rstart(t){ const r=routineById(t.dataset.id); if(!r) return; r.kind==='s'?strengthStage('my:'+r.id):stretchStage('my:'+r.id); },
  rfromq(t){ const k=t.dataset.k; const items=k==='s'?S.queue.map(id=>[id,EXERCISES[id].sets,EXERCISES[id].reps]):S.stretchQueue.map(id=>[id,STRETCHES[id].sec]); ER={id:null,kind:k,name:'',items,q:'',cat:'',joint:false}; openRoutineEd(); },
  rcancel(){ ER=null; render(); },
  rcat(t){ ER.cat=t.dataset.v; paintRoutine(); },
  rjoint(t){ ER.joint=t.checked; paintRRes(); },
  radd(t){ const x=RR[+t.dataset.i]; if(!x) return; ER.items.push(ER.kind==='s'?[x.id,x.sets,x.reps]:[x.id,x.sec]); paintRoutine(); },
  rrm(t){ ER.items.splice(+t.dataset.i,1); paintRoutine(); },
  rmove(t){ const i=+t.dataset.i, j=i+ +t.dataset.d; if(j<0||j>=ER.items.length) return; const a=ER.items; [a[i],a[j]]=[a[j],a[i]]; paintRoutine(); },
  rsuggest(){ const ids=genWorkout(); ER.items=ids.map(id=>[id,EXERCISES[id].sets,EXERCISES[id].reps]); paintRoutine(); toast('Suggested '+ids.length+' exercises'); },
  rsave(t){
    ER.name=($('#rname').value||'').trim(); if(!ER.name){ toast('Give your routine a name'); return; } if(!ER.items.length){ toast('Add at least one item'); return; }
    const r={id:ER.id||uid(),kind:ER.kind,name:ER.name,items:ER.items.map(i=>i.slice()),t:Date.now()}; S.routines=S.routines||[];
    const i=S.routines.findIndex(x=>x.id===r.id); i<0?S.routines.push(r):S.routines[i]=r; ER=null; touch('Routine saved');
    if(t.dataset.start) r.kind==='s'?strengthStage('my:'+r.id):stretchStage('my:'+r.id); }
});
document.addEventListener('input',e=>{ const t=e.target; if(!ER) return;
  if(t.id==='rsearch'){ ER.q=t.value; paintRRes(); }
  else if(t.id==='rname') ER.name=t.value;
  else if(t.dataset&&t.dataset.rs!=null){ const it=ER.items[+t.dataset.rs]; if(!it) return; const f=+t.dataset.f; it[f]=f===2?t.value:Math.max(1,Math.round(num(t.value)||1)); const s=$('#rsum'); if(s) s.textContent=' '+ER.items.length+' items, about '+routineMin({kind:ER.kind,items:ER.items})+' min'; } });
