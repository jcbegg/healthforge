/* ===== HealthForge: 3D-skeleton stick figures, rendered from two angles =====
   World: y up (floor y=0), z = direction the person faces (side view right), x lateral.
   Pose keys: P pelvis [x,y,z]; lean/sway/yaw torso degrees (lean + = forward, - = backward);
   N neck target [x,y,z] (overrides lean/sway); hp/ht head pitch/tilt;
   A [upperA,upperB,foreA,foreB] FK both arms (AL/AR override); angle a: 0 down, 90 +z, 180 up; b: outward.
   T [thighA,thighB,shinA,shinB] FK both legs (TL/TR override).
   H [y,z,xo] hand IK (HL/HR [x,y,z] override); F [y,z,xo] foot IK (FL/FR override); ep/kp elbow/knee pole.
   fit: shift so lowest joint sits on the floor (default when no foot IK). */
const D2R=Math.PI/180;
const v3={add:(a,b,s=1)=>[a[0]+b[0]*s,a[1]+b[1]*s,a[2]+b[2]*s],sub:(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],dot:(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],
  len:a=>Math.hypot(a[0],a[1],a[2]),nrm:a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return [a[0]/l,a[1]/l,a[2]/l];}};
const dirv=(a,b,sx)=>{a*=D2R;b*=D2R;return [sx*Math.sin(b),-Math.cos(b)*Math.cos(a),Math.cos(b)*Math.sin(a)];};
const upv=(pitch,side)=>{pitch*=D2R;side*=D2R;return [Math.sin(side),Math.cos(pitch)*Math.cos(side),Math.sin(pitch)*Math.cos(side)];};
function ik2(root,target,l1,l2,pole){
  const d0=v3.sub(target,root); const d=Math.max(0.01,v3.len(d0)); const u=v3.nrm(d0); const dd=Math.min(d,l1+l2-0.05);
  const a=(l1*l1-l2*l2+dd*dd)/(2*dd), h=Math.sqrt(Math.max(0,l1*l1-a*a));
  const pr=v3.sub(pole,u.map(x=>x*v3.dot(pole,u))); const n=v3.nrm(pr);
  return {mid:v3.add(v3.add(root,u,a),n,h),end:v3.add(root,u,dd)};
}
const POSE_DEF={lean:0,sway:0,yaw:0,hp:0,ht:0,A:[0,6,0,4],T:[0,0,0,0]};
function solvePose(o){
  o=Object.assign({},POSE_DEF,o); const P=o.P||[0,36,0]; let tv, lean=o.lean, sway=o.sway;
  if(o.N){ tv=v3.nrm(v3.sub(o.N,P)); lean=Math.atan2(tv[2],tv[1])/D2R; sway=Math.asin(clampN(tv[0],-1,1))/D2R; } else tv=upv(lean,sway);
  const N=v3.add(P,tv,24), y=o.yaw*D2R, sw=sway*D2R;
  const lat=v3.nrm([Math.cos(sw)*Math.cos(y),-Math.sin(sw),Math.cos(sw)*Math.sin(y)]);
  const py=(o.pyaw||0)*D2R, hs=(o.hsway||0)*D2R, hlat=v3.nrm([Math.cos(hs)*Math.cos(py),-Math.sin(hs),Math.cos(hs)*Math.sin(py)]);
  const J={P,N,sR:v3.add(N,lat,9),sL:v3.add(N,lat,-9),hR:v3.add(P,hlat,6),hL:v3.add(P,hlat,-6)};
  J.sR[1]+=(o.shyR!=null?o.shyR:(o.shy||0)); J.sL[1]+=(o.shyL!=null?o.shyL:(o.shy||0));
  J.head=v3.add(N,upv(lean+o.hp,sway+o.ht),7.5); J.head[2]+=(o.hz||0); J.head[1]+=(o.hy||0);
  const ep=o.ep||[0.25,-0.5,-0.7], kp=o.kp||[0.15,0,1];
  [['R',1],['L',-1]].forEach(([k,s])=>{
    const sh=J['s'+k], hip=J['h'+k]; let hand=o['H'+k]; if(!hand&&o.H) hand=[s*(o.H[2]==null?9:o.H[2]),o.H[0],o.H[1]];
    if(hand){ const e=o['ep'+k]||[s*ep[0],ep[1],ep[2]]; const r=ik2(sh,hand,12,11,e); J['e'+k]=r.mid; J['w'+k]=r.end; }
    else { const a=o['A'+k]||o.A; J['e'+k]=v3.add(sh,dirv(a[0],a[1],s),12); J['w'+k]=v3.add(J['e'+k],dirv(a[2],a[3],s),11); }
    let foot=o['F'+k]; if(!foot&&o.F) foot=[s*(o.F[2]==null?9:o.F[2]),o.F[0],o.F[1]];
    if(foot){ const kq=o['kp'+k]||[s*kp[0],kp[1],kp[2]]; const r=ik2(hip,foot,17,18,kq); J['k'+k]=r.mid; J['a'+k]=r.end; }
    else { const t=o['T'+k]||o.T; J['k'+k]=v3.add(hip,dirv(t[0],t[1],s),17); J['a'+k]=v3.add(J['k'+k],dirv(t[2],t[3],s),18); }
  });
  const hasFootIK=!!(o.F||o.FL||o.FR);
  if((o.fit===undefined?!hasFootIK:o.fit)){ let mn=1e9; for(const k in J) mn=Math.min(mn,J[k][1]); const sh=-mn+(o.g==null?0.6:o.g); for(const k in J) J[k]=[J[k][0],J[k][1]+sh,J[k][2]]; }
  J._toe=o.toe==null?1:o.toe; J._nofoot=!!o.nofoot;
  return J;
}
const clampN=(v,a,b)=>Math.min(b,Math.max(a,v));
const FVIEWS={side:{label:'SIDE',depth:j=>-j[0]},front:{label:'FRONT',depth:j=>j[2]},top:{label:'ABOVE',depth:j=>j[1]}};
const FIGS={};
function defFig(id,f){ FIGS[id]=f; }
const fmt2=n=>(Math.round(n*10)/10);
const proj=(vw,j,f)=>vw==='side'?[60+j[2],80-j[1]]:vw==='front'?[60+j[0],80-j[1]]:[60+j[0],45+(f.tf?-j[2]:j[2])];
function toeOf(J,s){ const a=J['a'+s]; if(J._nofoot||a[1]>14) return null; return [a[0],Math.max(0.4,a[1]-6.5),a[2]+7*J._toe]; }
/* auto-frame: scale and centre so both poses fit the viewBox */
function frameOf(f,vw){
  f._fr=f._fr||{}; if(f._fr[vw]) return f._fr[vw];
  let mnx=1e9,mxx=-1e9,mny=1e9,mxy=-1e9;
  f.p.forEach(o=>{ const J=solvePose(o); for(const k in J){ if(!Array.isArray(J[k])) continue; const q=proj(vw,J[k],f); const m=k==='head'?7:2; mnx=Math.min(mnx,q[0]-m);mxx=Math.max(mxx,q[0]+m);mny=Math.min(mny,q[1]-m);mxy=Math.max(mxy,q[1]+m); }
    ['L','R'].forEach(s=>{const t=toeOf(J,s); if(t){const q=proj(vw,t,f); mnx=Math.min(mnx,q[0]);mxx=Math.max(mxx,q[0]);mny=Math.min(mny,q[1]);mxy=Math.max(mxy,q[1]);}}); });
  const cx=(mnx+mxx)/2, w=mxx-mnx+10; let s=Math.min(1,106/w), tr;
  if(vw==='top'){ const cy=(mny+mxy)/2, h=mxy-mny+10; s=Math.min(s,80/h); tr=q=>[60+(q[0]-cx)*s,40+(q[1]-cy)*s]; }
  else { const h=80-mny+4; s=Math.min(s,88/h); tr=q=>[60+(q[0]-cx)*s,80-(80-q[1])*s]; }
  return (f._fr[vw]={s,tr});
}
function boxSvg(b,vw,f,T){
  let a,c;
  if(vw==='side'){a=proj(vw,[0,b[2],b[4]],f);c=proj(vw,[0,b[3],b[5]],f);}
  else if(vw==='front'){a=proj(vw,[b[0],b[2],0],f);c=proj(vw,[b[1],b[3],0],f);}
  else {a=proj(vw,[b[0],0,b[4]],f);c=proj(vw,[b[1],0,b[5]],f);}
  a=T(a);c=T(c); const x0=Math.min(a[0],c[0]),x1=Math.max(a[0],c[0]),y0=Math.min(a[1],c[1]),y1=Math.max(a[1],c[1]);
  const wall=(b[1]-b[0])>100;
  return `<rect ${wall?'class="wl" ':''}x="${fmt2(x0)}" y="${fmt2(y0)}" width="${fmt2(Math.max(1.2,x1-x0))}" height="${fmt2(Math.max(1.2,y1-y0))}" rx="2"/>`;
}
function figure(id,opts){
  opts=opts||{}; const f=FIGS[id]; if(!f) return ''; const vw=opts.view||'side';
  const J0=solvePose(f.p[0]), J1=solvePose(f.p[1]); const pose=opts.pose; const fr=frameOf(f,vw), T=fr.tr;
  const sets=[J0,J1]; const cur=pose!=null?sets[pose]:J0;
  const P2=j=>T(proj(vw,j,f)); const pt2=j=>{const q=P2(j);return fmt2(q[0])+','+fmt2(q[1]);};
  const segDefs=[['legR',['hR','kR','aR']],['legL',['hL','kL','aL']],['armR',['sR','eR','wR']],['armL',['sL','eL','wL']]];
  const col='#22d3ee', colB='#3b9cff';
  const poly=(keys,J)=>keys.map(k=>pt2(J[k])).join(' ');
  const anim=(attr,a,b)=>pose!=null?'':`<animate attributeName="${attr}" values="${a};${b};${a}" keyTimes="0;.5;1" dur="3.4s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>`;
  const items=segDefs.map(([n,ks])=>({n,ks,d:FVIEWS[vw].depth(J0[ks[1]])})); const maxd=Math.max(...items.map(i=>i.d));
  items.sort((a,b)=>a.d-b.d);
  let body='';
  const line=(ks,c,w,op)=>`<polyline points="${poly(ks,cur)}" stroke="${c}" stroke-opacity="${op}" ${w?`stroke-width="${w}"`:''}>${anim('points',poly(ks,J0),poly(ks,J1))}</polyline>`;
  items.forEach(i=>{
    const op=1-clampN((maxd-i.d)/26,0,0.55);
    body+=line(i.ks,col,0,op);
    if(i.n.startsWith('leg')){ const s=i.n.slice(3); const t0=toeOf(J0,s), t1=toeOf(J1,s);
      if(t0||t1){ const pp=(J,t)=>pt2(J['a'+s])+' '+pt2(t||J['a'+s]); const tc=pose===1?t1:t0;
        body+=`<polyline points="${pose!=null?pp(cur,tc):pp(J0,t0)}" stroke="${col}" stroke-opacity="${op}" stroke-width="3">${anim('points',pp(J0,t0),pp(J1,t1))}</polyline>`; } }
  });
  body+=line(['sR','sL'],colB,3.2,1); body+=line(['hR','hL'],colB,3.2,1); body+=line(['N','P'],colB,5,1);
  const hp=P2(cur.head), h0=P2(J0.head), h1=P2(J1.head);
  body+=`<circle cx="${fmt2(hp[0])}" cy="${fmt2(hp[1])}" r="5.5" fill="#0b1018" stroke="${col}" stroke-width="2.8">${anim('cx',fmt2(h0[0]),fmt2(h1[0]))}${anim('cy',fmt2(h0[1]),fmt2(h1[1]))}</circle>`;
  const wpos=(J,kind)=>{ if(kind==='L'||kind==='R') return J['w'+kind]; if(kind==='mid'||kind==='ball') return v3.add(J.wR,v3.sub(J.wL,J.wR),0.5); if(kind==='hip') return v3.add(J.P,[0,4.5,0],1); return null; };
  (f.w||[]).forEach(kind=>{ const r=kind==='ball'?6.5:(kind==='mid'?5:3.8); const q=P2(wpos(cur,kind)), q0=P2(wpos(J0,kind)), q1=P2(wpos(J1,kind));
    body+=`<circle r="${r}" cx="${fmt2(q[0])}" cy="${fmt2(q[1])}" fill="#9381ff" stroke="#0b1018" stroke-width="1.5">${anim('cx',fmt2(q0[0]),fmt2(q1[0]))}${anim('cy',fmt2(q0[1]),fmt2(q1[1]))}</circle>`; });
  const eq=(f.eq||[]).map(b=>boxSvg(b,vw,f,T)).join('');
  const floor=vw==='top'?'':'<path class="floor" d="M4 80.500h112"/>';
  return `<svg class="fig" viewBox="0 -8 120 96" aria-hidden="true"><g class="eq">${eq}</g>${floor}<g class="fb">${body}</g><text class="vl" x="5" y="-1">${FVIEWS[vw].label}</text></svg>`;
}
function figurePair(id){ const f=FIGS[id]; if(!f) return ''; return `<div class="figpair">${figure(id,{view:'side'})}${figure(id,{view:f.v2||'front'})}</div>`; }
