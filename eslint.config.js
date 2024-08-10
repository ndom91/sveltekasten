import js from "@eslint/js"
import ts from "typescript-eslint"
import svelte from "eslint-plugin-svelte"
import prettier from "eslint-config-prettier"
import globals from "globals"
import pluginImportX from "eslint-plugin-import-x"
import svelteParser from "svelte-eslint-parser"

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  ...svelte.configs["flat/recommended"],
  prettier,
  ...svelte.configs["flat/prettier"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["apps/web/**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        project: ["./apps/web/tsconfig.json", "./apps/web/.svelte-kit/tsconfig.json"],
        extraFileExtensions: [".svelte"],
        parser: ts.parser,
      },
    },
  },
  {
    // files: ['**/*.ts'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        project: ["./apps/*/tsconfig.json", "./apps/web/.svelte-kit/tsconfig.json"],
        extraFileExtensions: [".svelte"],
        parser: ts.parser,
      },
    },
    settings: {
      "import-x/extensions": [".ts"],
      "import-x/parsers": {
        "@typescript-eslint/parser": [".ts"],
        typescript: {
          project: "apps/*/tsconfig.json",
        },
      },
      "import-x/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".svelte"],
        },
        typescript: {
          project: "apps/*/tsconfig.json",
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
      "import-x/no-cycle": 0,
      "import-x/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
          },
          groups: [
            "external",
            "index",
            "sibling",
            "parent",
            "internal",
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
  {
    ignores: [
      "**/build/",
      "**/.svelte-kit/",
      "**/dist/",
      "**/dev-dist/",
      "**/distServer/",
      "**/node_modules",
      "**/playwright.config.ts",
      "eslint.config.js",
      "apps/web/src/service-worker.ts",
    ],
  },
  // {
  //   files: ['**/*.js', '**/*.config.js', '**/*.config.ts'],
  //   ...ts.configs.disableTypeChecked,
  // },
)
