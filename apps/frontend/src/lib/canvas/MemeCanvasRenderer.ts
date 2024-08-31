import type MemeCanvasController from "./MemeCanvasController";
import type MemeElement from "./MemeElement";
import { RESIZE_HANDLE_SIZE } from "./MemeElement";

class MemeCanvasRenderer {
    private _ctx: CanvasRenderingContext2D;

    constructor(
        private _controller: MemeCanvasController,
    ) {
        this._ctx = _controller.ctx;
    }

    public draw() {
        this.drawBackground();

        this._ctx.save();
        this.drawElements();
        this._ctx.restore();

        this._ctx.save();
        this.drawSelectionBox();
        this._ctx.restore();

        this.drawFramerate();
    }

    private drawElements() {
        for (const element of this._controller.elements) {
            element.draw();

            if (this._controller.selectedElements.includes(element)) {
                // Draw border around the element
                this.drawSelectedElement(element);

                if (this._controller.holdingCtrl === false && this._controller.selectedElements.length === 1) {
                    // Draw resize handles around the element
                    this._ctx.fillStyle = this._controller.holdingShift ? "#50f050" : "#f05050";
                    this._ctx.fillRect(element.x, element.y, RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE);
                    this._ctx.fillRect(element.x + element.width - RESIZE_HANDLE_SIZE, element.y, RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE);
                    this._ctx.fillRect(element.x, element.y + element.height - RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE);
                    this._ctx.fillRect(element.x + element.width - RESIZE_HANDLE_SIZE, element.y + element.height - RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE);
                }
            }
        }
    }

    private drawSelectedElement(element: MemeElement) {
        this._ctx.strokeStyle = "black";
        this._ctx.lineWidth = 1;
        this._ctx.setLineDash([5, 2]);
        this._ctx.strokeRect(element.x, element.y, element.width, element.height);
    }

    private drawBackground() {
        const image = this._controller.image;

        this._ctx.fillStyle = "white";
        this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);

        if (image !== null)
            this._ctx.drawImage(image, 0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
    }

    private drawFramerate() {
        this._ctx.font = "16px sans-serif";
        const text = `${this._controller.fps.toFixed(2)} fps`;

        this._ctx.strokeStyle = "black";
        this._ctx.lineWidth = 2;
        this._ctx.strokeText(text, 4, 16);

        this._ctx.fillStyle = "white";
        this._ctx.fillText(text, 4, 16);
    }

    private drawSelectionBox() {
        if (this._controller.selecting !== true)
            return;

        const newX = Math.min(this._controller.offsetX, this._controller.mouseX);
        const newY = Math.min(this._controller.offsetY, this._controller.mouseY);
        const newWidth = Math.abs(this._controller.offsetX - this._controller.mouseX);
        const newHeight = Math.abs(this._controller.offsetY - this._controller.mouseY);

        this._ctx.strokeStyle = "#f05050C8";
        this._ctx.lineWidth = 1;
        this._ctx.setLineDash([5, 2]);
        this._ctx.strokeRect(newX, newY, newWidth, newHeight);

        this._ctx.fillStyle = "#f0505080";
        this._ctx.fillRect(newX, newY, newWidth, newHeight);
    }
}

export default MemeCanvasRenderer;
