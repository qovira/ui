// Public export surface for @qovira/ui — the single barrel. Every component the
// library ships is re-exported here; consumers `import { X } from "@qovira/ui"`.
// Tree-shakeable: unused components drop out of the consumer's bundle.
//
// Internal helpers (e.g. `internal/cn`) are intentionally NOT exported.

export { default as Box } from "./components/Box.svelte";
