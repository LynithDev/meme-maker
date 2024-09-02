<script lang="ts">
    let canvas: HTMLCanvasElement;

    export function getCanvas() {
        return canvas;
    }
</script>

<canvas bind:this={canvas} width="800" height="600" class="border border-fg/30 rounded-md border-solid">
    Your browser does not support the HTML5 canvas element.
</canvas>
