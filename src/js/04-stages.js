/* ===== HealthForge: overlays, guided sessions ===== */
let lastXP=0, ticks=[], wake=null, AC=null;
function toast(msg){ let t=$('#toast'); t.textContent=msg; t.classList.add('on'); clearTimeout(toast.t); toast.t=setTimeout(()=>t.classList.remove('on'),2600); }
function touch(msg,norender){ const nx=totalXP(), d=nx-lastXP; lastXP=nx; save(); if(msg) toast(msg+(d>0?'   +'+d+' XP':'')); if(!norender) render(); }
function bell(vol=.22){ try{ AC=AC||new (window.AudioContext||window.webkitAudioContext)(); if(AC.state==='suspended') AC.resume(); const t=AC.currentTime;
  [[528,1],[792,.4],[1056,.18]].forEach(([f,a])=>{const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol*a,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+3.2);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+3.3);}); }catch(e){} }
function tickEvery(fn,ms=250){ const id=setInterval(fn,ms); ticks.push(id); return id; }
function clearTicks(){ ticks.forEach(clearInterval); ticks=[]; }
async function keepAwake(){ try{ if(navigator.wakeLock) wake=await navigator.wakeLock.request('screen'); }catch(e){} }
function release(){ try{ wake&&wake.release(); }catch(e){} wake=null; }

function openSheet(html){ const el=$('#sheet'); el.innerHTML=`<div class="scrim" data-act="closeSheet"></div><div class="sheet" role="dialog" aria-modal="true"><button class="icon-btn x" data-act="closeSheet" aria-label="Close">${ico('close')}</button>${html}</div>`; el.classList.add('open'); }
function closeSheet(){ const el=$('#sheet'); el.classList.remove('open'); el.innerHTML=''; }
function openStage(html){ const el=$('#stage'); el.innerHTML=`<div class="stagebox">${html}</div>`; el.classList.add('open'); keepAwake(); }
function setStage(html){ const b=$('#stage .stagebox'); if(b) b.innerHTML=html; }
function closeStage(norender){ clearTicks(); release(); stopDrone(2); const el=$('#stage'); el.classList.remove('open'); el.innerHTML=''; if(!norender) render(); }
const stageHead=(title,sub)=>`<div class="head"><div class="grow" style="text-align:left"><div class="lbl">${esc(sub||'')}</div><h2 style="font-size:20px">${esc(title)}</h2></div><button class="icon-btn" data-act="stageClose" aria-label="Close session">${ico('close')}</button></div>`;
const mmss=s=>{s=Math.max(0,Math.ceil(s));return pad(Math.floor(s/60))+':'+pad(s%60);};
const EXIT_CONFIRM='End this session? Progress in it will not be saved.';

/* ---------- walk ---------- */
function walkStage(target){
  const st={target:target||25,speed:S.settings.lastSpeed||2.5,t0:0};
  const setup=()=>{ setStage(stageHead('Treadmill walk','Move')+`<div class="body">
    <div class="lbl">Duration</div><div class="pill-row" style="justify-content:center">${[10,15,25,40,60].map(m=>`<button class="pill ${m===st.target?'on':''}" data-m="${m}">${m} min</button>`).join('')}</div>
    <div style="width:min(360px,100%)"><div class="row between"><span class="lbl">Speed</span><span class="mono" id="spv">${st.speed.toFixed(1)} mph</span></div><input type="range" id="sp" min="1" max="4.5" step="0.1" value="${st.speed}" style="width:100%;accent-color:#3b9cff"></div>
    <p class="note" style="max-width:420px">A conversational pace you could keep up while on a call. Estimated burn: <b class="mono" id="est">${walkKcal(st.target,st.speed)}</b> kcal. This is bonus, not extra food.</p>
    <button class="btn pri" id="go" style="min-width:200px;padding:15px">${ico('play')} Start</button></div>`);
    $$('#stage [data-m]').forEach(b=>b.onclick=()=>{st.target=+b.dataset.m;setup();});
    const sp=$('#sp'); sp.oninput=()=>{st.speed=+sp.value;$('#spv').textContent=st.speed.toFixed(1)+' mph';$('#est').textContent=walkKcal(st.target,st.speed);};
    $('#go').onclick=run; };
  const run=()=>{ st.t0=Date.now(); S.settings.lastSpeed=st.speed; bell(.1);
    setStage(stageHead('Walking',st.speed.toFixed(1)+' mph')+`<div class="body"><div id="wring"></div><div class="mono mut" id="wrem"></div>
      <div class="row wrap" style="justify-content:center"><button class="btn" id="fin">${ico('check')} Finish and log</button></div></div>`);
    const upd=()=>{ const el=(Date.now()-st.t0)/1000, tot=st.target*60; $('#wring').innerHTML=ring(el/tot,260,'#3b9cff',mmss(el),'elapsed',12,'#22d3ee'); $('#wrem').textContent=el>=tot? 'Target reached. Keep going or finish.' : mmss(tot-el)+' to go';
      if(!st.done && el>=tot){st.done=true;bell();} };
    upd(); tickEvery(upd,500);
    $('#fin').onclick=()=>{ const min=Math.max(1,Math.round((Date.now()-st.t0)/60000)); arr(TODAY(),'walk').push({min,speed:st.speed,t:Date.now()}); closeStage(true); touch('Walk logged: '+min+' min'); }; };
  openStage(''); setup();
}

/* ---------- strength ---------- */
function strengthStage(rid,mini){
  const myR=rid.startsWith('my:')?routineById(rid.slice(3)):null; const R=myR?{id:rid,name:myR.name,items:myR.items}:rid==='custom'?{id:'custom',name:'My workout',items:S.queue.map(id=>[id,EXERCISES[id].sets,EXERCISES[id].reps])}:ROUTINES[rid]; let items=R.items.map(x=>({id:x[0],sets:x[1],reps:x[2]}));
  if(mini) items=items.slice(0,2).map(x=>({...x,sets:2}));
  const steps=[]; items.forEach((it,i)=>{ for(let s=1;s<=it.sets;s++){ steps.push({t:'work',it,s,i}); if(!(i===items.length-1&&s===it.sets)) steps.push({t:'rest',it,s,i}); } });
  let idx=0, t0=Date.now(), rest=0, restEnd=0, rpe=0;
  const paint=()=>{ clearTicks(); const st=steps[idx];
    if(!st) return finish();
    const ex=EXERCISES[st.it.id];
    const prog=`<div class="bar" style="width:min(320px,80vw)"><i style="width:${Math.round(idx/steps.length*100)}%"></i></div>`;
    if(st.t==='work'){
      setStage(stageHead(R.name+(mini?' (mini)':''),'Exercise '+(st.i+1)+' of '+items.length)+`<div class="body">${figurePair(ex.fig)}<div><h2 style="font-size:24px">${esc(ex.name)}</h2><div class="mono mut mt8">Set ${st.s} of ${st.it.sets} &middot; ${esc(st.it.reps)}</div></div>
      <p class="note" style="max-width:520px">${esc(ex.cue)}</p><p class="note dim" style="max-width:520px">${esc(ex.safe)}</p>${prog}
      <div class="row wrap" style="justify-content:center"><button class="btn pri" id="dn" style="padding:14px 28px">${ico('check')} Set done</button><button class="btn ghost" id="sk">${ico('skip')} Skip exercise</button></div></div>`);
      $('#dn').onclick=()=>{idx++;paint();};
      $('#sk').onclick=()=>{ while(idx<steps.length && steps[idx].i===st.i) idx++; paint(); };
    } else {
      const nx=steps[idx+1]; const nex=EXERCISES[nx.it.id]; restEnd=Date.now()+S.settings.restSec*1000;
      setStage(stageHead('Rest','Next: '+nex.name)+`<div class="body"><div id="rr"></div><p class="note">Next up: <b>${esc(nex.name)}</b>, set ${nx.s} of ${nx.it.sets}</p>${prog}<div class="row" style="justify-content:center"><button class="btn" id="pl">+15 sec</button><button class="btn pri" id="sr">${ico('skip')} Skip rest</button></div></div>`);
      const u=()=>{ const r=(restEnd-Date.now())/1000; $('#rr').innerHTML=ring(1-r/S.settings.restSec,220,'#9381ff',mmss(r),'rest',10,'#3b9cff'); if(r<=0){bell(.12);idx++;paint();} };
      u(); tickEvery(u,250); $('#pl').onclick=()=>{restEnd+=15000;}; $('#sr').onclick=()=>{idx++;paint();};
    } };
  const finish=()=>{ clearTicks(); const min=Math.max(1,Math.round((Date.now()-t0)/60000));
    setStage(stageHead('Session complete',R.name)+`<div class="body"><div style="color:var(--ok);width:90px">${ico('check')}</div><h2>Nice work. ${min} minutes.</h2>
    <div><div class="lbl">How hard did that feel?</div><div class="dots mt8" id="rpe">${[1,2,3,4,5].map(n=>`<button data-n="${n}">${n}</button>`).join('')}</div></div>
    <button class="btn pri" id="sv" style="padding:14px 28px">${ico('check')} Save session</button></div>`);
    $$('#rpe button').forEach(b=>b.onclick=()=>{rpe=+b.dataset.n;$$('#rpe button').forEach(x=>x.classList.toggle('on',x===b));});
    $('#sv').onclick=()=>{ arr(TODAY(),'strength').push({r:rid,mini:!!mini,min,rpe,t:Date.now()}); if(!mini&&ROUTINE_ORDER.includes(rid)) S.meta.lastRoutine=ROUTINE_ORDER.indexOf(rid); closeStage(true); touch('Strength session saved'); bell(.1); }; };
  openStage(''); paint();
}

/* ---------- stretch ---------- */
function stretchStage(rid){
  const myR=rid.startsWith('my:')?routineById(rid.slice(3)):null; const R=myR?{id:rid,name:myR.name,items:myR.items.map(x=>x[0]),secs:myR.items.map(x=>x[1])}:rid==='custom'?{id:'custom',name:'My stretch flow',items:S.stretchQueue.slice()}:rid.startsWith('one:')?{id:'one',name:STRETCHES[rid.slice(4)].name,items:[rid.slice(4)]}:STRETCH_ROUTINES.find(r=>r.id===rid); const steps=R.items.map((id,i)=>({id,...STRETCHES[id],...(R.secs?{sec:R.secs[i]}:{})}));
  let idx=0,end=0,paused=false,left=0,total=0,flip=false;
  const go=()=>{ clearTicks(); if(idx>=steps.length) return done(); const s=steps[idx]; left=s.sec; end=Date.now()+left*1000; paused=false; flip=false;
    setStage(stageHead(R.name,'Stretch '+(idx+1)+' of '+steps.length)+`<div class="body">${figurePair(s.fig)}<h2 style="font-size:24px">${esc(s.name)}</h2><div id="sr"></div><div class="mono mut" id="sflip" style="min-height:20px"></div>
      <p class="note" style="max-width:520px">${esc(s.cue)}</p>
      <div class="row wrap" style="justify-content:center"><button class="btn ghost" id="bk" ${idx?'':'disabled'}>${ico('chevL')} Back</button><button class="btn" id="ps">${ico('pause')} Pause</button><button class="btn pri" id="nx">Next ${ico('chevR')}</button></div></div>`);
    const u=()=>{ if(!paused) left=(end-Date.now())/1000; $('#sr').innerHTML=ring(1-left/s.sec,170,'#22d3ee',mmss(left),'seconds',9,'#3b9cff');
      if(/halfway/i.test(s.cue)&&!flip&&left<=s.sec/2){flip=true;$('#sflip').textContent='Switch sides';bell(.08);}
      if(left<=0){ total+=s.sec; idx++; bell(.1); go(); } };
    u(); tickEvery(u,250);
    $('#ps').onclick=()=>{ paused=!paused; if(!paused) end=Date.now()+left*1000; $('#ps').innerHTML=(paused?ico('play')+' Resume':ico('pause')+' Pause'); };
    $('#nx').onclick=()=>{ total+=s.sec-left; idx++; go(); }; $('#bk').onclick=()=>{ idx=Math.max(0,idx-1); go(); }; };
  const done=()=>{ clearTicks(); const min=Math.max(1,Math.round(total/60)); arr(TODAY(),'stretch').push({id:rid,min,t:Date.now()}); bell(.1);
    setStage(stageHead('Done',R.name)+`<div class="body"><div style="color:var(--ok);width:90px">${ico('check')}</div><h2>${min} minutes of mobility logged</h2><button class="btn pri" id="ok">Close</button></div>`);
    $('#ok').onclick=()=>{closeStage(true);touch('Stretch logged');}; };
  openStage(''); go();
}

/* ---------- meditation ---------- */
function meditationStage(mid, minOverride){
  COACH_MID=mid;
  const M=MEDITATIONS.find(m=>m.id===mid); const dur=(minOverride||M.min)*60; let t0=0, cueI=-1, fin=false;
  openStage(stageHead(M.title,M.min+' minute meditation')+`<div class="body"><div id="mv">${auraSvg(0)}</div><p class="note" style="max-width:460px">${esc(M.desc)}<br>Sit or lie comfortably. A soft bell marks the start and end.</p>
    <div class="coach" id="coach">${coachHtml(coachPick(mid))}</div>
    <div style="max-width:520px"><div class="lbl" style="margin-bottom:6px">Sound</div><div class="pill-row" id="dpick" style="justify-content:center">${dronePills()}</div>${droneSlider()}</div>
    <button class="btn pri" id="bg" style="padding:15px 34px">${ico('play')} Begin</button></div>`);
  $('#bg').onclick=()=>{ t0=Date.now(); bell(.18); startDrone(S.settings.drone);
    setStage(stageHead(M.title,'In session')+`<div class="body"><div id="mv">${auraSvg(0)}</div><div id="mc" style="min-height:96px;max-width:520px;font-size:19px;line-height:1.5;transition:opacity .8s"></div><div class="mono mut" id="mt"></div>
      <div class="row" style="justify-content:center"><button class="btn ghost" id="en">End early</button></div></div>`);
    const u=()=>{ const el=(Date.now()-t0)/1000; const p=clamp(el/dur,0,1); const arc=$('#medArc'); if(arc){ const c=2*Math.PI*124; arc.setAttribute('stroke-dashoffset',(c*(1-p)).toFixed(1)); }
      $('#mt').textContent=mmss(dur-el)+' remaining';
      const ci=Math.min(M.cues.length-1,Math.floor(p*M.cues.length)); if(ci!==cueI){ cueI=ci; const mc=$('#mc'); mc.style.opacity=0; setTimeout(()=>{mc.textContent=M.cues[ci];mc.style.opacity=1;},cueI?500:0); }
      if(el>=dur&&!fin){fin=true;finish(dur/60);} };
    u(); tickEvery(u,500); $('#en').onclick=()=>{ const m=(Date.now()-t0)/60000; if(m<1){ closeStage(); } else finish(m); }; };
  const finish=(mins)=>{ clearTicks(); stopDrone(5); bell(.22); const m=Math.max(1,Math.round(mins)); arr(TODAY(),'meditate').push({id:mid,min:m,t:Date.now()});
    setStage(stageHead('Complete',M.title)+`<div class="body"><div id="mv">${auraSvg(1)}</div><h2>${m} minute${m>1?'s':''} logged</h2><p class="note">Take a moment before you move on.</p><button class="btn pri" id="ok">Close</button></div>`);
    $('#ok').onclick=()=>{closeStage(true);touch('Meditation logged');}; };
}

/* ---------- urge interrupter ---------- */
function urgeStage(){
  const rec={t:Date.now(),src:'',trigger:'',outcome:'',note:''}; let end=0; const pm=S.settings.pauseMin||5;
  const step1=()=>{ end=Date.now()+pm*60000;
    setStage(stageHead('Pause','Urge interrupter')+`<div class="body"><p style="font-size:19px;max-width:440px">An urge rises, peaks and passes. Give it ${pm} minutes before deciding anything.</p><div id="ur"></div>
      <div class="note" style="max-width:420px">While you wait: stand up, drink a glass of water, unclench your jaw and shoulders.</div>
      <button class="btn ghost" id="skp">I have waited enough, continue</button></div>`);
    const u=()=>{ const r=(end-Date.now())/1000; $('#ur').innerHTML=ring(1-r/(pm*60),240,'#9381ff',mmss(r),'pause',11,'#22d3ee'); if(r<=0){bell(.1);clearTicks();step2();} };
    u(); tickEvery(u,500); $('#skp').onclick=()=>{clearTicks();step2();}; };
  const step2=()=>{ setStage(stageHead('Check in','Step 2')+`<div class="body"><h2>Where is the urge coming from?</h2>
    <div class="choice" style="width:min(460px,100%)">
      <button class="opt" data-s="hunger" style="flex-direction:row;text-align:left;padding:16px">${ico('fuel')}<span><b>Physical hunger</b><br><small>Stomach feels empty, it has been 3+ hours since I ate</small></span></button>
      <button class="opt" data-s="stress" style="flex-direction:row;text-align:left;padding:16px">${ico('bolt')}<span><b>Stress or emotion</b><br><small>Tense, tired, overwhelmed, or wanting relief</small></span></button>
      <button class="opt" data-s="habit" style="flex-direction:row;text-align:left;padding:16px">${ico('clock')}<span><b>Boredom or habit</b><br><small>It is just that time, or I am avoiding something</small></span></button></div></div>`);
    $$('#stage [data-s]').forEach(b=>b.onclick=()=>{rec.src=b.dataset.s; rec.src==='hunger'?hungry():alts();}); };
  const hungry=()=>{ setStage(stageHead('Planned fuel','Step 3')+`<div class="body"><h2>Eat something planned, protein first</h2><p class="note">Genuine hunger deserves food. Pick one.</p>
    <div style="width:min(480px,100%);text-align:left">${MEALS.s.map(m=>`<div class="li"><div class="grow"><div class="t">${esc(m.n)}</div><div class="s mono">${m.k} kcal &middot; ${m.p} g protein</div></div><button class="btn sm pri" data-eat="${m.id}">Log it</button></div>`).join('')}</div></div>`);
    $$('#stage [data-eat]').forEach(b=>b.onclick=()=>{ const m=MEALS.s.find(x=>x.id===b.dataset.eat); arr(TODAY(),'food').push({id:uid(),name:m.n,kcal:m.k,protein:m.p,meal:'s',t:Date.now()}); rec.outcome='planned'; finishU(); }); };
  const alts=()=>{ setStage(stageHead('Choose a response','Step 3')+`<div class="body" style="align-items:stretch;text-align:left"><h2 style="text-align:center">What is behind it?</h2>
    <div class="pill-row" style="justify-content:center">${TRIGGERS.map(t=>`<button class="pill ${rec.trigger===t?'on':''}" data-tr="${esc(t)}">${esc(t)}</button>`).join('')}</div>
    <div class="lbl" style="text-align:center;margin-top:8px">Try one of these first</div>
    <div class="list">${URGE_ALTS.map((a,i)=>`<div class="li"><div class="grow"><div class="t">${esc(a.t)}</div><div class="s">${esc(a.s)}</div></div>${a.act?`<button class="btn sm" data-alt="${i}">Start</button>`:''}</div>`).join('')}</div>
    <button class="btn pri" id="dd" style="align-self:center;padding:13px 26px">I have decided, continue</button></div>`);
    $$('#stage [data-tr]').forEach(b=>b.onclick=()=>{rec.trigger=b.dataset.tr;$$('#stage [data-tr]').forEach(x=>x.classList.toggle('on',x===b));});
    $$('#stage [data-alt]').forEach(b=>b.onclick=()=>{ const a=URGE_ALTS[+b.dataset.alt].act; rec.outcome='handled'; rec.src=rec.src||'stress'; commitUrge(); closeStage(true); touch('Urge logged');
      if(a==='walk5') walkStage(10); else if(a.startsWith('med:')) meditationStage(a.slice(4)); else if(a.startsWith('str:')) stretchStage(a.slice(4)); else if(a==='fuel'){ view='fuel'; sub.fuel='meals'; render(); } else if(a==='note') openNote(); });
    $('#dd').onclick=finalQ; };
  const finalQ=()=>{ setStage(stageHead('Outcome','Last step')+`<div class="body"><h2>What happened?</h2><div class="choice" style="width:min(440px,100%)">
    <button class="opt" data-o="handled" style="padding:16px"><b>I handled it without eating</b></button>
    <button class="opt" data-o="planned" style="padding:16px"><b>I ate something planned</b></button>
    <button class="opt" data-o="ate" style="padding:16px"><b>I ate anyway</b><small>No judgement, this is data</small></button></div>
    <textarea class="inp" id="un" placeholder="Optional note" style="width:min(440px,100%)"></textarea></div>`);
    $$('#stage [data-o]').forEach(b=>b.onclick=()=>{ rec.outcome=b.dataset.o; rec.note=$('#un').value.trim(); finishU(); }); };
  let saved=false;
  const commitUrge=()=>{ if(saved) return; saved=true; arr(TODAY(),'urges').push({...rec}); };
  const finishU=()=>{ clearTicks(); commitUrge(); const msg={handled:'That is the skill, and you just practiced it.',planned:'Fuel taken care of. Back to your day.',ate:'Logged. One event does not change the trend. Next small step: a 10-minute walk or a glass of water.'}[rec.outcome]||'Logged.';
    setStage(stageHead('Logged','Urge interrupter')+`<div class="body"><div style="color:var(--ok);width:90px">${ico('check')}</div><h2 style="max-width:460px">${msg}</h2><button class="btn pri" id="ok">Close</button></div>`);
    $('#ok').onclick=()=>{closeStage(true);touch('Urge logged');}; };
  openStage(''); step1();
}
function openNote(){ openSheet(`<h2>Write one line</h2><p class="note">Name what is bothering you. It stays on this device.</p><form data-form="note"><div class="field mt12"><textarea class="inp" name="t" rows="3" autofocus></textarea></div><button class="btn pri mt12" type="submit">Save note</button></form>`); }
