import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    base: process.env.GITHUB_PAGES ? "/atcoder-difficulty/" : "./",
    build: {
        target: ["es2022", "edge89", "firefox89", "chrome89", "safari15"],
    },
    plugins: [react(), tailwindcss()],
});
