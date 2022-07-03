import { PartialStoryFn } from "@storybook/csf/dist/story";
import { Meta, ReactFramework } from "@storybook/react";
import { ComponentStory } from "@storybook/react";
import stylesContainer from "src/components/Media/Controls/ProgressBar/components//Container/styles.module.scss";
import styles from "src/components/Media/Controls/ProgressBar/components//ContentProgressBar/styles.module.scss";
import { PlayedProgress } from "src/components/Media/Controls/ProgressBar/components/PlayedProgress/index";

export default {
  title: "ProgressBar/Components/PlayedProgress",
  component: PlayedProgress,
  parameters: {
    docs: { source: { excludeDecorators: true, type: "code" } },
  },
} as Meta;

const Template: ComponentStory<typeof PlayedProgress> = (args) => (
  <PlayedProgress {...args} />
);

export const PlayedProgressElement = Template.bind({});

PlayedProgressElement.args = {
  className: `${styles.progressBarPlayed}`,
};

PlayedProgressElement.decorators = [
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
