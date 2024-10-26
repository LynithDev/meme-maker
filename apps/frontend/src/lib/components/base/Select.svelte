<script lang="ts">
    import type { HTMLSelectAttributes } from "svelte/elements";

    interface $$Props extends HTMLSelectAttributes {

    }
</script>

<select on:change on:click on:select {...$$restProps}>
    <slot />
</select>

<style lang="scss">
    select {
        @apply ring-focus transition appearance-none bg-secondary rounded-lg py-sm px-md leading-5 font-medium;
        @apply focus:(ring-2 ring-accent);
        @apply disabled:(opacity-50 pointer-events-none cursor-default);
    }

    :global(option) {
        @apply bg-secondary text-fg rounded-lg;
    }
</style>
