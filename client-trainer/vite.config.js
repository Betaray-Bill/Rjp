import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import path from "path"

export default defineConfig({
    plugins: [react()],
    css: {
        postcss: {
            plugins: [tailwindcss()],
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
       server: {
         host: '0.0.0.0', // to use all the interface cards
        port: 5174, // Set the port to 5174
        strictPort: true, // Ensures the server will fail if 5173 is unavailable
        open: true, // Optional: Automatically opens the app in the browser
      },
})