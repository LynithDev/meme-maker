export const pageThemes = ["light", "system", "dark"] as const;
export type PageTheme = typeof pageThemes[number];

export type ThemeChangeEvent = CustomEvent<{ theme: PageTheme }>;
function emitThemeUpdated(theme: PageTheme) {
    const event: ThemeChangeEvent = new CustomEvent("themeUpdated", {
        detail: {
            theme,
        },
    });

    window.dispatchEvent(event);
}

declare global {
    interface WindowEventMap {
        themeUpdated: ThemeChangeEvent;
    }
}

function applyTheme(theme: PageTheme) {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
}

export function getTheme(): PageTheme {
    const theme = localStorage.getItem("theme");
    if (pageThemes.includes(theme as PageTheme))
        return theme as PageTheme;

    return "system";
}

function getVisualTheme(theme: PageTheme = getTheme()): PageTheme {
    if (theme === "system")
        if (window.matchMedia("(prefers-color-scheme: dark)").matches)
            return "dark";
        else
            return "light";

    return theme;
}

export function setTheme(theme: PageTheme) {
    localStorage.setItem("theme", theme);
    applyTheme(getVisualTheme(theme));
    emitThemeUpdated(theme);
}

export default {
    getTheme,
    setTheme,
};
