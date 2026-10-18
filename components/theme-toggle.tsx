"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { nextTheme } from "@/lib/theme";

const subscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const base =
    "inline-flex h-9 w-9 items-center justify-center rounded-md text-muted hover:text-text";

  if (!mounted) {
    return <button type="button" aria-label="Toggle theme" className={base} />;
  }

  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  const next = nextTheme(theme);

  return (
    <button
      type="button"
      aria-label={`Switch to ${next} theme`}
      className={base}
      onClick={() => setTheme(next)}
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  );
}
