const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
let browser, server, base;
before(async () => {
  server = http.createServer((req, res) => {
    const root = path.resolve(__dirname, '..');
    const pathname = new URL(req.url, 'http://localhost').pathname;
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) {
      res.writeHead(404); res.end(); return;
    }
    const mime = { '.css': 'text/css', '.js': 'text/javascript', '.html': 'text/html' };
    res.setHeader('Content-Type', (mime[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8');
    res.end(fs.readFileSync(file));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = process.env.DEMO_URL || `http://127.0.0.1:${server.address().port}/`;
  browser = await chromium.launch({ channel: 'chrome', headless: true });
});
after(async () => { await browser?.close(); server?.close(); });
test('La foto completa y el contenido caben en teléfono, tableta y escritorio', async () => {
  const page = await browser.newPage();
  try {
    for (const width of [320, 360, 390, 430, 680, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(base);
      await page.locator('.product').first().waitFor();
      await page.evaluate(async () => {
        await document.querySelector('.hero-image img').decode();
        await document.fonts.ready;
      });
      const result = await page.evaluate(() => {
        const image = document.querySelector('.hero-image img');
        const box = image.getBoundingClientRect();
        const holder = image.parentElement.getBoundingClientRect();
        const style = getComputedStyle(image);
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          complete: image.complete && image.naturalWidth > 0,
          whole: style.objectFit === 'contain' || Math.abs(box.width / box.height - image.naturalWidth / image.naturalHeight) < .01,
          inside: box.top >= holder.top && box.bottom <= holder.bottom + 1,
        };
      });
      assert.equal(result.overflow, false, `Desbordamiento a ${width}px`);
      assert.ok(result.complete && result.whole && result.inside, `Foto recortada a ${width}px`);
    }
  } finally { await page.close(); }
});
test('Cada producto y novedad consulta su artículo con referencia y enlace directo', async () => {
  const page = await browser.newPage();
  try {
    await page.goto(base);
    const cards = await page.locator('.product').evaluateAll(items => items.map(el => ({
      id: el.id, name: el.querySelector('h3').textContent,
      brand: el.querySelector('.prodbrand').textContent,
      href: el.querySelector('.prodcta').href,
    })));
    assert.equal(cards.length, 15);
    const messages = new Set();
    for (const card of cards) {
      const url = new URL(card.href), text = url.searchParams.get('text') || '';
      assert.equal(url.hostname, 'wa.me');
      assert.equal(url.pathname, '/529995526909');
      assert.ok(text.includes(card.name) && text.includes(card.brand));
      assert.match(text, /landing/i);
      assert.match(text, /Referencia: JMM-\d{3}/);
      assert.ok(card.id && text.includes('#' + card.id), `Falta enlace al artículo: ${card.name}`);
      messages.add(text);
    }
    assert.equal(messages.size, 15);
    for (const href of await page.locator('.arrival').evaluateAll(items => items.map(el => el.href))) {
      assert.match(new URL(href).searchParams.get('text'), /Referencia: JMM-\d{3}/);
    }
    await page.goto(base + '#articulo-JMM-010');
    await page.locator('#articulo-JMM-010').waitFor();
    await page.getByRole('button', { name: 'Bolsas', exact: true }).click();
    assert.equal(await page.locator('.product').count(), 5);
    await page.evaluate(() => { location.hash = 'articulo-JMM-010'; window.dispatchEvent(new HashChangeEvent('hashchange')); });
    await page.locator('#articulo-JMM-010').waitFor();
    assert.equal(await page.locator('#articulo-JMM-010 h3').textContent(), 'Lentes negros');
  } finally { await page.close(); }
});
test('Redes tienen enlaces, iconos y WhatsApp permanece visible al desplazarse', async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  try {
    await page.goto(base);
    for (const name of ['Facebook', 'Instagram']) {
      const link = page.locator('.small-social').getByRole('link', { name });
      assert.ok((await link.getAttribute('href')).startsWith('https://www.' + name.toLowerCase() + '.com/'));
      assert.equal(await link.locator('svg').count(), 1);
    }
    const wa = page.locator('.floating-wa');
    assert.equal(await wa.locator('svg').count(), 1);
    assert.match(new URL(await wa.getAttribute('href')).searchParams.get('text'), /landing/i);
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    const box = await wa.boundingBox();
    assert.ok(box.x >= 0 && box.y >= 0 && box.x + box.width <= 390 && box.y + box.height <= 844);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await wa.evaluate(el => getComputedStyle(el).animationName), 'none');
  } finally { await page.close(); }
});
test('Todas las fotos cargan y el menú, filtros y búsqueda funcionan en móvil', async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  try {
    await page.goto(base);
    const photos = await page.evaluate(async () => {
      document.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
      return Promise.all([...document.images].map(async img => {
        try { await img.decode(); return img.naturalWidth > 0; } catch { return false; }
      }));
    });
    assert.ok(photos.length >= 30 && photos.every(Boolean), 'Alguna foto no cargó');
    await page.getByRole('button', { name: 'Abrir menú', exact: true }).click();
    await page.locator('#navigation').getByRole('link', { name: 'Catálogo', exact: true }).click();
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
    await page.getByRole('button', { name: 'Lentes', exact: true }).click();
    assert.equal(await page.locator('.product').count(), 1);
    assert.equal(await page.locator('.product h3').textContent(), 'Lentes negros');
    await page.getByRole('button', { name: 'Todos', exact: true }).click();
    await page.getByRole('textbox', { name: 'Buscar producto' }).fill('Miu Miu');
    assert.equal(await page.locator('.product h3').textContent(), 'Top negro');
    await page.getByRole('textbox', { name: 'Buscar producto' }).fill('sin coincidencias');
    assert.equal(await page.locator('#products').textContent(), 'No se encontraron productos en esta categoría.');
    assert.deepEqual(errors, []);
  } finally { await page.close(); }
});
