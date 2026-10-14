import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import vm from 'node:vm';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('..', import.meta.url));
const source = readFileSync(join(root, 'index.html'), 'utf8');
for (const mode of ['development', 'production']) {
  const server = await createServer({ root, mode, server: { middlewareMode: true }, appType: 'custom' });
  try {
    const devHtml = await server.transformIndexHtml('/', source);
    assert.doesNotMatch(devHtml, /googletagmanager\.com\/gtag|clarity\.ms\/tag|G-RM7RBNGC08|y957taa31z/, `development server (${mode} mode) must not load or initialize either analytics provider`);
  } finally {
    await server.close();
  }
}

function* htmlFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}
let checked = 0;
for (const path of htmlFiles(join(root, 'dist'))) {
  const html = readFileSync(path, 'utf8');
  const scripts = [...html.matchAll(/<script\b[^>]*\bdata-formflow-analytics[^>]*>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1, `${path} must have exactly one production analytics bootstrap`);
  assert.doesNotMatch(html, /<script\b[^>]*\bsrc=["']https:\/\/(?:www\.googletagmanager\.com|www\.clarity\.ms)/, 'provider scripts must not load before the origin guard');

  for (const origin of ['http://localhost:4173', 'http://127.0.0.1:5173', 'http://[::1]:4173', 'https://preview.example.com', 'http://formflow.digid.ca', 'https://formflow.digid.ca']) {
    const loaded = [];
    const window = { location: { origin } };
    const document = { createElement: () => ({}), head: { appendChild: (script) => loaded.push(script) } };
    vm.runInNewContext(scripts[0][1], { window, document });
    if (origin === 'https://formflow.digid.ca') {
      assert.deepEqual(loaded.map((s) => s.src).sort(), ['https://www.clarity.ms/tag/y957taa31z', 'https://www.googletagmanager.com/gtag/js?id=G-RM7RBNGC08'].sort());
      assert.ok(loaded.every((s) => s.async === true));
      assert.equal(window.dataLayer.length, 2);
      assert.equal(window.dataLayer[1][0], 'config');
      assert.equal(window.dataLayer[1][1], 'G-RM7RBNGC08');
      assert.equal(typeof window.clarity, 'function');
    } else {
      assert.equal(loaded.length, 0, `${origin} must not load analytics`);
      assert.equal(window.dataLayer, undefined);
      assert.equal(window.gtag, undefined);
      assert.equal(window.clarity, undefined);
    }
  }
  checked++;
}
assert.ok(checked > 1, 'verify analytics on prerendered routes, not only the homepage');
console.log(`Production analytics contract passed: development excluded, all ${checked} built HTML pages restricted to the production origin.`);
