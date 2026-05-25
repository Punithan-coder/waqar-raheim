import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Allow Vite dev server to be accessed via Render's public hostname
    host: true,
    port: Number(process.env.PORT) || 4173,
    strictPort: false,
    // Accept requests for the Render domain (and any onrender.com subdomain)
    allowedHosts: ['waqar-raheim.onrender.com', '.onrender.com'],
    hmr: {
      // Use the public host so HMR works over the served domain
      host: process.env.HOST || 'waqar-raheim.onrender.com',
      protocol: 'ws',
      port: Number(process.env.PORT) || 4173,
    },
  },
})
