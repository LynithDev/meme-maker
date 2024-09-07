import process from "node:process";
import adapter from "@sveltejs/adapter-static";
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
        adapter: adapter({
            precompress: true,
            strict: true,
        }),
        alias: {
            $styles: "src/styles/*",
        },
        paths: {
            base: process.argv.includes("dev") ? "" : process.env.BASE_PATH,
        },
    },
};

export default config;
