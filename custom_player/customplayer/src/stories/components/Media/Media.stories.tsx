import {
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
} from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { ComponentStory } from "@storybook/react";
import { Media } from "src/components/Media";

export default {
  title: "ProgressBar/Example/Media",
  component: Media,
  parameters: {
    docs: {
      source: { excludeDecorators: true },
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description markdown='<p>This example uses an excerpt from the <a href="https://durian.blender.org/" class="external" rel=" noopener">Sintel open movie</a>, created by the <a href="https://www.blender.org/about/foundation/" class="external" rel=" noopener">Blender Foundation</a>.</p>' />
          <Primary />
          <Stories />
        </>
      ),
    },
  },
} as Meta;

const Template: ComponentStory<typeof Media> = (args) => <Media {...args} />;

export const MediaElement = Template.bind({});

MediaElement.args = {
  src: "https://iandevlin.github.io/mdn/video-player-with-captions/video/sintel-short.mp4",
  type: "video/mp4",
  startIn: 22,
};
