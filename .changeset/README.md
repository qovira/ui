# Changesets

This folder is managed by [Changesets](https://github.com/changesets/changesets) —
it drives `@qovira/ui`'s versioning and changelog.

When you make a change that should ship in a release, add a changeset:

```sh
pnpm changeset
```

It asks for the bump level and a summary, then writes a markdown file here. Pick
the level by the semver contract (see the **Versioning & releases** section of
the README):

- **major** — a public-API break, and only that: removing/renaming a prop, or changing a component's default behavior.
- **minor** — a backward-compatible addition: a new component, an additive prop, or raising the required `@qovira/theme` peer range (which leaves `@qovira/ui`'s own API unchanged).
- **patch** — a bug fix with no API change.

A token-only change in `@qovira/theme` does **not** require a `@qovira/ui`
release — the peer range (`^1`) already admits it.

At release time the accumulated changesets are consumed by `changeset version`,
which bumps `package.json` and writes `CHANGELOG.md`. See the README for the
full release flow.
