import antfu from "@antfu/eslint-config"
// Rules: https://eslint-config.antfu.me/rules

export default antfu({
  stylistic: {
    semi: false,
    indent: 2,
    quotes: "double",
  },
  typescript: {
    tsconfigPath: "tsconfig.json",
  },
  ignores: ["**/fixtures"],
  formatters: {
    css: true,
    html: true,
  },
}, {
  rules: {
    "no-console": ["off", "never"],
    "node/prefer-global/process": ["off", "never"],
  },
})
