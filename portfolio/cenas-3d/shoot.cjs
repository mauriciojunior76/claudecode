const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname;
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': f.endsWith('.js') ? 'text/javascript' : 'text/html' }); r.end(d); }); }).listen(8765);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const names = process.argv.slice(2);
  for (const n of names) {
    const [w, h] = n === 'ambiente-3d' ? [1600, 900] : [1600, 1200];
    const p = await b.newPage({ viewport: { width: w, height: h } });
    p.on('console', m => console.log(n, m.type(), m.text()));
    p.on('pageerror', e => console.log(n, 'ERR', e.message));
    await p.goto(`http://localhost:8765/render.html?s=${n}&w=${w}&h=${h}`);
    await p.waitForFunction('window.__done === true', null, { timeout: 180000 }).catch(e => console.log(n, 'timeout'));
    const data = await p.evaluate(() => document.querySelector('canvas').toDataURL('image/png'));
    fs.writeFileSync(path.join(root, 'out', n + '.png'), Buffer.from(data.split(',')[1], 'base64'));
    console.log('ok', n); await p.close();
  }
  await b.close(); srv.close();
})();
