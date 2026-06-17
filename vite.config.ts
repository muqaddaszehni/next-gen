import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Served from https://<user>.github.io/next-gen/ in production, so assets need
// that base path; local dev stays at the root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/next-gen/' : '/',
  plugins: [react()],
}))
