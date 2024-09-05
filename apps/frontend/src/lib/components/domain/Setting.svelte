<script lang="ts">
    import { writable } from "svelte/store";
    import TextInput from "../base/TextInput.svelte";
    import Conditional from "../base/Conditional.svelte";
    import ImageChooser from "../base/ImageChooser.svelte";
    import Button from "../base/Button.svelte";
    import Select from "../base/Select.svelte";
    import ElementLabel from "./SettingLabel.svelte";
    import type { ValidOptionTypes } from "$lib/canvas/MemeElement";

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
            value={mixed ? null : value}
            placeholder={mixed ? "Mixed" : ""}
            validate="float"
            on:validatedInput={e => onChange(Number.parseFloat(e.detail.currentTarget.value))}
        />
    {:else if typeof value === "string"}
        <ElementLabel {name} />
        <TextInput
            name={name}
            value={mixed ? null : value}
            placeholder={mixed ? "Mixed" : ""}
            on:input={e => onChange(e.detail.currentTarget.value)}
        />
    {:else if typeof value === "boolean"}
        <span></span>
        <Conditional
            type="checkbox"
            name={name}
            id={name}
            value={value}
            on:change={e => onChange(e.detail.value)}
        >
            <span class="capitalize">{name}</span>
        </Conditional>
    {:else if typeof value === "object"}
        {#if "multiline" in value}
            <ElementLabel {name} />
            <TextInput
                name={name}
                value={mixed ? null : value.value}
                placeholder={mixed ? "Mixed" : ""}
                multiline
                on:input={e => onChange({ ...value, value: e.detail.currentTarget.value.trim() })}
            />
        {:else if "valid" in value}
            <ElementLabel {name} />
            <Select
                name={name}
                value={mixed ? "mixed" : value.current}
                on:change={(e) => {
                    // @ts-expect-error
                    onChange({ ...value, current: e.currentTarget.value });
                }}
            >
                {#if mixed}
                    <option value="mixed" disabled>Mixed</option>
                {/if}
                {#each value.valid as option}
                    <option value={option}>{option}</option>
                {/each}
            </Select>
        {:else if "src" in value}
            <Button variant="inverted" on:click={() => open.set(true)}>Choose Image</Button>
            <ImageChooser
                {open}
                on:confirm={(e) => {
                    const imageSrc = e.detail.src;
                    onChange({ ...value, src: imageSrc || "" });
                }}
            />
        {/if}
    {/if}
</div>
