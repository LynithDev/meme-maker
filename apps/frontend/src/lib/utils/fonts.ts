const fontMap = {
    "Arial": {},
    "Comic Sans": {},
    "Impact": {},
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
