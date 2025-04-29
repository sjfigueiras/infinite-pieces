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
    extends: ["next", "prettier", "plugin:prettier/recommended"],
    plugins: ["prettier"],
    rules: {
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
    },
  }),
];

export default eslintConfig;
