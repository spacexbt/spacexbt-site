import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 } as const;

const fontDir = path.join(process.cwd(), "node_modules/geist/dist/fonts");

type OgOptions = {
  title: string;
  subtitle: string;
  footer: string;
  badge?: string;
};

export async function loadFonts() {
  const [semiBold, regular, mono] = await Promise.all([
    readFile(path.join(fontDir, "geist-sans/Geist-SemiBold.ttf")),
    readFile(path.join(fontDir, "geist-sans/Geist-Regular.ttf")),
    readFile(path.join(fontDir, "geist-mono/GeistMono-Medium.ttf")),
  ]);
  return { semiBold, regular, mono };
}

export async function renderOg({ title, subtitle, footer, badge }: OgOptions) {
  const fonts = await loadFonts();
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0B0B0C",
        padding: 80,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        {badge ? (
          <div
            style={{
              display: "flex",
              fontFamily: "Geist Mono",
              fontSize: 26,
              color: "#8B8B92",
              letterSpacing: 2,
              marginBottom: 28,
            }}
          >
            {badge}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            fontFamily: "Geist Sans",
            fontWeight: 600,
            fontSize: 96,
            lineHeight: 1.05,
            color: "#EDEDED",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Geist Sans",
            fontWeight: 400,
            fontSize: 34,
            lineHeight: 1.35,
            color: "#8B8B92",
            marginTop: 28,
            maxWidth: 980,
          }}
        >
          {subtitle}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: "Geist Mono",
          fontSize: 28,
          color: "#8B8B92",
        }}
      >
        {footer}
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        {
          name: "Geist Sans",
          data: fonts.semiBold,
          weight: 600,
          style: "normal",
        },
        {
          name: "Geist Sans",
          data: fonts.regular,
          weight: 400,
          style: "normal",
        },
        { name: "Geist Mono", data: fonts.mono, weight: 500, style: "normal" },
      ],
    },
  );
}
