<script lang="ts">
    import type { FormEventHandler, HTMLInputAttributes } from "svelte/elements";
    import { createEventDispatcher } from "svelte";

    type ValidTypes = "text" | "password" | "number";
    type ValidationType = ((value: string) => boolean) | "float" | "integer";

    export let multiline = false;
    export let value: any = "";
    export let validate: ValidationType = () => true;
    export let type: ValidTypes | undefined = undefined;

    let valid: boolean = true;

    interface $$Props extends HTMLInputAttributes {
        multiline?: boolean;
        value?: any;
        validate?: ValidationType;
        type?: ValidTypes;
    }

    // validate={value => value.match(/^\d+$/) !== null}
    // on:validatedInput={e => onChange(Number.parseFloat(e.detail.currentTarget.value))}

    type InputEvent = Event & { currentTarget: EventTarget & HTMLInputElement };

    const dispatch = createEventDispatcher<{
        validatedInput: InputEvent;
        validatedChange: InputEvent;
        input: InputEvent;
        change: InputEvent;
    }>();

    const validateValue = (value: string) => {
        switch (validate) {
            case "float":
                return value.match(/^-?\d+(\.\d+)?$/) !== null;
            case "integer":
                return value.match(/^-?\d+$/) !== null;
            default:
                return validate(value);
        }
    };

    const handleInput: FormEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        const event = e as InputEvent;
        const target = event.target as HTMLInputElement;
        const value = target.value;

        valid = validateValue(value);

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

    $: valid = value ? validateValue(value.toString()) : true;

    function getInputType() {
        if (type)
            return type;

        if (validate === "float" || validate === "integer")
            return "number";

        return "text";
    }
</script>

{#if multiline}
    <textarea data-valid={valid} on:change={handleChange} on:input={handleInput} on:paste {value} {...$$restProps}></textarea>
{:else}
    <input data-valid={valid} on:change={handleChange} on:input={handleInput} on:paste type={getInputType()} {value} {...$$restProps}>
{/if}

<style lang="scss">
    [data-valid="false"] {
        @apply text-red-500!;
    }

    input, textarea {
        @apply resize-none rounded-lg px-4 py-2 dark:bg-secondary-dark bg-secondary text-black dark:text-white transition-color ring-focus;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
    }

    input[type=number] {
        -moz-appearance: textfield;
        appearance: textfield;
    }
</style>
