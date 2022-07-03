import { act, renderHook } from "@testing-library/react-hooks";
import { SliderButtonWrapper } from "src/../__tests__/mocks/SliderButtonProviderWrapper";
import { useMouseEvent } from "src/events/Mouse/hooks/useMouseEvent";
import { useWindowResize } from "src/events/Window/hooks/useWindowResize";

import { useSliderButton } from "./useSliderButton";

jest.mock("src/events/Mouse/hooks/useMouseEvent");
jest.mock("src/events/Window/hooks/useWindowResize");

describe("Testing useSliderButton", () => {
  beforeAll(() => {
    jest.mocked(useMouseEvent).mockImplementation(() => ({
      position: {
        x: 500,
        y: 0,
      },
      isMouseDown: true,
    }));
    jest.mocked(useWindowResize).mockImplementation(() => ({
      dimensions: {
        height: 1080,
        width: 1920,
      },
      isMobile: false,
    }));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should be return positionProgressSliderButton when handleGoToPositionInProgressBar is called", () => {
    const { result } = renderHook(() => useSliderButton(), {
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

    act(() => {
      result.current.handleGoToPositionInProgressBar();
    });

    expect(result.current.positionProgressSliderButton).toEqual(45);
  });
});
