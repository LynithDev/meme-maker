<script lang="ts">
    import theme, { type PageTheme, pageThemes } from "$lib/utils/theme";
    import { onMount } from "svelte";
    import { ClockIcon } from "svelte-untitled-ui-icons/ClockIcon";
    import { Moon01Icon } from "svelte-untitled-ui-icons/Moon01Icon";
    import { SunIcon } from "svelte-untitled-ui-icons/SunIcon";
    import Button from "./base/Button.svelte";

    let iconContainer: HTMLDivElement;

    onMount(() => {
        for (let i = 0; i < pageThemes.length; i++) {
            const theme = pageThemes[i];
            const icon = iconContainer.children.item(i);
            if (!theme || !icon)
                break;

            icon.setAttribute("data-theme", theme);
        }

        window.addEventListener("themeUpdated", (e) => {
            updatePosition();
        });
    });

    function nextTheme() {
        const currentTheme = theme.getTheme();
        const currentIndex = pageThemes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % pageThemes.length;
        const pageTheme = pageThemes[nextIndex] as PageTheme;
        theme.setTheme(pageTheme);
    }

    function updatePosition() {
        const currentTheme = theme.getTheme();
        const position = pageThemes.indexOf(currentTheme);
        const offsetFromMiddle = Math.floor((pageThemes.length / 2) - position);

        const modifier = -2.5;

        iconContainer.style.transform = `translateY(${offsetFromMiddle * modifier}rem)`;
    }

</script>

<Button
    aria-label="Switch Theme"
    class="relative overflow-hidden px-sm!"
    on:click={nextTheme}
    variant="inverted"
>
    <span class="h-5 w-5"></span>
    <div bind:this={iconContainer} class="absolute flex flex-col items-start justify-start gap-y-4 transition-transform">
        <Moon01Icon class="pointer-events-none w-5" />
        <ClockIcon class="pointer-events-none w-5" />
        <SunIcon class="pointer-events-none w-5" />
    </div>
</Button>
