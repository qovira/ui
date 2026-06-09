<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, userEvent, waitFor } from "storybook/test";
  import ToastProvider from "./ToastProvider.svelte";
  import Button from "./Button.svelte";
  import { toast } from "../internal/toast-store.svelte.js";

  const { Story } = defineMeta({
    title: "Feedback/Toast",
    component: ToastProvider,
    tags: ["autodocs"],
  });

  const sleep = (ms: number) => new Promise((resolve) => globalThis.setTimeout(resolve, ms));
</script>

<!-- The imperative API (called from a handler — i.e. outside any component's
     context) renders toasts through the provider. Left visible so axe checks
     them (Evening here, Daylight below). -->
<Story
  name="Variants"
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Success" }));
    await userEvent.click(canvas.getByRole("button", { name: "Error" }));

    const success = await canvas.findByText("Saved your changes.");
    await expect(success).toBeInTheDocument();
    // Semantic color AND an icon (never color alone).
    const panel = success.parentElement;
    await expect(panel).toHaveClass("bg-success-tint");
    await expect(panel?.querySelector("svg")).toBeTruthy();
    // Announced via a live region: each toast is role="status" (implicitly polite).
    await expect(panel).toHaveAttribute("role", "status");
    await expect(canvas.getByText("Couldn't reach the server.")).toBeInTheDocument();
  }}
>
  {#snippet template()}
    <ToastProvider portalTo="#toast-host-variants">
      <div id="toast-host-variants" class="bg-surface text-text flex flex-wrap gap-2 p-6">
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
    await waitFor(
      () => expect(canvas.queryByText("This will vanish shortly.")).not.toBeInTheDocument(),
      {
        timeout: 3000,
      },
    );
  }}
>
  {#snippet template()}
    <ToastProvider portalTo="#toast-host-auto">
      <div id="toast-host-auto" class="bg-surface text-text p-6">
        <Button onclick={() => toast.info("This will vanish shortly.", { duration: 500 })}>
          Notify
        </Button>
      </div>
    </ToastProvider>
  {/snippet}
</Story>

<!-- Hovering pauses the timer, so the toast survives past its duration; it
     dismisses once the pointer leaves. -->
<Story
  name="Pauses on hover"
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Notify" }));
    const message = await canvas.findByText("Hover to keep me around.");
    await userEvent.hover(message);
    // Past the 800ms duration, still present because hover paused the timer.
    await sleep(1200);
    await expect(message).toBeInTheDocument();
    // Leaving resumes the timer and it dismisses.
    await userEvent.unhover(message);
    await waitFor(
      () => expect(canvas.queryByText("Hover to keep me around.")).not.toBeInTheDocument(),
      {
        timeout: 3000,
      },
    );
  }}
>
  {#snippet template()}
    <ToastProvider portalTo="#toast-host-pause">
      <div id="toast-host-pause" class="bg-surface text-text p-6">
        <Button onclick={() => toast.info("Hover to keep me around.", { duration: 800 })}>
          Notify
        </Button>
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
      <div id="toast-host-day" class="bg-surface text-text flex flex-wrap gap-2 p-6">
        <Button onclick={() => toast.success("All set.")}>Success</Button>
        <Button onclick={() => toast.error("Something went wrong.")}>Error</Button>
      </div>
    </ToastProvider>
  {/snippet}
</Story>
