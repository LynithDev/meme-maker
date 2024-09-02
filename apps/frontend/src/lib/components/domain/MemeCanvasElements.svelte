<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import Button from "../base/Button.svelte";
    import app from "$lib/app";
    import TextElement from "$lib/canvas/elements/TextElement";
    import ImageElement from "$lib/canvas/elements/ImageElement";
    import MemeElement from "$lib/canvas/MemeElement";

    const controller = app.controller.get();
    const elements = writable<MemeElement[]>([]);
    const selectedElements = writable<MemeElement[]>([]);

    onMount(() => {
        controller.listen("elementsListChanged", updateElements);
        controller.listen("selectedElementsChange", updateElements);
    });

    function updateElements() {
        elements.set(controller.elements);
        selectedElements.set(controller.selectedElements);
    }

    function selectElement(element: MemeElement) {
        if (controller.holdingShift)
            controller.selectedElements.push(element);
        else
            controller.selectedElements = [element];

        controller.emit("selectedElementsChange");
    }
</script>

<div class="flex flex-col justify-between gap-y-2 px-2">
    <div class="flex flex-1 flex-col items-center gap-y-2 rounded-lg bg-secondary p-2">

        <h4>Elements</h4>

        <div class="divider-x" />

        {#each $elements as element}
            <button
                class="w-full flex flex-row items-center justify-start gap-x-2 rounded-md px-2 py-1 text-fg hover:cursor-pointer hover:bg-opacity-80 hover:text-opacity-40!"
                class:bg-primary={$selectedElements.includes(element)}
                class:bg-transparent={!$selectedElements.includes(element)}
                on:click={() => selectElement(element)}
            >
                {#if element instanceof TextElement}
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 4V20M18 4V20M9.5 4V20M11.5 4H4M18 12H9.5M11.5 20H4M20 20H16M20 4H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                    <span class="overflow-hidden text-ellipsis">{element.settings.text.value}</span>
                {:else if element instanceof ImageElement}
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.2 21H6.93137C6.32555 21 6.02265 21 5.88238 20.8802C5.76068 20.7763 5.69609 20.6203 5.70865 20.4608C5.72312 20.2769 5.93731 20.0627 6.36569 19.6343L14.8686 11.1314C15.2646 10.7354 15.4627 10.5373 15.691 10.4632C15.8918 10.3979 16.1082 10.3979 16.309 10.4632C16.5373 10.5373 16.7354 10.7354 17.1314 11.1314L21 15V16.2M16.2 21C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2M16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3H16.2C17.8802 3 18.7202 3 19.362 3.32698C19.9265 3.6146 20.3854 4.07354 20.673 4.63803C21 5.27976 21 6.11984 21 7.8V16.2M10.5 8.5C10.5 9.60457 9.60457 10.5 8.5 10.5C7.39543 10.5 6.5 9.60457 6.5 8.5C6.5 7.39543 7.39543 6.5 8.5 6.5C9.60457 6.5 10.5 7.39543 10.5 8.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                    <span>Image</span>
                {/if}
            </button>
        {/each}

    </div>

    <Button variant="inverted" on:click={() => controller.createElement(TextElement)}>Add Text</Button>
    <Button variant="inverted" on:click={() => controller.createElement(ImageElement)}>Add Image</Button>
</div>
