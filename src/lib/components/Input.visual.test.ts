import { expect, test } from "vitest";
import { render } from "vitest-browser-svelte";
import { setTheme } from "@qovira/theme/runtime";
import Input from "./Input.svelte";

// Visual regression for the Input recipe in both themes and both validities —
// the warm raised fill + hairline border (valid) and the red border that
// reinforces aria-invalid (invalid). Reference shots are generated in CI
// (Blacksmith), not committed from local dev (see .gitignore).
const cases = [
  ["evening", false],
  ["daylight", false],
  ["evening", true],
  ["daylight", true],
] as const;

test.each(cases)("Input — %s theme, invalid=%s", async (theme, invalid) => {
  setTheme(theme);

  const screen = render(Input, {
    props: {
      placeholder: "you@example.com",
      value: invalid ? "nope" : "",
      "aria-invalid": invalid ? "true" : undefined,
    },
  });

  await expect
    .element(screen.getByRole("textbox"))
    .toMatchScreenshot(`input-${theme}-${invalid ? "invalid" : "valid"}`, {
      screenshotOptions: { animations: "disabled" },
    });
});
