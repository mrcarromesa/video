import { PartialStoryFn } from "@storybook/csf/dist/story";
import { ReactFramework } from "@storybook/react";
import { ReactNode } from "react";
import AppProgressBarProvider from "../src/components/Media/Controls/ProgressBar/hooks";
import { BufferedChunk } from "../src/components/Media/dtos/MediaDataDTO";

interface WrapperProps {
  children: ReactNode;
}


interface CustomDecoratorProps {
  bufferedChunks: BufferedChunk[];
  Wrapper?: ({ children }: WrapperProps) => JSX.Element;
}

export const customDecorator = ({ bufferedChunks, Wrapper }: CustomDecoratorProps) => [
  (Story: PartialStoryFn<ReactFramework>) => (
    <AppProgressBarProvider
          bufferedChunks={bufferedChunks}
          containerProgressBar={document.createElement("div")}
          mediaData={{
            currentTime: 5,
            duration: 10,
          }}
          progressBarSliderButton={document.createElement("div")}
          onSeek={() => {}}
          onSeekEnd={() => {}}
          onSeekStart={() => {}}
        >
          {Wrapper ? (
            <Wrapper>
                <Story />
            </Wrapper>) : (<Story />)}
        </AppProgressBarProvider>
  ),
];