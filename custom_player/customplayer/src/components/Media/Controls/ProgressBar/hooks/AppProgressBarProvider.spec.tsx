import { render, screen } from "@testing-library/react";

import AppProgressBarProvider from ".";

describe("Testing AppProgressBarProvider", () => {
  it("should render correctly", () => {
    render(
      <AppProgressBarProvider
        bufferedChunks={[]}
        containerProgressBar={document.createElement("div")}
        progressBarSliderButton={document.createElement("div")}
        mediaData={{ duration: 10, currentTime: 1 }}
        onSeek={() => {}}
        onSeekEnd={() => {}}
        onSeekStart={() => {}}
      >
        <div>Element</div>
      </AppProgressBarProvider>
    );

    expect(screen.getByText("Element")).toBeInTheDocument();
  });
});
