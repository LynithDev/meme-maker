<script lang="ts">
    import "virtual:uno.css";
    import "@unocss/reset/tailwind-compat.css";
    import "$styles/global.scss";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { LinkExternal01Icon } from "svelte-untitled-ui-icons/LinkExternal01Icon";
    import { getTheme, setTheme } from "$lib/utils/theme";
    import ThemeSwitcher from "$lib/components/ThemeSwitcher.svelte";

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
            <a target="_blank" href={import.meta.env.VITE_REPO_URL} class="flex items-center justify-center text-sm text-fg/70 hover:text-blue">
                View this on GitHub
                <LinkExternal01Icon class="ml-1 inline-block h-3 w-3" />
            </a>
        </div>
    </footer>
</main>
