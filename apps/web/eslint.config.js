import antfu from "@antfu/eslint-config"

export default antfu({
  svelte: true,
  stylistic: true,
  stylistic: {
    indent: 2, // 4, or 'tab'
    quotes: "double", // or 'double'
  },

  // TypeScript and Vue are auto-detected, you can also explicitly enable them:
  // typescript: true,
  typescript: {
    tsconfigPath: "tsconfig.json",
  },

  // `.eslintignore` is no longer supported in Flat config, use `ignores` instead
  ignores: [
    "**/fixtures",
    // ...globs
  ],
  formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
     * By default uses Prettier
     */
    css: true,
    /**
     * Format HTML files
     * By default uses Prettier
     */
    html: true,
    /**
     * Format Markdown files
     * Supports Prettier and dprint
     * By default uses Prettier
     */
    markdown: "prettier",
  },
})
