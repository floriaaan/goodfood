const nextConfig = require("eslint-config-next");
const tanstackQuery = require("@tanstack/eslint-plugin-query");
const eslintConfigPrettier = require("eslint-config-prettier");
const eslintPluginPrettier = require("eslint-plugin-prettier");
const typescriptEslint = require("typescript-eslint");

module.exports = [
  ...nextConfig,
  ...tanstackQuery.configs["flat/recommended"],
  eslintConfigPrettier,
  {
    plugins: {
      prettier: eslintPluginPrettier,
      "@typescript-eslint": typescriptEslint.plugin,
      "@tanstack/query": tanstackQuery,
    },
    languageOptions: {
      globals: {
        JSX: "readonly",
      },
    },
    rules: {
      "no-console": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "prettier/prettier": [0, { endOfLine: "auto" }],
      "@tanstack/query/exhaustive-deps": "warn",
    },
  },
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts", "node_modules/**"],
  },
];
