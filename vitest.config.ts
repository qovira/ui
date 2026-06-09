import path from "node:path";
import { fileURLToPath } from "node:url";
import { playwright } from "@vitest/browser-playwright";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // Hygiene the house mandates (writing-vitest §House Conventions).
      globals: false,
      clearMocks: true,
      restoreMocks: true,
      unstubAllEnvs: true,
      unstubAllGlobals: true,
      coverage: {
        provider: "v8",
        reporter: ["text", "html"],
        include: ["src/lib/**"],
        exclude: ["src/lib/**/*.stories.*", "src/lib/**/*.d.ts"],
      },
      projects: [
        // Runes/logic (*.svelte.test.ts with flushSync/$effect.root) and pure
        // helpers (*.test.ts). Component render tests outside a story use
        // vitest-browser-svelte; story tests live in the `storybook` project.
        {
          extends: true,
          test: {
            name: "unit",
            environment: "jsdom",
            include: ["src/**/*.{test,svelte.test}.ts"],
            exclude: ["src/**/*.visual.test.ts"],
          },
        },
        // Visual regression in a real browser: *.visual.test.ts render a
        // component and pixel-diff it with `toMatchScreenshot` (both themes,
        // reduced motion). Reference shots are generated in CI (Blacksmith),
        // never committed from local dev — see .gitignore.
        {
          extends: true,
          test: {
            name: "visual",
            include: ["src/**/*.visual.test.ts"],
            setupFiles: ["./.storybook/vitest-browser.setup.ts"],
            browser: {
              enabled: true,
              headless: true,
              provider: playwright(),
              instances: [{ browser: "chromium" }],
            },
          },
        },
        // Every story → a Vitest Browser-Mode test: it renders in a real
        // browser and its `play` function is the assertion; axe runs via the
        // setup file's a11y annotations.
        {
          extends: true,
          plugins: [storybookTest({ configDir: path.join(dirname, ".storybook") })],
          test: {
            name: "storybook",
            setupFiles: ["./.storybook/vitest.setup.ts"],
            browser: {
              enabled: true,
              headless: true,
              provider: playwright(),
              instances: [{ browser: "chromium" }],
            },
          },
        },
      ],
    },
  }),
);
