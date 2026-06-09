import { expect, test } from "vitest";
import { render } from "vitest-browser-svelte";
import { setTheme } from "@qovira/theme/runtime";
import Box from "./Box.svelte";

// Visual regression for the smoke component in both themes. Reference shots are
// generated in the deterministic CI environment (Blacksmith) and not committed
// from local dev, where fonts/anti-aliasing differ (see .gitignore).
test.each(["evening", "daylight"] as const)("Box surface — %s theme", async (theme) => {
  setTheme(theme);

  const screen = render(Box, { props: { "data-testid": "box", class: "h-24 w-64" } });

  await expect.element(screen.getByTestId("box")).toMatchScreenshot(`box-${theme}`, {
    screenshotOptions: {
      // Freeze CSS animations/transitions so diffs are stable (the theme also
      // honors prefers-reduced-motion globally). Mask volatile regions via
      // `mask: [locator]` here when a component has any.
      animations: "disabled",
    },
  });
});
