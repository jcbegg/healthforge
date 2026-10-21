/* ===== HealthForge: ingredient manager (Fuel tab: browse, edit, add, log one ingredient) ===== */
let M={q:'',cat:'',ed:null,lg:null,mode:'lib'}, MR=[];
const ingKey=x=>x.n+'|'+x.u;
const AISLES=[...new Set(ING.map(x=>x.a))].sort();
// Built-ins minus hidden/overridden ones, plus the user's own and edited entries (listed first)
function allIng(){
  const hide=new Set(S.ingHide||[]), over=new Set(S.customIng.map(x=>x.o).filter(Boolean));
  return [...S.customIng.map(x=>({...x,cat:x.cat||'My ingredients',mine:true})),...ING.filter(x=>!hide.has(ingKey(x))&&!over.has(ingKey(x)))];
}
const ingLine=x=>`${esc(x.u)} &middot; ${x.k} kcal &middot; ${x.p} g protein &middot; ${x.c} g carbs &middot; ${x.f} g fat`;
const ingCats=()=>['My ingredients',...ING_CATS.filter(c=>c!=='My ingredients')];

function vIngredients(){
  return `<div class="grid">
   <div class="c5">${modeBar()}${M.mode==='web'?webPanel():panel('Ingredients','list',`<div class="row wrap" style="gap:8px"><button class="btn sm pri" data-act="ingnew">${ico('plus')} New ingredient</button><button class="btn sm ghost" id="mrestore" data-act="ingrestore" style="${(S.ingHide||[]).length?'':'display:none'}">Restore hidden</button></div>
     <input class="inp mt12" id="msearch" placeholder="Search foods..." autocomplete="off" value="${esc(M.q)}">
     <div class="pill-row mt8" id="mcats">${catsHtml()}</div><div id="mres" class="list" style="margin-top:8px">${resHtml()}</div>`)}</div>
   <div class="c7" style="align-self:start;position:sticky;top:18px"><div id="ined">${edHtml()}</div></div></div>`;
}
function catsHtml(){ return `<button class="pill ${M.cat?'':'on'}" data-act="mcat" data-v="">All</button>`+ingCats().map(c=>`<button class="pill ${M.cat===c?'on':''}" data-act="mcat" data-v="${esc(c)}">${c}</button>`).join(''); }
function resHtml(){
  const q=M.q.trim().toLowerCase();
  const hits=allIng().filter(x=>(!M.cat||x.cat===M.cat)&&(!q||q.split(/\s+/).every(w=>x.n.toLowerCase().includes(w)))); MR=hits.slice(0,80);
  const sel=M.ed&&M.ed.key||M.lg&&ingKey(M.lg.x);
  return MR.length?MR.map((x,i)=>`<div class="li" style="flex-wrap:wrap${sel===ingKey(x)?';border-color:var(--accent,#22d3ee)':''}"><div class="grow" style="min-width:170px"><div class="t">${esc(x.n)}${x.mine?` <span class="chip">${x.o?'edited':'mine'}</span>`:''}</div><div class="s mono">${ingLine(x)}</div>${x.note?`<div class="s" style="font-size:11.5px;color:var(--dim)">${esc(x.note)}</div>`:''}</div>
    <div class="row" style="gap:6px"><button class="btn sm pri" data-act="inglog" data-i="${i}">Log</button><button class="btn sm ghost" data-act="ingedit" data-i="${i}">Edit</button></div></div>`).join('')+(hits.length>MR.length?`<div class="note" style="padding:10px 2px">Showing ${MR.length} of ${hits.length}. Search or pick a category to narrow.</div>`:''):`<div class="note" style="padding:10px 2px">No match. Use "New ingredient" to add it.</div>`;
}
function paintMgr(){ const c=$('#mcats'); if(c) c.innerHTML=catsHtml(); const r=$('#mrestore'); if(r) r.style.display=(S.ingHide||[]).length?'':'none'; paintMgrRes(); }
function paintMgrRes(){ const r=$('#mres'); if(r) r.innerHTML=resHtml(); }
function showEd(){ const e=$('#ined'); if(e){ e.innerHTML=edHtml(); if(M.ed||M.lg) e.scrollIntoView({block:'nearest',behavior:'smooth'}); } paintMgrRes(); if(M.lg) paintMlog(); }
function clearEd(){ M.ed=null; M.lg=null; showEd(); }

function edHtml(){ return M.ed?ingFormHtml(M.ed):M.lg?logHtml():panel('Editor','edit',`<p class="mut">Pick a food on the left to edit it or log it to your day, or add a new one. Your changes are saved on this device and apply everywhere in the app.</p>`); }
function ingFormHtml(e){
  const o=e.x||{n:'',u:'',k:'',p:0,c:0,f:0,a:'Other',cat:'My ingredients',note:''}, isNew=!e.key, builtin=!isNew&&!e.mine;
  const aisles=[...new Set([...AISLES,'Other'])];
  return panel(isNew?'New ingredient':'Edit ingredient','edit',`${builtin?'<p class="note">This is a built-in food. Your changes replace it in your lists, and you can reset it later.</p>':''}
   <form data-form="ingedit" class="grid" style="grid-template-columns:1fr 1fr;gap:10px;margin-top:10px">
    <div class="field" style="grid-column:span 2"><label>Ingredient name</label><input class="inp" name="n" required autocomplete="off" value="${esc(o.n)}"></div>
    <div class="field" style="grid-column:span 2"><label>Serving size</label><input class="inp" name="u" required placeholder="e.g. 1 cup, 100 g" value="${esc(o.u)}"></div>
    <div class="field"><label>Calories</label><input class="inp" name="k" type="number" step="any" required inputmode="decimal" value="${o.k}"></div>
    <div class="field"><label>Protein (g)</label><input class="inp" name="p" type="number" step="any" inputmode="decimal" value="${o.p}"></div>
    <div class="field"><label>Carbs (g)</label><input class="inp" name="c" type="number" step="any" inputmode="decimal" value="${o.c}"></div>
    <div class="field"><label>Fat (g)</label><input class="inp" name="f" type="number" step="any" inputmode="decimal" value="${o.f}"></div>
    <div class="field"><label>Grocery aisle</label><select class="inp" name="a">${aisles.map(a=>`<option ${a===(o.a||'Other')?'selected':''}>${a}</option>`).join('')}</select></div>
    <div class="field"><label>Category</label><select class="inp" name="cat">${ingCats().map(c=>`<option ${c===(o.cat||'My ingredients')?'selected':''}>${c}</option>`).join('')}</select></div>
    <div class="field" style="grid-column:span 2"><label>Note (optional)</label><input class="inp" name="note" autocomplete="off" value="${esc(o.note||'')}"></div>
    <div class="row wrap" style="grid-column:span 2;gap:8px"><button class="btn pri" type="submit">Save</button><button class="btn ghost" type="button" data-act="ingback">Cancel</button>
    ${isNew?'':`<button class="btn danger" type="button" data-act="ingdel">${ico('trash')} ${builtin?'Hide':(e.o?'Reset to original':'Delete')}</button>`}</div></form>`);
}
function logHtml(){
  const {x,meal}=M.lg;
  return panel('Log to '+(fuelDay===TODAY()?'today':fuelDay),'plus',`<div class="t" style="font-size:16px">${esc(x.n)}</div><div class="s mono mut">${ingLine(x)}</div>
   <form data-form="inglog" class="grid" style="grid-template-columns:1fr 1fr;gap:10px;margin-top:14px">
    <div class="field"><label>Servings (${esc(x.u)} each)</label><div class="row" style="gap:6px"><button class="icon-btn" style="width:38px;height:38px" type="button" data-act="mqty" data-d="-0.5">&minus;</button><input class="inp" id="mqty" name="q" type="number" step="0.25" min="0" value="${M.lg.q}" inputmode="decimal" style="text-align:center"><button class="icon-btn" style="width:38px;height:38px" type="button" data-act="mqty" data-d="0.5">+</button></div></div>
    <div class="field"><label>Meal</label><select class="inp" name="meal">${mealOptions(meal)}</select></div>
    <div id="mlogtot" style="grid-column:span 2"></div>
    <div class="row wrap" style="grid-column:span 2;gap:8px"><button class="btn pri" type="submit">Log it</button><button class="btn ghost" type="button" data-act="ingback">Cancel</button></div></form>`);
}
function paintMlog(){
  const e=$('#mlogtot'); if(!e||!M.lg) return; const {x,q}=M.lg, t={k:x.k*q,p:x.p*q,c:x.c*q,f:x.f*q}, m=macroSplit(t);
  e.innerHTML=`<div class="box"><div class="mono" style="font-size:15px">${Math.round(t.k)} kcal &middot; ${r1(t.p)} g protein &middot; ${r1(t.c)} g carbs &middot; ${r1(t.f)} g fat</div>${m.tot?`<div style="margin-top:8px">${macroBar(m,8)}</div>`:''}</div>`;
}

Object.assign(ACT,{
  ingmgr(){ sub.fuel='ingredients'; render(); window.scrollTo(0,0); },
  mcat(t){ M.cat=t.dataset.v; paintMgr(); },
  ingnew(){ M.lg=null; M.ed={key:null,x:null}; showEd(); },
  ingedit(t){ const x=MR[+t.dataset.i]; if(!x) return; M.lg=null; M.ed={key:ingKey(x),mine:!!x.mine,o:x.o,x}; showEd(); },
  inglog(t){ const x=MR[+t.dataset.i]; if(!x) return; M.ed=null; M.lg={x,q:1,meal:mealOfNow()}; showEd(); },
  ingback(){ clearEd(); },
  mqty(t){ const i=$('#mqty'); M.lg.q=Math.max(0,Math.round(((num(i.value)||0)+ +t.dataset.d)*100)/100); i.value=M.lg.q; paintMlog(); },
  ingrestore(){ S.ingHide=[]; save(); paintMgr(); toast('Hidden foods restored'); },
  async ingdel(){
    const e=M.ed; if(!e||!e.key) return;
    if(e.mine){ if(!await uiConfirm(e.o?'This food returns to its built-in values.':'Meals and logged foods that use it are kept.',{title:e.o?'Reset to original?':'Delete this ingredient?',yes:e.o?'Reset':'Delete'})) return; S.customIng=S.customIng.filter(y=>ingKey(y)!==e.key); }
    else { if(!await uiConfirm('You can restore hidden foods from this page at any time.',{title:'Hide this food?',yes:'Hide'})) return; (S.ingHide=S.ingHide||[]).push(e.key); }
    save(); toast(e.mine&&e.o?'Reset to original':e.mine?'Ingredient deleted':'Food hidden'); M.ed=null; paintMgr(); showEd();
  }
});
FORMS.ingedit=function(f){
  const v=Object.fromEntries(new FormData(f)), e=M.ed||{key:null};
  const x={n:v.n.trim(),u:v.u.trim(),k:num(v.k)||0,p:num(v.p)||0,c:num(v.c)||0,f:num(v.f)||0,a:v.a||'Other',cat:v.cat||'My ingredients',note:(v.note||'').trim()};
  if(!x.n||!x.u){ toast('Name and serving size are required'); return; }
  if(e.key&&!e.mine) x.o=e.key;              // editing a built-in: store as an override of it
  else if(e.o) x.o=e.o;                      // re-editing an override
  const nk=ingKey(x);
  S.customIng=S.customIng.filter(y=>ingKey(y)!==e.key&&ingKey(y)!==nk);
  S.customIng.push(x); save(); toast('Ingredient saved'); M.ed=null; M.q=x.n; M.cat='';
  const s=$('#msearch'); if(s) s.value=M.q; paintMgr(); showEd();
};
FORMS.inglog=function(f){
  const v=Object.fromEntries(new FormData(f)), q=num(v.q)||0, x=M.lg.x;
  if(q<=0){ toast('Enter a number of servings'); return; }
  const nm=q===1?`${x.n} (${x.u})`:`${x.n} (${fmtQ(q)} x ${x.u})`;
  arr(fuelDay,'food').push({id:uid(),name:nm,kcal:Math.round(x.k*q),protein:r1(x.p*q),carbs:r1(x.c*q),fat:r1(x.f*q),meal:v.meal,t:Date.now()});
  M.lg=null; touch('Logged '+x.n);
};
document.addEventListener('input',e=>{ const t=e.target;
  if(t.id==='msearch'){ M.q=t.value; paintMgrRes(); }
  else if(t.id==='mqty'&&M.lg){ M.lg.q=Math.max(0,num(t.value)||0); paintMlog(); } });
// Keep windows in sync: another window (main app or ingredient window) saved new data
window.addEventListener('storage',e=>{ if(e.key!==KEY||!e.newValue) return; load(); lastXP=totalXP(); if(S.profile&&!$('#stage.open')&&!$('#sheet.open')){ if(view==='fuel'&&sub.fuel==='ingredients'&&(M.ed||M.lg)) paintMgr(); else render(); } });
