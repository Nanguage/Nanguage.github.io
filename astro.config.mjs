// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build
export default defineConfig({
  site: 'https://nanguage.github.io',
  integrations: [sitemap()],
  // Images live in public/ and are referenced directly, so skip the
  // sharp-based optimizer entirely.
  image: { service: { entrypoint: 'astro/assets/services/noop' } },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
