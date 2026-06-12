<script lang="ts">
  import { cn } from "../internal/cn.js";
  import type { IconProps } from "./types.js";

  let { icon: IconCmp, size = 20, label, decorative, class: klass, ...rest }: IconProps = $props();

  // Weight is locked to Regular and color to currentColor (brand iconography
  // rules); icons inherit the surrounding text color. Only size and the
  // accessible-name decision are caller-controlled.
  const a11y = $derived(decorative ? { "aria-hidden": true } : { "aria-label": label });
</script>

<IconCmp
  {size}
  weight="regular"
  color="currentColor"
  class={cn("inline-block shrink-0 align-middle", klass)}
  {...rest}
  {...a11y}
/>
