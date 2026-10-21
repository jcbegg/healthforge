/* ===== HealthForge: custom SVG art ===== */
const IC = {
  today:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  fuel:'<path d="M12 3c3 3.2 5.5 6 5.5 9.5A5.5 5.5 0 0 1 12 18a5.5 5.5 0 0 1-5.5-5.5C6.5 10 8 8.6 9 7.2c.5 1.6 1.4 2.4 2.2 2.8C11.2 7.6 11.4 5.4 12 3Z"/><path d="M9 21h6"/>',
  move:'<circle cx="13.5" cy="4.5" r="1.8"/><path d="M12.5 8 10 12.2l3 2.6-1 5.2M12.5 8l3 3 3 .6M10 12.2 6.8 14.2M13 14.8l3.2 2 .8 3.2"/>',
  mind:'<path d="M12 3.5c2.6 2.7 4.2 4.8 4.2 7.3a4.2 4.2 0 0 1-8.4 0c0-2.5 1.6-4.6 4.2-7.3Z"/><path d="M3.5 15.5c2.3 2 5.1 3.2 8.5 3.2s6.2-1.2 8.5-3.2"/><path d="M7 20.5h10"/>',
  progress:'<path d="M3 20h18M4.5 16l4.2-5.2 3.6 3L19 6"/><circle cx="19" cy="6" r="1.5"/>',
  gear:'<path d="M19.07 9.81 L21.46 10.38 L21.46 13.62 L19.07 14.19 L18.55 15.45 L19.84 17.54 L17.54 19.84 L15.45 18.55 L14.19 19.07 L13.62 21.46 L10.38 21.46 L9.81 19.07 L8.55 18.55 L6.46 19.84 L4.16 17.54 L5.45 15.45 L4.93 14.19 L2.54 13.62 L2.54 10.38 L4.93 9.81 L5.45 8.55 L4.16 6.46 L6.46 4.16 L8.55 5.45 L9.81 4.93 L10.38 2.54 L13.62 2.54 L14.19 4.93 L15.45 5.45 L17.54 4.16 L19.84 6.46 L18.55 8.55Z"/><circle cx="12" cy="12" r="3.2"/>',
  urge:'<path d="M12 3 20 6v5.5c0 4.6-3.2 8.2-8 9.5-4.8-1.3-8-4.9-8-9.5V6l8-3Z"/><path d="M9.6 9.8v4.4M14.4 9.8v4.4"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>', close:'<path d="M6 6l12 12M18 6 6 18"/>',
  play:'<path d="M8 5.5v13l11-6.5-11-6.5Z"/>', pause:'<path d="M8 5v14M16 5v14"/>', skip:'<path d="M6 6l9 6-9 6V6ZM18 6v12"/>',
  bolt:'<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6l1-8Z"/>', moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/>',
  drop:'<path d="M12 3s6 6.2 6 10.5A6 6 0 0 1 6 13.5C6 9.2 12 3 12 3Z"/>', pulse:'<path d="M2.5 12h4l2.2-5.5 3.4 11 2.4-7 1.4 1.5h5.6"/>',
  scale:'<rect x="4" y="4" width="16" height="16" rx="3.5"/><path d="M8 10a4.5 4.5 0 0 1 8 0"/><path d="m12 10 2-1.8"/>',
  ruler:'<path d="m3 15 12-12 6 6L9 21 3 15Z"/><path d="m7 11 2 2M10 8l1.5 1.5M13 5l1.5 1.5"/>',
  download:'<path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"/>', upload:'<path d="M12 16V5m0 0-4 4m4-4 4 4M5 19h14"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  timer:'<circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 1.5M9.5 2.5h5"/>',
  chevL:'<path d="m14.5 6-6 6 6 6"/>', chevR:'<path d="m9.5 6 6 6-6 6"/>',
  note:'<path d="M6 3.5h9l4 4V20.5H6V3.5Z"/><path d="M9 11h7M9 15h7"/>', spark:'<path d="M12 3v5M12 16v5M3 12h5M16 12h5M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"/>',
  dumbbell:'<path d="M6.5 8v8M3.5 10v4M17.5 8v8M20.5 10v4M6.5 12h11"/>', list:'<path d="M8 6h12M8 12h12M8 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  battery1:'<rect x="3" y="8" width="16" height="8" rx="2"/><path d="M21 11v2"/><path d="M5.5 11v2"/>',
  battery2:'<rect x="3" y="8" width="16" height="8" rx="2"/><path d="M21 11v2"/><path d="M5.5 11v2M9 11v2M12.5 11v2"/>',
  battery3:'<rect x="3" y="8" width="16" height="8" rx="2"/><path d="M21 11v2"/><path d="M5.5 11v2M9 11v2M12.5 11v2M16 11v2"/>',
  user:'<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.6-3.6 3.4-5.5 7-5.5s6.4 1.9 7 5.5"/>', clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
  trophy:'<path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z"/>', flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>', swap:'<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3M6.5 7l1 13h9l1-13"/>', edit:'<path d="M4 20h4L19 9l-4-4L4 16v4ZM13 7l4 4"/>', heart:'<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.500 10c0 5.400-7.500 10-7.500 10Z"/>',
  info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.5"/>', home:'<path d="M4 11 12 4l8 7v9H4v-9Z"/>', share:'<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.800 7.600-3.600M8.200 13.200l7.600 3.600"/>'
};
function ico(n, cls){ return `<svg class="${cls||''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||''}</svg>`; }

function logoSvg(id='lg'){
  return `<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="${id}a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset="1" stop-color="#9381ff"/></linearGradient></defs>
  <path d="M24 3 42 13.500v21L24 45 6 34.500v-21L24 3Z" fill="rgba(59,156,255,.08)" stroke="url(#${id}a)" stroke-width="2"/>
  <path d="M13 25h6l3-8 4 15 3-7h6" fill="none" stroke="url(#${id}a)" stroke-width="2.600" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="24" cy="3" r="1.600" fill="#22d3ee"/></svg>`;
}

/* rank emblem: hexagon with N inner chevrons */
function emblem(level, size=64, locked=false){
  const n = Math.min(level, 6);
  let ch=''; for(let i=0;i<n;i++){ const y=34-i*5.5; ch+=`<path d="M17 ${y}l7-5 7 5" fill="none" stroke="${locked?'#3a465a':'#22d3ee'}" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round" opacity="${1-i*0.08}"/>`; }
  return `<svg width="${size}" height="${size}" viewBox="0 0 48 48"><path d="M24 3 42 13.500v21L24 45 6 34.500v-21L24 3Z" fill="${locked?'#0e141d':'rgba(59,156,255,.12)'}" stroke="${locked?'#2a3548':'#3b9cff'}" stroke-width="1.800"/>${ch}</svg>`;
}

/* badge medallion, glyph is an icon name */
function medal(glyph, off){
  const c = off ? '#3a465a' : '#22d3ee';
  return `<svg viewBox="0 0 56 56"><path d="M28 3 49 15v26L28 53 7 41V15L28 3Z" fill="${off?'#0e141d':'rgba(34,211,238,.08)'}" stroke="${off?'#2a3548':'#3b9cff'}" stroke-width="1.600"/><path d="M28 9 44 18v20L28 47 12 38V18L28 9Z" fill="none" stroke="${c}" stroke-width=".8" opacity=".5"/><g transform="translate(16 16)" style="color:${c}">${ico(glyph).replace('<svg class=""','<svg width="24" height="24"')}</g></svg>`;
}

/* empty-state illustration */
function emptyArt(kind){
  const base='stroke="#3b9cff" stroke-width="1.600" fill="none" stroke-linecap="round" stroke-linejoin="round"';
  if(kind==='chart') return `<svg viewBox="0 0 96 72"><path d="M8 62h80M8 62V10" ${base} opacity=".5"/><path d="M14 50l16-10 14 6 18-22 20 12" ${base} stroke="#22d3ee" stroke-dasharray="3 5"/><circle cx="78" cy="30" r="3.200" fill="#22d3ee"/></svg>`;
  if(kind==='list') return `<svg viewBox="0 0 96 72"><rect x="16" y="10" width="64" height="52" rx="8" ${base} opacity=".5"/><path d="M28 26h40M28 36h40M28 46h24" ${base} stroke="#9381ff" stroke-dasharray="2 5"/></svg>`;
  return `<svg viewBox="0 0 96 72"><circle cx="48" cy="36" r="22" ${base} opacity=".5"/><circle cx="48" cy="36" r="11" ${base} stroke="#22d3ee"/><path d="M48 6v10M48 56v10M10 36h10M76 36h10" ${base} opacity=".4"/></svg>`;
}

/* meditation visual: nested soft rings, slow drift (not a breathing guide) */
function auraSvg(pct){
  return `<svg viewBox="0 0 300 300" width="min(300px,72vw)" height="min(300px,72vw)"><defs>
  <radialGradient id="ag" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#22d3ee" stop-opacity=".35"/><stop offset="1" stop-color="#3b9cff" stop-opacity="0"/></radialGradient></defs>
  <circle class="aura" cx="150" cy="150" r="140" fill="url(#ag)"/>
  <circle class="aura b" cx="150" cy="150" r="104" fill="none" stroke="#9381ff" stroke-opacity=".5" stroke-width="1.500"/>
  <circle class="aura c" cx="150" cy="150" r="78" fill="none" stroke="#22d3ee" stroke-opacity=".6" stroke-width="1.500"/>
  <circle cx="150" cy="150" r="124" fill="none" stroke="#1a2535" stroke-width="3"/>
  <circle id="medArc" cx="150" cy="150" r="124" fill="none" stroke="#3b9cff" stroke-width="3" stroke-linecap="round" stroke-dasharray="${(2*Math.PI*124).toFixed(1)}" stroke-dashoffset="${(2*Math.PI*124*(1-pct)).toFixed(1)}" transform="rotate(-90 150 150)"/>
  </svg>`;
}

