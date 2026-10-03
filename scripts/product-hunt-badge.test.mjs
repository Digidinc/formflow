import { readFileSync } from 'node:fs';

const homepage = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

const requiredMarkup = [
  'class="product-hunt-badge"',
  'href="https://www.producthunt.com/products/formflow-6?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-formflow-6"',
  'src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1268034&amp;theme=light&amp;t=1791050442910"',
  'alt="FormFlow - Visual form builder for Strapi | Product Hunt"',
  'target="_blank"',
  'rel="noopener noreferrer"',
  'width="250"',
  'height="54"',
];

const missing = requiredMarkup.filter((fragment) => !homepage.includes(fragment));

if (missing.length > 0) {
  console.error(`Product Hunt badge markup missing from dist/index.html:\n${missing.join('\n')}`);
  process.exit(1);
}

if (!styles.includes('width: 170px;')) {
  console.error('Product Hunt badge mobile width must remain compact at 170px.');
  process.exit(1);
}

console.log('Product Hunt badge build contract passed.');
