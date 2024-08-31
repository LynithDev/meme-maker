<script lang="ts">
    import { onMount } from "svelte";
    import MemeCanvasSidebar from "./MemeCanvasSidebar.svelte";
    import MemeCanvasController from "$lib/canvas/MemeCanvasController";
    import TextElement from "$lib/canvas/elements/TextElement";
    import ImageElement from "$lib/canvas/elements/ImageElement";

    let canvas: HTMLCanvasElement;
    let controller: MemeCanvasController | undefined;

    onMount(() => {
        controller = new MemeCanvasController(canvas);

        controller.requestFrame();
    });

    function chooseImage() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (!file)
                return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const image = new Image();
                image.onload = () => {
                    controller?.changeImage(image);
                };
                image.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        };
        input.click();
    }
</script>

<div class="flex flex-col">
    <div class="flex flex-row">
        <button on:click={() => controller?.createElement(TextElement)}>Add Text</button>
        <button on:click={() => controller?.createElement(ImageElement)}>Add Image</button>
        <button on:click={() => chooseImage()}>Choose Image</button>
        <button on:click={() => controller?.export("jpeg")}>Export Image</button>
    </div>

    <div class="flex flex-row">
        <div>
            <canvas bind:this={canvas} width="800" height="600" class="border border-black border-solid">
                Your browser does not support the HTML5 canvas element.
            </canvas>
        </div>

        <div class="flex flex-col w-50">
            {#if controller}
                <MemeCanvasSidebar controller={controller} />
            {/if}
        </div>
    </div>
</div>
