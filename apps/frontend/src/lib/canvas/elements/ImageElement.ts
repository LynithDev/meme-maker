import type MemeCanvasController from "../MemeCanvasController";
import MemeElement, { type ImageSource, type ValidateOptions } from "../MemeElement";

type ImageElementSettings = ValidateOptions<{
    image: ImageSource;
}>;

class ImageElement extends MemeElement<ImageElementSettings> {
    private image: HTMLImageElement = new Image();

    constructor(controller: MemeCanvasController) {
        super(controller, {
            image: {
                src: "",
                isFile: false,
            },
        });
    }

    public override draw(): void {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    public override onSettingChanged(key: "image"): void {
        if (key === "image")
            this.image.src = this.settings.image.src;
    }
}

export default ImageElement;
