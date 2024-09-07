<script lang="ts">
    import type { HTMLButtonAttributes } from "svelte/elements";

    type ButtonVariant = "primary" | "inverted" | "danger";
    type ButtonSize = "sm" | "md" | "lg";

    export let variant: ButtonVariant = "primary";
    export let size: ButtonSize = "md";

    interface $$Props extends HTMLButtonAttributes {
        variant?: ButtonVariant;
        size?: ButtonSize;
        iconOnly?: boolean;
    }

</script>

<button
    on:click {...$$restProps}
    class={`${variant} ${size} ${$$props.class}`}
>
    {#if $$slots.icon}
        <slot name="icon" />
        <span>
            <slot />
        </span>
    {:else}
        <slot />
    {/if}
</button>

<style lang="scss">
    button {
        &.primary {
            @apply bg-accent text-white;
        }

        &.inverted {
            @apply bg-secondary text-fg;
        }

        &.danger {
            @apply bg-danger/10 text-danger hover:(bg-danger/50 text-white);
        }

        & {
            @apply transition! ring-focus relative leading-5 flex flex-row justify-center items-center gap-x-1 text-center py-sm px-md rounded-lg font-medium;
            @apply focus:(z-1 ring-2 ring-accent);
            @apply hover:(opacity-80 text-opacity-40);
            @apply disabled:(opacity-50 pointer-events-none cursor-default);
        }
    }

    button > :global(svg + span) {
        @apply md:block hidden;
    }
</style>
