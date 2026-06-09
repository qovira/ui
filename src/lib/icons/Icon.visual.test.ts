import { expect, test } from "vitest";
import { render } from "vitest-browser-svelte";
import { setTheme } from "@qovira/theme/runtime";
import { PlusIcon } from "phosphor-svelte";
import Icon from "./Icon.svelte";

// Visual regression for Icon in both themes — confirms currentColor inheritance
// (espresso on cream / cream on espresso) at the locked 24px size. Reference
// shots are generated in the deterministic CI environment (Blacksmith) and not
// committed from local dev, where fonts/anti-aliasing differ (see .gitignore).
test.each(["evening", "daylight"] as const)("Icon — %s theme", async (theme) => {
  setTheme(theme);

  const screen = render(Icon, {
    props: { icon: PlusIcon, label: "Add item", size: 24 },
  });

  await expect
    .element(screen.getByRole("img", { name: "Add item" }))
    .toMatchScreenshot(`icon-${theme}`, {
      screenshotOptions: {
        // Freeze any CSS animation/transition so diffs are stable.
        animations: "disabled",
      },
    });
});
