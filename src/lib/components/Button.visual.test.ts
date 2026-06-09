import { createRawSnippet } from "svelte";
import { expect, test } from "vitest";
import { render } from "vitest-browser-svelte";
import { setTheme } from "@qovira/theme/runtime";
import Button from "./Button.svelte";

// Visual regression for the signature `primary` Button in both themes — it's a
// load-bearing recipe (espresso fill on cream / honey fill on espresso). Other
// variants and states are exercised functionally by the story `play` tests.
// Reference shots are generated in the deterministic CI environment (Blacksmith),
// not committed from local dev where fonts/anti-aliasing differ (see .gitignore).
const label = createRawSnippet(() => ({ render: () => `<span>Save changes</span>` }));

test.each(["evening", "daylight"] as const)("Button — %s theme", async (theme) => {
  setTheme(theme);

  const screen = render(Button, {
    props: { variant: "primary", children: label },
  });

  await expect
    .element(screen.getByRole("button", { name: "Save changes" }))
    .toMatchScreenshot(`button-primary-${theme}`, {
      screenshotOptions: {
        // Freeze the transition so diffs are stable.
        animations: "disabled",
      },
    });
});
