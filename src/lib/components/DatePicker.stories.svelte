<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, fn, userEvent, waitFor } from "storybook/test";
  import { CalendarDate } from "@internationalized/date";
  import DatePicker from "./DatePicker.svelte";
  import Field from "./Field.svelte";

  const { Story } = defineMeta({
    title: "Forms/DatePicker",
    component: DatePicker,
    tags: ["autodocs"],
  });
</script>

<script lang="ts">
  import type { DateValue } from "@internationalized/date";
  let value = $state<DateValue | undefined>(new CalendarDate(2026, 6, 15));
  const onOpenChange = fn();
</script>

<!-- Open the popover from the trigger, pick a day; the popover portals + handles
     collisions, and the selection round-trips through bind:value. -->
<Story
  name="Open and select"
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(true));
    const day = await canvas.findByRole("button", { name: /June 20, 2026/ });
    await userEvent.click(day);
    await expect(canvas.getByTestId("value")).toHaveTextContent("2026-06-20");
    // Popover dismisses; close defensively so axe checks the resting state.
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("application")).not.toBeInTheDocument());
  }}
>
  {#snippet template()}
    <div id="datepicker-host" class="bg-surface text-text flex flex-col items-start gap-3 p-6">
      <DatePicker aria-label="Reminder" bind:value {onOpenChange} portalTo="#datepicker-host" />
      <p data-testid="value" class="text-small font-sans text-text-muted">
        {value?.toString() ?? "none"}
      </p>
    </div>
  {/snippet}
</Story>

<!-- Disabled: the trigger can't open the popover. -->
<Story
  name="Disabled"
  play={async ({ canvas }) => {
    await expect(canvas.getByRole("spinbutton", { name: /day/i })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  }}
>
  {#snippet template()}
    <div class="bg-surface text-text p-6">
      <DatePicker aria-label="Reminder" disabled value={new CalendarDate(2026, 6, 15)} />
    </div>
  {/snippet}
</Story>

<!-- Inside a Field, the segment group inherits the a11y contract. -->
<Story
  name="In a field"
  play={async ({ canvas }) => {
    const group = canvas.getByRole("group", { name: /Reminder date/ });
    await expect(group).toHaveAttribute("aria-invalid", "true");
    const message = canvas.getByText("Pick a reminder date.");
    await expect(group).toHaveAttribute("aria-describedby", message.id);
  }}
>
  {#snippet template()}
    <div class="bg-surface text-text p-6">
      <Field label="Reminder date" error="Pick a reminder date.">
        <DatePicker value={new CalendarDate(2026, 6, 15)} />
      </Field>
    </div>
  {/snippet}
</Story>

<!-- Daylight: open the popover so axe checks the rendered calendar in the other
     theme, then close to leave a clean slate. -->
<Story
  name="Daylight"
  globals={{ theme: "daylight" }}
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open calendar" }));
    await canvas.findByRole("application");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("application")).not.toBeInTheDocument());
  }}
>
  {#snippet template()}
    <div id="datepicker-day-host" class="bg-surface text-text p-6">
      <DatePicker
        aria-label="Reminder"
        value={new CalendarDate(2026, 6, 15)}
        portalTo="#datepicker-day-host"
      />
    </div>
  {/snippet}
</Story>
