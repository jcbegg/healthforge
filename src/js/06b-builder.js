/* ===== HealthForge: custom meal builder (line-item ingredients) ===== */
let B=null, BR=[];
const fmtQ=q=>String(Math.round(q*100)/100);
const itemTot=m=>m.items.reduce((t,i)=>({k:t.k+i.q*i.k,p:t.p+i.q*i.p,c:t.c+i.q*i.c,f:t.f+i.q*i.f}),{k:0,p:0,c:0,f:0});
const mealOptions=sel=>Object.entries(MEAL_LABELS).map(([m,l])=>`<option value="${m}" ${m===sel?'selected':''}>${l}</option>`).join('');

function newBuilder(meal){ B={id:null,name:'',meal:meal||mealOfNow(),items:[],cat:'',q:'',custom:false,vals:{}}; openBuilder(); }
function editMyMeal(id){ const m=S.myMeals.find(x=>x.id===id); if(!m) return; B={id,name:m.name,meal:m.meal,items:m.items.map(x=>({...x})),cat:'',q:'',custom:false,vals:{}}; openBuilder(); }

function openBuilder(){
  openSheet(`<h2>${B.id?'Edit meal':'Build a meal'}</h2><p class="note">Add ingredients one by one. Totals update as you go.</p>
   <div class="grid" style="grid-template-columns:1fr 140px;gap:12px;margin-top:12px"><div class="field"><label>Meal name</label><input class="inp" id="bname" value="${esc(B.name)}" placeholder="e.g. Chicken power bowl" autocomplete="off"></div>
   <div class="field"><label>Meal</label><select class="inp" id="bmeal">${mealOptions(B.meal)}</select></div></div>
   <div class="lbl mt16">In this meal</div><div id="blines"></div><div id="btot"></div>
   <div class="lbl mt16">Add an ingredient</div><input class="inp" id="bsearch" placeholder="Search foods: chicken, rice, berries..." autocomplete="off" value="${esc(B.q)}">
   <div class="pill-row mt8" id="bcats"></div><div id="bres" class="list" style="max-height:220px;overflow:auto;margin-top:8px"></div>
   <button class="btn sm mt8" data-act="bcustom">${ico('plus')} Add my own ingredient</button><div id="bcustomform"></div>
   <div class="row wrap mt16" id="bbtns"></div>`);
  paintCats(); paintRes(); paintLines(); paintBtns();
}
function paintCats(){ $('#bcats').innerHTML=`<button class="pill ${B.cat?'':'on'}" data-act="bcat" data-v="">All</button>`+['My ingredients',...ING_CATS.filter(c=>c!=='My ingredients')].filter(c=>c!=='My ingredients'||allIng().some(x=>x.cat==='My ingredients')).map(c=>`<button class="pill ${B.cat===c?'on':''}" data-act="bcat" data-v="${esc(c)}">${c}</button>`).join(''); }
function paintRes(){
  const q=B.q.trim().toLowerCase(); const all=allIng();
  const hits=all.filter(x=>(!B.cat||x.cat===B.cat)&&(!q||q.split(/\s+/).every(w=>x.n.toLowerCase().includes(w)))); BR=hits.slice(0,80);
  $('#bres').innerHTML=BR.length?BR.map((x,i)=>`<div class="li"><div class="grow"><div class="t">${esc(x.n)}</div><div class="s mono">${esc(x.u)} &middot; ${x.k} kcal &middot; ${x.p} g protein &middot; ${x.c} g carbs &middot; ${x.f} g fat</div>${x.note?`<div class="s" style="font-size:11.5px;color:var(--dim)">${esc(x.note)}</div>`:''}</div><button class="btn sm" data-act="bpick" data-i="${i}">${ico('plus')} Add</button></div>`).join('')+(hits.length>BR.length?`<div class="note" style="padding:10px 2px">Showing ${BR.length} of ${hits.length}. Search or pick a category to narrow.</div>`:''):`<div class="note" style="padding:10px 2px">No match. Use "Add my own ingredient" below.</div>`;
}
function lineHtml(it,i){
  const open=B.vals[i];
  return `<div class="li" style="flex-wrap:wrap;align-items:flex-start"><div class="grow" style="min-width:150px"><div class="t">${esc(it.n)}</div><div class="s mono">${esc(it.u)} per serving &middot; <span id="bls${i}">${Math.round(it.q*it.k)} kcal, ${r1(it.q*it.p)} g protein</span></div></div>
   <div class="row" style="gap:6px"><button class="icon-btn" style="width:34px;height:34px" data-act="bqty" data-i="${i}" data-d="-0.5" type="button">&minus;</button><input class="inp" data-bq="${i}" type="number" step="0.25" min="0" value="${fmtQ(it.q)}" style="width:72px;text-align:center" inputmode="decimal"><button class="icon-btn" style="width:34px;height:34px" data-act="bqty" data-i="${i}" data-d="0.5" type="button">+</button>
   <button class="icon-btn" style="width:34px;height:34px" data-act="bvals" data-i="${i}" aria-label="Edit values">${ico('edit')}</button><button class="icon-btn" style="width:34px;height:34px" data-act="bdel" data-i="${i}" aria-label="Remove">${ico('close')}</button></div>
   ${open?`<div class="frow" style="width:100%;margin-top:8px;grid-template-columns:repeat(4,1fr)">${[['k','kcal'],['p','protein'],['c','carbs'],['f','fat']].map(([k,l])=>`<div class="field"><label>${l}</label><input class="inp" data-bv="${i}" data-f="${k}" type="number" step="any" value="${it[k]}"></div>`).join('')}</div>`:''}</div>`;
}
function paintLines(){
  $('#blines').innerHTML=B.items.length?`<div class="list">${B.items.map(lineHtml).join('')}</div>`:`<div class="note" style="padding:6px 2px">No ingredients yet. Search below and tap Add.</div>`;
  paintTot();
}
const MCOL={p:'#9381ff',c:'#3b9cff',f:'#f6b94c'};
const ICOL=['#22d3ee','#3b9cff','#9381ff','#f6b94c','#38d9a0','#ff8fb1'];
function macroSplit(t){ const pk=t.p*4, ck=t.c*4, fk=t.f*9, tot=pk+ck+fk; return {pk,ck,fk,tot,pp:tot?pk/tot:0,cp:tot?ck/tot:0,fp:tot?fk/tot:0}; }
function donut(m,size,center,sub){
  const r=(size-16)/2, c=2*Math.PI*r; let off=0; const seg=[[m.pp,MCOL.p],[m.cp,MCOL.c],[m.fp,MCOL.f]];
  let arcs=''; seg.forEach(([v,col])=>{ if(v>0.001){ const len=Math.max(0,v*c-2); arcs+=`<circle class="arc" style="--c:${c.toFixed(2)}" cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${col}" stroke-width="14" stroke-dasharray="${len.toFixed(2)} ${(c-len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 ${size/2} ${size/2})"/>`; } off+=v*c; });
  return `<div class="ring-wrap" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="rgba(125,160,215,.14)" stroke-width="14"/>${arcs}</svg><div class="ctr"><div class="mono" style="font-size:20px;font-weight:600">${center}</div><div class="lbl" style="margin-top:1px">${sub}</div></div></div>`;
}
function macroBar(m,h=8){ return `<div class="mbr" style="display:flex;gap:2px;height:${h}px;border-radius:${h}px;overflow:hidden;background:rgba(125,160,215,.14)">${[[m.pp,MCOL.p],[m.cp,MCOL.c],[m.fp,MCOL.f]].map(([v,c])=>v>0?`<i style="width:${(v*100).toFixed(1)}%;background:${c}"></i>`:'').join('')}</div>`; }
// Macro breakdown for a day's totals (used under the fuel gauges)
function macroBreak(ft){
  const t={p:ft.protein,c:ft.carbs,f:ft.fat}, m=macroSplit(t), none=ft.nomac===ft.n;
  if(!ft.n) return '';
  const rows=[['Protein',t.p,m.pp,MCOL.p],['Carbs',t.c,m.cp,MCOL.c],['Fat',t.f,m.fp,MCOL.f]];
  return `<div class="mt16"><div class="lbl" style="margin-bottom:6px">Macros</div>${m.tot&&!none?macroBar(m,10):`<div class="note">No carb or fat data logged yet. Foods logged from the ingredient list or a built meal include it.</div>`}
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px">${rows.map(([l,g,pc,c])=>`<div><div class="lbl"><i style="display:inline-block;width:9px;height:9px;border-radius:3px;background:${c};margin-right:6px"></i>${l}</div><div class="mono" style="font-size:16px;margin-top:2px">${none&&l!=='Protein'?'-':Math.round(g)+' g'}</div><div class="s mut">${m.tot&&!none?Math.round(pc*100)+'% of kcal':'-'}</div></div>`).join('')}</div>
    ${ft.nomac&&!none?`<div class="note" style="margin-top:8px">${ft.nomac} logged ${ft.nomac===1?'food has':'foods have'} calories and protein only, so carbs and fat are undercounted.</div>`:''}</div>`;
}
function paintTot(){
  const t=itemTot(B), m=macroSplit(t);
  if(!B.items.length||!m.tot){ $('#btot').innerHTML=''; return; }
  const rows=[['Protein',t.p,m.pp,MCOL.p],['Carbs',t.c,m.cp,MCOL.c],['Fat',t.f,m.fp,MCOL.f]];
  // calorie contribution by ingredient
  const parts=B.items.map((i,n)=>({n:i.n,k:i.q*i.k})).filter(x=>x.k>0).sort((a,b)=>b.k-a.k); const tk=parts.reduce((a,x)=>a+x.k,0)||1;
  const top=parts.slice(0,5), rest=parts.slice(5).reduce((a,x)=>a+x.k,0); const segs=top.map((x,i)=>({...x,c:ICOL[i]})); if(rest>0) segs.push({n:'Everything else',k:rest,c:'#5d6c85'});
  $('#btot').innerHTML=`<div class="box" style="margin-top:10px"><div class="row gap16 wrap" style="align-items:center">
    ${donut(m,128,Math.round(t.k),'kcal')}
    <div class="grow" style="min-width:190px">${rows.map(([l,g,pc,c])=>`<div style="margin-bottom:9px"><div class="row between"><span><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${c};margin-right:7px"></i>${l}</span><span class="mono">${r1(g)} g <span class="mut">&middot; ${Math.round(pc*100)}%</span></span></div><div class="bar" style="height:5px;margin-top:4px"><i style="width:${Math.round(pc*100)}%;background:${c}"></i></div></div>`).join('')}</div></div>
    <div class="note" style="margin-top:2px">Percent of calories from each macro (protein and carbs 4 kcal per g, fat 9). Protein per 100 kcal: <b class="mono">${r1(t.p/(t.k||1)*100)} g</b></div>
    <div class="lbl" style="margin-top:12px">Where the calories come from</div>
    <div style="display:flex;gap:2px;height:12px;border-radius:12px;overflow:hidden;margin-top:6px;background:rgba(125,160,215,.14)">${segs.map(x=>`<i title="${esc(x.n)}" style="width:${(x.k/tk*100).toFixed(1)}%;background:${x.c}"></i>`).join('')}</div>
    <div class="legend" style="margin-top:8px">${segs.map(x=>`<span><i style="background:${x.c}"></i>${esc(x.n.length>26?x.n.slice(0,25)+'...':x.n)} <span class="mono">${Math.round(x.k/tk*100)}%</span></span>`).join('')}</div></div>`;
}
function paintBtns(){ $('#bbtns').innerHTML=`<button class="btn pri" data-act="bsave">Save meal</button><button class="btn" data-act="bsave" data-log="1">Save and log it</button>${B.id?`<button class="btn danger" data-act="mmdel" data-id="${B.id}" data-close="1">${ico('trash')} Delete</button>`:''}`; }

function addLine(x){ const ex=B.items.find(i=>i.n===x.n&&i.u===x.u); if(ex) ex.q+=1; else B.items.push({n:x.n,u:x.u,q:1,k:x.k,p:x.p,c:x.c,f:x.f,a:x.a||'Other'}); paintLines(); }
function logMyMeal(m,k){ const t=itemTot(m); arr(k,'food').push({id:uid(),name:m.name,kcal:Math.round(t.k),protein:r1(t.p),carbs:r1(t.c),fat:r1(t.f),meal:m.meal,ing:m.items.map(i=>({...i})),t:Date.now()}); }
function myMealsPanel(){
  const ms=S.myMeals;
  return panel('My meals','list',`<p class="mut">Build meals from individual ingredients with automatic calorie and protein totals. Saved meals can be logged in one tap and added to your grocery list.</p><button class="btn sm pri mt12" data-act="bnew">${ico('plus')} Build a meal</button>`+
   (ms.length?`<div class="list mt12">${ms.map(m=>{const t=itemTot(m);return `<div class="li" style="align-items:flex-start;flex-wrap:wrap"><div class="grow" style="min-width:200px"><div class="t">${esc(m.name)} <span class="chip">${MEAL_LABELS[m.meal]}</span></div><div class="s">${esc(m.items.map(i=>i.n+' ('+fmtQ(i.q)+' x '+i.u+')').join(', '))}</div><div class="s mono" style="margin-top:3px">${Math.round(t.k)} kcal &middot; ${r1(t.p)} g protein &middot; ${r1(t.c)} g carbs &middot; ${r1(t.f)} g fat</div><div style="margin-top:7px;max-width:320px">${macroBar(macroSplit(t),6)}</div></div>
     <div style="display:flex;flex-direction:column;gap:6px"><button class="btn sm" data-act="mmlog" data-id="${m.id}">Log</button><button class="btn sm ${S.plan.my.includes(m.id)?'pri':'ghost'}" data-act="mmplan" data-id="${m.id}">${S.plan.my.includes(m.id)?'Planned':'Plan'}</button><button class="btn sm ghost" data-act="mmedit" data-id="${m.id}">Edit</button></div></div>`;}).join('')}</div>`:`<div class="empty">${emptyArt('list')}<div>No custom meals yet.</div></div>`));
}
function myMealPills(){ return S.myMeals.length?`<div class="lbl mt16">My meals (tap to log)</div><div class="pill-row mt8">${S.myMeals.map(m=>`<button class="pill" data-act="mmlog" data-id="${m.id}">${esc(m.name)} <span class="mono dim">${Math.round(itemTot(m).k)}</span></button>`).join('')}</div>`:''; }
function planItems(){
  const items={}; const add=(a,n)=>{(items[a]=items[a]||new Set()).add(n);};
  Object.keys(S.plan).forEach(m=>S.plan[m].forEach(id=>{
    if(m==='my'){ const x=S.myMeals.find(y=>y.id===id); if(x) x.items.forEach(i=>add(i.a||'Other',i.n)); }
    else { const x=MEALS[m]&&MEALS[m].find(y=>y.id===id); if(x) x.ing.forEach(([n,a])=>add(a,n)); }
  }));
  return items;
}

Object.assign(ACT,{
  bnew(){ newBuilder(); },
  mmedit(t){ editMyMeal(t.dataset.id); },
  bcat(t){ B.cat=t.dataset.v; paintCats(); paintRes(); },
  bpick(t){ const x=BR[+t.dataset.i]; if(x) addLine(x); },
  bqty(t){ const it=B.items[+t.dataset.i]; it.q=Math.max(0.25,Math.round((it.q+ +t.dataset.d)*100)/100); paintLines(); },
  bdel(t){ B.items.splice(+t.dataset.i,1); B.vals={}; paintLines(); },
  bvals(t){ const i=+t.dataset.i; B.vals[i]=!B.vals[i]; paintLines(); },
  bcustom(){ B.custom=!B.custom; $('#bcustomform').innerHTML=B.custom?`<form data-form="bcustom" class="grid" style="grid-template-columns:1fr 1fr;gap:10px;margin-top:10px">
    <div class="field" style="grid-column:span 2"><label>Ingredient name</label><input class="inp" name="n" required autocomplete="off"></div><div class="field"><label>Serving size</label><input class="inp" name="u" placeholder="e.g. 1 cup, 100 g" required></div><div class="field"><label>Calories</label><input class="inp" name="k" type="number" step="any" required></div>
    <div class="field"><label>Protein (g)</label><input class="inp" name="p" type="number" step="any" value="0"></div><div class="field"><label>Carbs (g)</label><input class="inp" name="c" type="number" step="any" value="0"></div><div class="field"><label>Fat (g)</label><input class="inp" name="f" type="number" step="any" value="0"></div>
    <button class="btn pri" style="grid-column:span 2" type="submit">Save ingredient and add it</button></form>`:''; },
  bsave(t){
    B.name=($('#bname').value||'').trim(); B.meal=$('#bmeal').value;
    if(!B.name){ toast('Give your meal a name'); return; } if(!B.items.length||B.items.every(i=>!i.q)){ toast('Add at least one ingredient'); return; }
    const m={id:B.id||uid(),name:B.name,meal:B.meal,items:B.items.filter(i=>i.q>0).map(i=>({...i})),t:Date.now()};
    const i=S.myMeals.findIndex(x=>x.id===m.id); i<0?S.myMeals.push(m):S.myMeals[i]=m;
    if(t.dataset.log) logMyMeal(m,fuelDay);
    closeSheet(); touch(t.dataset.log?'Meal saved and logged':'Meal saved'); },
  mmlog(t){ const m=S.myMeals.find(x=>x.id===t.dataset.id); if(!m) return; logMyMeal(m,fuelDay); touch('Logged '+m.name); },
  mmplan(t){ const l=S.plan.my, i=l.indexOf(t.dataset.id); i<0?l.push(t.dataset.id):l.splice(i,1); touch(''); },
  async mmdel(t){ if(!await uiConfirm('Foods you already logged from it are kept.',{title:'Delete this meal?'})) return; S.myMeals=S.myMeals.filter(x=>x.id!==t.dataset.id); S.plan.my=S.plan.my.filter(x=>x!==t.dataset.id); if(t.dataset.close) closeSheet(); touch('Meal deleted'); }
});
FORMS.bcustom=function(f){ const v=Object.fromEntries(new FormData(f)); const x={n:v.n.trim(),u:v.u.trim(),k:num(v.k)||0,p:num(v.p)||0,c:num(v.c)||0,f:num(v.f)||0,a:'Other'}; if(!x.n) return;
  x.cat='My ingredients'; S.customIng=S.customIng.filter(y=>!(y.n===x.n&&y.u===x.u)); S.customIng.push(x); save(); B.custom=false; $('#bcustomform').innerHTML=''; addLine(x); paintCats(); paintRes(); toast('Ingredient saved'); };
document.addEventListener('input',e=>{ const t=e.target; if(!B||!$('#sheet.open')) return;
  if(t.id==='bsearch'){ B.q=t.value; paintRes(); }
  else if(t.id==='bname') B.name=t.value;
  else if(t.dataset&&t.dataset.bq!=null){ const i=+t.dataset.bq, it=B.items[i]; it.q=Math.max(0,num(t.value)||0); const s=$('#bls'+i); if(s) s.textContent=Math.round(it.q*it.k)+' kcal, '+r1(it.q*it.p)+' g protein'; paintTot(); }
  else if(t.dataset&&t.dataset.bv!=null){ const it=B.items[+t.dataset.bv]; it[t.dataset.f]=num(t.value)||0; const i=+t.dataset.bv, s=$('#bls'+i); if(s) s.textContent=Math.round(it.q*it.k)+' kcal, '+r1(it.q*it.p)+' g protein'; paintTot(); } });
