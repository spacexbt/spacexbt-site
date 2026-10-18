const WALLET = /\b0x[a-fA-F0-9]{40}\b/g;

/** EIP-55 documentation example used as a test fixture; not a real wallet. */
export const FIXTURE_ADDRESSES = ["0x52908400098527886E0F7030069857D2E4169EE7"];

const FIXTURE_SET = new Set(FIXTURE_ADDRESSES.map((a) => a.toLowerCase()));

/**
 * @param {string} text
 * @returns {string[]}
 */
export function parseDenylist(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "" && !line.startsWith("#"));
}

/**
 * @param {string} text
 * @param {string[]} terms
 * @returns {string[]}
 */
export function findLeaks(text, terms) {
  const lower = text.toLowerCase();
  const hits = terms.filter((term) => lower.includes(term.toLowerCase()));
  for (const match of text.matchAll(WALLET)) {
    if (FIXTURE_SET.has(match[0].toLowerCase())) continue;
    hits.push(`wallet ${match[0].slice(0, 6)}...${match[0].slice(-4)}`);
  }
  return hits;
}
