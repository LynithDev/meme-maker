<script lang="ts">
    import "virtual:uno.css";
    import "@unocss/reset/tailwind-compat.css";
    import "$styles/global.scss";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
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

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet">
</svelte:head>

<main>
    <div class="absolute left-2 top-2">
        <ThemeSwitcher />
    </div>
    <slot />
</main>
