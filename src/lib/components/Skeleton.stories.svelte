<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import Skeleton from "./Skeleton.svelte";

  const { Story } = defineMeta({
    title: "Feedback/Skeleton",
    component: Skeleton,
    tags: ["autodocs"],
  });
</script>

<!-- Loading placeholders on the warm surface. Each is sized via `class`, so it
     occupies its final footprint immediately — CSS-only, no JS measurement, so
     it renders identically on server and client and never shifts layout on
     hydrate. aria-hidden keeps the placeholder out of the a11y tree. -->
<Story
  name="Loading card"
  play={async ({ canvas }) => {
    // AC: the placeholder is decorative (out of the a11y tree) and has a real,
    // deterministic footprint from its class — nothing measured at runtime.
    const avatar = canvas.getByTestId("skeleton-avatar");
    await expect(avatar).toHaveAttribute("aria-hidden", "true");
    await expect(avatar).toHaveClass(/size-12/);
  }}
>
  {#snippet template()}
    <div class="bg-surface text-text max-w-sm p-6">
      <div class="flex items-center gap-4">
        <Skeleton data-testid="skeleton-avatar" class="size-12 rounded-full" />
        <div class="flex-1 space-y-2">
          <Skeleton class="h-4 w-2/3" />
          <Skeleton class="h-3 w-1/3" />
        </div>
      </div>
      <div class="mt-6 space-y-2">
        <Skeleton class="h-3 w-full" />
        <Skeleton class="h-3 w-full" />
        <Skeleton class="h-3 w-4/5" />
      </div>
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-text max-w-sm p-6">
      <div class="flex items-center gap-4">
        <Skeleton class="size-12 rounded-full" />
        <div class="flex-1 space-y-2">
          <Skeleton class="h-4 w-2/3" />
          <Skeleton class="h-3 w-1/3" />
        </div>
      </div>
    </div>
  {/snippet}
</Story>
