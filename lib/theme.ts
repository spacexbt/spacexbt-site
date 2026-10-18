export type ThemeName = "light" | "dark" | "system";

const NEXT: Record<ThemeName, ThemeName> = {
  light: "dark",
  dark: "system",
  system: "light",
};

export function nextTheme(current: string | undefined): ThemeName {
  return current === "light" || current === "dark" || current === "system"
    ? NEXT[current]
    : "light";
}
