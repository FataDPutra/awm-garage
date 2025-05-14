import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            refresh: true,
        }),
        react(),
    ],
});

// import { defineConfig } from "vite";
// import laravel from "laravel-vite-plugin";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//     plugins: [
//         laravel({
//             input: "resources/js/app.jsx",
//             refresh: true,
//         }),
//         react(),
//     ],
//     server: {
//         host: "0.0.0.0",
//         port: 5173,
//         hmr: {
//             clientPort: 443,
//             protocol: "wss",
//         },
//     },
//     build: {
//         outDir: "public/build",
//         manifest: "manifest.json", // Secara eksplisit tentukan nama dan lokasi
//         rollupOptions: {
//             output: {
//                 entryFileNames: `assets/[name]-[hash].js`,
//                 chunkFileNames: `assets/[name]-[hash].js`,
//                 assetFileNames: `assets/[name]-[hash].[ext]`,
//             },
//         },
//     },
//     base: "/",
// });
