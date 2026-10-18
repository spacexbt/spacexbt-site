import { describe, expect, it } from "vitest";
import {
  FIXTURE_ADDRESSES,
  findLeaks,
  parseDenylist,
} from "../scripts/privacy-scan.mjs";

describe("parseDenylist", () => {
  it("trims lines and drops blanks and comments", () => {
    expect(parseDenylist("# comment\n\n Alice \nBerlin\n")).toEqual([
      "Alice",
      "Berlin",
    ]);
  });
});

describe("findLeaks", () => {
  it("matches terms case-insensitively and reports the term", () => {
    const hits = findLeaks("hello ALICE from berlin", ["alice", "Berlin"]);
    expect(hits).toContain("alice");
    expect(hits).toContain("Berlin");
  });

  it("reports wallet addresses truncated", () => {
    expect(findLeaks("addr 0x" + "ab12".repeat(10), [])).toEqual([
      "wallet 0xab12...ab12",
    ]);
  });

  it("ignores the allowlisted fixture address case-insensitively", () => {
    expect(FIXTURE_ADDRESSES).toHaveLength(1);
    const fixture = FIXTURE_ADDRESSES[0];
    expect(findLeaks(`addr ${fixture}`, [])).toEqual([]);
    expect(findLeaks(`addr ${fixture.toLowerCase()}`, [])).toEqual([]);
  });

  it("still matches denylist terms inside the fixture address line", () => {
    const fixture = FIXTURE_ADDRESSES[0];
    expect(findLeaks(`secret ${fixture}`, ["secret"])).toEqual(["secret"]);
  });

  it("ignores 64-hex tx hashes", () => {
    expect(findLeaks("tx hash 0x" + "a".repeat(64), [])).toEqual([]);
  });

  it("returns nothing for clean text", () => {
    expect(findLeaks("clean text", ["alice"])).toEqual([]);
  });
});
