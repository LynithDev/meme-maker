import MemeElement, { type ExtendedString, type Filterable, type ValidateOptions } from "../MemeElement";
import type MemeCanvasController from "../MemeCanvasController";
import { lineBreakedText } from "$lib/utils/canvas";

export const HTextAlignment = ["left", "center", "right"] as const;
export const VTextAlignment = ["top", "center", "bottom"] as const;

export type TextElementSettings = ValidateOptions<{
    text: ExtendedString;
    font_family: string;
    font_size: number;
    color: string;
    horizontal_align: Filterable<typeof HTextAlignment>;
    vertical_align: Filterable<typeof VTextAlignment>;
}>;

class TextElement extends MemeElement<TextElementSettings> {
    private _splitText: string[] = [];

    constructor(controller: MemeCanvasController) {
        const rect = controller.canvas.getBoundingClientRect();
        const canvasRatio = controller.canvas.width / rect.width;
        const fontSize = 32 * canvasRatio;

        super(controller, {
            text: {
                multiline: true,
                value: "Text",
            },
            font_family: "sans-serif",
            font_size: fontSize,
            color: "black",
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
        this.ctx.fillStyle = this.settings.color;

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

    public override getMinWidth(): number {
        this.ctx.font = this.buildFont();
        return Math.round(lineBreakedText.getWidth(this.ctx, this._splitText));
    }

    public override getMinHeight(): number {
        this.ctx.font = this.buildFont();
        return Math.round(this._splitText.length * lineBreakedText.getHeight(this.ctx));
    }

    public buildFont(): string {
        return `${this.settings.font_size}px ${this.settings.font_family}`;
    }
}

export default TextElement;
