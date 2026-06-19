<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Alert from "./Alert.svelte";

  type Args = Omit<ComponentProps<typeof Alert>, "children">;

  const { Story } = defineMeta({
    title: "Feedback/Alert",
    component: Alert,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures below hardcode their own props and ignore these.
    args: { variant: "info", title: "" },
    argTypes: {
      variant: { control: "inline-radio", options: ["info", "success", "warning", "error"] },
      title: { control: "text" },
    },
    parameters: { controls: { include: ["variant", "title"] } },
  });
</script>

<!-- Controls playground: spreads `args`, so editing a control live-updates the preview. The fixtures below hardcode
their props for deterministic tests, so their Controls panel is inert. Drives variant and the optional title; the body
is fixed representative copy. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div class="bg-surface text-fg max-w-md p-6">
      <Alert {...args}>A quiet heads-up about something in your workspace.</Alert>
    </div>
  {/snippet}
</Story>

<!-- Every variant carries a glyph and a text message, not color alone; the message uses text-fg (body color) on the
     semantic tint — an AA-verified pairing. axe enforces contrast in both themes on the real render. -->
<Story
  name="Variants"
  play={async ({ canvas }) => {
    // AC: meaning via icon AND text, never color alone — each banner has a glyph (an svg) alongside its message.
    const banners = canvas.getAllByRole("status");
    await expect(banners).toHaveLength(4);
    for (const banner of banners) {
      await expect(banner.querySelector("svg")).toBeInTheDocument();
    }
    await expect(canvas.getByText("Your reminder is set for Friday.")).toBeVisible();
    await expect(canvas.getByText(/couldn't reach your model/i)).toBeVisible();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg flex max-w-md flex-col gap-3 p-6">
      <Alert variant="info">A quiet heads-up about something in your workspace.</Alert>
      <Alert variant="success" title="Saved">Your reminder is set for Friday.</Alert>
      <Alert variant="warning">Your plan's usage is close to its monthly limit.</Alert>
      <Alert variant="error" title="Send failed">We couldn't reach your model — try again in a moment.</Alert>
    </div>
  {/snippet}
</Story>

<!-- role="alert" for the urgent case — forwarded through ...rest, overriding the polite default. -->
<Story
  name="Assertive"
  play={async ({ canvas }) => {
    await expect(canvas.getByRole("alert")).toHaveTextContent(/lost your connection/i);
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg max-w-md p-6">
      <Alert variant="error" role="alert" title="Offline"
        >We've lost your connection — changes won't save until it's back.</Alert
      >
    </div>
  {/snippet}
</Story>

<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg flex max-w-md flex-col gap-3 p-6">
      <Alert variant="info">A quiet heads-up about something in your workspace.</Alert>
      <Alert variant="success" title="Saved">Your reminder is set for Friday.</Alert>
      <Alert variant="warning">Your plan's usage is close to its monthly limit.</Alert>
      <Alert variant="error" title="Send failed">We couldn't reach your model.</Alert>
    </div>
  {/snippet}
</Story>

<Story name="Evening" globals={{ theme: "evening" }}>
  {#snippet template()}
    <div class="bg-surface text-fg flex max-w-md flex-col gap-3 p-6">
      <Alert variant="info">A quiet heads-up about something in your workspace.</Alert>
      <Alert variant="success" title="Saved">Your reminder is set for Friday.</Alert>
      <Alert variant="warning">Your plan's usage is close to its monthly limit.</Alert>
      <Alert variant="error" title="Send failed">We couldn't reach your model.</Alert>
    </div>
  {/snippet}
</Story>
