<script lang="ts">
  import { Separator } from "bits-ui";
  import { cn } from "../internal/cn.js";

  // Build on Bits' own prop type so forwarded attributes stay exactly compatible.
  interface Props extends Separator.RootProps {
    class?: string;
  }

  let { orientation = "horizontal", decorative = false, class: klass, ...rest }: Props = $props();

  // Bits owns the ARIA (role="separator" + aria-orientation, or hidden when decorative); the wrapper paints
  // the line using the `divider` token — a step stronger than the hairline used on borders/inputs/cards.
  // Vertical: `min-h-[1em]` gives an intrinsic minimum height so the separator is visible in any container
  // (block, inline-block, absolute, etc.). Inside a flex or grid parent `self-stretch` still kicks in and
  // expands it to fill the cross axis, so the stretch-to-parent behavior is preserved where it was relied on.
  const SHAPE = {
    horizontal: "h-px w-full",
    vertical: "w-px min-h-[1em] self-stretch",
  } as const;
</script>

<Separator.Root {orientation} {decorative} class={cn("bg-divider shrink-0", SHAPE[orientation], klass)} {...rest} />
