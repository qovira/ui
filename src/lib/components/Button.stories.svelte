<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, fn, userEvent } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import Button from "./Button.svelte";

  // `ComponentProps<typeof Button>` is `Props & (HTMLButtonAttributes | HTMLAnchorAttributes)`; a plain `Omit` over that
  // union exceeds TS's union-complexity limit, so distribute the omit across each member.
  type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
  type Args = DistributiveOmit<ComponentProps<typeof Button>, "children">;

  const { Story } = defineMeta({
    title: "Actions/Button",
    component: Button,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures hardcode their own props and ignore these.
    args: { variant: "secondary", loading: false, disabled: false },
    argTypes: {
      variant: { control: "select", options: ["primary", "key", "secondary", "ghost", "destructive"] },
      loading: { control: "boolean" },
      disabled: { control: "boolean" },
    },
    // Limit the Controls panel to scalar props; children is the label and href morphs the element to an anchor.
    parameters: { controls: { include: ["variant", "loading", "disabled"] } },
  });

  // Module-scoped spy so the template and the play function share one handle.
  const handleClick = fn();
</script>

<!-- Controls playground. The fixtures below hardcode their props for deterministic tests, so their Controls panel is
inert; this story spreads `args`, so editing a control live-updates the preview. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div class="bg-surface text-fg p-6">
      <Button {...args}>Save changes</Button>
    </div>
  {/snippet}
</Story>

<!-- All five variants on brand, in both themes (this story + Daylight below) so axe checks each one's contrast in each
     theme. -->
<Story
  name="Variants"
  play={async ({ canvas }) => {
    // AC: variants render; each is a real <button>.
    for (const name of ["Primary", "Key CTA", "Secondary", "Ghost", "Delete"]) {
      await expect(canvas.getByRole("button", { name })).toBeInTheDocument();
    }
    // AC: a <button> defaults to type="button", so it never submits an enclosing form by surprise (consumers opt into
    // type="submit" explicitly).
    await expect(canvas.getByRole("button", { name: "Primary" })).toHaveAttribute("type", "button");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-wrap items-center gap-3 p-6">
      <Button variant="primary">Primary</Button>
      <Button variant="key">Key CTA</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  {/snippet}
</Story>

<!-- Disabled blocks interaction and dims; `disabled` is a native attribute. -->
<Story
  name="Disabled"
  play={async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Save" })).toBeDisabled();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Button variant="primary" disabled>Save</Button>
    </div>
  {/snippet}
</Story>

<!-- Loading shows a spinner, marks the control busy, and blocks interaction. -->
<Story
  name="Loading"
  play={async ({ canvas }) => {
    const btn = canvas.getByRole("button", { name: "Saving" });
    // AC: loading is a visible, story-covered state.
    await expect(btn).toBeDisabled();
    await expect(btn).toHaveAttribute("aria-busy", "true");
    // The indicator is the signature Spinner (its pulsing dot), not a generic rotating icon — so the loading state
    // matches the standalone Spinner.
    const dot = btn.querySelector(".spinner-dot");
    await expect(dot).not.toBeNull();
    await expect(btn.querySelector(".animate-spin")).toBeNull();
    // It inherits the button's text color (bg-current), so it stays visible on honey fills (key, primary in Evening)
    // where the honey accent would vanish.
    await expect(dot).toHaveClass("bg-current");
    // Decorative: the button already owns the busy semantics (aria-busy + the visible label), so the embedded spinner
    // adds no role/label of its own.
    await expect(btn.querySelector('[role="status"]')).toBeNull();
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Button variant="primary" loading>Saving</Button>
    </div>
  {/snippet}
</Story>

<!-- With `href` the button renders an `<a>` with identical styling + focus ring. -->
<Story
  name="As link"
  play={async ({ canvas }) => {
    // AC: href → <a> (link role), with a working href; focus ring is present.
    const link = canvas.getByRole("link", { name: "Go to docs" });
    await expect(link).toHaveAttribute("href", "/docs");
    await expect(link).toHaveClass("focus-ring");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Button href="/docs" variant="secondary">Go to docs</Button>
    </div>
  {/snippet}
</Story>

<!-- An inactive link leaves the tab order and drops its href so it isn't followable. -->
<Story
  name="Disabled link"
  play={async ({ canvas }) => {
    // Dropping href removes the implicit link role (an <a> with no href is not a link), so it's neither focusable nor
    // followable; query it by its text.
    const link = canvas.getByText("Unavailable");
    await expect(link).toHaveAttribute("aria-disabled", "true");
    await expect(link).not.toHaveAttribute("href");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Button href="/docs" variant="secondary" disabled>Unavailable</Button>
    </div>
  {/snippet}
</Story>

<!-- An active link forwards consumer attributes via ...rest: the component's state-coupled a11y attrs
     (tabindex/aria-busy) are emitted only when they mean something, so they no longer clobber a passed-through
     value. -->
<Story
  name="Link forwards native attributes"
  play={async ({ canvas }) => {
    const link = canvas.getByRole("link", { name: "Docs" });
    // tabindex passed via ...rest survives on an active (non-disabled) link.
    await expect(link).toHaveAttribute("tabindex", "-1");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Button href="/docs" variant="secondary" tabindex={-1}>Docs</Button>
    </div>
  {/snippet}
</Story>

<!-- Native attributes ride through ...rest; consumer `class` merges via cn(), but it can never strip the focus ring
     (the most-enforced a11y rule). -->
<Story
  name="Native attributes"
  play={async ({ canvas }) => {
    const btn = canvas.getByRole("button", { name: "Submit" });
    // type passes through ...rest.
    await expect(btn).toHaveAttribute("type", "submit");
    // onclick (native event) passes through ...rest and fires.
    await userEvent.click(btn);
    await expect(handleClick).toHaveBeenCalledOnce();
    // Consumer class is applied, yet focus-ring survives the merge.
    await expect(btn).toHaveClass("rounded-none");
    await expect(btn).toHaveClass("focus-ring");
  }}
>
  {#snippet template()}
    <div class="bg-surface text-fg p-6">
      <Button variant="primary" type="submit" class="rounded-none" onclick={handleClick}>Submit</Button>
    </div>
  {/snippet}
</Story>

<!-- All five variants, one per theme: Daylight then Evening, so axe runs each variant in both. -->
<Story name="Daylight" globals={{ theme: "daylight" }}>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-wrap items-center gap-3 p-6">
      <Button variant="primary">Primary</Button>
      <Button variant="key">Key CTA</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  {/snippet}
</Story>

<Story name="Evening" globals={{ theme: "evening" }}>
  {#snippet template()}
    <div class="bg-surface text-fg flex flex-wrap items-center gap-3 p-6">
      <Button variant="primary">Primary</Button>
      <Button variant="key">Key CTA</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  {/snippet}
</Story>
