import { Meta } from "@storybook/react";
import { ComponentStory } from "@storybook/react";
import { customDecorator } from "src/../.storybook/customDecorator";
import stylesContainer from "src/components/Media/Controls/ProgressBar/components/Container/styles.module.scss";
import styles from "src/components/Media/Controls/ProgressBar/components/ContentProgressBar/styles.module.scss";
import { ProgressBarLoaded } from "src/components/Media/Controls/ProgressBar/components/ProgressBarLoaded/index";

export default {
  title: "ProgressBar/Components/ProgressBarLoaded",
  component: ProgressBarLoaded,
  decorators: customDecorator({
    bufferedChunks: [{ start: 0, end: 10, range: 10 }],
    Wrapper: ({ children }) => (
      <div className={stylesContainer.container}>
        <div
          className={styles.progressBar}
          style={{
            width: "100px",
          }}
        >
          {children}
        </div>
      </div>
    ),
  }),
  parameters: {
    docs: { source: { excludeDecorators: true, type: "code" } },
  },
} as Meta;

const Template: ComponentStory<typeof ProgressBarLoaded> = (args) => (
  <ProgressBarLoaded {...args} />
);

export const Loaded = Template.bind({});
Loaded.args = {
  className: styles.progressBarLoaded,
};
