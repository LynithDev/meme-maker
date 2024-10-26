<script lang="ts">
    import type { ChangeEventHandler, HTMLInputAttributes } from "svelte/elements";
    import { randomString } from "$lib/utils/helpers";
    import { createEventDispatcher } from "svelte";
    import { CheckIcon } from "svelte-untitled-ui-icons/CheckIcon";

    export let name: string = randomString();
    export let type: "checkbox" | "toggle" = "checkbox";
    export let value: boolean = false;
    let className: string = "";
    export { className as class };

    interface $$Props extends HTMLInputAttributes {
        name?: string;
        type?: "checkbox" | "toggle";
        value?: boolean;
        class?: string;
    }

    const dispatcher = createEventDispatcher<{
        change: { value: boolean };
    }>();

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        dispatcher("change", { value });
    };

</script>

<label class={className} for={name}>
    <input bind:checked={value} data-conditional={type} id={name} on:change={handleChange} type="checkbox" {...$$restProps} />
    {#if type === "checkbox"}
        <CheckIcon size="16" />
    {/if}

    <slot />
</label>

<style lang="scss">
    label {
        @apply relative flex items-center gap-x-1;
    }

    label > input[data-conditional=checkbox] {
        @apply appearance-none;
        @apply flex box-border border border-accent/40 rounded-sm w-5 h-5 transition;
        @apply checked:(border-accent bg-accent);
    }

    label > input[data-conditional=checkbox] + :global(svg) {
        @apply absolute top-1/2 -translate-y-1/2 left-0 ml-0.5 mt-px w-4 h-4 text-white;
        @apply opacity-0 transition;
    }

    label > input[data-conditional=checkbox]:checked + :global(svg) {
        @apply opacity-100;
    }

    label > input[data-conditional=toggle] {
        @apply appearance-none;
        @apply flex box-border border border-accent rounded-md w-8 h-4 transition relative;
        @apply checked:bg-accent;

        &::before {
            content: "";
            @apply border border-accent absolute -left-px top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-md transition;
            @apply transform translate-x-0;
        }

        &:checked::before {
            @apply transform translate-x-full;
        }
    }

</style>
