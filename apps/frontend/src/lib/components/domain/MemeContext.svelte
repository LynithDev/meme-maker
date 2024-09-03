<script lang="ts">
    import app from "../../app";
    import MemeCanvasController from "../../canvas/MemeCanvasController";

    const controller = new MemeCanvasController();
    app.controller.set(controller);

    export function init(canvas: HTMLCanvasElement, cb: (controller: MemeCanvasController) => void) {
        const unregister = controller.init(canvas);
        cb(controller);
        return unregister;
    }
</script>

<slot />
