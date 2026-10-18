import { ImageResponse } from "next/og";
import { loadFonts } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const { mono } = await loadFonts();
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0B0B0C",
        color: "#EDEDED",
        fontFamily: "Geist Mono",
        fontSize: 124,
        fontWeight: 500,
        paddingBottom: 12,
      }}
    >
      s
    </div>,
    {
      ...size,
      fonts: [{ name: "Geist Mono", data: mono, weight: 500, style: "normal" }],
    },
  );
}
