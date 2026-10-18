"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { navItems } from "@/components/nav";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const Icon = open ? X : Menu;

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted hover:text-text"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon size={18} aria-hidden="true" />
      </button>
      <nav
        id={panelId}
        aria-label="Primary"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-border bg-bg"
      >
        <ul className="mx-auto flex max-w-[720px] flex-col px-5 py-2 sm:px-6">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="block py-3 font-mono text-sm uppercase text-muted hover:text-text"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
