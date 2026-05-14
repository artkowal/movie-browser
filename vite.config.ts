import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // './' = ścieżki relatywne — działa zarówno na lokalnym serwerze jak i
  // na GitHub Pages gdzie app siedzi pod /nazwa-repo/ a nie pod /
  base: './',
})
