import { forwardRef } from "react";
import { useWindowResize } from "src/events/Window/hooks/useWindowResize";

import { useSliderButton } from "../../hooks/useSliderButton";
import styles from "./styles.module.scss";

interface SliderButtonProps {
  className: string;
}

export const SliderButton = forwardRef<HTMLDivElement, SliderButtonProps>(
  ({ className }, ref) => {
    const {
      isHoldingSliderButton,
      handleHoldSliderButton,
      positionProgressSliderButton,
    } = useSliderButton();
    const { isMobile } = useWindowResize();
    return (
      <div
        ref={ref}
        className={`
        ${className}
        ${isHoldingSliderButton ? styles.grabbing : ""}
        ${isMobile ? styles.isMobile : ""}
        `}
        style={{
          marginLeft: `${positionProgressSliderButton || 0}%`,
        }}
        onMouseDown={handleHoldSliderButton}
      />
    );
  }
);

SliderButton.displayName = "SliderButton";
