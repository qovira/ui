import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import svelteConfig from "./svelte.config.js";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "coverage", ".svelte-kit", "build", "storybook-static"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs.recommended,
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      parserOptions: {
        // `.storybook/*.svelte` (decorator wrappers) are tooling, not library source, so they sit outside the SvelteKit
        // type-checked project (`pnpm check` doesn't cover them either). Let the project service type-lint them via the
        // default inferred project rather than pulling `.storybook` into tsconfig's `include`.
        projectService: { allowDefaultProject: [".storybook/*.svelte"] },
        extraFileExtensions: [".svelte"],
        parser: tseslint.parser,
        svelteConfig,
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    // The library and its stories run in the browser (and browser-mode tests), so component/source files get the
    // browser globals (setTimeout, document, …).
    files: ["src/**"],
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      // Icons MUST be deep-imported (`phosphor-svelte/lib/<Icon>`) so they tree-shake. phosphor-svelte ships no
      // `sideEffects: false`, so a barrel import pulls its entire ~3,000-icon set into the consumer's bundle even
      // though we ship source and set `sideEffects: false`. Type-only imports erase, so they're allowed. See
      // conventions:writing-svelte.
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "phosphor-svelte",
              message:
                "Deep-import icons — `phosphor-svelte/lib/<Icon>` — so they tree-shake; the barrel inlines all ~3,000 icons. See conventions:writing-svelte.",
              allowTypeImports: true,
            },
          ],
        },
      ],
    },
  },
  {
    // Tailwind class hygiene, enforced at the CLI (the editor's Tailwind IntelliSense flags these as suggestions, but
    // those never reach `pnpm lint`). Ordering is left to prettier-plugin-tailwindcss; this covers the canonical/short
    // and correctness rules it doesn't. `entryPoint` is the v4 CSS so the plugin resolves our @qovira/theme utilities
    // (focus-ring, bg-surface, …) as known classes. Classes live in `class=` attributes (default), in `cn()` calls, and
    // in the SCREAMING_SNAKE recipe constants under internal/ — the last two are named explicitly so they get linted.
    files: ["src/**/*.{svelte,ts}"],
    plugins: { "better-tailwindcss": betterTailwindcss },
    settings: {
      "better-tailwindcss": {
        entryPoint: "src/app.css",
        callees: ["cn", "cva", "clsx", "twMerge", "cx", "tv"],
        variables: [
          ["MENU_ITEM_BASE", [{ match: "strings" }]],
          ["MENU_PANEL_BASE", [{ match: "strings" }]],
          ["CALENDAR_NAV_BUTTON", [{ match: "strings" }]],
          ["CALENDAR_SELECT", [{ match: "strings" }]],
          ["CALENDAR_DAY", [{ match: "strings" }]],
          ["BADGE_BASE", [{ match: "strings" }]],
          ["BADGE_TONE", [{ match: "objectValues" }, { match: "strings" }]],
          ["STATUS_TINT", [{ match: "objectValues" }]],
          ["STATUS_TEXT", [{ match: "objectValues" }]],
          ["FIELD_CONTROL_BASE", [{ match: "strings" }]],
          ["LISTBOX_CONTENT_BASE", [{ match: "strings" }]],
          ["LISTBOX_ITEM_BASE", [{ match: "strings" }]],
          ["VARIANTS", [{ match: "objectValues" }, { match: "strings" }]],
        ],
      },
    },
    rules: {
      "better-tailwindcss/enforce-canonical-classes": "error",
      "better-tailwindcss/enforce-shorthand-classes": "error",
      "better-tailwindcss/no-conflicting-classes": "error",
      "better-tailwindcss/no-deprecated-classes": "error",
      "better-tailwindcss/no-duplicate-classes": "error",
      "better-tailwindcss/no-unnecessary-whitespace": "error",
    },
  },
  prettier,
);
