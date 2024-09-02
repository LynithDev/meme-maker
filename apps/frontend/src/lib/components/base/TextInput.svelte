<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { FormEventHandler, HTMLInputAttributes } from "svelte/elements";

    type ValidTypes = "text" | "password" | "number";

    export let type: ValidTypes = "text";
    export let multiline = false;
    export let value: any = "";
    export let validate: (value: string) => boolean = () => true;

    let valid: boolean = true;

    interface $$Props extends HTMLInputAttributes {
        multiline?: boolean;
        value?: any;
        validate?: (value: string) => boolean;
        type?: ValidTypes;
    }

    type InputEvent = Event & { currentTarget: EventTarget & HTMLInputElement };

    const dispatch = createEventDispatcher<{
        validatedInput: InputEvent;
        validatedChange: InputEvent;
        input: InputEvent;
        change: InputEvent;
    }>();

    const handleInput: FormEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        const event = e as InputEvent;
        const target = event.target as HTMLInputElement;
        const value = target.value;

        valid = validate(value);

        if (valid)
            dispatch("validatedInput", event);

        dispatch("input", event);
    };

    const handleChange: FormEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        const event = e as InputEvent;

        if (valid)
            dispatch("validatedChange", event);

        dispatch("change", event);
    };

    $: valid = value ? validate(value.toString()) : true;

</script>

{#if multiline}
    <textarea {value} on:change={handleChange} on:input={handleInput} on:paste data-valid={valid} {...$$restProps}></textarea>
{:else}
    <input {value} {type} on:change={handleChange} on:input={handleInput} on:paste data-valid={valid} {...$$restProps}>
{/if}

<style lang="scss">
    [data-valid="false"] {
        @apply text-red-500!;
    }

    input[type=text], textarea {
        @apply resize-none rounded-lg px-4 py-2 dark:bg-secondary-dark bg-secondary text-black dark:text-white transition-color ring-focus;
    }

</style>
