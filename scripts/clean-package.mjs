// Strip co-located stories and tests from the svelte-package output. They live
// next to components in `src/lib` (house convention), so svelte-package copies
// them into `dist/` — but none of them may ship in the published package.
import { readdir, rm } from "node:fs/promises";
import path from "node:path";

const DIST = "dist";
const STRIP = /\.(stories|test|spec)\./;

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (STRIP.test(entry.name)) {
      await rm(full);
      console.log(`stripped ${full}`);
    }
  }
}

await walk(DIST);
