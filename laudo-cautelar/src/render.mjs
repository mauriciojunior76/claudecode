// Gera os PNGs dos carrosséis (1080x1350) e as camadas das cenas do Reels (1080x1920).
// Uso: node src/render.mjs [conteudo.mjs]   (a partir da pasta laudo-cautelar/; padrão: content.mjs)
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { carrosseis, cenas, WHATSAPP, CONTATO, HANDLE } = await import(`./${process.argv[2] || 'content.mjs'}`);
const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); } catch { playwright = require('/opt/node22/lib/node_modules/playwright'); }

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const img = (f) => `data:image/jpeg;base64,${fs.readFileSync(path.join(ROOT, 'assets', f)).toString('base64')}`;
const hl = (s) => s.replace(/\[\[(.+?)\]\]/g, '<span class="hl">$1</span>');
const fill = (s) => s.replaceAll('__WHATS__', WHATSAPP).replaceAll('__CONTATO__', CONTATO).replaceAll('__HANDLE__', HANDLE);

const ICONES = {
  predio: '<path d="M4 21V5l8-3v19M12 21V9l8 3v9M2 21h20M7 8h2M7 12h2M7 16h2M15 14h2M15 17h2"/>',
  martelo: '<path d="M14 4l6 6-3 3-6-6zM11 7L3 15l3 3 8-8M2 22h9"/>',
  demolicao: '<path d="M3 21h18M5 21V11h6v10M15 21v-6h4v6M13 3l2 4M18 4l-1 4M21 8l-3 1"/>',
  estaca: '<path d="M12 2v14M9 13l3 7 3-7M4 22h16M7 5h10M7 9h10"/>',
  documento: '<path d="M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h5"/><circle cx="17" cy="18" r="0"/>',
  whats: '<path d="M3 21l1.6-4.7A9 9 0 1 1 8 19.6z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.8-2.2-1-1 1a5 5 0 0 1-2.5-2.5l1-1-1-2.2z"/>',
};
const icone = (n, size = 56, cor = 'currentColor') =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${cor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONES[n]}</svg>`;

const BASE_CSS = `
${[400, 500, 600, 700, 800, 900].map((w) => `@font-face{font-family:'Inter';font-weight:${w};font-style:normal;src:url(data:font/woff2;base64,${fs.readFileSync(path.join(ROOT, 'assets', 'fonts', `inter-${w}.woff2`)).toString('base64')}) format('woff2')}`).join('')}
:root{--navy:#2C3E7F;--navy-d:#1E2A52;--ink:#161616;--body:#3B3B3B;--muted:#8A8F9C;--line:#E6E7EB;--yellow:#F2C94C;--paper:#FFFFFF;--soft:#F4F5F8}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
body{background:var(--paper);color:var(--ink)}
`;

const SLIDE_CSS = `
.s{width:1080px;height:1350px;position:relative;overflow:hidden;background:var(--paper);display:flex;flex-direction:column}
.top{height:132px;flex:none;border-bottom:2px solid var(--line);display:flex;align-items:center;justify-content:space-between;padding:0 72px}
.tag{font-size:22px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--navy)}
.cnt{font-size:22px;font-weight:600;color:var(--muted);letter-spacing:.06em}
.main{flex:1;padding:64px 72px 0;display:flex;flex-direction:column;min-height:0}
h1{font-size:66px;line-height:1.08;font-weight:800;text-transform:uppercase;letter-spacing:-.01em;color:var(--ink)}
.hl{color:var(--navy)}
.txt{font-size:37px;line-height:1.5;color:var(--body);margin-top:34px;font-weight:400}
.foto{flex:1;min-height:0;margin-top:44px;border-radius:26px;background-size:cover;background-position:center}
.foot{height:128px;flex:none;display:flex;align-items:center;justify-content:center;position:relative}
.handle{font-size:30px;font-weight:800;color:var(--navy-d)}
.swipe{position:absolute;right:72px;font-size:24px;font-weight:600;color:var(--muted);display:flex;align-items:center;gap:10px}
.swipe i{font-style:normal;font-size:34px;line-height:1}
/* capa */
.capa{background:rgb(10,14,30);justify-content:flex-end}
.capa .bg{position:absolute;inset:0 0 34% 0;background-size:cover;background-position:center;transform:scale(1.02)}
.capa .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,14,30,0) 0%,rgba(10,14,30,.1) 30%,rgba(10,14,30,.9) 64%,rgba(10,14,30,.97) 100%)}
.capa .in{position:relative;padding:0 72px 64px}
.capa .kick{display:inline-block;background:var(--yellow);color:var(--ink);font-size:24px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;padding:14px 22px;border-radius:10px}
.capa h1{color:#fff;font-size:88px;line-height:1.02;margin-top:34px;font-weight:900}
.capa .hl{color:var(--yellow)}
.capa .sub{color:#E3E6EE;font-size:36px;line-height:1.4;margin-top:30px;font-weight:500}
.capa .bar{display:flex;justify-content:space-between;align-items:center;margin-top:52px;padding-top:30px;border-top:2px solid rgba(255,255,255,.18)}
.capa .handle{color:#fff}
.capa .swipe{position:static;color:#C9CEDB}
/* lista */
.grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:44px}
.item{background:var(--soft);border-radius:22px;padding:40px 28px;display:flex;gap:20px;align-items:center;font-size:31px;font-weight:600;line-height:1.25;color:var(--ink)}
.ck{flex:none;width:52px;height:52px;border-radius:50%;background:var(--navy);color:#fff;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800}
/* cards */
.card{background:var(--soft);border-radius:24px;padding:34px 30px;display:flex;flex-direction:column;gap:16px;color:var(--navy)}
.card b{font-size:36px;font-weight:800;color:var(--ink);text-transform:uppercase;letter-spacing:-.01em}
.card span{font-size:27px;line-height:1.35;color:var(--body)}
/* erro */
.errhead{display:flex;align-items:center;gap:22px;margin-bottom:30px}
.errnum{font-size:30px;font-weight:900;color:#fff;background:#C8372D;border-radius:12px;padding:10px 20px;letter-spacing:.08em}
.errx{width:56px;height:56px;border-radius:50%;border:4px solid #C8372D;color:#C8372D;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900}
/* passo */
.steps{display:flex;gap:12px;margin-bottom:34px}
.steps i{flex:1;height:10px;border-radius:6px;background:var(--line)}
.steps i.on{background:var(--navy)}
.stepnum{font-size:26px;font-weight:800;color:var(--navy);letter-spacing:.14em;text-transform:uppercase;margin-bottom:18px}
.bigicon{flex:1;min-height:0;margin-top:44px;border-radius:26px;background:var(--soft);display:flex;align-items:center;justify-content:center;position:relative;color:var(--navy)}
.bigicon .n{position:absolute;right:40px;bottom:-40px;font-size:360px;font-weight:900;color:rgba(44,62,127,.07);line-height:1}
/* cta */
.cta{background:var(--navy-d)}
.cta .top{border-bottom-color:rgba(255,255,255,.12)}
.cta .tag{color:var(--yellow)}
.cta .cnt{color:#AEB6CE}
.cta .main{justify-content:center;padding-top:0}
.cta h1{color:#fff;font-size:84px;font-weight:900;line-height:1.04}
.cta .hl{color:var(--yellow)}
.cta .txt{color:#D5DAE8}
.pill{margin-top:64px;background:var(--yellow);color:var(--ink);border-radius:999px;padding:30px 40px;display:flex;align-items:center;gap:22px;font-size:36px;font-weight:800;align-self:flex-start}
.pill small{display:block;font-size:24px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;opacity:.75;margin-bottom:4px}
.cta .handle{color:#fff}
`;

function slideHTML(s, i, total) {
  const cnt = `${String(i + 1).padStart(2, '0')}/${String(total).padStart(2, '0')}`;
  const last = i === total - 1;
  const top = (tag = 'Laudo cautelar de vizinhança') => `<div class="top"><span class="tag">${tag}</span><span class="cnt">${cnt}</span></div>`;
  const foot = `<div class="foot"><span class="handle">${HANDLE}</span>${last ? '' : '<span class="swipe">arraste <i>→</i></span>'}</div>`;

  if (s.tipo === 'capa') {
    return `<div class="s capa"><div class="bg" style="background-image:url(${img(s.foto)})"></div><div class="shade"></div>
      <div class="in"><span class="kick">${s.kicker}</span><h1>${hl(s.titulo)}</h1><p class="sub">${s.sub}</p>
      <div class="bar"><span class="handle">${HANDLE}</span><span class="swipe">arraste <i>→</i></span></div></div></div>`;
  }
  if (s.tipo === 'texto') {
    return `<div class="s">${top()}<div class="main"><h1>${hl(s.titulo)}</h1><p class="txt">${s.texto}</p>
      <div class="foto" style="background-image:url(${img(s.foto)})"></div></div>${foot}</div>`;
  }
  if (s.tipo === 'lista') {
    const itens = s.itens.map((t) => `<div class="item"><span class="ck">✓</span>${t}</div>`).join('');
    return `<div class="s">${top()}<div class="main"><h1>${hl(s.titulo)}</h1><p class="txt">${s.texto}</p><div class="grid">${itens}</div></div>${foot}</div>`;
  }
  if (s.tipo === 'cards') {
    const cards = s.cards.map((c) => `<div class="card">${icone(c.icone, 54)}<b>${c.t}</b><span>${c.d}</span></div>`).join('');
    return `<div class="s">${top()}<div class="main"><h1>${hl(s.titulo)}</h1><p class="txt">${s.texto}</p><div class="grid">${cards}</div></div>${foot}</div>`;
  }
  if (s.tipo === 'erro') {
    return `<div class="s">${top()}<div class="main"><div class="errhead"><span class="errx">✕</span><span class="errnum">ERRO ${s.numero}</span></div>
      <h1>${hl(s.titulo)}</h1><p class="txt">${s.texto}</p><div class="foto" style="background-image:url(${img(s.foto)})"></div></div>${foot}</div>`;
  }
  if (s.tipo === 'passo') {
    const steps = Array.from({ length: s.total }, (_, k) => `<i class="${k < s.numero ? 'on' : ''}"></i>`).join('');
    const visual = s.foto
      ? `<div class="foto" style="background-image:url(${img(s.foto)})"></div>`
      : `<div class="bigicon">${icone(s.icone, 260)}<span class="n">${s.numero}</span></div>`;
    return `<div class="s">${top()}<div class="main"><div class="steps">${steps}</div><p class="stepnum">Passo ${s.numero} de ${s.total}</p>
      <h1>${hl(s.titulo)}</h1><p class="txt">${s.texto}</p>${visual}</div>${foot}</div>`;
  }
  if (s.tipo === 'cta') {
    return `<div class="s cta">${top('FastPrev · Engenharia')}<div class="main"><h1>${hl(s.titulo)}</h1><p class="txt">${s.texto}</p>
      <div class="pill">${icone('whats', 60, '#161616')}<div><small>Falar com a gente</small>${WHATSAPP} · ${CONTATO}</div></div></div>${foot}</div>`;
  }
  throw new Error(`tipo desconhecido: ${s.tipo}`);
}

const VIDEO_CSS = `
.v{width:1080px;height:1920px;position:relative;overflow:hidden}
.v.preto{background:#0B0B0D}
.v.claro{background:#F5F6F9}
.v.cta{background:radial-gradient(120% 80% at 50% 30%,#2C3E7F 0%,#1E2A52 55%,#121A36 100%)}
.v.foto{background:#0B0B0D}
.v .blur{position:absolute;inset:-60px;background-size:cover;background-position:center;filter:blur(40px) brightness(.45) saturate(1.1)}
.v .ph{position:absolute;left:64px;right:64px;top:820px;height:640px;border-radius:32px;background-size:cover;background-position:center;box-shadow:0 30px 80px rgba(0,0,0,.5)}
.v .brand{position:absolute;top:120px;left:0;right:0;text-align:center;font-size:30px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.55)}
.v.claro .brand{color:var(--muted)}
.t{width:1080px;height:1920px;position:relative;background:transparent}
.t > *{position:absolute;left:84px;right:84px}
.v-hook{top:640px;font-size:92px;line-height:1.12;font-weight:800;color:#fff;letter-spacing:-.015em}
.v-hook b{color:var(--yellow)}
.v-hook.v-low{top:1030px;color:#fff}
.v-big{top:300px;font-size:88px;line-height:1.08;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:-.01em}
.v-kicker{top:230px;font-size:34px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--yellow)}
.v-kicker + .v-big{top:300px}
.v-big.sm{font-size:70px;top:280px}
mark{background:none;color:var(--yellow)}
mark.y{background:var(--yellow);color:var(--ink);padding:0 14px;border-radius:10px}
.v-sub{top:1510px;font-size:48px;line-height:1.3;font-weight:500;color:#fff}
.v-sub b{color:var(--yellow);font-weight:800}
.v-mid{top:420px;font-size:74px;line-height:1.15;font-weight:800;letter-spacing:-.01em}
.v-mid.dark{color:var(--ink)}
.blue{color:var(--navy)}
.v-stamp{top:1180px;left:auto;right:84px;font-size:120px;font-weight:900;text-transform:uppercase;color:#fff;background:#C8372D;padding:18px 44px;border-radius:18px;transform:rotate(-4deg)}
.v-check{top:760px;display:flex;align-items:center;gap:34px;font-size:62px;font-weight:800;color:var(--ink);background:#fff;border-radius:28px;padding:40px 44px;box-shadow:0 14px 40px rgba(20,30,60,.08)}
.v-check.c2{top:1000px}.v-check.c3{top:1240px}
.v-check span{flex:none;width:88px;height:88px;border-radius:50%;background:var(--navy);color:#fff;display:flex;align-items:center;justify-content:center;font-size:50px}
.v-final{top:760px;font-size:118px;line-height:1.05;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:-.02em}
.v-final b{display:block;color:#fff;background:#C8372D;padding:6px 30px;margin-top:24px;border-radius:14px;width:max-content}
.v-pill{top:1080px;background:var(--yellow);color:var(--ink);font-size:38px;white-space:nowrap;left:60px;right:60px;font-weight:800;text-align:center;border-radius:999px;padding:38px 30px}
.v-handle{top:1250px;text-align:center;font-size:44px;font-weight:800;color:#fff}
`;

function cenaFundo(c) {
  const brand = `<div class="brand">Laudo cautelar de vizinhança</div>`;
  if (c.fundo === 'foto') {
    return `<div class="v foto"><div class="blur" style="background-image:url(${img(c.foto)})"></div>${brand}<div class="ph" style="background-image:url(${img(c.foto)})"></div></div>`;
  }
  return `<div class="v ${c.fundo}">${c.fundo === 'preto' ? '' : brand}</div>`;
}

const doc = (css, body, transparent = false) =>
  `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}${css}${transparent ? 'html,body{background:transparent!important}' : ''}</style></head><body>${body}</body></html>`;

async function shot(page, html, out, w, h, transparent = false) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([400,500,600,700,800,900].map((w) => document.fonts.load(`${w} 40px Inter`))); });
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out, omitBackground: transparent, clip: { x: 0, y: 0, width: w, height: h } });
}

const browser = await playwright.chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage({ deviceScaleFactor: 1 });

for (const c of carrosseis) {
  for (const [i, s] of c.slides.entries()) {
    const out = path.join(ROOT, c.pasta, `${String(i + 1).padStart(2, '0')}.png`);
    await shot(page, doc(SLIDE_CSS, slideHTML(s, i, c.slides.length)), out, 1080, 1350);
    console.log('ok', path.relative(ROOT, out));
  }
}

const cenasDir = path.join(ROOT, 'build', 'cenas');
fs.rmSync(cenasDir, { recursive: true, force: true });
const manifest = [];
for (const [i, c] of cenas.entries()) {
  const id = String(i + 1).padStart(2, '0');
  const fundo = path.join(cenasDir, `${id}_fundo.png`);
  await shot(page, doc(VIDEO_CSS, cenaFundo(c)), fundo, 1080, 1920);
  const camadas = [];
  for (const [k, l] of c.camadas.entries()) {
    const out = path.join(cenasDir, `${id}_camada${k + 1}.png`);
    await shot(page, doc(VIDEO_CSS, `<div class="t">${fill(l.html)}</div>`, true), out, 1080, 1920, true);
    camadas.push({ png: out, em: l.em });
  }
  manifest.push({ dur: c.dur, fundo, camadas });
  console.log('ok cena', id);
}
fs.writeFileSync(path.join(ROOT, 'build', 'cenas.json'), JSON.stringify(manifest, null, 2));
await browser.close();
