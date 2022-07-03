import { renderHook } from "@testing-library/react-hooks";
import { SliderButtonWrapper } from "src/../__tests__/mocks/SliderButtonProviderWrapper";

import { usePlayedProgress } from "./usePlayedProgress";

describe("Testing usePlayedProgress", () => {
  it("should be return positionProgressPlayed value", () => {
    const { result } = renderHook(() => usePlayedProgress(), {
      wrapper: ({ children }: any) =>
        SliderButtonWrapper({
          children,
          initialState: {
            bufferedChunks: [
              {
                end: 10,
                range: 10,
                start: 0,
              },
            ],
            containerProgressBar: {
              width: 100,
              x: 0,
            },
            progressBarSliderButton: {
              width: 10,
              x: 50,
            },
            mediaData: {
              currentTime: 5,
              duration: 10,
            },
          },
        }),
    });

    expect(result.current.positionProgressPlayed).toEqual(50);
  });
});
