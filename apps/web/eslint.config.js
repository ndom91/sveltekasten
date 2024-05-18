import antfu from "@antfu/eslint-config"
// Rules: https://eslint-config.antfu.me/rules

export default antfu(
  {
    lessOpinionated: true,
    svelte: true,
    stylistic: {
      semi: false,
      indent: 2,
      quotes: "double",
    },
    typescript: {
      tsconfigPath: "tsconfig.json",
      overrides: {
        "ts/no-unsafe-call": ["off", "never"],
        "ts/no-unsafe-argument": ["off", "never"],
        "ts/no-unsafe-assignment": ["off", "never"],
        "ts/no-unsafe-member-access": ["off", "never"],
        "ts/no-use-before-define": ["off", "warn"],
      },
    },
    ignores: ["**/fixtures"],
    formatters: {
      css: true,
      html: true,
      markdown: "prettier",
    },
  },
  {
    rules: {
      "prefer-regex-literals": ["off", "never"],
      "no-console": ["off", "never"],
      "node/prefer-global/process": ["off", "never"],
      "style/brace-style": ["warn", "1tbs"],
    },
  },
)
