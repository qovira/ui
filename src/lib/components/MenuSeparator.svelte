<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import { cn } from "../internal/cn.js";

  interface Props {
    class?: string;
  }

  let { class: klass }: Props = $props();
</script>

<DropdownMenu.Separator class={cn("-mx-1.5 my-1 h-px bg-border", klass)} />
