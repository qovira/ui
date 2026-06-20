<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, userEvent, waitFor } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import ToastProvider from "./ToastProvider.svelte";
  import Button from "./Button.svelte";
  import { toast } from "../internal/toast-store.svelte.js";

  type Args = ComponentProps<typeof ToastProvider>;

  const { Story } = defineMeta({
    title: "Feedback/Toast",
    component: ToastProvider,
    tags: ["autodocs"],
    // ToastProvider's only scalar prop is `portalTo` (a portal-target selector — infrastructure, not a user-meaningful
    // control), so the Playground exposes no Controls; it exists for uniformity. Toasts are driven by the imperative
    // `toast.*` API via the demo buttons.
    args: {},
  });

  const sleep = (ms: number) => new Promise((resolve) => globalThis.setTimeout(resolve, ms));
</script>

<!-- ToastProvider has no scalar props; click a button to fire a toast. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <ToastProvider portalTo="#toast-host-playground" {...args}>
      <div id="toast-host-playground" class="bg-surface text-fg flex flex-wrap gap-2 p-6">
        <Button onclick={() => toast.success("Saved your changes.")}>Success</Button>
        <Button onclick={() => toast.error("Couldn't reach the server.")}>Error</Button>
        <Button onclick={() => toast.warning("Storage is nearly full.")}>Warning</Button>
        <Button onclick={() => toast.info("A new version is available.")}>Info</Button>
      </div>
    </ToastProvider>
  {/snippet}
</Story>

<!-- The imperative API (called from a handler — i.e. outside any component's context) renders toasts through the provider. Left visible so axe checks them (Evening here, Daylight below). -->
<Story
  name="Variants"
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Success" }));
    await userEvent.click(canvas.getByRole("button", { name: "Error" }));

    const success = await canvas.findByText("Saved your changes.");
    await expect(success).toBeInTheDocument();
    // Semantic color AND an icon (never color alone).
    const panel = success.parentElement;
    await expect(panel).toHaveClass("bg-tint-success");
    await expect(panel?.querySelector("svg")).toBeTruthy();
    // Announced via a live region: each toast is role="status" (implicitly polite).
    await expect(panel).toHaveAttribute("role", "status");
    await expect(canvas.getByText("Couldn't reach the server.")).toBeInTheDocument();
  }}
>
  {#snippet template()}
    <ToastProvider portalTo="#toast-host-variants">
      <div id="toast-host-variants" class="bg-surface text-fg flex flex-wrap gap-2 p-6">
        <Button onclick={() => toast.success("Saved your changes.")}>Success</Button>
        <Button onclick={() => toast.error("Couldn't reach the server.")}>Error</Button>
        <Button onclick={() => toast.warning("Storage is nearly full.")}>Warning</Button>
        <Button onclick={() => toast.info("A new version is available.")}>Info</Button>
      </div>
    </ToastProvider>
  {/snippet}
</Story>

<!-- The timer dismisses the toast on its own. -->
<Story
  name="Auto dismiss"
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Notify" }));
    await canvas.findByText("This will vanish shortly.");
    await waitFor(() => expect(canvas.queryByText("This will vanish shortly.")).not.toBeInTheDocument(), {
      timeout: 3000,
    });
  }}
>
  {#snippet template()}
    <ToastProvider portalTo="#toast-host-auto">
      <div id="toast-host-auto" class="bg-surface text-fg p-6">
        <Button onclick={() => toast.info("This will vanish shortly.", { duration: 500 })}>Notify</Button>
      </div>
    </ToastProvider>
  {/snippet}
</Story>

<!-- Hovering pauses the timer, so the toast survives past its duration; it dismisses once the pointer leaves. -->
<Story
  name="Pauses on hover"
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Notify" }));
    const message = await canvas.findByText("Hover to keep me around.");
    await userEvent.hover(message);
    // Deliberate negative-wait: prove the toast OUTLIVES its duration while hovered. Browser-Mode can't fake-time the
    // rAF loop, so a real sleep is unavoidable here — kept short (2× the 200ms duration) to minimise wall-clock + flake.
    await sleep(400);
    await expect(message).toBeInTheDocument();
    // Leaving resumes the timer and it dismisses.
    await userEvent.unhover(message);
    await waitFor(() => expect(canvas.queryByText("Hover to keep me around.")).not.toBeInTheDocument(), {
      timeout: 3000,
    });
  }}
>
  {#snippet template()}
    <ToastProvider portalTo="#toast-host-pause">
      <div id="toast-host-pause" class="bg-surface text-fg p-6">
        <Button onclick={() => toast.info("Hover to keep me around.", { duration: 200 })}>Notify</Button>
      </div>
    </ToastProvider>
  {/snippet}
</Story>

<!-- Progress bar is present for auto-dismiss toasts (finite positive duration) and absent for sticky ones. -->
<Story
  name="Progress bar — auto dismiss"
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Notify" }));
    const message = await canvas.findByText("Watch the bar deplete.");
    const panel = message.closest("[role=status]");
    // The progress bar is a <div aria-hidden=true> at the bottom of the toast panel.
    const bar = panel?.querySelector("div[aria-hidden=true]");
    await expect(bar).toBeTruthy();
  }}
>
  {#snippet template()}
    <ToastProvider portalTo="#toast-host-bar-auto">
      <div id="toast-host-bar-auto" class="bg-surface text-fg p-6">
        <Button onclick={() => toast.info("Watch the bar deplete.", { duration: 5000 })}>Notify</Button>
      </div>
    </ToastProvider>
  {/snippet}
</Story>

<!-- Sticky toast (duration 0): no progress bar rendered. -->
<Story
  name="Progress bar — sticky (no bar)"
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Notify" }));
    const message = await canvas.findByText("This one sticks around.");
    const panel = message.closest("[role=status]");
    // The progress bar is specifically a <div aria-hidden=true> — not the icon SVGs.
    const bar = panel?.querySelector("div[aria-hidden=true]");
    await expect(bar).toBeFalsy();
  }}
>
  {#snippet template()}
    <ToastProvider portalTo="#toast-host-bar-sticky">
      <div id="toast-host-bar-sticky" class="bg-surface text-fg p-6">
        <Button onclick={() => toast.info("This one sticks around.", { duration: 0 })}>Notify</Button>
      </div>
    </ToastProvider>
  {/snippet}
</Story>

<!-- Daylight, so axe checks the toasts in both themes. -->
<Story
  name="Daylight"
  globals={{ theme: "daylight" }}
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Success" }));
    await userEvent.click(canvas.getByRole("button", { name: "Error" }));
    await canvas.findByText("All set.");
    await canvas.findByText("Something went wrong.");
  }}
>
  {#snippet template()}
    <ToastProvider portalTo="#toast-host-day">
      <div id="toast-host-day" class="bg-surface text-fg flex flex-wrap gap-2 p-6">
        <Button onclick={() => toast.success("All set.")}>Success</Button>
        <Button onclick={() => toast.error("Something went wrong.")}>Error</Button>
      </div>
    </ToastProvider>
  {/snippet}
</Story>

<!-- Evening: same toasts in the default theme, so axe checks them here too. -->
<Story
  name="Evening"
  globals={{ theme: "evening" }}
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Success" }));
    await userEvent.click(canvas.getByRole("button", { name: "Error" }));
    await canvas.findByText("All set.");
    await canvas.findByText("Something went wrong.");
  }}
>
  {#snippet template()}
    <ToastProvider portalTo="#toast-host-eve">
      <div id="toast-host-eve" class="bg-surface text-fg flex flex-wrap gap-2 p-6">
        <Button onclick={() => toast.success("All set.")}>Success</Button>
        <Button onclick={() => toast.error("Something went wrong.")}>Error</Button>
      </div>
    </ToastProvider>
  {/snippet}
</Story>
