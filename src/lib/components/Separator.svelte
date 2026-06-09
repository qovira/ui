<script lang="ts">
  import { Separator } from "bits-ui";
  import { cn } from "../internal/cn.js";

  // Build on Bits' own prop type so forwarded attributes stay exactly compatible.
  interface Props extends Separator.RootProps {
    class?: string;
  }

  let { orientation = "horizontal", decorative = false, class: klass, ...rest }: Props = $props();

  // Bits owns the ARIA (role="separator" + aria-orientation, or hidden when
  // decorative); the wrapper only paints the hairline in the theme border color.
  // A vertical separator stretches to its parent's height, so it needs a flex
  // (or grid) parent — e.g. inside a Cluster. Pass a height via `class` otherwise.
  const SHAPE = {
    horizontal: "h-px w-full",
    vertical: "w-px self-stretch",
  } as const;
</script>

<Separator.Root {orientation} {decorative} class={cn("bg-border shrink-0", SHAPE[orientation], klass)} {...rest} />
