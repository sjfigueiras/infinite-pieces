import React from "react";
import None, { NoneProps } from "../../app/components/sketches/None";

export default {
    title: "Components/Sketches/None",
    component: None,
}

const Template = (args: NoneProps) => <None {...args} />;

export const Default = Template.bind({});