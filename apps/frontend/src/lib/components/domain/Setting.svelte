<script lang="ts">
    import type { ValidOptionTypes } from "$lib/canvas/MemeElement";
    import { writable } from "svelte/store";
    import Button from "../base/Button.svelte";
    import Conditional from "../base/Conditional.svelte";
    import ImageChooser from "../base/ImageChooser.svelte";
    import Switch from "../base/Switch.svelte";
    import TextInput from "../base/TextInput.svelte";
    import ElementLabel from "./SettingLabel.svelte";

    export let name: string;
    export let value: ValidOptionTypes;
    export let mixed: boolean = false;

    const open = writable(false);

    export let onChange: (value: ValidOptionTypes) => void;
</script>

<div class="grid grid-cols-1 gap-y-1 grid-rows-[theme(fontSize.xs),auto]">
    {#if typeof value === "number"}
        <ElementLabel {name} />
        <TextInput
            name={name}
            on:validatedInput={e => onChange(Number.parseFloat(e.detail.currentTarget.value))}
            placeholder={mixed ? "Mixed" : ""}
            validate="float"
            value={mixed ? null : value}
        />
    {:else if typeof value === "string"}
        <ElementLabel {name} />
        <TextInput
            name={name}
            on:input={e => onChange(e.detail.currentTarget.value)}
            placeholder={mixed ? "Mixed" : ""}
            value={mixed ? null : value}
        />
    {:else if typeof value === "boolean"}
        <span></span>
        <Conditional
            id={name}
            name={name}
            on:change={e => onChange(e.detail.value)}
            type="checkbox"
            value={value}
        >
            <span class="capitalize">{name}</span>
        </Conditional>
    {:else if typeof value === "object"}
        {#if "multiline" in value}
            <ElementLabel {name} />
            <TextInput
                multiline
                name={name}
                on:input={e => onChange({ ...value, value: e.detail.currentTarget.value.trim() })}
                placeholder={mixed ? "Mixed" : ""}
                value={mixed ? null : value.value}
            />
        {:else if "valid" in value}
            <ElementLabel {name} />
            <Switch
                on:selected={(e) => {
                    onChange({ ...value, current: e.detail.value });
                }}
                options={value.valid}
                selected={value.valid.indexOf(value.current)}
            />
        {:else if "src" in value}
            <Button on:click={() => open.set(true)} variant="inverted">Choose Image</Button>
            <ImageChooser
                on:confirm={(e) => {
                    const imageSrc = e.detail.src;
                    onChange({ ...value, src: imageSrc || "" });
                }}
                {open}
            />
        {/if}
    {/if}
</div>
