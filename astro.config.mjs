import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  output: 'static',
  site: process.env.PUBLIC_SITE_URL || 'https://example.com',
  build: {
    format: 'directory'
  },
  devToolbar: {
    enabled: false
  }
});
