import type { StorybookConfig } from "@storybook/sveltekit";
import { mergeConfig } from "vite";
import { sveltePhosphorOptimize } from "phosphor-svelte/vite";

const config: StorybookConfig = {
  framework: "@storybook/sveltekit",
  // Matches Svelte CSF (.stories.svelte) and CSF 3 (.stories.ts), co-located with components.
  stories: ["../src/**/*.stories.@(svelte|ts)"],
  addons: [
    "@storybook/addon-svelte-csf", // indexes *.stories.svelte (Svelte CSF)
    "@storybook/addon-docs", // autodocs / MDX
    "@storybook/addon-a11y", // axe, enforced in the test pass (see preview.ts)
    "@storybook/addon-vitest", // runs every story as a Vitest Browser-Mode test
  ],
  // Same phosphor-svelte fix as vite.config.ts: rewrite barrel imports to direct
  // sub-path .svelte imports so icons compile on the one Svelte runtime. Without
  // this, Storybook's dep optimizer prebundles phosphor-svelte against a second
  // runtime and every <Icon> story crashes on render. `enforce: "post"` runs it
  // after Svelte/TS compilation so it parses emitted JS, not raw source.
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      plugins: [{ ...sveltePhosphorOptimize(), enforce: "post" as const }],
      // Keep phosphor's .svelte icons OUT of the dep optimizer so vite-plugin-svelte
      // compiles them on the project's Svelte (a prebundled copy ships a second
      // runtime → cross-runtime crash on render), and dedupe Svelte for good measure.
      optimizeDeps: { exclude: ["phosphor-svelte"] },
      resolve: { dedupe: ["svelte"] },
    }),
};

export default config;
