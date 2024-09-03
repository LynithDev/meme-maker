<script lang="ts">
    import { getRecommendedCanvasWidth } from "$lib/utils/device";

    let canvas: HTMLCanvasElement;

    export function getCanvas() {
        return canvas;
    }
</script>

<canvas
    class="border border-fg/30 rounded-md border-solid"
    width={getRecommendedCanvasWidth()}
    height={getRecommendedCanvasWidth()}
    on:contextmenu={e => e.preventDefault()}
    bind:this={canvas}
>
    Your browser does not support the HTML5 canvas element.
</canvas>
