import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import unocss from "@unocss/svelte-scoped/preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [
        vitePreprocess(),
        unocss(),
    ],
    kit: {
        adapter: adapter(),
        alias: {
            $styles: "src/styles/*",
        },
    },
};

export default config;
