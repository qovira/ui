<script lang="ts">
  import type { HTMLTableAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { cn } from "../internal/cn.js";

  interface Props extends HTMLTableAttributes {
    class?: string;
    /** Accessible name for the scroll region, used only while the table overflows horizontally (a keyboard-scrollable
     *  region needs a name). Defaults to `"Table"`. */
    scrollRegionLabel?: string;
    children: Snippet;
  }

  let { class: klass, scrollRegionLabel = "Table", children, ...rest }: Props = $props();

  // When a wide table overflows its container it becomes a horizontal scroll region, which must be keyboard-focusable
  // (WCAG 2.1.1 / axe `scrollable-region-focusable`) — but ONLY while it actually overflows, else we'd add an empty tab
  // stop and a nameless landmark to every table that fits. Observe the box (and the table, for content-driven width
  // changes) and toggle the region semantics on real overflow.
  let viewport = $state<HTMLDivElement | null>(null);
  let table = $state<HTMLTableElement | null>(null);
  let overflowing = $state(false);

  $effect(() => {
    const vp = viewport;
    const tbl = table;
    if (!vp || !tbl) {
      return;
    }
    const measure = () => {
      overflowing = vp.scrollWidth > vp.clientWidth;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(vp);
    observer.observe(tbl);
    return () => observer.disconnect();
  });
</script>

<!-- A calm table: comfortable density, hairline row rules, no zebra/grid noise. Wrapped in a horizontal-scroll
     container so a wide table stays usable on narrow viewports without forcing the page to scroll. The wrapper becomes
     a focusable, named region only while it actually overflows (see above), so keyboard users can scroll it. -->
<div
  bind:this={viewport}
  class="w-full overflow-x-auto"
  {...overflowing ? { tabindex: 0, role: "region", "aria-label": scrollRegionLabel } : {}}
>
  <table bind:this={table} class={cn("w-full border-collapse text-left font-sans text-body text-fg", klass)} {...rest}>
    {@render children()}
  </table>
</div>
