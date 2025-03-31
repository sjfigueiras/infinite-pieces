import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const webVitals = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

const eslintConfig = [
  ...webVitals,
  ...compat.config({
    extends: ["next", "prettier", "plugin:prettier/recommended"], // Added Prettier integration
    plugins: ["prettier"], // Added Prettier plugin
    rules: {
      "prettier/prettier": "error", // Enforce Prettier formatting as ESLint errors
    },
  }),
];

export default eslintConfig;
