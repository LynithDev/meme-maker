<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";
    import { createEventDispatcher } from "svelte";
    import Button from "./Button.svelte";

    export let options: string[];
    export let selected = 0;

    interface $$Props extends HTMLInputAttributes {
        options: string[];
        selected?: number;
    }

    const dispatch = createEventDispatcher<{
        selected: { index: number; value: string };
    }>();

    function setSelected(index: number) {
        selected = index;
        dispatch("selected", {
            index,
            value: options[index] || "",
        });
    }
</script>

<div class="options">
    {#each options as option, index}
        <Button
            on:click={() => setSelected(index)}
            variant={selected === index ? "primary" : "inverted"}
        >
            {option}
        </Button>
    {/each}
</div>

<style lang="scss">
    div.options {
        @apply flex flex-row w-full;
    }

    div.options :global(button) {
        @apply flex-1 rounded-none first:rounded-l-lg last:rounded-r-lg px-2;
    }
</style>
