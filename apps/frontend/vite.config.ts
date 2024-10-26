import { sveltekit } from "@sveltejs/kit/vite";
import presetUno from "@unocss/preset-uno";
import unocss from "unocss/vite";
import { defineConfig } from "vite";

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
