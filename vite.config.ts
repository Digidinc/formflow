import { defineConfig, type Plugin } from 'vite';
import { SITE_ORIGIN } from './src/config/site';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeMdxImportMedia from 'rehype-mdx-import-media';
import { toString as mdastToString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';

import type { Literal, Property } from 'estree-jsx';
import type { Root } from 'mdast';
import type { MdxjsEsm } from 'mdast-util-mdxjs-esm';
import type { VFile } from 'vfile';

// Build-only loaders, with a runtime guard so local previews and forks do not
// contribute visits to the production GA4 or Clarity properties.
function productionAnalyticsPlugin(): Plugin {
  return {
    name: 'formflow-production-analytics',
    apply: 'build',
    transformIndexHtml() {
      return [{
        tag: 'script',
        attrs: { 'data-formflow-analytics': '' },
        injectTo: 'head',
        children: `
(function () {
  if (window.location.origin !== ${JSON.stringify(SITE_ORIGIN)}) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', 'G-RM7RBNGC08');
  var googleTag = document.createElement('script');
  googleTag.async = true;
  googleTag.src = 'https://www.googletagmanager.com/gtag/js?id=G-RM7RBNGC08';
  document.head.appendChild(googleTag);

  window.clarity = window.clarity || function () {
    (window.clarity.q = window.clarity.q || []).push(arguments);
  };
  var clarityTag = document.createElement('script');
  clarityTag.async = true;
  clarityTag.src = 'https://www.clarity.ms/tag/y957taa31z';
  document.head.appendChild(clarityTag);
})();`,
      }];
    },
  };
}

// Computes reading time from the MDX body and exposes it as a named ESM export
// (`readingTime`) on the compiled module — reliable, unlike reading a `.mdx?raw`
// import (which the MDX plugin intercepts).
function remarkReadingTime() {
  return (tree: Root, file: VFile) => {
    const stats = getReadingTime(mdastToString(tree));
    const data = {
      text: stats.text,
      minutes: Math.max(1, Math.round(stats.minutes)),
      words: stats.words,
    };
    file.data.readingTime = data;
    const readingTimeExport: MdxjsEsm = {
      type: 'mdxjsEsm',
      value: `export const readingTime = ${JSON.stringify(data)}`,
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ExportNamedDeclaration',
              specifiers: [],
              attributes: [],
              source: null,
              declaration: {
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: [
                  {
                    type: 'VariableDeclarator',
                    id: { type: 'Identifier', name: 'readingTime' },
                    init: {
                      type: 'ObjectExpression',
                      properties: [
                        prop('text', { type: 'Literal', value: data.text }),
                        prop('minutes', { type: 'Literal', value: data.minutes }),
                        prop('words', { type: 'Literal', value: data.words }),
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    };
    tree.children.unshift(readingTimeExport);
  };
}

function prop(name: string, value: Literal): Property {
  return {
    type: 'Property',
    method: false,
    shorthand: false,
    computed: false,
    kind: 'init',
    key: { type: 'Identifier', name },
    value,
  };
}

// `base` must be an ABSOLUTE path so deep routes like /blog/tutorials/<slug>/
// resolve assets and the react-router basename correctly. The production site
// lives at the root of formflow.digid.ca; forks deployed under a GitHub Pages
// project path can override this with PAGES_BASE_PATH=/repo-name/.
export default defineConfig(({ mode }) => ({
  base: process.env.PAGES_BASE_PATH || '/',
  plugins: [
    mode === 'production' && productionAnalyticsPlugin(),
    // MDX must run BEFORE @vitejs/plugin-react so the React plugin sees JSX.
    {
      enforce: 'pre' as const,
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
          remarkGfm,
          remarkReadingTime,
        ],
        rehypePlugins: [
          // Resolve relative ![](./img) paths to fingerprinted asset imports.
          rehypeMdxImportMedia,
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            { behavior: 'wrap', properties: { className: ['heading-anchor'] } },
          ],
          // Syntax highlighting baked in at build time (zero runtime cost).
          // keepBackground:false lets blog.css own the code-block surface.
          [rehypePrettyCode, { theme: 'github-light', keepBackground: false }],
        ],
        providerImportSource: '@mdx-js/react',
      }),
    },
    react({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
}));
