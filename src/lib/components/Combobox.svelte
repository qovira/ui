<script lang="ts">
  import { Combobox } from "bits-ui";
  import { CaretUpDownIcon, CheckIcon } from "phosphor-svelte";
  import { cn } from "../internal/cn.js";
  import { FIELD_CONTROL_BASE } from "../internal/field-control.js";
  import { getFieldContext } from "../internal/field-context.js";
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
  const field = getFieldContext();
  const ctx = $derived(field?.());
  const resolvedId = $derived(id ?? ctx?.id);
  const ariaInvalid = $derived(invalidProp ?? (ctx?.invalid ? true : undefined));
  const ariaDescribedby = $derived(describedbyProp ?? ctx?.describedby);

  // The listbox panel needs its own accessible name (it isn't the labelable
  // control): reuse the explicit aria-label, else point at the Field's label.
  const listboxName = $derived(
    ariaLabel
      ? { "aria-label": ariaLabel }
      : ctx?.labelId
        ? { "aria-labelledby": ctx.labelId }
        : {},
  );

  // Typeahead filtering is consumer-owned in Bits — we hold the search term and
  // derive the visible options (case-insensitive substring on the label).
  let search = $state("");
  const filtered = $derived(
    search.trim()
      ? items.filter((item) => item.label.toLowerCase().includes(search.trim().toLowerCase()))
      : items,
  );

  function handleOpenChange(next: boolean) {
    open = next;
    // Reset the filter on close so reopening shows the full list again.
    if (!next) search = "";
    onOpenChange?.(next);
  }
</script>

<!-- Bits owns the combobox behavior (ARIA, keyboard, portalling, the hidden
     form input); the wrapper supplies theme utilities, filters the options, and
     consumes the Field contract on the input (the labelable control). The Root
     is branched on `type` so the value/onValueChange discriminated union narrows
     to concrete literals; shared parts live in the `body` snippet. -->
{#snippet body()}
  <div class="relative">
    <Combobox.Input
      {...resolvedId ? { id: resolvedId } : {}}
      {placeholder}
      aria-label={ariaLabel}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedby}
      oninput={(e) => (search = e.currentTarget.value)}
      class={cn(FIELD_CONTROL_BASE, "h-10 pr-9", klass, "focus-ring")}
    />
    <Combobox.Trigger
      aria-label="Toggle options"
      class="focus-ring absolute inset-y-0 right-0 flex items-center rounded-md px-2.5 text-text-muted"
    >
      <CaretUpDownIcon size={18} color="currentColor" aria-hidden="true" />
    </Combobox.Trigger>
  </div>
  <Combobox.Portal {...portalTo ? { to: portalTo } : {}}>
    <Combobox.Content
      {...listboxName}
      class={cn(
        "z-50 max-h-60 min-w-[var(--bits-floating-anchor-width)] overflow-y-auto",
        "rounded-md border border-border bg-surface-raised p-1 shadow-[var(--shadow-lg)]",
        "duration-overlay ease-qovira",
        contentClass,
      )}
    >
      <Combobox.Viewport>
        {#each filtered as item (item.value)}
          <Combobox.Item
            value={item.value}
            label={item.label}
            {...item.disabled ? { disabled: true } : {}}
            class={cn(
              "flex cursor-default items-center justify-between gap-2 rounded-sm px-2 py-1.5",
              "text-body font-sans text-text outline-none",
              "data-[highlighted]:bg-link/8 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            )}
          >
            {#snippet children({ selected })}
              <span class="truncate">{item.label}</span>
              {#if selected}
                <CheckIcon
                  size={16}
                  color="currentColor"
                  aria-hidden="true"
                  class="shrink-0 text-link"
                />
              {/if}
            {/snippet}
          </Combobox.Item>
        {:else}
          <p class="px-2 py-1.5 text-body font-sans text-text-muted">No results</p>
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
