import { cpSync, rmSync, mkdirSync } from "node:fs";

const entries = [
  ["examples", "docs/public/examples"],
  ["dist", "docs/public/dist"],
] as const;

for (const [src, dest] of entries) {
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, { recursive: true });
}
