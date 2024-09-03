<script lang="ts">
    let canvas: HTMLCanvasElement;

    export function getCanvas() {
        return canvas;
    }
</script>

<canvas
    class="max-w-[500px] border border-fg/30 rounded-md border-solid"
    width={500}
    height={500}
    on:contextmenu={e => e.preventDefault()}
    bind:this={canvas}
>
    Your browser does not support the HTML5 canvas element.
</canvas>
