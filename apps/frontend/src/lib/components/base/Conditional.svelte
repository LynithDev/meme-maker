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
    <slot />
</label>

<style lang="scss">
    label {
        @apply flex items-center gap-x-1;
    }

    .checkbox {
        @apply appearance-none;
        @apply flex box-border border border-accent rounded-sm w-5 h-5 transition;
        @apply checked:bg-accent;
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
