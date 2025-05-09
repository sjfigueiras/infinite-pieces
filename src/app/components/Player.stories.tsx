import type { Meta, StoryObj } from "@storybook/react";

import Player from "./Player";

const meta: Meta<typeof Player> = {
  component: Player,
};

export default meta;
type Story = StoryObj<typeof Player>;

export const Primary: Story = {
  args: {
    onPause: () => {},
    onPlay: () => {},
    piece: { title: "Test Piece", author: "Santiago Figueiras" },
    setAudioComponent: () => {},
  },
};

export const Dark: Story = {
  name: "Player/Dark",
  args: {
    onPause: () => {},
    onPlay: () => {},
    piece: { title: "Test Piece", author: "Santiago Figueiras" },
    setAudioComponent: () => {},
    theme: "dark",
  },
};

export const Light: Story = {
  name: "Player/Light",
  args: {
    onPause: () => {},
    onPlay: () => {},
    piece: { title: "Test Piece", author: "Santiago Figueiras" },
    setAudioComponent: () => {},
    theme: "light",
  },
};
