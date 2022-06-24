import { forwardRef } from "react";
import { useWindowResize } from "src/events/Window/hooks/useWindowResize";

import { useProgressBar } from "../../hooks/useProgressBar";
import styles from "./styles.module.scss";

interface GrabButtonProps {
  className: string;
}

const GrabButton = forwardRef<HTMLDivElement, GrabButtonProps>(
  ({ className }, ref) => {
    const {
      isHoldingSliderButton,
      handleHoldSliderButton,
      positionProgressGrabButton,
    } = useProgressBar();
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
          marginLeft: `${positionProgressGrabButton || 0}%`,
        }}
        onMouseDown={handleHoldSliderButton}
      />
    );
  }
);

GrabButton.displayName = "GrabButton";

export default GrabButton;
