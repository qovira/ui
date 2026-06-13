<script lang="ts">
  import { Select } from "bits-ui";
  import { CaretUpDownIcon, CheckIcon } from "phosphor-svelte";
  import { cn } from "../internal/cn.js";
  import { resolveFieldAria } from "../internal/field-aria.svelte.js";
  import { FIELD_CONTROL_BASE } from "../internal/field-control.js";
  import { LISTBOX_CONTENT_BASE, LISTBOX_ITEM_BASE } from "../internal/listbox.js";
  import type { ListboxItem } from "./listbox-types.js";

  interface Props {
    /** The selectable options. */
    items: ListboxItem[];
    /** Single selection (default) or multi-select. */
    type?: "single" | "multiple";
    /** Selected value — a `string` for single, `string[]` for multiple. */
    value?: string | string[] | undefined;
    /** Whether the listbox is open. */
    open?: boolean;
    /** Trigger text shown when nothing is selected. */
    placeholder?: string;
    disabled?: boolean;
    /** Name for the hidden form input (enables form submission). */
    name?: string;
    id?: string;
    /** Merged onto the trigger — the labelable control. */
    class?: string;
    /** Merged onto the dropdown content panel. */
    contentClass?: string;
    /** Fires whenever the committed selection changes. */
    onValueChange?: (value: string | string[]) => void;
    /** Fires whenever the open state changes. */
    onOpenChange?: (open: boolean) => void;
    "aria-label"?: string;
    "aria-invalid"?: boolean | "true" | "false" | undefined;
    "aria-describedby"?: string | undefined;
    /** Where to portal the dropdown. Defaults to `<body>`. */
    portalTo?: Select.PortalProps["to"];
  }

  let {
    items,
    type = "single",
    value = $bindable(),
    open = $bindable(false),
    placeholder = "Select…",
    disabled = false,
    name,
    id,
    class: klass,
    contentClass,
    onValueChange,
    onOpenChange,
    "aria-label": ariaLabel,
    "aria-invalid": invalidProp,
    "aria-describedby": describedbyProp,
    portalTo,
  }: Props = $props();

  // Inherit the Field contract from context; explicit props win (works standalone).
  const aria = resolveFieldAria(() => ({ id, invalid: invalidProp, describedby: describedbyProp }));

  // The listbox panel needs its own accessible name (it isn't the labelable
  // control): reuse the explicit aria-label, else point at the Field's label.
  const listboxName = $derived(
    ariaLabel ? { "aria-label": ariaLabel } : aria.labelId ? { "aria-labelledby": aria.labelId } : {},
  );
</script>

<!-- Bits owns listbox behavior: roving focus, type-ahead, ARIA, portalling. The
     wrapper dresses its parts in @qovira/theme utilities and consumes the Field
     contract on the trigger (the labelable control). `focus-ring` is appended
     last so a consumer class can't strip it. The Root is branched on `type` so
     the value/onValueChange discriminated union narrows to concrete literals —
     the shared parts live in the `body` snippet to stay DRY. -->
{#snippet body()}
  <Select.Trigger
    {...aria.resolvedId ? { id: aria.resolvedId } : {}}
    aria-label={ariaLabel}
    aria-invalid={aria.ariaInvalid}
    aria-describedby={aria.ariaDescribedby}
    class={cn(FIELD_CONTROL_BASE, "flex h-10 items-center justify-between gap-2 text-left", klass, "focus-ring")}
  >
    <Select.Value {placeholder} class="truncate data-[placeholder]:text-text-muted" />
    <CaretUpDownIcon size={18} color="currentColor" aria-hidden="true" class="shrink-0 text-text-muted" />
  </Select.Trigger>
  <Select.Portal {...portalTo ? { to: portalTo } : {}}>
    <Select.Content {...listboxName} class={cn(LISTBOX_CONTENT_BASE, contentClass)}>
      <Select.Viewport>
        {#each items as item (item.value)}
          <Select.Item
            value={item.value}
            label={item.label}
            {...item.disabled ? { disabled: true } : {}}
            class={LISTBOX_ITEM_BASE}
          >
            {#snippet children({ selected })}
              <span class="truncate">{item.label}</span>
              {#if selected}
                <CheckIcon size={16} color="currentColor" aria-hidden="true" class="shrink-0 text-link" />
              {/if}
            {/snippet}
          </Select.Item>
        {/each}
      </Select.Viewport>
    </Select.Content>
  </Select.Portal>
{/snippet}

{#if type === "multiple"}
  <Select.Root
    type="multiple"
    value={Array.isArray(value) ? value : []}
    onValueChange={(v) => {
      value = v;
      onValueChange?.(v);
    }}
    bind:open
    {...onOpenChange ? { onOpenChange } : {}}
    {...name ? { name } : {}}
    {disabled}
  >
    {@render body()}
  </Select.Root>
{:else}
  <Select.Root
    type="single"
    {items}
    value={typeof value === "string" ? value : ""}
    onValueChange={(v) => {
      value = v;
      onValueChange?.(v);
    }}
    bind:open
    {...onOpenChange ? { onOpenChange } : {}}
    {...name ? { name } : {}}
    {disabled}
  >
    {@render body()}
  </Select.Root>
{/if}
