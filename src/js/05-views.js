/* ===== HealthForge: views ===== */
let view='today', fuelDay=TODAY(), progRange=90;
const sub={fuel:'log',move:'walk',mind:'sit'};
const panel=(title,icon,body,cls='',tag='')=>`<section class="panel ${cls}"><div class="ph"><h3>${title}</h3>${tag?`<span class="tag">${tag}</span>`:''}</div>${body}</section>`;
const segCtl=(key,opts,cur)=>`<div class="seg" role="tablist">${opts.map(o=>`<button class="${o[0]===cur?'on':''}" data-act="sub" data-k="${key}" data-v="${o[0]}">${o[1]}</button>`).join('')}</div>`;
const delta=(v,good)=>{ const c=Math.abs(v)<0.05?'flat':(good?'up':'warnc'); return `<span class="${c}">${v>0?'+':''}${r1(v)}</span>`; };
function greeting(){ const h=new Date().getHours(); return h<12?'Good morning':h<18?'Good afternoon':'Good evening'; }
function dayN(){ return Math.max(1,dayNum(TODAY())-dayNum(S.profile.startDate)+1); }

/* ---------- TODAY ---------- */
function missionRow(m){
  const pct=clamp(m.cur/m.goal,0,1);
  return `<div class="mission ${m.done?'done':''}"><div class="ck">${ico('check')}</div><div class="grow"><div class="t">${m.title}</div><div class="s">${m.sub}</div><div class="mbar"><i style="width:${Math.round(pct*100)}%"></i></div></div>${m.btn||''}</div>`;
}
function vToday(){
  const k=TODAY(), d=G(k), pl=dayPlan(k), T=targets(), ft=foodTotals(k), ph=phaseInfo(), lv=levelInfo(), hr=new Date().getHours();
  const stretchId = pl.energy===1?'mini':hr>=19?'wind':pl.energy===2?'desk':'backhip';
  const medId = pl.energy===1?'settle':hr>=16?'offload':'bodyscan5';
  const nr=nextRoutine();
  let checkin='';
  if(!d.energy){
    checkin=`<div class="c12">${panel('How is your energy right now?','',`<p class="mut" style="margin-bottom:16px">Today's plan scales to match. There is no wrong answer.</p>
      <div class="choice" style="grid-template-columns:repeat(3,1fr)">${ENERGY.map(e=>`<button class="opt" data-act="energy" data-v="${e.id}">${ico(e.icon)}<b>${e.name}</b><small>${e.sub}</small></button>`).join('')}</div>`)}</div>`;
  }
  const missions=[
    {title:'Walk',sub:`${walkMin(k)} of ${pl.walk} min`,cur:walkMin(k),goal:pl.walk,done:walkMin(k)>=pl.walk,btn:`<button class="btn sm" data-act="walk" data-m="${pl.walk}">${ico('play')} Start</button>`},
    {title:'Mobility',sub:`${stretchMin(k)} of ${pl.stretch} min`,cur:stretchMin(k),goal:pl.stretch,done:stretchMin(k)>=Math.max(2,pl.stretch-2),btn:`<button class="btn sm" data-act="stretch" data-id="${stretchId}">${ico('play')} Start</button>`},
    pl.strDay||pl.energy===3?{title:'Strength',sub:strengthN(k)?'Session complete':`${nr.name}, about 18 min`,cur:strengthN(k),goal:1,done:strengthN(k)>=1,btn:`<button class="btn sm" data-act="strength" data-r="${nr.id}">${ico('play')} Start</button>`}
      :{title:'Strength (optional mini)',sub:strengthN(k)?'Session complete':'8-minute minimum version',cur:strengthN(k),goal:1,done:strengthN(k)>=1,btn:`<button class="btn sm" data-act="strength" data-r="${nr.id}" data-mini="1">${ico('play')} Mini</button>`},
    {title:'Meditate',sub:`${medMin(k)} of ${pl.med} min`,cur:medMin(k),goal:Math.min(pl.med,3),done:medMin(k)>=Math.min(pl.med,3),btn:`<button class="btn sm" data-act="med" data-id="${medId}">${ico('play')} Start</button>`},
    {title:'Protein target',sub:`${Math.round(ft.protein)} of ${T.protein} g`,cur:ft.protein,goal:T.protein*.9,done:ft.protein>=T.protein*.9,btn:`<button class="btn sm" data-act="goto" data-v="fuel">${ico('plus')} Log food</button>`},
    {title:'Water',sub:`${d.water||0} of ${pl.water} glasses`,cur:d.water||0,goal:pl.water,done:(d.water||0)>=pl.water,btn:`<button class="btn sm" data-act="water">${ico('plus')} 1 glass</button>`},
    {title:'Weigh-in',sub:d.weight?d.weight+' lb logged':'Optional, morning is best',cur:d.weight?1:0,goal:1,done:!!d.weight,btn:`<button class="btn sm" data-act="log" data-kind="weight">${ico('scale')} Log</button>`}
  ];
  const todo=missions.filter(m=>!m.done), done=missions.filter(m=>m.done);
  const row=m=>missionRow(m);
  const evening=hr>=15, lastW=lastRaw(), g=goalPlan();
  const left=Math.round(Math.abs(T.kcal-ft.kcal)), over=ft.kcal>T.kcal;
  const strDone=(G(k).strength||[]).reduce((a,x)=>a+(x.min||0),0), moveMin=walkMin(k)+stretchMin(k)+strDone, movePlan=pl.walk+pl.stretch+((pl.strDay||pl.energy===3)?18:0), movePct=movePlan?moveMin/movePlan:0;
  const ev=eveState(); const dayStart=new Date().setHours(0,0,0,0);
  const eatenSinceWin=(d.food||[]).some(f=>f.t>=dayStart&&(new Date(f.t).getHours()*60+new Date(f.t).getMinutes())>=ev.ws);
  const ctx={k,d,pl,T,ft,hr,ev,missions,medMin:medMin(k),eatenSinceWin,doneN:done.length,total:missions.length};
  const nextCard=d.energy?`<div class="c12">${nextCardHtml(ctx)}</div>`:''; const eveTop=eveningCardHtml(ctx);
  const stale=(Date.now()-(S.meta.lastBackup||S.meta.created))>14*864e5 && Object.keys(S.days).length>=7;
  const hs=(label,val,of,pct,cls)=>`<div class="hs"><div class="lbl"><i class="hsd ${cls||''}"></i>${label}</div><div class="row"><div class="v">${val}<small>${of}</small></div></div><div class="bar"><i class="${cls||''}" style="width:${Math.round(clamp(pct,0,1)*100)}%"></i></div></div>`;
  return `<div class="grid">
    ${stale?`<div class="c12"><div class="banner" style="margin:0">${ico('info').replace('<svg','<svg width="20" height="20"')}<div class="grow">Your data lives only in this browser and has not been backed up in over two weeks.</div><button class="btn sm" data-act="exportjson">Back up now</button></div></div>`:''}
    ${checkin||nextCard}
    ${eveTop}
    <div class="c12"><section class="hero">
      ${activityRings([{pct:ft.kcal/T.kcal,c1:over?'#f3b94f':'#4ea3ff',c2:over?'#ffd990':'#27d3ee'},{pct:ft.protein/T.protein,c1:'#9d8cff',c2:'#c9bfff'},{pct:movePct,c1:'#3fdba5',c2:'#9bf2cf'}],216,`<div class="mono ctr-n">${cu(left)}</div><div class="lbl" style="margin-top:4px">${over?'kcal over':'kcal left'}</div>`)}
      <div class="hero-stats">
        ${hs('Eaten',cu(Math.round(ft.kcal)),'of '+T.kcal+' kcal',ft.kcal/T.kcal,'c')}
        ${hs('Protein',cu(Math.round(ft.protein)),'of '+T.protein+' g',ft.protein/T.protein,'v')}
        ${hs('Movement',cu(moveMin),'of '+movePlan+' min',movePct,'g')}
      </div></section>
      <div class="row wrap mt16" style="gap:10px"><button class="btn pri" data-act="goto" data-v="fuel">${ico('plus')} Add food</button><button class="btn ghost" data-act="sub" data-k="fuel" data-v="meals" data-go="fuel">Meal ideas</button></div>
      ${ft.n?macroBreak(ft):''}</div>
    <div class="c12">${panel("Today's plan",'',(todo.length?todo.map((m,i)=>row(m,i===0)).join(''):`<p class="mut">Everything is complete. Anything more is a bonus.</p>`)+
      (d.energy?`<div class="row between wrap mt12"><span class="note">${ENERGY[d.energy-1].name} energy day. ${d.energy===1?'The minimum counts fully.':'Done is better than perfect.'}</span><button class="lnk" data-act="energy" data-v="0">Change</button></div>`:''),'',`${done.length} of ${missions.length} done`)}
      ${done.length?`<details class="acc mt12"><summary><span class="note">Completed today (${done.length})</span></summary><div class="in">${done.map(m=>missionRow(m)).join('')}</div></details>`:''}</div>
    <div class="c12">${weekStripHtml()}</div>
    <div class="c12">${panel('Trend','',`<div class="row between wrap" style="gap:20px;align-items:flex-end"><div class="stat"><div class="big">${r1(ph.w)}<small class="mut" style="font-size:15px;letter-spacing:0"> lb</small></div><div class="d"><span class="chip ${g.status==='behind'?'w':'ok'}" style="margin:6px 0">${{ahead:'Ahead of plan',on:'On track',behind:'Behind plan',done:'Goal reached'}[g.status]}</span><br><span class="mut">Trend ${ph.lost>=0?'down':'up'} <b>${r1(Math.abs(ph.lost))}</b> lb since start</span>${ph.raw!=null?`<br><span class="mut">Scale ${ph.raw} lb, ${ph.rawLost>=0?'down':'up'} <b>${r1(Math.abs(ph.rawLost))}</b> from your start</span>`:''}</div></div>
        <div>${sparkline(trendSeries().slice(-30).map(x=>x.t),'#27d3ee',150,56)}</div></div>
        <div class="bar" style="height:5px;margin-top:20px"><i style="width:${Math.round(ph.pct1*100)}%"></i></div><div class="row between note mt8"><span>First 20 lb: ${r1(Math.min(20,Math.max(0,ph.lost)))} of 20</span><span class="mono">${ph.toP1>0?'ETA '+fmtD(ph.p1Date):'Reached'}</span></div>`)}</div>
    <div class="c12">${insightHtml()}</div>
    ${eveTop?'':`<div class="c12">${panel(evening?'Evening window':'Evening plan','',`<p class="mut">${evening?'The after-work hours are your high-risk window. Decompress first, then eat on purpose.':'Evenings are where stress eating tends to hit. A plan helps before it does.'}</p>
      <div class="list mt8"><div class="li"><div class="grow"><div class="t">Work offload meditation</div><div class="s">5 min &middot; leave the day on the shelf</div></div><button class="btn sm" data-act="med" data-id="offload">Start</button></div>
      <div class="li"><div class="grow"><div class="t">Post-dinner walk</div><div class="s">10 min &middot; steadies blood sugar, breaks the snack habit</div></div><button class="btn sm" data-act="walk" data-m="10">Start</button></div></div>`)}</div>`}
    <div class="c12">${panel('Rank','',`<div class="row gap16">${emblem(lv.lv,60)}<div class="grow"><div class="row between"><b style="font-size:17px">${lv.name}</b><span class="mono mut">Lv ${lv.lv}</span></div><div class="bar"><i style="width:${Math.round(lv.pct*100)}%"></i></div><div class="note mt8">${lv.xp} XP &middot; ${lv.next} to next &middot; streak <b class="mono">${streak()}</b> days</div></div></div>`)}</div>
    <div class="c12"><div class="quick"><span class="lbl">Quick log</span>
      <button class="lnk" data-act="log" data-kind="sleep">Sleep</button><button class="lnk" data-act="log" data-kind="waist">Waist</button><button class="lnk" data-act="log" data-kind="bp">BP and pulse</button><button class="lnk" data-act="log" data-kind="mood">Mood</button></div></div>
  </div>`;
}

/* ---------- FUEL ---------- */
function mealOfNow(){ const h=new Date().getHours(); return h<10?'b':h<14?'l':h<16?'s':h<20?'d':'e'; }
function vFuel(){
  const T=targets(); const s=sub.fuel;
  let body='';
  if(s==='log'){
    const k=fuelDay, d=G(k), ft=foodTotals(k), food=d.food||[];
    const groups=['b','l','d','s','e'].map(m=>({m,items:food.filter(f=>(f.meal||'s')===m)})).filter(g=>g.items.length);
    const over=ft.kcal>T.kcal, left=Math.round(Math.abs(T.kcal-ft.kcal));
    const fh=(label,val,of,pct,cls)=>`<div class="hs"><div class="lbl"><i class="hsd ${cls||''}"></i>${label}</div><div class="row"><div class="v">${val}<small>${of}</small></div></div><div class="bar"><i class="${cls||''}" style="width:${Math.round(clamp(pct,0,1)*100)}%"></i></div></div>`;
    body=`<div class="grid"><div class="c12"><div class="row between" style="margin-bottom:22px"><button class="icon-btn" data-act="fday" data-v="-1" aria-label="Previous day">${ico('chevL')}</button><b>${k===TODAY()?'Today':fmtDL(k)}</b><button class="icon-btn" data-act="fday" data-v="1" aria-label="Next day" ${k>=TODAY()?'disabled style="opacity:.3"':''}>${ico('chevR')}</button></div>
      <section class="hero">${activityRings([{pct:ft.kcal/T.kcal,c1:over?'#f3b94f':'#4ea3ff',c2:over?'#ffd990':'#27d3ee'},{pct:ft.protein/T.protein,c1:'#9d8cff',c2:'#c9bfff'}],184,`<div class="mono ctr-n" style="font-size:34px">${cu(left)}</div><div class="lbl" style="margin-top:4px">${over?'kcal over':'kcal left'}</div>`)}
        <div class="hero-stats">${fh('Eaten',cu(Math.round(ft.kcal)),'of '+T.kcal+' kcal',ft.kcal/T.kcal,'c')}${fh('Protein',cu(Math.round(ft.protein)),'of '+T.protein+' g',ft.protein/T.protein,'v')}</div></section>
      ${macroBreak(ft)}<p class="note mt16">Target ${T.kcal} kcal comes from an estimated daily burn of ${T.tdee} minus ${T.deficit}. It recalculates as your trend weight drops.</p></div>
    <div class="c12">${panel('Add food','',`${myMealPills()}${S.favs.length?`<div class="lbl mt16">Favorites</div><div class="pill-row mt8">${S.favs.map((f,i)=>`<span class="pill" style="display:inline-flex;gap:8px;align-items:center"><span data-act="favadd" data-i="${i}" style="cursor:pointer">${esc(f.name)} <span class="mono dim">${f.kcal}</span></span><span data-act="favdel" data-i="${i}" style="cursor:pointer;color:var(--dim)" title="Remove">&times;</span></span>`).join('')}</div>`:''}
      <form data-form="food" class="grid" style="gap:12px;grid-template-columns:repeat(6,minmax(0,1fr));${myMealPills()||S.favs.length?'margin-top:22px':''}">
        <div class="field" style="grid-column:span 6"><label>What did you eat</label><input class="inp" name="name" placeholder="e.g. Chicken rice bowl" required autocomplete="off"></div>
        <div class="field" style="grid-column:span 2"><label>Calories</label><input class="inp" name="kcal" type="number" inputmode="numeric" min="0" max="3000" required></div>
        <div class="field" style="grid-column:span 2"><label>Protein (g)</label><input class="inp" name="protein" type="number" inputmode="numeric" min="0" max="300" value="0"></div>
        <div class="field" style="grid-column:span 2"><label>Meal</label><select class="inp" name="meal">${Object.entries(MEAL_LABELS).map(([m,l])=>`<option value="${m}" ${m===mealOfNow()?'selected':''}>${l}</option>`).join('')}</select></div>
        <div class="row between wrap" style="grid-column:span 6;gap:14px"><label style="display:flex;gap:8px;align-items:center;font-size:14px;color:var(--mut)"><input type="checkbox" name="fav"> Save as favorite</label><button class="btn pri" type="submit">${ico('plus')} Add to log</button></div></form>
      <div class="quick mt16"><button class="lnk" data-act="bnew">Build a meal from ingredients</button><button class="lnk" data-act="ingmgr">Log a single ingredient</button></div>`)}</div>
    <div class="c12">${panel('Log','',food.length?groups.map(g=>`<div class="lbl" style="margin:14px 0 2px">${MEAL_LABELS[g.m]}</div><div class="list">${g.items.map(f=>`<div class="li"><div class="grow"><div class="t">${esc(f.name)}</div><div class="s mono">${f.kcal} kcal &middot; ${f.protein||0} g protein${f.carbs!=null?' &middot; '+f.carbs+' g carbs &middot; '+f.fat+' g fat':''}</div>${f.ing?`<div class="s">${esc(f.ing.map(i=>i.n+' x'+fmtQ(i.q)).join(', '))}</div>`:''}</div><button class="icon-btn" data-act="itemedit" data-t="food" data-k="${k}" data-i="${food.indexOf(f)}" aria-label="Edit">${ico('edit')}</button><button class="icon-btn" data-act="fooddel" data-id="${f.id}" aria-label="Delete">${ico('trash')}</button></div>`).join('')}</div>`).join(''):`<div class="empty">${emptyArt('list')}<div>Nothing logged ${k===TODAY()?'yet today':'this day'}. Estimates are fine, consistency matters more than precision.</div></div>`)}</div></div>`;
  } else if(s==='meals'){
    body=`<div class="grid"><div class="c12">${panel('Built around you','leaf',`<div class="pill-row"><span class="chip b">No red meat</span><span class="chip b">Low added sugar</span><span class="chip b">Minimal eggs</span><span class="chip b">No leafy salads</span><span class="chip b">Assemble or microwave</span></div><p class="note mt12">A small rotation you can repeat. Repeating the same few meals removes decisions, which saves mental energy. Tap <b>Plan</b> to add a meal to this week's grocery list.</p>`)}</div>
    <div class="c12">${myMealsPanel()}</div>
    ${Object.keys(MEALS).map(m=>`<div class="c6 t6">${panel(MEAL_LABELS[m]+(m==='e'?' (stress-hour swaps)':''),'',MEALS[m].map(x=>`<div class="li"><div class="grow"><div class="t">${esc(x.n)}</div><div class="s">${esc(x.d)}</div><div class="s mono" style="margin-top:3px">${x.k} kcal &middot; ${x.p} g protein</div></div><div style="display:flex;flex-direction:column;gap:6px"><button class="btn sm" data-act="mealadd" data-m="${m}" data-id="${x.id}">Log</button><button class="btn sm ${S.plan[m].includes(x.id)?'pri':'ghost'}" data-act="mealplan" data-m="${m}" data-id="${x.id}">${S.plan[m].includes(x.id)?'Planned':'Plan'}</button></div></div>`).join(''))}</div>`).join('')}</div>`;
  } else if(s==='ingredients'){
    body=vIngredients();
  } else if(s==='grocery'){
    const items=planItems();
    const aisles=Object.keys(items).sort(); const total=aisles.reduce((a,x)=>a+items[x].size,0);
    body=`<div class="grid"><div class="c12">${panel('This week\'s grocery list','list',total?`<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">${aisles.map(a=>`<div><div class="lbl" style="margin-bottom:6px">${a}</div>${[...items[a]].sort().map(n=>`<label class="li" style="cursor:pointer"><input type="checkbox" data-act="gck" data-n="${esc(n)}" ${S.groceryChecked[n]?'checked':''}><span class="grow" style="${S.groceryChecked[n]?'text-decoration:line-through;color:var(--dim)':''}">${esc(n)}</span></label>`).join('')}</div>`).join('')}</div>
      <div class="row wrap mt16"><button class="btn sm" data-act="gcopy">${ico('copy')} Copy list</button><button class="btn sm ghost" data-act="gclear">Clear checks</button></div>`:`<div class="empty">${emptyArt('list')}<div>No meals planned yet. Tap <b>Plan</b> on meals in the Meals tab and the shopping list builds itself.</div><button class="btn sm pri" data-act="sub" data-k="fuel" data-v="meals">Pick meals</button></div>`)}</div></div>`;
  } else {
    body=`<div class="grid"><div class="c7">${panel('Plate and timing rules','leaf',PLATE_RULES.map(r=>`<div class="li"><div class="grow"><div class="t">${r[0]}</div><div class="s">${r[1]}</div></div></div>`).join(''))}</div>
    <div class="c5">${panel('How your targets work','info',`<p class="mut">Daily burn is estimated from your weight, height, age and a low activity factor (desk job). A steady ${S.profile.pace} lb/week pace is a deficit of about ${T.deficit} kcal. Protein is set from your goal weight to protect muscle and keep you full.</p><p class="note mt12">Using your logged weight and food, HealthForge also estimates your real burn after a few weeks (see Progress, Insights) and offers to adopt it.</p><p class="note mt12">Not medical advice. With insulin resistance, check your plan with your doctor.</p>`)}</div></div>`;
  }
  return `<div class="row" style="margin-bottom:16px">${segCtl('fuel',[['log','Log'],['meals','Meals'],['ingredients','Ingredients'],['grocery','Grocery'],['rules','Rules']],s)}</div>${body}`;
}

/* ---------- MOVE ---------- */
function vMove(){
  const s=sub.move; const T=TODAY(); const pl=dayPlan(T); let body='';
  if(s==='walk'){
    const bars=[]; for(let i=13;i>=0;i--){ const k=addDays(T,-i); bars.push({label:pd(k).getDate()+'',tip:fmtD(k),v:walkMin(k),text:walkMin(k)+' min'}); }
    const wk=bars.slice(-7).reduce((a,b)=>a+b.v,0); const walks=(G(T).walk||[]);
    body=`<div class="grid"><div class="c5">${panel('Treadmill','move',`<div class="stat"><div class="lbl">Today's target</div><div class="big">${pl.walk}<small class="mut" style="font-size:14px"> min</small></div></div><p class="note mt8">Walking is your base layer: low effort, lowers stress and burns calories. Walk during calls when you can.</p>
      <div class="row wrap mt16"><button class="btn pri" data-act="walk" data-m="${pl.walk}">${ico('play')} Start walk</button></div>
      <hr class="sep"><div class="lbl">Log a walk you already did</div><form data-form="walk" novalidate class="grid mt8" style="gap:12px;grid-template-columns:repeat(3,minmax(0,1fr))"><div class="field"><label>Minutes</label><input class="inp" name="min" type="number" min="1" max="300" step="1" inputmode="numeric" required></div><div class="field"><label>Speed (mph)</label><input class="inp" name="speed" type="number" step="any" min="0.3" max="9" inputmode="decimal" value="${S.settings.lastSpeed||2.5}"></div><div class="field"><label>Distance (mi)</label><input class="inp" name="dist" type="number" step="any" min="0" max="40" inputmode="decimal" placeholder="optional"></div><p class="note" style="grid-column:span 3">Enter the speed or the distance. The other fills in from your minutes.</p><div style="grid-column:span 3"><button class="btn" type="submit">Add walk</button></div></form>
      ${walks.length?`<div class="list mt12">${walks.map((w,i)=>`<div class="li"><div class="grow"><span class="mono">${w.min} min</span> <span class="mut">&middot; ${walkMiles(w)} mi at ${r2(w.speed)} mph &middot; about ${walkKcal(w.min,w.speed)} kcal</span></div><button class="icon-btn" style="width:32px;height:32px" data-act="itemedit" data-t="walk" data-k="${T}" data-i="${i}" aria-label="Edit">${ico('edit')}</button><button class="icon-btn" style="width:32px;height:32px" data-act="walkdel" data-i="${i}">${ico('trash')}</button></div>`).join('')}</div>`:''}`)}</div>
    <div class="c7">${panel('Last 14 days','progress',`<div class="row between wrap"><span class="chip b">${wk} min this week</span> <span class="chip">${r2(bars.slice(-7).reduce((a,b,i)=>a+walkMilesDay(addDays(T,-(6-i))),0))} mi this week</span><span class="note">Goal: 150+ min</span></div>`+chartBox('walk14',{type:'bar',bars,target:pl.walk,targetLabel:pl.walk+' min',color:'#3b9cff'},230))}</div></div>`;
  } else if(s==='strength'){
    const nr=nextRoutine(); const sel=sub.routine?ROUTINES[sub.routine]:nr; const hist=[]; Object.keys(S.days).sort().reverse().forEach(k=>(S.days[k].strength||[]).forEach(x=>hist.push({k,...x})));
    body=`<div class="grid"><div class="c7">${panel(sel.name,'dumbbell',`<div class="row wrap" style="margin-bottom:12px">${ROUTINE_ORDER.map(r=>`<button class="pill ${r===sel.id?'on':''}" data-act="routinepick" data-r="${r}">Routine ${r}${r===nr.id?' (next)':''}</button>`).join('')}</div>
      ${sel.items.map(it=>`<div class="li ex-card">${figure(it[0],{view:'side'})}<div class="grow"><div class="t">${EXERCISES[it[0]].name}</div><div class="s mono">${it[1]} sets &middot; ${it[2]}</div><div class="s" style="margin-top:4px">${EXERCISES[it[0]].safe}</div></div></div>`).join('')}
      <div class="row wrap mt16"><button class="btn pri" data-act="strength" data-r="${sel.id}">${ico('play')} Start (about 18 min)</button><button class="btn" data-act="strength" data-r="${sel.id}" data-mini="1">Mini (about 8 min)</button></div>`)}</div>
    <div class="c5 grid" style="grid-template-columns:1fr;align-content:start">${panel('Why these moves','info',`<p class="mut">Built for tight hips and back, sensitive knees and desk-worn shoulders: no jumping, no deep lunges, and overhead work only where you choose it. Bench-supported and floor-based movements keep joints calm while you build muscle, which keeps your metabolism up as you lose weight.</p><p class="note mt12">Pick a weight where the last two reps are hard but form stays clean. Add reps first, then weight. Stop if something hurts.</p>`)}
    ${panel('History','list',hist.length?hist.slice(0,8).map(h=>`<div class="li"><div class="grow"><div class="t">${(ROUTINES[h.r]||{name:routineLabel(h.r)||'My workout'}).name}${h.mini?' (mini)':''}</div><div class="s">${fmtDL(h.k)}</div></div><span class="mono mut">${h.min} min</span></div>`).join(''):`<div class="empty">${emptyArt('chart')}<div>Your sessions will appear here.</div></div>`)}</div></div>`;
  } else if(s==='routines'){
    body=vRoutines();
  } else if(s==='lib'){
    body=vLib();
  } else {
    body=`<div class="grid"><div class="c12">${panel('Mobility routines','move',`<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(250px,1fr))">${STRETCH_ROUTINES.map(r=>`<div class="box"><div class="t" style="font-weight:600">${r.name}</div><div class="note" style="min-height:40px">${r.desc}</div><div class="row between mt8"><span class="mono mut">${Math.round(r.items.reduce((a,i)=>a+STRETCHES[i].sec,0)/60*10)/10} min</span><button class="btn sm pri" data-act="stretch" data-id="${r.id}">${ico('play')} Start</button></div></div>`).join('')}</div>`)}</div>
      <div class="c12">${panel('More stretches','list',`<p class="mut">${Object.keys(STRETCHES).length} stretches with animated side and front views are in the Library. Build your own flow there.</p><button class="btn sm pri mt12" data-act="libgo" data-t="stretch">Open stretch library</button>`)}</div></div>`;
  }
  return `<div class="row" style="margin-bottom:16px">${segCtl('move',[['walk','Walk'],['strength','Strength'],['stretch','Mobility'],['routines','My routines'],['lib','Library']],s)}</div>${body}`;
}

/* Mind is split into three tabs; the sections are sorted by title so the markup above stays in one place */
const MIND_TABS=[['sit','Meditate',['Guided meditation','Meditation sounds']],['strain','Mood and strain',['Mood and energy','Manager recovery log']],['urge','Urges',['Urge interrupter','Notes']]];
function vMind(){
  const tab=MIND_TABS.find(t=>t[0]===sub.mind)||MIND_TABS[0];
  const doc=new DOMParser().parseFromString('<div id="r">'+vMindAll()+'</div>','text/html');
  const secs=[...doc.querySelectorAll('section.panel')].filter(x=>tab[2].includes(x.querySelector('h3').textContent.trim()));
  secs.sort((x,y)=>tab[2].indexOf(x.querySelector('h3').textContent.trim())-tab[2].indexOf(y.querySelector('h3').textContent.trim()));
  return `<div class="row" style="margin-bottom:16px">${segCtl('mind',MIND_TABS.map(t=>[t[0],t[1]]),tab[0])}</div><div class="grid">${secs.map((x,i)=>`<div class="c12">${x.outerHTML}</div>`+(tab[0]==='urge'&&i===0?`<div class="c12">${panel('When urges hit','',urgeClockHtml())}</div>`:'')).join('')}</div>`;
}

/* ---------- DAY LOG (view and edit anything) ---------- */
let logDay=TODAY();
const SCALARS=[
  ['weight','Weight','scale',d=>d.weight?d.weight+' lb':null,['weight']],
  ['sleep','Sleep','moon',d=>d.sleepH?d.sleepH+' h, quality '+(d.sleepQ||'-'):null,['sleepH','sleepQ']],
  ['waist','Measurements','ruler',d=>d.waist?'waist '+d.waist+' in'+(d.hips?', hips '+d.hips:'')+(d.chest?', chest '+d.chest:''):null,['waist','hips','chest']],
  ['bp','Blood pressure and pulse','pulse',d=>d.bpS?d.bpS+'/'+d.bpD+(d.rhr?', pulse '+d.rhr:''):(d.rhr?'pulse '+d.rhr:null),['bpS','bpD','rhr']],
  ['mood','Mood','heart',d=>d.mood?d.mood+' of 5':null,['mood']],
  ['energy','Energy','bolt',d=>d.energy?ENERGY[d.energy-1].name:null,['energy']],
  ['water','Water','drop',d=>d.water?d.water+' glasses':null,['water']]
];
const stretchName=id=>routineLabel(id)||(id==='custom'?'My stretch flow':id==='one'?'Single stretch':(STRETCH_ROUTINES.find(r=>r.id===id)||{name:id}).name);
const ITEMS={
  food:{title:'Food',icon:'fuel',sum:x=>[esc(x.name),x.kcal+' kcal, '+(x.protein||0)+' g protein, '+MEAL_LABELS[x.meal||'s']]},
  walk:{title:'Walks',icon:'move',sum:x=>[x.min+' min walk',walkMiles(x)+' mi at '+r2(x.speed)+' mph']},
  strength:{title:'Strength',icon:'dumbbell',sum:x=>[((ROUTINES[x.r]||{name:routineLabel(x.r)||'My workout'}).name)+(x.mini?' (mini)':''),x.min+' min'+(x.rpe?', effort '+x.rpe+'/5':'')]},
  stretch:{title:'Mobility',icon:'move',sum:x=>[stretchName(x.id),x.min+' min']},
  meditate:{title:'Meditation',icon:'mind',sum:x=>[((MEDITATIONS.find(m=>m.id===x.id)||{title:x.id}).title),x.min+' min']},
  urges:{title:'Urge events',icon:'urge',sum:x=>[({hunger:'Physical hunger',stress:'Stress or emotion',habit:'Boredom or habit'}[x.src]||'Urge')+(x.trigger?': '+esc(x.trigger):''),({handled:'Handled without eating',planned:'Ate something planned',ate:'Ate anyway'}[x.outcome]||'')+(x.note?' | '+esc(x.note):'')]},
  recovery:{title:'Recovery log',icon:'user',sum:x=>[esc(x.what)+' (drain '+x.lvl+'/5)','Recharge: '+esc(x.rc)+(x.note?' | '+esc(x.note):'')]},
  notes:{title:'Notes',icon:'note',sum:x=>[esc(x.text),'']}
};
function vLog(){
  const k=logDay, d=G(k);
  const dateNav=`<div class="row between wrap" style="margin-bottom:16px"><div class="row gap8"><button class="icon-btn" data-act="lday" data-v="-1">${ico('chevL')}</button><input class="inp" type="date" id="logdate" value="${k}" max="${TODAY()}" style="width:auto"><button class="icon-btn" data-act="lday" data-v="1" ${k>=TODAY()?'disabled style="opacity:.35"':''}>${ico('chevR')}</button></div><div class="row gap8">${k!==TODAY()?`<button class="btn sm" data-act="lday" data-v="today">Today</button>`:''}<span class="chip">${fmtDL(k)}</span></div></div>`;
  const rows=SCALARS.map(s=>{ const t=s[3](d); return t?`<div class="li"><span style="color:var(--blue);width:20px">${ico(s[2])}</span><div class="grow"><div class="t">${s[1]}</div><div class="s mono">${t}</div></div><button class="icon-btn" style="width:34px;height:34px" data-act="scalaredit" data-kind="${s[0]}" aria-label="Edit">${ico('edit')}</button><button class="icon-btn" style="width:34px;height:34px" data-act="scalardel" data-kind="${s[0]}" aria-label="Delete">${ico('trash')}</button></div>`:''; }).join('');
  const missing=SCALARS.filter(s=>!s[3](d));
  const metrics=panel('Daily metrics','today',(rows?`<div class="list">${rows}</div>`:`<p class="note">Nothing logged yet for this day.</p>`)+(missing.length?`<div class="lbl mt16">Add</div><div class="pill-row mt8">${missing.map(s=>`<button class="pill" data-act="scalaredit" data-kind="${s[0]}">+ ${s[1]}</button>`).join('')}</div>`:''));
  const lists=Object.keys(ITEMS).map(t=>{ const it=ITEMS[t], arr0=d[t]||[];
    return panel(it.title,it.icon,(arr0.length?`<div class="list">${arr0.map((x,i)=>{const s=it.sum(x);return `<div class="li"><div class="grow"><div class="t">${s[0]}</div>${s[1]?`<div class="s mono" style="font-family:var(--sans)">${s[1]}</div>`:''}</div><button class="icon-btn" style="width:34px;height:34px" data-act="itemedit" data-t="${t}" data-k="${k}" data-i="${i}" aria-label="Edit">${ico('edit')}</button><button class="icon-btn" style="width:34px;height:34px" data-act="itemdel" data-t="${t}" data-k="${k}" data-i="${i}" aria-label="Delete">${ico('trash')}</button></div>`;}).join('')}</div>`:`<p class="note">None logged.</p>`)+`<button class="btn sm mt12" data-act="itemedit" data-t="${t}" data-k="${k}" data-i="-1">${ico('plus')} Add</button>`,'c6 t6');
  }).join('');
  return dateNav+`<div class="grid"><div class="c12">${metrics}</div>${lists}</div>`;
}
/* ---------- LIBRARY ---------- */
const lib={type:'strength',cat:'',eq:'',joint:false,q:''};
const JN=['knee','back','shoulder'];
function jointChips(x){ return (x.j||[]).map((v,i)=>v>=3?`<span class="chip w">${JN[i]} caution</span>`:v===2?`<span class="chip">${JN[i]} care</span>`:'').join(''); }
function libItems(){
  const q=lib.q.trim().toLowerCase();
  const src=lib.type==='strength'?Object.values(EXERCISES):Object.values(STRETCHES);
  return src.filter(x=>(!lib.cat||(x.cat||x.area)===lib.cat)&&(!lib.eq||x.eq.includes(lib.eq))&&(!lib.joint||!(x.j||[]).some(v=>v>=3))&&(!q||q.split(/\s+/).every(w=>(x.name+' '+(x.cat||x.area)+' '+x.eq.map(e=>EQ_LABEL[e]||e).join(' ')+' '+(x.cue||'')).toLowerCase().includes(w))));
}
function libGridHtml(){
  const items=libItems(); if(!items.length) return `<div class="empty">${emptyArt('list')}<div>No matches. Try clearing a filter.</div></div>`;
  const qn=lib.type==='strength'?S.queue:S.stretchQueue;
  return `<div class="libgrid">${items.map(x=>`<button class="libcard" data-act="libopen" data-id="${x.id}">${qn.includes(x.id)?'<span class="chip b libq">In my list</span>':''}${figure(x.id,{view:'side',pose:0})}<div class="t">${esc(x.name)}</div><div class="s">${esc(x.cat||x.area)} &middot; ${lib.type==='strength'?x.sets+' x '+esc(x.reps):x.sec+' sec'}</div><div class="pill-row" style="margin-top:6px;gap:4px">${x.eq.filter(e=>e!=='bodyweight').map(e=>`<span class="chip">${EQ_LABEL[e]}</span>`).join('')}${jointChips(x)}</div></button>`).join('')}</div>`;
}
function vLib(){
  const cats=lib.type==='strength'?CATS:AREAS; const eqs=lib.type==='strength'?['bodyweight','dumbbell','kettlebell','medball','bench']:['bodyweight','bench'];
  const count=libItems().length, total=lib.type==='strength'?Object.keys(EXERCISES).length:Object.keys(STRETCHES).length;
  const qs=S.queue, sq=S.stretchQueue;
  const queuePanel=(qs.length||sq.length)?panel('My lists','list',`${qs.length?`<div class="lbl">My workout (${qs.length})</div><div class="list">${qs.map((id,i)=>`<div class="li"><div class="grow"><div class="t">${EXERCISES[id].name}</div><div class="s mono">${EXERCISES[id].sets} sets &middot; ${EXERCISES[id].reps}</div></div><button class="icon-btn" style="width:32px;height:32px" data-act="qdel" data-k="s" data-i="${i}">${ico('close')}</button></div>`).join('')}</div><div class="row wrap mt8"><button class="btn sm pri" data-act="strength" data-r="custom">${ico('play')} Start workout</button><button class="btn sm ghost" data-act="qclear" data-k="s">Clear</button></div>`:''}${sq.length?`<div class="lbl" style="margin-top:${qs.length?18:0}px">My stretch flow (${sq.length})</div><div class="list">${sq.map((id,i)=>`<div class="li"><div class="grow"><div class="t">${STRETCHES[id].name}</div><div class="s mono">${STRETCHES[id].sec} sec</div></div><button class="icon-btn" style="width:32px;height:32px" data-act="qdel" data-k="t" data-i="${i}">${ico('close')}</button></div>`).join('')}</div><div class="row wrap mt8"><button class="btn sm pri" data-act="stretch" data-id="custom">${ico('play')} Start flow</button><button class="btn sm ghost" data-act="qclear" data-k="t">Clear</button></div>`:''}`,'glow'):'';
  return `<div class="grid">${queuePanel?`<div class="c12">${queuePanel}</div>`:''}
   <div class="c12">${panel('Exercise library','dumbbell',`
    <div class="row wrap" style="margin-bottom:12px;justify-content:space-between"><div class="seg">${[['strength','Strength'],['stretch','Stretch and mobility']].map(o=>`<button class="${lib.type===o[0]?'on':''}" data-act="libtype" data-v="${o[0]}">${o[1]}</button>`).join('')}</div>
      ${lib.type==='strength'?`<button class="btn sm" data-act="qgen">${ico('spark')} Build me a workout</button>`:''}</div>
    <input class="inp" id="libq" placeholder="Search by name or muscle group" value="${esc(lib.q)}" autocomplete="off">
    <div class="lbl mt12">${lib.type==='strength'?'Muscle group':'Area'}</div><div class="pill-row mt8"><button class="pill ${lib.cat?'':'on'}" data-act="libcat" data-v="">All</button>${cats.map(c=>`<button class="pill ${lib.cat===c?'on':''}" data-act="libcat" data-v="${c}">${c}</button>`).join('')}</div>
    <div class="lbl mt12">Equipment</div><div class="pill-row mt8"><button class="pill ${lib.eq?'':'on'}" data-act="libeq" data-v="">Any</button>${eqs.map(c=>`<button class="pill ${lib.eq===c?'on':''}" data-act="libeq" data-v="${c}">${EQ_LABEL[c]}</button>`).join('')}</div>
    ${lib.type==='strength'?`<label class="row mt12" style="cursor:pointer;gap:10px;font-size:13.5px;color:var(--mut)"><input type="checkbox" data-act="libjoint" ${lib.joint?'checked':''}> Hide anything with a joint caution (knees, back, shoulders)</label>`:''}
    <div class="note mt12"><span id="libcount">${count}</span> of ${total} shown</div>`)}</div>
   <div class="c12" id="libgrid">${libGridHtml()}</div></div>`;
}
function libDetail(id){
  const strength=!!EXERCISES[id]; const x=strength?EXERCISES[id]:STRETCHES[id]; const inQ=(strength?S.queue:S.stretchQueue).includes(id);
  openSheet(`<h2>${esc(x.name)}</h2><div class="note">${esc(x.cat||x.area)}${strength?' &middot; '+x.sets+' sets of '+esc(x.reps):' &middot; '+x.sec+' seconds'}</div>
   <div style="margin:14px 0">${figurePair(id)}</div>
   <p>${esc(x.cue)}</p>${strength?`<p class="note mt8">${esc(x.safe)}</p>`:''}
   <div class="pill-row mt12">${x.eq.map(e=>`<span class="chip b">${EQ_LABEL[e]}</span>`).join('')}${jointChips(x)}</div>
   <div class="row wrap mt16"><button class="btn ${inQ?'':'pri'}" data-act="qtoggle" data-id="${id}">${inQ?'Remove from my list':'Add to my '+(strength?'workout':'stretch flow')}</button>${strength?'':`<button class="btn" data-act="stretch1" data-id="${id}">${ico('play')} Do this now</button>`}</div>`);
}

/* ---------- MIND ---------- */
function vMindAll(){
  const T=TODAY(); const days=[]; for(let i=13;i>=0;i--) days.push(addDays(T,-i));
  const rec=[]; Object.keys(S.days).sort().reverse().forEach(k=>(S.days[k].recovery||[]).forEach(r=>rec.push({k,...r})));
  const urges=[]; Object.keys(S.days).sort().forEach(k=>(S.days[k].urges||[]).forEach(u=>urges.push({k,...u})));
  const mood=days.map(k=>({x:dayNum(k),y:G(k).mood||null})).filter(p=>p.y);
  const en=days.map(k=>({x:dayNum(k),y:G(k).energy||null})).filter(p=>p.y);
  const notes=[]; Object.keys(S.days).sort().reverse().forEach(k=>(S.days[k].notes||[]).forEach(n=>notes.push({k,...n})));
  return `<div class="grid">
   <div class="c7 grid" style="grid-template-columns:1fr;align-content:start">${panel('Guided meditation','mind',`<p class="mut" style="margin-bottom:8px">Mindfulness, not breathing drills. Sit, listen, notice. Short ones count.</p>${MEDITATIONS.map(m=>`<div class="li"><div class="grow"><div class="t">${m.title} <span class="chip" style="margin-left:6px">${m.min} min</span></div><div class="s">${m.desc}</div></div><button class="btn sm pri" data-act="med" data-id="${m.id}">${ico('play')}</button></div>`).join('')}`)}${dronePanel()}</div>
   <div class="c5 grid" style="grid-template-columns:1fr;align-content:start">
    ${panel('Urge interrupter','urge',`<p class="mut">Craving something right now? One tap starts a short pause, a hunger-or-stress check, and a better option.</p><button class="btn pri block mt12" data-act="urge">${ico('urge')} Start now</button>
      ${urges.length?`<hr class="sep"><div class="row between"><span class="note">Total logged</span><b class="mono">${urges.length}</b></div><div class="row between"><span class="note">Handled or planned</span><b class="mono up">${urges.filter(u=>u.outcome!=='ate').length}</b></div>`:''}`)}
    ${panel('Mood and energy','heart',mood.length+en.length>2?chartBox('moodc',{series:[{name:'Mood',color:'#22d3ee',pts:mood,dots:true,main:true,dotOp:.9},{name:'Energy',color:'#9381ff',pts:en.map(p=>({x:p.x,y:p.y*5/3})),dots:true,dotOp:.9,dash:true}],ymin:0.5,ymax:5.5,yfmt:v=>Math.round(v)},190)+`<div class="legend"><span><i style="background:#22d3ee"></i>Mood (1-5)</span><span><i style="background:#9381ff"></i>Energy (scaled)</span></div>`:`<div class="empty">${emptyArt('chart')}<div>Log your energy and mood daily to see patterns.</div><button class="btn sm" data-act="log" data-kind="mood">Log mood</button></div>`)}
   </div>
   <div class="c7">${panel('Manager recovery log','user',`<p class="mut">Leading people is draining for an introvert. Log what drained you, then schedule the recharge. Over time it shows what to batch, shorten or protect.</p>
    <form data-form="recovery" class="grid" style="gap:12px;grid-template-columns:1fr 1fr;margin-top:12px"><div class="field"><label>What drained you</label><select class="inp" name="what">${DRAINERS.map(x=>`<option>${x}</option>`).join('')}</select></div>
    <div class="field"><label>Drain level (1-5)</label><select class="inp" name="lvl">${[1,2,3,4,5].map(x=>`<option ${x===3?'selected':''}>${x}</option>`).join('')}</select></div>
    <div class="field"><label>Recharge with</label><select class="inp" name="rc">${RECHARGE.map(x=>`<option>${x}</option>`).join('')}</select></div>
    <div class="field"><label>Note (optional)</label><input class="inp" name="note" autocomplete="off"></div>
    <button class="btn pri" style="grid-column:span 2" type="submit">${ico('plus')} Add entry</button></form>
    ${rec.length?`<div class="list mt16">${rec.slice(0,6).map(r=>`<div class="li"><div class="grow"><div class="t">${esc(r.what)} <span class="chip ${r.lvl>=4?'w':''}">drain ${r.lvl}</span></div><div class="s">${fmtDL(r.k)} &middot; recharge: ${esc(r.rc)}${r.note?' &middot; '+esc(r.note):''}</div></div></div>`).join('')}</div>`:''}`)}</div>
   <div class="c5">${panel('Notes','note',notes.length?`<div class="list">${notes.slice(0,6).map(n=>`<div class="li"><div class="grow"><div class="s">${fmtDL(n.k)}</div><div class="t" style="font-weight:500">${esc(n.text)}</div></div></div>`).join('')}</div>`:`<div class="empty">${emptyArt('list')}<div>Short notes you write during urge sessions show up here.</div></div>`+`<button class="btn sm block mt8" data-act="note">${ico('plus')} New note</button>`)}</div>
  </div>`;
}

/* ---------- PROGRESS ---------- */
function insights(){
  const out=[]; const keys=Object.keys(S.days).sort(); const T=targets();
  const urges=[]; keys.forEach(k=>(S.days[k].urges||[]).forEach(u=>urges.push({k,...u})));
  if(urges.length>=4){
    const b={m:0,a:0,e:0,l:0}; urges.forEach(u=>{const h=new Date(u.t).getHours(); h<12?b.m++:h<16?b.a++:h<21?b.e++:b.l++;});
    const top=Object.entries(b).sort((x,y)=>y[1]-x[1])[0]; const nm={m:'morning',a:'midday to afternoon',e:'evening (4-9pm)',l:'late night'}[top[0]];
    out.push(['Urge timing',`Most of your urges (${top[1]} of ${urges.length}) hit in the ${nm}. Plan your decompression and a protein option right before that window.`]);
    const tc={}; urges.forEach(u=>{if(u.trigger) tc[u.trigger]=(tc[u.trigger]||0)+1;}); const tt=Object.entries(tc).sort((a,b)=>b[1]-a[1])[0];
    if(tt) out.push(['Top trigger',`"${tt[0]}" is your most common trigger (${tt[1]}). Prepare a specific response for it.`]);
  } else out.push(['Urge patterns','Log 4 or more urges with the interrupter and your timing and trigger patterns appear here.']);
  const sl=[], sg=[]; keys.forEach(k=>{const d=S.days[k]; if(d.sleepH&&foodTotals(addDays(k,0)).n>=2){ (d.sleepH<6.5?sl:sg).push(foodTotals(k).kcal); }});
  if(sl.length>=3&&sg.length>=3){ const a=sl.reduce((x,y)=>x+y)/sl.length, b=sg.reduce((x,y)=>x+y)/sg.length; out.push(['Sleep and eating',`On days with under 6.5 hours of sleep you ate about ${Math.round(a)} kcal vs ${Math.round(b)} on better-sleep days (${a>b?'+':''}${Math.round(a-b)}).`]); }
  else out.push(['Sleep and eating','Log sleep and food for a few more days to compare short-sleep days with good ones.']);
  const lo=[], hi=[]; keys.forEach(k=>{const d=S.days[k]; if(d.energy&&foodTotals(k).n>=2){ (d.energy===1?lo:hi).push(foodTotals(k).kcal);} });
  if(lo.length>=3&&hi.length>=3){ const a=lo.reduce((x,y)=>x+y)/lo.length, b=hi.reduce((x,y)=>x+y)/hi.length; out.push(['Energy and eating',`Low-energy days average ${Math.round(a)} kcal vs ${Math.round(b)} otherwise. ${a>b+150?'Low energy leads to more eating, so keep ready-to-eat protein on hand.':'No big difference, which is a good sign.'}`]); }
  const rate=recentRate(); const t=trendSeries();
  const logged=keys.filter(k=>k>=addDays(TODAY(),-21)&&foodTotals(k).n>=2);
  if(rate!=null&&logged.length>=10){ const avg=logged.reduce((a,k)=>a+foodTotals(k).kcal,0)/logged.length; const obs=Math.round(avg+rate*500); out.push(['Observed burn',`Eating about ${Math.round(avg)} kcal and losing ${r1(rate)} lb/week implies your real daily burn is near ${obs} kcal (the app assumes ${T.tdee}).`+(Math.abs(obs-T.tdee)>150?` <button class="btn sm" data-act="adopt" data-v="${obs}">Adopt ${obs}</button>`:'')]); }
  else out.push(['Observed burn','After about 3 weeks of weigh-ins and 10 logged food days, HealthForge estimates your real calorie burn from your own data.']);
  return out;
}
function goalPanel(){
  const p=S.profile, g=goalPlan(), tr=trendSeries(); const T=targets();
  const col={ahead:'ok',on:'ok',behind:'w',done:'ok'}[g.status], lab={ahead:'Ahead of plan',on:'On track',behind:'Behind plan',done:'Goal reached'}[g.status];
  const series=[{name:'Plan',color:'#9381ff',pts:[{x:g.n0,y:p.startWeight},{x:g.n1,y:p.goalWeight}],dash:true,width:2},{name:'Actual',color:'#3b9cff',pts:tr.map(x=>({x:x.n,y:x.t,w:x.w})),area:true,main:true,last:true,width:2.6}];
  if(g.rate&&g.rate>0.1&&g.status!=='done'&&g.daysLeft>0){ const pn=g.projDate?Math.min(g.n1,dayNum(g.projDate)):g.n1; series.push({name:'Projection',color:'#22d3ee',pts:[{x:g.nt,y:g.w},{x:pn,y:Math.max(p.goalWeight-3,g.w-g.rate*(pn-g.nt)/7)}],dash:true,width:2}); }
  const p1=p.startWeight-20, hasP1=p1>p.goalWeight+1; const p1n=hasP1?Math.round(g.n0+(g.n1-g.n0)*(20/Math.max(1,p.startWeight-p.goalWeight))):null;
  const p1Done=hasP1&&g.w<=p1, p1Late=hasP1&&!p1Done&&g.nt>p1n;
  const refs=[{y:p.goalWeight,label:'Goal '+p.goalWeight,color:'#38d9a0'}]; if(hasP1) refs.push({y:p1,label:'Phase 1: '+r1(p1),color:'#f6b94c'});
  const chart=chartBox('goalc',{series,xmin:g.n0,xmax:Math.max(g.n1,g.nt),refs,yfmt:v=>Math.round(v),tipfn:b=>`<span class="k">${fmtD(fromNum(b.x))}</span><br>Actual <b>${r1(b.y)}</b> lb<br>Plan <b>${r1(g.planned(b.x))}</b> lb`},250);
  const diffTxt=g.status==='done'?'':(Math.abs(g.diff)<0.05?'on the plan line':r1(Math.abs(g.diff))+' lb '+(g.diff>0?'above':'below')+' the plan line');
  const needTxt=g.need==null?'Target date has passed. Set a new date below.':`Plan needs <b class="mono">${r1(g.need)}</b> lb/week from here${g.rate!=null?` &middot; you are doing <b class="mono">${r1(g.rate)}</b>`:''}`;
  const warn=g.need!=null&&g.need>2.5?`<div class="banner mt12">That pace is aggressive. Consider moving the target date out so the plan stays sustainable.</div>`:'';
  return panel('Goal tracker','flag',`<div class="row between wrap" style="margin-bottom:12px"><div class="row wrap gap8"><span class="chip ${col}">${lab}</span><span class="note">${diffTxt}</span></div><button class="btn sm" data-act="goto" data-v="settings">${ico('edit')} Edit goal</button></div>
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-bottom:12px"><div class="stat"><div class="lbl">Goal</div><div class="v">${p.goalWeight}<small>lb</small></div></div><div class="stat"><div class="lbl">Target date</div><div class="v" style="font-size:20px">${fmtD(g.gd)}</div></div><div class="stat"><div class="lbl">Days left</div><div class="v">${Math.max(0,g.daysLeft)}</div></div><div class="stat"><div class="lbl">Plan weight today</div><div class="v">${r1(g.pn)}<small>lb</small></div></div>${hasP1?`<div class="stat"><div class="lbl">Phase 1 (${r1(p1)} lb)</div><div class="v" style="font-size:20px;color:${p1Done?'var(--ok)':p1Late?'var(--warn)':'var(--txt)'}">${p1Done?'Reached':fmtD(fromNum(p1n))}</div><div class="d mut">${p1Done?'First 20 lb done':p1Late?'Past the plan date':'by the plan, '+r1(Math.max(0,g.w-p1))+' lb to go'}</div></div>`:''}</div>
    ${chart}<div class="legend"><span><i style="background:#9381ff"></i>Plan (straight line to goal)</span><span><i style="background:#3b9cff"></i>Actual trend</span><span><i style="background:#22d3ee"></i>Projection at current rate</span>${hasP1?'<span><i style="background:#f6b94c"></i>Phase 1 milestone</span>':''}</div>
    <p class="note mt12">${needTxt}${g.projDate&&g.status!=='done'?` &middot; at your current rate you reach goal around <b class="mono">${fmtD(g.projDate)}</b>`:''}</p>${warn}`,'glow');
}
function vProgress(){
  const p=S.profile, ph=phaseInfo(), T=TODAY(); const tr=trendSeries(); const c=counts();
  const lim=progRange? dayNum(T)-progRange : -1e9;
  const raw=tr.filter(x=>x.n>=lim), rate=recentRate();
  const refs=[]; if(raw.length){ const mn=Math.min(...raw.map(x=>x.w)); if(ph.p1<mn&&mn-ph.p1<30||ph.toP1>0&&ph.p1>=mn-15) refs.push({y:ph.p1,label:'Phase 1: '+r1(ph.p1),color:'#9381ff'}); if(ph.goal>=mn-40&&Math.abs(ph.goal-ph.p1)>6) refs.push({y:ph.goal,label:'Goal '+ph.goal,color:'#38d9a0'}); }
  const wchart= tr.length>=2? chartBox('wchart',{series:[{name:'Scale',color:'#8c9bb3',pts:raw.map(x=>({x:x.n,y:x.w})),line:false,dots:true,dotOp:.55},{name:'Trend',color:'#3b9cff',pts:raw.map(x=>({x:x.n,y:x.t,w:x.w})),area:true,main:true,last:true,width:2.6}],refs,yfmt:v=>Math.round(v),tipfn:b=>`<span class="k">${fmtD(fromNum(b.x))}</span><br>Trend <b>${r1(b.y)}</b> lb<br>Scale <b>${b.w}</b> lb`},260)
    +`<div class="legend"><span><i style="background:#3b9cff"></i>Trend (smoothed)</span><span><i style="background:#8c9bb3"></i>Scale reading</span></div>`
    : `<div class="empty">${emptyArt('chart')}<div>Log your weight on 2 or more days to see your trend line.</div><button class="btn sm pri" data-act="log" data-kind="weight">${ico('scale')} Log weight</button></div>`;
  const ser=(f,color,tf)=>{ const pts=Object.keys(S.days).sort().filter(k=>S.days[k][f]>0&&dayNum(k)>=Math.max(lim,dayNum(T)-120)).map(k=>({x:dayNum(k),y:S.days[k][f]})); return pts.length>1? chartBox('c_'+f,{series:[{color,pts,area:true,main:true,dots:true,dotOp:.8,last:true}],tipfn:b=>`<span class="k">${fmtD(fromNum(b.x))}</span> <b>${r1(b.y)}</b>`},150):`<div class="empty" style="padding:14px"><div>Needs 2 or more entries</div></div>`; };
  const bpPts=Object.keys(S.days).sort().filter(k=>S.days[k].bpS).slice(-30).map(k=>({x:dayNum(k),y:S.days[k].bpS,d:S.days[k].bpD}));
  const lastBP=bpPts.length? bpPts[bpPts.length-1]:null;
  const bpNote= lastBP? (lastBP.y>=180||lastBP.d>=120?'<span class="badc">Very high reading. Seek medical care if this repeats or you have symptoms.</span>': lastBP.y>=140||lastBP.d>=90?'<span class="warnc">Above 140/90. Worth mentioning to your doctor.</span>':lastBP.y>=130||lastBP.d>=80?'<span class="warnc">Slightly elevated. Weight loss and walking help.</span>':'<span class="up">Within a healthy range.</span>'):'';
  const badges=BADGES.map(b=>{const on=b.test(c);return `<div class="badge ${on?'':'off'}">${medal(b.g,!on)}<span>${b.n}</span></div>`;}).join('');
  const road=[['Phase 1',r1(ph.p1)+' lb','First 20 lb',ph.phase>1?1:ph.pct1,ph.p1Date],['Phase 2',ph.goal+' lb','To goal weight',ph.phase>2?1:(ph.phase===2?ph.pctG:0),ph.goalDate],['Maintain','+/- 3 lb','Hold it for good',ph.phase===3?1:0,null]];
  return `<div class="grid">
    <div class="c12"><div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:26px 20px">
      ${[['Trend weight',r1(ph.w),'lb',null],['Trend change',(ph.lost>=0?'-':'+')+r1(Math.abs(ph.lost)),'lb',null],['Weekly rate',rate!=null?r1(rate):'--','lb/wk',null],['To phase 1',r1(ph.toP1),'lb',null],['To goal',r1(ph.toGoal),'lb',null]].map(s=>`<div><div class="stat"><div class="lbl">${s[0]}</div><div class="v">${s[1]}<small>${s[2]}</small></div></div></div>`).join('')}</div></div>
    <div class="c12">${panel('Your journey','',journeyMap()+(ph.phase===3||ph.toGoal<1?`<div class="banner mt16">${ico('info').replace('<svg','<svg width="20" height="20"')}<div>You are at your goal range. ${S.settings.mode==='maintain'?'Maintenance mode is on: calories are set to your burn. If your trend rises more than 3 lb above goal, return to a small deficit for two weeks.':'Switch to maintenance in Settings to raise calories to your burn gradually.'}</div></div>`:''))}</div>
    <div class="c12">${goalPanel()}</div>
    <div class="c12">${panel('Weight trend','scale',`<div class="row between wrap" style="margin-bottom:10px"><div class="seg">${[[30,'30d'],[90,'90d'],[180,'6m'],[0,'All']].map(o=>`<button class="${progRange===o[0]?'on':''}" data-act="range" data-v="${o[0]}">${o[1]}</button>`).join('')}</div><button class="btn sm pri" data-act="log" data-kind="weight">${ico('plus')} Weigh-in</button></div>${wchart}<p class="note mt8">The blue line smooths daily water swings. Judge progress by the trend, not by single scale readings.</p>`)}</div>
    <div class="c12">${panel('Consistency','',consistencyHtml(),'','12 weeks')}</div>
    <div class="c6 t6">${panel('Waist','ruler',ser('waist','#22d3ee')+`<div class="row between mt8"><span class="note">${(()=>{const w=Object.keys(S.days).filter(k=>S.days[k].waist>0).sort();return w.length?S.days[w[w.length-1]].waist+' in latest':'Not logged';})()}</span><button class="btn sm" data-act="log" data-kind="waist">${ico('plus')} Log</button></div>`)}</div>
    <div class="c6 t6">${panel('Sleep','moon',ser('sleepH','#9381ff')+`<div class="row between mt8"><span class="note">Hours per night</span><button class="btn sm" data-act="log" data-kind="sleep">${ico('plus')} Log</button></div>`)}</div>
    <div class="c6 t6">${panel('Blood pressure and pulse','pulse',(bpPts.length>1? chartBox('bpc',{series:[{color:'#ff6d7e',pts:bpPts.map(b=>({x:b.x,y:b.y,d:b.d})),main:true,dots:true,dotOp:.9,last:true}],refs:[{y:130,label:'130',color:'#f6b94c'}],tipfn:b=>`<span class="k">${fmtD(fromNum(b.x))}</span> <b>${b.y}/${b.d}</b>`},150):`<div class="empty" style="padding:14px"><div>Needs 2 or more readings</div></div>`)+`<div class="row between mt8"><span class="note">${bpNote||'Systolic shown'}</span><button class="btn sm" data-act="log" data-kind="bp">${ico('plus')} Log</button></div>`)}</div>
    <div class="c6 t6">${panel('Resting heart rate','heart',ser('rhr','#f6b94c')+`<div class="row between mt8"><span class="note">Beats per minute</span><button class="btn sm" data-act="log" data-kind="bp">${ico('plus')} Log</button></div>`)}</div>
    <div class="c7">${panel('Insights','spark',`<div class="list">${insights().map(i=>`<div class="li"><div class="grow"><div class="t">${i[0]}</div><div class="s">${i[1]}</div></div></div>`).join('')}</div>`)}</div>
    <div class="c5">${panel('Milestones','trophy',`<div class="badges">${badges}</div>`)}</div>
  </div>`;
}
