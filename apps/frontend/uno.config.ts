import { defineConfig, transformerDirectives, transformerVariantGroup } from "unocss";
import transformerCompileClass from "@unocss/transformer-compile-class";
import type { Theme } from "unocss/preset-uno";
import { presetUno } from "unocss/preset-uno";
import { presetTheme } from "unocss-preset-theme";

export default defineConfig<Theme>({
    theme: {
        colors: {
            transparent: "transparent",
            current: "currentColor",

            accent: {
                DEFAULT: "#f05050",
                light: "#f26262",
            },

            primary: "#FFF2F2",
            secondary: "#F1E2E2",

            fg: "#302B2B",

            black: "#302B2B",
            white: "#FFF2F2",

            pure: {
                black: "#000000",
            },

            danger: "#ff0000",
        },
        borderRadius: {
            none: "0",
            sm: "4px",
            md: "7px",
            lg: "10px",
            xl: "15px",
        },
        spacing: {
            xxs: "3px",
            xs: "6px",
            sm: "10px",
            md: "20px",
            lg: "30px",
            xl: "60px",
        },
    },

    presets: [
        presetUno({
            dark: "class",
        }),
        presetTheme<Theme>({
            theme: {
                dark: {
                    colors: {
                        primary: "#3A2E2E",
                        secondary: "#312626",
                        fg: "#FFF2F2",
                    },
                },
            },
        }),
    ],

    shortcuts: {
        "ring-focus": "focus:ring focus:ring-accent/40 focus:outline-none transition-shadow",
        "divider-x": "w-full h-px bg-fg/20",
        "divider-y": "w-px h-full bg-fg/20",
    },

    transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
        transformerCompileClass(),
    ],
});
