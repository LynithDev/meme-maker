<script lang="ts">
    import type { ValidOptionTypes } from "$lib/canvas/MemeElement";

    export let name: string;
    export let value: ValidOptionTypes;
    export let mixed: boolean = false;

    export let onChange: (value: ValidOptionTypes) => void;
</script>

{#if typeof value === "number"}
    <input
        type="number"
        name={name}
        value={mixed ? null : value}
        placeholder={mixed ? "mixed" : name}
        on:input={(e) => {
            const num = Number.parseFloat(e.currentTarget.value);
            if (Number.isNaN(num))
                return;

            onChange(num);
        }}
    >
{:else if typeof value === "string"}
    <input
        type="text"
        name={name}
        value={mixed ? null : value}
        placeholder={mixed ? "mixed" : name}
        on:input={e => onChange(e.currentTarget.value)}
    >
{:else if typeof value === "boolean"}
    <label for={name}>
        <input
            type="checkbox"
            name={name}
            id={name}
            checked={value}
            on:change={e => onChange(e.currentTarget.checked)}
        >
        {name}
    </label>
{:else if typeof value === "object"}
    {#if "multiline" in value}
        <textarea
            name={name}
            value={mixed ? null : value.value}
            placeholder={mixed ? "mixed" : name}
            on:input={e => onChange({ ...value, value: e.currentTarget.value.trim() })}
        ></textarea>
    {:else if "valid" in value}
        <select
            name={name}
            value={mixed ? null : value.current}
            on:change={e => onChange({ ...value, current: e.currentTarget.value })}
        >
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
