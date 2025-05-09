/**
 * Change the auto-generated file name to `postcss.config.mjs`
 * given the issue with Storybook.
 *
 * The resolution is pointed here:"
 * https://github.com/storybookjs/storybook/issues/30208#issuecomment-2830668556
 */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
