import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const P = new URLSearchParams(location.search);
const NAME = P.get('s') || 'canteiro';
const W = +P.get('w') || 1600, H = +P.get('h') || 1200;

const NAVY = 0x18274b, NAVY2 = 0x2c3f6e, LIME = 0xb4cc2b, BLUE = 0x2233ee, WHITE = 0xf3f4ee,
  CONC = 0xc4c6bf, CONC2 = 0xa9aca4, DARK = 0x262b36, WOOD = 0xc99a68, SKIN = 0xd9a882,
  RED = 0xd23a2c, ORANGE = 0xee7d22, GREEN = 0x5f8f3a, GLASS = 0x9fc3e6, GROUND = 0xdfe2d6;

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.55;
const root = new THREE.Group();
scene.add(root);

// ---------- helpers ----------
function bg(top, bottom) {
  const c = document.createElement('canvas'); c.width = 4; c.height = 512;
  const x = c.getContext('2d'); const g = x.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, top); g.addColorStop(1, bottom); x.fillStyle = g; x.fillRect(0, 0, 4, 512);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; scene.background = t;
}
function tex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}
function mat(c, o = {}) {
  return new THREE.MeshStandardMaterial({
    color: c, roughness: o.r ?? 0.62, metalness: o.m ?? 0.04, map: o.map || null,
    emissive: o.e ?? 0x000000, emissiveIntensity: o.ei ?? 1, emissiveMap: o.emap || null,
    transparent: o.t !== undefined, opacity: o.t ?? 1, side: o.side ?? THREE.FrontSide,
  });
}
function put(m, x, y, z, p) { m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; (p || root).add(m); return m; }
function box(w, h, d, c, x = 0, y = 0, z = 0, p, o = {}) {
  const r = Math.min(0.05, Math.min(w, h, d) * 0.18);
  const g = o.sharp ? new THREE.BoxGeometry(w, h, d) : new RoundedBoxGeometry(w, h, d, 2, r);
  return put(new THREE.Mesh(g, c instanceof THREE.Material ? c : mat(c, o)), x, y + h / 2, z, p);
}
function cyl(rt, rb, h, c, x = 0, y = 0, z = 0, p, o = {}) {
  return put(new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, o.seg ?? 24), c instanceof THREE.Material ? c : mat(c, o)), x, y + h / 2, z, p);
}
function sph(r, c, x = 0, y = 0, z = 0, p, o = {}) {
  return put(new THREE.Mesh(new THREE.SphereGeometry(r, o.seg ?? 24, 16), mat(c, o)), x, y, z, p);
}
const V = (x, y, z) => new THREE.Vector3(x, y, z);
function strut(a, b, r, c, p, o = {}) {
  const v = new THREE.Vector3().subVectors(b, a); const len = v.length();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, o.seg ?? 10), c instanceof THREE.Material ? c : mat(c, o));
  m.position.copy(a).addScaledVector(v, 0.5);
  m.quaternion.setFromUnitVectors(V(0, 1, 0), v.clone().normalize());
  m.castShadow = true; m.receiveShadow = true; (p || root).add(m); return m;
}
function beam(a, b, w, h, c, p, o = {}) {
  const v = new THREE.Vector3().subVectors(b, a); const len = v.length();
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, len, h, 2, Math.min(w, h) * 0.15), mat(c, o));
  m.position.copy(a).addScaledVector(v, 0.5);
  m.quaternion.setFromUnitVectors(V(0, 1, 0), v.clone().normalize());
  m.castShadow = true; m.receiveShadow = true; (p || root).add(m); return m;
}
function grp(x = 0, y = 0, z = 0, ry = 0, p) { const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; (p || root).add(g); return g; }
function prism(w, h, d, c, x, y, z, p) {
  const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.lineTo(-w / 2, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false }); g.translate(0, 0, -d / 2);
  return put(new THREE.Mesh(g, mat(c)), x, y, z, p);
}
function base(w, d, c = WHITE, h = 0.6) {
  put(new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, 0.22), mat(c, { r: 0.8 })), 0, -h / 2, 0);
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.18 }));
  sh.rotation.x = -Math.PI / 2; sh.position.y = -h - 0.01; sh.receiveShadow = true; scene.add(sh);
}
function person(x, z, ry = 0, o = {}) {
  const g = grp(x, o.y || 0, z, ry);
  const pants = o.pants ?? 0x2b3552, vest = o.vest ?? LIME;
  if (o.seated) {
    box(0.18, 0.2, 0.62, pants, -0.11, 0.42, 0.2, g); box(0.18, 0.2, 0.62, pants, 0.11, 0.42, 0.2, g);
    box(0.17, 0.45, 0.18, pants, -0.11, 0, 0.45, g); box(0.17, 0.45, 0.18, pants, 0.11, 0, 0.45, g);
  } else {
    box(0.18, 0.82, 0.22, pants, -0.11, 0, 0, g); box(0.18, 0.82, 0.22, pants, 0.11, 0, 0, g);
  }
  const ty = o.seated ? 0.6 : 0.8;
  box(0.52, 0.62, 0.3, vest, 0, ty, 0, g);
  if (o.shirt) box(0.2, 0.62, 0.31, o.shirt, 0, ty, 0.002, g);
  for (const s of [-1, 1]) {
    const pv = grp(s * 0.33, ty + 0.56, 0, 0, g);
    pv.rotation.x = -(o.arms ?? 0.2) * (s === 1 ? 1 : (o.armL ?? 1));
    box(0.13, 0.56, 0.14, vest, 0, -0.56, 0, pv);
    sph(0.075, SKIN, 0, -0.6, 0, pv);
  }
  sph(0.15, SKIN, 0, ty + 0.8, 0, g);
  if (o.helmet !== null) {
    const hm = new THREE.Mesh(new THREE.SphereGeometry(0.175, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(o.helmet ?? WHITE, { r: 0.35 }));
    put(hm, 0, ty + 0.84, 0, g);
    cyl(0.22, 0.22, 0.025, o.helmet ?? WHITE, 0, ty + 0.83, 0.03, g, { r: 0.35 });
  }
  return g;
}
function tree(x, z, s = 1, c = GREEN) {
  cyl(0.07 * s, 0.09 * s, 0.7 * s, 0x7a5a3a, x, 0, z);
  sph(0.55 * s, c, x, 0.95 * s, z, null, { seg: 10 });
  sph(0.4 * s, c, x + 0.25 * s, 1.3 * s, z + 0.1 * s, null, { seg: 10 });
}
function cone(x, z) { cyl(0.02, 0.17, 0.5, ORANGE, x, 0, z); cyl(0.11, 0.13, 0.08, WHITE, x, 0.2, z); box(0.4, 0.04, 0.4, ORANGE, x, 0, z); }
function windowTex(cols, rows, lit = 0.35, frame = '#18274b', glass = '#9fc3e6', litc = '#f6e7a8') {
  return tex(256, 512, (x, w, h) => {
    x.fillStyle = frame; x.fillRect(0, 0, w, h);
    const cw = w / cols, rh = h / rows;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      x.fillStyle = Math.random() < lit ? litc : glass;
      x.fillRect(i * cw + 6, j * rh + 8, cw - 12, rh - 16);
    }
  });
}
function lights(target, size = 14, dir = [6, 12, 5], int = 2.4) {
  const s = new THREE.DirectionalLight(0xfff4e6, int);
  s.position.set(target.x + dir[0], target.y + dir[1], target.z + dir[2]); s.target.position.copy(target);
  s.castShadow = true; s.shadow.mapSize.set(4096, 4096);
  const c = s.shadow.camera; c.left = -size; c.right = size; c.top = size; c.bottom = -size; c.near = 0.5; c.far = 80;
  s.shadow.bias = -0.0004; s.shadow.normalBias = 0.02; s.shadow.radius = 4;
  scene.add(s, s.target);
  scene.add(new THREE.HemisphereLight(0xeef3ff, 0x8a8f80, 0.55));
}
function camera(f, target, dir = [1, 0.82, 1]) {
  const a = W / H;
  const c = new THREE.OrthographicCamera(-f * a, f * a, f, -f, 0.1, 200);
  const d = V(...dir).normalize().multiplyScalar(60);
  c.position.copy(target).add(d); c.lookAt(target); return c;
}

// ---------- scenes ----------
const S = {};

S['ambiente-3d'] = () => {
  bg('#1d2c55', '#0f1834');
  const planks = tex(512, 512, (x, w, h) => {
    for (let i = 0; i < 16; i++) { const l = 62 + Math.random() * 12; x.fillStyle = `hsl(30,42%,${l}%)`; x.fillRect(0, i * 32, w, 31); x.fillStyle = 'rgba(80,50,20,.25)'; x.fillRect(Math.random() * w, i * 32, 2, 32); }
  });
  planks.wrapS = planks.wrapT = THREE.RepeatWrapping; planks.repeat.set(2, 2);
  box(12, 0.3, 9, mat(0xffffff, { map: planks, r: 0.5 }), 0, -0.3, 0, null, { sharp: true });
  box(12.3, 4.2, 0.3, NAVY, -0.15, -0.3, -4.65);
  // left wall with window
  const lw = (h, y, z0, z1) => box(0.3, h, z1 - z0, WHITE, -6.15, y, (z0 + z1) / 2);
  lw(4.2, -0.3, -4.8, -2.8); lw(4.2, -0.3, 2.2, 4.5); lw(0.9, -0.3, -2.8, 2.2); lw(0.5, 3.4, -2.8, 2.2);
  box(0.06, 2.5, 5, mat(GLASS, { t: 0.25, r: 0.05, m: 0.2 }), -6.15, 0.6, -0.3);
  for (const z of [-2.8, -0.3, 2.2]) box(0.12, 2.5, 0.1, DARK, -6.1, 0.6, z);
  // rug
  box(4.6, 0.03, 3.2, LIME, -1.2, 0, 0.6, null, { r: 0.95 });
  // sofa
  const sofa = grp(-1.2, 0, -1.6);
  box(3.6, 0.45, 1.1, 0xe9e7df, 0, 0.12, 0, sofa); box(3.6, 0.8, 0.3, 0xe9e7df, 0, 0.12, -0.45, sofa);
  box(0.3, 0.65, 1.1, 0xe9e7df, -1.8, 0.12, 0, sofa); box(0.3, 0.65, 1.1, 0xe9e7df, 1.8, 0.12, 0, sofa);
  box(1.6, 0.2, 0.9, 0xf4f2ea, -0.82, 0.57, 0.05, sofa); box(1.6, 0.2, 0.9, 0xf4f2ea, 0.82, 0.57, 0.05, sofa);
  box(0.6, 0.5, 0.18, LIME, -1.2, 0.7, -0.22, sofa); box(0.55, 0.45, 0.18, NAVY2, 1.15, 0.7, -0.22, sofa);
  for (const [a, b] of [[-1.7, -0.4], [1.7, -0.4], [-1.7, 0.45], [1.7, 0.45]]) cyl(0.04, 0.03, 0.12, DARK, a, 0, b, sofa);
  // coffee table
  cyl(0.9, 0.9, 0.08, WOOD, -1.2, 0.42, 0.7, null, { seg: 48 });
  cyl(0.08, 0.12, 0.42, DARK, -1.2, 0, 0.7);
  box(0.5, 0.06, 0.35, NAVY, -1.4, 0.5, 0.6); cyl(0.09, 0.07, 0.22, WHITE, -0.85, 0.5, 0.85);
  // armchair
  const ac = grp(1.8, 0, 1.0, -0.9);
  box(1.0, 0.42, 1.0, NAVY2, 0, 0.12, 0, ac); box(1.0, 0.7, 0.22, NAVY2, 0, 0.12, -0.42, ac);
  // kitchen island
  box(3.4, 0.95, 1.1, WHITE, 3.4, 0, -2.4); box(3.6, 0.07, 1.25, WOOD, 3.4, 0.95, -2.4);
  for (const x of [2.5, 3.4, 4.3]) { cyl(0.22, 0.22, 0.06, LIME, x, 0.7, -1.55); cyl(0.03, 0.03, 0.7, DARK, x, 0, -1.55); }
  box(5.2, 2.0, 0.6, 0xe4e4dc, 3.2, 0, -4.2); box(5.2, 0.9, 0.45, 0xe4e4dc, 3.2, 2.6, -4.27);
  box(5.3, 0.05, 0.65, WOOD, 3.2, 2.0, -4.2);
  // pendants
  for (const x of [2.6, 3.4, 4.2]) {
    strut(V(x, 3.9, -2.4), V(x, 2.55, -2.4), 0.01, DARK);
    put(new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.3, 24, 1, true), mat(LIME, { side: THREE.DoubleSide })), x, 2.42, -2.4);
    sph(0.07, 0xfff2c8, x, 2.32, -2.4, null, { e: 0xffd27a, ei: 3 });
    const pl = new THREE.PointLight(0xffd59a, 3, 4, 2); pl.position.set(x, 2.2, -2.4); scene.add(pl);
  }
  // art + shelf
  const art = tex(512, 340, (x, w, h) => { x.fillStyle = '#f3f4ee'; x.fillRect(0, 0, w, h); x.fillStyle = '#b4cc2b'; x.beginPath(); x.arc(180, 170, 110, 0, 7); x.fill(); x.fillStyle = '#0000ee'; x.fillRect(260, 60, 170, 220); x.fillStyle = '#18274b'; x.fillRect(60, 250, 380, 18); });
  box(2.4, 1.6, 0.06, mat(0xffffff, { map: art }), -1.2, 1.5, -4.45, null, { sharp: true });
  box(2.6, 1.8, 0.04, DARK, -1.2, 1.4, -4.48);
  // plant + floor lamp
  cyl(0.3, 0.24, 0.55, WHITE, -5.2, 0, -3.8); sph(0.5, GREEN, -5.2, 1.0, -3.8, null, { seg: 12 }); sph(0.38, 0x76a548, -4.95, 1.45, -3.65, null, { seg: 12 });
  cyl(0.02, 0.02, 1.9, DARK, 0.9, 0, -2.6); cyl(0.2, 0.26, 0.3, 0xf4f2ea, 0.9, 1.85, -2.6, null, { e: 0xffe2a8, ei: 0.6 });
  cyl(0.18, 0.2, 0.04, DARK, 0.9, 0, -2.6);
  const sun = new THREE.DirectionalLight(0xfff0d8, 3.2); sun.position.set(-14, 9, 2); sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096);
  Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10 }); sun.shadow.bias = -0.0004; scene.add(sun);
  scene.add(new THREE.HemisphereLight(0xf2f4ff, 0x6b5a48, 0.9));
  scene.environmentIntensity = 0.7;
  return camera(4.3, V(-0.2, 0.9, -0.4), [1, 0.62, 1.15]);
};

S['laudo-cautelar'] = () => {
  bg('#f4f6ee', '#dfe4cf');
  base(14, 11, GROUND);
  box(14, 0.02, 2.2, 0x7d8290, 0, 0, 3.4, null, { sharp: true });
  for (let x = -6; x <= 6; x += 1.5) box(0.6, 0.021, 0.12, WHITE, x, 0.01, 3.4, null, { sharp: true });
  // house
  const h = grp(-2, 0, -1.5);
  const wt = mat(0xf2efe6);
  box(5.4, 3.0, 4.2, wt, 0, 0, 0, h);
  prism(6.0, 1.6, 4.8, NAVY, 0, 3.0, 0, h);
  for (const x of [-1.6, 1.4]) { box(1.0, 1.0, 0.08, GLASS, x, 1.3, 2.1, h, { r: 0.1, m: 0.3 }); box(1.15, 0.08, 0.12, LIME, x, 1.25, 2.12, h); }
  box(0.9, 1.9, 0.08, NAVY2, -0.1, 0, 2.11, h);
  // cracks
  const cr = [V(0.45, 2.9, 2.13), V(0.6, 2.4, 2.13), V(0.5, 2.05, 2.13), V(0.8, 1.6, 2.13), V(0.75, 1.2, 2.13), V(1.0, 0.6, 2.13)];
  for (let i = 0; i < cr.length - 1; i++) strut(cr[i], cr[i + 1], 0.025, 0x2a2420, h);
  const cr2 = [V(2.4, 2.6, 2.13), V(2.2, 2.2, 2.13), V(2.35, 1.8, 2.13), V(2.1, 1.4, 2.13)];
  for (let i = 0; i < cr2.length - 1; i++) strut(cr2[i], cr2[i + 1], 0.02, 0x2a2420, h);
  for (const p of [[0.55, 2.2], [0.78, 1.4], [2.25, 1.95]]) box(0.28, 0.12, 0.03, LIME, p[0], p[1], 2.15, h, { e: LIME, ei: 0.15 });
  // engineer + tablet
  const eng = person(1.6, 2.2, -2.6, { vest: NAVY, shirt: WHITE, helmet: LIME, arms: 1.1 });
  const tab = box(0.45, 0.32, 0.03, DARK, 0, 1.12, 0.48, eng); tab.rotation.x = -0.6;
  box(0.4, 0.27, 0.01, mat(0x9ce0ff, { e: 0x5fb6ff, ei: 0.5 }), 0, 1.145, 0.5, eng).rotation.x = -0.6;
  // tripod laser
  const tp = grp(2.9, 0, 0.6);
  for (let i = 0; i < 3; i++) { const a = i * 2.09; strut(V(Math.cos(a) * 0.4, 0, Math.sin(a) * 0.4), V(0, 1.2, 0), 0.025, DARK, tp); }
  box(0.3, 0.22, 0.3, LIME, 0, 1.2, 0, tp);
  strut(V(2.9, 1.32, 0.6), V(0.0, 1.85, 0.62), 0.012, mat(RED, { e: RED, ei: 2 }));
  // report clipboard
  const rep = tex(256, 340, (x, w, h2) => { x.fillStyle = '#fff'; x.fillRect(0, 0, w, h2); x.fillStyle = '#18274b'; x.fillRect(20, 20, w - 40, 30); for (let i = 0; i < 9; i++) { x.fillStyle = '#c9ccd6'; x.fillRect(20, 75 + i * 26, w - 40 - (i % 3) * 40, 9); } x.fillStyle = '#b4cc2b'; x.beginPath(); x.arc(200, 290, 26, 0, 7); x.fill(); });
  const cb = box(0.9, 0.04, 1.2, mat(0xffffff, { map: rep }), 4.6, 0, 1.0, null, { sharp: true }); cb.rotation.y = 0.4;
  // neighbour works behind fence
  for (let x = 1.6; x <= 6.5; x += 0.8) cyl(0.04, 0.04, 1.4, CONC2, x, 0, -3.2);
  box(5.0, 1.0, 0.04, mat(LIME, { t: 0.75 }), 4.05, 0.3, -3.2, null, { sharp: true });
  for (const x of [2.5, 4.3, 6.1]) box(0.35, 3.4, 0.35, CONC, x, 0, -4.6);
  box(4.2, 0.25, 1.6, CONC, 4.3, 3.4, -4.6);
  tree(-5.6, 2.0, 1.1); tree(-6.0, -4.0, 0.9);
  lights(V(0, 0, 0), 12, [-5, 12, 7]);
  return camera(6.2, V(0.3, 1.2, 0), [1, 0.8, 1.15]);
};

S['demolicao'] = () => {
  bg('#f2f3ed', '#dcdfd2');
  base(15, 11, GROUND);
  // remaining building part
  const b = grp(-3, 0, -1.5);
  for (const [x, z] of [[-2, -2], [0, -2], [-2, 0], [0, 0], [-2, 2], [0, 2]]) box(0.4, 7.2, 0.4, CONC, x, 0, z, b);
  for (const y of [2.4, 4.8]) box(2.9, 0.3, 4.8, CONC2, -1, y, 0, b);
  box(2.9, 0.3, 4.8, CONC2, -1, 7.2, 0, b);
  box(0.25, 7.2, 4.6, 0xe9e6dc, -2.3, 0, 0, b);
  const broken = box(3.0, 0.3, 4.0, CONC2, 1.3, 2.0, 0.2, b); broken.rotation.z = -0.55;
  for (let i = 0; i < 6; i++) strut(V(0.2, 4.8, -1.8 + i * 0.7), V(0.9 + Math.random() * 0.4, 4.2 - Math.random() * 0.7, -1.8 + i * 0.7), 0.025, 0x6b4b3a, b);
  // rubble
  for (let i = 0; i < 70; i++) {
    const s = 0.15 + Math.random() * 0.45; const a = Math.random() * 6.28, r = Math.random() * 2.2;
    const m = box(s, s * 0.7, s, Math.random() < 0.8 ? CONC : 0xc88a6a, 0.6 + Math.cos(a) * r * 1.2, Math.max(0, 0.8 - r * 0.35) * Math.random(), -1 + Math.sin(a) * r);
    m.rotation.set(Math.random(), Math.random(), Math.random());
  }
  // excavator
  const ex = grp(3.6, 0, 1.4, -2.4);
  box(2.6, 0.6, 0.6, DARK, 0, 0, -0.9, ex); box(2.6, 0.6, 0.6, DARK, 0, 0, 0.9, ex);
  cyl(0.45, 0.45, 0.4, 0x3a404c, 0, 0.6, 0, ex);
  box(2.4, 0.9, 2.0, LIME, -0.2, 0.95, 0, ex, { r: 0.4 });
  box(0.8, 0.8, 2.0, NAVY, -1.2, 0.95, 0, ex);
  box(1.0, 1.1, 0.9, LIME, 0.5, 1.85, 0.5, ex);
  box(0.85, 0.8, 0.02, mat(GLASS, { t: 0.6 }), 0.55, 2.0, 0.96, ex, { sharp: true });
  const p1 = V(0.9, 1.6, -0.3), p2 = V(2.6, 3.8, -0.3), p3 = V(3.9, 1.8, -0.3);
  beam(p1, p2, 0.35, 0.4, NAVY, ex); beam(p2, p3, 0.28, 0.32, NAVY, ex);
  strut(V(3.9, 1.8, -0.3), V(4.1, 0.6, -0.3), 0.15, 0x3a404c, ex); strut(V(4.1, 0.6, -0.3), V(4.15, 0.25, -0.3), 0.06, DARK, ex);
  // dust
  for (let i = 0; i < 26; i++) sph(0.3 + Math.random() * 0.6, 0xf2efe6, -1.6 + Math.random() * 3, 0.6 + Math.random() * 3.5, -1.5 + Math.random() * 3, null, { t: 0.35, r: 1 });
  // fence + cones
  for (let x = -6.5; x <= 6.5; x += 1.3) cyl(0.04, 0.04, 1.2, DARK, x, 0, 4.6);
  box(13, 0.9, 0.03, mat(ORANGE, { t: 0.8 }), 0, 0.2, 4.6, null, { sharp: true });
  for (const x of [-5, -3.5, 5.6]) cone(x, 3.6);
  lights(V(0, 0, 0), 13, [-6, 12, 6]);
  return camera(7.4, V(0.3, 2.8, 0), [1, 0.72, 1.1]);
};

S['projeto-arquitetonico'] = () => {
  bg('#eef0e8', '#d5dac6');
  const wood = tex(512, 512, (x, w, h) => { x.fillStyle = '#c9a274'; x.fillRect(0, 0, w, h); for (let i = 0; i < 90; i++) { x.strokeStyle = `rgba(110,70,30,${Math.random() * 0.18})`; x.beginPath(); x.moveTo(0, Math.random() * h); x.bezierCurveTo(w / 3, Math.random() * h, w * 2 / 3, Math.random() * h, w, Math.random() * h); x.stroke(); } });
  put(new THREE.Mesh(new RoundedBoxGeometry(16, 0.5, 11, 4, 0.2), mat(0xffffff, { map: wood, r: 0.5 })), 0, -0.25, 0);
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.18 })); sh.rotation.x = -Math.PI / 2; sh.position.y = -0.51; sh.receiveShadow = true; scene.add(sh);
  const plan = (seed) => tex(1024, 720, (x, w, h) => {
    x.fillStyle = '#18274b'; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(255,255,255,.08)'; for (let i = 0; i < w; i += 24) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, h); x.stroke(); } for (let i = 0; i < h; i += 24) { x.beginPath(); x.moveTo(0, i); x.lineTo(w, i); x.stroke(); }
    x.strokeStyle = '#eef0e6'; x.lineWidth = 7; x.strokeRect(120, 110, 620, 440);
    x.lineWidth = 4; x.beginPath(); x.moveTo(420, 110); x.lineTo(420, 380); x.moveTo(120, 330); x.lineTo(420, 330); x.moveTo(420, 260); x.lineTo(740, 260); x.moveTo(560, 260); x.lineTo(560, 550); x.stroke();
    x.strokeStyle = '#b4cc2b'; x.lineWidth = 3; x.beginPath(); x.arc(420, 380, 60, -Math.PI / 2, 0); x.stroke(); x.beginPath(); x.arc(560, 470, 50, Math.PI, Math.PI * 1.5); x.stroke();
    x.strokeStyle = '#b4cc2b'; x.lineWidth = 2; x.beginPath(); x.moveTo(120, 80); x.lineTo(740, 80); x.moveTo(770, 110); x.lineTo(770, 550); x.stroke();
    x.fillStyle = '#eef0e6'; x.fillRect(800, 560, 200, 130); x.fillStyle = '#18274b'; for (let i = 0; i < 4; i++) x.fillRect(815, 580 + i * 26, 160 - i * 25, 8);
    if (seed) { x.fillStyle = 'rgba(180,204,43,.25)'; x.fillRect(430, 120, 300, 130); }
  });
  const s1 = box(7.4, 0.02, 5.2, mat(0xffffff, { map: plan(0), r: 0.9 }), -2.0, 0, 0.6, null, { sharp: true }); s1.rotation.y = 0.12;
  const s2 = box(6.6, 0.02, 4.6, mat(0xffffff, { map: plan(1), r: 0.9 }), 3.6, 0, -1.6, null, { sharp: true }); s2.rotation.y = -0.18;
  // model house
  const m = grp(-1.8, 0.03, 0.4, 0.25);
  const wm = mat(0xfbfbf6, { r: 0.85 });
  box(3.6, 1.3, 2.4, wm, 0, 0, 0, m); box(2.4, 1.2, 2.6, wm, 0.4, 1.3, -0.2, m); box(4.0, 0.12, 2.8, wm, 0, 1.3, 0.1, m); box(2.8, 0.12, 3.0, wm, 0.4, 2.5, -0.2, m);
  box(1.6, 0.9, 0.04, mat(GLASS, { t: 0.7, m: 0.3, r: 0.1 }), -0.8, 0.2, 1.21, m, { sharp: true });
  box(1.6, 0.8, 0.04, mat(GLASS, { t: 0.7, m: 0.3, r: 0.1 }), 0.6, 1.5, 1.11, m, { sharp: true });
  box(0.6, 1.2, 0.06, LIME, 1.3, 0, 1.22, m);
  box(1.4, 0.04, 1.2, 0x8fb7d9, -1.0, 0, 2.0, m, { m: 0.3, r: 0.1 });
  for (const [x, z] of [[2.3, 1.6], [-2.4, 1.4], [2.4, -1.4]]) { cyl(0.02, 0.02, 0.4, 0xd5d5ce, x, 0, z, m); sph(0.28, 0xeaeae2, x, 0.6, z, m, { seg: 12 }); }
  // tools
  const pen = grp(2.4, 0.08, 2.4, 0.8); const pc = cyl(0.07, 0.07, 2.2, LIME, 0, 0, 0, pen, { seg: 6 }); pc.rotation.z = Math.PI / 2; pc.position.set(0, 0.05, 0);
  const tip = put(new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.25, 6), mat(0xe8cfa6)), 1.22, 0.05, 0, pen); tip.rotation.z = -Math.PI / 2;
  const rul = tex(512, 64, (x, w, h) => { x.fillStyle = '#f3f4ee'; x.fillRect(0, 0, w, h); x.fillStyle = '#18274b'; for (let i = 0; i < 64; i++) x.fillRect(i * 8, 0, 2, i % 5 ? 14 : 28); });
  const r = box(4.0, 0.05, 0.45, mat(0xffffff, { map: rul }), 3.4, 0.04, 1.6, null, { sharp: true }); r.rotation.y = 0.3;
  for (const [x, z, c] of [[5.6, -4.3, WHITE], [6.0, -3.7, 0x6e8fd6], [5.2, -3.9, WHITE]]) { const rr = cyl(0.25, 0.25, 3.2, c, x, 0.25, z); rr.rotation.z = Math.PI / 2; rr.rotation.y = 0.5; }
  const sq = box(1.6, 0.04, 1.6, mat(NAVY, { t: 0.55 }), -5.6, 0.04, -2.6, null, { sharp: true }); sq.rotation.y = 0.5;
  lights(V(0, 0, 0), 12, [-7, 11, 4], 2.6);
  return camera(5.4, V(0.2, 0.6, 0), [1, 1.05, 1.2]);
};

S['canteiro'] = () => {
  bg('#eef1f5', '#d7dce4');
  base(16, 12, 0xd8d3c4);
  // structure
  const st = grp(-2.2, 0, -1.2);
  const F = 4;
  for (let f = 0; f < F; f++) {
    for (const x of [-2.4, 0, 2.4]) for (const z of [-2, 0, 2]) if (!(f === F - 1 && x > 0)) box(0.35, 2.4, 0.35, CONC, x, f * 2.6, z, st);
    if (f < F - 1) box(5.4, 0.22, 4.7, CONC2, 0, (f + 1) * 2.6 - 0.2, 0, st);
  }
  for (let i = 0; i < 8; i++) strut(V(0.2 + i * 0.3, 7.8, -2.1), V(0.2 + i * 0.3, 9.4, -2.1), 0.02, 0x7a4b30, st);
  for (const x of [-2.4, 0]) for (let i = 0; i < 4; i++) strut(V(x - 0.12 + (i % 2) * 0.24, 10.4, -2.1 + (i > 1) * 0.24), V(x - 0.12 + (i % 2) * 0.24, 11.0, -2.1 + (i > 1) * 0.24), 0.02, 0x7a4b30, st);
  box(2.6, 0.22, 4.7, CONC2, -1.3, 10.2, 0, st);
  // scaffolding front
  const sc = mat(LIME, { m: 0.4, r: 0.4 });
  for (let x = -2.8; x <= 2.81; x += 1.4) strut(V(x, 0, 2.9), V(x, 8.4, 2.9), 0.04, sc, st), strut(V(x, 0, 3.6), V(x, 8.4, 3.6), 0.04, sc, st);
  for (let y = 1.3; y < 8.5; y += 2.6) { strut(V(-2.8, y, 2.9), V(2.8, y, 2.9), 0.035, sc, st); strut(V(-2.8, y, 3.6), V(2.8, y, 3.6), 0.035, sc, st); box(5.6, 0.06, 0.6, WOOD, 0, y - 0.06, 3.25, st); }
  // crane
  const cr = grp(4.2, 0, -3.2);
  box(1.6, 0.5, 1.6, CONC2, 0, 0, 0, cr);
  const cm = mat(LIME, { m: 0.3, r: 0.45 });
  for (const [x, z] of [[-0.35, -0.35], [0.35, -0.35], [-0.35, 0.35], [0.35, 0.35]]) strut(V(x, 0.5, z), V(x, 13, z), 0.05, cm, cr);
  for (let y = 0.5; y < 13; y += 0.9) { strut(V(-0.35, y, 0.35), V(0.35, y + 0.9, 0.35), 0.025, cm, cr); strut(V(0.35, y, -0.35), V(0.35, y + 0.9, 0.35), 0.025, cm, cr); }
  box(1.1, 0.9, 1.1, NAVY, 0.5, 13, 0.4, cr);
  const jb = mat(LIME, { m: 0.3, r: 0.45 });
  for (const z of [-0.3, 0.3]) strut(V(-9, 13.0, z), V(4, 13.0, z), 0.05, jb, cr);
  strut(V(-9, 13.6, 0), V(4, 13.0, 0), 0.04, jb, cr);
  for (let x = -9; x < 4; x += 0.8) strut(V(x, 13.0, 0.3), V(x + 0.4, 13.55, 0), 0.025, jb, cr), strut(V(x, 13.0, -0.3), V(x + 0.4, 13.55, 0), 0.025, jb, cr);
  box(1.4, 1.0, 0.9, CONC2, 3.4, 12.0, 0, cr);
  strut(V(0, 13, 0), V(0, 15, 0), 0.06, NAVY, cr); strut(V(0, 15, 0), V(3.8, 13.1, 0), 0.02, DARK, cr); strut(V(0, 15, 0), V(-8.8, 13.1, 0), 0.02, DARK, cr);
  box(0.6, 0.3, 0.8, NAVY, -5.4, 12.75, 0, cr);
  strut(V(-5.4, 12.75, 0), V(-5.4, 11.6, 0), 0.015, DARK, cr);
  for (let i = 0; i < 4; i++) box(2.2, 0.16, 0.16, NAVY2, -5.4, 10.9 + i * 0.17, -0.25 + (i % 2) * 0.2, cr);
  // containers
  const cont = (x, z, c, ry) => { const g = grp(x, 0, z, ry); box(3.0, 1.3, 1.25, c, 0, 0, 0, g); for (let i = -1.3; i <= 1.31; i += 0.26) box(0.06, 1.2, 0.02, c, i, 0.05, 0.635, g, { sharp: true }); box(0.5, 0.4, 0.02, GLASS, 0.9, 0.6, 0.64, g); return g; };
  cont(-5.5, 3.6, NAVY, 0); cont(-5.5, 3.6, LIME, 0).position.y = 1.32; cont(-6.1, 0.4, NAVY2, Math.PI / 2);
  // materials
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) box(0.9, 0.6, 0.9, 0xc0704e, 2.4 + i * 1.0, 0.12 + j * 0.0, 4.2 + j * 1.0), box(1.0, 0.12, 1.0, WOOD, 2.4 + i * 1.0, 0, 4.2 + j * 1.0);
  for (let i = 0; i < 8; i++) strut(V(5.2, 0.08 + (i % 3) * 0.06, 1.2 + i * 0.07), V(7.4, 0.08 + (i % 3) * 0.06, 1.2 + i * 0.07), 0.035, 0x6b4b3a);
  cyl(0.5, 0.5, 1.4, WHITE, 6.6, 0, 3.4); cyl(0.55, 0.55, 0.15, NAVY, 6.6, 1.3, 3.4);
  person(1.0, 4.7, 0.4, { vest: LIME }); person(-3.4, 5.0, -0.6, { vest: ORANGE, helmet: WHITE }); person(-0.8, 3.2, 2.8, { vest: LIME, y: 2.6, helmet: LIME });
  for (let x = -7.5; x <= 7.5; x += 1.5) cyl(0.04, 0.04, 1.2, DARK, x, 0, 5.8);
  box(15, 0.9, 0.03, mat(NAVY, { t: 0.85 }), 0, 0.25, 5.8, null, { sharp: true });
  lights(V(0, 0, 0), 16, [-7, 14, 7]);
  return camera(9.4, V(0.2, 6.2, 0), [1, 0.62, 1.08]);
};

S['avcb'] = () => {
  bg('#eef1f5', '#d6dbe4');
  base(14, 10.5, 0xe3e4dc);
  // two floors cutaway
  box(13, 0.25, 9.5, 0xdcdcd4, 0, 0, 0);
  box(0.3, 7.2, 9.5, NAVY, -6.4, 0, 0); box(13, 7.2, 0.3, NAVY2, 0, 0, -4.6);
  box(8.4, 0.3, 3.4, 0xd0d1c9, 2.0, 3.6, -2.8); box(8.4, 1.0, 0.08, mat(GLASS, { t: 0.35 }), 2.0, 3.9, -1.1, null, { sharp: true }); for (const x of [-2.0, 2.0, 6.0]) box(0.3, 3.35, 0.3, CONC, x, 0.25, -1.3);
  for (let i = 0; i < 9; i++) box(1.6, 0.3 + i * 0.4, 0.42, CONC, -5.4, 0.25, 3.6 - i * 0.42);
  box(1.8, 0.25, 1.4, CONC, -5.4, 3.6, -0.6);
  strut(V(-4.55, 0.25, 4.0), V(-4.55, 3.95, 0.15), 0.04, LIME, null, { m: 0.5 });
  // floor markings
  for (let i = 0; i < 6; i++) box(1.0, 0.02, 0.15, LIME, -3 + i * 1.5, 0.25, 2.6, null, { sharp: true });
  // extinguishers
  const ext = (x, y, z) => { cyl(0.16, 0.16, 0.75, RED, x, y, z, null, { r: 0.3, m: 0.2 }); cyl(0.05, 0.07, 0.1, DARK, x, y + 0.75, z); box(0.3, 0.06, 0.06, DARK, x + 0.05, y + 0.85, z); strut(V(x + 0.1, y + 0.82, z), V(x + 0.22, y + 0.3, z + 0.05), 0.025, DARK); box(0.6, 0.6, 0.02, RED, x, y - 0.75, -4.44, null, { sharp: true }); };
  ext(-2.0, 0.85, -4.25); ext(3.8, 4.4, -4.25);
  // hydrant cabinet
  box(1.3, 1.6, 0.4, RED, 0.6, 0.9, -4.25, null, { r: 0.35 }); box(1.05, 1.3, 0.03, mat(GLASS, { t: 0.5 }), 0.6, 1.05, -4.04, null, { sharp: true });
  const hose = put(new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.08, 10, 30), mat(0xeeeeea)), 0.6, 1.75, -4.15); hose.castShadow = true;
  box(0.3, 0.12, 0.12, mat(0xffffff, { e: 0xffffff, ei: 1 }), 0.6, 2.6, -4.3);
  // sprinklers
  const pipe = mat(RED, { m: 0.3, r: 0.35 });
  strut(V(-3.8, 3.3, -3.6), V(6.2, 3.3, -3.6), 0.07, pipe); strut(V(-3.8, 3.3, -1.4), V(6.2, 3.3, -1.4), 0.07, pipe); strut(V(-3.8, 3.3, -3.6), V(-3.8, 3.3, -1.4), 0.07, pipe);
  for (let x = -2.8; x < 6.2; x += 2.0) for (const z of [-3.6, -1.4]) { cyl(0.03, 0.03, 0.18, 0xd0b060, x, 3.1, z, null, { m: 0.8 }); cyl(0.11, 0.11, 0.02, 0xd0b060, x, 3.08, z, null, { m: 0.8 }); }
   strut(V(-1.0, 7.0, -3.6), V(6.0, 7.0, -3.6), 0.06, pipe);
  // exit signs
  const exitT = tex(512, 200, (x, w, h) => { x.fillStyle = '#13a051'; x.fillRect(0, 0, w, h); x.fillStyle = '#fff'; x.font = 'bold 120px sans-serif'; x.fillText('SAÍDA', 40, 145); x.beginPath(); x.moveTo(430, 60); x.lineTo(490, 100); x.lineTo(430, 140); x.fill(); });
  for (const [x, y, z, ry] of [[-3.5, 2.6, -4.42, 0], [2.5, 6.2, -4.42, 0], [-6.22, 2.6, 2.0, Math.PI / 2]]) { const s = box(1.1, 0.42, 0.06, mat(0xffffff, { map: exitT, emap: exitT, e: 0xffffff, ei: 0.6 }), x, y, z, null, { sharp: true }); s.rotation.y = ry; }
  // smoke detectors / emergency lights
  for (const [x, z] of [[-1, -2.5], [3, -2.5]]) cyl(0.18, 0.2, 0.08, WHITE, x, 3.52, z);
  for (const [x, z] of [[1.6, -4.42], [5.2, -4.42]]) box(0.6, 0.18, 0.12, mat(0xffffff, { e: 0xfff6d6, ei: 1.2 }), x, 6.6, z);
  // fire door
  box(1.2, 2.2, 0.12, 0x8f979f, -6.2, 0.25, -2.2, null, { m: 0.5 }).rotation.y = Math.PI / 2;
  // person + upper furniture
  person(1.8, 1.4, -0.7, { vest: NAVY, shirt: WHITE, helmet: null, pants: DARK });
  box(2.2, 0.8, 1.0, WHITE, 1.0, 3.9, -2.5); box(2.4, 0.06, 1.1, WOOD, 1.0, 4.7, -2.5);
  ext(5.6, 4.7, -3.6); person(-2.6, -0.4, 0.5, { vest: LIME, helmet: WHITE, arms: 0.8 });
  lights(V(0, 0, 0), 12, [5, 12, 9]);
  return camera(6.0, V(0.3, 2.4, 0.2), [1, 0.6, 1.15]);
};

S['topografia'] = () => {
  bg('#f1f5ee', '#d6e0cf');
  const g = new THREE.PlaneGeometry(15, 11, 120, 90); g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position; const cols = [];
  const hf = (x, z) => 0.9 * Math.sin(x * 0.35 + 0.6) * Math.cos(z * 0.4) + 0.55 * Math.sin(x * 0.8 + z * 0.5) + 0.8;
  const c1 = new THREE.Color(0xc8d79a), c2 = new THREE.Color(0xa3bd5a), cl = new THREE.Color(NAVY);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i); const y = hf(x, z); pos.setY(i, y);
    const band = (y * 4) % 1; const c = band < 0.09 ? cl : c1.clone().lerp(c2, y / 2.4);
    cols.push(c.r, c.g, c.b);
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3)); g.computeVertexNormals();
  const terr = put(new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9 })), 0, 0, 0);
  // skirt base
  box(15, 0.6, 11, 0x8d7a5f, 0, -0.6, 0, null, { sharp: true });
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.18 })); sh.rotation.x = -Math.PI / 2; sh.position.y = -0.61; sh.receiveShadow = true; scene.add(sh);
  // total station
  const tsx = -2.2, tsz = 1.5, ty = hf(tsx, tsz);
  const ts = grp(tsx, ty, tsz);
  for (let i = 0; i < 3; i++) { const a = i * 2.09 + 0.3; strut(V(Math.cos(a) * 0.55, 0, Math.sin(a) * 0.55), V(0, 1.45, 0), 0.035, WOOD, ts); }
  cyl(0.22, 0.22, 0.08, DARK, 0, 1.45, 0, ts);
  box(0.4, 0.5, 0.3, LIME, 0, 1.53, 0, ts); const tel = cyl(0.07, 0.09, 0.5, NAVY, 0, 0, 0, ts); tel.rotation.z = Math.PI / 2; tel.position.set(0.05, 1.85, 0);
  box(0.25, 0.18, 0.02, mat(0x9ce0ff, { e: 0x5fb6ff, ei: 0.5 }), 0, 1.6, 0.16, ts, { sharp: true });
  person(tsx - 0.6, tsz + 0.4, 1.2, { vest: LIME, helmet: WHITE, arms: 0.9 }).position.y = ty;
  // GNSS rover
  const rx = 3.2, rz = -0.8, ry = hf(rx, rz);
  strut(V(rx + 0.35, ry, rz), V(rx + 0.35, ry + 2.1, rz), 0.03, mat(0xffd84a));
  for (let k = 0; k < 6; k++) box(0.075, 0.12, 0.075, RED, rx + 0.35, ry + k * 0.35, rz);
  cyl(0.18, 0.2, 0.15, WHITE, rx + 0.35, ry + 2.1, rz);
  person(rx, rz + 0.2, -0.6, { vest: NAVY, shirt: LIME, helmet: LIME, arms: 0.7 }).position.y = ry;
  // laser line
  strut(V(tsx + 0.3, ty + 1.85, tsz), V(rx + 0.35, ry + 1.6, rz), 0.012, mat(RED, { e: RED, ei: 2, t: 0.8 }));
  // stakes
  for (const [x, z] of [[-5.5, -3.5], [-1, -3.8], [1.5, 3.8], [5.5, 2.6], [5.8, -3.6], [-5.8, 3.4]]) { const y = hf(x, z); cyl(0.04, 0.04, 0.7, WOOD, x, y, z); box(0.3, 0.18, 0.02, LIME, x + 0.15, y + 0.5, z, null, { sharp: true }); }
  // drone
  const dr = grp(0.8, 4.4, -1.5, 0.5);
  box(0.6, 0.18, 0.6, NAVY, 0, 0, 0, dr); box(0.3, 0.1, 0.3, LIME, 0, 0.18, 0, dr);
  for (const [x, z] of [[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]]) { strut(V(0, 0.09, 0), V(x, 0.12, z), 0.03, DARK, dr); cyl(0.04, 0.04, 0.12, DARK, x, 0.1, z, dr); cyl(0.35, 0.35, 0.01, mat(0xdde3ea, { t: 0.5 }), x, 0.23, z, dr); }
  box(0.14, 0.14, 0.14, DARK, 0, -0.16, 0.18, dr);
  const cone2 = new THREE.Mesh(new THREE.ConeGeometry(2.2, 4.0, 4, 1, true), mat(LIME, { t: 0.12, side: THREE.DoubleSide })); cone2.position.set(0.8, 2.3, -1.5); cone2.rotation.y = 0.8; root.add(cone2);
  tree(-6.3, -1, 0.9); tree(6.4, 4.4, 0.8); tree(-4.2, -4.5, 0.7);
  lights(V(0, 0, 0), 12, [-6, 12, 5]);
  return camera(6.9, V(0.2, 1.4, 0), [1, 0.78, 1.15]);
};

S['pre-moldado'] = () => {
  bg('#eef1f5', '#d5dbe3');
  base(16, 12, 0xd9d6cc);
  // frame
  const fr = grp(-2.4, 0, -1.6);
  const cc = mat(0xcfd0c9, { r: 0.85 });
  for (let i = 0; i < 4; i++) for (const z of [-2.6, 2.6]) { box(0.5, 5.2, 0.5, cc, -4.5 + i * 3, 0, z, fr); box(0.5, 0.35, 0.5, cc, -4.5 + i * 3, 4.6, z + (z > 0 ? -0.45 : 0.45), fr); }
  for (let i = 0; i < 3; i++) box(0.5, 0.7, 5.8, cc, -4.5 + i * 3, 5.2, 0, fr);
  for (const z of [-2.6, 2.6]) box(9.5, 0.55, 0.4, cc, -0.0, 4.65, z, fr);
  const dt = (x) => { const g = grp(x, 5.9, 0, 0, fr); box(1.45, 0.12, 5.8, cc, 0, 0, 0, g); box(0.18, 0.5, 5.8, cc, -0.4, -0.5, 0, g); box(0.18, 0.5, 5.8, cc, 0.4, -0.5, 0, g); };
  for (let i = 0; i < 4; i++) dt(-3.75 + i * 1.5);
  for (let i = 0; i < 2; i++) box(0.22, 3.6, 3.0, 0xd9dad3, -4.5 + 1.5, 0, -2.6 + 0.0, fr).position.set(-4.5 + 1.5 + i * 3, 1.8, -2.75);
  // mobile crane
  const cr = grp(4.6, 0, 1.6, -0.5);
  box(5.2, 0.8, 2.0, NAVY, 0, 0.55, 0, cr);
  for (const x of [-1.8, -0.6, 1.2, 2.2]) for (const z of [-1.0, 1.0]) { const w = cyl(0.45, 0.45, 0.35, DARK, x, 0, z, cr); w.rotation.x = Math.PI / 2; w.position.y = 0.45; }
  box(1.2, 1.1, 1.9, LIME, 2.3, 1.35, 0, cr); box(0.05, 0.6, 1.5, mat(GLASS, { t: 0.6 }), 2.92, 1.75, 0, cr, { sharp: true });
  box(1.6, 0.8, 1.6, LIME, -0.9, 1.35, 0, cr);
  for (const [x, z] of [[-2.2, 1.6], [-2.2, -1.6], [1.6, 1.6], [1.6, -1.6]]) { box(0.3, 0.2, 1.0, DARK, x, 0.45, z * 0.75, cr); box(0.5, 0.1, 0.5, DARK, x, 0, z, cr); strut(V(x, 0.1, z), V(x, 0.5, z), 0.06, DARK, cr); }
  const b0 = V(-1.4, 2.2, 0), b1 = V(-5.2, 9.6, 0);
  beam(b0, V(-3.0, 5.4, 0), 0.6, 0.6, LIME, cr); beam(V(-3.0, 5.4, 0), b1, 0.42, 0.42, LIME, cr);
  strut(V(-0.6, 2.0, 0), V(-2.2, 4.2, 0), 0.12, DARK, cr);
  // lifted beam (world coords)
  const tip = new THREE.Vector3(); cr.updateMatrixWorld(); tip.copy(b1).applyMatrix4(cr.matrixWorld);
  strut(tip, V(tip.x, 7.4, tip.z), 0.02, DARK);
  box(0.3, 0.3, 0.3, 0xffd84a, tip.x, 7.1, tip.z);
  strut(V(tip.x, 7.1, tip.z), V(tip.x - 1.6, 6.5, tip.z), 0.015, DARK); strut(V(tip.x, 7.1, tip.z), V(tip.x + 1.6, 6.5, tip.z), 0.015, DARK);
  box(4.0, 0.5, 0.45, cc, tip.x, 6.0, tip.z);
  strut(V(tip.x - 1.9, 6.1, tip.z), V(tip.x - 2.6, 1.0, tip.z + 0.8), 0.012, 0xffd84a);
  person(tip.x - 2.7, tip.z + 1.0, 0.6, { vest: LIME, arms: 1.4 });
  // stacked panels & beams
  for (let i = 0; i < 4; i++) box(4.2, 0.22, 1.6, i % 2 ? 0xc9cac2 : 0xd4d5ce, -4.0, i * 0.24, 4.4);
  for (let i = 0; i < 3; i++) box(0.25, 0.25, 4.2, WOOD, -5.7 + i * 1.7, -0.02, 4.4);
  for (let i = 0; i < 3; i++) box(3.6, 0.45, 0.4, cc, 1.0, 0, 4.0 + i * 0.5);
  person(-0.4, 3.0, 2.4, { vest: NAVY, shirt: WHITE, helmet: LIME });
  for (const x of [-7, 7]) cone(x, 5.2);
  lights(V(0, 0, 0), 15, [-7, 13, 7]);
  return camera(7.6, V(0.2, 3.4, 0.4), [1, 0.66, 1.1]);
};

S['gestao'] = () => {
  bg('#1b2a52', '#0e1733');
  const wood = tex(512, 512, (x, w, h) => { x.fillStyle = '#d7d9cf'; x.fillRect(0, 0, w, h); });
  put(new THREE.Mesh(new RoundedBoxGeometry(14, 0.5, 9, 4, 0.2), mat(0xeef0e6, { r: 0.7 })), 0, -0.25, 0);
  // laptop
  const gantt = tex(1024, 640, (x, w, h) => {
    x.fillStyle = '#0f1833'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#18274b'; x.fillRect(0, 0, w, 60); x.fillStyle = '#b4cc2b'; x.fillRect(24, 22, 140, 16);
    x.strokeStyle = 'rgba(255,255,255,.08)'; for (let i = 240; i < w; i += 48) { x.beginPath(); x.moveTo(i, 70); x.lineTo(i, h); x.stroke(); }
    const rows = [[0, 4], [2, 5], [4, 6], [6, 4], [9, 5], [11, 3], [12, 4], [14, 2]];
    rows.forEach(([s, l], i) => { x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(24, 96 + i * 64, 160, 12); x.fillStyle = i % 3 === 2 ? '#7f86ff' : '#b4cc2b'; x.fillRect(240 + s * 48, 88 + i * 64, l * 48, 28); });
    x.fillStyle = '#ff5c4d'; x.fillRect(240 + 8.5 * 48, 70, 3, h);
  });
  const lp = grp(-1.6, 0, 0.6, 0.35);
  box(3.4, 0.12, 2.3, 0xbfc3c9, 0, 0, 0, lp, { m: 0.6, r: 0.3 });
  box(3.0, 0.02, 1.0, DARK, 0, 0.12, 0.15, lp, { sharp: true });
  const scr = grp(0, 0.12, -1.12, 0, lp); scr.rotation.x = -0.25;
  box(3.4, 2.2, 0.08, 0xbfc3c9, 0, 0, 0, scr, { m: 0.6, r: 0.3 });
  box(3.15, 1.95, 0.01, mat(0xffffff, { map: gantt, emap: gantt, e: 0xffffff, ei: 0.55 }), 0, 0.12, 0.045, scr, { sharp: true });
  // helmet
  const hm = put(new THREE.Mesh(new THREE.SphereGeometry(0.75, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat(WHITE, { r: 0.3 })), 2.6, 0.12, 1.4);
  cyl(0.95, 0.95, 0.06, WHITE, 2.6, 0.08, 1.55, null, { r: 0.3 }); box(0.12, 0.08, 1.4, LIME, 2.6, 0.72, 1.4);
  // rolls
  for (const [x, z, c, r] of [[3.6, -1.6, WHITE, 0.4], [4.6, -1.0, 0x7f9be0, 0.3], [3.0, -2.3, WHITE, 0.25]]) { const m = cyl(0.22, 0.22, 3.4, c, x, r, z); m.rotation.z = Math.PI / 2; m.rotation.y = 0.7; m.position.y = 0.22; }
  // building model
  const bm = grp(-5.0, 0, -1.6, 0.3);
  box(1.4, 3.0, 1.4, mat(0xffffff, { map: windowTex(4, 8, 0.4) }), 0, 0, 0, bm); box(1.0, 1.8, 1.0, mat(0xffffff, { map: windowTex(3, 5, 0.4) }), 1.1, 0, 0.4, bm); box(1.8, 0.1, 2.0, NAVY, 0.4, 0, 0.2, bm);
  // mug + phone + calendar
  cyl(0.32, 0.3, 0.7, NAVY, 0.9, 0, 2.8); const hd = put(new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.05, 8, 16), mat(NAVY)), 1.25, 0.38, 2.8);
  box(0.8, 0.06, 1.5, DARK, -4.6, 0, 2.4).rotation.y = 0.4;
  const cal = tex(400, 400, (x, w, h) => { x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.fillStyle = '#b4cc2b'; x.fillRect(0, 0, w, 80); x.fillStyle = '#18274b'; for (let i = 0; i < 5; i++) for (let j = 0; j < 7; j++) x.fillRect(20 + j * 54, 100 + i * 58, 40, 40); x.fillStyle = '#ff5c4d'; x.fillRect(20 + 3 * 54, 100 + 2 * 58, 40, 40); });
  const cg = grp(4.8, 0, 2.8, -0.5); const cp = box(1.4, 1.4, 0.03, mat(0xffffff, { map: cal }), 0, 0, 0, cg, { sharp: true }); cp.rotation.x = -0.25;
  // floating panels
  const panel = (draw, x, y, z, w = 2.6, h = 1.8, ry = 0) => { const t = tex(512, 360, draw); const m = box(w, h, 0.04, mat(0xffffff, { map: t, emap: t, e: 0xffffff, ei: 0.35, t: 0.92 }), x, y, z, null, { sharp: true }); m.rotation.y = ry; m.castShadow = false; return m; };
  panel((x, w, h) => { x.fillStyle = '#18274b'; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(255,255,255,.5)'; x.fillRect(24, 24, 160, 14); [0.3, 0.5, 0.45, 0.7, 0.62, 0.85].forEach((v, i) => { x.fillStyle = i === 5 ? '#b4cc2b' : '#7f86ff'; x.fillRect(40 + i * 75, h - 30 - v * 250, 46, v * 250); }); }, 2.4, 3.6, -2.4, 2.6, 1.8, -0.4);
  panel((x, w, h) => { x.fillStyle = '#18274b'; x.fillRect(0, 0, w, h); x.strokeStyle = '#b4cc2b'; x.lineWidth = 8; x.beginPath(); x.moveTo(30, 310); x.bezierCurveTo(160, 300, 220, 120, 480, 50); x.stroke(); x.strokeStyle = 'rgba(255,255,255,.4)'; x.lineWidth = 4; x.setLineDash([14, 10]); x.beginPath(); x.moveTo(30, 310); x.bezierCurveTo(180, 290, 260, 160, 480, 90); x.stroke(); }, -3.6, 3.4, -2.6, 2.6, 1.8, 0.45);
  panel((x, w, h) => { x.fillStyle = '#b4cc2b'; x.fillRect(0, 0, w, h); x.fillStyle = '#18274b'; x.font = 'bold 150px sans-serif'; x.fillText('87%', 70, 230); }, -0.6, 4.6, -3.2, 1.8, 1.25, 0);
  { const pl = new THREE.PointLight(0xb4cc2b, 6, 8, 2); pl.position.set(0, 4, -2); scene.add(pl); }
  lights(V(0, 0, 0), 11, [-6, 12, 7], 2.6);
  return camera(5.2, V(0, 1.6, 0), [1, 0.85, 1.25]);
};

S['consultoria'] = () => {
  bg('#eaf0f8', '#cfd8e6');
  base(15, 11, 0xe9eae2);
  // skyline
  for (let i = 0; i < 9; i++) { const h = 2.2 + Math.random() * 3.2, w = 1.2 + Math.random() * 0.6; box(w, h, 1.4, mat(0xffffff, { map: windowTex(4, Math.round(h * 1.5), 0.3, i % 2 ? '#18274b' : '#2c3f6e') }), -6.6 + i * 1.6, 0, -4.6); }
  // table
  box(7.0, 0.14, 3.4, WHITE, 0.4, 1.0, 0.4, null, { r: 0.3 });
  box(5.0, 1.0, 0.5, NAVY, 0.4, 0, 0.4);
  // chairs + people
  const chair = (x, z, ry) => { const g = grp(x, 0, z, ry); box(0.8, 0.12, 0.8, NAVY2, 0, 0.5, 0, g); box(0.8, 0.9, 0.12, NAVY2, 0, 0.55, -0.4, g); cyl(0.05, 0.05, 0.5, DARK, 0, 0, 0, g); return g; };
  chair(-1.6, -1.9, 0); person(-1.6, -1.8, 0, { seated: true, vest: NAVY, shirt: WHITE, helmet: null, arms: 1.25, pants: DARK });
  chair(2.4, -1.9, 0); person(2.4, -1.8, 0, { seated: true, vest: LIME, shirt: WHITE, helmet: null, arms: 1.25, pants: NAVY });
  chair(4.6, 2.6, Math.PI); person(4.6, 2.5, Math.PI, { seated: true, vest: 0x9aa3ba, shirt: WHITE, helmet: null, arms: 1.25, pants: DARK });
  // documents
  const doc = (stamp) => tex(256, 340, (x, w, h) => { x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.fillStyle = '#18274b'; x.fillRect(20, 20, 140, 18); for (let i = 0; i < 10; i++) { x.fillStyle = '#cdd1db'; x.fillRect(20, 60 + i * 22, w - 40 - (i % 4) * 30, 8); } if (stamp) { x.strokeStyle = '#7ea01a'; x.lineWidth = 6; x.beginPath(); x.arc(185, 280, 40, 0, 7); x.stroke(); x.font = 'bold 20px sans-serif'; x.fillStyle = '#7ea01a'; x.fillText('OK', 170, 287); } });
  for (const [x, z, r, s] of [[-1.4, 0.2, 0.2, 1], [-0.7, 0.6, -0.3, 0], [3.0, 0.9, 0.5, 1], [2.0, 0.3, -0.1, 0]]) box(0.75, 0.01, 1.0, mat(0xffffff, { map: doc(s) }), x, 1.15, z, null, { sharp: true }).rotation.y = r;
  box(1.3, 0.12, 0.9, LIME, -2.5, 1.14, 1.4).rotation.y = 0.3;
  // tablet + hologram building
  const tb = box(1.6, 0.06, 1.1, DARK, 0.6, 1.14, 0.6); tb.rotation.y = -0.2;
  box(1.45, 0.01, 0.95, mat(0x9ce0ff, { e: 0x5fb6ff, ei: 0.6 }), 0.6, 1.2, 0.6, null, { sharp: true }).rotation.y = -0.2;
  const holo = mat(LIME, { t: 0.35, e: LIME, ei: 0.5 });
  const hb = grp(0.6, 1.25, 0.6, -0.2);
  box(0.7, 1.5, 0.6, holo, -0.1, 0.05, 0, hb, { sharp: true }); box(0.5, 0.9, 0.5, holo, 0.42, 0.05, 0.1, hb, { sharp: true });
  const wf = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(0.7, 1.5, 0.6)), new THREE.LineBasicMaterial({ color: 0x18274b })); wf.position.set(-0.1, 0.8, 0); hb.add(wf);
  // plant + cups
  cyl(0.3, 0.24, 0.6, WHITE, 6.2, 0, -1.5); sph(0.55, GREEN, 6.2, 1.05, -1.5, null, { seg: 10 });
  cyl(0.12, 0.1, 0.25, WHITE, 3.6, 1.14, 0.1); cyl(0.12, 0.1, 0.25, WHITE, -1.9, 1.14, -0.4);
  lights(V(0, 0, 0), 12, [-6, 12, 7]);
  return camera(5.6, V(0.3, 1.5, -0.2), [1, 0.62, 1.2]);
};

S['seguranca-trabalho'] = () => {
  bg('#f2f4ee', '#d9dfcf');
  base(15, 11, 0xd9d6cb);
  // wall under construction
  const bt = tex(512, 512, (x, w, h) => { x.fillStyle = '#d9d6cc'; x.fillRect(0, 0, w, h); for (let j = 0; j < 16; j++) for (let i = 0; i < 8; i++) { x.fillStyle = `hsl(18,${40 + Math.random() * 10}%,${48 + Math.random() * 8}%)`; x.fillRect(i * 64 + (j % 2) * 32 + 2, j * 32 + 2, 60, 28); } });
  bt.wrapS = bt.wrapT = THREE.RepeatWrapping; bt.repeat.set(2, 1.4);
  box(10, 6.0, 0.4, mat(0xffffff, { map: bt }), -1.0, 0, -3.6, null, { sharp: true });
  // scaffold
  const sc = mat(0xb9bcc2, { m: 0.6, r: 0.35 }); const sg = grp(-1.0, 0, -2.4);
  for (let x = -4; x <= 4.01; x += 2) for (const z of [-0.6, 0.6]) strut(V(x, 0, z), V(x, 6.4, z), 0.05, sc, sg);
  for (let y = 0; y <= 6; y += 2) for (const z of [-0.6, 0.6]) strut(V(-4, y + 0.1, z), V(4, y + 0.1, z), 0.04, sc, sg);
  for (let x = -4; x < 4; x += 2) strut(V(x, 0.1, 0.6), V(x + 2, 2.1, 0.6), 0.03, sc, sg), strut(V(x + 2, 2.1, 0.6), V(x, 4.1, 0.6), 0.03, sc, sg);
  for (const y of [2.1, 4.1]) { box(8, 0.08, 1.2, WOOD, 0, y, 0, sg); box(8, 0.2, 0.04, LIME, 0, y + 0.08, 0.62, sg, { sharp: true }); }
  for (const y of [3.0, 5.0]) strut(V(-4, y, 0.6), V(4, y, 0.6), 0.035, mat(LIME), sg);
  for (const y of [2.6, 4.6]) strut(V(-4, y, 0.6), V(4, y, 0.6), 0.03, mat(LIME), sg);
  // lifeline cable
  strut(V(-4, 6.3, 0.0), V(4, 6.3, 0.0), 0.02, mat(0xffd84a), sg);
  for (const x of [-4, 4]) cyl(0.08, 0.08, 0.3, RED, x, 6.15, 0, sg);
  // worker on scaffold with harness
  const w = person(0.6, 0.2, 0.3, { vest: LIME, helmet: WHITE, arms: 2.2, armL: 0.4, y: 4.18, });
  w.parent.remove(w); sg.add(w); w.position.set(0.6, 4.18, 0.0);
  box(0.54, 0.06, 0.32, NAVY, 0, 1.0, 0, w); box(0.08, 0.62, 0.32, NAVY, -0.15, 0.85, 0, w); box(0.08, 0.62, 0.32, NAVY, 0.15, 0.85, 0, w);
  box(0.12, 0.12, 0.14, mat(0x777, { m: 0.8 }), 0, 1.35, -0.17, w);
  strut(V(0.6, 5.6, -0.17), V(1.2, 6.3, 0.0), 0.02, mat(ORANGE), sg);
  // ground worker inspecting
  const gw = person(3.4, 2.6, -0.8, { vest: NAVY, shirt: LIME, helmet: LIME, arms: 1.0 });
  const cb = box(0.36, 0.48, 0.03, WHITE, 0, 1.0, 0.45, gw); cb.rotation.x = -0.7;
  // signs
  const sign = (draw) => tex(256, 320, draw);
  const sEpi = sign((x, w, h) => { x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.fillStyle = '#1452a8'; x.beginPath(); x.arc(128, 120, 95, 0, 7); x.fill(); x.fillStyle = '#fff'; x.beginPath(); x.arc(128, 135, 55, Math.PI, 0); x.fill(); x.fillRect(58, 132, 140, 14); x.fillStyle = '#1452a8'; x.font = 'bold 44px sans-serif'; x.fillText('USE EPI', 40, 280); });
  const sAtt = sign((x, w, h) => { x.fillStyle = '#ffd84a'; x.fillRect(0, 0, w, h); x.fillStyle = '#18274b'; x.beginPath(); x.moveTo(128, 30); x.lineTo(230, 210); x.lineTo(26, 210); x.closePath(); x.lineWidth = 16; x.strokeStyle = '#18274b'; x.stroke(); x.font = 'bold 120px sans-serif'; x.fillText('!', 108, 195); x.font = 'bold 38px sans-serif'; x.fillText('NR-35', 70, 285); });
  for (const [t, x] of [[sEpi, 4.6], [sAtt, 5.6]]) { cyl(0.04, 0.04, 1.4, DARK, x, 0, 0.6); box(0.8, 1.0, 0.04, mat(0xffffff, { map: t }), x, 1.2, 0.6, null, { sharp: true }); }
  // first aid + extinguisher + cones + guardrail
  const fa = tex(256, 256, (x, w, h) => { x.fillStyle = '#fff'; x.fillRect(0, 0, w, h); x.fillStyle = '#13a051'; x.fillRect(98, 40, 60, 176); x.fillRect(40, 98, 176, 60); });
  box(0.9, 0.7, 0.4, mat(0xffffff, { map: fa }), -5.2, 0, 1.6);
  cyl(0.18, 0.18, 0.75, RED, -4.4, 0, 1.8, null, { m: 0.2, r: 0.3 });
  for (const x of [-6.2, -2.0, 1.8, 6.4]) cone(x, 4.2);
  for (let x = -6.6; x <= 6.6; x += 2.2) cyl(0.05, 0.05, 1.0, 0xffd84a, x, 0, 4.8);
  strut(V(-6.6, 0.95, 4.8), V(6.6, 0.95, 4.8), 0.04, mat(0xffd84a)); strut(V(-6.6, 0.5, 4.8), V(6.6, 0.5, 4.8), 0.04, mat(0xffd84a));
  box(1.2, 0.5, 0.8, NAVY, 2.0, 0, 1.4); box(1.2, 0.5, 0.8, LIME, 2.0, 0.5, 1.4);
  lights(V(0, 0, 0), 12, [-6, 12, 7]);
  return camera(6.0, V(0.0, 2.6, 0), [1, 0.62, 1.2]);
};

const cam = S[NAME]();
renderer.render(scene, cam);
window.__done = true;
