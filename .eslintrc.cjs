module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": "latest",
    "extraFileExtensions": [
      ".svelte"
    ]
  },
  "overrides": [
    {
      "files": [
        "*.svelte"
      ],
      "parser": "svelte-eslint-parser",
      "parserOptions": {
        "parser": "@typescript-eslint/parser"
      }
    }
  ]
}
