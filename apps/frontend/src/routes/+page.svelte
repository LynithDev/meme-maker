<script lang="ts">
    import { onMount } from "svelte";
    import MemeCanvas from "$lib/components/domain/MemeCanvas.svelte";
    import MemeCanvasToolbar from "$lib/components/domain/MemeCanvasToolbar.svelte";
    import MemeContext from "$lib/components/domain/MemeContext.svelte";
    import MemeCanvasOptions from "$lib/components/domain/MemeCanvasOptions.svelte";
    import { getRecommendedCanvasWidth } from "$lib/utils/device";
    import MemeCanvasElements from "$lib/components/domain/MemeCanvasElements.svelte";

    let canvas: MemeCanvas;
    let context: MemeContext;
    let usable: boolean = false;
    const canvasWidth = getRecommendedCanvasWidth();

    onMount(() => {
        const unregister = context.init(canvas.getCanvas(), (controller) => {
            controller.listen("imageChange", () => {
                usable = controller.image !== null;
            });
        });

        return unregister;
    });
</script>

<section class="h-[20vh] flex flex-col items-center justify-center">
    <h1>Meme Maker</h1>
    <p>By <a href="https://lynith.dev/">Lynith</a></p>
</section>

<section class="flex flex-col select-none items-center justify-start pb-8">

    <MemeContext bind:this={context}>

        <div class="min-h-149 flex flex-col gap-y-2" style="--canvas-width: {canvasWidth}px;">
            <div class="grid grid-cols-[240px_var(--canvas-width)_240px]">
                <div></div>
                <MemeCanvasToolbar />
                <div></div>
            </div>

            <div
                class="grid grid-cols-[240px_var(--canvas-width)_240px] min-h-149"
                class:opacity-50={usable !== true}
                class:pointer-events-none={usable !== true}
            >
                <MemeCanvasElements />
                <MemeCanvas bind:this={canvas} />
                <MemeCanvasOptions />
            </div>
        </div>

    </MemeContext>
</section>
