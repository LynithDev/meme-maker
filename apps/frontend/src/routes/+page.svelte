<script lang="ts">
    import { onMount } from "svelte";
    import MemeCanvas from "$lib/components/domain/MemeCanvas.svelte";
    import MemeCanvasToolbar from "$lib/components/domain/MemeCanvasToolbar.svelte";
    import MemeContext from "$lib/components/domain/MemeContext.svelte";
    import MemeCanvasSidebar from "$lib/components/domain/MemeCanvasSidebar.svelte";

    let canvas: MemeCanvas;
    let context: MemeContext;

    onMount(() => {
        context.init(canvas.getCanvas());
    });
</script>

<section class="min-h-screen flex flex-col items-center justify-center">
    <MemeContext bind:this={context}>

        <div class="flex flex-col gap-y-2">
            <div class="grid grid-cols-[240px_800px_240px]">
                <div></div>
                <MemeCanvasToolbar />
                <div></div>
            </div>

            <div class="grid grid-cols-[240px_800px_240px]">
                <div></div>
                <MemeCanvas bind:this={canvas} />
                <MemeCanvasSidebar />
            </div>

        </div>

    </MemeContext>
</section>
