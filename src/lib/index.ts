// Public export surface for @qovira/ui — the single barrel. Every component the
// library ships is re-exported here; consumers `import { X } from "@qovira/ui"`.
// Tree-shakeable: unused components drop out of the consumer's bundle.
//
// Internal helpers (e.g. `internal/cn`) are intentionally NOT exported.

export { default as Box } from "./components/Box.svelte";

// Action controls.
export { default as Button } from "./components/Button.svelte";
export { default as IconButton } from "./components/IconButton.svelte";
export type { ButtonVariant, IconButtonSize } from "./components/button-variants.js";

// Overlays: Modal is the canonical Bits-wrapped pattern.
export { default as Modal } from "./components/Modal.svelte";
export { default as ModalTitle } from "./components/ModalTitle.svelte";
export { default as ModalDescription } from "./components/ModalDescription.svelte";

// Layout primitives.
export { default as Container } from "./components/Container.svelte";
export { default as Stack } from "./components/Stack.svelte";
export { default as Cluster } from "./components/Cluster.svelte";
export { default as Separator } from "./components/Separator.svelte";

// Typography primitives.
export { default as Heading } from "./components/Heading.svelte";
export { default as Text } from "./components/Text.svelte";

// Form controls: Field owns the a11y contract; Input/Textarea consume it.
export { default as Field } from "./components/Field.svelte";
export { default as Input } from "./components/Input.svelte";
export { default as Textarea } from "./components/Textarea.svelte";
export type { FieldContext } from "./internal/field-context.js";

// Iconography: the <Icon> wrapper and the curated Phosphor re-export set.
export * from "./icons/index.js";
