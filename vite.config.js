import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    commonjsOptions: {
      include: [/node_modules/]
    }
  },
  optimizeDeps: {
    include: ['pdfmake', 'pdfmake/build/vfs_fonts']
  },
  resolve: {
    alias: {
      './vfs_fonts.js': 'pdfmake/build/vfs_fonts'
    }
  }
})