<script lang="ts">
  import { Combobox } from "bits-ui";
  import CaretUpDownIcon from "phosphor-svelte/lib/CaretUpDownIcon";
  import CheckIcon from "phosphor-svelte/lib/CheckIcon";
  import { cn } from "../internal/cn.js";
  import { resolveFieldAria } from "../internal/field-aria.svelte.js";
  import { FIELD_CONTROL_BASE } from "../internal/field-control.js";
  import { LISTBOX_CONTENT_BASE, LISTBOX_ITEM_BASE } from "../internal/listbox.js";
  import type { ListboxItem } from "./listbox-types.js";

  interface Props {
    /** The full option set; filtered client-side against the typed input. */
    items: ListboxItem[];
    /** Single selection (default) or multi-select / tag entry. */
    type?: "single" | "multiple";
    /** Selected value — a `string` for single, `string[]` for multiple. */
    value?: string | string[] | undefined;
    /** Whether the listbox is open. */
    open?: boolean;
    /** Placeholder for the text input. */
    placeholder?: string;
    disabled?: boolean;
    /** Name for the hidden form input (enables form submission). */
    name?: string;
    id?: string;
    /** Merged onto the input — the labelable control. */
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
    portalTo?: Combobox.PortalProps["to"];
  }

  let {
    items,
    type = "single",
    value = $bindable(),
    open = $bindable(false),
    placeholder = "Search…",
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

  // The listbox panel needs its own accessible name (it isn't the labelable control): reuse the explicit aria-label,
  // else point at the Field's label.
  const listboxName = $derived(
    ariaLabel ? { "aria-label": ariaLabel } : aria.labelId ? { "aria-labelledby": aria.labelId } : {},
  );

  // Typeahead filtering is consumer-owned in Bits — we hold the search term and derive the visible options
  // (case-insensitive substring on the label). The needle is hoisted out of the predicate so it's computed once per
  // keystroke, not once per option. In multiple mode the panel stays open across commits, so the typed filter
  // intentionally persists until close (bits owns the input value, so clearing `search` alone would desync the visible
  // text).
  let search = $state("");
  const query = $derived(search.trim().toLowerCase());
  const filtered = $derived(query ? items.filter((item) => item.label.toLowerCase().includes(query)) : items);

  // Unlike Select (which uses bind:open), Combobox routes the open state through an explicit handler because it must
  // also clear the typed filter on close.
  function handleOpenChange(next: boolean) {
    open = next;
    if (!next) search = "";
    onOpenChange?.(next);
  }
</script>

<!-- Bits owns the combobox behavior (ARIA, keyboard, portalling, the hidden form input); the wrapper supplies theme
     utilities, filters the options, and consumes the Field contract on the input (the labelable control). The Root is
     branched on `type` so the value/onValueChange discriminated union narrows to concrete literals; shared parts live
     in the `body` snippet. -->
{#snippet body()}
  <div class="relative">
    <!-- bits-ui's Combobox.Input has no pointer-open handler — it only opens the listbox on ArrowUp/Down or printable
         keystrokes (keyboard users already have a path). A plain mouse click would silently do nothing, so we wire
         `onclick` here. Opening is intentionally not tied to focus so that keyboard navigation (Tab into the field)
         doesn't auto-pop the list. We call handleOpenChange(true) rather than toggling so clicking an already-open
         input keeps it open (safer than closing mid-type). bits-ui chains handlers via mergeProps, so this runs
         alongside its own. -->
    <Combobox.Input
      {...aria.resolvedId ? { id: aria.resolvedId } : {}}
      {placeholder}
      aria-label={ariaLabel}
      aria-invalid={aria.ariaInvalid}
      aria-describedby={aria.ariaDescribedby}
      oninput={(e) => (search = e.currentTarget.value)}
      onclick={() => {
        if (!disabled) {
          handleOpenChange(true);
        }
      }}
      class={cn(FIELD_CONTROL_BASE, "h-10 pr-9", klass, "focus-ring")}
    />
    <Combobox.Trigger
      aria-label="Toggle options"
      class="focus-ring absolute inset-y-0 right-0 flex items-center rounded-md px-2.5 text-fg-muted"
    >
      <CaretUpDownIcon size={18} color="currentColor" aria-hidden="true" />
    </Combobox.Trigger>
  </div>
  <Combobox.Portal {...portalTo ? { to: portalTo } : {}}>
    <Combobox.Content {...listboxName} class={cn(LISTBOX_CONTENT_BASE, contentClass)}>
      <Combobox.Viewport>
        {#each filtered as item (item.value)}
          <Combobox.Item
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
          </Combobox.Item>
        {:else}
          <p class="px-2 py-1.5 text-body font-sans text-fg-muted">No results</p>
        {/each}
      </Combobox.Viewport>
    </Combobox.Content>
  </Combobox.Portal>
{/snippet}

{#if type === "multiple"}
  <Combobox.Root
    type="multiple"
    value={Array.isArray(value) ? value : []}
    onValueChange={(v) => {
      value = v;
      onValueChange?.(v);
    }}
    {open}
    onOpenChange={handleOpenChange}
    {...name ? { name } : {}}
    {disabled}
  >
    {@render body()}
  </Combobox.Root>
{:else}
  <Combobox.Root
    type="single"
    value={typeof value === "string" ? value : ""}
    onValueChange={(v) => {
      value = v;
      onValueChange?.(v);
    }}
    {open}
    onOpenChange={handleOpenChange}
    {...name ? { name } : {}}
    {disabled}
  >
    {@render body()}
  </Combobox.Root>
{/if}
