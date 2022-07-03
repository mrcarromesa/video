import { act, renderHook } from "@testing-library/react-hooks";
import { SliderButtonWrapper } from "src/../__tests__/mocks/SliderButtonProviderWrapper";
import * as useSliderButtonHook from "src/components/Media/Controls/ProgressBar/hooks/useSliderButton";
import { useMouseEvent } from "src/events/Mouse/hooks/useMouseEvent";
import { useWindowResize } from "src/events/Window/hooks/useWindowResize";

import { useHoverProgressBarTooltip } from "./useHoverProgressBarTooltip";

jest.mock("src/events/Mouse/hooks/useMouseEvent");
jest.mock("src/events/Window/hooks/useWindowResize");

describe("Testing useHoverProgressBarTooltip", () => {
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

  it("should be return position and time to set in tooltip when elements found", () => {
    const { result } = renderHook(
      () =>
        useHoverProgressBarTooltip({
          containerRef: {
            current: {
              getBoundingClientRect: () =>
                ({
                  x: 100,
                  width: 200,
                } as DOMRect),
            } as HTMLDivElement,
          },
          tooltipProgressTimeRef: {
            current: {
              getBoundingClientRect: () =>
                ({
                  x: 10,
                  width: 60,
                } as DOMRect),
            } as HTMLDivElement,
          },
        }),
      {
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
      }
    );

    const { onHoverProgressBarTooltip } = result.current;
    act(() => {
      onHoverProgressBarTooltip();
    });

    expect(result.current.hoverPlayerTimeTooltip.time).toEqual("00:10");
  });

  it("should be return position and time equal zero when position x container is more than position x from mouse to set in tooltip when elements found", () => {
    const { result } = renderHook(
      () =>
        useHoverProgressBarTooltip({
          containerRef: {
            current: {
              getBoundingClientRect: () =>
                ({
                  x: 502,
                  width: 200,
                } as DOMRect),
            } as HTMLDivElement,
          },
          tooltipProgressTimeRef: {
            current: {
              getBoundingClientRect: () =>
                ({
                  x: 10,
                  width: 60,
                } as DOMRect),
            } as HTMLDivElement,
          },
        }),
      {
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
      }
    );

    const { onHoverProgressBarTooltip } = result.current;
    act(() => {
      onHoverProgressBarTooltip();
    });

    expect(result.current.hoverPlayerTimeTooltip.time).toEqual("00:00");
  });

  it("should be return position and time equal zero when position x container is more than position x from mouse to set in tooltip when elements found", async () => {
    jest.spyOn(useSliderButtonHook, "useSliderButton").mockReturnValueOnce({
      mediaData: {
        currentTime: 5,
        duration: 10,
      },
      progressBarSliderButton: {
        getBoundingClientRect: () =>
          ({
            x: 50,
            with: 10,
          } as unknown as DOMRect),
      } as HTMLDivElement,
      isHoldingSliderButton: true,
    } as any);
    const { result } = renderHook(
      () =>
        useHoverProgressBarTooltip({
          containerRef: {
            current: {
              getBoundingClientRect: () =>
                ({
                  x: 502,
                  width: 200,
                } as DOMRect),
            } as HTMLDivElement,
          },
          tooltipProgressTimeRef: {
            current: {
              getBoundingClientRect: () =>
                ({
                  x: 10,
                  width: 60,
                } as DOMRect),
            } as HTMLDivElement,
          },
        }),
      {
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
      }
    );

    expect(result.current.hoverPlayerTimeTooltip.time).toEqual("00:00");
  });
});
