//import react from '@vitejs/plugin-react'
//import { defineConfig } from 'vite'

// https://vite.dev/config/
/*export default defineConfig({
  plugins: [react()],
})*/

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [react(), tailwindcss(),
        
    ],

    server: {
        proxy: {
            "/notices": {
                target: "http://localhost:8080",
                changeOrigin: true,
            },

            "/inquiries": {
                target: "http://localhost:8080",
                changeOrigin: true,
            },
        },
    },
});
