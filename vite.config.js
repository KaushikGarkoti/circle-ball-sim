import { defineConfig } from 'vite'

export default defineConfig({
  base: '/circle-ball-sim/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  optimizeDeps: {
    include: ['three']
  }
})
