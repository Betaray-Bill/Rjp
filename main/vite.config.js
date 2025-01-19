import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
  // Use port 443 for HTTPS
    host: '0.0.0.0', // to use all the interface cards
    //  proxy: {
    //     '/api': 'http://bas.rjpinfotek.com:5000',
    // },
    port: 80,
    strictPort: true, // Ensures the server will fail if 5173 is unavailable
    open: true, 
  },
})
