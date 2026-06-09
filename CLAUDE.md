# CLAUDE.md — @qovira/ui

Guidance for Claude Code working in this repository.

## What this is

`@qovira/ui` is Qovira's Svelte 5 / SvelteKit component library — styled,
accessible UI primitives and composites. It layers on **`@qovira/theme`** (a
peer dependency, separate published repo): the theme ships the tokens
(color/type/spacing/radius/elevation/motion as Tailwind v4 utilities and the two
themes), this package ships the _components_ that compose them.

- **`@qovira/ui` defines no visual values of its own** — every color, font,
  radius, and shadow comes from `@qovira/theme`. A component that needs a token
  the theme doesn't expose is a signal to **extend the theme**, not to hard-code
  here. (See the Known Issues below for a live example of why this matters.)
- Ships **uncompiled `.svelte` source** via `svelte-package`; the consumer's own
  Vite/Tailwind compiles it. So the consumer must `@source "@qovira/ui"` for
  Tailwind to see the classes (a `style` export self-registers this).

## Stack

Svelte 5.56 / SvelteKit 2.64 / Tailwind v4.3 / Vitest 4.1 (Browser Mode,
`provider: playwright()`) / Storybook 10.4 (`@storybook/sveltekit`, ESM-only).
**pnpm only.** Node 24. `bits-ui` is the behavioral base for interactive
components; `phosphor-svelte` backs `<Icon>`.

## Conventions

- Components authored **only** in `@qovira/theme` semantic utilities
  (`bg-surface`, `text-text`, `focus-ring`, `rounded-md`, `text-button`, …).
- `cn()` (`src/lib/internal/cn.ts`, clsx + tailwind-merge) merges a consumer
  `class` onto the root so consumer classes win conflicts. It's extended to
  treat the theme's `text-<role>` typography utilities as a `font-size` group so
  a role and a color (`text-body text-text`) don't collapse. Internal — not
  exported.
- **`focus-ring` is the most-enforced a11y rule.** Every interactive component
  applies it, appended **last** in the `cn()` call so a consumer's `class` can't
  merge it away. Never remove it via the escape hatch.
- Public surface is the single barrel `src/lib/index.ts`. Internal imports are
  **relative with explicit `.js`/`.svelte` extensions** (svelte-package
  requirement), never `$lib`.
- Types that consumers need are exported from a plain `.ts` (e.g.
  `button-variants.ts`, `icons/types.ts`), **not** re-exported from a `.svelte`
  module — the ambient `*.svelte` type only carries the default export, so
  `tsc`/`svelte-check` can't see named type re-exports from `.svelte`.
- Stories: Svelte CSF (`*.stories.svelte`, `defineMeta`), co-located,
  `tags: ['autodocs']`, a11y `test: 'error'`. For any story rendering custom
  markup or multiple instances, use `{#snippet template()}…{/snippet}` (a bare
  `<Story>` child renders _as the meta component's children_, which double-wraps
  compositions). Arg-only stories (`<Story args={…}/>`) are fine without it.
- Deps shipping `.svelte` source (`phosphor-svelte`, `bits-ui`) must stay in
  `optimizeDeps.exclude` (`.storybook/main.ts`) + `resolve.dedupe: ["svelte"]`,
  or the optimizer prebundles them on a second Svelte runtime and rendering
  crashes. `scripts/clean-package.mjs` strips stories/tests from `dist`.
- Commits: Conventional Commits + a bare `Refs QOV-NN` footer (the release PR
  closes issues with magic words).
- Contributor docs: `CONTRIBUTING.md` (issue-first workflow, the
  theme-utilities-only scope, the cross-repo "extend the theme, don't hard-code"
  rule, changesets) and `CODE_OF_CONDUCT.md` (Contributor Covenant) define the
  external-contributor process; keep them in sync with these conventions. Note
  the split: contributors don't need Conventional Commits or `QOV-NN` refs (both
  maintainer-only) — that lives here, not in `CONTRIBUTING.md`.

## Gate (all must be green before an issue is Done)

```sh
pnpm run typecheck     # svelte-kit sync && tsc --noEmit
pnpm run check         # svelte-check
pnpm run lint          # eslint . && prettier --check .
pnpm test              # vitest run --project unit --project storybook
pnpm run package       # svelte-package + clean + publint
```

## Distribution & releases

- Published to npm as **`@qovira/ui`** — public, **Apache-2.0** (`LICENSE`),
  shipping `dist/` only (`files: ["dist"]`). `@qovira/theme` is a **peer** at
  `^1.0.2` — the floor is `1.0.2` because the destructive button's white-on-`error`
  fill only clears WCAG AA from theme `1.0.2` (`--color-error` darkened to
  `#cc4029`); don't lower it. A token-only theme change within that range doesn't
  force a release here.
- **Independent semver, driven by [Changesets](https://github.com/changesets/changesets).**
  Record each user-facing change with `pnpm changeset` (major = a removed/renamed
  prop, a changed default, or a raised `@qovira/theme` peer range; minor = a new
  component or additive prop; patch = a fix). The full semver contract and the
  release flow live in the README's **Versioning & releases** section; the
  contributor note is `.changeset/README.md`.
- Releases are **tag-triggered** (`.github/workflows/release.yml`): the gate runs
  on **Blacksmith**, then a single **GitHub-hosted** `publish` job ships to npm
  via **Trusted Publishing** (tokenless OIDC, `id-token: write`) with a
  **provenance** attestation — no `NPM_TOKEN`. This is the **one** sanctioned
  exception to the Blacksmith-everywhere rule (`writing-workflows`): npm OIDC and
  provenance don't work on self-hosted runners. Keep every other job on Blacksmith.
