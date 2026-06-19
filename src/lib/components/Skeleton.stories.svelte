<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Skeleton from "./Skeleton.svelte";

  type Args = ComponentProps<typeof Skeleton>;

  const { Story } = defineMeta({
    title: "Feedback/Skeleton",
    component: Skeleton,
    tags: ["autodocs"],
    // Skeleton has no controllable scalar props — it's a pure visual placeholder sized via `class` (excluded from
    // Controls). The Playground exists only for uniformity; the size below is fixed representative content.
    args: {},
  });
</script>

<!-- Controls playground: spreads `args`, so it stays uniform with the rest of the library — but Skeleton exposes no
scalar props (only `class`/`style`/aria, all excluded), so its Controls panel is empty. The size is fixed
representative content. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div class="bg-surface text-fg max-w-sm p-6">
      <Skeleton class="h-4 w-2/3" {...args} />
    </div>
  {/snippet}
</Story>

<!-- Loading placeholders on the warm surface. Each is sized via `class`, so it occupies its final footprint immediately
     — CSS-only, no JS measurement, so it renders identically on server and client and never shifts layout on hydrate.
     aria-hidden keeps the placeholder out of the a11y tree. -->
<Story
  name="Loading card"
  play={async ({ canvas }) => {
    // AC: the placeholder is decorative (out of the a11y tree) and has a real, deterministic footprint from its class —
    // nothing measured at runtime.
    const avatar = canvas.getByTestId("skeleton-avatar");
    await expect(avatar).toHaveAttribute("aria-hidden", "true");
    await expect(avatar).toHaveClass(/size-12/);
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg max-w-sm p-6">
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
    <div class="bg-surface text-fg max-w-sm p-6">
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

<Story name="Evening" globals={{ theme: "evening" }}>
  {#snippet template()}
    <div class="bg-surface text-fg max-w-sm p-6">
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
