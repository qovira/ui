# @qovira/ui

Qovira's Svelte 5 component library — styled, accessible primitives and
composites built on [`@qovira/theme`](https://github.com/qovira/theme)'s tokens.
Every Qovira screen (the web app and the marketing site) is built from these
components, so a `Button`, a `Modal`, a form field is identical everywhere: one
implementation, one accessibility audit, one set of states.

The components are authored entirely in `@qovira/theme`'s semantic Tailwind
utilities — `@qovira/ui` defines **no** colors, fonts, radii, or shadows of its
own.

## Install

```sh
pnpm add @qovira/ui @qovira/theme
```

`@qovira/ui` ships its components as **uncompiled Svelte source**, so your app's
own Vite/Svelte toolchain compiles them and your Tailwind build processes their
utility classes. It declares `svelte`, `tailwindcss`, and `@qovira/theme` as
**peer dependencies** — you own the versions, and there is exactly one instance
of each across your app and the library.

## Set up the styling pipeline

`@qovira/ui` defines **no** styles of its own — every value comes from
`@qovira/theme`. But because the library ships its components as source, the
utility class names they use (`bg-surface-raised`, …) live in your
`node_modules`, and Tailwind v4 only generates CSS for classes it actually
**sees** — and it ignores `node_modules` by default. So your app's stylesheet
imports the theme **and** `@qovira/ui`, the latter registering the library's
components with your Tailwind build:

```css
/* app.css */
@import "tailwindcss";
@import "@qovira/theme"; /* tokens + semantic layer */
@import "@qovira/theme/fonts"; /* self-hosted @font-face */
@import "@qovira/ui"; /* ← REQUIRED: lets Tailwind scan the components */
```

That last import resolves (via the package's `style` export) to a tiny stylesheet
inside `@qovira/ui` that points Tailwind at the library's own component source — so
you get one clean package import, exactly parallel to `@qovira/theme`, with no
`node_modules` path to hand-maintain.

> **The `@import "@qovira/ui";` line is not optional.** Without it, Tailwind never
> sees the utility classes inside the library and **the components render
> unstyled** (correct markup and behavior, no visual styling). If a `@qovira/ui`
> component shows up unstyled, this missing line is the first thing to check.

Pick the active theme by setting `data-theme="evening"` (or `"daylight"`) on
`<html>`; see `@qovira/theme` for the no-flash boot snippet and the runtime
theme switcher.

## Use

One barrel import, tree-shaken so unused components drop out of your bundle:

```svelte
<script lang="ts">
  import { Box } from "@qovira/ui";
</script>

<Box>Hello from Qovira.</Box>
```

## Develop

This repo is a SvelteKit project: `src/lib/` is the published library, `src/routes/`
is a local dev host. pnpm is the only supported package manager.

```sh
pnpm install
pnpm dev        # run the dev host app
pnpm check      # svelte-check (types + a11y + unused CSS)
pnpm lint       # eslint + prettier --check
pnpm package    # svelte-package → dist/ (the only published output) + publint
```

`pnpm package` produces `dist/` — the uncompiled `.svelte` source plus generated
`.svelte.d.ts` types — which is the only thing published to npm (`files: ["dist"]`).

## License

Apache-2.0 © OMNILIUM ADVANCED CYBERNETICS SRL.
