<script lang="ts">
  import { RadioGroup } from "bits-ui";
  import { cn } from "../internal/cn.js";
  import { getFieldContext } from "../internal/field-context.js";

  interface Props extends RadioGroup.RootProps {
    class?: string;
  }

  let {
    value = $bindable(""),
    class: klass,
    children,
    "aria-labelledby": labelledbyProp,
    "aria-invalid": invalidProp,
    "aria-describedby": describedbyProp,
    ...rest
  }: Props = $props();

  // A radiogroup names itself via aria-labelledby (a `<label for>` can't target a
  // group), so it consumes the Field's labelId — plus invalid/describedby —
  // from context. Explicit props win.
  const field = getFieldContext();
  const ctx = $derived(field?.());
  const ariaLabelledby = $derived(labelledbyProp ?? ctx?.labelId);
  const ariaInvalid = $derived(invalidProp ?? (ctx?.invalid ? true : undefined));
  const ariaDescribedby = $derived(describedbyProp ?? ctx?.describedby);
</script>

<RadioGroup.Root bind:value aria-labelledby={ariaLabelledby} aria-invalid={ariaInvalid} aria-describedby={ariaDescribedby} class={cn("flex flex-col gap-2", klass)} {...rest}>
  {@render children?.()}
</RadioGroup.Root>
