<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, fn, userEvent, waitFor } from "storybook/test";
  import Combobox from "./Combobox.svelte";
  import Field from "./Field.svelte";
  import type { ListboxItem } from "./listbox-types.js";

  const { Story } = defineMeta({
    title: "Forms/Combobox",
    component: Combobox,
    tags: ["autodocs"],
  });

  const frameworks: ListboxItem[] = [
    { value: "svelte", label: "Svelte" },
    { value: "react", label: "React" },
    { value: "vue", label: "Vue" },
    { value: "solid", label: "Solid" },
    { value: "angular", label: "Angular" },
  ];
</script>

<script lang="ts">
  let single = $state<string | string[] | undefined>();
  let multi = $state<string | string[]>([]);
  const onValueChange = fn();
  const onOpenChange = fn();
  let comboboxFieldValue = $state<string | undefined>(undefined);
  let comboboxFieldError = $state<string | undefined>("Choose a framework.");
</script>

<!-- Typeahead: typing filters the options to label substring matches; selecting
     a filtered option commits its value (bind:value round-trips, rendered out)
     and both callbacks fire. -->
<Story
  name="Filter and select"
  play={async ({ canvas }) => {
    const input = canvas.getByRole("combobox", { name: "Framework" });
    await userEvent.click(input);
    await userEvent.type(input, "sv");
    await canvas.findByRole("listbox");
    await expect(onOpenChange).toHaveBeenCalledWith(true);
    // Only the matching option survives the filter.
    await expect(canvas.getByRole("option", { name: "Svelte" })).toBeInTheDocument();
    await expect(canvas.queryByRole("option", { name: "React" })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("option", { name: "Svelte" }));
    await expect(onValueChange).toHaveBeenLastCalledWith("svelte");
    await expect(canvas.getByTestId("value")).toHaveTextContent('"svelte"');
  }}
>
  {#snippet template()}
    <div id="combobox-single-host" class="bg-surface text-fg flex flex-col gap-3 p-6">
      <Combobox
        aria-label="Framework"
        items={frameworks}
        bind:value={single}
        placeholder="Search frameworks"
        {onValueChange}
        {onOpenChange}
        portalTo="#combobox-single-host"
      />
      <p data-testid="value" class="text-small font-sans text-fg-muted">
        {JSON.stringify(single ?? null)}
      </p>
    </div>
  {/snippet}
</Story>

<!-- A filter that matches nothing shows the empty-state message, not options. -->
<Story
  name="No results"
  play={async ({ canvas }) => {
    const input = canvas.getByRole("combobox", { name: "Framework" });
    await userEvent.click(input);
    await userEvent.type(input, "zzz");
    await waitFor(() => expect(canvas.getByText("No results")).toBeInTheDocument());
    await expect(canvas.queryAllByRole("option")).toHaveLength(0);
    // Close before the play ends so axe checks the resting state — an open,
    // empty listbox is a transient edge, asserted above in-play (mirrors how the
    // Modal/Select stories tear overlays down before the a11y pass runs).
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("listbox")).not.toBeInTheDocument());
  }}
>
  {#snippet template()}
    <div id="combobox-empty-host" class="bg-surface text-fg p-6">
      <Combobox
        aria-label="Framework"
        items={frameworks}
        placeholder="Search frameworks"
        portalTo="#combobox-empty-host"
      />
    </div>
  {/snippet}
</Story>

<!-- Click-on-input: clicking the search input (not the trigger icon) must open
     the listbox. bits-ui's Combobox.Input has no pointer-open handler, so the
     open-on-click wire is added manually in the component. After opening,
     typing still filters as normal. -->
<Story
  name="Click input opens"
  play={async ({ canvas }) => {
    const input = canvas.getByRole("combobox", { name: "Framework" });
    // A plain click — no typing, no trigger button — must open the listbox.
    await userEvent.click(input);
    await canvas.findByRole("listbox");
    // Typing while it's open must still filter.
    await userEvent.type(input, "sv");
    await expect(canvas.getByRole("option", { name: "Svelte" })).toBeInTheDocument();
    await expect(canvas.queryByRole("option", { name: "React" })).not.toBeInTheDocument();
    // Click the input again — already open, must stay open (not toggle).
    await userEvent.click(input);
    await expect(canvas.getByRole("listbox")).toBeInTheDocument();
    // Close cleanly so axe sees the resting state.
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("listbox")).not.toBeInTheDocument());
  }}
>
  {#snippet template()}
    <div id="combobox-click-host" class="bg-surface text-fg p-6">
      <Combobox
        aria-label="Framework"
        items={frameworks}
        placeholder="Search frameworks"
        portalTo="#combobox-click-host"
      />
    </div>
  {/snippet}
</Story>

<!-- Multi-select / tag entry: each commit adds to the value array. -->
<Story
  name="Multiple"
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Toggle options" }));
    await canvas.findByRole("listbox");
    await userEvent.click(canvas.getByRole("option", { name: "Svelte" }));
    await userEvent.click(canvas.getByRole("option", { name: "Vue" }));
    await userEvent.keyboard("{Escape}");
    await expect(canvas.getByTestId("tags")).toHaveTextContent('["svelte","vue"]');
  }}
>
  {#snippet template()}
    <div id="combobox-multi-host" class="bg-surface text-fg flex flex-col gap-3 p-6">
      <Combobox
        aria-label="Tags"
        type="multiple"
        items={frameworks}
        bind:value={multi}
        placeholder="Add tags"
        portalTo="#combobox-multi-host"
      />
      <p data-testid="tags" class="text-small font-sans text-fg-muted">
        {JSON.stringify(multi)}
      </p>
    </div>
  {/snippet}
</Story>

<!-- Disabled input can't be focused or typed into. -->
<Story
  name="Disabled"
  play={async ({ canvas }) => {
    await expect(canvas.getByRole("combobox", { name: "Framework" })).toBeDisabled();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Combobox aria-label="Framework" items={frameworks} disabled placeholder="Search frameworks" />
    </div>
  {/snippet}
</Story>

<!-- Inside a Field, the input inherits the a11y contract without prop-drilling.
     Selecting a framework clears the error. -->
<Story
  name="In a field"
  play={async ({ canvas }) => {
    const input = canvas.getByRole("combobox", { name: /Framework/ });
    // Initial state: invalid wiring is present.
    await expect(input).toHaveAttribute("aria-invalid", "true");
    const message = canvas.getByText("Choose a framework.");
    await expect(input).toHaveAttribute("aria-describedby", message.id);
    // Selecting a framework satisfies the field — error clears.
    await userEvent.click(canvas.getByRole("button", { name: "Toggle options" }));
    await canvas.findByRole("listbox");
    await userEvent.click(canvas.getByRole("option", { name: "Svelte" }));
    await expect(input).not.toHaveAttribute("aria-invalid", "true");
    await expect(canvas.queryByText("Choose a framework.")).not.toBeInTheDocument();
  }}
>
  {#snippet template()}
    <div id="combobox-field-host" class="bg-surface text-fg p-6">
      <Field label="Framework" {...comboboxFieldError ? { error: comboboxFieldError } : {}}>
        <Combobox
          items={frameworks}
          placeholder="Search frameworks"
          bind:value={comboboxFieldValue}
          onValueChange={(v) => {
            comboboxFieldValue = typeof v === "string" ? v : undefined;
            comboboxFieldError = comboboxFieldValue ? undefined : "Choose a framework.";
          }}
          portalTo="#combobox-field-host"
        />
      </Field>
    </div>
  {/snippet}
</Story>

<!-- Daylight: open the filtered list so axe checks the rendered panel in the
     other theme, then close to leave a clean slate. -->
<Story
  name="Daylight"
  globals={{ theme: "daylight" }}
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Toggle options" }));
    await canvas.findByRole("listbox");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("listbox")).not.toBeInTheDocument());
  }}
>
  {#snippet template()}
    <div id="combobox-day-host" class="bg-surface text-fg p-6">
      <Combobox
        aria-label="Framework"
        items={frameworks}
        placeholder="Search frameworks"
        portalTo="#combobox-day-host"
      />
    </div>
  {/snippet}
</Story>
