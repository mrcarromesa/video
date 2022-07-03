import { PartialStoryFn } from "@storybook/csf/dist/story";
import { Meta, ReactFramework } from "@storybook/react";
import { ComponentStory } from "@storybook/react";
import stylesContainer from "src/components/Media/Controls/ProgressBar/components/Container/styles.module.scss";
import { ContentProgressBar } from "src/components/Media/Controls/ProgressBar/components/ContentProgressBar/index";

export default {
  title: "ProgressBar/Components/ContentProgressBar",
  component: ContentProgressBar,
  parameters: {
    docs: { source: { excludeDecorators: true } },
  },
} as Meta;

ContentProgressBar.displayName = "ContentProgressBar";

const Template: ComponentStory<typeof ContentProgressBar> = (args) => (
  <ContentProgressBar {...args} />
);

export const ContentProgressBarElement = Template.bind({});
ContentProgressBarElement.decorators = [
  (Story: PartialStoryFn<ReactFramework>) => (
    <div
      className={stylesContainer.container}
      style={{
        width: "100px",
      }}
    >
      <Story />
    </div>
  ),
];
