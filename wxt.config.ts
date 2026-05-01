import { version } from './package.json';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte'],
  vite: () => ({
    define: {
      __APP_VERSION__: JSON.stringify(version),
    },
  }),
  manifest: {
    name: 'eMAG Promoted Remover',
    description:
      'Removes promoted/sponsored product cards from emag.ro, emag.bg, and emag.hu',
    permissions: ['storage'],
    icons: {
      16: '/icon/16.png',
      32: '/icon/32.png',
      48: '/icon/48.png',
      96: '/icon/96.png',
      128: '/icon/128.png',
    },
  },
});
