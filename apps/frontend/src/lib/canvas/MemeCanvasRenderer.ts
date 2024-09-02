import type MemeCanvasController from "./MemeCanvasController";
import type MemeElement from "./MemeElement";
import { RESIZE_HANDLE_SIZE } from "./MemeElement";

class MemeCanvasRenderer {
    private ctx: CanvasRenderingContext2D;

    constructor(
        private controller: MemeCanvasController,
    ) {
        this.ctx = controller.ctx;
    }

    public draw() {
        this.drawBackground();

        this.drawElements();
        this.drawSelectionBox();

        this.drawFramerate();
    }

    private drawElements() {
        for (const element of this.controller.elements) {
            this.ctx.save();
            element.draw();
            this.ctx.restore();

            if (!this.controller.exporting && this.controller.selectedElements.includes(element)) {
                // Draw border around the element
                this.ctx.save();
                this.ctx.strokeStyle = "black";
                this.ctx.lineWidth = 1;
                this.ctx.setLineDash([5, 2]);
                this.ctx.strokeRect(element.x, element.y, element.width, element.height);
                this.ctx.restore();

                if (!element.locked && this.controller.holdingCtrl === false && this.controller.selectedElements.length === 1) {
                    // Draw resize handles around the element
                    this.ctx.fillStyle = this.controller.holdingShift ? "#50f050" : "#f05050";
                    this.ctx.fillRect(element.x, element.y, RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE);
                    this.ctx.fillRect(element.x + element.width - RESIZE_HANDLE_SIZE, element.y, RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE);
                    this.ctx.fillRect(element.x, element.y + element.height - RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE);
                    this.ctx.fillRect(element.x + element.width - RESIZE_HANDLE_SIZE, element.y + element.height - RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE, RESIZE_HANDLE_SIZE);
                }
            }
        }
    }

    private drawBackground() {
        const image = this.controller.image;

        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        if (image !== null)
            this.ctx.drawImage(image, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    private drawFramerate() {
        if (this.controller.debug && !this.controller.exporting) {
            this.ctx.font = "16px sans-serif";
            const text = `${this.controller.fps.toFixed(2)} fps`;

            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 2;
            this.ctx.strokeText(text, 4, 16);

            this.ctx.fillStyle = "white";
            this.ctx.fillText(text, 4, 16);
        }
    }

    private drawSelectionBox() {
        if (this.controller.exporting || !this.controller.selecting)
            return;

        const newX = Math.min(this.controller.offsetX, this.controller.mouseX);
        const newY = Math.min(this.controller.offsetY, this.controller.mouseY);
        const newWidth = Math.abs(this.controller.offsetX - this.controller.mouseX);
        const newHeight = Math.abs(this.controller.offsetY - this.controller.mouseY);

        this.ctx.save();
        this.ctx.strokeStyle = "#f05050C8";
        this.ctx.fillStyle = "#f0505080";
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 2]);
        this.ctx.beginPath();
        this.ctx.roundRect(newX, newY, newWidth, newHeight, 5);
        this.ctx.stroke();
        this.ctx.fill();

        this.ctx.restore();
    }
}

export default MemeCanvasRenderer;
