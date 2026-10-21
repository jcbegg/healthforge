/* ===== HealthForge: Today as a recap of what you logged (suggestions live at the bottom) ===== */
const MOB_ICON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4.5" r="2"/><path d="M12 7.5v6M5.5 9.5l6.5 1.6 6.5-1.6M9 21l3-7.5 3 7.5"/></svg>';
const SLOT_H={b:8,l:12.5,d:18.5,s:15.5,e:20.5,walk:7.5,str:12,mob:10,med:16,urge:17.5};
const MEAL_COL={b:'#f3b94f',l:'#4ea3ff',d:'#9d8cff',s:'#27d3ee',e:'#ff8fa0'};
/* hour of day for a logged item; older or demo items with no usable time fall back to a sensible slot */
function evHour(t,slot,i){ const ds=new Date().setHours(0,0,0,0); if(t&&t>=ds&&t<ds+864e5){ const dt=new Date(t); return dt.getHours()+dt.getMinutes()/60; } return (SLOT_H[slot]||12)+(i||0)*.7; }
const pctTxt=v=>Math.round(v*100)+'%';

/* ---- ring legend: says what each ring is and where it stands ---- */
function ringLegendHtml(rows){
  return `<div class="rleg">${rows.map(r=>`<div class="rl"><div class="rl-h"><i class="hsd" style="background:${r.c}"></i><span class="lbl">${r.name}</span><span class="rl-chip ${r.cls||''}">${r.chip}</span></div>
    <div class="rl-v"><span class="v">${r.val}</span><small>${r.of}</small></div><div class="rl-s">${r.status}</div><div class="rl-d">${r.desc}</div></div>`).join('')}</div>`;
}

/* ---- small recap tiles ---- */
function energyTile(d){
  return `<div class="tile"><div class="lbl">Energy</div><div class="enrg">${ENERGY.map(e=>`<button class="en${d.energy===e.id?' on':''}" data-act="energy" data-v="${e.id}" aria-label="${e.name} energy">${ico(e.icon)}<span>${e.name}</span></button>`).join('')}</div>
    <div class="note" style="margin-top:10px">${d.energy?ENERGY[d.energy-1].sub+'. Your plan is scaled to match.':'How are you today? Your plan scales to your answer.'}</div></div>`;
}
function waterTile(d,pl){
  const goal=Math.min(10,Math.max(1,pl.water)), n=d.water||0;
  const drops=Array.from({length:goal},(_,i)=>`<svg class="drop${i<n?' on':''}" style="--i:${i}" viewBox="0 0 24 28"><path d="M12 2C12 2 4.5 11 4.5 17a7.5 7.5 0 0015 0C19.5 11 12 2 12 2z"/></svg>`).join('');
  return `<div class="tile"><div class="lbl">Water</div><div class="drops">${drops}${n>goal?`<span class="chip ok">+${n-goal}</span>`:''}</div>
    <div class="row between" style="margin-top:10px"><span class="tv">${cu(n)}<small> of ${pl.water} glasses</small></span><button class="btn sm" data-act="water">${ico('plus')} Glass</button></div></div>`;
}
function weighTile(d){
  const w=d.weight, tr=curWeight(), ser=trendSeries().slice(-14).map(x=>x.t);
  if(w){ const df=w-tr; return `<div class="tile"><div class="lbl">Weigh-in</div><div class="row between" style="align-items:flex-end"><div><span class="tv big2">${cu(w,1)}<small> lb</small></span><div class="note ${Math.abs(df)<.05?'':df<0?'up':'warnc'}" style="margin-top:2px">${df>=0?'+':''}${r1(df)} lb vs your trend</div></div>${sparkline(ser,'#27d3ee',96,34)}</div></div>`; }
  return `<div class="tile"><div class="lbl">Weigh-in</div><div class="row between" style="align-items:flex-end"><div><span class="tv big2 dim">&mdash;</span><div class="note" style="margin-top:2px">Not logged today</div></div><button class="btn sm" data-act="log" data-kind="weight">${ico('scale')} Log</button></div></div>`;
}
function sleepTile(d){
  const h=d.sleepH, goal=8;
  if(h){ const q=d.sleepQ||0; return `<div class="tile"><div class="lbl">Sleep last night</div><div class="tv big2">${cu(h,1)}<small> h</small></div><div class="sl"><i style="width:${Math.round(clamp(h/goal,0,1)*100)}%"></i><u style="left:${7/goal*100}%"></u></div>
    <div class="row between note" style="margin-top:6px"><span>${h>=7?'In the healthy range':h>=6?'A little short':'Short night'}</span><span class="qd">${[1,2,3,4,5].map(i=>`<i class="${i<=q?'on':''}"></i>`).join('')}</span></div></div>`; }
  return `<div class="tile"><div class="lbl">Sleep last night</div><div class="row between" style="align-items:flex-end"><div><span class="tv big2 dim">&mdash;</span><div class="note" style="margin-top:2px">Not logged</div></div><button class="btn sm" data-act="log" data-kind="sleep">${ico('plus')} Log</button></div></div>`;
}
function sessionsTile(k,strDone){
  const mi=(G(k).walk||[]).reduce((a,w)=>a+walkMiles(w),0);
  const S2=[{l:'Walk',i:ico('move'),on:walkMin(k)>0,v:walkMin(k)?walkMin(k)+' min'+(mi?' &middot; '+r2(mi)+' mi':''):'None yet'},
    {l:'Strength',i:ico('dumbbell'),on:strengthN(k)>0,v:strengthN(k)?(strDone||'')+(strDone?' min':'Done'):'None yet'},
    {l:'Mobility',i:MOB_ICON,on:stretchMin(k)>0,v:stretchMin(k)?stretchMin(k)+' min':'None yet'},
    {l:'Mindful',i:ico('mind'),on:medMin(k)>0,v:medMin(k)?medMin(k)+' min':'None yet'}];
  return `<div class="tile wide"><div class="lbl">Movement and mind</div><div class="pics">${S2.map(s=>`<div class="pic${s.on?' on':''}"><span class="pic-i">${s.i}</span><b>${s.l}</b><small>${s.v}</small></div>`).join('')}</div></div>`;
}

/* ---- the day as a timeline: pace line, meals, movement, mind ---- */
function dayTimelineHtml(k,T){
  const d=G(k), W=440, H=196, x0=50, x1=430, hMin=5, hMax=24, now=new Date(), nowH=now.getHours()+now.getMinutes()/60;
  const X=h=>x0+(clamp(h,hMin,hMax)-hMin)/(hMax-hMin)*(x1-x0);
  const ws=winStartMin()/60, we=WIN_END/60, laneY={pace:14,food:96,move:132,mind:166};
  let g='';
  [6,9,12,15,18,21,24].forEach(h=>{ g+=`<line x1="${X(h)}" x2="${X(h)}" y1="12" y2="176" stroke="rgba(160,185,230,.08)"/><text x="${X(h)}" y="190" text-anchor="middle">${h===24?'12a':((h%12)||12)+(h<12?'a':'p')}</text>`; });
  g+=`<rect x="${X(ws)}" y="8" width="${X(we)-X(ws)}" height="172" rx="8" fill="rgba(157,140,255,.09)"/><text x="${X(ws)+6}" y="176" style="fill:rgba(157,140,255,.9)">evening window</text>`;
  [['Pace',36],['Food',laneY.food],['Move',laneY.move],['Mind',laneY.mind]].forEach(([t,y])=>{ g+=`<text x="4" y="${y+3}">${t}</text>`; });
  // pace: cumulative calories against an even spread of the target from 7am to 9pm
  const foods=(d.food||[]).map((f,i)=>({h:evHour(f.t,f.meal||'s',i),f})).sort((a,b)=>a.h-b.h);
  const py=v=>66-clamp(v/Math.max(1,T.kcal),0,1.25)*50; let cum=0, pts=[`${X(hMin)},${py(0)}`];
  foods.forEach(o=>{ cum+=o.f.kcal||0; pts.push(`${X(o.h)},${py(cum-o.f.kcal)}`,`${X(o.h)},${py(cum)}`); }); const endH=Math.max(foods.length?foods[foods.length-1].h:hMin,Math.min(nowH,hMax)); pts.push(`${X(endH)},${py(cum)}`);
  g+=`<line x1="${x0}" x2="${x1}" y1="${py(1)}" y2="${py(1)}" stroke="rgba(243,185,79,.4)" stroke-dasharray="3 4"/><text x="${x1}" y="${py(1)-4}" text-anchor="end" style="fill:rgba(243,185,79,.8)">target</text>`;
  g+=`<line x1="${X(7)}" y1="${py(0)}" x2="${X(21)}" y2="${py(1)}" stroke="rgba(160,185,230,.35)" stroke-dasharray="2 4"/>`;
  g+=`<polyline class="draw" pathLength="1" points="${pts.join(' ')}" fill="none" stroke="${cum>T.kcal?'#f3b94f':'#4ea3ff'}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>`;
  // food bubbles
  foods.forEach((o,i)=>{ const r=clamp(5+Math.sqrt(o.f.kcal||0)/3.4,6,17); g+=`<circle class="tlb" style="--i:${i}" cx="${X(o.h).toFixed(1)}" cy="${laneY.food}" r="${r.toFixed(1)}" fill="${MEAL_COL[o.f.meal||'s']}" fill-opacity=".82" data-t="${esc(o.f.name)}: ${o.f.kcal} kcal at ${fmtClock(Math.round(o.h*60))}"/>`; });
  // movement: squares
  const mv=[]; (d.walk||[]).forEach((w,i)=>mv.push({h:evHour(w.t,'walk',i),c:'#3fdba5',t:`Walk ${w.min} min`})); (d.strength||[]).forEach((x,i)=>mv.push({h:evHour(x.t,'str',i),c:'#7ee8c0',t:`Strength ${x.min||''} min`})); (d.stretch||[]).forEach((x,i)=>mv.push({h:evHour(x.t,'mob',i),c:'#9bf2cf',t:`Mobility ${x.min} min`}));
  mv.forEach((o,i)=>{ g+=`<rect class="tlb" style="--i:${i+foods.length}" x="${(X(o.h)-8).toFixed(1)}" y="${laneY.move-8}" width="16" height="16" rx="5" fill="${o.c}" fill-opacity=".9" data-t="${esc(o.t)} at ${fmtClock(Math.round(o.h*60))}"/>`; });
  // mind: diamonds for sessions, triangles for urges
  (d.meditate||[]).forEach((x,i)=>{ const cx=X(evHour(x.t,'med',i)); g+=`<path class="tlb" style="--i:${i}" d="M${cx} ${laneY.mind-9}L${cx+9} ${laneY.mind}L${cx} ${laneY.mind+9}L${cx-9} ${laneY.mind}Z" fill="#9d8cff" fill-opacity=".9" data-t="Meditation ${x.min} min"/>`; });
  (d.urges||[]).forEach((x,i)=>{ const cx=X(evHour(x.t,'urge',i)); g+=`<path class="tlb" style="--i:${i}" d="M${cx} ${laneY.mind-8}L${cx+8} ${laneY.mind+7}L${cx-8} ${laneY.mind+7}Z" fill="${x.outcome==='ate'?'#ff7080':'#f3b94f'}" fill-opacity=".9" data-t="Urge${x.outcome==='ate'?' (ate)':' (handled or planned)'} at ${fmtClock(Math.round(evHour(x.t,'urge',i)*60))}"/>`; });
  if(nowH>=hMin&&nowH<=hMax) g+=`<line x1="${X(nowH)}" x2="${X(nowH)}" y1="10" y2="178" stroke="rgba(233,239,249,.55)" stroke-dasharray="3 3"/><text x="${X(nowH)}" y="8" text-anchor="middle" style="fill:var(--txt)">now</text>`;
  return `<div class="tl"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Your day so far">${g}</svg></div>
    <p class="note" style="margin-top:6px;font-size:12.5px">Circles are meals (bigger is more calories), squares are movement, diamonds are mindful sessions and triangles are urges. The top line tracks your calories against an even pace through the day.</p>`;
}

/* ---- everything logged today, in time order ---- */
function loggedListHtml(k){
  const d=G(k), out=[]; const clk=h=>fmtClock(Math.round(h*60));
  (d.food||[]).forEach((f,i)=>out.push({h:evHour(f.t,f.meal||'s',i),c:MEAL_COL[f.meal||'s'],t:f.name,s:f.kcal+' kcal'+(f.protein?' &middot; '+f.protein+' g protein':'')}));
  (d.walk||[]).forEach((w,i)=>out.push({h:evHour(w.t,'walk',i),c:'#3fdba5',t:'Walk, '+w.min+' min',s:walkMiles(w)+' mi at '+r2(w.speed)+' mph'}));
  (d.strength||[]).forEach((x,i)=>out.push({h:evHour(x.t,'str',i),c:'#7ee8c0',t:'Strength'+(routineLabel('my:'+x.r)||(ROUTINES[x.r]?', '+ROUTINES[x.r].name:'')),s:(x.min||'')+(x.min?' min':'')+(x.rpe?', effort '+x.rpe+'/5':'')}));
  (d.stretch||[]).forEach((x,i)=>out.push({h:evHour(x.t,'mob',i),c:'#9bf2cf',t:'Mobility, '+stretchName(x.id),s:x.min+' min'}));
  (d.meditate||[]).forEach((x,i)=>out.push({h:evHour(x.t,'med',i),c:'#9d8cff',t:'Meditation, '+((MEDITATIONS.find(m=>m.id===x.id)||{title:x.id}).title),s:x.min+' min'}));
  (d.urges||[]).forEach((x,i)=>out.push({h:evHour(x.t,'urge',i),c:x.outcome==='ate'?'#ff7080':'#f3b94f',t:'Urge'+(x.trigger?', '+x.trigger:''),s:x.outcome==='ate'?'Ate':'Handled or planned'}));
  out.sort((a,b)=>a.h-b.h);
  if(!out.length) return `<p class="mut">Nothing logged yet today. Everything you log appears here, in order.</p>`;
  return `<div class="list">${out.map(o=>`<div class="li"><i class="ldot" style="background:${o.c}"></i><div class="grow"><div class="t">${esc(o.t)}</div><div class="s">${o.s}</div></div><span class="mono dim" style="font-size:12.5px">${clk(o.h)}</span></div>`).join('')}</div>`;
}

/* ---------- Today ---------- */
function vToday(){
  const k=TODAY(), d=G(k), pl=dayPlan(k), T=targets(), ft=foodTotals(k), ph=phaseInfo(), lv=levelInfo(), hr=new Date().getHours();
  const stretchId=pl.energy===1?'mini':hr>=19?'wind':pl.energy===2?'desk':'backhip';
  const medId=pl.energy===1?'settle':hr>=16?'offload':'bodyscan5';
  const nr=nextRoutine();
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
  const evening=hr>=15, g=goalPlan(), ev=eveState(), dayStart=new Date().setHours(0,0,0,0);
  const left=Math.round(Math.abs(T.kcal-ft.kcal)), over=ft.kcal>T.kcal, kP=ft.kcal/T.kcal, pP=ft.protein/T.protein;
  const strDone=(G(k).strength||[]).reduce((a,x)=>a+(x.min||0),0), moveMin=walkMin(k)+stretchMin(k)+strDone, movePlan=pl.walk+pl.stretch+((pl.strDay||pl.energy===3)?18:0), mP=movePlan?moveMin/movePlan:0;
  const eatenSinceWin=(d.food||[]).some(f=>f.t>=dayStart&&(new Date(f.t).getHours()*60+new Date(f.t).getMinutes())>=ev.ws);
  const ctx={k,d,pl,T,ft,hr,ev,missions,medMin:medMin(k),eatenSinceWin,doneN:done.length,total:missions.length};
  const rings=[{pct:kP,c1:over?'#f3b94f':'#4ea3ff',c2:over?'#ffd48a':'#27d3ee',o1:'#ff8a5c',o2:'#ffd2bf'},{pct:pP,c1:'#9d8cff',c2:'#c9bfff',o1:'#cfc7ff',o2:'#ffffff'},{pct:mP,c1:'#3fdba5',c2:'#9bf2cf',o1:'#b6f7de',o2:'#ffffff'}];
  const legend=[
    {name:'Calories',c:over?'#f3b94f':'#4ea3ff',val:cu(Math.round(ft.kcal)),of:'of '+T.kcal+' kcal',chip:over?'Over':pctTxt(kP),cls:over?'w':'',status:over?Math.round(ft.kcal-T.kcal)+' kcal over your target':left+' kcal left',desc:'Eaten against your daily target'},
    {name:'Protein',c:'#9d8cff',val:cu(Math.round(ft.protein)),of:'of '+T.protein+' g',chip:pP>=1?'Goal reached':pctTxt(pP),cls:pP>=1?'ok':'',status:pP>=1?(pP>1.03?Math.round(ft.protein-T.protein)+' g past the target':'Right on target'):Math.round(T.protein-ft.protein)+' g to go',desc:'Grams against your daily target'},
    {name:'Movement',c:'#3fdba5',val:cu(moveMin),of:'of '+movePlan+' min',chip:mP>=1?'Goal reached':pctTxt(mP),cls:mP>=1?'ok':'',status:mP>=1?(moveMin>movePlan?(moveMin-movePlan)+' min past the plan':'Plan complete'):(movePlan-moveMin)+' min to go',desc:'Walk, mobility and strength minutes'}];
  const center=`<div class="mono ctr-n">${cu(left)}</div><div class="lbl ctr-l" style="color:${over?'var(--warn)':'var(--dim)'}">${over?'kcal over':'kcal left'}</div>`;
  const stale=(Date.now()-(S.meta.lastBackup||S.meta.created))>14*864e5&&Object.keys(S.days).length>=7;
  const nextCard=d.energy?`<div class="c12">${nextCardHtml(ctx)}</div>`:'';
  const checkin=d.energy?'':`<div class="c12">${panel('How is your energy right now?','',`<p class="mut" style="margin-bottom:16px">Today's plan scales to match. There is no wrong answer.</p><div class="choice" style="grid-template-columns:repeat(3,1fr)">${ENERGY.map(e=>`<button class="opt" data-act="energy" data-v="${e.id}">${ico(e.icon)}<b>${e.name}</b><small>${e.sub}</small></button>`).join('')}</div>`)}</div>`;
  const eveTop=eveningCardHtml(ctx);
  const nLogged=(d.food||[]).length+(d.walk||[]).length+(d.strength||[]).length+(d.stretch||[]).length+(d.meditate||[]).length+(d.urges||[]).length;
  return `<div class="grid">
    ${stale?`<div class="c12"><div class="banner" style="margin:0">${ico('info').replace('<svg','<svg width="20" height="20"')}<div class="grow">Your data lives only in this browser and has not been backed up in over two weeks.</div><button class="btn sm" data-act="exportjson">Back up now</button></div></div>`:''}
    <div class="c12"><section class="hero">${activityRings(rings,244,center)}${ringLegendHtml(legend)}</section>
      <p class="note" style="margin-top:16px;font-size:13px">Each ring fills to 100% of its target. A brighter second lap means you went past it.</p>
      ${ft.n?macroBreak(ft):''}</div>
    <div class="c12"><div class="tiles">${energyTile(d)}${waterTile(d,pl)}${weighTile(d)}${sleepTile(d)}${sessionsTile(k,strDone)}</div></div>
    <div class="c12">${panel('Your day','',dayTimelineHtml(k,T),'',nLogged+' logged')}
      <details class="acc mt12"><summary><span class="note">Everything logged today</span></summary><div class="in">${loggedListHtml(k)}</div></details></div>
    <div class="c12">${weekStripHtml()}</div>
    <div class="c12">${panel('Trend','',`<div class="row between wrap" style="gap:20px;align-items:flex-end"><div class="stat"><div class="big">${cu(ph.w,1)}<small class="mut" style="font-size:15px;letter-spacing:0"> lb</small></div><div class="d"><span class="chip ${g.status==='behind'?'w':'ok'}" style="margin:6px 0">${{ahead:'Ahead of plan',on:'On track',behind:'Behind plan',done:'Goal reached'}[g.status]}</span><br><span class="mut">Trend ${ph.lost>=0?'down':'up'} <b>${r1(Math.abs(ph.lost))}</b> lb since start</span>${ph.raw!=null?`<br><span class="mut">Scale ${ph.raw} lb, ${ph.rawLost>=0?'down':'up'} <b>${r1(Math.abs(ph.rawLost))}</b> from your start</span>`:''}</div></div>
        <div>${sparkline(trendSeries().slice(-30).map(x=>x.t),'#27d3ee',150,56)}</div></div>
        <div class="bar" style="height:5px;margin-top:20px"><i style="width:${Math.round(ph.pct1*100)}%"></i></div><div class="row between note mt8"><span>First 20 lb: ${r1(Math.min(20,Math.max(0,ph.lost)))} of 20</span><span class="mono">${ph.toP1>0?'ETA '+fmtD(ph.p1Date):'Reached'}</span></div>`)}</div>
    <div class="c12">${insightHtml()}</div>
    <div class="c12">${panel('Rank','',`<div class="row gap16">${emblem(lv.lv,60)}<div class="grow"><div class="row between"><b style="font-size:17px">${lv.name}</b><span class="mono mut">Lv ${lv.lv}</span></div><div class="bar"><i style="width:${Math.round(lv.pct*100)}%"></i></div><div class="note mt8">${lv.xp} XP &middot; ${lv.next} to next &middot; streak <b class="mono">${streak()}</b> days</div></div></div>`)}</div>
    <div class="c12"><div class="sugg"><div class="lbl">Suggestions</div><p class="note">What to do next, based on the time of day and how today is going.</p></div></div>
    ${checkin||nextCard}
    ${eveTop}
    <div class="c12">${panel("Today's plan",'',(todo.length?todo.map(m=>missionRow(m)).join(''):`<p class="mut">Everything is complete. Anything more is a bonus.</p>`)+
      (d.energy?`<div class="row between wrap mt12"><span class="note">${ENERGY[d.energy-1].name} energy day. ${d.energy===1?'The minimum counts fully.':'Done is better than perfect.'}</span><button class="lnk" data-act="energy" data-v="0">Change</button></div>`:''),'',`${done.length} of ${missions.length} done`)}
      ${done.length?`<details class="acc mt12"><summary><span class="note">Completed today (${done.length})</span></summary><div class="in">${done.map(m=>missionRow(m)).join('')}</div></details>`:''}</div>
    ${eveTop?'':`<div class="c12">${panel(evening?'Evening window':'Evening plan','',`<p class="mut">${evening?'The after-work hours are your high-risk window. Decompress first, then eat on purpose.':'Evenings are where stress eating tends to hit. A plan helps before it does.'}</p>
      <div class="list mt8"><div class="li"><div class="grow"><div class="t">Work offload meditation</div><div class="s">5 min &middot; leave the day on the shelf</div></div><button class="btn sm" data-act="med" data-id="offload">Start</button></div>
      <div class="li"><div class="grow"><div class="t">Post-dinner walk</div><div class="s">10 min &middot; steadies blood sugar, breaks the snack habit</div></div><button class="btn sm" data-act="walk" data-m="10">Start</button></div></div>`)}</div>`}
    <div class="c12"><div class="quick"><span class="lbl">Quick log</span>
      <button class="lnk" data-act="goto" data-v="fuel">Food</button><button class="lnk" data-act="log" data-kind="sleep">Sleep</button><button class="lnk" data-act="log" data-kind="waist">Waist</button><button class="lnk" data-act="log" data-kind="bp">BP and pulse</button><button class="lnk" data-act="log" data-kind="mood">Mood</button></div></div>
  </div>`;
}
