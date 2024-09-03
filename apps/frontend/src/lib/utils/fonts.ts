const fontMap = {
    "Arial": {},
    "Comic Sans": {
        src: "https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap",
    },
    "Impact": {
        src: "https://fonts.googleapis.com/css2?family=Impact&display=swap",
    },
    "Times New Roman": {},
    "Verdana": {},
    "Courier New": {},
    "Georgia": {},
    "System Default": {
        alias: "sans-serif",
    },
} as const;

export type Font = keyof typeof fontMap;

export const suggestedFonts: Font[] = ["Arial", "Comic Sans", "Impact"];

export const getFont = (name: Font) => fontMap[name];

// TODO: Better font loading
export async function initSourcedFonts() {
    for (const font of Object.keys(fontMap) as Font[])
        if ("src" in fontMap[font]) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = fontMap[font].src as string;
            document.head.appendChild(link);
        }
}
