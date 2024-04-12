/** @type {import("prettier").Config} */
const config = {
  semi: false,
  printWidth: 100,
  singleQuote: false,
  plugins: ["prettier-plugin-svelte"],
  overrides: [
    {
      files: "*.svelte",
      options: {
        parser: "svelte",
      },
    },
  ],
}

export default config
