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

- **major** — removing/renaming a prop, changing a component's default
  behavior, or raising the required `@qovira/theme` peer range.
- **minor** — a new component, or an additive prop.
- **patch** — a bug fix with no API change.

A token-only change in `@qovira/theme` does **not** require a `@qovira/ui`
release — the peer range (`^1`) already admits it.

At release time the accumulated changesets are consumed by `changeset version`,
which bumps `package.json` and writes `CHANGELOG.md`. See the README for the
full release flow.
