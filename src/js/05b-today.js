/* ===== HealthForge: Today helpers: next action, evening window, week rhythm, daily insight ===== */
const WIN_END=22*60+30;
const winStartMin=()=>{ const m=/^(\d{1,2}):(\d{2})$/.exec(S.settings.recharge||'17:30'); return m?(+m[1])*60+(+m[2]):17*60+30; };
const fmtClock=n=>{ const h=Math.floor(n/60), m=n%60, ap=h>=12?'pm':'am'; return ((h%12)||12)+(m?':'+String(m).padStart(2,'0'):'')+' '+ap; };
const fmtSpan=n=>{ const h=Math.floor(n/60), m=n%60; return h?(h+' h'+(m?' '+m+' min':'')):(m+' min'); };
function eveState(){
  const now=new Date(), mins=now.getHours()*60+now.getMinutes(), ws=winStartMin();
  if(mins>=ws&&mins<WIN_END) return {s:'active',mins,ws};
  if(mins>=ws-180&&mins<ws) return {s:'near',mins,ws,left:ws-mins};
  return {s:mins>=WIN_END?'late':'far',mins,ws};
}
const NX={key:'',n:0};

/* ordered list of sensible next actions for this moment; the first is shown, "Not now" moves down the list */
function nextCandidates(c){
  const m=t=>c.missions.find(x=>x.title.startsWith(t)), open=t=>{ const x=m(t); return !!x&&!x.done; };
  const mb=t=>m(t).btn.replace('btn sm','btn pri'); const out=[]; const add=(title,why,btn)=>{ if(!out.some(o=>o.title===title)) out.push({title,why,btn}); };
  const med=c.medMin, hr=c.hr, ev=c.ev, ft=c.ft, T=c.T, pl=c.pl;
  const offload=`<button class="btn pri" data-act="med" data-id="offload">${ico('play')} Start</button>`;
  const winWalk=`<button class="btn pri" data-act="walk" data-m="10">${ico('play')} Start 10 min</button>`;
  const windStretch=`<button class="btn pri" data-act="stretch" data-id="wind">${ico('play')} Start</button>`;
  const logFood=`<button class="btn pri" data-act="goto" data-v="fuel">${ico('plus')} Log food</button>`;
  if(ev.s==='active'){
    if(med<3) add('Work offload meditation','Your evening window is open. Put the day down first, then decide what to eat.',offload);
    if(!c.eatenSinceWin) add('Eat dinner on purpose','Sit down with a plan before the snacks find you.',`<button class="btn pri" data-act="sub" data-k="fuel" data-v="meals" data-go="fuel">Dinner ideas</button>`);
    if(walkMinDay(c.k)<pl.walk) add('Post-dinner walk','Ten easy minutes steadies blood sugar and breaks the snack habit.',winWalk);
    if(open('Mobility')) add('Wind-down stretch','Gentle and short. It tells your body the workday is over.',windStretch);
    if(open('Water')) add('A glass of water','Thirst often passes for evening hunger.',mb('Water'));
  } else if(ev.s==='near'){
    if(open('Protein target')&&ft.protein<T.protein*.7) add('Get protein in now','Protein before the evening makes the later hours easier to manage.',logFood);
    if(open('Walk')) add('Walk before the evening','Move now, while there is still energy to spare.',mb('Walk'));
    if(open('Water')) add('A glass of water','A small head start on today.',mb('Water'));
    if(open('Mobility')) add('Mobility','A short flow before the window opens.',mb('Mobility'));
    if(med<3) add('Decompress early','Your window opens in '+fmtSpan(ev.left)+'. A five-minute offload now means you arrive calmer.',offload);
  } else if(ev.s==='late'){
    if(open('Mobility')) add('Wind-down stretch','A few minutes of gentle stretching before bed.',windStretch);
    if(med<3) add('Settle meditation','A short sit to close the day.',`<button class="btn pri" data-act="med" data-id="settle">${ico('play')} Start</button>`);
  } else if(hr<11){
    if(!c.d.weight) add('Weigh-in','Mornings are best, before food and drink. It takes ten seconds.',mb('Weigh-in'));
    if(open('Walk')) add('Walk','Morning movement sets the tone and lowers stress.',mb('Walk'));
    if(open('Mobility')) add('Mobility','Loosen the hips and back before the day sits you down.',mb('Mobility'));
    if(open('Strength')) add('Strength','You have a lifting day. Early is easiest.',mb('Strength'));
  } else if(hr<15){
    if(ft.n===0&&hr>=12) add('Log your lunch','Estimates are fine. Logging keeps the afternoon honest.',logFood);
    if(open('Strength')) add('Strength','Midday is a good window for your lifting session.',mb('Strength'));
    if(open('Walk')) add('Walk','A walk now will clear the morning from your head.',mb('Walk'));
    if(open('Protein target')&&ft.protein<T.protein*.5) add('Protein check','You are under half your protein for the day.',logFood);
  } else {
    if(open('Protein target')&&ft.protein<T.protein*.7) add('Protein check','Land protein before the evening window, and the evening gets easier.',logFood);
    if(open('Walk')) add('Walk','An afternoon walk is the best preparation for tonight.',mb('Walk'));
    if(open('Mobility')) add('Mobility','Shake off the desk before the day ends.',mb('Mobility'));
    if(open('Strength')) add('Strength','Still time for your session.',mb('Strength'));
  }
  (ev.s==='late'?['Mobility','Meditate']:ev.s==='active'?['Mobility','Meditate','Water','Protein target']:['Walk','Mobility','Strength','Meditate','Protein target','Water','Weigh-in']).forEach(t=>{ if(open(t)) add(m(t).title.replace(' (optional mini)',''),m(t).sub,mb(t)); });
  return out;
}
function walkMinDay(k){ return walkMin(k); }

function nextCardHtml(c){
  const list=nextCandidates(c); const key=c.k+':'+c.hr; if(NX.key!==key){ NX.key=key; NX.n=0; }
  if(!list.length) return `<section class="next"><div class="donecheck"><svg viewBox="0 0 52 52" width="54" height="54"><circle class="dc-c" cx="26" cy="26" r="23" fill="none" stroke="var(--ok)" stroke-width="2.5"/><path class="dc-p" pathLength="1" d="M15 27l8 8 14-16" fill="none" stroke="var(--ok)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="lbl">All set</div><h2 class="next-t">Today is covered</h2><p class="mut">Everything on the plan is done. Anything more is a bonus, and rest counts too.</p></section>`;
  const i=NX.n%list.length, x=list[i];
  return `<section class="next"><div class="row between"><div class="lbl">Next${c.ev.s==='active'?' &middot; evening window':''}</div><span class="tag mono dim" style="font-size:12px">${c.doneN} of ${c.total} done</span></div>
    <h2 class="next-t">${esc(x.title)}</h2><p class="mut">${esc(x.why)}</p>
    <div class="row wrap" style="gap:14px;margin-top:14px">${x.btn}${list.length>1?`<button class="lnk" data-act="nextskip">Not now</button>`:''}</div></section>`;
}

/* ---- evening window ---- */
function planMeal(slot){ const id=(S.plan[slot]||[])[0]; return (id&&MEALS[slot]&&MEALS[slot].find(x=>x.id===id))||MEALS[slot][0]; }
function eveningCardHtml(c){
  const ev=c.ev; if(ev.s!=='near'&&ev.s!=='active') return '';
  const dn=planMeal('d'), sn=planMeal('e'), medDone=c.medMin>=3;
  const head=ev.s==='near'?`<div class="big" style="font-size:30px">Opens in ${fmtSpan(ev.left)}</div><div class="note mt8">Your evening window starts at ${fmtClock(ev.ws)}. A few small choices now make it easy.</div>`
    :`<div class="big" style="font-size:30px">The window is open</div><div class="note mt8">Until ${fmtClock(WIN_END)}. Decompress first, then eat on purpose.</div>`;
  const row=(t,s,b)=>`<div class="li"><div class="grow"><div class="t">${t}</div><div class="s">${s}</div></div>${b}</div>`;
  return `<div class="c12">${panel('Evening window','',head+`<div class="list mt16">
    ${row('Decompress',medDone?'Done today':'Work offload meditation, 5 min',medDone?'<span class="chip ok">Done</span>':`<button class="btn sm" data-act="med" data-id="offload">Start</button>`)}
    ${row('Dinner: '+esc(dn.n),dn.k+' kcal &middot; '+dn.p+' g protein',`<button class="btn sm" data-act="mealadd" data-m="d" data-id="${dn.id}">Log</button>`)}
    ${row('If you want a snack: '+esc(sn.n),sn.k+' kcal &middot; '+sn.p+' g protein',`<button class="btn sm" data-act="mealadd" data-m="e" data-id="${sn.id}">Log</button>`)}
    ${row('Move','Post-dinner walk, 10 min. Steadies blood sugar.',`<button class="btn sm" data-act="walk" data-m="10">Start</button>`)}
    ${row('If an urge hits','Five minutes first, then you decide.',`<button class="btn sm" data-act="urge">Urge interrupter</button>`)}</div>`)}</div>`;
}

/* ---- week rhythm ---- */
function dayProgress(k){
  const pl=dayPlan(k), d=G(k), T=targets(), ft=foodTotals(k);
  const items=[walkMin(k)>=pl.walk, stretchMin(k)>=Math.max(2,pl.stretch-2), (pl.strDay||pl.energy===3)?strengthN(k)>=1:null, medMin(k)>=Math.min(pl.med,3), ft.protein>=T.protein*.9, (d.water||0)>=pl.water].filter(x=>x!==null);
  const done=items.filter(Boolean).length; return {done,total:items.length,pct:items.length?done/items.length:0};
}
function weekStripHtml(){
  const T0=TODAY(), days=[]; for(let i=6;i>=0;i--) days.push(addDays(T0,-i));
  const L=['S','M','T','W','T','F','S']; const prog=days.map(dayProgress); const good=prog.filter(p=>p.pct>=.6).length, st=streak();
  return panel('This week','',`<div class="wk">${days.map((k,i)=>{ const p=prog[i], t=k===T0; return `<div class="wkd${t?' today':''}"><div class="wkb" title="${fmtD(k)}: ${p.done} of ${p.total}"><i style="height:${Math.round(p.pct*100)}%"></i></div><span class="wkl">${L[pd(k).getDay()]}</span></div>`; }).join('')}</div>
    <div class="row between wrap mt12"><span class="note">${good} of 7 days with most of the plan done</span><span class="note">Streak <b class="mono">${st}</b> ${st===1?'day':'days'}</span></div>`,'',pd(T0).toLocaleDateString(undefined,{month:'short',day:'numeric'}));
}

/* ---- one insight a day ---- */
function insightHtml(){
  let real=[]; try{ real=insights().filter(x=>!/^(Log |After about)/.test(x[1])); }catch(e){}
  if(!real.length) return panel('Insight','',`<p class="mut">Patterns about you appear here once there is a little more data: sleep, energy and eating, and when urges hit. Keep logging, and keep it light.</p>`);
  const x=real[dayNum(TODAY())%real.length];
  return panel('Insight','',`<div class="t" style="font-size:17px;font-weight:600">${esc(x[0])}</div><p class="mut mt8" style="font-size:15px">${esc(x[1])}</p>`,'','From your data');
}
