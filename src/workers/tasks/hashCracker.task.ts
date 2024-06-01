import crypto from "crypto";

const characters = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

function generateCombinations(length: number): string[] {
  const combinations: string[] = [];

  function generate(current: string, depth: number) {
    if (depth === length) {
      combinations.push(current);
      return;
    }

    for (let i = 0; i < characters.length; i++) {
      generate(current + characters[i], depth + 1);
    }
  }

  generate("", 0);
  return combinations;
}

export function crackHash(targetHash: string): string {
  const combinations = generateCombinations(5);
  for (const combination of combinations) {
    const hash = crypto.createHash("sha256").update(combination).digest("hex");
    if (hash === targetHash) {
      return combination;
    }
  }

  return "not found";
}
