import process from "node:process";
import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import unocss from "@unocss/svelte-scoped/preprocess";

const prod = process.env.NODE_ENV !== "development";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [
        vitePreprocess(),
        unocss({
            combine: prod,
        }),
    ],
    kit: {
        adapter: adapter(),
        alias: {
            $styles: "src/styles/*",
        },
    },
};

export default config;
