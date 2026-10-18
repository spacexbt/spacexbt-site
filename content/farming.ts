import { parseFarms, yearMonthSchema, type Farm } from "./schema";

export const farmingUpdatedAt: string = yearMonthSchema.parse("2026-10");

export const farms: Farm[] = parseFarms([
  {
    name: "Metric",
    url: "https://docs.metric.xyz",
    chains: ["Ethereum", "BNB Chain", "Robinhood Chain"],
    status: "active",
    logo: "/farms/metric.png",
    logoMono: true,
    referral: "https://app.metric.xyz/r/code",
    note: "DEX for active pools: oracle-guided and PropAMM liquidity.",
    since: "2026-10",
  },
]);
