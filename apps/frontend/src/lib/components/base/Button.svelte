<script lang="ts">
    import type { HTMLButtonAttributes } from "svelte/elements";

    type ButtonVariant = "primary" | "inverted" | "danger";
    type ButtonSize = "sm" | "md" | "lg";

    export let variant: ButtonVariant = "primary";
    export let size: ButtonSize = "md";

    interface $$Props extends HTMLButtonAttributes {
        variant?: ButtonVariant;
        size?: ButtonSize;
    }

</script>

<button
    on:click {...$$restProps}
    class={`${variant} ${size}`}>
    <slot />
</button>

<style lang="scss">
    button {
        &.primary {
            @apply bg-accent text-white;
        }

        &.inverted {
            @apply bg-secondary text-fg;
        }

        & {
            @apply ring-focus relative leading-5 flex flex-row justify-center items-center text-center py-sm px-md rounded-lg font-medium;
            @apply focus:(z-1 ring-2 ring-accent);
            @apply hover:(transition-opacity opacity-80 text-opacity-40 disabled:opacity-50 disabled:cursor-default);
            @apply disabled:opacity-50;
        }

    }
</style>
