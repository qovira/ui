import type { Preview } from "@storybook/sveltekit";
import { setTheme } from "@qovira/theme/runtime";
import ThemeWrapper from "./ThemeWrapper.svelte";
// Loads Tailwind + the @qovira/theme tokens/fonts into the preview (and the
// Vitest browser test pass via the setup file), so stories render with the
// real theme build — the same pipeline a consumer uses.
import "../src/app.css";

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    // House default: axe violations FAIL the test run, not just warn in the panel.
    a11y: { test: "error" },
  },

  // Evening is Qovira's signature look and the default; the toolbar flips to Daylight.
  initialGlobals: { theme: "evening" },
  globalTypes: {
    theme: {
      description: "Qovira theme",
      toolbar: {
        title: "Theme",
        icon: "contrast",
        items: [
          { value: "evening", title: "Evening" },
          { value: "daylight", title: "Daylight" },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    // Apply the selected theme per story block. `setTheme` keeps <html data-theme>
    // in sync so the Canvas iframe chrome stays themed and the live toolbar switch
    // keeps working there. The ThemeWrapper div is what makes each Docs block theme
    // independently — the Docs page shares one document, so <html> alone clobbers:
    // the last story block to mount wins. With a per-block [data-theme] wrapper each
    // block resolves the semantic custom properties from its own attribute via CSS
    // inheritance, regardless of what <html data-theme> is set to.
    (story, context) => {
      const theme = context.globals["theme"] === "daylight" ? "daylight" : "evening";
      setTheme(theme);
      return { Component: ThemeWrapper, props: { theme } };
    },
  ],
};

export default preview;
