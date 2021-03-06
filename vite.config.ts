import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      external: ['vue']
    },
    lib: {
      name: 'vueUseReqeust',
      entry: 'src/index.ts',
      formats: ['es', 'umd'],
    }
  }
})
