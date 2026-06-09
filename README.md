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
pnpm test       # vitest run (unit + stories, in a real browser)
pnpm package    # svelte-package → dist/ (the only published output) + publint
```

`pnpm package` produces `dist/` — the uncompiled `.svelte` source plus generated
`.svelte.d.ts` types — which is the only thing published to npm (`files: ["dist"]`).

## Versioning & releases

`@qovira/ui` follows **[semantic versioning](https://semver.org)**, independent
of `@qovira/theme`. It declares the theme as a peer dependency with a compatible
range (`@qovira/theme: ^1.0.2`), so a token-only change in the theme does **not**
force a `@qovira/ui` release — the range already admits it.

The contract — what each part of the version means for you, the consumer:

| Bump      | What changed                                                                                                                             |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **major** | A breaking change: a prop removed or renamed, a component's default behavior changed, or the required `@qovira/theme` peer range raised. |
| **minor** | A backward-compatible addition: a new component, or an additive (optional) prop.                                                         |
| **patch** | A backward-compatible bug fix, with no API change.                                                                                       |

### Cutting a release

Versioning and the changelog are driven by
[Changesets](https://github.com/changesets/changesets). The flow:

1. **As you work**, record each user-facing change with a changeset — `pnpm changeset`
   prompts for the bump level (per the table above) and a summary, writing a file
   under `.changeset/`. (See `.changeset/README.md`.)
2. **To release**, run `pnpm version-packages` (`changeset version`) on `main`:
   it consumes the pending changesets, bumps `package.json`, and updates
   `CHANGELOG.md`. Commit that, then create and push a matching `vX.Y.Z` tag.
3. **The tag triggers** [`.github/workflows/release.yml`](.github/workflows/release.yml):
   the full gate runs on Blacksmith, then a single GitHub-hosted job publishes to
   npm via **Trusted Publishing** (tokenless OIDC) with a **provenance
   attestation**. Only `dist/` is in the published tarball (`files: ["dist"]`).

> **One-time npm setup** (outside this repo): on npmjs.com, configure
> `@qovira/ui`'s **Trusted Publisher** to point at this repository and the
> release workflow. No `NPM_TOKEN` secret is used — Trusted Publishing replaces
> long-lived tokens entirely.

## Contributing

Contributions are welcome — read [CONTRIBUTING.md](./CONTRIBUTING.md) first, and
please follow the [Code of Conduct](./CODE_OF_CONDUCT.md). Open an issue before
sending a PR that adds a component or changes a component's API. Components are
authored **only** in `@qovira/theme`'s semantic utilities — a missing token is a
reason to extend the theme, never to hard-code a value here.

## License

Apache-2.0 © OMNILIUM ADVANCED CYBERNETICS SRL.
