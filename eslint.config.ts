import js from "@eslint/js"
import ts from "typescript-eslint"
import svelte from "eslint-plugin-svelte"
import prettier from "eslint-config-prettier"
import globals from "globals"
import pluginImportX from "eslint-plugin-import-x"
import svelteParser from "svelte-eslint-parser"

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs["flat/recommended"],
  {
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: ts.parser,
        project: ["./tsconfig.json"],
        extraFileExtensions: [".svelte"],
      },
    },
    settings: {
      "import-x/extensions": [".ts"],
      "import-x/parsers": {
        "@typescript-eslint/parser": [".ts"],
        typescript: {
          project: ["./tsconfig.json", "./.svelte-kit/tsconfig.json"],
        },
      },
      "import-x/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".svelte"],
        },
        typescript: {
          project: ["./tsconfig.json", "./.svelte-kit/tsconfig.json"],
        },
      },
    },
    plugins: {
      "import-x": pluginImportX,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unsafe-call": ["off", "never"],
      "@typescript-eslint/no-unsafe-argument": ["off", "never"],
      "@typescript-eslint/no-unsafe-assignment": ["off", "never"],
      "@typescript-eslint/no-unsafe-member-access": ["off", "never"],
      "@typescript-eslint/no-use-before-define": ["off", "warn"],
      "@typescript-eslint/no-explicit-any": ["off", "warn"],
      "import-x/no-cycle": "error",
      "import-x/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
            orderImportKind: "asc",
            caseInsensitive: false,
          },
          groups: [
            "index",
            "sibling",
            "parent",
            "internal",
            "external",
            "builtin",
            "object",
            "type",
          ],
        },
      ],
      "import-x/no-unresolved": [
        "error",
        {
          ignore: ["^\\$app", "^\\$env"],
        },
      ],
      "import-x/no-relative-packages": "error", // Don't allow packages to have relative imports between each other
    },
  },
  prettier,
  ...svelte.configs["flat/prettier"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        extraFileExtensions: [".svelte"],
        parser: ts.parser,
      },
    },
  },
  {
    ignores: [
      "build/",
      ".svelte-kit/",
      "dist/",
      "dev-dist/",
      "eslint.config.js",
      "src/service-worker.ts",
    ],
  },
)
