import MathHelper from "../utils/math";
import type MemeCanvasController from "./MemeCanvasController";

type UnregisterCallbacks = () => void;
export default function registerCallbacks(controller: MemeCanvasController): UnregisterCallbacks {
    function mouseEvent(event: MouseEvent, fn: (x: number, y: number) => void) {
        if (event.button !== 0)
            return;

        controller.requestFrame();

        const rect = controller.canvas.getBoundingClientRect();
        const x = MathHelper.clamp(event.clientX - rect.left, 0, controller.canvas.width);
        const y = MathHelper.clamp(event.clientY - rect.top, 0, controller.canvas.height);

        fn.call(controller, x, y);
    }

    const callbacks = {
        dblclick: (e: MouseEvent) => mouseEvent(e, controller.onDoubleClick),
        press: (e: MouseEvent) => mouseEvent(e, controller.onPress),
        release: (e: MouseEvent) => mouseEvent(e, controller.onRelease),
        mousemove: (e: MouseEvent) => mouseEvent(e, (x, y) => {
            controller.mouseX = x;
            controller.mouseY = y;

            if (controller.dragging === true || controller.resizing === true)
                controller.onDrag(x, y);
        }),

        keydown: (e: KeyboardEvent) => {
            controller.holdingShift = e.shiftKey;
            controller.holdingCtrl = e.ctrlKey;
        },

        keyup: (e: KeyboardEvent) => {
            controller.holdingShift = e.shiftKey;
            controller.holdingCtrl = e.ctrlKey;
        },
    };

    controller.canvas.addEventListener("dblclick", callbacks.dblclick);
    controller.canvas.addEventListener("mousedown", callbacks.press);
    document.addEventListener("mouseup", callbacks.release);
    document.addEventListener("mousemove", callbacks.mousemove);
    document.addEventListener("keydown", callbacks.keydown);
    document.addEventListener("keyup", callbacks.keyup);

    return () => {
        controller.canvas.removeEventListener("dblclick", callbacks.dblclick);
        controller.canvas.removeEventListener("mousedown", callbacks.press);
        document.removeEventListener("mouseup", callbacks.release);
        document.removeEventListener("mousemove", callbacks.mousemove);
        document.removeEventListener("keydown", callbacks.keydown);
        document.removeEventListener("keyup", callbacks.keyup);
    };
}
