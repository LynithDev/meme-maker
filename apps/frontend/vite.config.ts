import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import unocss from "unocss/vite";
import presetUno from "@unocss/preset-uno";

export default defineConfig({
    plugins: [
        unocss({
            presets: [presetUno()],
        }),
        sveltekit(),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler",
            },
        },
    },
});
