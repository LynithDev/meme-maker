<script lang="ts">
    import ThemeSwitcher from "$lib/components/ThemeSwitcher.svelte";
    import { getTheme, setTheme } from "$lib/utils/theme";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { LinkExternal01Icon } from "svelte-untitled-ui-icons/LinkExternal01Icon";
    import "virtual:uno.css";
    import "@unocss/reset/tailwind-compat.css";
    import "$styles/global.scss";

    const theme = writable("auto");

    onMount(() => {
        setTheme(getTheme());
        theme.set(getTheme());

        const onSystemSchemeChange = (e: MediaQueryListEvent) => {
            setTheme(getTheme());
            theme.set(getTheme());
        };

        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", onSystemSchemeChange);

        return () => {
            window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", onSystemSchemeChange);
        };
    });

</script>

<main>
    <div class="absolute left-2 top-2">
        <ThemeSwitcher />
    </div>

    <slot />

    <footer class="w-full">
        <div class="flex flex-col items-center justify-center">
            <a class="flex items-center justify-center text-sm text-fg/70 hover:text-blue" href={import.meta.env.VITE_REPO_URL} target="_blank">
                View this on GitHub
                <LinkExternal01Icon class="ml-1 inline-block h-3 w-3" />
            </a>
        </div>
    </footer>
</main>
