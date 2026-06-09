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

// Feedback: ToastProvider mounts near the app root; `toast` raises them anywhere.
export { default as ToastProvider } from "./components/ToastProvider.svelte";
export { toast } from "./internal/toast-store.svelte.js";
export type { ToastVariant, ToastOptions } from "./internal/toast-store.svelte.js";

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
export { default as Checkbox } from "./components/Checkbox.svelte";
export { default as Switch } from "./components/Switch.svelte";
export { default as RadioGroup } from "./components/RadioGroup.svelte";
export { default as RadioItem } from "./components/RadioItem.svelte";
export { default as Select } from "./components/Select.svelte";
export { default as Combobox } from "./components/Combobox.svelte";
export type { ListboxItem } from "./components/listbox-types.js";
export { default as Calendar } from "./components/Calendar.svelte";
export { default as DateField } from "./components/DateField.svelte";
export { default as DatePicker } from "./components/DatePicker.svelte";
export type { FieldContext } from "./internal/field-context.js";

// Iconography: the <Icon> wrapper and the curated Phosphor re-export set.
export * from "./icons/index.js";
