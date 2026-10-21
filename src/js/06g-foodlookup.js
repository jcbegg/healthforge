/* ===== HealthForge: online food lookup (Open Food Facts + USDA FoodData Central) and barcode scanner =====
   Only search text or a barcode number leaves the device. Results open in the ingredient editor to be checked before saving. */
const ZXING_URL='https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/umd/index.min.js';
const ZXING_SRI='sha384-BzBxP10ZE72aitqj5UMmUsbKFliP/DZqA8Wq+BNNhlIJDGoEd1tpkMYXOg9+n6sB';
const BAR_ICON='<svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 5v10M6 5v10M9.5 5v10M13 5v10M16 5v10M11.5 5v10" stroke-width="1.4"/><path d="M2 2.5h3M15 2.5h3M2 17.5h3M15 17.5h3" stroke-width="1.2"/></svg>';
let WEB={q:'',busy:false,res:null,note:'',showSrc:false};
const wsleep=ms=>new Promise(r=>setTimeout(r,ms));
const tcase=s=>{ s=String(s||'').trim(); return s&&s===s.toUpperCase()?s.toLowerCase().replace(/(^|[\s(\/-])([a-z])/g,(m,a,b)=>a+b.toUpperCase()):s; };
const fixed=(v,d)=>{ const n=Number(v); return isFinite(n)?Math.round(n*Math.pow(10,d))/Math.pow(10,d):0; };
const srcOn=k=>!(S.settings['src_'+k]===false);

async function fetchJson(url,tries){
  tries=tries||3;
  for(let i=0;i<tries;i++){
    try{ const ctl=new AbortController(), to=setTimeout(()=>ctl.abort(),12000); const r=await fetch(url,{signal:ctl.signal}); clearTimeout(to);
      if(r.ok) return await r.json(); if(r.status===429||r.status>=500) throw new Error('busy'); throw new Error('http '+r.status); }
    catch(e){ if(i===tries-1) throw e; await wsleep(900*(i+1)); }
  }
}
function webItem(src,code,name,brand,u,k,p,c,f,per){
  const nm=brand&&!name.toLowerCase().includes(brand.toLowerCase().split(',')[0].trim())?(tcase(brand.split(',')[0])+' '+name):name;
  return {src,code,n:nm.trim(),brand:brand||'',u,k:Math.round(k||0),p:fixed(p,1),c:fixed(c,1),f:fixed(f,1),per,a:'Other',cat:'My ingredients',
    note:'From '+(src==='off'?'Open Food Facts':'USDA FoodData Central')+(code?' (code '+code+')':'')+'. Check against the package.'};
}
function offNormalize(p){
  const nu=p.nutriments||{}; let kc=nu['energy-kcal_100g']; if(kc==null&&nu['energy_100g']!=null) kc=nu['energy_100g']/4.184;
  if(!p.product_name||kc==null) return null;
  const sq=parseFloat(p.serving_quantity); const hasS=isFinite(sq)&&sq>0; const fct=hasS?sq/100:1;
  return webItem('off',p.code,p.product_name,(p.brands||''),hasS?(p.serving_size||sq+' g'):'100 g',kc*fct,(nu.proteins_100g||0)*fct,(nu.carbohydrates_100g||0)*fct,(nu.fat_100g||0)*fct,hasS?'serving':'100 g');
}
function usdaNormalize(f){
  const g=id=>{ const n=(f.foodNutrients||[]).find(x=>x.nutrientId===id); return n?n.value:null; };
  let kc=g(1008); if(kc==null){ const k2=g(2047)!=null?g(2047):g(2048); kc=k2; } if(kc==null) return null;
  const unit=String(f.servingSizeUnit||'').toLowerCase(); const ss=parseFloat(f.servingSize);
  const hasS=f.dataType==='Branded'&&isFinite(ss)&&ss>0&&(unit==='g'||unit==='grm'||unit==='ml'||unit==='mlt'); const fct=hasS?ss/100:1;
  const label=hasS?((f.householdServingFullText?f.householdServingFullText+' (':'')+Math.round(ss*10)/10+(unit.startsWith('m')?' ml':' g')+(f.householdServingFullText?')':'')):'100 g';
  return webItem('usda',f.gtinUpc||f.fdcId,tcase(f.description),tcase(f.brandName||f.brandOwner||''),label,kc*fct,(g(1003)||0)*fct,(g(1005)||0)*fct,(g(1004)||0)*fct,hasS?'serving':'100 g');
}
const usdaKey=()=>(S.settings.usdaKey||'DEMO_KEY').trim()||'DEMO_KEY';
async function searchOff(q){ const j=await fetchJson('https://world.openfoodfacts.org/cgi/search.pl?search_terms='+encodeURIComponent(q)+'&search_simple=1&action=process&json=1&page_size=10&fields=code,product_name,brands,serving_size,serving_quantity,nutriments'); return (j.products||[]).map(offNormalize).filter(Boolean); }
async function searchUsda(q){ const j=await fetchJson('https://api.nal.usda.gov/fdc/v1/foods/search?query='+encodeURIComponent(q)+'&pageSize=25&dataType=Branded,Foundation,SR%20Legacy&api_key='+encodeURIComponent(usdaKey()));
  const all=(j.foods||[]).map(f=>({it:usdaNormalize(f),gen:f.dataType!=='Branded'})).filter(x=>x.it); return [...all.filter(x=>x.gen).slice(0,5),...all.filter(x=>!x.gen)].slice(0,10).map(x=>x.it); }
async function lookupBarcode(code){
  code=String(code).replace(/\D/g,''); if(!code) return null;
  if(srcOn('off')){ try{ const j=await fetchJson('https://world.openfoodfacts.org/api/v2/product/'+code+'.json?fields=code,product_name,brands,serving_size,serving_quantity,nutriments',2); if(j.status===1&&j.product){ const it=offNormalize({...j.product,code}); if(it) return it; } }catch(e){} }
  if(srcOn('usda')){ for(const c of [code,'0'+code]){ try{ const j=await fetchJson('https://api.nal.usda.gov/fdc/v1/foods/search?query='+c+'&pageSize=5&dataType=Branded&api_key='+encodeURIComponent(usdaKey()),2); const f=(j.foods||[]).find(x=>String(x.gtinUpc||'').replace(/^0+/,'')===c.replace(/^0+/,'')); if(f){ const it=usdaNormalize(f); if(it) return it; } }catch(e){} } }
  return null;
}

/* ---------- panel ---------- */
function modeBar(){ return `<div class="pill-row" style="margin-bottom:22px"><button class="pill ${M.mode==='web'?'':'on'}" data-act="imode" data-v="lib">My library</button><button class="pill ${M.mode==='web'?'on':''}" data-act="imode" data-v="web">Find online</button></div>`; }
function webPanel(){
  return panel('Find foods online','',`<p class="mut">Search Open Food Facts and the USDA database, or scan a barcode. Results open in the editor so you can check them before saving.</p>
   <form data-form="websearch" class="row mt12" style="gap:8px"><input class="inp" id="wsearch" name="q" placeholder="e.g. old wisconsin turkey sticks" value="${esc(WEB.q)}" autocomplete="off"><button class="btn pri" type="submit">Search</button></form>
   <div class="row wrap mt12" style="gap:14px"><button class="btn sm" data-act="wscan" type="button">${BAR_ICON} Scan barcode</button><button class="lnk" data-act="wsrc" type="button">Sources and key</button></div>
   <div id="wsrcbox">${WEB.showSrc?srcBoxHtml():''}</div>
   <div id="wres" class="list mt16">${webResHtml()}</div>
   <p class="note mt16" style="font-size:12.5px">Only your search text or the barcode number is sent to these sites. Nutrition data can be wrong, so check it before saving.</p>`);
}
function srcBoxHtml(){ return `<div class="box mt12"><label class="row" style="gap:10px;font-size:14px;cursor:pointer"><input type="checkbox" data-act="wsrctog" data-k="off" ${srcOn('off')?'checked':''}> Open Food Facts</label>
  <label class="row mt8" style="gap:10px;font-size:14px;cursor:pointer"><input type="checkbox" data-act="wsrctog" data-k="usda" ${srcOn('usda')?'checked':''}> USDA FoodData Central</label>
  <div class="field mt12"><label>USDA API key (optional)</label><input class="inp" id="usdakey" placeholder="Using the shared demo key" value="${esc(S.settings.usdaKey||'')}" autocomplete="off" spellcheck="false"></div>
  <p class="note mt8" style="font-size:12.5px">The shared demo key is rate limited. A free personal key from api.data.gov removes that limit. It is stored only on this device.</p></div>`; }
function webResHtml(){
  if(WEB.busy) return `<div class="note" style="padding:10px 2px">Searching...</div>`;
  const note=WEB.note?`<div class="note" style="padding:4px 2px 10px;color:var(--warn)">${esc(WEB.note)}</div>`:'';
  if(!WEB.res) return note;
  if(!WEB.res.length) return note+`<div class="note" style="padding:10px 2px">No matches. Try fewer words, or scan the barcode.</div>`;
  return note+WEB.res.map((x,i)=>`<div class="li" style="flex-wrap:wrap"><div class="grow" style="min-width:170px"><div class="t">${esc(x.n)}</div><div class="s mono">${esc(x.u)} &middot; ${x.k} kcal &middot; ${x.p} g protein &middot; ${x.c} g carbs &middot; ${x.f} g fat</div>
    <div class="s"><span class="chip ${x.src==='off'?'b':'v'}">${x.src==='off'?'Open Food Facts':'USDA'}</span>${x.per==='100 g'?' <span class="chip w">per 100 g, check the serving</span>':''}</div></div>
    <div class="row" style="gap:6px"><button class="btn sm pri" data-act="wlog" data-i="${i}">Log</button><button class="btn sm ghost" data-act="wsave" data-i="${i}">Save</button></div></div>`).join('');
}
function paintWeb(){ const r=$('#wres'); if(r) r.innerHTML=webResHtml(); }
async function runWebSearch(q){
  q=q.trim(); WEB.q=q; if(q.length<2){ WEB.note='Type at least two letters.'; WEB.res=null; paintWeb(); return; }
  if(!srcOn('off')&&!srcOn('usda')){ WEB.note='Turn on at least one source under "Sources and key".'; paintWeb(); return; }
  WEB.busy=true; WEB.note=''; paintWeb(); const msgs=[]; let a=[],b=[];
  const [ra,rb]=await Promise.allSettled([srcOn('off')?searchOff(q):Promise.resolve([]),srcOn('usda')?searchUsda(q):Promise.resolve([])]);
  if(ra.status==='fulfilled') a=ra.value; else msgs.push('Open Food Facts did not respond (it is often busy). Search again in a moment.');
  if(rb.status==='fulfilled') b=rb.value; else msgs.push('USDA did not respond. If this keeps happening, add your own free key under "Sources and key".');
  const out=[]; for(let i=0;i<Math.max(a.length,b.length);i++){ if(b[i]) out.push(b[i]); if(a[i]) out.push(a[i]); }
  WEB.res=out; WEB.note=msgs.join(' '); WEB.busy=false; paintWeb();
}
function webToEditor(x,log){
  M.mode='web'; WEB.res=WEB.res||[]; const item={n:x.n,u:x.u,k:x.k,p:x.p,c:x.c,f:x.f,a:x.a,cat:x.cat,note:x.note};
  if(log){ M.ed=null; M.lg={x:item,q:1,meal:mealOfNow()}; } else { M.lg=null; M.ed={key:null,x:item}; }
  if(!(view==='fuel'&&sub.fuel==='ingredients')){ sub.fuel='ingredients'; view='fuel'; history.replaceState(null,'','#fuel'); render(); window.scrollTo(0,0); } else showEd();
}

/* ---------- barcode scanner ---------- */
let SCAN=null, ZX=null;
function loadZXing(){ if(window.ZXing) return Promise.resolve(); if(ZX) return ZX;
  return ZX=new Promise((res,rej)=>{ const s=document.createElement('script'); s.src=ZXING_URL; s.integrity=ZXING_SRI; s.crossOrigin='anonymous'; s.onload=()=>res(); s.onerror=()=>{ ZX=null; rej(new Error('scanner library failed to load')); }; document.head.appendChild(s); }); }
function decodeCanvas(canvas){
  const Z=window.ZXing; const hints=new Map(); hints.set(Z.DecodeHintType.POSSIBLE_FORMATS,[Z.BarcodeFormat.EAN_13,Z.BarcodeFormat.EAN_8,Z.BarcodeFormat.UPC_A,Z.BarcodeFormat.UPC_E]); hints.set(Z.DecodeHintType.TRY_HARDER,true);
  const bmp=new Z.BinaryBitmap(new Z.HybridBinarizer(new Z.HTMLCanvasElementLuminanceSource(canvas))); const rd=new Z.MultiFormatReader(); rd.setHints(hints);
  try{ return rd.decode(bmp).getText(); }catch(e){ return null; }
}
function stopScan(){ if(!SCAN) return; clearInterval(SCAN.timer); try{ SCAN.stream&&SCAN.stream.getTracks().forEach(t=>t.stop()); }catch(e){} SCAN=null; }
function scanMsg(t){ const e=$('#scanmsg'); if(e) e.textContent=t; }
function openScanner(){
  openSheet(`<h2>Scan a barcode</h2><p class="note">Hold the barcode steady inside the frame. The number is looked up online.</p>
   <div class="scanbox"><video id="scanvid" playsinline muted></video><i class="scanline"></i></div><div id="scanmsg" class="note mt8">Starting the camera...</div>
   <form data-form="scanmanual" class="row mt16" style="gap:8px"><input class="inp" name="code" inputmode="numeric" placeholder="Or type the digits under the barcode" autocomplete="off"><button class="btn" type="submit">Look up</button></form>`);
  startScan();
}
async function startScan(){
  stopScan(); SCAN={stream:null,timer:0,busy:false};
  const mine=SCAN;
  try{ mine.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280}},audio:false}); }
  catch(e){ scanMsg(e&&e.name==='NotAllowedError'?'Camera permission was denied. You can type the number below instead.':'No camera is available here, or the page is not on a secure connection. You can type the number below instead.'); SCAN=null; return; }
  const v=$('#scanvid'); if(!v||SCAN!==mine){ try{ mine.stream.getTracks().forEach(t=>t.stop()); }catch(e){} return; }
  v.srcObject=mine.stream; try{ await v.play(); }catch(e){}
  let det=null, cv=document.createElement('canvas');
  if('BarcodeDetector' in window){ try{ det=new BarcodeDetector({formats:['ean_13','ean_8','upc_a','upc_e']}); }catch(e){ det=null; } }
  if(!det){ scanMsg('Loading the scanner...'); try{ await loadZXing(); }catch(e){ scanMsg('The scanner could not load (it needs a connection). You can type the number below instead.'); return; } }
  scanMsg('Looking for a barcode...');
  mine.timer=setInterval(async()=>{
    if(!$('#scanvid')||SCAN!==mine){ if(SCAN===mine) stopScan(); else clearInterval(mine.timer); return; }
    if(mine.busy||v.readyState<2) return; mine.busy=true;
    try{ let code=null;
      if(det){ const r=await det.detect(v); if(r.length) code=r[0].rawValue; }
      else { const w=Math.min(960,v.videoWidth), h=Math.round(w*v.videoHeight/v.videoWidth); cv.width=w; cv.height=h; cv.getContext('2d').drawImage(v,0,0,w,h); code=decodeCanvas(cv); }
      if(code){ scanFound(code); }
    }catch(e){} mine.busy=false; },det?300:350);
}
async function scanFound(code){
  stopScan(); scanMsg('Found '+code+'. Looking it up...');
  const it=await lookupBarcode(code); closeSheet();
  if(!it){ toast('No match for barcode '+code+'. Try searching by name.'); M.mode='web'; WEB.q=''; if(view==='fuel'&&sub.fuel==='ingredients') render(); return; }
  toast('Found: '+it.n); webToEditor(it,false);
}

/* ---------- wiring ---------- */
Object.assign(ACT,{
  imode(t){ M.mode=t.dataset.v; M.ed=null; M.lg=null; render(); },
  wsrc(){ WEB.showSrc=!WEB.showSrc; const b=$('#wsrcbox'); if(b) b.innerHTML=WEB.showSrc?srcBoxHtml():''; },
  wsrctog(t){ S.settings['src_'+t.dataset.k]=t.checked; save(); },
  wlog(t){ const x=(WEB.res||[])[+t.dataset.i]; if(x) webToEditor(x,true); },
  wsave(t){ const x=(WEB.res||[])[+t.dataset.i]; if(x) webToEditor(x,false); },
  wscan(){ openScanner(); },
  closeSheet(){ stopScan(); closeSheet(); }
});
FORMS.websearch=function(f){ runWebSearch(new FormData(f).get('q')||''); };
FORMS.scanmanual=function(f){ const c=String(new FormData(f).get('code')||'').replace(/\D/g,''); if(c.length<6){ scanMsg('Enter the full number printed under the barcode.'); return; } scanFound(c); };
document.addEventListener('input',e=>{ if(e.target.id==='usdakey'){ S.settings.usdaKey=e.target.value.trim(); save(); } else if(e.target.id==='wsearch') WEB.q=e.target.value; });

/* checkboxes carrying data-act: the global click handler ignores inputs, so dispatch on change */
document.addEventListener('change',e=>{ const t=e.target; if(t&&t.type==='checkbox'&&t.dataset&&['gcare','rjoint','wsrctog'].includes(t.dataset.act)) ACT[t.dataset.act](t); });
