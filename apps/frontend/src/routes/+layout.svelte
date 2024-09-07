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

    <title>Meme Maker</title>

    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#f05050">
    <meta name="apple-mobile-web-app-title" content="Meme Maker">
    <meta name="application-name" content="Meme Maker">
    <meta name="msapplication-TileColor" content="#f05050">

    <meta name="description" content="" />
    <meta name="keywords" content="meme,lynith,imgflip,maker,generator,creator,joke,simple,easy" />
    <meta name="theme-color" content="#f05050" />
    <meta name="color-scheme" content="dark light" />
    <meta name="robots" content="index, follow" />
    <meta name="darkreader-lock" content="true" />
    <meta property="og:url" content="https://meme.lynith.dev/" />
    <meta property="og:site_name" content="Meme Maker" />
    <meta property="og:type" content="website" />
</svelte:head>

<main>
    <div class="absolute left-2 top-2">
        <ThemeSwitcher />
    </div>

    <slot />
</main>
