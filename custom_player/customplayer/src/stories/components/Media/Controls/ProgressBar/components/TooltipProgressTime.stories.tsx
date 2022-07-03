import { PartialStoryFn } from "@storybook/csf/dist/story";
import { Meta, ReactFramework } from "@storybook/react";
import { ComponentStory } from "@storybook/react";
import stylesContainer from "src/components/Media/Controls/ProgressBar/components/Container/styles.module.scss";
import { TooltipProgressTime } from "src/components/Media/Controls/ProgressBar/components/TooltipProgressTime/index";
import styles from "src/components/Media/Controls/ProgressBar/components/TooltipProgressTime/styles.module.scss";

export default {
  title: "ProgressBar/Components/TooltipProgressTime",
  component: TooltipProgressTime,
  parameters: {
    docs: { source: { excludeDecorators: true, type: "code" } },
  },
} as Meta;

const Template: ComponentStory<typeof TooltipProgressTime> = (args) => (
  <TooltipProgressTime {...args} />
);

export const Tooltip = Template.bind({});

Tooltip.args = {
  className: `${stylesContainer.tooltip} ${styles.tooltip}`,
  data: { positionX: 0, time: "00:00" },
};

Tooltip.decorators = [
  (Story: PartialStoryFn<ReactFramework>) => (
    <div
      className={`${stylesContainer.container} ${stylesContainer.isHoldingSliderButton}`}
    >
      <Story />
    </div>
  ),
];
