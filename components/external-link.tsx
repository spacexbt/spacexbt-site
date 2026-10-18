import type { ReactNode } from "react";

type Props = {
  href: string;
  className?: string;
  "aria-label"?: string;
  children: ReactNode;
};

export function ExternalLink({ href, className, children, ...rest }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...rest}
    >
      {children}
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}
