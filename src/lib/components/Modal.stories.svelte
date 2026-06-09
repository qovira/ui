<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, fn, userEvent, waitFor } from "storybook/test";
  import Modal from "./Modal.svelte";
  import ModalTitle from "./ModalTitle.svelte";
  import ModalDescription from "./ModalDescription.svelte";
  import Button from "./Button.svelte";

  const { Story } = defineMeta({
    title: "Overlays/Modal",
    component: Modal,
    tags: ["autodocs"],
  });
</script>

<script lang="ts">
  // Per-story open state, and each play tears the dialog down at the end — a
  // left-open dialog's `fixed inset-0` overlay would otherwise cover the next
  // story's trigger (Storybook reuses this file's instance across stories).
  let openMain = $state(false);
  let openDay = $state(false);
  const onOpenChange = fn();
</script>

<!-- Shared dialog body; `close` dismisses each story's own instance. A
     non-destructive confirm keeps the axe pass about the Modal itself (the
     destructive variant's contrast caveat is covered in the Button stories). -->
{#snippet body(close: () => void)}
  <ModalTitle>Delete item?</ModalTitle>
  <ModalDescription>This permanently removes the item — you can't undo it.</ModalDescription>
  <div class="mt-6 flex justify-end gap-2">
    <Button variant="secondary" onclick={close}>Cancel</Button>
    <Button variant="primary" onclick={close}>Confirm</Button>
  </div>
{/snippet}

<!-- Full lifecycle: bind:open opens it, Bits portals + traps focus + sets the
     dialog ARIA, Escape closes it and onOpenChange reports the change. -->
<Story
  name="Confirm dialog"
  play={async ({ canvas }) => {
    // AC: bind:open controls visibility; content is portalled and labelled.
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));
    const dialog = await canvas.findByRole("dialog");
    await expect(dialog).toHaveAccessibleName("Delete item?");
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog).toHaveClass("rounded-xl"); // theme styling applied
    // AC: focus is trapped inside the dialog.
    await waitFor(() => expect(dialog.contains(dialog.ownerDocument.activeElement)).toBe(true));
    // AC: Escape closes it and onopenchange fires on the change.
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument());
    await expect(onOpenChange).toHaveBeenLastCalledWith(false);
  }}
>
  {#snippet template()}
    <div id="modal-host-main" class="bg-surface text-text p-6">
      <Button onclick={() => (openMain = true)}>Open dialog</Button>
      <Modal bind:open={openMain} {onOpenChange} portalTo="#modal-host-main">
        {@render body(() => (openMain = false))}
      </Modal>
    </div>
  {/snippet}
</Story>

<!-- Daylight: open the dialog so axe checks the rendered dialog in the other
     theme, then close to leave a clean slate. -->
<Story
  name="Daylight"
  globals={{ theme: "daylight" }}
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));
    const dialog = await canvas.findByRole("dialog");
    await expect(dialog).toHaveAccessibleName("Delete item?");
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument());
  }}
>
  {#snippet template()}
    <div id="modal-host-day" class="bg-surface text-text p-6">
      <Button onclick={() => (openDay = true)}>Open dialog</Button>
      <Modal bind:open={openDay} portalTo="#modal-host-day">
        {@render body(() => (openDay = false))}
      </Modal>
    </div>
  {/snippet}
</Story>
