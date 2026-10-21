/* ===== HealthForge graphics: animation layer and infographics ===== */
const ANIM={pending:true};                       // set when the user navigates; render() animates once, then clears it
const reducedMotion=()=>!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const cu=(n,dec)=>{ dec=dec||0; return `<span data-count="${n}" data-dec="${dec}">${Number(n).toFixed(dec)}</span>`; };

/* count numbers up from zero; a timeout guarantees the final value even if animation frames are paused */
function animateNumbers(root){
  if(reducedMotion()) return;
  (root||document).querySelectorAll('[data-count]').forEach(el=>{
    const to=parseFloat(el.dataset.count), dec=+el.dataset.dec||0; if(!isFinite(to)) return;
    const t0=performance.now(), dur=1100;
    const step=now=>{ const p=Math.min(1,(now-t0)/dur), e=1-Math.pow(1-p,3); el.textContent=(to*e).toFixed(dec); if(p<1&&el.isConnected) requestAnimationFrame(step); };
    requestAnimationFrame(step); setTimeout(()=>{ if(el.isConnected) el.textContent=to.toFixed(dec); },dur+250);
  });
}

/* ---------- concentric activity rings ---------- */
function activityRings(rings,size,center){
  const thick=Math.round(size*.072), gap=Math.round(size*.03), id=uid(); let defs='', svg='';
  rings.forEach((r,i)=>{
    const rad=size/2-thick/2-2-i*(thick+gap), c=2*Math.PI*rad, p=clamp(r.pct,0,1), gid='ar'+id+i;
    defs+=`<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${r.c1}"/><stop offset="1" stop-color="${r.c2||r.c1}"/></linearGradient>`;
    svg+=`<circle cx="${size/2}" cy="${size/2}" r="${rad}" fill="none" stroke="${r.c1}" stroke-opacity=".13" stroke-width="${thick}"/>`;
    svg+=`<circle class="rarc" style="--c:${c.toFixed(1)};--d:${(i*.14).toFixed(2)}s" cx="${size/2}" cy="${size/2}" r="${rad}" fill="none" stroke="url(#${gid})" stroke-width="${thick}" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c*(1-p)).toFixed(1)}" transform="rotate(-90 ${size/2} ${size/2})"/>`;
  });
  return `<div class="ring-wrap" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><defs>${defs}</defs>${svg}</svg><div class="ctr">${center}</div></div>`;
}

/* ---------- journey map: start, first 20 lb, goal ---------- */
function journeyMap(){
  const p=S.profile, ph=phaseInfo(), tot=Math.max(1,p.startWeight-p.goalWeight), pos=clamp(ph.lost/tot,0,1), n1=clamp(20/tot,0,1);
  const gd=p.goalDate||addDays(p.startDate,240);
  const nodes=[{at:0,t:'Start',v:r1(p.startWeight)+' lb',d:fmtD(p.startDate)},
    {at:n1,t:'First 20 lb',v:r1(ph.p1)+' lb',d:ph.lost>=20?'Reached':'ETA '+fmtD(ph.p1Date)},
    {at:1,t:'Goal',v:r1(p.goalWeight)+' lb',d:ph.toGoal<=0.5?'Reached':'Target '+fmtD(gd)}];
  const side=pos<.1?' l':pos>.9?' r':'';
  return `<div class="jm"><div class="jm-track"><i class="jm-fill" style="width:${(pos*100).toFixed(1)}%"></i>
    ${nodes.map(n=>`<b class="jm-node${pos>=n.at-.001?' on':''}" style="left:${(n.at*100).toFixed(1)}%"></b>`).join('')}
    <b class="jm-you${side}" style="left:${(pos*100).toFixed(1)}%"><em>${r1(ph.w)} lb</em></b></div>
    <div class="jm-labs">${nodes.map((n,i)=>`<div class="jm-lab${i===0?' first':i===nodes.length-1?' last':''}" style="left:${(n.at*100).toFixed(1)}%"><b>${n.t}</b><span class="mono">${n.v}</span><span class="dim">${n.d}</span></div>`).join('')}</div>
    <div class="row between wrap" style="gap:10px;margin-top:6px"><span class="note">${ph.lost>=0?'Down':'Up'} ${r1(Math.abs(ph.lost))} lb on trend, ${r1(ph.toGoal)} to go</span><span class="note mono">${Math.round(pos*100)}% of the way</span></div></div>`;
}

/* ---------- consistency heatmap: last 12 weeks ---------- */
function consistencyHtml(){
  const T0=TODAY(), weeks=12, dow=pd(T0).getDay(), startK=addDays(T0,-(dow+7*(weeks-1)));
  let cells='', months='', lastM=-1, active=0, strong=0;
  for(let w=0;w<weeks;w++){
    for(let d=0;d<7;d++){
      const k=addDays(startK,w*7+d); if(k>T0) continue; const pr=dayProgress(k), act=isActive(k);
      const lvl=!act?0:pr.pct>=1?4:pr.pct>=.67?3:pr.pct>=.34?2:1; if(act) active++; if(pr.pct>=.6) strong++;
      cells+=`<rect class="cell l${lvl}${k===T0?' today':''}" style="--i:${w*7+d}" x="${28+w*20}" y="${20+d*20}" width="16" height="16" rx="4" data-t="${fmtD(k)}: ${act?pr.done+' of '+pr.total+' done':'nothing logged'}"/>`;
    }
    const m=pd(addDays(startK,w*7)).getMonth(); if(m!==lastM){ months+=`<text x="${28+w*20}" y="11">${pd(addDays(startK,w*7)).toLocaleDateString(undefined,{month:'short'})}</text>`; lastM=m; }
  }
  const dl=[[1,'M'],[3,'W'],[5,'F']].map(([r,t])=>`<text x="8" y="${20+r*20+12}">${t}</text>`).join('');
  return `<div class="hm"><svg viewBox="0 0 ${28+weeks*20} ${20+7*20}" role="img" aria-label="Activity over the last 12 weeks">${months}${dl}${cells}</svg>
    <div class="hm-leg"><span>Less</span><i class="l0"></i><i class="l1"></i><i class="l2"></i><i class="l3"></i><i class="l4"></i><span>More</span></div></div>
    <p class="note mt8">${active} active days in the last ${weeks} weeks, ${strong} with most of the plan done.</p>`;
}

/* ---------- urge clock: 24 hours, evening window shaded ---------- */
function urgeClockHtml(){
  const urges=[]; Object.keys(S.days).forEach(k=>(S.days[k].urges||[]).forEach(u=>{ if(u.t) urges.push(u); }));
  if(urges.length<3) return `<div class="empty">${emptyArt('chart')}<div>Log three or more urges with the interrupter to see when they tend to hit.</div></div>`;
  const hrs=new Array(24).fill(0); urges.forEach(u=>hrs[new Date(u.t).getHours()]++);
  const mx=Math.max(...hrs,1), ws=winStartMin()/60, we=WIN_END/60, cx=150, cy=150, r0=46, rm=122;
  const pol=(r,a)=>[cx+r*Math.sin(a),cy-r*Math.cos(a)];
  const sector=(i,r1_)=>{ const a0=(i*15+1.2)*Math.PI/180, a1=((i+1)*15-1.2)*Math.PI/180; const A=pol(r0,a0),B=pol(r0,a1),C=pol(r1_,a1),D=pol(r1_,a0);
    return `M${A[0].toFixed(1)} ${A[1].toFixed(1)}A${r0} ${r0} 0 0 1 ${B[0].toFixed(1)} ${B[1].toFixed(1)}L${C[0].toFixed(1)} ${C[1].toFixed(1)}A${r1_} ${r1_} 0 0 0 ${D[0].toFixed(1)} ${D[1].toFixed(1)}Z`; };
  const hrName=h=>((h%12)||12)+(h<12?' am':' pm');
  let wedges='', inWin=0;
  hrs.forEach((n,i)=>{ const evening=i+1>ws&&i<we; if(evening) inWin+=n; const rad=n?r0+10+Math.sqrt(n/mx)*(rm-r0-10):r0+3;
    wedges+=`<path class="wedge hv${evening?' ev':''}${n?'':' zero'}" style="--i:${i}" d="${sector(i,rad)}" data-t="${hrName(i)}: ${n} urge${n===1?'':'s'}"/>`; });
  const peak=hrs.indexOf(mx);
  const guides=[r0,(r0+rm)/2,rm].map(r=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(160,185,230,.1)"/>`).join('');
  const labels=[[0,'12a'],[6,'6a'],[12,'12p'],[18,'6p']].map(([h,t])=>{ const q=pol(rm+20,h*15*Math.PI/180); return `<text x="${q[0].toFixed(1)}" y="${(q[1]+4).toFixed(1)}" text-anchor="middle">${t}</text>`; }).join('');
  const a0=ws*15*Math.PI/180, a1=we*15*Math.PI/180, P0=pol(rm+7,a0), P1=pol(rm+7,a1);
  const band=`<path class="eveband" d="M${P0[0].toFixed(1)} ${P0[1].toFixed(1)}A${rm+7} ${rm+7} 0 0 1 ${P1[0].toFixed(1)} ${P1[1].toFixed(1)}" fill="none" stroke-width="4" stroke-linecap="round"/>`;
  return `<div class="uc"><svg viewBox="-12 -12 324 324" role="img" aria-label="When urges hit, by hour">${guides}${band}${wedges}${labels}
    <text x="150" y="146" text-anchor="middle" class="uc-n">${urges.length}</text><text x="150" y="164" text-anchor="middle" class="uc-s">urges</text></svg></div>
    <p class="note mt8">Peak hour: <b>${hrName(peak)}</b>. ${Math.round(inWin/urges.length*100)}% of urges landed in your evening window (the violet arc and wedges).</p>`;
}

/* ---------- floating tooltip for heatmap cells and clock wedges ---------- */
function mountGraphics(root){
  const host=root||document; if(host._gtip) return; host._gtip=1;
  let tip=document.getElementById('gtip'); if(!tip){ tip=document.createElement('div'); tip.id='gtip'; tip.className='gtip'; document.body.appendChild(tip); }
  const show=e=>{ const t=e.target.closest&&e.target.closest('[data-t]'); if(!t||!host.contains(t)||!(t.closest('.hm')||t.closest('.uc'))){ tip.style.opacity=0; return; }
    tip.textContent=t.dataset.t; tip.style.opacity=1; const w=tip.offsetWidth; tip.style.left=Math.max(8,Math.min(innerWidth-w-8,e.clientX-w/2))+'px'; tip.style.top=(e.clientY-42)+'px'; };
  host.addEventListener('pointermove',show); host.addEventListener('pointerdown',show); host.addEventListener('pointerleave',()=>{ tip.style.opacity=0; });
}
