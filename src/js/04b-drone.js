/* ===== HealthForge: generative meditation sounds (Web Audio, no audio files) =====
   Tonal drones, nature soundscapes and dark ambient, all synthesised on the device. */
const DGROUPS=[['tone','Tonal drones'],['nature','Nature'],['dark','Dark ambient']];
const DRONES=[
 {id:'earth',g:'tone',name:'Low earth',desc:'A deep two-note hum, root and fifth, with a slowly breathing filter. Steady and grounding.'},
 {id:'pad',g:'tone',name:'Warm pad',desc:'Soft, wide open-fifth chords that swell and fade like slow breathing.'},
 {id:'choir',g:'tone',name:'Overtone choir',desc:'A low note with shifting harmonics that glow and drift against each other.'},
 {id:'forest',g:'nature',name:'Wind in tall trees',desc:'Gusts rolling through a high canopy: a low body of wind, rustling leaves, and slow swells that rise and pass.'},
 {id:'rain',g:'nature',name:'Steady rain',desc:'A soft, even rainfall with a low patter and individual drops. Good for masking noise.'},
 {id:'storm',g:'nature',name:'Distant storm',desc:'Light rain with slow thunder rolling in from far away every half minute or so.'},
 {id:'night',g:'nature',name:'Summer night',desc:'Crickets in the dark, a faint breeze, and an owl calling now and then.'},
 {id:'fire',g:'nature',name:'Campfire',desc:'A low flame roar with soft crackles and the occasional pop.'},
 {id:'ocean',g:'nature',name:'Ocean hum',desc:'Distant waves of soft noise over a low hum. Helps mask office or household sound.'},
 {id:'abyss',g:'dark',name:'Abyss',desc:'Sub-bass clusters beating against each other in an enormous space, with a faint ghostly breath. Best on headphones or a good speaker.'},
 {id:'cavern',g:'dark',name:'Cavern',desc:'Resonant wind moving through stone tunnels over a low rumble, with the occasional deep groan of rock. No high sounds.'},
 {id:'ritual',g:'dark',name:'Distant ritual',desc:'Slow, irregular drum strikes in a vast hall under a low drone, with whispering vowel-like voices that drift.'}
];
let DR=null, droneTimer=0;
const droneVol=()=>clamp(S.settings.droneVol==null?.5:S.settings.droneVol,0,1);
const dronePick=()=>DPRE[S.settings.drone]?S.settings.drone:'off';
const rnd=(a,b)=>a+Math.random()*(b-a);

function reverbIR(c,sec){ const n=Math.floor(c.sampleRate*sec), b=c.createBuffer(2,n,c.sampleRate); for(let ch=0;ch<2;ch++){ const d=b.getChannelData(ch); for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2.6); } return b; }
function brownNoise(c,sec){ const n=Math.floor(c.sampleRate*sec), b=c.createBuffer(1,n,c.sampleRate), d=b.getChannelData(0); let l=0; for(let i=0;i<n;i++){ const w=Math.random()*2-1; l=(l+0.02*w)/1.02; d[i]=l*3.5; } return b; }
function whiteNoise(c,sec){ const n=Math.floor(c.sampleRate*sec), b=c.createBuffer(1,n,c.sampleRate), d=b.getChannelData(0); for(let i=0;i<n;i++) d[i]=Math.random()*2-1; return b; }
function pinkNoise(c,sec){ const n=Math.floor(c.sampleRate*sec), b=c.createBuffer(1,n,c.sampleRate), d=b.getChannelData(0); let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
  for(let i=0;i<n;i++){ const w=Math.random()*2-1; b0=.99886*b0+w*.0555179; b1=.99332*b1+w*.0750759; b2=.969*b2+w*.153852; b3=.8665*b3+w*.3104856; b4=.55*b4+w*.5329522; b5=-.7616*b5-w*.016898; d[i]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.11; b6=w*.115926; } return b; }
// per-sound space: reverb length, wet and dry levels
const DREV={abyss:{sec:11,wet:.9,dry:.55},cavern:{sec:9,wet:.95,dry:.5},ritual:{sec:10,wet:.95,dry:.5},night:{sec:4,wet:.5,dry:.8},forest:{sec:3,wet:.35,dry:.9},rain:{sec:2,wet:.25,dry:1},storm:{sec:4,wet:.45,dry:.9},fire:{sec:2,wet:.2,dry:1},ocean:{sec:4,wet:.4,dry:.9}};
const DTRIM={earth:.65,choir:.55,pad:1.3,ocean:.85,forest:1.1,rain:1.35,storm:2.3,night:3.5,fire:1.25,abyss:.55,cavern:2.2,ritual:.5};

/* helper used by presets: a gain-shaped noise voice -> filter chain -> bus */
function gainNode(c,v,nodes){ const g=c.createGain(); g.gain.value=v; nodes.push(g); return g; }

const DPRE={
  earth:({osc,lfo,filt,bus})=>{ const lp=filt('lowpass',420); lp.connect(bus);
    osc('sine',32.7,.35,0,lp); osc('sine',65.41,.5,0,lp); osc('triangle',65.41,.16,4,lp); osc('sine',98,.32,-3,lp); osc('sine',130.81,.2,2,lp);
    lfo(lp.frequency,.045,150); },
  pad:({osc,lfo,filt,bus})=>{ const lp=filt('lowpass',650); lp.connect(bus);
    [73.42,110,146.83,220,293.66].forEach((f,i)=>{ const a=i>3?.04:.085; osc('sawtooth',f,a,-7,lp); osc('sawtooth',f,a,7,lp); });
    lfo(lp.frequency,.05,200); lfo(bus.gain,.07,.1); },
  choir:({osc,lfo,bus})=>{ for(let n=1;n<=8;n++){ const a=.5/Math.pow(n,.85); const s=osc('sine',55*n,a,(Math.random()-.5)*6,bus); lfo(s.g.gain,.02+Math.random()*.08,a*.8); } },
  ocean:({c,noise,osc,lfo,filt,bus,nodes})=>{ const src=noise('brown'); const lp=filt('lowpass',500), ng=gainNode(c,.55,nodes); src.connect(lp); lp.connect(ng); ng.connect(bus);
    lfo(ng.gain,.09,.35); lfo(lp.frequency,.07,250); osc('sine',55,.22,0,bus); osc('sine',82.4,.08,3,bus); },

  /* ----- nature ----- */
  forest:({c,noise,lfo,filt,bus,nodes,timers})=>{
    // low body of the wind
    const lo=filt('lowpass',260), gLo=gainNode(c,.7,nodes); noise('brown').connect(lo); lo.connect(gLo); gLo.connect(bus); lfo(gLo.gain,.035,.3);
    // rustling leaves, swelling in gusts
    const bp=filt('bandpass',850,.7), gLeaf=gainNode(c,.12,nodes); noise('pink').connect(bp); bp.connect(gLeaf); gLeaf.connect(bus);
    // high air through the needles
    const hi=filt('bandpass',4800,.8), gHi=gainNode(c,.018,nodes); noise('white').connect(hi); hi.connect(gHi); gHi.connect(bus);
    // slower canopy movement
    const mid=filt('bandpass',420,.5), gMid=gainNode(c,.2,nodes); noise('pink').connect(mid); mid.connect(gMid); gMid.connect(bus); lfo(gMid.gain,.06,.12); lfo(mid.frequency,.04,120);
    let next=c.currentTime+1.5; const tick=()=>{ if(c.currentTime+1<next) return; const t=next, rise=rnd(3,6), fall=rnd(4,9), amp=rnd(.5,1.2);
      gLeaf.gain.setTargetAtTime(.12+amp*.34,t,rise/3); gLeaf.gain.setTargetAtTime(.12,t+rise,fall/3);
      bp.frequency.setTargetAtTime(700+amp*650,t,rise/3); bp.frequency.setTargetAtTime(850,t+rise,fall/3);
      gHi.gain.setTargetAtTime(.018+amp*.05,t,rise/3); gHi.gain.setTargetAtTime(.018,t+rise,fall/3);
      gLo.gain.setTargetAtTime(.7+amp*.35,t,rise/3); gLo.gain.setTargetAtTime(.7,t+rise,fall/3);
      next=t+rise+fall+rnd(0,4); };
    tick(); timers.push(setInterval(tick,400)); },
  rain:({c,noise,lfo,filt,bus,nodes,timers})=>{ rainBed(c,noise,lfo,filt,bus,nodes,timers,1); },
  storm:({c,noise,lfo,filt,bus,nodes,timers})=>{ rainBed(c,noise,lfo,filt,bus,nodes,timers,.55);
    const buf=brownNoise(c,14);
    const rumble=(t,peak)=>{ const s=c.createBufferSource(); s.buffer=buf; const lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.setValueAtTime(rnd(300,500),t); lp.frequency.exponentialRampToValueAtTime(60,t+9);
      const g=c.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(peak,t+rnd(.6,1.6)); g.gain.exponentialRampToValueAtTime(.0005,t+rnd(8,12)); s.connect(lp); lp.connect(g); g.connect(bus); s.start(t,rnd(0,2)); s.stop(t+12.5); };
    let next=c.currentTime+5; const tick=()=>{ if(c.currentTime+1<next) return; const t=next; rumble(t,rnd(.9,1.5)); if(Math.random()<.6) rumble(t+rnd(1.2,2.6),rnd(.4,.8)); next=t+rnd(22,50); };
    tick(); timers.push(setInterval(tick,500)); },
  night:({c,noise,lfo,filt,bus,nodes,timers,srcs})=>{
    const lp=filt('lowpass',500), gb=gainNode(c,.05,nodes); noise('pink').connect(lp); lp.connect(gb); gb.connect(bus); lfo(gb.gain,.05,.03);
    for(let i=0;i<5;i++){ const o=c.createOscillator(); o.type='sine'; o.frequency.value=rnd(2100,2800); const am=gainNode(c,.03,nodes), gate=gainNode(c,.5,nodes); o.connect(am); am.connect(gate); gate.connect(bus); o.start();
      lfo(am.gain,rnd(17,31),.03); lfo(gate.gain,rnd(.12,.42),.5); srcs.push(o); }
    const hoot=t=>{ [0,.95].forEach((dt,k)=>{ const o=c.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(430-k*30,t+dt); o.frequency.exponentialRampToValueAtTime(380-k*30,t+dt+.5); const g=c.createGain(); g.gain.setValueAtTime(0,t+dt); g.gain.linearRampToValueAtTime(.09,t+dt+.12); g.gain.exponentialRampToValueAtTime(.0005,t+dt+.9); o.connect(g); g.connect(bus); o.start(t+dt); o.stop(t+dt+1); }); };
    let next=c.currentTime+rnd(8,16); const tick=()=>{ if(c.currentTime+1<next) return; hoot(next); next+=rnd(25,50); }; tick(); timers.push(setInterval(tick,600)); },
  fire:({c,noise,lfo,filt,bus,nodes,timers})=>{
    // flame body: a soft, low roar that breathes and occasionally swells
    const lp=filt('lowpass',380), body=gainNode(c,.3,nodes); noise('brown').connect(lp); lp.connect(body); body.connect(bus); lfo(body.gain,.45,.07); lfo(lp.frequency,.2,70);
    // flicker: quiet mid-range movement, like air pulling through burning wood
    const bp=filt('bandpass',520,.8), fl=gainNode(c,.05,nodes); noise('pink').connect(bp); bp.connect(fl); fl.connect(bus); lfo(fl.gain,2.8,.025); lfo(fl.gain,6.5,.015); lfo(bp.frequency,.3,120);
    let nx=c.currentTime+2; const swell=()=>{ if(c.currentTime+1<nx) return; const t=nx; body.gain.setTargetAtTime(.3+rnd(.05,.11),t,.5); body.gain.setTargetAtTime(.3,t+rnd(.8,1.6),.7); nx=t+rnd(2.5,6); }; swell(); timers.push(setInterval(swell,400));
    const wb=whiteNoise(c,2);
    const crack=(t,big)=>{ const s=c.createBufferSource(); s.buffer=wb; const f=c.createBiquadFilter(); f.type='bandpass'; f.frequency.value=big?rnd(350,900):rnd(600,2400); f.Q.value=rnd(1,2.5);
      const a=c.createGain(); const peak=big?rnd(.45,.8):rnd(.05,.22); a.gain.setValueAtTime(0,t); a.gain.linearRampToValueAtTime(peak,t+.002); a.gain.exponentialRampToValueAtTime(.0005,t+(big?rnd(.06,.14):rnd(.01,.045))); s.connect(f); f.connect(a); a.connect(bus); s.start(t,rnd(0,1.5)); s.stop(t+.18);
      if(big){ const o=c.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(130,t); o.frequency.exponentialRampToValueAtTime(70,t+.09); const g=c.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(peak*.45,t+.003); g.gain.exponentialRampToValueAtTime(.0005,t+.12); o.connect(g); g.connect(bus); o.start(t); o.stop(t+.15); } };
    let next=c.currentTime+.2; const tick=()=>{ while(next<c.currentTime+.8){ crack(next,Math.random()<.07); next+=-Math.log(1-Math.random())*.22; } }; tick(); timers.push(setInterval(tick,300)); },

  /* ----- dark ambient ----- */
  abyss:({c,osc,lfo,filt,noise,bus,nodes})=>{
    const lp=filt('lowpass',190); lp.connect(bus); lfo(lp.frequency,.02,60);
    [[32.7,.55],[34.65,.45],[49,.3],[51.9,.26],[24.5,.4]].forEach(([f,a],i)=>{ const s=osc(i%2?'triangle':'sine',f,a,(Math.random()-.5)*8,lp); lfo(s.g.gain,rnd(.015,.05),a*.7); lfo(s.o.frequency,rnd(.01,.03),f*.012); });
    const rb=filt('lowpass',90), gr=gainNode(c,.9,nodes); noise('brown').connect(rb); rb.connect(gr); gr.connect(bus); lfo(gr.gain,.03,.35);
    const air=filt('bandpass',600,7), ga=gainNode(c,.035,nodes); noise('pink').connect(air); air.connect(ga); ga.connect(bus); lfo(air.frequency,.017,320); lfo(ga.gain,.022,.03); },
  cavern:({c,noise,osc,lfo,filt,bus,nodes,timers})=>{
    const rb=filt('lowpass',75), gr=gainNode(c,.6,nodes); noise('brown').connect(rb); rb.connect(gr); gr.connect(bus); lfo(gr.gain,.028,.25);
    [[320,10,.14],[190,14,.12]].forEach(([f,q,a],i)=>{ const bp=filt('bandpass',f,q), g=gainNode(c,a,nodes); noise('pink').connect(bp); bp.connect(g); g.connect(bus); lfo(bp.frequency,rnd(.03,.06),f*.35); lfo(g.gain,rnd(.04,.08),a*.7); });
    const groan=t=>{ const o=c.createOscillator(); o.type='sawtooth'; o.frequency.setValueAtTime(44,t); o.frequency.linearRampToValueAtTime(37,t+8); const f=c.createBiquadFilter(); f.type='lowpass'; f.frequency.value=130;
      const g=c.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.35,t+3.5); g.gain.linearRampToValueAtTime(0,t+8); o.connect(f); f.connect(g); g.connect(bus); o.start(t); o.stop(t+8.2); };
    let ng=c.currentTime+rnd(10,18); const tick=()=>{ const n=c.currentTime+1; if(n>=ng){ groan(ng); ng+=rnd(30,55); } }; tick(); timers.push(setInterval(tick,500)); },
  ritual:({c,osc,noise,lfo,filt,bus,nodes,timers})=>{
    const lp=filt('lowpass',150); lp.connect(bus); osc('sine',41.2,.5,0,lp); osc('sine',41.2,.35,5,lp); osc('sine',61.7,.25,-3,lp); osc('triangle',27.5,.3,0,lp); lfo(lp.frequency,.025,40);
    const src=noise('pink'); [[420,13,.05],[840,13,.04],[2400,11,.02]].forEach(([f,q,a])=>{ const bp=filt('bandpass',f,q), g=gainNode(c,a,nodes); src.connect(bp); bp.connect(g); g.connect(bus); lfo(bp.frequency,rnd(.02,.06),f*.18); lfo(g.gain,rnd(.03,.09),a*.9); });
    const wb=whiteNoise(c,1);
    const hit=(t,v)=>{ const o=c.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(95,t); o.frequency.exponentialRampToValueAtTime(41,t+.35); const g=c.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v,t+.006); g.gain.exponentialRampToValueAtTime(.0005,t+2.2); o.connect(g); g.connect(bus); o.start(t); o.stop(t+2.4);
      const s=c.createBufferSource(); s.buffer=wb; const f=c.createBiquadFilter(); f.type='lowpass'; f.frequency.value=260; const a=c.createGain(); a.gain.setValueAtTime(v*.5,t); a.gain.exponentialRampToValueAtTime(.0005,t+.12); s.connect(f); f.connect(a); a.connect(bus); s.start(t); s.stop(t+.2); };
    let next=c.currentTime+2.5; const tick=()=>{ if(c.currentTime+1<next) return; const t=next; hit(t,.9); if(Math.random()<.45) hit(t+rnd(.55,.8),.5); next=t+rnd(7,13); }; tick(); timers.push(setInterval(tick,500)); }
};
function rainBed(c,noise,lfo,filt,bus,nodes,timers,lvl){
  const hp=filt('highpass',550), lp=filt('lowpass',6200), g=gainNode(c,.22*lvl,nodes); noise('white').connect(hp); hp.connect(lp); lp.connect(g); g.connect(bus); lfo(g.gain,.05,.04*lvl);
  const bp=filt('bandpass',360,.5), g2=gainNode(c,.35*lvl,nodes); noise('pink').connect(bp); bp.connect(g2); g2.connect(bus); lfo(g2.gain,.04,.08*lvl);
  const drop=t=>{ const o=c.createOscillator(); o.type='sine'; const f=rnd(1200,3100); o.frequency.setValueAtTime(f,t); o.frequency.exponentialRampToValueAtTime(f*.7,t+.03); const a=c.createGain(); a.gain.setValueAtTime(0,t); a.gain.linearRampToValueAtTime(rnd(.012,.05)*lvl,t+.002); a.gain.exponentialRampToValueAtTime(.0005,t+rnd(.02,.07)); o.connect(a); a.connect(bus); o.start(t); o.stop(t+.1); };
  let next=c.currentTime+.1; const tick=()=>{ while(next<c.currentTime+.8){ drop(next); next+=rnd(.03,.2)/Math.max(.4,lvl); } }; tick(); timers.push(setInterval(tick,300));
}

function startDrone(id,preview){
  stopDrone(.3); clearTimeout(droneTimer); if(!id||id==='off'||!DPRE[id]) return;
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)(); if(AC.state==='suspended') AC.resume(); const c=AC, t0=c.currentTime;
    const nodes=[], srcs=[], timers=[]; const rv=DREV[id]||{sec:4,wet:.55,dry:.75};
    const master=c.createGain(); master.gain.setValueAtTime(0,t0); master.gain.linearRampToValueAtTime(droneVol()*.9,t0+5); master.connect(c.destination); nodes.push(master);
    const comp=c.createDynamicsCompressor(); comp.connect(master); nodes.push(comp);
    const dry=c.createGain(); dry.gain.value=rv.dry; dry.connect(comp);
    const conv=c.createConvolver(); conv.buffer=reverbIR(c,rv.sec); const wet=c.createGain(); wet.gain.value=rv.wet; conv.connect(wet); wet.connect(comp);
    const bus=c.createGain(); bus.gain.value=.42*(DTRIM[id]||1); bus.connect(dry); bus.connect(conv); nodes.push(dry,conv,wet,bus);
    const osc=(type,f,gain,det,dest)=>{ const o=c.createOscillator(); o.type=type; o.frequency.value=f; o.detune.value=det||0; const g=c.createGain(); g.gain.value=gain; o.connect(g); g.connect(dest||bus); o.start(); srcs.push(o); nodes.push(g); return {o,g}; };
    const lfo=(param,rate,depth)=>{ const o=c.createOscillator(); o.frequency.value=rate; const g=c.createGain(); g.gain.value=depth; o.connect(g); g.connect(param); o.start(); srcs.push(o); nodes.push(g); };
    const filt=(type,f,q)=>{ const b=c.createBiquadFilter(); b.type=type; b.frequency.value=f; b.Q.value=q||.7; nodes.push(b); return b; };
    const bufs={}; const noise=kind=>{ const s=c.createBufferSource(); s.buffer=bufs[kind]||(bufs[kind]=kind==='white'?whiteNoise(c,6):kind==='pink'?pinkNoise(c,6):brownNoise(c,6)); s.loop=true; s.start(); srcs.push(s); return s; };
    DR={id,c,master,nodes,srcs,timers,preview:!!preview};
    DPRE[id]({c,bus,osc,lfo,filt,noise,nodes,srcs,timers});
    if(preview) droneTimer=setTimeout(()=>{ if(DR&&DR.preview){ stopDrone(2); if(view==='mind') render(); } },90000);
  }catch(e){ if(DR) stopDrone(.1); DR=null; }
}
function setDroneVol(){ if(DR){ const t=DR.c.currentTime; DR.master.gain.cancelScheduledValues(t); DR.master.gain.setTargetAtTime(droneVol()*.9,t,.25); } }
function stopDrone(fade){ const d=DR; if(!d) return; DR=null; clearTimeout(droneTimer); if(fade==null) fade=3; d.timers.forEach(clearInterval);
  const t=d.c.currentTime; try{ d.master.gain.cancelScheduledValues(t); d.master.gain.setValueAtTime(d.master.gain.value,t); d.master.gain.linearRampToValueAtTime(0,t+fade); }catch(e){}
  setTimeout(()=>{ d.srcs.forEach(o=>{try{o.stop();}catch(e){}}); d.nodes.forEach(n=>{try{n.disconnect();}catch(e){}}); },fade*1000+300); }
const droneName=id=>(DRONES.find(d=>d.id===id)||{name:'No drone'}).name;

/* picker used on the meditation start screen */
function dronePills(){ const cur=dronePick();
  return `<button class="pill ${cur==='off'?'on':''}" data-act="dronepick" data-id="off">None</button>`+DGROUPS.map(([g,label])=>`<div class="dgrp"><span class="lbl">${label}</span><div class="pill-row">${DRONES.filter(d=>d.g===g).map(d=>`<button class="pill ${cur===d.id?'on':''}" data-act="dronepick" data-id="${d.id}">${d.name}</button>`).join('')}</div></div>`).join(''); }
const droneSlider=()=>`<div class="row" style="gap:10px;justify-content:center;margin-top:10px"><span class="note">Volume</span><input type="range" id="dronevol" min="0" max="100" value="${Math.round(droneVol()*100)}" style="width:160px"></div>`;

/* panel on the Mind page */
function dronePanel(){ const cur=dronePick();
  const row=d=>{ const on=DR&&DR.id===d.id&&DR.preview; return `<div class="li" style="flex-wrap:wrap"><div class="grow" style="min-width:200px"><div class="t">${d.name}${cur===d.id?' <span class="chip b">Selected</span>':''}</div><div class="s">${d.desc}</div></div>
     <div class="row" style="gap:6px"><button class="btn sm ${on?'pri':''}" data-act="dronepreview" data-id="${d.id}">${on?'Stop':'Listen'}</button><button class="btn sm ${cur===d.id?'pri':'ghost'}" data-act="droneuse" data-id="${d.id}">${cur===d.id?'In use':'Use'}</button></div></div>`; };
  return panel('Meditation sounds','',`<p class="mut">Generated sound to sit with. Pick one and it plays during any guided meditation. Everything is created on your device, so it works offline.</p>
   ${DGROUPS.map(([g,label])=>`<div class="lbl" style="margin:22px 0 4px">${label}</div><div class="list">${DRONES.filter(d=>d.g===g).map(row).join('')}</div>`).join('')}
   <div class="list mt16"><div class="li"><div class="grow"><div class="t">No sound</div><div class="s">Silence apart from the start and end bell.</div></div><button class="btn sm ${cur==='off'?'pri':'ghost'}" data-act="droneuse" data-id="off">${cur==='off'?'In use':'Use'}</button></div></div>${droneSlider()}
   <p class="note mt12" style="font-size:12.5px">The dark ambient sounds contain very low bass. Headphones or a speaker with real low end will reveal it. Small phone speakers will mostly play only the upper textures.</p>`);
}
