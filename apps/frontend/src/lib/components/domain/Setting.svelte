<script lang="ts">
    import TextInput from "../base/TextInput.svelte";
    import Conditional from "../base/Conditional.svelte";
    import ElementLabel from "./SettingLabel.svelte";
    import type { ValidOptionTypes } from "$lib/canvas/MemeElement";

    export let name: string;
    export let value: ValidOptionTypes;
    export let mixed: boolean = false;

    export let onChange: (value: ValidOptionTypes) => void;
</script>

<div class="grid grid-rows-[theme(fontSize.xs),auto] grid-cols-1 gap-y-1">
    {#if typeof value === "number"}
        <ElementLabel {name} />
        <TextInput
            name={name}
            value={mixed ? null : value}
            placeholder={mixed ? "Mixed" : ""}
            validate={value => value.match(/^\d+$/) !== null}
            on:validatedInput={e => onChange(Number.parseFloat(e.detail.currentTarget.value))}
        />
    {:else if typeof value === "string"}
        <ElementLabel {name} />
        <TextInput
            name={name}
            value={mixed ? null : value}
            placeholder={mixed ? "Mixed" : ""}
            on:validatedInput={e => onChange(e.detail.currentTarget.value)}
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
            <select
                name={name}
                value={mixed ? "mixed" : value.current}
                on:change={e => onChange({ ...value, current: e.currentTarget.value })}
            >
                {#if mixed}
                    <option value="mixed" disabled>Mixed</option>
                {/if}
                {#each value.valid as option}
                    <option value={option}>{option}</option>
                {/each}
            </select>
        {:else if "src" in value}
            <input
                type="file"
                name={name}
                accept="image/*"
                on:change={(e) => {
                    const file = (e.currentTarget).files?.[0];
                    if (!file)
                        return;

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        onChange({ ...value, src: e.target?.result?.toString() || "" });
                    };
                    reader.readAsDataURL(file);
                }}
            >
        {/if}
    {/if}
</div>
