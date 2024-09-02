<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";

    export let multiline = false;
    export let value: string = "";

    interface $$Props extends HTMLInputAttributes {
        multiline?: boolean;
        value?: string;
    }

</script>

{#if multiline}
    <textarea bind:value={value} on:change on:input on:paste {...$$restProps}></textarea>
{:else}
    <input bind:value={value} on:change on:input on:paste type="text" {...$$restProps}>
{/if}

<style lang="scss">
    input[type=text], textarea {
        @apply resize-none rounded-lg px-4 py-2 dark:bg-secondary-dark bg-secondary text-black dark:text-white focus:transition-color-ring focus:text-accent focus:dark:text-accent ring-focus;
    }
</style>
