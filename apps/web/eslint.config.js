import { nextJsConfig } from "@workspace/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    files: ["*.config.js", "*.config.ts"],
    languageOptions: {
      globals: {
        process: "readonly",
      },
    },
  },
];
