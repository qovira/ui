<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import { expect, fn, userEvent, waitFor } from "storybook/test";
  import type { ComponentProps } from "svelte";
  import * as Menu from "./menu.js";
  import MenuRoot from "./MenuRoot.svelte";
  import Button from "./Button.svelte";

  type Args = Omit<ComponentProps<typeof MenuRoot>, "children">;

  const { Story } = defineMeta({
    title: "Overlays/Menu",
    component: MenuRoot,
    tags: ["autodocs"],
    // Defaults for the args-driven Playground story; the fixtures hardcode their own props and ignore these. `open`
    // defaults true so the menu is visible without a click.
    args: { open: false },
    argTypes: {
      open: { control: "boolean" },
    },
    // Limit the Controls panel to the scalar prop — children is a snippet and onOpenChange is a callback.
    parameters: { controls: { include: ["open"] } },
  });

  // A modal menu locks `document.body { pointer-events: none }` while open and restores it on close. That body style
  // is shared across stories, so each play must wait for it to settle before ending — otherwise the next story's first
  // click lands on an inert body. Keeps the suite order-independent.
  async function bodyInteractiveAgain() {
    await waitFor(() => expect(document.body.style.pointerEvents).not.toBe("none"));
  }
</script>

<script lang="ts">
  // Per-story open state; each play closes the menu so axe checks the resting (closed) state. Content is portalled into
  // the story host for the scoped `canvas` to see it.
  let openMain = $state(false);
  let openLink = $state(false);
  let openSub = $state(false);
  let openDay = $state(false);
  let openEve = $state(false);
  const onRename = fn();
</script>

<!-- Controls playground. The fixtures below hardcode their props for deterministic tests, so their Controls panel is
inert; this story spreads `args`, so editing a control live-updates the preview. `open` defaults true so the menu shows
without a click; the compound parts (trigger, items) are markup, left out of the controls. -->
<Story name="Playground">
  {#snippet template(args: Args)}
    <div id="menu-host-playground" class="bg-surface text-fg p-6">
      <Menu.Root {...args}>
        <Menu.Trigger>
          {#snippet child({ props })}
            <Button {...props}>Options</Button>
          {/snippet}
        </Menu.Trigger>
        <Menu.Content portalTo="#menu-host-playground">
          <Menu.Item>Rename</Menu.Item>
          <Menu.Item>Duplicate</Menu.Item>
          <Menu.Separator />
          <Menu.Item>Archive</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    </div>
  {/snippet}
</Story>

<!-- The compound parts render under the `Menu` namespace; Bits supplies the menu/menuitem roles, roving focus,
     type-ahead, portalling, and collision handling. The trigger delegates to a Button via `child`. -->
<Story
  name="Dropdown menu"
  play={async ({ canvas }) => {
    onRename.mockClear();
    const trigger = canvas.getByRole("button", { name: "Options" });
    await userEvent.click(trigger);
    // AC: portalled menu with correct roles.
    const menu = await canvas.findByRole("menu");
    await expect(menu).toHaveClass("focus-ring");
    const items = canvas.getAllByRole("menuitem");
    await expect(items).toHaveLength(3);
    await expect(items[0]).toHaveClass("focus-ring");
    // AC: keyboard-navigable — ArrowDown highlights the first item.
    await userEvent.keyboard("{ArrowDown}");
    await waitFor(() => expect(items[0]).toHaveAttribute("data-highlighted"));
    // Enter selects it: onSelect fires and the menu closes.
    await userEvent.keyboard("{Enter}");
    await expect(onRename).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(canvas.queryByRole("menu")).not.toBeInTheDocument());
    await bodyInteractiveAgain();
  }}
>
  {#snippet template()}
    <div id="menu-host-main" class="bg-surface text-fg p-6">
      <Menu.Root bind:open={openMain}>
        <Menu.Trigger>
          {#snippet child({ props })}
            <Button {...props}>Options</Button>
          {/snippet}
        </Menu.Trigger>
        <Menu.Content portalTo="#menu-host-main">
          <Menu.Item onSelect={onRename}>Rename</Menu.Item>
          <Menu.Item>Duplicate</Menu.Item>
          <Menu.Separator />
          <Menu.Item>Archive</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    </div>
  {/snippet}
</Story>

<!-- `child` delegation: a menu item rendered as a router-style `<a>`, keeping the menuitem role and the themed classes
     (passed through Bits' `props`). -->
<Story
  name="Router link"
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Account" }));
    await canvas.findByRole("menu");
    const link = canvas.getByRole("menuitem", { name: "Settings" });
    // AC: the delegated element is a real anchor with an href…
    await expect(link.tagName).toBe("A");
    await expect(link).toHaveAttribute("href", "/settings");
    // …and it kept the themed item styling + focus ring from `props`.
    await expect(link).toHaveClass("focus-ring");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("menu")).not.toBeInTheDocument());
    await bodyInteractiveAgain();
  }}
>
  {#snippet template()}
    <div id="menu-host-link" class="bg-surface text-fg p-6">
      <Menu.Root bind:open={openLink}>
        <Menu.Trigger>
          {#snippet child({ props })}
            <Button {...props}>Account</Button>
          {/snippet}
        </Menu.Trigger>
        <Menu.Content portalTo="#menu-host-link">
          <Menu.Item>
            {#snippet child({ props })}
              <!-- Demo of `child` delegation to a router-style link; the story asserts the rendered <a>'s attributes
                   and never navigates, so SvelteKit's resolve() isn't in play here. -->
              <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
              <a href="/settings" {...props}>Settings</a>
            {/snippet}
          </Menu.Item>
          <Menu.Item>Sign out</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    </div>
  {/snippet}
</Story>

<!-- Nested submenu (compound `Menu.Sub`), opened from the keyboard. Grouped items carry an accessible group name via
     `Menu.GroupHeading`. -->
<Story
  name="Submenu"
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Insert" }));
    await canvas.findByRole("menu");
    // AC: the compound sub-trigger renders as a menuitem that owns a submenu.
    const subTrigger = canvas.getByRole("menuitem", { name: /More/ });
    await expect(subTrigger).toHaveAttribute("aria-haspopup");
    await expect(subTrigger).toHaveClass("focus-ring");
    // Hovering it opens the submenu; its items render (in the same host).
    await userEvent.hover(subTrigger);
    await expect(await canvas.findByRole("menuitem", { name: "From URL" })).toBeVisible();
    // Escape closes the submenu, then the menu.
    await userEvent.keyboard("{Escape}{Escape}");
    await waitFor(() => expect(canvas.queryByRole("menu")).not.toBeInTheDocument());
    await bodyInteractiveAgain();
  }}
>
  {#snippet template()}
    <div id="menu-host-sub" class="bg-surface text-fg p-6">
      <Menu.Root bind:open={openSub}>
        <Menu.Trigger>
          {#snippet child({ props })}
            <Button {...props}>Insert</Button>
          {/snippet}
        </Menu.Trigger>
        <Menu.Content portalTo="#menu-host-sub">
          <Menu.Group>
            <Menu.GroupHeading>Blocks</Menu.GroupHeading>
            <Menu.Item>Text</Menu.Item>
            <Menu.Item>Image</Menu.Item>
          </Menu.Group>
          <Menu.Separator />
          <Menu.Sub>
            <Menu.SubTrigger>More</Menu.SubTrigger>
            <Menu.SubContent>
              <Menu.Item>From URL</Menu.Item>
              <Menu.Item>Embed</Menu.Item>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </Menu.Root>
    </div>
  {/snippet}
</Story>

<!-- Daylight: open the menu so axe checks it in the other theme, then close. -->
<Story
  name="Daylight"
  globals={{ theme: "daylight" }}
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Options" }));
    await canvas.findByRole("menu");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("menu")).not.toBeInTheDocument());
    await bodyInteractiveAgain();
  }}
>
  {#snippet template()}
    <div id="menu-host-day" class="bg-surface text-fg p-6">
      <Menu.Root bind:open={openDay}>
        <Menu.Trigger>
          {#snippet child({ props })}
            <Button {...props}>Options</Button>
          {/snippet}
        </Menu.Trigger>
        <Menu.Content portalTo="#menu-host-day">
          <Menu.Item>Rename</Menu.Item>
          <Menu.Item>Duplicate</Menu.Item>
          <Menu.Separator />
          <Menu.Item>Archive</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    </div>
  {/snippet}
</Story>

<!-- Evening: open the menu so axe checks it in the default theme too, then close. -->
<Story
  name="Evening"
  globals={{ theme: "evening" }}
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Options" }));
    await canvas.findByRole("menu");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("menu")).not.toBeInTheDocument());
    await bodyInteractiveAgain();
  }}
>
  {#snippet template()}
    <div id="menu-host-eve" class="bg-surface text-fg p-6">
      <Menu.Root bind:open={openEve}>
        <Menu.Trigger>
          {#snippet child({ props })}
            <Button {...props}>Options</Button>
          {/snippet}
        </Menu.Trigger>
        <Menu.Content portalTo="#menu-host-eve">
          <Menu.Item>Rename</Menu.Item>
          <Menu.Item>Duplicate</Menu.Item>
          <Menu.Separator />
          <Menu.Item>Archive</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    </div>
  {/snippet}
</Story>
