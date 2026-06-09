// The compound `Menu` namespace. Re-exports the parts so consumers write
// `Menu.Root`, `Menu.Item`, `Menu.Separator`, … — the convention Bits itself
// uses (`export * as DropdownMenu`). The barrel re-exports this as
// `export * as Menu`, so `import { Menu } from "@qovira/ui"` carries the lot.
export { default as Root } from "./MenuRoot.svelte";
export { default as Trigger } from "./MenuTrigger.svelte";
export { default as Content } from "./MenuContent.svelte";
export { default as Item } from "./MenuItem.svelte";
export { default as Separator } from "./MenuSeparator.svelte";
export { default as Group } from "./MenuGroup.svelte";
export { default as GroupHeading } from "./MenuGroupHeading.svelte";
export { default as Sub } from "./MenuSub.svelte";
export { default as SubTrigger } from "./MenuSubTrigger.svelte";
export { default as SubContent } from "./MenuSubContent.svelte";
