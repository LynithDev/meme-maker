<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { writable } from "svelte/store";
    import Button from "../base/Button.svelte";
    import Overlay from "./Overlay.svelte";

    export let open = writable(false);

    export let title = "";
    export let paragraph = "";
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
        <div class="pointer-events-auto m-4 h-auto max-w-lg min-w-50 w-auto flex flex-col items-center justify-start gap-y-4 overflow-auto rounded-lg bg-primary p-4 text-center">
            {#if $$slots.title}
                <slot name="title" />
            {:else}
                <h3 class="font-bold">{title}</h3>
            {/if}

            {#if $$slots.paragraph}
                <slot name="paragraph" />
            {:else if paragraph}
                <p>{paragraph}</p>
            {/if}

            {#if $$slots.default}
                <div class="divider-x" />

                <slot />
            {/if}

            <div class="divider-x" />
            <div class="w-full flex flex-col justify-between gap-2 [&>*]:flex-1 md:flex-row">
                {#if $$slots.buttons === true}
                    <slot name="buttons" />
                {:else}
                    <Button on:click={cancel} variant="inverted">{cancelText}</Button>
                    <Button on:click={confirm}>{confirmText}</Button>
                {/if}
            </div>
        </div>
    </div>
</Overlay>
