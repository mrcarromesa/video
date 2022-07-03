import { PartialStoryFn } from "@storybook/csf/dist/story";
import { Meta, ReactFramework } from "@storybook/react";
import { ComponentStory } from "@storybook/react";
import styles from "src/components/Media/Controls/ProgressBar/components/Container/styles.module.scss";
import { SliderButton } from "src/components/Media/Controls/ProgressBar/components/SliderButton/index";
import stylesSlider from "src/components/Media/Controls/ProgressBar/components/SliderButton/styles.module.scss";

export default {
  title: "ProgressBar/Components/SliderButton",
  component: SliderButton,
  parameters: {
    docs: { source: { excludeDecorators: true, type: "code" } },
  },
} as Meta;

const Template: ComponentStory<typeof SliderButton> = (args) => (
  <SliderButton {...args} />
);

export const Hidden = Template.bind({});

const decorators = [
  (Story: PartialStoryFn<ReactFramework>) => (
    <div className={styles.container}>
      <Story />
    </div>
  ),
];

Hidden.args = {
  className: styles.sliderButton,
};

Hidden.decorators = decorators;

export const Grabbing = Template.bind({});

Grabbing.args = {
  className: `${styles.sliderButton} ${stylesSlider.grabbing}`,
};

Grabbing.decorators = decorators;
