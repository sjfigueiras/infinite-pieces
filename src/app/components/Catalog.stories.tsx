import type { Meta, StoryObj } from "@storybook/react";

import Catalog from "./Catalog";

const meta: Meta<typeof Catalog> = {
  component: Catalog,
};

type Story = StoryObj<typeof Catalog>;

export const Default: Story = {};

export default meta;
