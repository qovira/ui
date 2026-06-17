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

<!-- The signature lamp-glow loader. Meaning isn't trapped in motion: role="status"
     announces accessible text (visually hidden by default) and the glow is
     aria-hidden. The pulse runs on lamp-glow-pulse, which the theme's global
     prefers-reduced-motion guard collapses to a static glow. -->
<Story
  name="Loading"
  play={async ({ canvas }) => {
    // AC: role="status" with accessible text.
    const status = canvas.getByRole("status");
    await expect(status).toHaveTextContent("Loading…");
    // AC: the pulse rides on lamp-glow-pulse, so the theme's reduced-motion guard
    // (which collapses every animation) pauses it — meaning never lives in motion.
    await expect(status.querySelector(".lamp-glow-pulse")).toBeInTheDocument();
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
