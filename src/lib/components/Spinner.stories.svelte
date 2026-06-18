<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import Spinner from "./Spinner.svelte";

  const { Story } = defineMeta({
    title: "Feedback/Spinner",
    component: Spinner,
    tags: ["autodocs"],
  });
</script>

<!-- The signature lamp-glow loader, now with accent-colored radiating rings (ripple) that read clearly against
     both Daylight (cream) and Evening (espresso) backgrounds. Meaning isn't trapped in motion: role="status"
     announces accessible text (visually hidden by default) and the glow/rings are aria-hidden.
     Under prefers-reduced-motion the rings are hidden (display: none) for a clean static dot. -->
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

    // AC: the ripple ring is wired — the ::before pseudo-element carries a non-none animationName,
    // proving the `spinner-ripple` keyframe is applied in a real Chromium rendering context.
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

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg flex items-center gap-8 p-10">
      <Spinner />
      <Spinner label="Reaching your model…" showLabel />
    </div>
  {/snippet}
</Story>
