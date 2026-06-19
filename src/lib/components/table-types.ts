/** A sortable column header's state — drives `aria-sort` and the caret. Exported as a plain type (not from a `.svelte`
 * module) so consumers can annotate. */
export type TableSortDirection = "asc" | "desc" | "none";
