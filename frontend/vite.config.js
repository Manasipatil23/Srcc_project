import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Listen on all interfaces so other machines on the SRCC LAN can open the app.
  server: {
    host: true,
  },
})
