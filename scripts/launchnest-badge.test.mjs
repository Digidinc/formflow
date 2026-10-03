import { readFileSync } from 'node:fs';

const homepage = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');

const requiredMarkup = [
  'href="https://launchnest.io/p/formflow"',
  'src="https://launchnest.io/badge/formflow.svg?variant=listed"',
  'alt="FormFlow on LaunchNest"',
  'target="_blank"',
  'width="220"',
  'height="56"',
];

const missing = requiredMarkup.filter((fragment) => !homepage.includes(fragment));

if (missing.length > 0) {
  console.error(`LaunchNest badge markup missing from dist/index.html:\n${missing.join('\n')}`);
  process.exit(1);
}

console.log('LaunchNest badge build contract passed.');
