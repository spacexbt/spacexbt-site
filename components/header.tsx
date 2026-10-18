import Link from "next/link";
import { ExternalLink } from "@/components/external-link";
import { XIcon } from "@/components/icons/x";
import { MobileMenu } from "@/components/mobile-menu";
import { navItems } from "@/components/nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/content/site";

export function Header() {
  return (
    <header className="header-border sticky top-0 z-40 border-b bg-bg/85 backdrop-blur">
      <div className="relative mx-auto flex h-16 max-w-[960px] items-center justify-between px-5 sm:px-6">
        <Link href="/#top" className="font-mono text-sm font-medium text-text">
          {site.handle}
        </Link>
        <div className="flex items-center gap-1">
          <nav
            aria-label="Primary"
            className="hidden items-center gap-6 pr-3 md:flex"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="link-grow text-sm text-muted hover:text-text"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <ThemeToggle />
          <ExternalLink
            href={site.links.x}
            aria-label={`${site.handle} on X (opens in new tab)`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted hover:text-text"
          >
            <XIcon className="h-[18px] w-[18px]" />
          </ExternalLink>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
