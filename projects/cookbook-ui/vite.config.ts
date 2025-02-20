import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { vitePluginForArco } from '@arco-plugins/vite-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8999,
  },
  build: {
    outDir: '../../packages/cookbook/src/website/',
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ArcoResolver()],
    }),
    Components({
      resolvers: [
          ArcoResolver({
            sideEffect
              : true
          })
        ]
    }),
    vitePluginForArco({
      style: 'css',
    })
  ],
})
