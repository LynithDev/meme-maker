<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { HTMLInputAttributes } from "svelte/elements";
    import { writable } from "svelte/store";
    import { randomString } from "$lib/utils/helpers";

    export let name: string = randomString();
    const chosenFileNames = writable<string | null>(null);

    interface $$Props extends HTMLInputAttributes {
        name?: string;
    }

    const dispatcher = createEventDispatcher<{
        change: FileList | null;
    }>();

    function handleChange(event: Event) {
        const files = (event.currentTarget as HTMLInputElement).files;
        const list: File[] = [];
        for (let i = 0; i < (files?.length || 0); i++) {
            const file = files?.item(i);
            if (file)
                list.push(file);
        }

        chosenFileNames.set(list.map(file => file.name).join(", "));

        dispatcher("change", files);
    }

    export function clear() {
        chosenFileNames.set(null);
    }
</script>

<label for={name} class={$$props.class}>
    <div>
        {#if $chosenFileNames}
            <span>
                {$chosenFileNames}
            </span>
        {:else}
            <span>
                Choose File
            </span>
        {/if}
    </div>

    <input on:change={handleChange} id={name} type="file" {...$$restProps}>
</label>

<style lang="scss">
    input[type=file] {
        @apply hidden appearance-none;

        &::-webkit-file-upload-button {
            @apply hidden;
        }

        &::-ms-browse {
            @apply hidden;
        }
    }

    div {
        @apply h-full w-full flex flex-1 flex-row items-center gap-x-2;
        @apply ring-focus relative leading-5 flex flex-row justify-center items-center text-center py-sm px-md rounded-lg font-medium;
        @apply focus:(z-1 ring-2 ring-accent);
        @apply hover:(transition-opacity opacity-80 text-opacity-40 cursor-pointer disabled:opacity-50 disabled:cursor-default);
        @apply disabled:opacity-50;
        @apply bg-secondary text-fg;
    }
</style>
