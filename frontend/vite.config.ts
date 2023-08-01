import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
    ],
    server: {
        port: process.env.NODE_ENV === "production" ? Number(process.env.PORT)|| 5000 : 5173,
        host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost",
    }
});
