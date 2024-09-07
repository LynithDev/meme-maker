import MemeCanvasRenderer from "./MemeCanvasRenderer";
import type MemeElement from "./MemeElement";
import type { MemeElementConstructor, MemeElementHandle, ValidOptionTypes } from "./MemeElement";
import registerCallbacks from "./registerCallbacks";
import MathHelper from "$lib/utils/math";

export interface EventCallbacks {
    selectedElementsChange: unknown;
    elementsUpdated: unknown;
    elementsListChanged: unknown;
    imageChange: unknown;
    inputFocusRequest: {
        inputName: string;
    };
}

export type Events = keyof EventCallbacks;

class MemeCanvasController {
    // DOM
    private _image: HTMLImageElement | null = null;
    private _canvas: HTMLCanvasElement | null = null;

    // Canvas
    public padding = {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    };

    // Renderer
    private _fps: number = 0;
    private _lastTimeRendered: number = 0;
    private _renderer: MemeCanvasRenderer | null = null;
    public exporting: boolean = false;
    public debug: boolean = location.search.includes("dbg");

    // Elements
    public selectedElements: MemeElement[] = [];
    private _elements: MemeElement[] = [];

    // Mouse pos
    public offsetX: number = Number.NaN;
    public offsetY: number = Number.NaN;
    public mouseX: number = Number.NaN;
    public mouseY: number = Number.NaN;

    // User action state
    public dragging: boolean = false;
    public selecting: boolean = false;
    public resizing: boolean = false;

    // Interaction state
    public holdingShift: boolean = false;
    public holdingCtrl: boolean = false;
    public isTouch: boolean = false;

    // Events
    private _events: {
        [K in Events]: ((e: EventCallbacks[K]) => void)[];
    } = {
            elementsUpdated: [],
            selectedElementsChange: [],
            elementsListChanged: [],
            imageChange: [],
            inputFocusRequest: [],
        };

    public init(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx)
            throw new Error("Canvas context not found");

        this._canvas = canvas;
        this._renderer = new MemeCanvasRenderer(this, ctx);

        const unregister = registerCallbacks(this);
        this.requestFrame();

        return unregister;
    }

    // Events
    public listen<K extends Events>(event: K, cb: (e: EventCallbacks[K]) => void) {
        this._events[event].push(cb);
    }

    public emit<K extends Events>(event: K, args: EventCallbacks[K] = {} as EventCallbacks[K]) {
        this._events[event].forEach(cb => cb(args));
    }

    // Export
    public export(type: "png" | "jpeg" | "webp") {
        this.exporting = true;
        this.requestFrame(() => {
            this.canvas.toBlob((blob) => {
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `meme.${type}`;
                    a.click();
                }

                this.exporting = false;
                this.requestFrame();
            }, `image/${type}`);
        });
    }

    // Listeners
    public onPress(x: number, y: number) {
        this.offsetX = x;
        this.offsetY = y;

        if (this.selectedElements.length === 1) {
            const element = this.selectedElements[0]!;
            const handle = element.handleAt(x, y);

            if (handle !== null) {
                this.startResize(element, handle, x, y);
                return;
            }
        }

        const foundElement = this.elementAt(x, y);

        if (foundElement) {
            const alreadySelected = this.selectedElements.length >= 1 && this.selectedElements.includes(foundElement);

            if (this.holdingShift === true) {
                if (this.selectedElements.includes(foundElement)) {
                    const index = this.selectedElements.indexOf(foundElement);
                    this.selectedElements.splice(index, 1);
                }
                else {
                    this.selectedElements.push(foundElement);
                }

                this.emit("selectedElementsChange");
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
            this.emit("selectedElementsChange");
            this.startDrag(foundElement, x, y);
            foundElement.onPress(x, y);
            return;
        }

        this.startSelectionBox(x, y);
    }

    public onRelease(x: number, y: number) {
        if (this.dragging || this.resizing)
            this.emit("elementsUpdated");

        this.dragging = false;
        this.resizing = false;

        if (this.selecting === true) {
            this.selecting = false;
            this.selectAllElementsInArea(this.offsetX, this.offsetY, x - this.offsetX, y - this.offsetY);
        }

        this.selectedElements.forEach(e => e.onRelease(x, y));
    }

    public onDrag(x: number, y: number) {
        if (this.selectedElements.length === 1)
            this.resizeElement(this.selectedElements[0]!, x, y);

        this.selectedElements.forEach((e) => {
            this.dragElement(e, x, y);
        });
    }

    public onDoubleClick(x: number, y: number) {
        this.elementAt(x, y)?.onDoubleClick(x, y);
    }

    // Element control
    private startResize(element: MemeElement | null, handle: MemeElementHandle | null, x: number, y: number) {
        if (element === null || handle === null)
            return;

        this.resizing = true;
        element.prepareHandle(handle, x, y);
    }

    private resizeElement(element: MemeElement | null, x: number, y: number) {
        if (this.resizing !== true || !element)
            return;

        element.handleInteraction(x, y);
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

    public updateElement<T extends Record<string, ValidOptionTypes>, K extends keyof T>(element: MemeElement<T>, key: K, value: T[K]) {
        if (Object.prototype.hasOwnProperty.call(element.settings, key)) {
            element.settings[key] = value;
            element.onChanged(true, key);
        }
        else {
            const includes = Object.prototype.hasOwnProperty.call(element, key) || Object.prototype.hasOwnProperty.call(element, `_${key.toString()}`);

            if (includes) {
                (element as any)[key] = value;
                element.onChanged(true, key);
            }
        }

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
        this.emit("selectedElementsChange");
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

    public clearSelected() {
        this.selectedElements = [];
        this.emit("selectedElementsChange");
    }

    public clear() {
        this.clearSelected();
        this._elements = [];
        this.emit("elementsListChanged");
    }

    public removeElement(element: MemeElement) {
        const index = this._elements.indexOf(element);
        if (index > -1) {
            this._elements.splice(index, 1);
            this.emit("elementsListChanged");
        }
    }

    public removeElements(elements: MemeElement[]) {
        this.clearSelected();

        let deleted: boolean = false;
        elements.forEach((e) => {
            const index = this._elements.indexOf(e);
            if (index > -1) {
                this._elements.splice(index, 1);
                deleted = true;
            }
        });

        if (deleted)
            this.emit("elementsListChanged");
    }

    public createElement(Element: MemeElementConstructor) {
        const instance = new Element(this);

        instance.created();
        instance.x = Math.round((this.canvas.width / 2) - (instance.width / 2));
        instance.y = Math.round((this.canvas.height / 2) - (instance.height / 2));

        this._elements.push(instance);
        this.emit("elementsListChanged");

        this.selectedElements = [instance];
        this.emit("selectedElementsChange");
    }

    public changeImage(image: HTMLImageElement) {
        this._image = image;
        this.padding = {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
        };

        this.clear();
        this.resize(image.width, image.height);
        this.emit("imageChange");
    }

    public changePadding(padding: typeof this.padding) {
        const newWidth = (this.image?.width || this.canvas.width) + padding.left + padding.right;
        const newHeight = (this.image?.height || this.canvas.height) + padding.top + padding.bottom;

        this.padding = padding;

        this.resize(newWidth, newHeight);
    }

    public resize(width: number, height: number) {
        if (width === height) {
            this.canvas.width = width;
            this.canvas.height = height;
        }
        else {
            const aspectRatio = width / height;
            const canvasWidth = width;

            this.canvas.width = canvasWidth;

            const newHeight = Math.round(canvasWidth / aspectRatio);
            this.canvas.height = newHeight;
        }

        const scaled = MathHelper.clamp(this.canvas.width * 1.5, 300, 500);
        this.canvas.style.width = `${scaled}px`;
        this.requestFrame();
    }

    public requestFrame(cb: (() => void) | undefined = undefined) {
        requestAnimationFrame((timestamp) => {
            const deltaTime = timestamp - this._lastTimeRendered;
            if (deltaTime > 0)
                this._fps = 1000 / deltaTime;

            this._renderer?.draw();

            this._lastTimeRendered = timestamp;

            cb?.();
        });
    }

    // Getteres
    public get canvas(): HTMLCanvasElement {
        if (!this._canvas)
            throw new Error("Canvas not found");

        return this._canvas;
    }

    public get image() {
        return this._image;
    }

    public get renderer() {
        return this._renderer!;
    }

    public get fps() {
        return this._fps;
    }

    public get elements() {
        return this._elements;
    }
}

export default MemeCanvasController;
