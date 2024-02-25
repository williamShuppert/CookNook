import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/api': 'https://127.0.0.1:3000'
    },
    https: {
      key: fs.readFileSync('../certificate/server.key'),
      cert: fs.readFileSync('../certificate/server.cert')
    }
  }
})
