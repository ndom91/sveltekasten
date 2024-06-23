import js from "@eslint/js"
import ts from "typescript-eslint"
import prettier from "eslint-config-prettier"
import globals from "globals"

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommendedTypeChecked,
  // This disables the formatting rules in ESLint that Prettier is going to be responsible for handling.
  // Make sure it's always the last config, so it gets the chance to override other configs.
  prettier,
  {
    ignores: ["dist", "distServer", "node_modules", "build"],
  },
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.{js,jsx,cjs,mjs}"],
    ...ts.configs.disableTypeChecked
  },
);
