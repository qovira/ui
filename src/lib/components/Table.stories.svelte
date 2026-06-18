<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, userEvent, waitFor } from "storybook/test";
  import * as Table from "./table.js";
  import TableRoot from "./TableRoot.svelte";
  import Avatar from "./Avatar.svelte";
  import Badge from "./Badge.svelte";
  import type { BadgeVariant } from "./status-variants.js";
  import type { TableSortDirection } from "./table-types.js";

  const { Story } = defineMeta({
    title: "Data/Table",
    component: TableRoot,
    tags: ["autodocs"],
  });

  interface Member {
    name: string;
    role: string;
    status: string;
    tone: BadgeVariant;
  }

  const members: Member[] = [
    { name: "Ada Lovelace", role: "Owner", status: "Active", tone: "success" },
    { name: "Grace Hopper", role: "Admin", status: "Active", tone: "success" },
    { name: "Alan Turing", role: "Member", status: "Invited", tone: "warning" },
  ];
</script>

<script lang="ts">
  let sort = $state<TableSortDirection>("none");
  // Minimal sort affordance: cycle none → asc → desc → none.
  function cycleSort() {
    sort = sort === "none" ? "asc" : sort === "asc" ? "desc" : "none";
  }
</script>

<!-- A calm, comfortable-density table with correct header semantics
     (<th scope="col">, a <caption>), composing Avatar and Badge into cells. The
     first column offers a minimal sort toggle: aria-sort on the header, a caret,
     and an onsort callback. -->
<Story
  name="Members"
  play={async ({ canvas }) => {
    // AC: correct table + header semantics.
    await expect(canvas.getByRole("table")).toBeInTheDocument();
    await expect(canvas.getAllByRole("columnheader")).toHaveLength(3);
    await expect(canvas.getByRole("columnheader", { name: "Role" })).toHaveAttribute("scope", "col");
    // A row per member, plus the header row.
    await expect(canvas.getAllByRole("row")).toHaveLength(members.length + 1);
    // Minimal sort: aria-sort starts "none", and activating the header cycles it.
    const nameHeader = canvas.getByRole("columnheader", { name: "Name" });
    await expect(nameHeader).toHaveAttribute("aria-sort", "none");
    const sortButton = canvas.getByRole("button", { name: "Name" });
    await userEvent.click(sortButton);
    await waitFor(() => expect(nameHeader).toHaveAttribute("aria-sort", "ascending"));
    // F6 — sortable headers must render uppercase identically to non-sortable ones.
    // The <button> must carry the `uppercase` class explicitly: UA stylesheets
    // occasionally suppress text-transform inheritance on replaced/button elements,
    // so relying on cascade alone is fragile. Both assertions pin the fix.
    await expect(sortButton).toHaveClass("uppercase");
    await expect(getComputedStyle(sortButton).textTransform).toBe("uppercase");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg max-w-2xl p-6">
      <Table.Root>
        <Table.Caption>Workspace members and their roles.</Table.Caption>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell sortable {sort} onsort={cycleSort}>Name</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {#each members as member (member.name)}
            <Table.Row>
              <Table.Cell>
                <span class="flex items-center gap-3">
                  <Avatar name={member.name} size="sm" />
                  {member.name}
                </span>
              </Table.Cell>
              <Table.Cell>{member.role}</Table.Cell>
              <Table.Cell>
                <Badge variant={member.tone}>{member.status}</Badge>
              </Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg max-w-2xl p-6">
      <Table.Root>
        <Table.Caption>Workspace members and their roles.</Table.Caption>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {#each members as member (member.name)}
            <Table.Row>
              <Table.Cell>
                <span class="flex items-center gap-3">
                  <Avatar name={member.name} size="sm" />
                  {member.name}
                </span>
              </Table.Cell>
              <Table.Cell>{member.role}</Table.Cell>
              <Table.Cell>
                <Badge variant={member.tone}>{member.status}</Badge>
              </Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </div>
  {/snippet}
</Story>
