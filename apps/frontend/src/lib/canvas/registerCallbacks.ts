import type MemeCanvasController from "./MemeCanvasController";
import MathHelper from "../utils/math";

type UnregisterCallbacks = () => void;
type MouseEventSourceCapabilities = MouseEvent & {
    sourceCapabilities?: {
        firesTouchEvents?: boolean;
    };
};

export default function registerCallbacks(controller: MemeCanvasController): UnregisterCallbacks {
    function mouseEvent(event: MouseEventSourceCapabilities, fn: (x: number, y: number) => void) {
        if (event.sourceCapabilities?.firesTouchEvents === true)
            return;

        if (event.button !== 0)
            return;

        controller.requestFrame();

        const rect = controller.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const scale = controller.canvas.width / rect.width;
        const x = MathHelper.clamp(Math.round(mouseX * scale), 0, controller.canvas.width);
        const y = MathHelper.clamp(Math.round(mouseY * scale), 0, controller.canvas.height);

        controller.isTouch = false;

        fn.call(controller, x, y);
    }

    function touchEvent(event: TouchEvent, fn: (x: number, y: number) => void) {
        if (event.changedTouches.length === 0)
            return;

        controller.requestFrame();

        const touch = event.touches[0] || event.changedTouches[0];
        if (touch === undefined)
            return;

        if (event.cancelable !== true)
            return;

        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
        const rect = controller.canvas.getBoundingClientRect();
        const mouseX = touch.clientX - rect.left;
        const mouseY = touch.clientY - rect.top;

        const scale = controller.canvas.width / rect.width;
        const x = MathHelper.clamp(Math.round(mouseX * scale), 0, controller.canvas.width);
        const y = MathHelper.clamp(Math.round(mouseY * scale), 0, controller.canvas.height);

        controller.isTouch = true;

        controller.mouseX = x;
        controller.mouseY = y;

        fn.call(controller, x, y);
    }

    const callbacks = {
        dblclick: (e: MouseEvent) => mouseEvent(e, controller.onDoubleClick),

        touch: (e: TouchEvent) => touchEvent(e, controller.onPress),
        touchrelease: (e: TouchEvent) => touchEvent(e, controller.onRelease),
        touchmove: (e: TouchEvent) => touchEvent(e, (x, y) => {
            if (controller.dragging === true || controller.resizing === true)
                controller.onDrag(x, y);
        }),

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

    controller.canvas.addEventListener("touchstart", callbacks.touch);
    controller.canvas.addEventListener("touchend", callbacks.touchrelease);
    controller.canvas.addEventListener("touchmove", callbacks.touchmove);

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
