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
        // Floors below current (≈98/81/97/97) with headroom for noise, so new
        // behaviour-bearing logic shipped without a test fails CI (`--coverage`)
        // rather than rotting uncovered. Ratchet up as coverage rises.
        thresholds: {
          statements: 90,
          branches: 75,
          functions: 90,
          lines: 90,
        },
      },
      projects: [
        // Runes/logic (*.svelte.test.ts with flushSync/$effect.root) and pure
        // helpers (*.test.ts). Component render/interaction tests live in the
        // `storybook` project (stories run as Browser-Mode tests).
        {
          extends: true,
          test: {
            name: "unit",
            environment: "jsdom",
            include: ["src/**/*.{test,svelte.test}.ts"],
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
