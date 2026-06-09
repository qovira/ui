// `Table` is a compound namespace — `Table.Root`, `Table.Head`, `Table.Body`,
// `Table.Row`, `Table.HeaderCell`, `Table.Cell`, `Table.Caption` — thin styled
// wrappers over the native table elements, so the semantics (and `<th scope>`)
// come free and consumers compose arbitrary cell content. Mirrors the namespace
// convention used by `Menu`.

export { default as Root } from "./TableRoot.svelte";
export { default as Caption } from "./TableCaption.svelte";
export { default as Head } from "./TableHead.svelte";
export { default as Body } from "./TableBody.svelte";
export { default as Row } from "./TableRow.svelte";
export { default as HeaderCell } from "./TableHeaderCell.svelte";
export { default as Cell } from "./TableCell.svelte";
