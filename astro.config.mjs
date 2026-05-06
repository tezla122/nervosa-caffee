import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://nervosa.cafe',
  i18n: {
    defaultLocale: 'ro',
    locales: ['ro', 'en'],
  },
});