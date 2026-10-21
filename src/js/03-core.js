/* ===== HealthForge: core (store, calc, charts) ===== */
const KEY='healthforge.v1';
let S=null, storageOK=true, saveT=null;
const $=(s,r)=> (r||document).querySelector(s);
const $$=(s,r)=> Array.from((r||document).querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const pad=n=>String(n).padStart(2,'0');
const dk=(d=new Date())=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const pd=k=>{const [y,m,d]=k.split('-').map(Number);return new Date(y,m-1,d);};
const addDays=(k,n)=>{const d=pd(k);d.setDate(d.getDate()+n);return dk(d);};
const dayNum=k=>Math.round(Date.UTC(...k.split('-').map((v,i)=>i==1?v-1:+v))/864e5);
const fromNum=n=>{const d=new Date(n*864e5);return d.getUTCFullYear()+'-'+pad(d.getUTCMonth()+1)+'-'+pad(d.getUTCDate());};
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DOW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const fmtD=k=>{const d=pd(k);return MON[d.getMonth()]+' '+d.getDate();};
const fmtDL=k=>{const d=pd(k);return DOW[d.getDay()]+', '+MON[d.getMonth()]+' '+d.getDate();};
const r1=v=>Math.round(v*10)/10;
const num=v=>{const n=parseFloat(v);return isFinite(n)?n:null;};
const uid=()=>Math.random().toString(36).slice(2,9);
const TODAY=()=>dk();

function defaults(){return {v:1,profile:null,days:{},favs:[],groceryChecked:{},plan:{b:[],l:[],d:[],s:[],e:[],my:[]},queue:[],stretchQueue:[],myMeals:[],customIng:[],ingHide:[],routines:[],
  settings:{strengthDays:[1,3,5],restSec:45,pauseMin:5,mode:'lose',waterGoal:8,recharge:'17:30'},meta:{created:Date.now(),lastBackup:0,lastRoutine:-1}};}
function load(){
  try{const raw=localStorage.getItem(KEY); S=raw?Object.assign(defaults(),JSON.parse(raw)):defaults();
    S.settings=Object.assign(defaults().settings,S.settings||{}); S.plan=Object.assign(defaults().plan,S.plan||{}); S.myMeals=S.myMeals||[]; S.customIng=S.customIng||[]; S.ingHide=S.ingHide||[]; S.routines=S.routines||[];}
  catch(e){storageOK=false;S=S||defaults();}
}
function save(){
  clearTimeout(saveT);
  saveT=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){storageOK=false;}},150);
}
function saveNow(){clearTimeout(saveT);try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){storageOK=false;}}
function D(k){return S.days[k]||(S.days[k]={});}       // get-or-create (writes)
function G(k){return S.days[k]||{};}                    // read-only
function arr(k,f){const d=D(k);return d[f]||(d[f]=[]);}

/* ---------- profile / targets ---------- */
const LB=0.45359237;
function ageNow(){ if(!S.profile) return 47; const b=pd(S.profile.dob), n=new Date(); let a=n.getFullYear()-b.getFullYear(); if(n<new Date(n.getFullYear(),b.getMonth(),b.getDate())) a--; return a; }
function weighIns(){
  return Object.keys(S.days).filter(k=>S.days[k].weight>0).sort().map(k=>({k,n:dayNum(k),w:S.days[k].weight}));
}
function trendSeries(){
  const w=weighIns(); const out=[]; let t=null, last=null, i=0;
  for(const p of w){
    if(t==null) t=p.w; else { const gap=Math.max(1,p.n-last); const a=Math.max(1-Math.pow(0.9,gap),1/(i+1)); t=t+a*(p.w-t); }
    i++;
    last=p.n; out.push({k:p.k,n:p.n,w:p.w,t});
  }
  return out;
}
function curWeight(){ const t=trendSeries(); return t.length? t[t.length-1].t : (S.profile? S.profile.startWeight : 0); }
function lastRaw(){ const w=weighIns(); return w.length? w[w.length-1].w : null; }
function bmr(wLb){ const p=S.profile; return 10*wLb*LB + 6.25*p.heightIn*2.54 - 5*ageNow() + 5; }
function targets(){
  const p=S.profile; if(!p) return {kcal:2000,protein:150,tdee:2800,deficit:0};
  const w=curWeight();
  const tdee=(p.tdeeOverride>0)?p.tdeeOverride:bmr(w)*(p.activity||1.35);
  const maintain = S.settings.mode==='maintain';
  const deficit = maintain?0:Math.round((p.pace||1.5)*500);
  let kcal = Math.max(1600, Math.round((tdee-deficit)/10)*10);
  if(p.kcalOverride>0) kcal=p.kcalOverride;
  const protein = p.proteinOverride>0? p.proteinOverride : Math.max(140, Math.round(0.75*p.goalWeight/5)*5);
  return {kcal,protein,tdee:Math.round(tdee),deficit};
}
function energyOf(k){ return G(k).energy||0; }
function foodTotals(k){ const f=G(k).food||[]; return {kcal:f.reduce((a,x)=>a+(x.kcal||0),0),protein:f.reduce((a,x)=>a+(x.protein||0),0),carbs:f.reduce((a,x)=>a+(x.carbs||0),0),fat:f.reduce((a,x)=>a+(x.fat||0),0),nomac:f.filter(x=>x.carbs==null).length,n:f.length}; }
function walkMin(k){ return (G(k).walk||[]).reduce((a,x)=>a+x.min,0); }
function stretchMin(k){ return Math.round((G(k).stretch||[]).reduce((a,x)=>a+x.min,0)); }
function medMin(k){ return Math.round((G(k).meditate||[]).reduce((a,x)=>a+x.min,0)); }
function strengthN(k){ return (G(k).strength||[]).length; }

/* plan by energy */
const ENERGY=[{id:1,name:'Low',sub:'Minimum day',icon:'battery1'},{id:2,name:'Steady',sub:'Normal day',icon:'battery2'},{id:3,name:'High',sub:'Push a little',icon:'battery3'}];
function dayPlan(k){
  const e=energyOf(k)||2; const dow=pd(k).getDay(); const sDay=S.settings.strengthDays.includes(dow);
  const tab={1:{walk:10,stretch:3,med:3,water:5,str:0},2:{walk:25,stretch:5,med:5,water:7,str:sDay?1:0},3:{walk:40,stretch:8,med:5,water:8,str:sDay?1:0}}[e];
  tab.water=Math.min(tab.water,S.settings.waterGoal);
  return Object.assign({energy:e,strDay:sDay},tab);
}
function nextRoutine(){ const i=(S.meta.lastRoutine+1)%3; return ROUTINES[ROUTINE_ORDER[i]]; }

/* ---------- XP / rank / streak ---------- */
function dayXP(k){
  const d=G(k); let x=0;
  if(d.energy) x+=10; if(foodTotals(k).n>=2) x+=15; x+=Math.floor(walkMin(k)/10)*5;
  if(stretchMin(k)>=1) x+=10; if(medMin(k)>=1) x+=10; x+=strengthN(k)*40;
  if((d.urges||[]).length) x+=15; if((d.water||0)>=S.settings.waterGoal) x+=5; if(d.weight) x+=10; if(d.sleepH) x+=5;
  return x;
}
function totalXP(){ return Object.keys(S.days).reduce((a,k)=>a+dayXP(k),0); }
function levelInfo(){ const xp=totalXP(); let lv=0; const th=n=>Math.round(300*Math.pow(n,1.9)); while(xp>=th(lv+1)) lv++; const lo=th(lv), hi=th(lv+1); return {xp,lv:lv+1,name:RANKS[Math.min(lv,RANKS.length-1)],pct:(xp-lo)/(hi-lo),next:hi-xp}; }
function isActive(k){ const d=G(k); return !!(d.energy || foodTotals(k).n>=2 || walkMin(k)>=5 || strengthN(k) || stretchMin(k)||medMin(k)); }
function streak(){
  let k=TODAY(), n=0, lastMiss=-99, i=0;
  if(!isActive(k)){k=addDays(k,-1); i=1;}
  for(;i<500;i++,k=addDays(k,-1)){
    if(isActive(k)) n++;
    else { if(i-lastMiss<=6 || !isActive(addDays(k,-1))) break; lastMiss=i; }
  }
  return n;
}
function counts(){
  const keys=Object.keys(S.days); const c={checkins:0,active:0,strength:0,walkMin:0,meds:0,urgesHandled:0,lost:0,waistLost:0};
  for(const k of keys){ const d=S.days[k]; if(d.energy) c.checkins++; if(isActive(k)) c.active++; c.strength+=strengthN(k); c.walkMin+=walkMin(k); c.meds+=(d.meditate||[]).length; c.urgesHandled+=(d.urges||[]).filter(u=>u.outcome!=='ate').length; }
  if(S.profile){ c.lost=Math.max(0,S.profile.startWeight-curWeight()); const wv=keys.filter(k=>S.days[k].waist>0).sort(); if(wv.length) c.waistLost=Math.max(0,S.days[wv[0]].waist-S.days[wv[wv.length-1]].waist); }
  return c;
}
const walkMiles=w=>Math.round((w.speed||0)*(w.min||0)/60*100)/100;
const walkMilesDay=k=>(G(k).walk||[]).reduce((a,w)=>a+walkMiles(w),0);
const r2=v=>Math.round(v*100)/100;
function walkKcal(min,mph){ const met = mph<=2?2.5: mph<=2.5?2.9: mph<=3?3.3: mph<=3.5?3.8: 4.8; return Math.round(met*curWeight()*LB*min/60); }

/* ---------- phases / projection ---------- */
function phaseInfo(){
  const p=S.profile; const w=curWeight(); const lost=p.startWeight-w; const raw=lastRaw();
  const p1=p.startWeight-20, goal=p.goalWeight;
  let phase = lost<20?1: (w>goal+0.5?2:3);
  if(S.settings.mode==='maintain') phase=3;
  const rate = Math.max(0.5,p.pace||1.5);
  const weeksTo=(target)=>Math.max(0,(w-target)/rate);
  const projDate=(target)=>{ const d=new Date(); d.setDate(d.getDate()+Math.round(weeksTo(target)*7)); return dk(d); };
  return {phase,lost,raw,rawLost:raw!=null?p.startWeight-raw:null,p1,goal,w,toP1:Math.max(0,w-p1),toGoal:Math.max(0,w-goal),p1Date:projDate(p1),goalDate:projDate(goal),pct1:clamp(lost/20,0,1),pctG:clamp(lost/Math.max(1,p.startWeight-goal),0,1)};
}
function recentRate(){ /* lb per week from trend, last 21 days */
  const t=trendSeries(); if(t.length<4) return null; const end=t[t.length-1]; const from=t.filter(x=>end.n-x.n<=21); if(from.length<3) return null;
  const a=from[0]; const days=end.n-a.n; if(days<7) return null; return (a.t-end.t)/days*7;
}

function goalPlan(){
  const p=S.profile; const gd=p.goalDate||addDays(p.startDate,240); const n0=dayNum(p.startDate), n1=dayNum(gd), nt=dayNum(TODAY()); const w=curWeight();
  const planned=n=>p.startWeight+(p.goalWeight-p.startWeight)*clamp((n-n0)/Math.max(1,n1-n0),0,1);
  const wkLeft=(n1-nt)/7, need=wkLeft>0.2?(w-p.goalWeight)/wkLeft:null, rate=recentRate(), diff=w-planned(nt);
  let status=diff<=-1.5?'ahead':diff<=1.5?'on':'behind'; if(w<=p.goalWeight) status='done';
  const projDate=(rate&&rate>0.1&&w>p.goalWeight)?fromNum(nt+Math.round((w-p.goalWeight)/rate*7)):null;
  return {gd,n0,n1,nt,w,planned,need,rate,diff,status,daysLeft:n1-nt,projDate,pn:planned(nt)};
}

/* ---------- charts ---------- */
const CH={};
function sparkline(vals,color='#3b9cff',w=120,h=34){
  const v=vals.filter(x=>x!=null); if(v.length<2) return `<svg width="${w}" height="${h}"></svg>`;
  const mn=Math.min(...v), mx=Math.max(...v), rg=(mx-mn)||1;
  const pts=v.map((y,i)=>`${(i/(v.length-1)*(w-4)+2).toFixed(1)},${(h-4-(y-mn)/rg*(h-8)).toFixed(1)}`);
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><polyline class="draw" pathLength="1" points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${pts[pts.length-1].split(',')[0]}" cy="${pts[pts.length-1].split(',')[1]}" r="3" fill="${color}"/></svg>`;
}
function ring(pct,size,color,main,sub,thick=10,color2){
  const r=(size-thick)/2, c=2*Math.PI*r, p=clamp(pct,0,1);
  const id='rg'+uid();
  return `<div class="ring-wrap" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="${color2||color}"/></linearGradient></defs>
  <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="rgba(125,160,215,.14)" stroke-width="${thick}"/>
  <circle class="ringarc" cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="url(#${id})" stroke-width="${thick}" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c*(1-p)).toFixed(1)}" transform="rotate(-90 ${size/2} ${size/2})" style="--c:${c.toFixed(1)};transition:stroke-dashoffset .6s"/></svg>
  <div class="ctr"><div class="mono" style="font-size:${size>140?30:20}px;font-weight:600">${/^\d+$/.test(String(main))?cu(main):main}</div><div class="lbl" style="margin-top:2px">${sub}</div></div></div>`;
}
/* chart mounting: placeholders <div class="chart" data-cid="x"></div>, data in CH[x] */
function chartBox(id,spec,h=220){ CH[id]=Object.assign({h},spec); return `<div class="chart" data-cid="${id}" style="height:${h}px"></div>`; }
function mountCharts(root){
  $$('.chart[data-cid]',root).forEach(el=>{
    const sp=CH[el.dataset.cid]; if(!sp) return; const w=Math.max(240,el.clientWidth); const h=sp.h;
    el.innerHTML = sp.type==='bar'? barSvg(sp,w,h) : lineSvg(sp,w,h);
    el.insertAdjacentHTML('beforeend','<div class="tip"></div>');
    bindChart(el,sp,w,h);
  });
}
function niceTicks(mn,mx,n=4){ const rg=mx-mn||1; const raw=rg/n; const mag=Math.pow(10,Math.floor(Math.log10(raw))); const f=raw/mag; const st=(f<1.5?1:f<3?2:f<7?5:10)*mag; const a=Math.floor(mn/st)*st, b=Math.ceil(mx/st)*st; const t=[]; for(let v=a;v<=b+st/2;v+=st) t.push(+v.toFixed(6)); return t; }
function lineGeom(sp,w,h){
  const L=44,R=14,T=12,B=26; let xs=[],ys=[];
  sp.series.forEach(s=>s.pts.forEach(p=>{xs.push(p.x);ys.push(p.y);}));
  (sp.refs||[]).forEach(r=>ys.push(r.y));
  if(!xs.length) return null;
  let x0=sp.xmin!=null?sp.xmin:Math.min(...xs), x1=sp.xmax!=null?sp.xmax:Math.max(...xs); if(x1===x0) x1=x0+1;
  let mn=Math.min(...ys), mx=Math.max(...ys); if(sp.ymin!=null) mn=Math.min(mn,sp.ymin); if(sp.ymax!=null) mx=Math.max(mx,sp.ymax);
  const ticks=niceTicks(mn-(mx-mn)*.05,mx+(mx-mn)*.05,4); const y0=ticks[0], y1=ticks[ticks.length-1];
  const X=x=>L+(x-x0)/(x1-x0)*(w-L-R), Y=y=>T+(1-(y-y0)/(y1-y0||1))*(h-T-B);
  return {L,R,T,B,x0,x1,y0,y1,X,Y,ticks};
}
function lineSvg(sp,w,h){
  const g=lineGeom(sp,w,h); if(!g) return `<div class="empty">${emptyArt('chart')}<div>No data yet</div></div>`;
  const yf=sp.yfmt||(v=>r1(v)); let out=`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`;
  g.ticks.forEach(t=>{ const y=g.Y(t); out+=`<line x1="${g.L}" x2="${w-g.R}" y1="${y}" y2="${y}" stroke="rgba(125,160,215,.12)"/><text x="${g.L-8}" y="${y+3.5}" text-anchor="end">${yf(t)}</text>`; });
  const nx=Math.min(5,Math.max(2,Math.floor(w/110)));
  for(let i=0;i<=nx;i++){ const xv=g.x0+(g.x1-g.x0)*i/nx; out+=`<text x="${g.X(xv)}" y="${h-6}" text-anchor="${i==0?'start':i==nx?'end':'middle'}">${(sp.xfmt||(v=>fmtD(fromNum(Math.round(v)))))(xv)}</text>`; }
  (sp.refs||[]).forEach(r=>{ const y=g.Y(r.y); out+=`<line x1="${g.L}" x2="${w-g.R}" y1="${y}" y2="${y}" stroke="${r.color||'#9381ff'}" stroke-dasharray="5 5" stroke-opacity=".8"/><text x="${w-g.R}" y="${y-5}" text-anchor="end" style="fill:${r.color||'#9381ff'}">${esc(r.label)}</text>`; });
  sp.series.forEach((s,si)=>{
    const P=s.pts.map(p=>[g.X(p.x),g.Y(p.y)]); if(!P.length) return;
    if(s.area){ const id='ar'+si+uid(); out+=`<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.color}" stop-opacity=".28"/><stop offset="1" stop-color="${s.color}" stop-opacity="0"/></linearGradient></defs><path class="area" d="M${P[0][0]},${h-g.B} L${P.map(p=>p.join(',')).join(' L')} L${P[P.length-1][0]},${h-g.B}Z" fill="url(#${id})"/>`; }
    if(s.line!==false) out+=`<polyline points="${P.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${s.color}" stroke-width="${s.width||2.2}" stroke-linejoin="round" stroke-linecap="round" ${s.dash?'stroke-dasharray="4 4"':'pathLength="1" class="draw"'}/>`;
    if(s.dots) P.forEach(p=>{out+=`<circle cx="${p[0]}" cy="${p[1]}" r="${s.dotR||2.6}" fill="${s.color}" fill-opacity="${s.dotOp||.5}"/>`;});
    if(s.last){ const q=P[P.length-1]; out+=`<circle class="ping" cx="${q[0]}" cy="${q[1]}" r="5" fill="${s.color}"/><circle cx="${q[0]}" cy="${q[1]}" r="4.5" fill="${s.color}" stroke="#0b1018" stroke-width="2"/>`; }
  });
  out+=`<line class="xh" x1="0" x2="0" y1="${g.T}" y2="${h-g.B}" stroke="rgba(233,239,249,.45)" stroke-dasharray="3 3" style="display:none"/><circle class="xd" r="5" fill="#0b1018" stroke="#22d3ee" stroke-width="2" style="display:none"/>`;
  return out+'</svg>';
}
function barSvg(sp,w,h){
  const L=36,R=8,T=14,B=26; const mx=Math.max(sp.target||0,...sp.bars.map(b=>b.v),1)*1.12; const ticks=niceTicks(0,mx,3);
  const top=ticks[ticks.length-1]; const bw=(w-L-R)/sp.bars.length; const Y=v=>T+(1-v/top)*(h-T-B);
  let o=`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`;
  ticks.forEach(t=>{o+=`<line x1="${L}" x2="${w-R}" y1="${Y(t)}" y2="${Y(t)}" stroke="rgba(125,160,215,.12)"/><text x="${L-6}" y="${Y(t)+3.5}" text-anchor="end">${Math.round(t)}</text>`;});
  sp.bars.forEach((b,i)=>{ const x=L+i*bw+bw*.18, ww=bw*.64, y=Y(b.v), hh=Math.max(0,h-B-y); const col=b.color||sp.color||'#3b9cff';
    o+=`<rect class="bh grow" style="--i:${i}" data-i="${i}" x="${x}" y="${y}" width="${ww}" height="${hh}" rx="4" fill="${col}" fill-opacity="${b.v?0.9:0}"/>`;
    o+=`<rect x="${L+i*bw}" y="${T}" width="${bw}" height="${h-T-B}" fill="transparent" class="bz" data-i="${i}"/>`;
    if(sp.bars.length<=16 || i%Math.ceil(sp.bars.length/10)===0) o+=`<text x="${x+ww/2}" y="${h-8}" text-anchor="middle">${esc(b.label)}</text>`; });
  if(sp.target){ const y=Y(sp.target); o+=`<line x1="${L}" x2="${w-R}" y1="${y}" y2="${y}" stroke="#9381ff" stroke-dasharray="5 5"/><text x="${w-R}" y="${y-5}" text-anchor="end" style="fill:#9381ff">${esc(sp.targetLabel||'target')}</text>`; }
  return o+'</svg>';
}
function bindChart(el,sp,w,h){
  const tip=$('.tip',el), svg=$('svg',el); if(!svg) return;
  const show=(x,y,html)=>{tip.innerHTML=html;tip.style.left=clamp(x,70,w-70)+'px';tip.style.top=y+'px';tip.style.opacity=1;};
  const hide=()=>{tip.style.opacity=0; const xh=$('.xh',el); if(xh){xh.style.display='none';$('.xd',el).style.display='none';}};
  if(sp.type==='bar'){
    el.onpointermove=e=>{ const t=e.target.closest('.bz'); if(!t){hide();return;} const i=+t.dataset.i, b=sp.bars[i]; const bw=(w-44)/sp.bars.length; show(36+i*bw+bw/2, 14, `<span class="k">${esc(b.tip||b.label)}</span> <b>${esc(b.text!=null?b.text:b.v)}</b>`); };
    el.onpointerleave=hide; return;
  }
  const g=lineGeom(sp,w,h); if(!g) return; const main=sp.series.find(s=>s.main)||sp.series[0];
  el.onpointermove=e=>{
    const rect=svg.getBoundingClientRect(); const mx=e.clientX-rect.left; let best=null,bd=1e9;
    main.pts.forEach(p=>{const d=Math.abs(g.X(p.x)-mx); if(d<bd){bd=d;best=p;}}); if(!best||bd>60){hide();return;}
    const X=g.X(best.x); const xh=$('.xh',el), xd=$('.xd',el); xh.setAttribute('x1',X);xh.setAttribute('x2',X);xh.style.display='';
    xd.setAttribute('cx',X);xd.setAttribute('cy',g.Y(best.y));xd.style.display='';
    show(X,g.Y(best.y)-4, sp.tipfn? sp.tipfn(best,sp) : `<span class="k">${fmtD(fromNum(best.x))}</span> <b>${(sp.yfmt||r1)(best.y)}</b>`);
  };
  el.onpointerleave=hide;
}
let rzT=null; window.addEventListener('resize',()=>{clearTimeout(rzT);rzT=setTimeout(()=>mountCharts(document),150);});
