/* ===== HealthForge: settings, forms, events, boot ===== */
const NAV=[['today','Today','today'],['fuel','Fuel','fuel'],['move','Move','move'],['mind','Mind','mind'],['progress','Progress','progress']];
const VIEWS={log:vLog,today:vToday,fuel:vFuel,move:vMove,mind:vMind,progress:vProgress,settings:vSettings};
function titleOf(){
  const T=targets();
  return {today:[greeting()+(S.profile&&S.profile.name?', '+S.profile.name:''),fmtDL(TODAY())+'  |  Day '+(S.profile?dayN():1)],fuel:['Fuel',T.kcal+' kcal  |  '+T.protein+' g protein'],move:['Move','Walk first, lift lightly, stay loose'],mind:['Mind','Calm the system, track the strain'],progress:['Progress','Trend over noise'],settings:['Settings','Profile, plan and data'],log:['Day log','Review and edit anything you logged']}[view];
}
let renderedDay=TODAY();
function render(){
  if(!S.profile) return; renderedDay=TODAY();
  const y=window.scrollY; const t=titleOf();
  $('#ttl').textContent=t[0]; $('#sub').textContent=t[1];
  $('#view').innerHTML=VIEWS[view]();
  $$('[data-nav]').forEach(b=>b.classList.toggle('on',b.dataset.nav===view));
  mountCharts($('#view'));
  const lv=levelInfo(); $('#rankmini').innerHTML=`<div class="row" style="gap:10px">${emblem(lv.lv,38)}<div class="grow"><div class="row"><b>${lv.name}</b></div><div class="note">Lv ${lv.lv} &middot; ${lv.xp} XP</div></div></div><div class="bar"><i style="width:${Math.round(lv.pct*100)}%"></i></div>`;
  window.scrollTo(0,y);
}
function go(v){ if(DR&&DR.preview) stopDrone(1); if(v==='log') logDay=TODAY(); view=v; history.replaceState(null,'','#'+v); render(); window.scrollTo(0,0); }

/* ---------- settings view ---------- */
function vSettings(){
  const p=S.profile, st=S.settings;
  return `<div class="grid">
  <div class="c7">${panel('Profile and plan','user',`<form data-form="settings" class="grid" style="gap:12px;grid-template-columns:1fr 1fr">
    <div class="field"><label>Name</label><input class="inp" name="name" value="${esc(p.name||'')}"></div>
    <div class="field"><label>Date of birth</label><input class="inp" name="dob" type="date" value="${p.dob}"></div>
    <div class="field"><label>Height (inches)</label><input class="inp" name="heightIn" type="number" step="0.5" value="${p.heightIn}"></div>
    <div class="field"><label>Start weight (lb)</label><input class="inp" name="startWeight" type="number" step="0.1" value="${p.startWeight}"></div>
    <div class="field"><label>Start date</label><input class="inp" name="startDate" type="date" value="${p.startDate}"></div>
    <div class="field"><label>Goal weight (lb)</label><input class="inp" name="goalWeight" type="number" step="0.5" value="${p.goalWeight}"></div>
    <div class="field"><label>Target date for goal</label><input class="inp" name="goalDate" type="date" value="${p.goalDate||addDays(p.startDate,240)}"></div>
    <div class="field"><label>Pace (lb per week)</label><select class="inp" name="pace">${[1,1.5,2].map(v=>`<option ${v===p.pace?'selected':''}>${v}</option>`).join('')}</select></div>
    <div class="field"><label>Activity multiplier</label><input class="inp" name="activity" type="number" step="0.05" min="1.2" max="1.8" value="${p.activity||1.35}"></div>
    <div class="field"><label>Calorie override (blank = auto)</label><input class="inp" name="kcalOverride" type="number" value="${p.kcalOverride||''}"></div>
    <div class="field"><label>Protein override (g)</label><input class="inp" name="proteinOverride" type="number" value="${p.proteinOverride||''}"></div>
    <div class="field"><label>Burn estimate override (kcal)</label><input class="inp" name="tdeeOverride" type="number" value="${p.tdeeOverride||''}"></div>
    <div class="field"><label>Mode</label><select class="inp" name="mode"><option value="lose" ${st.mode==='lose'?'selected':''}>Fat loss</option><option value="maintain" ${st.mode==='maintain'?'selected':''}>Maintenance</option></select></div>
    <div class="field" style="grid-column:span 2"><label>Strength days</label><div class="pill-row">${DOW.map((d,i)=>`<label class="pill ${st.strengthDays.includes(i)?'on':''}" style="cursor:pointer"><input type="checkbox" name="sd" value="${i}" class="sr" ${st.strengthDays.includes(i)?'checked':''} onchange="this.parentNode.classList.toggle('on',this.checked)">${d}</label>`).join('')}</div></div>
    <div class="field"><label>Rest between sets (sec)</label><input class="inp" name="restSec" type="number" value="${st.restSec}"></div>
    <div class="field"><label>Urge pause (min)</label><input class="inp" name="pauseMin" type="number" min="1" max="15" value="${st.pauseMin}"></div>
    <div class="field"><label>Water goal (glasses)</label><input class="inp" name="waterGoal" type="number" min="3" max="14" value="${st.waterGoal}"></div>
    <button class="btn pri" style="grid-column:span 2" type="submit">Save changes</button></form>`)}</div>
  <div class="c5 grid" style="grid-template-columns:1fr;align-content:start">
   ${panel('Backup and AI analysis','download',`<p class="mut">All data lives only in this browser. Export regularly. ${S.meta.lastBackup?'Last backup: '+new Date(S.meta.lastBackup).toLocaleDateString():'No backup yet.'}</p>
     <div class="row wrap mt12"><button class="btn sm pri" data-act="exportjson">${ico('download')} Backup (JSON)</button><label class="btn sm" style="cursor:pointer">${ico('upload')} Restore<input type="file" accept=".json,application/json" class="sr" id="imp"></label></div>
     <hr class="sep"><div class="lbl">Summary for Claude or any AI</div><p class="note mt8">A readable summary of your recent data plus a ready-made prompt. Paste it into a chat for deeper analysis.</p>
     <div class="row wrap mt8"><select class="inp" id="sumdays" style="width:auto"><option value="14">Last 14 days</option><option value="28" selected>Last 28 days</option><option value="90">Last 90 days</option></select><button class="btn sm" data-act="sumcopy">${ico('copy')} Copy</button><button class="btn sm" data-act="sumdl">${ico('download')} Save .md</button></div>`)}
   ${panel('Install on your phone','share',`<p class="mut">Host this folder on any HTTPS site (for example GitHub Pages or Netlify), open it on your phone, and use Add to Home Screen. Phone and desktop keep separate data. Use Backup and Restore to move data between them.</p><p class="note mt8">${storageOK?'Storage is working.':'Storage is blocked in this browser: data will not persist.'}</p>`)}
   ${panel('Data tools','gear',`<div class="row wrap"><button class="btn sm" data-act="demo">Load demo data</button><button class="btn sm danger" data-act="wipe">${ico('trash')} Erase everything</button></div><p class="note mt8">Demo data replaces what is here, so back up first. Not medical advice; talk to your doctor before major changes, especially with insulin resistance or high blood pressure.</p>`)}
  </div></div>`;
}

/* ---------- log sheets ---------- */
function logSheet(kind,k=TODAY()){
  const d=G(k); const dateF=`<div class="field"><label>Date</label><input class="inp" type="date" name="date" value="${k}" max="${TODAY()}"></div>`;
  const forms={
    weight:['Log weight',`<div class="field"><label>Weight (lb)</label><input class="inp" name="weight" type="number" step="0.1" inputmode="decimal" value="${d.weight||lastRaw()||''}" required autofocus></div>`],
    sleep:['Log sleep',`<div class="field"><label>Hours slept</label><input class="inp" name="sleepH" type="number" step="0.25" min="0" max="16" value="${d.sleepH||''}" required autofocus></div><div class="field"><label>Quality (1-5)</label><select class="inp" name="sleepQ">${[1,2,3,4,5].map(n=>`<option ${n===(d.sleepQ||3)?'selected':''}>${n}</option>`).join('')}</select></div>`],
    waist:['Log measurements',`<div class="field"><label>Waist at navel (in)</label><input class="inp" name="waist" type="number" step="0.25" value="${d.waist||''}" required autofocus></div><div class="field"><label>Hips (in, optional)</label><input class="inp" name="hips" type="number" step="0.25" value="${d.hips||''}"></div><div class="field"><label>Chest (in, optional)</label><input class="inp" name="chest" type="number" step="0.25" value="${d.chest||''}"></div>`],
    bp:['Blood pressure and pulse',`<div class="frow"><div class="field"><label>Systolic</label><input class="inp" name="bpS" type="number" value="${d.bpS||''}" autofocus></div><div class="field"><label>Diastolic</label><input class="inp" name="bpD" type="number" value="${d.bpD||''}"></div></div><div class="field"><label>Resting heart rate</label><input class="inp" name="rhr" type="number" value="${d.rhr||''}"></div>`],
    energy:['Energy',`<div class="field"><label>Energy level</label><select class="inp" name="energy">${ENERGY.map(e=>`<option value="${e.id}" ${e.id===(d.energy||2)?'selected':''}>${e.name} - ${e.sub}</option>`).join('')}</select></div>`],
    water:['Water',`<div class="field"><label>Glasses</label><input class="inp" name="water" type="number" min="0" max="30" value="${d.water||''}" required autofocus></div>`],
    mood:['Log mood',`<div class="field"><label>Mood right now (1 low, 5 great)</label><div class="dots" id="mdots">${[1,2,3,4,5].map(n=>`<button type="button" class="${n===d.mood?'on':''}" data-v="${n}">${n}</button>`).join('')}</div><input type="hidden" name="mood" value="${d.mood||''}" required></div>`]
  };
  const f=forms[kind]; const has=(SCALARS.find(s=>s[0]===kind)||[])[3]&&SCALARS.find(s=>s[0]===kind)[3](d);
  openSheet(`<h2>${f[0]}</h2><form data-form="log" data-kind="${kind}" data-orig="${k}" class="grid" style="gap:12px;grid-template-columns:1fr;margin-top:14px">${f[1]}${dateF}<div class="row wrap"><button class="btn pri" type="submit">Save</button>${has?`<button class="btn danger" type="button" data-act="scalardel" data-kind="${kind}" data-k="${k}" data-close="1">${ico('trash')} Delete</button>`:''}</div></form>`);
  $$('#mdots button').forEach(b=>b.onclick=()=>{$('input[name=mood]').value=b.dataset.v;$$('#mdots button').forEach(x=>x.classList.toggle('on',x===b));});
}

/* ---------- generic item editor ---------- */
const EDEF={
  food:[['name','Name','text'],['kcal','Calories','number'],['protein','Protein (g)','number'],['meal','Meal','sel',()=>Object.entries(MEAL_LABELS)]],
  walk:[['min','Minutes','number','1'],['speed','Speed (mph)','number','any'],['dist','Distance (mi)','number','any']],
  strength:[['r','Routine','sel',()=>[...ROUTINE_ORDER.map(r=>[r,ROUTINES[r].name]),['custom','My workout'],...S.routines.filter(r=>r.kind==='s').map(r=>['my:'+r.id,r.name])]],['min','Minutes','number'],['rpe','Effort (1-5)','number'],['mini','Mini version','bool']],
  stretch:[['id','Routine','sel',()=>[...STRETCH_ROUTINES.map(r=>[r.id,r.name]),['custom','My stretch flow'],...S.routines.filter(r=>r.kind==='t').map(r=>['my:'+r.id,r.name]),['one','Single stretch']]],['min','Minutes','number']],
  meditate:[['id','Meditation','sel',()=>MEDITATIONS.map(m=>[m.id,m.title])],['min','Minutes','number']],
  urges:[['src','Source','sel',()=>[['hunger','Physical hunger'],['stress','Stress or emotion'],['habit','Boredom or habit']]],['trigger','Trigger','sel',()=>[['','None'],...TRIGGERS.map(t=>[t,t])]],['outcome','Outcome','sel',()=>[['handled','Handled without eating'],['planned','Ate something planned'],['ate','Ate anyway']]],['note','Note','text']],
  recovery:[['what','Drained by','sel',()=>DRAINERS.map(t=>[t,t])],['lvl','Drain level (1-5)','number'],['rc','Recharge with','sel',()=>RECHARGE.map(t=>[t,t])],['note','Note','text']],
  notes:[['text','Note','area']]
};
const EDEFAULT={food:()=>({name:'',kcal:0,protein:0,meal:mealOfNow()}),walk:()=>({min:15,speed:S.settings.lastSpeed||2.5}),strength:()=>({r:'A',min:18,rpe:3,mini:false}),stretch:()=>({id:'desk',min:5}),meditate:()=>({id:'settle',min:3}),urges:()=>({src:'stress',trigger:'',outcome:'handled',note:''}),recovery:()=>({what:DRAINERS[0],lvl:3,rc:RECHARGE[0],note:''}),notes:()=>({text:''})};
function editItem(type,k,i){
  const old=i>=0?(G(k)[type]||[])[i]:null; if(i>=0&&!old) return; const x=Object.assign({},old||EDEFAULT[type]()); if(type==='walk') x.dist=walkMiles(x);
  const fields=EDEF[type].map(([key,label,kind,opt])=>{
    const val=x[key]==null?'':x[key];
    if(kind==='sel') return `<div class="field"><label>${label}</label><select class="inp" name="${key}">${opt().map(o=>`<option value="${esc(o[0])}" ${String(o[0])===String(val)?'selected':''}>${esc(o[1])}</option>`).join('')}</select></div>`;
    if(kind==='bool') return `<label class="row" style="gap:10px;font-size:14px"><input type="checkbox" name="${key}" ${val?'checked':''}> ${label}</label>`;
    if(kind==='area') return `<div class="field"><label>${label}</label><textarea class="inp" name="${key}" rows="3">${esc(val)}</textarea></div>`;
    return `<div class="field"><label>${label}</label><input class="inp" name="${key}" type="${kind==='number'?'number':'text'}" ${kind==='number'?`step="${opt||'any'}" inputmode="decimal"`:''} value="${esc(val)}"></div>`;
  }).join('');
  openSheet(`<h2>${i>=0?'Edit':'Add'} ${ITEMS[type].title.toLowerCase()}</h2><form data-form="edit" data-t="${type}" data-k="${k}" data-i="${i}" class="grid" style="gap:12px;grid-template-columns:1fr;margin-top:14px">${fields}<div class="field"><label>Date</label><input class="inp" type="date" name="__date" value="${k}" max="${TODAY()}"></div>
    <div class="row wrap"><button class="btn pri" type="submit">Save</button>${i>=0?`<button class="btn danger" type="button" data-act="itemdel" data-t="${type}" data-k="${k}" data-i="${i}" data-close="1">${ico('trash')} Delete</button>`:''}</div></form>`);
}

/* ---------- forms ---------- */
const FORMS={
  food(f){ const v=Object.fromEntries(new FormData(f)); const item={id:uid(),name:v.name.trim(),kcal:num(v.kcal)||0,protein:num(v.protein)||0,meal:v.meal,t:Date.now()};
    arr(fuelDay,'food').push(item); if(v.fav) S.favs.push({name:item.name,kcal:item.kcal,protein:item.protein}); touch('Added '+item.name); },
  walk(f){ const v=Object.fromEntries(new FormData(f)); const min=num(v.min)||0, di=num(v.dist)||0; let sp=di>0&&min>0?di*60/min:(num(v.speed)||2.5);
    if(!(min>0)){ toast('Enter the minutes'); return; } if(sp<0.3||sp>9){ toast('That distance does not fit that time. Check the numbers.'); return; }
    sp=Math.round(sp*1000)/1000; arr(TODAY(),'walk').push({min,speed:sp,t:Date.now()}); touch('Walk logged: '+walkMiles({min,speed:sp})+' mi'); },
  recovery(f){ const v=Object.fromEntries(new FormData(f)); arr(TODAY(),'recovery').push({what:v.what,lvl:+v.lvl,rc:v.rc,note:v.note,t:Date.now()}); touch('Entry added'); },
  note(f){ const v=Object.fromEntries(new FormData(f)); if(v.t.trim()) arr(TODAY(),'notes').push({text:v.t.trim(),t:Date.now()}); closeSheet(); touch('Note saved'); },
  log(f){ const v=Object.fromEntries(new FormData(f)); const k=v.date||TODAY(); const d=D(k); const kind=f.dataset.kind;
    const setn=(key)=>{ const n=num(v[key]); if(n!=null) d[key]=n; };
    const orig=f.dataset.orig; if(orig&&orig!==k){ ((SCALARS.find(s=>s[0]===kind)||[])[4]||[]).forEach(key=>{ if(S.days[orig]) delete S.days[orig][key]; }); }
    if(kind==='energy') setn('energy'); if(kind==='water') setn('water');
    if(kind==='weight') setn('weight'); if(kind==='sleep'){setn('sleepH');setn('sleepQ');} if(kind==='waist'){setn('waist');setn('hips');setn('chest');} if(kind==='bp'){setn('bpS');setn('bpD');setn('rhr');} if(kind==='mood') setn('mood');
    closeSheet(); touch('Saved'); },
  edit(f){ const fd=new FormData(f); const type=f.dataset.t, k0=f.dataset.k, i=+f.dataset.i, nk=fd.get('__date')||k0; const obj={};
    EDEF[type].forEach(([key,label,kind])=>{ if(kind==='bool') obj[key]=fd.get(key)!==null; else if(kind==='number') obj[key]=num(fd.get(key))||0; else obj[key]=(fd.get(key)||'').toString().trim(); });
    if(type==='walk'){ if(obj.min>0&&obj.dist>0) obj.speed=Math.round(obj.dist*60/obj.min*1000)/1000; delete obj.dist; if(!(obj.min>0)||obj.speed<0.3||obj.speed>9){ toast('Check the minutes and speed or distance'); return; } }
    if(type==='notes'&&!obj.text){ toast('Write something first'); return; } if(type==='food'&&!obj.name){ toast('Add a name'); return; }
    if(i>=0){ const list=D(k0)[type]; const old=list[i]; const item=Object.assign({},old,obj); if(nk===k0) list[i]=item; else { list.splice(i,1); arr(nk,type).push(item); } }
    else arr(nk,type).push(Object.assign({id:uid(),t:Date.now()},obj));
    if(view==='log'&&nk!==logDay) logDay=nk; closeSheet(); touch('Saved'); },
  settings(f){ const fd=new FormData(f); const v=Object.fromEntries(fd); const p=S.profile;
    Object.assign(p,{name:v.name,dob:v.dob,heightIn:num(v.heightIn)||p.heightIn,startWeight:num(v.startWeight)||p.startWeight,startDate:v.startDate||p.startDate,goalWeight:num(v.goalWeight)||p.goalWeight,goalDate:v.goalDate||p.goalDate,pace:num(v.pace)||1.5,activity:num(v.activity)||1.35,kcalOverride:num(v.kcalOverride)||0,proteinOverride:num(v.proteinOverride)||0,tdeeOverride:num(v.tdeeOverride)||0});
    S.settings.strengthDays=fd.getAll('sd').map(Number); S.settings.restSec=num(v.restSec)||45; S.settings.pauseMin=num(v.pauseMin)||5; S.settings.waterGoal=num(v.waterGoal)||8; S.settings.mode=v.mode; touch('Settings saved'); }
};

/* ---------- actions ---------- */
const ACT={
  itemedit(t){ editItem(t.dataset.t,t.dataset.k||logDay,+t.dataset.i); },
  async itemdel(t){ const list=(S.days[t.dataset.k]||{})[t.dataset.t]; if(!list) return; if(!await uiConfirm('This entry will be removed from your log.',{title:'Delete this entry?'})) return; list.splice(+t.dataset.i,1); if(t.dataset.close) closeSheet(); touch('Deleted'); },
  scalaredit(t){ logSheet(t.dataset.kind,logDay); },
  async scalardel(t){ const k=t.dataset.k||logDay; if(!await uiConfirm('This entry will be removed from your log.',{title:'Delete this entry?'})) return; const sc=SCALARS.find(s=>s[0]===t.dataset.kind); if(S.days[k]) sc[4].forEach(key=>delete S.days[k][key]); if(t.dataset.close) closeSheet(); touch('Deleted'); },
  lday(t){ const v=t.dataset.v; if(v==='today') logDay=TODAY(); else { const n=addDays(logDay,+v); if(n<=TODAY()) logDay=n; } render(); },
  libgo(t){ lib.type=t.dataset.t; sub.move='lib'; render(); },
  libtype(t){ lib.type=t.dataset.v; lib.cat=''; lib.eq=''; render(); },
  libcat(t){ lib.cat=t.dataset.v; render(); },
  libeq(t){ lib.eq=t.dataset.v; render(); },
  libopen(t){ libDetail(t.dataset.id); },
  qtoggle(t){ const id=t.dataset.id, q=EXERCISES[id]?S.queue:S.stretchQueue, i=q.indexOf(id); i<0?q.push(id):q.splice(i,1); save(); closeSheet(); render(); toast(i<0?'Added to your list':'Removed'); },
  qdel(t){ (t.dataset.k==='s'?S.queue:S.stretchQueue).splice(+t.dataset.i,1); save(); render(); },
  qclear(t){ if(t.dataset.k==='s') S.queue=[]; else S.stretchQueue=[]; save(); render(); },
  stretch1(t){ closeSheet(); stretchStage('one:'+t.dataset.id); },
  qgen(){ S.queue=genWorkout(); save(); render(); toast('Workout built: '+S.queue.length+' exercises'); },
  closeSheet(){closeSheet();},
  async stageClose(){ if(await uiConfirm('Progress in this session will not be saved.',{title:'End this session?',yes:'End session',no:'Keep going'})) closeStage(); },
  goto(t){ go(t.dataset.v); },
  sub(t){ if(t.dataset.k==='fuel'||t.dataset.k==='move'||t.dataset.k==='mind') sub[t.dataset.k]=t.dataset.v; if(t.dataset.go) view=t.dataset.go; render(); },
  energy(t){ const v=+t.dataset.v; const d=D(TODAY()); if(v===0) delete d.energy; else d.energy=v; touch(v?'Check-in saved':''); },
  walk(t){ walkStage(+t.dataset.m); },
  stretch(t){ stretchStage(t.dataset.id); },
  strength(t){ strengthStage(t.dataset.r,!!t.dataset.mini); },
  med(t){ meditationStage(t.dataset.id); },
  urge(){ urgeStage(); },
  water(){ const d=D(TODAY()); d.water=(d.water||0)+1; touch('Water +1'); },
  log(t){ logSheet(t.dataset.kind); },
  note(){ openNote(); },
  range(t){ progRange=+t.dataset.v; render(); },
  fday(t){ const n=addDays(fuelDay,+t.dataset.v); if(n<=TODAY()){fuelDay=n;render();} },
  fooddel(t){ const d=D(fuelDay); d.food=(d.food||[]).filter(f=>f.id!==t.dataset.id); touch(''); },
  favadd(t){ const f=S.favs[+t.dataset.i]; arr(fuelDay,'food').push({id:uid(),name:f.name,kcal:f.kcal,protein:f.protein,meal:mealOfNow(),t:Date.now()}); touch('Added '+f.name); },
  favdel(t){ S.favs.splice(+t.dataset.i,1); touch(''); },
  walkdel(t){ D(TODAY()).walk.splice(+t.dataset.i,1); touch(''); },
  routinepick(t){ sub.routine=t.dataset.r; render(); },
  mealadd(t){ const x=MEALS[t.dataset.m].find(y=>y.id===t.dataset.id); arr(TODAY(),'food').push({id:uid(),name:x.n,kcal:x.k,protein:x.p,meal:t.dataset.m,t:Date.now()}); touch('Logged '+x.n); },
  mealplan(t){ const l=S.plan[t.dataset.m], i=l.indexOf(t.dataset.id); i<0?l.push(t.dataset.id):l.splice(i,1); touch('',false); },
  gck(t){ S.groceryChecked[t.dataset.n]=t.checked; save(); render(); },
  gclear(){ S.groceryChecked={}; touch(''); },
  gcopy(){ const items=planItems(); const txt=Object.keys(items).sort().map(a=>a+'\n'+[...items[a]].sort().map(n=>'  - '+n).join('\n')).join('\n\n'); copyText(txt,'List copied'); },
  adopt(t){ S.profile.tdeeOverride=+t.dataset.v; touch('Burn estimate adopted'); },
  exportjson(){ S.meta.lastBackup=Date.now(); saveNow(); downloadFile('healthforge-backup-'+dk()+'.json',JSON.stringify(S,null,1),'application/json'); render(); },
  sumcopy(){ copyText(buildSummary(+$('#sumdays').value),'Summary copied'); },
  sumdl(){ downloadFile('healthforge-summary-'+dk()+'.md',buildSummary(+$('#sumdays').value),'text/markdown'); },
  async demo(){ if(await uiConfirm('Everything you have logged will be replaced by sample data.',{title:'Load demo data?',yes:'Replace my data'})){ loadDemo(); toast('Demo data loaded'); go('today'); } },
  async wipe(){ if(await uiConfirm('All HealthForge data on this device will be erased. This cannot be undone.',{title:'Erase everything?',yes:'Continue'})&&await uiConfirm('Last check: every log, meal, routine and setting will be permanently deleted.',{title:'Really erase everything?',yes:'Erase it all'})){ localStorage.removeItem(KEY); location.reload(); } }
};
function copyText(txt,msg){ (navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(()=>toast(msg),()=>{ const ta=document.createElement('textarea'); ta.value=txt; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy');toast(msg);}catch(e){toast('Copy failed');} ta.remove(); }); }
function downloadFile(name,txt,type){ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([txt],{type})); a.download=name; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500); }

/* ---------- workout generator ---------- */
function genWorkout(){
  const pick=a=>a[Math.floor(Math.random()*a.length)]; const out=[];
  const pool=cat=>Object.values(EXERCISES).filter(x=>x.cat===cat&&!x.j.some(v=>v>=3));
  const energy=energyOf(TODAY())||2; const cats=energy===1?['Legs','Push','Core']:['Legs','Glutes and hinge','Push','Pull','Core'];
  cats.forEach(c=>{ const p=pool(c); if(p.length) out.push(pick(p).id); });
  return out;
}

/* ---------- AI summary ---------- */
function buildSummary(n){
  const p=S.profile, T=targets(), ph=phaseInfo(); const end=TODAY(), start=addDays(end,-(n-1)); const rate=recentRate();
  let m=`# HealthForge summary (${fmtD(start)} to ${fmtD(end)})\n\n## Profile\n- Male, age ${ageNow()}, height ${p.heightIn} in, start weight ${p.startWeight} lb (${p.startDate}), goal ${p.goalWeight} lb, pace ${p.pace} lb/week\n- Trend weight now: ${r1(ph.w)} lb (change ${r1(-ph.lost)} lb since start), recent rate ${rate!=null?r1(rate)+' lb/week':'n/a'}\n- Targets: ${T.kcal} kcal, ${T.protein} g protein (estimated burn ${T.tdee} kcal, mode ${S.settings.mode})\n- Context: stress eating mostly in the evening; introvert in a new management role; insulin resistance; avoids red meat, most eggs, leafy salads; knee, back, hip and shoulder stiffness\n\n## Daily log\n| Date | Wt | Energy | Mood | Kcal | Protein | Walk min | Strength | Stretch min | Med min | Sleep h | Urges |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n`;
  for(let i=0;i<n;i++){ const k=addDays(start,i), d=G(k), ft=foodTotals(k); m+=`| ${k} | ${d.weight||''} | ${d.energy||''} | ${d.mood||''} | ${ft.n?Math.round(ft.kcal):''} | ${ft.n?Math.round(ft.protein):''} | ${walkMin(k)||''} | ${strengthN(k)||''} | ${stretchMin(k)||''} | ${medMin(k)||''} | ${d.sleepH||''} | ${(d.urges||[]).length||''} |\n`; }
  const urges=[]; for(let i=0;i<n;i++){ const k=addDays(start,i); (G(k).urges||[]).forEach(u=>urges.push({k,...u})); }
  m+=`\n## Urge events (${urges.length})\n`+(urges.length? urges.map(u=>`- ${u.k} ${new Date(u.t).toTimeString().slice(0,5)}: ${u.src||'?'} / ${u.trigger||'no trigger'} / outcome ${u.outcome||'?'}${u.note?' / '+u.note:''}`).join('\n'):'None logged.');
  const rec=[]; for(let i=0;i<n;i++){ const k=addDays(start,i); (G(k).recovery||[]).forEach(r=>rec.push({k,...r})); }
  m+=`\n\n## Manager recovery log\n`+(rec.length? rec.map(r=>`- ${r.k}: ${r.what}, drain ${r.lvl}/5, recharge ${r.rc}${r.note?' ('+r.note+')':''}`).join('\n'):'None logged.');
  const meas=Object.keys(S.days).filter(k=>S.days[k].waist||S.days[k].bpS).sort().slice(-8);
  m+=`\n\n## Measurements and vitals\n`+(meas.length?meas.map(k=>`- ${k}: ${S.days[k].waist?'waist '+S.days[k].waist+' in; ':''}${S.days[k].bpS?'BP '+S.days[k].bpS+'/'+S.days[k].bpD+'; ':''}${S.days[k].rhr?'RHR '+S.days[k].rhr:''}`).join('\n'):'None.');
  m+=`\n\n## Prompt\nYou are my supportive, matter-of-fact health coach. Using the data above: 1) summarize what is working and what is not, 2) identify my top three stress-eating patterns and what triggers them, 3) check whether my calorie and protein targets still fit my actual weight trend, 4) suggest three small, low-effort changes for the next two weeks that fit an introvert with limited mental energy, 5) flag anything that should be discussed with a doctor. No guilt, keep it concise.\n`;
  return m;
}

/* ---------- demo data ---------- */
function loadDemo(){
  let seed=7; const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};
  const startK=addDays(TODAY(),-69); const T0=defaults();
  T0.profile={name:'Demo',dob:'1979-12-15',heightIn:73,startWeight:265,startDate:startK,goalWeight:220,pace:1.5,activity:1.35,kcalOverride:0,proteinOverride:0,tdeeOverride:0};
  S=T0; S.meta.created=Date.now();
  for(let i=0;i<70;i++){ const k=addDays(startK,i), dow=pd(k).getDay(); if(rnd()<.12) continue; const d=D(k);
    d.energy=rnd()<.25?1:rnd()<.65?2:3; d.mood=Math.max(1,Math.min(5,Math.round(2+d.energy*.8+rnd()*1.4-.5)));
    if(rnd()<.8) d.weight=r1(265-i*.17+(rnd()-.5)*3);
    d.sleepH=r1(5.5+rnd()*2.5); d.water=Math.floor(4+rnd()*5);
    const kc=Math.round(1900+rnd()*500+(d.sleepH<6.5?250:0)); d.food=[{id:uid(),name:'Breakfast',kcal:Math.round(kc*.2),protein:30,meal:'b',t:0},{id:uid(),name:'Lunch',kcal:Math.round(kc*.3),protein:42,meal:'l',t:0},{id:uid(),name:'Dinner',kcal:Math.round(kc*.35),protein:48,meal:'d',t:0},{id:uid(),name:'Snack',kcal:Math.round(kc*.15),protein:20,meal:'s',t:0}];
    d.walk=rnd()<.8?[{min:Math.round(10+rnd()*30),speed:2.5,t:0}]:[]; if([1,3,5].includes(dow)&&rnd()<.8) d.strength=[{r:'ABC'[Math.floor(rnd()*3)],mini:false,min:18,rpe:3,t:0}];
    if(rnd()<.6) d.stretch=[{id:'desk',min:4,t:0}]; if(rnd()<.5) d.meditate=[{id:'settle',min:3,t:0}];
    if(rnd()<.35){ d.urges=[{t:new Date(2026,0,1,16+Math.floor(rnd()*5),Math.floor(rnd()*60)).getTime(),src:'stress',trigger:TRIGGERS[Math.floor(rnd()*4)],outcome:rnd()<.6?'handled':rnd()<.5?'planned':'ate'}]; }
    if(rnd()<.2) d.recovery=[{what:DRAINERS[Math.floor(rnd()*5)],lvl:2+Math.floor(rnd()*4),rc:RECHARGE[Math.floor(rnd()*4)],note:'',t:0}];
    if(i%7===0) d.waist=r1(44-i*.04); if(i%9===0){ d.bpS=Math.round(138-i*.1+rnd()*6); d.bpD=Math.round(88-i*.05+rnd()*4); d.rhr=Math.round(74-i*.05+rnd()*4); }
  }
  saveNow(); lastXP=totalXP();
}

/* ---------- onboarding ---------- */
function onboarding(){
  const v={name:'',dob:'1979-12-15',heightIn:73,startWeight:265,goalWeight:220,goalDate:addDays(TODAY(),240),pace:1.5}; let step=0;
  const root=document.createElement('div'); root.className='onb'; document.body.appendChild(root);
  const paint=()=>{
    const dots=`<div class="steps">${[0,1,2].map(i=>`<i class="${i<=step?'on':''}"></i>`).join('')}</div>`;
    let body='';
    if(step===0) body=`<div class="row gap16"><div style="width:56px">${logoSvg('ob')}</div><div><h1 style="font-size:30px;letter-spacing:2px">HEALTHFORGE</h1><div class="lbl">Build the body you keep</div></div></div>
      <p style="font-size:17px" class="mut">A calm, low-effort system for losing the first 20 lb, reaching your goal in 6 to 9 months, and staying there. It adapts to your energy each day, helps with stress eating, and treats a bad day as data, not failure.</p>
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:12px"><div class="field"><label>Your name (optional)</label><input class="inp" id="o_name" value="${esc(v.name)}"></div><div class="field"><label>Date of birth</label><input class="inp" id="o_dob" type="date" value="${v.dob}"></div>
      <div class="field"><label>Height (inches)</label><input class="inp" id="o_h" type="number" step="0.5" value="${v.heightIn}"></div><div class="field"><label>Current weight (lb)</label><input class="inp" id="o_w" type="number" step="0.1" value="${v.startWeight}"></div></div>
      <div class="row wrap"><button class="btn pri" id="nx">Continue ${ico('chevR')}</button><label class="btn ghost" style="cursor:pointer">${ico('upload')} Restore a backup<input class="sr" type="file" accept=".json" id="ob_imp"></label></div>`;
    else if(step===1) body=`<h2 style="font-size:24px">Set your targets</h2><p class="mut">Your first milestone is 20 lb lost. The longer goal is up to you; you can change it any time.</p>
      <div class="grid" style="grid-template-columns:1fr 1fr;gap:12px"><div class="field"><label>Goal weight (lb)</label><input class="inp" id="o_g" type="number" value="${v.goalWeight}"></div>
      <div class="field"><label>Target date</label><input class="inp" id="o_gd" type="date" value="${v.goalDate}"></div><div class="field"><label>Pace</label><select class="inp" id="o_p">${[[1,'Gentle: 1 lb/week'],[1.5,'Steady: 1.5 lb/week'],[2,'Faster: 2 lb/week']].map(o=>`<option value="${o[0]}" ${o[0]===v.pace?'selected':''}>${o[1]}</option>`).join('')}</select></div></div>
      <p class="note">Steady is recommended: sustainable under stress, with a lower rebound risk. Phase 1 (20 lb) takes roughly 13 weeks at that pace. A target date of 6 to 9 months out is realistic.</p>
      <div class="row"><button class="btn ghost" id="bk">${ico('chevL')} Back</button><button class="btn pri" id="nx">Continue ${ico('chevR')}</button></div>`;
    else { S.profile={name:v.name,dob:v.dob,heightIn:v.heightIn,startWeight:v.startWeight,startDate:TODAY(),goalWeight:v.goalWeight,pace:v.pace,goalDate:v.goalDate,activity:1.35,kcalOverride:0,proteinOverride:0,tdeeOverride:0}; const T=targets(); S.profile=null;
      body=`<h2 style="font-size:24px">Your starting plan</h2><div class="grid" style="grid-template-columns:1fr 1fr;gap:12px"><div class="panel hud"><div class="stat"><div class="lbl">Daily calories</div><div class="big">${T.kcal}</div></div></div><div class="panel hud"><div class="stat"><div class="lbl">Daily protein</div><div class="big" style="color:var(--violet)">${T.protein}<small class="mut" style="font-size:14px"> g</small></div></div></div></div>
      <p class="mut">Estimated burn ${T.tdee} kcal minus ${T.deficit}. Each day starts with a one-tap energy check-in that scales your movement plan. You will also find an urge button for stress-eating moments, guided strength built for sensitive joints, mobility routines, short meditations, and a manager recovery log.</p>
      <p class="note">HealthForge is a self-tracking tool, not medical advice. Check your plan with your doctor, especially with insulin resistance or blood pressure concerns. All data stays in this browser.</p>
      <div class="row"><button class="btn ghost" id="bk">${ico('chevL')} Back</button><button class="btn pri" id="fin">${ico('check')} Start forging</button></div>`; }
    root.innerHTML=`<div class="wrapbox">${dots}${body}</div>`;
    const g=id=>$('#'+id,root); const bk=g('bk'); if(bk) bk.onclick=()=>{step--;paint();};
    const imp=g('ob_imp'); if(imp) imp.onchange=()=>importFile(imp.files[0],()=>{root.remove();});
    const nx=g('nx'); if(nx) nx.onclick=()=>{ if(step===0){ v.name=g('o_name').value.trim(); v.dob=g('o_dob').value||v.dob; v.heightIn=num(g('o_h').value)||73; v.startWeight=num(g('o_w').value)||265; } else { v.goalWeight=num(g('o_g').value)||220; v.goalDate=g('o_gd').value||v.goalDate; v.pace=num(g('o_p').value)||1.5; } step++; paint(); };
    const fin=g('fin'); if(fin) fin.onclick=()=>{ S.profile={name:v.name,dob:v.dob,heightIn:v.heightIn,startWeight:v.startWeight,startDate:TODAY(),goalWeight:v.goalWeight,pace:v.pace,goalDate:v.goalDate,activity:1.35,kcalOverride:0,proteinOverride:0,tdeeOverride:0}; D(TODAY()).weight=v.startWeight; saveNow(); lastXP=totalXP(); root.remove(); go('today'); };
  };
  paint();
}
function importFile(file,done){ if(!file) return; const r=new FileReader(); r.onload=()=>{ try{ const j=JSON.parse(r.result); if(!j||typeof j!=='object'||!j.days||!j.profile) throw 0; S=Object.assign(defaults(),j); S.settings=Object.assign(defaults().settings,j.settings||{}); saveNow(); lastXP=totalXP(); toast('Backup restored'); done&&done(); go('today'); }catch(e){ toast('That file is not a valid backup'); } }; r.readAsText(file); }

/* ---------- boot ---------- */
function shell(){
  $('#app').innerHTML=`<aside class="side"><div class="brand">${logoSvg('sb')}<div><b>HEALTHFORGE</b><small>Build. Adapt. Keep.</small></div></div>
    ${NAV.map(n=>`<button class="nav-item" data-nav="${n[0]}" data-act="goto" data-v="${n[0]}">${ico(n[2])}<span>${n[1]}</span></button>`).join('')}
    <div class="grow"></div><button class="nav-item" data-nav="log" data-act="goto" data-v="log">${ico('note')}<span>Day log</span></button><button class="nav-item" data-nav="settings" data-act="goto" data-v="settings">${ico('gear')}<span>Settings</span></button><div class="rank-mini" id="rankmini"></div></aside>
  <main class="main"><div class="topbar"><div class="mobile-brand">${logoSvg('mb')}</div><div class="ttl"><h1 id="ttl"></h1><div class="sub" id="sub"></div></div><button class="icon-btn" data-act="goto" data-v="log" aria-label="Day log" id="logbtn">${ico('note')}</button><button class="icon-btn" data-act="goto" data-v="settings" aria-label="Settings" id="gearbtn">${ico('gear')}</button></div>
    ${storageOK?'':'<div class="banner">Browser storage is unavailable here, so data will not be saved. Export backups often.</div>'}<div id="view" class="view"></div></main>
  <nav class="tabbar">${NAV.map(n=>`<button data-nav="${n[0]}" data-act="goto" data-v="${n[0]}">${ico(n[2])}<span>${n[1]}</span></button>`).join('')}</nav>
  <button class="fab" data-act="urge" aria-label="Urge interrupter">${ico('urge')}<span>Urge</span></button>`;
}
document.addEventListener('click',e=>{ const t=e.target.closest('[data-act]'); if(!t||t.tagName==='INPUT') return; const f=ACT[t.dataset.act]; if(f) f(t,e); });
document.addEventListener('change',e=>{ const t=e.target; if(t.dataset&&t.dataset.act==='libjoint'){ lib.joint=t.checked; render(); return; } if(t.dataset&&t.dataset.act==='gck') ACT.gck(t); if(t.id==='imp') importFile(t.files[0]); });
document.addEventListener('submit',e=>{ const f=e.target.closest('form[data-form]'); if(!f) return; e.preventDefault(); FORMS[f.dataset.form](f); });
document.addEventListener('input',e=>{ if(e.target.id==='logdate'&&e.target.value&&e.target.value<=TODAY()){ logDay=e.target.value; render(); return; } if(e.target.id==='libq'){ lib.q=e.target.value; const g=$('#libgrid'); if(g) g.innerHTML=libGridHtml(); const c=$('#libcount'); if(c) c.textContent=libItems().length; } });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ if($('#sheet.open')) closeSheet(); } });

function boot(){
  load(); shell(); lastXP=totalXP();
  const h=location.hash.slice(1); if(VIEWS[h]) view=h;
  try{ if(navigator.storage&&navigator.storage.persist) navigator.storage.persist(); }catch(e){}
  if(/^https?:$/.test(location.protocol)&&'serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
  if(!S.profile) onboarding(); else render();
}
function rollover(){ if(S&&S.profile&&dk()!==renderedDay&&!$('#stage.open')){ fuelDay=TODAY(); render(); } }
document.addEventListener('visibilitychange',()=>{ if(!document.hidden) rollover(); }); window.addEventListener('focus',rollover); setInterval(rollover,60000);
window.addEventListener('DOMContentLoaded',boot);
window.addEventListener('hashchange',()=>{ const h=location.hash.slice(1); if(VIEWS[h]&&h!==view&&S&&S.profile){ view=h; render(); window.scrollTo(0,0); } });
