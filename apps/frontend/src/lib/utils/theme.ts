export const pageThemes = ["light", "dark", "system"] as const;
export type PageTheme = typeof pageThemes[number];

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
}

export default {
    getTheme,
    setTheme,
};
