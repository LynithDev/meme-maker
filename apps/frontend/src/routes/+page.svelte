<script lang="ts">
    import { onMount } from "svelte";
    import MemeCanvas from "$lib/components/domain/MemeCanvas.svelte";
    import MemeCanvasToolbar from "$lib/components/domain/MemeCanvasToolbar.svelte";
    import MemeContext from "$lib/components/domain/MemeContext.svelte";

    let canvas: MemeCanvas;
    let context: MemeContext;

    onMount(() => {
        context.init(canvas.getCanvas());
    });
</script>

<section class="min-h-screen flex flex-col items-center justify-center">
    <MemeContext bind:this={context}>

        <div class="flex flex-col gap-y-2">
            <MemeCanvasToolbar />
            <MemeCanvas bind:this={canvas} />
        </div>

    </MemeContext>
</section>
