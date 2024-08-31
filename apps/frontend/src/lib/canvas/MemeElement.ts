import type MemeCanvasController from "./MemeCanvasController";
import MathHelper from "$lib/math";

/* eslint-disable unused-imports/no-unused-vars -- Events lol */

export interface Filterable<T extends readonly ValidOptionTypes[]> {
    valid: T;
    current: this["valid"][number];
}

export interface ExtendedString {
    value: string;
    multiline?: boolean;
}

export interface ImageSource {
    src: string;
    isFile: boolean;
}

export type ValidOptionTypes = string | number | boolean | Filterable<any> | ExtendedString | ImageSource;
export type ValidateOptions<T> = keyof T extends ValidOptionTypes ? T : never;
export type Settings<T extends Record<string, ValidOptionTypes> = Record<string, ValidOptionTypes>> = {
    [K in keyof T]: T[K];
};

export const RESIZE_HANDLE_SIZE = 16;

export const enum MemeElementHandle {
    TOP_LEFT = 0,
    TOP_RIGHT = 1,
    BOTTOM_LEFT = 2,
    BOTTOM_RIGHT = 3,
}

abstract class MemeElement<T extends Settings = Settings> {
    public x: number = 0;
    public y: number = 0;

    private offsetX: number = 0;
    private offsetY: number = 0;

    private handle: MemeElementHandle | null = null;

    private _width: number = 0;
    private _height: number = 0;

    public rotation: number = 0;

    public locked: boolean = false;

    protected ctx: CanvasRenderingContext2D;

    constructor(
        public controller: MemeCanvasController,
        public settings: T,
    ) {
        this.ctx = controller.ctx;
    }

    public created(): void {};
    public draw(): void {};

    public getMinWidth(): number {
        return 20;
    }

    public getMinHeight(): number {
        return 20;
    }

    // Events
    public onPress(x: number, y: number): void {}
    public onRelease(x: number, y: number): void {}
    public onDoubleClick(x: number, y: number): void {}
    public onKeyTyped(key: string, ctrl: boolean, shift: boolean): void {}
    public onChanged(isSetting: boolean, key: keyof T): void {}

    // Element manipulation
    public prepareDrag(x: number, y: number): void {
        this.offsetX = Math.round(x - this.x);
        this.offsetY = Math.round(y - this.y);
    }

    public drag(x: number, y: number): void {
        if (this.locked)
            return;

        this.x = MathHelper.clamp(Math.round(x - this.offsetX), 0, this.ctx.canvas.width - this.width);
        this.y = MathHelper.clamp(Math.round(y - this.offsetY), 0, this.ctx.canvas.height - this.height);
    }

    public prepareResize(handle: MemeElementHandle | null, x: number, y: number): void {
        this.offsetX = Math.round(x - this.x);
        this.offsetY = Math.round(y - this.y);
        this.handle = handle;
    }

    public resize(mouseX: number, mouseY: number): void {
        if (this.locked)
            return;

        const x = Math.round(mouseX);
        const y = Math.round(mouseY);

        switch (this.handle) {
            case MemeElementHandle.TOP_LEFT: {
                const newX = Math.round(x - this.offsetX);
                const newY = Math.round(y - this.offsetY);

                const newWidth = this.x + this.width - newX;
                const newHeight = this.y + this.height - newY;

                if (newWidth >= this.getMinWidth()) {
                    this.width = newWidth;
                    this.x = newX;
                }

                if (newHeight >= this.getMinHeight()) {
                    this.height = newHeight;
                    this.y = newY;
                }

                break;
            }

            case MemeElementHandle.TOP_RIGHT: {
                const newY = Math.round(y - this.offsetY);

                const newWidth = x - this.x;
                const newHeight = this.y + this.height - newY;

                if (newWidth >= this.getMinWidth())
                    this.width = newWidth;

                if (newHeight >= this.getMinHeight()) {
                    this.height = newHeight;
                    this.y = newY;
                }

                break;
            }

            case MemeElementHandle.BOTTOM_LEFT: {
                const newX = Math.round(x - this.offsetX);

                const newWidth = this.x + this.width - newX;
                const newHeight = y - this.y;

                if (newWidth >= this.getMinWidth()) {
                    this.width = newWidth;
                    this.x = newX;
                }

                if (newHeight >= this.getMinHeight())
                    this.height = newHeight;

                break;
            }

            case MemeElementHandle.BOTTOM_RIGHT: {
                const newWidth = x - this.x;
                const newHeight = y - this.y;

                if (newWidth >= this.getMinWidth())
                    this.width = newWidth;

                if (newHeight >= this.getMinHeight())
                    this.height = newHeight;

                break;
            }
        }
    }

    // Helpers
    public getCommonProperties(): Record<string, ValidOptionTypes> {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            rotation: this.rotation,
            locked: this.locked,
        };
    }

    public handleAt(x: number, y: number): MemeElementHandle | null {
        return MemeElement.handleAt(this, x, y);
    }

    public intersects(x: number, y: number): boolean {
        return MemeElement.intersects(this, x, y);
    }

    public intersectsInside(x: number, y: number, width: number, height: number): boolean {
        return MemeElement.intersectsInside(this, x, y, width, height);
    }

    public static handleAt(element: MemeElement, x: number, y: number): MemeElementHandle | null {
        if (x >= element.x && x <= element.x + RESIZE_HANDLE_SIZE && y >= element.y && y <= element.y + RESIZE_HANDLE_SIZE)
            return MemeElementHandle.TOP_LEFT;

        else if (x >= element.x + element.width - RESIZE_HANDLE_SIZE && x <= element.x + element.width && y >= element.y && y <= element.y + RESIZE_HANDLE_SIZE)
            return MemeElementHandle.TOP_RIGHT;

        else if (x >= element.x && x <= element.x + RESIZE_HANDLE_SIZE && y >= element.y + element.height - RESIZE_HANDLE_SIZE && y <= element.y + element.height)
            return MemeElementHandle.BOTTOM_LEFT;

        else if (x >= element.x + element.width - RESIZE_HANDLE_SIZE && x <= element.x + element.width && y >= element.y + element.height - RESIZE_HANDLE_SIZE && y <= element.y + element.height)
            return MemeElementHandle.BOTTOM_RIGHT;

        return null;
    }

    public static intersects(element: MemeElement, x: number, y: number): boolean {
        return x >= element.x && x <= element.x + element.width && y >= element.y && y <= element.y + element.height;
    }

    public static intersectsInside(element: MemeElement, x: number, y: number, width: number, height: number): boolean {
        return x <= element.x + element.width && x + width >= element.x && y <= element.y + element.height && y + height >= element.y;
    }

    // Getters and Setters
    public get width(): number {
        return Math.max(this._width, this.getMinWidth(), 20);
    }

    public set width(value: number) {
        this._width = value;
    }

    public get height(): number {
        return Math.max(this._height, this.getMinHeight(), 20);
    }

    public set height(value: number) {
        this._height = value;
    }
};

export type MemeElementConstructor = new (controller: MemeCanvasController) => MemeElement;

export default MemeElement;
