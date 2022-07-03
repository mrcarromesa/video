import {
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
} from "@storybook/addon-docs";
import { PartialStoryFn } from "@storybook/csf/dist/story";
import { Meta, ReactFramework } from "@storybook/react";
import { ComponentStory } from "@storybook/react";
import { Container } from "src/components/Media/Controls/ProgressBar/components/Container/index";

export default {
  title: "ProgressBar/Components/Container",
  component: Container,
  parameters: {
    docs: {
      source: { excludeDecorators: true, type: "code" },
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Stories />
        </>
      ),
    },
  },
} as Meta;

const Template: ComponentStory<typeof Container> = (args) => (
  <Container {...args} />
);

export const ContainerElement = Template.bind({});

ContainerElement.decorators = [
  (Story: PartialStoryFn<ReactFramework>) => (
    <div style={{ width: "300px" }}>
      <Story />
    </div>
  ),
];

ContainerElement.args = {
  isReady: true,
  ref: {
    current: {
      getBoundingClientRect: () =>
        ({
          x: 100,
          width: 200,
        } as DOMRect),
    } as HTMLDivElement,
  },
};
