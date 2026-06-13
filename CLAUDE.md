# CLAUDE.md — @qovira/ui

Operating guide for Claude Code in this repo. Rules are directives; follow them.

## What this is

`@qovira/ui` — Qovira's Svelte 5 / SvelteKit component library (styled, accessible UI primitives + composites). Layers on **`@qovira/theme`** (peer dep, separate published repo): theme ships the tokens (color/type/spacing/radius/elevation/motion as Tailwind v4 utilities + the two themes); this package ships the _components_ that compose them.

- **Define no visual values here.** Every color/font/radius/shadow comes from `@qovira/theme`. If a component needs a token the theme doesn't expose, **extend the theme** — never hard-code it here.
- **Ships uncompiled `.svelte` source** via `svelte-package`; the consumer's Vite/Tailwind compiles it. Consumer must `@source "@qovira/ui"` so Tailwind sees the classes (the `style` export self-registers this).

## Stack

Svelte 5.56 / SvelteKit 2.64 / Tailwind v4.3 / Vitest 4.1 (Browser Mode, `provider: playwright()`) / Storybook 10.4 (`@storybook/sveltekit`, ESM-only). **pnpm only.** Node 24. `bits-ui` = behavioral base for interactive components; `phosphor-svelte` backs `<Icon>`.

## Conventions

- **Keep `CLAUDE.md` + `README.md` current in the same change.** When a change alters what either describes (stack, conventions, public component/prop surface, the gate, versioning/release flow), update that doc now — never as a follow-up.
- **Author components in `@qovira/theme` semantic utilities only** (`bg-surface`, `text-text`, `focus-ring`, `rounded-md`, `text-button`, …).
- **`focus-ring` on every interactive component, appended LAST in the `cn()` call** so a consumer `class` can't merge it away. Never strip it via the escape hatch — most-enforced a11y rule.
- **`cn()`** (`src/lib/internal/cn.ts`, clsx + tailwind-merge) merges consumer `class` onto the root so consumer classes win conflicts. Extended to treat theme `text-<role>` typography utilities as a `font-size` group so role + color (`text-body text-text`) don't collapse. Internal — not exported.
- **Public surface = single barrel `src/lib/index.ts`.** Internal imports are **relative with explicit `.js`/`.svelte` extensions** (svelte-package requirement), never `$lib`.
- **Export consumer-facing types from a plain `.ts`** (e.g. `button-variants.ts`, `icons/types.ts`), never re-exported from a `.svelte` module — the ambient `*.svelte` type carries only the default export, so `tsc`/`svelte-check` can't see named type re-exports from `.svelte`.
- **Stories:** Svelte CSF (`*.stories.svelte`, `defineMeta`), co-located, `tags: ['autodocs']`, a11y `test: 'error'`. Any story rendering custom markup or multiple instances → use `{#snippet template()}…{/snippet}` (a bare `<Story>` child renders _as the meta component's children_, double-wrapping compositions). Arg-only stories (`<Story args={…}/>`) need no snippet.
- **Keep `.svelte`-source deps (`phosphor-svelte`, `bits-ui`) in `optimizeDeps.exclude` (`.storybook/main.ts`) + `resolve.dedupe: ["svelte"]`** — else the optimizer prebundles them on a second Svelte runtime and rendering crashes. `scripts/clean-package.mjs` strips stories/tests from `dist`.
- **Commits:** Conventional Commits + a bare `Refs QOV-NN` footer (the release PR closes issues via magic words).
- **Contributor docs:** `CONTRIBUTING.md` (issue-first workflow, theme-utilities-only scope, "extend the theme, don't hard-code", changesets) + `CODE_OF_CONDUCT.md` (Contributor Covenant) define the external-contributor process — keep in sync with these conventions. Split: Conventional Commits + `QOV-NN` refs are maintainer-only and live here, NOT in `CONTRIBUTING.md`.

## Gate — all green before an issue is Done

```sh
pnpm run typecheck     # svelte-kit sync && tsc --noEmit
pnpm run check         # svelte-check
pnpm run lint          # eslint . && prettier --check .
pnpm test              # vitest run --project unit --project storybook
pnpm run package       # svelte-package + clean + publint
```

## Distribution & releases

- **npm `@qovira/ui`** — public, **Apache-2.0** (`LICENSE`), ships `dist/` only (`files: ["dist"]`).
- **`@qovira/theme` peer floor `^1.1.0` — don't lower past `1.0.2`.** The destructive button's white-on-`error` fill only clears WCAG AA from theme `1.0.2` (`--color-error` darkened to `#cc4029`). A token-only theme change within the range doesn't force a release here.
- **Independent semver via [Changesets](https://github.com/changesets/changesets).** Record each user-facing change with `pnpm changeset`: major = removed/renamed prop, changed default, or raised `@qovira/theme` peer range; minor = new component or additive prop; patch = a fix. Full contract + flow live in the README's **Versioning & releases**; contributor note is `.changeset/README.md`.
- **Releases are tag-triggered** (`.github/workflows/release.yml`): gate runs on **Blacksmith**, then one **GitHub-hosted** `publish` job ships to npm via **Trusted Publishing** (tokenless OIDC, `id-token: write`) + a **provenance** attestation — no `NPM_TOKEN`. This is the ONE sanctioned exception to Blacksmith-everywhere (`writing-workflows`): npm OIDC + provenance don't work on self-hosted runners. Keep every other job on Blacksmith.
