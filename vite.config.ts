import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve("./src"),
    },
  },
 server: {
    https: {
      key: path.resolve('./certs/cert.key'),
      cert: path.resolve('./certs/cert.crt'),
    },
  },
})
