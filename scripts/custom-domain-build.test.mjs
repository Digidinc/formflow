import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;

const read = (path) => readFileSync(join(root, path), 'utf8');

const index = read('dist/index.html');
const sitemap = read('dist/sitemap.xml');
const robots = read('dist/robots.txt');
const llms = read('dist/llms.txt');
const deployWorkflow = read('.github/workflows/deploy.yml');

const failures = [];

if (/\/(?:formflow)\/assets\//.test(index)) {
  failures.push('dist/index.html still points assets at the old /formflow/ project path');
}

if (!index.includes('src="/assets/') || !index.includes('href="/assets/')) {
  failures.push('dist/index.html does not use root-relative /assets/ URLs');
}

for (const [name, contents] of [
  ['dist/index.html', index],
  ['dist/sitemap.xml', sitemap],
  ['dist/robots.txt', robots],
  ['dist/llms.txt', llms],
]) {
  if (contents.includes('digidinc.github.io/formflow')) {
    failures.push(`${name} still contains the old GitHub Pages canonical URL`);
  }
}

if (!index.includes('https://formflow.digid.ca/')) {
  failures.push('dist/index.html does not contain the custom-domain canonical URL');
}

if (!sitemap.includes('<loc>https://formflow.digid.ca/</loc>')) {
  failures.push('dist/sitemap.xml does not start from the custom domain');
}

if (!robots.includes('Sitemap: https://formflow.digid.ca/sitemap.xml')) {
  failures.push('dist/robots.txt does not advertise the custom-domain sitemap');
}

if (!index.includes('https://www.clarity.ms/tag/') || !index.includes('y957taa31z')) {
  failures.push('dist/index.html does not include the Microsoft Clarity tracking tag');
}

if (deployWorkflow.includes('GITHUB_PAGES_BASE')) {
  failures.push('deploy workflow uses the reserved GITHUB_ prefix for a repository variable');
}

if (!deployWorkflow.includes('PAGES_BASE_PATH: ${{ vars.PAGES_BASE_PATH }}')) {
  failures.push('deploy workflow does not pass the supported PAGES_BASE_PATH variable');
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log('Custom-domain build contract passed.');
