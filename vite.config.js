import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
import legacy from '@vitejs/plugin-legacy'

const repo = "myNowPlaying";
const INVALID_CHAR_REGEX = /[\x00-\x1F\x7F<>*#"{}|^[\]`;?:&=+$,]/g;
const DRIVE_LETTER_REGEX = /^[a-z]:/i;

// https://vite.dev/config/
export default defineConfig({
  // base: process.env.NODE_ENV === 'production' ? `/${repo}/` : './',
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    vue(),
    legacy({
      targets: ['ie>=11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  build: {
    outDir: 'docs',
    rollupOptions: {
      output: {
        sanitizeFileName: (fileName) => {
          const match = DRIVE_LETTER_REGEX.exec(fileName);
          const driveLetter = match ? match[0] : "";
          return (
            driveLetter +
            fileName.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, "")
          );
        }
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/styles/variables.scss" as *;'
      }
    },
    // 禁用 px 转 rem，使用原生 px 和媒体查询实现真正的响应式
    // postcss: {
    //   plugins: [
    //     postCssPxToRem({
    //       rootValue: 192,
    //       propList: ['*'],
    //       exclude: (file) => {
    //         if (/src[\\/]pages[\\/]combined/.test(file)) {
    //           return true;
    //         } else if (/src[\\/]pages[\\/]uncombined/.test(file)) {
    //           return true;
    //         }
    //         return false;
    //       }
    //     })
    //   ]
    // }
  },
  server: {
    proxy: {
      '/qq-proxy': {
        target: 'https://y.qq.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/qq-proxy/, '')
      },
      '/netease-proxy': {
        target: 'http://p3.music.126.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/netease-proxy/, '')
      },
      '/kugou-proxy': {
        target: 'http://imge.kugou.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kugou-proxy/, '')
      },
      '/kuwo-proxy': {
        target: 'https://img2.kuwo.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/kuwo-proxy/, '')
      },
      '/p1-proxy': {
        target: 'https://p1.music.126.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/p1-proxy/, '')
      },
      '/p2-proxy': {
        target: 'https://p2.music.126.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/p2-proxy/, '')
      },
    }
  }
})
