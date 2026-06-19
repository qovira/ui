<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, fn, userEvent, waitFor } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Modal from "./Modal.svelte";
  import ModalTitle from "./ModalTitle.svelte";
  import ModalDescription from "./ModalDescription.svelte";
  import Button from "./Button.svelte";

  type Args = Omit<ComponentProps<typeof Modal>, "children">;

  const { Story } = defineMeta({
    title: "Overlays/Modal",
    component: Modal,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures hardcode their own props and ignore these. `open`
    // defaults true so the dialog is visible without a click.
    args: { open: false },
    argTypes: {
      open: { control: "boolean" },
    },
    // Limit the Controls panel to the scalar prop — children/portalTo/class and the forwarded Bits callbacks aren't
    // user-meaningful controls.
    parameters: { controls: { include: ["open"] } },
  });

  // A modal dialog locks `document.body { pointer-events: none }` while open and restores it on close. That body style
  // is shared across stories, so each play must wait for it to settle before ending — otherwise the next story's first
  // click lands on an inert body. Keeps the suite order-independent.
  async function bodyInteractiveAgain() {
    await waitFor(() => expect(document.body.style.pointerEvents).not.toBe("none"));
  }
</script>

<script lang="ts">
  // Per-story open state, and each play tears the dialog down at the end — a left-open dialog's `fixed inset-0` overlay
  // would otherwise cover the next story's trigger (Storybook reuses this file's instance across stories).
  let openMain = $state(false);
  let openDay = $state(false);
  let openEve = $state(false);
  const onOpenChange = fn();
</script>

<!-- Controls playground. The fixtures below hardcode their props for deterministic tests, so their Controls panel is
inert; this story spreads `args`, so editing a control live-updates the preview. `open` defaults true so the dialog
shows without a click; the dialog body is a snippet, left out of the controls. A ModalTitle supplies the accessible
name axe requires. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div id="modal-host-playground" class="bg-surface text-fg p-6">
      <Modal {...args} portalTo="#modal-host-playground">
        <ModalTitle>Delete item?</ModalTitle>
        <ModalDescription>This permanently removes the item — you can't undo it.</ModalDescription>
        <div class="mt-6 flex justify-end gap-2">
          <Button variant="secondary">Cancel</Button>
          <Button variant="primary">Confirm</Button>
        </div>
      </Modal>
    </div>
  {/snippet}
</Story>

<!-- Shared dialog body; `close` dismisses each story's own instance. A non-destructive confirm keeps the axe pass about
     the Modal itself (the destructive variant's contrast caveat is covered in the Button stories). -->
{#snippet body(close: () => void)}
  <ModalTitle>Delete item?</ModalTitle>
  <ModalDescription>This permanently removes the item — you can't undo it.</ModalDescription>
  <div class="mt-6 flex justify-end gap-2">
    <Button variant="secondary" onclick={close}>Cancel</Button>
    <Button variant="primary" onclick={close}>Confirm</Button>
  </div>
{/snippet}

<!-- Full lifecycle: bind:open opens it, Bits portals + traps focus + sets the dialog ARIA, Escape closes it and
     onOpenChange reports the change. -->
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
    await bodyInteractiveAgain();
  }}
>
  {#snippet template()}
    <div id="modal-host-main" class="bg-surface text-fg p-6">
      <Button onclick={() => (openMain = true)}>Open dialog</Button>
      <Modal bind:open={openMain} {onOpenChange} portalTo="#modal-host-main">
        {@render body(() => (openMain = false))}
      </Modal>
    </div>
  {/snippet}
</Story>

<!-- Daylight: open the dialog so axe checks the rendered dialog in the other theme, then close to leave a clean
     slate. -->
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
    await bodyInteractiveAgain();
  }}
>
  {#snippet template()}
    <div id="modal-host-day" class="bg-surface text-fg p-6">
      <Button onclick={() => (openDay = true)}>Open dialog</Button>
      <Modal bind:open={openDay} portalTo="#modal-host-day">
        {@render body(() => (openDay = false))}
      </Modal>
    </div>
  {/snippet}
</Story>

<!-- Evening: same dialog in the default theme, so axe checks the open state here too. -->
<Story
  name="Evening"
  globals={{ theme: "evening" }}
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));
    const dialog = await canvas.findByRole("dialog");
    await expect(dialog).toHaveAccessibleName("Delete item?");
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).not.toBeInTheDocument());
    await bodyInteractiveAgain();
  }}
>
  {#snippet template()}
    <div id="modal-host-eve" class="bg-surface text-fg p-6">
      <Button onclick={() => (openEve = true)}>Open dialog</Button>
      <Modal bind:open={openEve} portalTo="#modal-host-eve">
        {@render body(() => (openEve = false))}
      </Modal>
    </div>
  {/snippet}
</Story>
