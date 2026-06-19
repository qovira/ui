<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Spinner from "./Spinner.svelte";

  type Args = ComponentProps<typeof Spinner>;

  const { Story } = defineMeta({
    title: "Feedback/Spinner",
    component: Spinner,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures below hardcode their own props and ignore these.
    args: { size: "md", label: "Loading…", showLabel: false, tone: "accent", decorative: false },
    argTypes: {
      size: { control: "inline-radio", options: ["sm", "md", "lg"] },
      label: { control: "text" },
      showLabel: { control: "boolean" },
      tone: { control: "inline-radio", options: ["accent", "current"] },
      decorative: { control: "boolean" },
    },
    parameters: { controls: { include: ["size", "label", "showLabel", "tone", "decorative"] } },
  });
</script>

<!-- Controls playground: spreads `args`, so editing a control live-updates the preview. The fixtures below hardcode
their props for deterministic tests, so their Controls panel is inert. Drives size, label, showLabel, tone, and the
decorative flag. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div class="bg-surface text-fg p-10">
      <Spinner {...args} />
    </div>
  {/snippet}
</Story>

<!-- The signature lamp-glow loader, now with accent-colored radiating rings (ripple) that read clearly against both
     Daylight (cream) and Evening (espresso) backgrounds. Meaning isn't trapped in motion: role="status" announces
     accessible text (visually hidden by default) and the glow/rings are aria-hidden. Under prefers-reduced-motion the
     rings are hidden (display: none) for a clean static dot. -->
<Story
  name="Loading"
  play={async ({ canvas }) => {
    // AC: role="status" with accessible text.
    const status = canvas.getByRole("status");
    await expect(status).toHaveTextContent("Loading…");

    // AC: the dot is present and aria-hidden (meaning not trapped in motion).
    const dot = status.querySelector(".spinner-dot");
    await expect(dot).toBeInTheDocument();
    await expect(dot).toHaveAttribute("aria-hidden", "true");

    // AC: the ripple ring is wired — the ::before pseudo-element carries a non-none animationName, proving the
    // `spinner-ripple` keyframe is applied in a real Chromium rendering context.
    const dotEl = dot as HTMLElement;
    const beforeStyle = getComputedStyle(dotEl, "::before");
    await expect(beforeStyle.animationName).not.toBe("none");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-10">
      <Spinner />
    </div>
  {/snippet}
</Story>

<!-- A custom message, shown beside the glow. -->
<Story
  name="With label"
  play={async ({ canvas }) => {
    await expect(canvas.getByRole("status")).toHaveTextContent("Reaching your model…");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-10">
      <Spinner label="Reaching your model…" showLabel />
    </div>
  {/snippet}
</Story>

<Story name="Sizes">
  {#snippet template()}
    <div class="bg-surface text-fg flex items-center gap-8 p-10">
      <Spinner size="sm" label="Small" showLabel />
      <Spinner size="md" label="Medium" showLabel />
      <Spinner size="lg" label="Large" showLabel />
    </div>
  {/snippet}
</Story>

<!-- The `current` tone drops the honey fill/halo and inherits the surrounding text color, so the dot and rings stay
     visible on a colored fill (here honey) where the accent spinner would vanish. This is what Button uses for its
     loading state; the motion (pulse + ripple) is unchanged. -->
<Story
  name="On a colored fill"
  play={async ({ canvas }) => {
    const status = canvas.getByRole("status");
    const dot = status.querySelector(".spinner-dot");
    // The dot inherits currentColor rather than the honey accent.
    await expect(dot).toHaveClass("bg-current");
    await expect(dot).not.toHaveClass("bg-accent");
    // The ripple is still wired (the signature motion survives the tone change).
    await expect(getComputedStyle(dot as HTMLElement, "::before").animationName).not.toBe("none");
  }}
>
  {#snippet template()}
    <div class="bg-accent text-warm-900 inline-flex rounded-md p-10">
      <Spinner tone="current" label="Saving…" />
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg flex items-center gap-8 p-10">
      <Spinner />
      <Spinner label="Reaching your model…" showLabel />
    </div>
  {/snippet}
</Story>

<Story name="Evening" globals={{ theme: "evening" }}>
  {#snippet template()}
    <div class="bg-surface text-fg flex items-center gap-8 p-10">
      <Spinner />
      <Spinner label="Reaching your model…" showLabel />
    </div>
  {/snippet}
</Story>
