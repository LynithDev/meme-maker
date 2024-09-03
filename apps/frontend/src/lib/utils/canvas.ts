import type { HTextAlignment, VTextAlignment } from "../canvas/elements/TextElement";

export function drawLineBreakedText(
    ctx: CanvasRenderingContext2D,
    text: string[],
    x: number,
    y: number,
    hAlign?: {
        alignment: typeof HTextAlignment[number];
        width: number;
    },
    vAlign?: {
        alignment: typeof VTextAlignment[number];
        height: number;
    },
) {
    for (let i = 0; i < text.length; i++) {
        const line = text[i];
        if (!line)
            continue;

        let lineX = x;
        let lineY = y + ((i + 1) * getLineBreakedTextHeight(ctx));
        const textAlign = ctx.textAlign;

        if (hAlign) {
            ctx.textAlign = hAlign.alignment ?? "left";
            if (hAlign.alignment === "center")
                lineX += (hAlign.width / 2);
            else if (hAlign.alignment === "right")
                lineX += hAlign.width;
        }

        if (vAlign)
            if (vAlign.alignment === "center")
                lineY += (vAlign.height / 2) - (text.length * getLineBreakedTextHeight(ctx) / 2);
            else if (vAlign.alignment === "bottom")
                lineY += vAlign.height - (text.length * getLineBreakedTextHeight(ctx));

        ctx.fillText(line, lineX, lineY);

        if (hAlign)
            ctx.textAlign = textAlign;
    }
}

export function getLineBreakedTextHeight(
    ctx: CanvasRenderingContext2D,
) {
    const matches = ctx.font.split(" ")[0]?.match(/(\d+)/) ?? null;
    if (matches === null || matches.length < 2)
        return 0;

    const fontSize = Number.parseFloat(matches[1]!);
    if (Number.isNaN(fontSize))
        return 0;

    return fontSize;
}

export function getLineBreakedTextWidth(
    ctx: CanvasRenderingContext2D,
    text: string[],
) {
    let max = 0;

    for (const line of text) {
        const width = ctx.measureText(line).width;
        if (width > max)
            max = width;
    }

    return max;
}

export const lineBreakedText = {
    draw: drawLineBreakedText,
    getHeight: getLineBreakedTextHeight,
    getWidth: getLineBreakedTextWidth,
};

export function scaled(
    canvas: HTMLCanvasElement,
    value: number,
) {
    const rect = canvas.getBoundingClientRect();
    const canvasRatio = canvas.width / rect.width;
    return Math.round(value * canvasRatio);
}
