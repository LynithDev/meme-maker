import type MemeCanvasController from "./MemeCanvasController";
import MathHelper from "$lib/utils/math";
import { scaled } from "$lib/utils/canvas";

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
}

export type ValidOptionTypes = string | number | boolean | Filterable<any> | ExtendedString | ImageSource;
export type ValidateOptions<T> = keyof T extends ValidOptionTypes ? T : never;
export type Settings<T extends Record<string, ValidOptionTypes> = Record<string, ValidOptionTypes>> = {
    [K in keyof T]: T[K];
};

export const enum MemeElementHandle {
    TOP_LEFT = 0,
    TOP_RIGHT = 1,
    BOTTOM_LEFT = 2,
    BOTTOM_RIGHT = 3,
    ROTATION_HANDLE = 4,
}

export const getHandleSize = (controller: MemeCanvasController) => scaled(controller.canvas, controller.isTouch ? 17 : 12);
export const getRotationHandleSize = (controller: MemeCanvasController) => scaled(controller.canvas, controller.isTouch ? 25 : 20);

export function getHandlePos(element: MemeElement, handle: MemeElementHandle) {
    const size = getHandleSize(element.controller);
    const offset = size / 2;

    switch (handle) {
        case MemeElementHandle.TOP_LEFT:
            return {
                x: element.x - offset,
                y: element.y - offset,
            };

        case MemeElementHandle.TOP_RIGHT:
            return {
                x: element.x + element.width - size + offset,
                y: element.y - offset,
            };

        case MemeElementHandle.BOTTOM_LEFT:
            return {
                x: element.x - offset,
                y: element.y + element.height - size + offset,
            };

        case MemeElementHandle.BOTTOM_RIGHT:
            return {
                x: element.x + element.width - size + offset,
                y: element.y + element.height - size + offset,
            };

        case MemeElementHandle.ROTATION_HANDLE:
            return {
                x: element.x + element.width / 2 - getRotationHandleSize(element.controller) / 2,
                y: element.y - getRotationHandleSize(element.controller) * 1.5,
            };
    }
}

abstract class MemeElement<T extends Settings = Settings> {
    public x: number = 0;
    public y: number = 0;

    private offsetX: number = 0;
    private offsetY: number = 0;

    private handle: MemeElementHandle | null = null;

    private _width: number = 0;
    private _height: number = 0;

    // Degrees
    public rotation: number = 0;

    public locked: boolean = false;

    protected get ctx(): CanvasRenderingContext2D {
        return this.controller.renderer.ctx;
    }

    constructor(
        public controller: MemeCanvasController,
        public settings: T,
    ) {}

    public created(): void {};
    public draw(): void {};

    public getMinSize() {
        return {
            width: scaled(this.ctx.canvas, 20),
            height: scaled(this.ctx.canvas, 20),
        };
    }

    public getMinWidth(): number {
        return this.getMinSize().width;
    }

    public getMinHeight(): number {
        return this.getMinSize().height;
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

    public prepareHandle(handle: MemeElementHandle | null, x: number, y: number): void {
        this.offsetX = Math.round(x - this.x);
        this.offsetY = Math.round(y - this.y);
        this.handle = handle;
    }

    public handleInteraction(mouseX: number, mouseY: number): void {
        if (this.locked)
            return;

        const x = Math.round(mouseX);
        const y = Math.round(mouseY);

        switch (this.handle) {
            case MemeElementHandle.ROTATION_HANDLE: {
                const centerX = this.x + this.width / 2;
                const centerY = this.y + this.height / 2;

                const angle = Math.atan2(y - centerY, x - centerX) * 180 / Math.PI;
                this.rotation = Math.round(angle) + 90;
                break;
            }

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
        const handles = [
            MemeElementHandle.TOP_LEFT,
            MemeElementHandle.TOP_RIGHT,
            MemeElementHandle.BOTTOM_LEFT,
            MemeElementHandle.BOTTOM_RIGHT,
            MemeElementHandle.ROTATION_HANDLE,
        ];

        for (const handle of handles) {
            const { x: handleX, y: handleY } = getHandlePos(element, handle);
            const size = handle === MemeElementHandle.ROTATION_HANDLE ? getRotationHandleSize(element.controller) : getHandleSize(element.controller);

            if (x >= handleX && x <= handleX + size && y >= handleY && y <= handleY + size)
                return handle;
        }

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
