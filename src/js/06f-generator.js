/* ===== HealthForge: smart random routine generator (Move > My routines) =====
   Balanced, joint-aware, energy-aware, avoids recently used moves. Result can be started, saved or edited. */
let GENTMP=null;
let GEN={kind:'s',min:20,focus:'full',eq:['bodyweight','dumbbell','kettlebell','medball','bench'],care:true,items:null,notes:[]};
const GFOCI={
  s:[['full','Full body',['Legs','Glutes and hinge','Push','Pull','Core','Carry']],['upper','Upper body',['Push','Pull','Push','Pull','Core']],['lower','Lower body',['Legs','Glutes and hinge','Legs','Glutes and hinge','Core']],
     ['core','Core and carry',['Core','Carry','Core','Core','Carry']],['posture','Posture and back',['Pull','Glutes and hinge','Pull','Core','Push']]],
  t:[['desk','Desk reset',['Neck and shoulders','Chest and arms','Back and spine','Hips','Neck and shoulders','Hips']],['hipsback','Hips and back',['Hips','Back and spine','Hips','Legs','Back and spine','Hips']],
     ['full','Full body',AREAS.slice()],['upper','Upper body',['Neck and shoulders','Chest and arms','Back and spine','Neck and shoulders','Chest and arms']],
     ['wind','Wind down',['Back and spine','Hips','Legs','Back and spine','Hips']],['legs','Legs and hips',['Legs','Hips','Legs','Hips']]]
};
const GMIN={s:[10,20,30,45],t:[5,10,15,20]};
const gFocus=()=>GFOCI[GEN.kind].find(f=>f[0]===GEN.focus)||GFOCI[GEN.kind][0];
const gPick=(arr,w)=>{ const ws=arr.map(w), tot=ws.reduce((a,b)=>a+b,0); let r=Math.random()*tot; for(let i=0;i<arr.length;i++){ r-=ws[i]; if(r<=0) return arr[i]; } return arr[arr.length-1]; };

function genBuild(){
  const isS=GEN.kind==='s', lib=Object.values(isS?EXERCISES:STRETCHES), recent=new Set(S.meta.recentEx||[]);
  const energy=energyOf(TODAY())||2; const pat=gFocus()[2]; const notes=[]; let avoided=0;
  const items=[]; const used=new Set(); const j2=[0,0,0]; const eqSeen={};
  const usable=x=>x.eq.some(e=>GEN.eq.includes(e));
  const cand=cat=>lib.filter(x=>(x.cat||x.area)===cat&&!used.has(x.id)&&usable(x)&&(!isS||(GEN.care?!x.j.some(v=>v>=3)&&!x.j.some((v,i)=>v===2&&j2[i]>=2):true)));
  const sets=energy===1?2:3;
  let n, budget=0;
  if(isS) n=clamp(Math.round(GEN.min*60/(sets*(40+S.settings.restSec))),3,9); else n=30;
  const target=GEN.min*60; let t=0, guard=0;
  while(items.length<n&&guard++<60){
    const cat=pat[items.length%pat.length]; let pool=cand(cat);
    if(!pool.length) pool=lib.filter(x=>!used.has(x.id)&&usable(x)&&(!isS||!GEN.care||(!x.j.some(v=>v>=3)&&!x.j.some((v,i)=>v===2&&j2[i]>=2))));
    if(!pool.length) break;
    const x=gPick(pool,c=>{ let w=1; if(recent.has(c.id)){ w*=.2; } if(isS&&c.eq.every(e=>eqSeen[e])) w*=.7; return w; });
    if(recent.has(x.id)) avoided--; used.add(x.id); x.eq.forEach(e=>{ if(GEN.eq.includes(e)) eqSeen[e]=1; });
    if(isS){ x.j.forEach((v,i)=>{ if(v===2) j2[i]++; }); items.push([x.id,energy===1?Math.min(2,x.sets):x.sets,x.reps]); }
    else { const sec=x.sec; if(items.length>=3&&t+sec>target+10) break; t+=sec; items.push([x.id,sec]); if(t>=target-10) break; }
  }
  const ord=isS?CATS:AREAS; items.sort((a,b)=>{ const A=(isS?EXERCISES:STRETCHES)[a[0]], B=(isS?EXERCISES:STRETCHES)[b[0]]; return ord.indexOf(A.cat||A.area)-ord.indexOf(B.cat||B.area); });
  // reasons shown to the user
  notes.push(gFocus()[1]+', about '+routineMin({kind:GEN.kind,items})+' min');
  if(isS){ const cs=[...new Set(items.map(i=>EXERCISES[i[0]].cat))]; notes.push('Covers '+cs.length+' movement groups: '+cs.map(c=>c.toLowerCase()).join(', ')); if(GEN.care) notes.push('Skipped moves with a joint caution, and kept moves needing extra care to two per joint'); if(energy===1) notes.push('Lighter volume (2 sets) because you logged a low-energy day'); }
  else { const as=[...new Set(items.map(i=>STRETCHES[i[0]].area))]; notes.push('Targets '+as.map(c=>c.toLowerCase()).join(', ')); }
  if(recent.size) notes.push('Favours moves you have not used lately');
  GEN.items=items; GEN.notes=notes;
}
function genTemp(){ const name='Smart '+(GEN.kind==='s'?'strength':'mobility')+': '+gFocus()[1]+' ('+GEN.min+' min)'; return {id:'gen',kind:GEN.kind,name,items:GEN.items.map(i=>i.slice())}; }
function genRemember(){ S.meta.recentEx=[...GEN.items.map(i=>i[0]),...(S.meta.recentEx||[])].filter((x,i,a)=>a.indexOf(x)===i).slice(0,40); }

function genPanel(){
  const isS=GEN.kind==='s', lib=isS?EXERCISES:STRETCHES;
  const foci=GFOCI[GEN.kind];
  const body=`<p class="mut">Pick a goal and time. The generator builds a balanced routine at random, respects your joints and energy, and avoids what you did recently. Reroll until it looks right.</p>
   <div class="pill-row mt12">${[['s','Strength'],['t','Mobility']].map(o=>`<button class="pill ${GEN.kind===o[0]?'on':''}" data-act="gkind" data-v="${o[0]}">${o[1]}</button>`).join('')}</div>
   <div class="lbl mt16">Length</div><div class="pill-row mt8">${GMIN[GEN.kind].map(m=>`<button class="pill ${GEN.min===m?'on':''}" data-act="gmin" data-v="${m}">${m} min</button>`).join('')}</div>
   <div class="lbl mt12">Focus</div><div class="pill-row mt8">${foci.map(f=>`<button class="pill ${GEN.focus===f[0]?'on':''}" data-act="gfocus" data-v="${f[0]}">${f[1]}</button>`).join('')}</div>
   ${isS?`<div class="lbl mt12">Equipment you want to use</div><div class="pill-row mt8">${['bodyweight','dumbbell','kettlebell','medball','bench'].map(e=>`<button class="pill ${GEN.eq.includes(e)?'on':''}" data-act="geq" data-v="${e}">${EQ_LABEL[e]}</button>`).join('')}</div>
    <label class="row mt12" style="cursor:pointer;gap:10px;font-size:13.5px;color:var(--mut)"><input type="checkbox" data-act="gcare" ${GEN.care?'checked':''}> Joint-friendly (skip knee, back and shoulder cautions)</label>`:''}
   <div class="row wrap mt16" style="gap:8px"><button class="btn pri" data-act="ggen">${ico('spark')} ${GEN.items?'Reroll':'Generate routine'}</button></div>
   ${GEN.items?`<hr class="sep"><div class="row between wrap" style="gap:8px"><div class="lbl">Your routine <span class="mono mut">${GEN.items.length} items, about ${routineMin({kind:GEN.kind,items:GEN.items})} min</span></div></div>
    <div class="list mt8">${GEN.items.map((it,i)=>{ const x=lib[it[0]]; return `<div class="li ex-card" style="flex-wrap:wrap">${figure(x.fig,{view:'side',pose:0})}<div class="grow" style="min-width:150px"><div class="t">${esc(x.name)}</div><div class="s mono">${isS?it[1]+' sets &middot; '+esc(String(it[2])):it[1]+' sec'} &middot; ${esc(x.cat||x.area)}</div>${isS?`<div class="s" style="margin-top:3px">${x.eq.map(e=>EQ_LABEL[e]).join(', ')}</div>`:''}</div><button class="btn sm ghost" data-act="gswap" data-i="${i}">Swap</button></div>`; }).join('')}</div>
    <div class="note mt12">${GEN.notes.map(n=>'&bull; '+esc(n)).join('<br>')}</div>
    <div class="row wrap mt16" style="gap:8px"><button class="btn pri" data-act="gstart">${ico('play')} Start now</button><button class="btn" data-act="gsave">Save to my routines</button><button class="btn ghost" data-act="gedit">Edit first</button></div>`:''}`;
  return panel('Smart routine generator','spark',body,'glow');
}

Object.assign(ACT,{
  gkind(t){ GEN.kind=t.dataset.v; GEN.min=GEN.kind==='s'?20:10; GEN.focus=GFOCI[GEN.kind][0][0]; GEN.items=null; render(); },
  gmin(t){ GEN.min=+t.dataset.v; GEN.items=null; render(); },
  gfocus(t){ GEN.focus=t.dataset.v; GEN.items=null; render(); },
  geq(t){ const e=t.dataset.v, i=GEN.eq.indexOf(e); if(i<0) GEN.eq.push(e); else if(GEN.eq.length>1) GEN.eq.splice(i,1); GEN.items=null; render(); },
  gcare(t){ GEN.care=t.checked; GEN.items=null; render(); },
  ggen(){ genBuild(); render(); },
  gswap(t){ const i=+t.dataset.i, isS=GEN.kind==='s', lib=isS?EXERCISES:STRETCHES, cur=lib[GEN.items[i][0]], inR=new Set(GEN.items.map(x=>x[0]));
    const pool=Object.values(lib).filter(x=>(x.cat||x.area)===(cur.cat||cur.area)&&!inR.has(x.id)&&x.eq.some(e=>(isS?GEN.eq:['bodyweight','bench']).includes(e))&&(!isS||!GEN.care||!x.j.some(v=>v>=3)));
    if(!pool.length){ toast('No other options for this slot'); return; } const x=pool[Math.floor(Math.random()*pool.length)];
    GEN.items[i]=isS?[x.id,x.sets,x.reps]:[x.id,x.sec]; render(); },
  gstart(){ genRemember(); GENTMP=genTemp(); save(); GEN.kind==='s'?strengthStage('my:gen'):stretchStage('my:gen'); },
  gsave(){ genRemember(); const r=genTemp(); r.id=uid(); S.routines.push(r); touch('Saved to your routines'); },
  gedit(){ genRemember(); const t=genTemp(); ER={id:null,kind:t.kind,name:t.name,items:t.items,q:'',cat:'',joint:false}; render(); paintRoutine(); window.scrollTo(0,0); }
});
