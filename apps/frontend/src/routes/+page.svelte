<script lang="ts">
    import { onMount } from "svelte";
    import MemeCanvas from "$lib/components/domain/MemeCanvas.svelte";
    import MemeCanvasToolbar from "$lib/components/domain/MemeCanvasToolbar.svelte";
    import MemeContext from "$lib/components/domain/MemeContext.svelte";
    import MemeCanvasOptions from "$lib/components/domain/MemeCanvasOptions.svelte";
    import MemeCanvasElements from "$lib/components/domain/MemeCanvasElements.svelte";

    let canvas: MemeCanvas;
    let context: MemeContext;
    let usable: boolean = false;

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
    <div class="flex flex-row items-center justify-center gap-x-2">
        <img class="h-16 w-16" src="/logo.svg" alt="Meme Maker Logo">
        <h1>Meme Maker</h1>
    </div>
    <p>By <a href="https://lynith.dev/">Lynith</a></p>
</section>

<section class="h-full flex flex-col select-none items-center justify-start p-4 pt-0 md:(p-0 pb-8)">

    <MemeContext bind:this={context}>

        <div class="flex flex-col gap-y-2 md:(h-149 max-h-149 min-h-149)">
            <div class="flex flex-col md:grid md:grid-cols-[240px_auto_240px]">
                <div></div>
                <MemeCanvasToolbar />
                <div></div>
            </div>

            <div
                class="h-full min-h-full flex flex-col gap-y-2 md:(grid grid-cols-[240px_auto_240px]) md:[&>*]:(max-h-full overflow-auto)"
                class:opacity-50={usable !== true}
                class:pointer-events-none={usable !== true}
            >
                <MemeCanvasElements class="order-last md:order-none" />
                <MemeCanvas bind:this={canvas} />
                <MemeCanvasOptions />
            </div>
        </div>

    </MemeContext>
</section>
