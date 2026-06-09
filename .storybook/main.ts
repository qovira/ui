import type { StorybookConfig } from "@storybook/sveltekit";

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
};

export default config;
