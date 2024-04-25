import antfu from "@antfu/eslint-config"

export default antfu({
  svelte: true,
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: "double", // or 'double'
  },
  typescript: {
    tsconfigPath: "tsconfig.json",
  },
  ignores: ["**/fixtures"],
  formatters: {
    css: true,
    html: true,
    markdown: "prettier",
  },
})
