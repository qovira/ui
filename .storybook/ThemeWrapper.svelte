<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    theme: "daylight" | "evening";
    children: Snippet;
  }

  let { theme, children }: Props = $props();
</script>

<!--
  Per-story theme wrapper. Sets `data-theme` on a wrapper element so each Docs
  block themes its own subtree independently of `<html data-theme>`. On the Docs
  page all story blocks share one document, so the global decorator's `setTheme`
  (which targets `<html>`) clobbers itself on every render — the last story to
  mount wins. With this wrapper each block carries its own attribute and the
  semantic CSS custom properties (`--bg`, `--surface`, …) resolve via inheritance
  from [data-theme], not from <html>.

  `display: contents` makes the wrapper layout-transparent: it generates no box,
  so padding, alignment, and positioning of child components are unaffected on
  Canvas. Custom-property inheritance passes through `display: contents` in all
  evergreen browsers, and the `evening:` Tailwind variant
  (`@custom-variant evening (&:where([data-theme="evening"] *))`) matches
  descendants of this div, so themed Tailwind utilities work correctly inside it.
-->
<div data-theme={theme} style="display: contents">
  {@render children()}
</div>
