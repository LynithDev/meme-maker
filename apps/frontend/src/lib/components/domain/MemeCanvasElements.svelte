<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import type { HTMLAttributes } from "svelte/elements";
    import { Heading01Icon } from "svelte-untitled-ui-icons/Heading01Icon";
    import { Image01Icon } from "svelte-untitled-ui-icons/Image01Icon";
    import Button from "../base/Button.svelte";
    import app from "$lib/app";
    import TextElement from "$lib/canvas/elements/TextElement";
    import ImageElement from "$lib/canvas/elements/ImageElement";
    import MemeElement from "$lib/canvas/MemeElement";

    const controller = app.controller.get();
    const elements = writable<MemeElement[]>([]);
    const selectedElements = writable<MemeElement[]>([]);

    let className: string = "";
    export { className as class };

    interface $$Props extends HTMLAttributes<HTMLDivElement> {
        class?: string;
    }

    onMount(() => {
        controller.listen("elementsListChanged", updateElements);
        controller.listen("selectedElementsChange", updateElements);
    });

    function updateElements() {
        elements.set(controller.elements);
        selectedElements.set(controller.selectedElements);
    }

    function selectElement(element: MemeElement) {
        if (controller.holdingShift) {
            const index = controller.selectedElements.indexOf(element);
            if (index !== -1)
                controller.selectedElements.splice(index, 1);
            else
                controller.selectedElements.push(element);
        }
        else {
            controller.selectedElements = [element];
        }

        controller.emit("selectedElementsChange");
    }
</script>

<div class={`h-full max-h-full flex flex-col justify-start gap-y-2 md:px-2 ${className}`} {...$$restProps}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="h-full max-h-full flex flex-1 flex-col items-center gap-y-2 overflow-hidden rounded-lg bg-secondary p-2"
        on:click={(e) => {
            if (e.target === e.currentTarget) {
                e.stopImmediatePropagation();
                controller.clearSelected();
            }
        }}
    >
        <h4>Elements</h4>

        <div class="divider-x" />

        {#if $elements.length > 0}
            <div class="max-h-full w-full flex flex-1 flex-col gap-y-1 overflow-auto">
                {#each $elements as element}
                    <button
                        class="w-full flex flex-row items-center justify-start gap-x-2 rounded-md px-2 py-1 text-fg hover:cursor-pointer hover:bg-opacity-80 hover:text-opacity-40!"
                        class:bg-primary={$selectedElements.includes(element)}
                        class:bg-transparent={!$selectedElements.includes(element)}
                        on:click={() => selectElement(element)}
                    >
                        {#if element instanceof TextElement}
                            <Heading01Icon size="16" />

                            <span class="line-clamp-1 max-w-full overflow-hidden text-ellipsis">{element.settings.text.value}</span>
                        {:else if element instanceof ImageElement}
                            <Image01Icon size="16" />

                            <span>Image</span>
                        {/if}
                    </button>
                {/each}
            </div>
        {/if}

    </div>

    <Button variant="inverted" on:click={() => controller.createElement(TextElement)}>Add Text</Button>
    <Button variant="inverted" on:click={() => controller.createElement(ImageElement)}>Add Image</Button>

    <Button
        variant="danger"
        on:click={() => controller.removeElements($selectedElements)}
        disabled={$selectedElements.length === 0}
    >
        Delete
    </Button>
</div>
