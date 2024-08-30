import defineConfig from "@flowr/eslint-config";

export default defineConfig({
    typescript: true,
    svelte: true,
    unocss: true,
    gitignore: true,
    yaml: true,
    stylistic: {
        indent: 4,
        semi: true,
        quotes: "double",
    },
}, [
    {
        rules: {
            "unused-imports/no-unused-vars": [
                "error",
                {
                    vars: "all",
                    varsIgnorePattern: "^_",
                    args: "after-used",
                    argsIgnorePattern: "(^_)|(^e$)|(^event$)",
                },
            ],
            "no-restricted-syntax": ["off"],
            "no-labels": ["off"],
        },
    },
]);
