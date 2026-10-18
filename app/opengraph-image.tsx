import { site } from "@/content/site";
import { OG_SIZE, renderOg } from "@/lib/og";

export const alt = "spacexbt";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    title: site.title,
    subtitle: site.tagline,
    footer: "x.com/spacexbt",
  });
}
