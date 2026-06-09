import type { Preview } from "@storybook/sveltekit";
import { setTheme } from "@qovira/theme/runtime";
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
    // Apply the selected theme through @qovira/theme's own runtime (sets
    // `data-theme` on <html>), so every story renders in the chosen theme and
    // the toolbar switches between them live.
    (story, context) => {
      setTheme(context.globals["theme"] === "daylight" ? "daylight" : "evening");
      return story();
    },
  ],
};

export default preview;
