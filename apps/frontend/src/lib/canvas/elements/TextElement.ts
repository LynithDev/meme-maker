import type MemeCanvasController from "../MemeCanvasController";
import { lineBreakedText, scaled } from "$lib/utils/canvas";
import MathHelper from "$lib/utils/math";
import MemeElement, { type ExtendedString, type Filterable, type ValidateOptions } from "../MemeElement";

export const HTextAlignment = ["left", "center", "right"] as const;
export const VTextAlignment = ["top", "center", "bottom"] as const;

export type TextElementSettings = ValidateOptions<{
    text: ExtendedString;
    font_family: string;
    font_size: number;
    color: string;
    stroke: string;
    stroke_width: number;
    horizontal_align: Filterable<typeof HTextAlignment>;
    vertical_align: Filterable<typeof VTextAlignment>;
}>;

class TextElement extends MemeElement<TextElementSettings> {
    private _splitText: string[] = [];

    constructor(controller: MemeCanvasController) {
        const fontSize = scaled(controller.canvas, 32);

        super(controller, {
            text: {
                multiline: true,
                value: "Text",
            },
            font_family: "sans-serif",
            font_size: fontSize,
            color: "white",
            stroke: "black",
            stroke_width: scaled(controller.canvas, 3),
            horizontal_align: {
                valid: HTextAlignment,
                current: "center",
            },
            vertical_align: {
                valid: VTextAlignment,
                current: "center",
            },
        });

        this.updateText();
    }

    private updateText() {
        this._splitText = this.settings.text.value.split("\n");
    }

    public override draw(): void {
        this.ctx.font = this.buildFont();
        this.ctx.fillStyle = this.settings.color.replaceAll("none", "transparent");
        this.ctx.strokeStyle = this.settings.stroke.replaceAll("none", "transparent");
        this.ctx.lineWidth = this.settings.stroke_width;

        lineBreakedText.draw(
            this.ctx,
            this._splitText,
            this.x,
            this.y,
            {
                alignment: this.settings.horizontal_align.current,
                width: this.width,
            },
            {
                alignment: this.settings.vertical_align.current,
                height: this.height,
            },
        );
    }

    public override onDoubleClick(): void {
        this.controller.selectedElements = [this];
        this.controller.emit("inputFocusRequest", {
            inputName: "text",
        });
    }

    public override onChanged(isSetting: boolean, key: keyof TextElementSettings): void {
        if (isSetting)
            switch (key) {
                case "text":
                    this.updateText();
                    break;

                case "font_size": {
                    const newWidth = this.getMinWidth();
                    if (this.width < newWidth)
                        this.width = newWidth;

                    const newHeight = this.getMinHeight();
                    if (this.height < newHeight)
                        this.height = newHeight;

                    break;
                }
            }
    }

    public override getMinSize() {
        this.ctx.font = this.buildFont();
        const width = Math.round(lineBreakedText.getWidth(this.ctx, this._splitText));
        const height = Math.round(this._splitText.length * lineBreakedText.getHeight(this.ctx));

        const size = {
            width: Math.round(MathHelper.sizeOfRotatedRect(width, height, (this.rotation - 90) * Math.PI / 180).width),
            height: Math.round(MathHelper.sizeOfRotatedRect(width, height, (this.rotation - 90) * Math.PI / 180).height),
        };

        return size;
    }

    public buildFont(): string {
        return `${this.settings.font_size}px ${this.settings.font_family}`;
    }
}

export default TextElement;
