<script lang="ts">
    import { getRecommendedCanvasWidth } from "$lib/utils/device";

    let canvas: HTMLCanvasElement;

    export function getCanvas() {
        return canvas;
    }
</script>

<canvas bind:this={canvas} width={getRecommendedCanvasWidth()} height={getRecommendedCanvasWidth()} class="border border-fg/30 rounded-md border-solid">
    Your browser does not support the HTML5 canvas element.
</canvas>
