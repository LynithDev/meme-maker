import defineConfig from "@flowr/eslint-config";

export default defineConfig({
    typescript: true,
    svelte: true,
    unocss: true,
    gitignore: true,
    yaml: false,
    stylistic: {
        indent: 4,
        semi: true,
        quotes: "double",
    },
    ignores: ["**/.svelte-kit/**/*", "**/build/**/*", "**/dist/**/*", "**/node_modules/**/*"],
}, [
    {
        rules: {
            "unused-imports/no-unused-vars": [
                "error",
                {
                    vars: "all",
                    varsIgnorePattern: "(^_)|(^e$)|(^event$)|(^.*Props)",
                    args: "after-used",
                    argsIgnorePattern: "(^_)|(^e$)|(^event$)",
                },
            ],
            "no-undef-init": ["off"],
            "no-restricted-syntax": ["off"],
            "no-labels": ["off"],
        },
    },
]);
