import type MemeCanvasController from "./MemeCanvasController";
import MathHelper from "$lib/math";

/* eslint-disable unused-imports/no-unused-vars -- Events lol */

export const RESIZE_HANDLE_SIZE = 8;

export const enum MemeElementHandle {
    TOP_LEFT = 0,
    TOP_RIGHT = 1,
    BOTTOM_LEFT = 2,
    BOTTOM_RIGHT = 3,
}

export function setting<K extends keyof MappedSettingTypes, T extends SettingType<K>>(type: K, setting: Setting<T>) {
    return function (target: MemeElement, key: string): void {
        console.log(target, key);
    };
}

abstract class MemeElement<T extends Settings = any> {
    private _settings: SettingsList<T>;

    @setting("numeric", {
        name: "X",
        value: 0,
    })
    public x: number;

    public y: number = 0;

    private _offsetX: number = 0;
    private _offsetY: number = 0;

    private _handle: MemeElementHandle | null = null;

    private _width: number = 0;
    private _height: number = 0;

    public rotation: number = 0;

    public draggable: boolean = true;

    public resizable: boolean = true;
    public rotatable: boolean = true;
    public locked: boolean = false;

    protected ctx: CanvasRenderingContext2D;

    constructor(
        public controller: MemeCanvasController,
        settings: SettingsList<T>,
    ) {
        this.ctx = controller.ctx;
        this._settings = settings;
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
    public onSettingChanged(key: keyof T): void {}

    // Element manipulation
    public prepareDrag(x: number, y: number): void {
        this._offsetX = Math.round(x - this.x);
        this._offsetY = Math.round(y - this.y);
    }

    public drag(x: number, y: number): void {
        this.x = MathHelper.clamp(Math.round(x - this._offsetX), 0, this.ctx.canvas.width - this.width);
        this.y = MathHelper.clamp(Math.round(y - this._offsetY), 0, this.ctx.canvas.height - this.height);
    }

    public prepareResize(handle: MemeElementHandle | null, x: number, y: number): void {
        this._offsetX = Math.round(x - this.x);
        this._offsetY = Math.round(y - this.y);
        this._handle = handle;
    }

    public resize(x: number, y: number): void {
        // TODO: Implement aspect ratio locking
        // const lockRatio = this.controller.holdingShift;

        switch (this._handle) {
            case MemeElementHandle.TOP_LEFT: {
                const newX = Math.round(x - this._offsetX);
                const newY = Math.round(y - this._offsetY);

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
                const newX = this.x;
                const newY = Math.round(y - this._offsetY);

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
                const newX = Math.round(x - this._offsetX);
                const newY = this.y;

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

    public updateSetting<K extends keyof T>(key: K, value: T[K]): void {
        this._settings[key].value = value;
        this.onSettingChanged(key);
    }

    public getSetting<K extends keyof T>(key: K): T[K] {
        return this._settings[key].value;
    }
};

export type MemeElementConstructor = new (controller: MemeCanvasController) => MemeElement;

export default MemeElement;
