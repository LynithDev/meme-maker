<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { writable } from "svelte/store";
    import Button from "../base/Button.svelte";
    import Overlay from "./Overlay.svelte";

    export let open = writable(false);

    export let title = "";
    export let confirmText = "Proceed";
    export let cancelText = "Cancel";

    const dispatch = createEventDispatcher();

    function confirm() {
        dispatch("confirm");
        open.set(false);
    }

    function cancel() {
        dispatch("cancel");
        open.set(false);
    }
</script>

<Overlay on:close={cancel} open={open}>
    <div class="pointer-events-none h-full w-full flex flex-col items-center justify-center">
        <div class="pointer-events-auto max-w-lg min-w-50 flex flex-col items-center gap-y-4 rounded-lg bg-primary p-4 text-center">
            {#if $$slots.title}
                <slot name="title" />
            {:else}
                <h3 class="font-bold">{title}</h3>
            {/if}

            {#if $$slots.paragraph}
                <slot name="paragraph" />
            {/if}

            <div class="divider-x" />

            <slot />

            <div class="divider-x" />

            <div class="w-full flex flex-row justify-between gap-x-2 [&>*]:flex-1">
                {#if $$slots.buttons === false}
                    <slot name="buttons" />
                {:else}
                    <Button variant="inverted" on:click={cancel}>{cancelText}</Button>
                    <Button on:click={confirm}>{confirmText}</Button>
                {/if}
            </div>
        </div>
    </div>
</Overlay>
