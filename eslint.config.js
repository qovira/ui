import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import svelteConfig from "./svelte.config.js";

export default tseslint.config(
  { ignores: ["dist", "node_modules", "coverage", ".svelte-kit", "build"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs.recommended,
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      parserOptions: {
        projectService: true,
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
    // The library and its stories run in the browser (and browser-mode tests),
    // so component/source files get the browser globals (setTimeout, document, …).
    files: ["src/**"],
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      // Icons MUST be deep-imported (`phosphor-svelte/lib/<Icon>`) so they tree-shake.
      // phosphor-svelte ships no `sideEffects: false`, so a barrel import pulls its
      // entire ~3,000-icon set into the consumer's bundle even though we ship source
      // and set `sideEffects: false`. Type-only imports erase, so they're allowed.
      // See conventions:writing-svelte.
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
  prettier,
);
