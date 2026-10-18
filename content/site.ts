import { parseSite } from "@/content/schema";

export const site = parseSite({
  handle: "spacexbt",
  title: "spacexbt",
  tagline:
    "Self-taught dev. Onchain research. Building with Claude Code and Kimi.",
  description:
    "Projects, tools and airdrop farms by spacexbt, a self-taught developer and onchain researcher.",
  url: "https://spacexbt.vercel.app", // replace when a custom domain exists
  links: {
    x: "https://x.com/spacexbt",
    telegram: "https://t.me/spaceinsights",
    telegramDm: "https://t.me/highvolume",
    github: "https://github.com/spacexbt",
  },
  buildsWith: ["Claude Code", "Kimi"],
});
