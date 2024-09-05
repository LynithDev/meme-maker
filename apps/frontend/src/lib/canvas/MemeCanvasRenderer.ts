import type MemeCanvasController from "./MemeCanvasController";
import type MemeElement from "./MemeElement";
import { getHandleSize } from "./MemeElement";
import { scaled } from "$lib/utils/canvas";

class MemeCanvasRenderer {
    constructor(
        public controller: MemeCanvasController,
        public ctx: CanvasRenderingContext2D,
    ) {}

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
                    const size = getHandleSize(this.ctx.canvas);

                    this.ctx.fillStyle = this.controller.holdingShift ? "#50f050" : "#f05050";
                    this.ctx.fillRect(element.x, element.y, size, size);
                    this.ctx.fillRect(element.x + element.width - size, element.y, size, size);
                    this.ctx.fillRect(element.x, element.y + element.height - size, size, size);
                    this.ctx.fillRect(element.x + element.width - size, element.y + element.height - size, size, size);
                }
            }
        }
    }

    private drawBackground() {
        const image = this.controller.image;

        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        if (image !== null)
            this.ctx.drawImage(
                image,
                this.controller.padding.left,
                this.controller.padding.top,
                this.ctx.canvas.width - this.controller.padding.right - this.controller.padding.left,
                this.ctx.canvas.height - this.controller.padding.bottom - this.controller.padding.top,
            );
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
