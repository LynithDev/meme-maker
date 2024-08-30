import MemeCanvasRenderer from "./MemeCanvasRenderer";
import type MemeElement from "./MemeElement";
import type { MemeElementConstructor, MemeElementHandle, MemeElementOptions, ValidOptionTypes } from "./MemeElement";
import MathHelper from "$lib/math";
import { getRecommendedCanvasWidth } from "$lib/device";

class MemeCanvasController {
    private _ctx: CanvasRenderingContext2D;
    private _image: HTMLImageElement | null = null;
    private _elements: MemeElement[] = [];

    // Renderer related variables
    private _fps: number = 0;
    private _lastTimeRendered: number = 0;
    private _renderer: MemeCanvasRenderer;

    // Mouse pos
    public offsetX: number = Number.NaN;
    public offsetY: number = Number.NaN;
    public mouseX: number = Number.NaN;
    public mouseY: number = Number.NaN;

    public selectedElements: MemeElement[] = [];
    public running: boolean = false;

    public dragging: boolean = false;
    public selecting: boolean = false;
    public resizing: boolean = false;

    public holdingShift: boolean = false;
    public holdingCtrl: boolean = false;

    public onSelectedElementsChange: (elements: MemeElement[]) => void = () => {};

    constructor(
        private canvas: HTMLCanvasElement,
    ) {
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx)
            throw new Error("Canvas context not found");

        this._ctx = ctx;
        this._renderer = new MemeCanvasRenderer(this);

        this.canvas.addEventListener("dblclick", e => this.mouseEvent(e, this.onDoubleClick));
        this.canvas.addEventListener("mousedown", e => this.mouseEvent(e, this.onPress));
        document.addEventListener("mouseup", e => this.mouseEvent(e, this.onRelease));

        document.addEventListener("mousemove", e => this.mouseEvent(e, (x, y) => {
            this.mouseX = x;
            this.mouseY = y;

            if (this.dragging === true || this.resizing === true)
                this.onDrag(x, y);
        }));

        document.addEventListener("keydown", (e) => {
            this.holdingShift = e.shiftKey;
        });

        document.addEventListener("keyup", (e) => {
            this.holdingShift = e.shiftKey;
        });
    }

    // Listeners
    private mouseEvent(event: MouseEvent, fn: (x: number, y: number) => void) {
        if (event.button !== 0)
            return;

        this.requestFrame();

        const rect = this.canvas.getBoundingClientRect();
        const x = MathHelper.clamp(event.clientX - rect.left, 0, this.canvas.width);
        const y = MathHelper.clamp(event.clientY - rect.top, 0, this.canvas.height);

        fn.call(this, x, y);
    }

    private onPress(x: number, y: number) {
        this.offsetX = x;
        this.offsetY = y;

        const foundElement = this.elementAt(x, y);

        if (foundElement) {
            const alreadySelected = this.selectedElements.length >= 1 && this.selectedElements.includes(foundElement);

            if (alreadySelected) {
                const foundHandle = foundElement.handleAt(x, y);
                if (foundHandle !== null) {
                    this.startResize(foundElement, foundHandle, x, y);
                    return;
                }
            }

            if (this.holdingShift === true) {
                if (this.selectedElements.includes(foundElement)) {
                    const index = this.selectedElements.indexOf(foundElement);
                    this.selectedElements.splice(index, 1);
                    this.selectedElementsChanged();
                }
                else {
                    this.selectedElements.push(foundElement);
                    this.selectedElementsChanged();
                }

                return;
            }

            if (alreadySelected) {
                this.selectedElements.forEach((e) => {
                    this.startDrag(e, x, y);
                    e.onPress(x, y);
                });

                return;
            }

            this.selectedElements = [foundElement];
            this.selectedElementsChanged();
            this.startDrag(foundElement, x, y);
            foundElement.onPress(x, y);
            return;
        }

        this.startSelectionBox(x, y);
    }

    private onRelease(x: number, y: number) {
        this.dragging = false;
        this.resizing = false;
        if (this.selecting === true) {
            this.selecting = false;
            this.selectAllElementsInArea(this.offsetX, this.offsetY, x - this.offsetX, y - this.offsetY);
        }

        this.selectedElements.forEach(e => e.onRelease(x, y));
    }

    private onDrag(x: number, y: number) {
        this.selectedElements.forEach((e) => {
            this.dragElement(e, x, y);
            this.resizeElement(e, x, y);
        });
    }

    private onDoubleClick(x: number, y: number) {
        this.selectedElements.forEach(e => e.onDoubleClick(x, y));
    }

    // Element control
    private startResize(element: MemeElement | null, handle: MemeElementHandle | null, x: number, y: number) {
        if (element === null || handle === null)
            return;

        this.resizing = true;
        element.prepareResize(handle, x, y);
    }

    private resizeElement(element: MemeElement | null, x: number, y: number) {
        if (this.resizing !== true || !element)
            return;

        element.resize(x, y);
    }

    private startDrag(element: MemeElement | null, x: number, y: number) {
        if (!element)
            return;

        this.dragging = true;

        element.prepareDrag(x, y);
    }

    private dragElement(element: MemeElement | null, x: number, y: number) {
        if (this.dragging !== true || !element)
            return;

        element.drag(x, y);
    }

    public updateElementSetting<T extends Record<string, ValidOptionTypes>, K extends keyof T>(element: MemeElement<T>, key: K, value: T[K]) {
        element.settings[key] = value;
        this.requestFrame();
    }

    // Other
    private startSelectionBox(x: number, y: number) {
        if (this.dragging === true)
            return;

        this.offsetX = x;
        this.offsetY = y;

        this.selecting = true;
    }

    private selectAllElementsInArea(x: number, y: number, width: number, height: number) {
        const newX = Math.min(x, x + width);
        const newY = Math.min(y, y + height);
        const newWidth = Math.abs(width);
        const newHeight = Math.abs(height);

        this.selectedElements = this.elementsInside(newX, newY, newWidth, newHeight);
        this.selectedElementsChanged();
    }

    // Utility
    public elementAt(x: number, y: number): MemeElement | null {
        for (const element of this._elements)
            if (element.intersects(x, y))
                return element;

        return null;
    }

    public elementsInside(x: number, y: number, width: number, height: number): MemeElement[] {
        const inside: MemeElement[] = [];

        for (const element of this._elements)
            if (element.intersectsInside(x, y, width, height))
                inside.push(element);

        return inside;
    }

    public clear() {
        this._elements = [];
    }

    public removeElement(element: MemeElement) {
        const index = this._elements.indexOf(element);
        if (index > -1)
            this._elements.splice(index, 1);
    }

    public createElement(Element: MemeElementConstructor) {
        const instance = new Element(this);

        instance.created();
        instance.x = Math.round((this.canvas.width / 2) - (instance.width / 2));
        instance.y = Math.round((this.canvas.height / 2) - (instance.height / 2));

        this._elements.push(instance);
    }

    public changeImage(image: HTMLImageElement) {
        this._image = image;
        this.resize(image.width, image.height);
    }

    public resize(width: number, height: number) {
        if (width === height) {
            this.canvas.width = MathHelper.clamp(width, 50, getRecommendedCanvasWidth());
            this.canvas.height = MathHelper.clamp(height, 50, getRecommendedCanvasWidth());
        }
        else if (width > height) {
            if (width > getRecommendedCanvasWidth()) {
                this.canvas.width = getRecommendedCanvasWidth();
                this.canvas.height = Math.round(height * (getRecommendedCanvasWidth() / width));
            }
            else {
                this.canvas.width = width;
                this.canvas.height = height;
            }
        }
        else if (height > width) {
            if (height > getRecommendedCanvasWidth()) {
                this.canvas.height = getRecommendedCanvasWidth();
                this.canvas.width = Math.round(width * (getRecommendedCanvasWidth() / height));
            }
            else {
                this.canvas.width = width;
                this.canvas.height = height;
            }
        }
    }

    public selectedElementsChanged() {
        this.onSelectedElementsChange(this.selectedElements);
    }

    // Loop
    public startLoop() {
        if (this.running === true)
            return;

        this.running = true;
        this.requestFrame();
    }

    private requestFrame() {
        requestAnimationFrame(timestamp => this.renderLoop(timestamp));
    }

    private renderLoop(timestamp: number) {
        if (this.running !== true)
            return;

        const deltaTime = timestamp - this._lastTimeRendered;
        this._fps = 1000 / deltaTime;

        this._renderer.draw();

        this._lastTimeRendered = timestamp;
        // requestAnimationFrame(timestamp => this.renderLoop(timestamp));
    }

    public stopLoop() {
        this.running = false;
    }

    // Getteres
    public get ctx() {
        return this._ctx;
    }

    public get image() {
        return this._image;
    }

    public get renderer() {
        return this._renderer;
    }

    public get fps() {
        return this._fps;
    }

    public get elements() {
        return this._elements;
    }
}

export default MemeCanvasController;
