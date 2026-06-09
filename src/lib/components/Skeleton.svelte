<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../internal/cn.js";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    class?: string;
  }

  let { class: klass, ...rest }: Props = $props();
</script>

<!-- Loading placeholder on the warm surface: an espresso wash (the text color at
     low alpha, so it reads warm in Daylight and Evening alike) with a gentle
     pulse. Purely visual — aria-hidden so assistive tech skips it (announce the
     load via Spinner's role="status"). Size it with `class` (e.g. `h-4 w-32`);
     it's CSS-only and JS-free, so it renders identically server- and client-side
     and never shifts layout on hydrate. -->
<div aria-hidden="true" class={cn("animate-pulse rounded-md bg-text/10", klass)} {...rest}></div>
