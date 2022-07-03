import { PartialStoryFn } from "@storybook/csf/dist/story";
import { Meta, ReactFramework } from "@storybook/react";
import { ComponentStory } from "@storybook/react";
import stylesContainer from "src/components/Media/Controls/ProgressBar/components/Container/styles.module.scss";
import styles from "src/components/Media/Controls/ProgressBar/components/ContentProgressBar/styles.module.scss";
import { LineHoverProgress } from "src/components/Media/Controls/ProgressBar/components/LineHoverProgress/index";

export default {
  title: "ProgressBar/Components/LineHoverProgress",
  component: LineHoverProgress,
  parameters: {
    docs: { source: { excludeDecorators: true, type: "code" } },
  },
} as Meta;

const Template: ComponentStory<typeof LineHoverProgress> = (args) => (
  <LineHoverProgress {...args} />
);

export const LineHoverProgressElement = Template.bind({});

LineHoverProgressElement.args = {
  className: `${styles.progressBarPreview}`,
  positionX: 0.5,
};

LineHoverProgressElement.decorators = [
  (Story: PartialStoryFn<ReactFramework>) => (
    <div
      className={stylesContainer.container}
      style={{
        width: "100px",
      }}
    >
      <div className={`${styles.progressBar}`}>
        <Story />
      </div>
    </div>
  ),
];
