import { parseProjects, type Project } from "./schema";

export const projects: Project[] = parseProjects([
  {
    slug: "reddit-radar",
    name: "The Ticker Radar",
    summary:
      "A live front page of the stocks and crypto that Reddit and 4chan are talking about: mentions, buzz and sentiment across 15+ boards.",
    status: "live",
    tags: ["Stocks", "Crypto", "Sentiment", "Live data"],
    stack: ["Next.js", "TypeScript", "Turso", "Vercel"],
    links: {
      live: "https://www.reddit-radar.app",
    },
    image: "/projects/reddit-radar.png",
    featured: true,
    startedAt: "2026-10",
    body: `
The Ticker Radar (reddit-radar.app) tracks which tickers retail is discussing right now.

- Boards: r/wallstreetbets, r/stocks, r/investing, r/options, r/Daytrading, r/SPACs, r/CryptoCurrency, r/CryptoMarkets, r/SatoshiStreetBets, r/Bitcoin, 4chan /biz/ and more
- Time windows: 24H, 7D, 30D
- Watchlist and keyboard-driven search (⌘K, /)
- Data: mentions and Reddit sentiment via ApeWisdom, posts and mood via StockTwits, prices via Yahoo Finance and CoinGecko

Discussion volume, not financial advice.
`,
  },
]);
