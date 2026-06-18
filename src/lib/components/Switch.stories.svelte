<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, userEvent } from "storybook/test";
  import Switch from "./Switch.svelte";
  import Field from "./Field.svelte";

  const { Story } = defineMeta({
    title: "Forms/Switch",
    component: Switch,
    tags: ["autodocs"],
  });
</script>

<script lang="ts">
  let checked = $state(false);
  let switchFieldChecked = $state(false);
  let switchFieldError = $state<string | undefined>("This setting needs review.");
</script>

<!-- bind:checked round-trips; the switch is the rounded-full exception. -->
<Story
  name="Bind"
  play={async ({ canvas }) => {
    const sw = canvas.getByRole("switch", { name: "Email notifications" });
    await expect(sw).not.toBeChecked();
    await expect(sw).toHaveClass("rounded-full");
    await expect(sw).toHaveClass("focus-ring");
    await userEvent.click(sw);
    await expect(sw).toBeChecked();
    await userEvent.click(canvas.getByRole("button", { name: "Reset" }));
    await expect(sw).not.toBeChecked();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-col items-start gap-3 p-6">
      <label class="inline-flex items-center gap-2 text-body font-sans text-fg">
        <Switch bind:checked />Email notifications
      </label>
      <button type="button" class="text-small font-sans text-link" onclick={() => (checked = false)}> Reset </button>
    </div>
  {/snippet}
</Story>

<!-- Inside a Field, the switch inherits the a11y contract without prop-drilling.
     Toggling the switch on constitutes a valid action — it clears the error. -->
<Story
  name="In a field"
  play={async ({ canvas }) => {
    const sw = canvas.getByRole("switch", { name: "Autoplay" });
    // Initial state: invalid wiring is present.
    await expect(sw).toHaveAttribute("aria-invalid", "true");
    const message = canvas.getByText("This setting needs review.");
    await expect(sw).toHaveAttribute("aria-describedby", message.id);
    // Toggling the switch on satisfies the field — error clears.
    await userEvent.click(sw);
    await expect(sw).not.toHaveAttribute("aria-invalid", "true");
    await expect(canvas.queryByText("This setting needs review.")).not.toBeInTheDocument();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Field label="Autoplay" {...switchFieldError ? { error: switchFieldError } : {}}>
        <Switch
          bind:checked={switchFieldChecked}
          onCheckedChange={(v) => {
            switchFieldChecked = v;
            switchFieldError = switchFieldChecked ? undefined : "This setting needs review.";
          }}
        />
      </Field>
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-col items-start gap-3 p-6">
      <label class="inline-flex items-center gap-2 text-body font-sans text-fg">
        <Switch checked />On
      </label>
      <label class="inline-flex items-center gap-2 text-body font-sans text-fg">
        <Switch />Off
      </label>
    </div>
  {/snippet}
</Story>

<!-- TDD geometry guard: renders one unchecked and one controlled-checked switch with no toggling/waiting,
     so transition timing cannot affect the result. getBoundingClientRect measures the actual rendered gap
     between the thumb edge and the near track edge in both states; they must be equal within 0.6px.
     This story FAILS with translate-x-5 (right gap ~4px vs left gap ~2px) and PASSES after translate-x-5.5. -->
<Story
  name="Thumb padding symmetry"
  play={async ({ canvas }) => {
    const off = canvas.getByRole("switch", { name: "Off" });
    const on = canvas.getByRole("switch", { name: "On" });

    const offTrack = off.getBoundingClientRect();
    const offThumb = off.querySelector("[data-switch-thumb]") as HTMLElement;
    const onTrack = on.getBoundingClientRect();
    const onThumb = on.querySelector("[data-switch-thumb]") as HTMLElement;

    const offThumbRect = offThumb.getBoundingClientRect();
    const onThumbRect = onThumb.getBoundingClientRect();

    // Left gap: distance from the track's left inner edge (adjusted for border) to the thumb's left edge.
    // Right gap: distance from the thumb's right edge to the track's right inner edge (adjusted for border).
    // Both border widths cancel if we use the track bounding box directly — border is 1px each side,
    // but we compare gap-to-gap so the relative asymmetry is what matters; 1px border offsets both sides equally.
    const leftGap = offThumbRect.left - offTrack.left;
    const rightGap = onTrack.right - onThumbRect.right;

    await expect(Math.abs(leftGap - rightGap)).toBeLessThan(0.6);
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-col items-start gap-3 p-6">
      <label class="inline-flex items-center gap-2 text-body font-sans text-fg">
        <Switch />Off
      </label>
      <label class="inline-flex items-center gap-2 text-body font-sans text-fg">
        <Switch checked />On
      </label>
    </div>
  {/snippet}
</Story>

<!-- TDD guard: assert the :enabled-gated hover classes are present on the root element. Static Tailwind
     classes are always in the rendered class attribute, so classList checks are the reliable signal here.
     These assertions must FAIL before the hover classes are added and PASS after. -->
<Story
  name="Hover classes"
  play={async ({ canvas }) => {
    const off = canvas.getByRole("switch", { name: "Off" });
    const on = canvas.getByRole("switch", { name: "On" });

    // Unchecked: border lights to accent on hover when enabled.
    await expect(off).toHaveClass("enabled:data-[state=unchecked]:hover:border-accent");

    // Checked (filled): accent deepens to honey-600 on hover (fill + border) when enabled.
    await expect(on).toHaveClass("enabled:data-[state=checked]:hover:bg-honey-600");
    await expect(on).toHaveClass("enabled:data-[state=checked]:hover:border-honey-600");

    // The :enabled gate is verified at the CSS-selector level (compiled CSS grep) not in the DOM
    // class attribute — Tailwind always emits the class token; :enabled is part of the CSS rule
    // selector, not the token name, so a disabled element still has the token but the rule won't fire.
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-col items-start gap-3 p-6">
      <label class="inline-flex items-center gap-2 text-body font-sans text-fg">
        <Switch />Off
      </label>
      <label class="inline-flex items-center gap-2 text-body font-sans text-fg">
        <Switch checked />On
      </label>
      <label class="inline-flex items-center gap-2 text-body font-sans text-fg">
        <Switch disabled />Disabled
      </label>
    </div>
  {/snippet}
</Story>
