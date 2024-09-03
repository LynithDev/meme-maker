<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { ChangeEventHandler, HTMLInputAttributes } from "svelte/elements";

    export let name: string = crypto.randomUUID();
    export let type: "checkbox" | "toggle" = "checkbox";
    export let value: boolean = false;

    interface $$Props extends HTMLInputAttributes {
        name?: string;
        type?: "checkbox" | "toggle";
        value?: boolean;
    }

    const dispatcher = createEventDispatcher<{
        change: { value: boolean };
    }>();

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        dispatcher("change", { value });
    };

</script>

<label for={name} class={$$props.class}>
    <input type="checkbox" class={type} id={name} bind:checked={value} on:change={handleChange} {...$$restProps} />
    {#if type === "checkbox"}
        <svg class="checkmark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    {/if}

    <slot />
</label>

<style lang="scss">
    label {
        @apply relative flex items-center gap-x-1;
    }

    .checkbox {
        @apply appearance-none;
        @apply flex box-border border border-accent/40 rounded-sm w-5 h-5 transition;
        @apply checked:(border-accent bg-accent);
    }

    .checkmark {
        @apply absolute top-1/2 -translate-y-1/2 left-0 ml-0.5 mt-px w-4 h-4 text-white;
        @apply [input:checked+&]:opacity-100 opacity-0 transition;
    }

    .toggle {
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
