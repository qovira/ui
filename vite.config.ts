import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { sveltePhosphorOptimize } from "phosphor-svelte/vite";
import { defineConfig } from "vite";

export default defineConfig({
  // sveltePhosphorOptimize rewrites barrel imports (`{ PlusIcon } from
  // "phosphor-svelte"`) to direct sub-path `.svelte` imports. This keeps the
  // icons compiled by vite-plugin-svelte on the project's single Svelte runtime
  // (a prebundled phosphor-svelte would mix two runtimes and crash on render),
  // and avoids the consumer fetching the whole icon barrel. `enforce: "post"`
  // runs it AFTER Svelte/TS compilation, so it parses emitted JS — not raw
  // `.svelte`/`.ts` source, which its JS parser would choke on.
  plugins: [{ ...sveltePhosphorOptimize(), enforce: "post" as const }, tailwindcss(), sveltekit()],
});
