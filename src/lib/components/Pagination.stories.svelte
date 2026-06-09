<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, userEvent, waitFor } from "storybook/test";
  import Pagination from "./Pagination.svelte";

  const { Story } = defineMeta({
    title: "Navigation/Pagination",
    component: Pagination,
    tags: ["autodocs"],
  });
</script>

<script lang="ts">
  let page = $state(1);
</script>

<!-- Navigates pages and exposes the current page; bind:page round-trips. The
     wrapper provides a labelled navigation landmark. -->
<Story
  name="Pages"
  play={async ({ canvas }) => {
    // AC: a labelled navigation landmark.
    const nav = canvas.getByRole("navigation", { name: "Reminders pages" });
    await expect(nav).toBeInTheDocument();
    // 95 items / 10 per page = 10 pages.
    await expect(canvas.getByRole("button", { name: "Page 10" })).toBeInTheDocument();
    // AC: current-page state is exposed (data-selected) and starts at 1.
    await expect(canvas.getByRole("button", { name: "Page 1" })).toHaveAttribute("data-selected");
    // On page 1, "previous" is disabled.
    await expect(canvas.getByRole("button", { name: "Go to previous page" })).toBeDisabled();
    // AC: navigation works and round-trips through bind:page.
    await userEvent.click(canvas.getByRole("button", { name: "Go to next page" }));
    await waitFor(() => expect(canvas.getByRole("button", { name: "Page 2" })).toHaveAttribute("data-selected"));
    await expect(canvas.getByTestId("page")).toHaveTextContent("2");
    // Jump directly to a visible page (with siblingCount 1, distant pages sit
    // behind an ellipsis).
    await userEvent.click(canvas.getByRole("button", { name: "Page 3" }));
    await waitFor(() => expect(canvas.getByTestId("page")).toHaveTextContent("3"));
  }}
>
  {#snippet template()}
    <div class="bg-surface text-text p-6">
      <Pagination count={95} perPage={10} bind:page aria-label="Reminders pages" />
      <p data-testid="page" class="text-small mt-3 font-sans text-text-muted">{page}</p>
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-text p-6">
      <Pagination count={48} perPage={10} page={3} aria-label="Results pages" />
    </div>
  {/snippet}
</Story>
