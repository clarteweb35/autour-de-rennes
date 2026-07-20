// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://clarteweb35.github.io',
  base: '/autour-de-rennes',
  integrations: [sitemap()]
});