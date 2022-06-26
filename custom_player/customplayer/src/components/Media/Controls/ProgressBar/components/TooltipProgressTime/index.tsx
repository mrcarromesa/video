import { forwardRef } from "react";

import styles from "./styles.module.scss";

interface TooltipProgressProps {
  className: string;
  data: {
    positionX: number;
    time: string;
  };
}

export const TooltipProgressTime = forwardRef<
  HTMLDivElement,
  TooltipProgressProps
>(({ className, data }, ref) => (
  <div
    ref={ref}
    className={`${styles.tooltip} ${className}`}
    style={{
      left: `${data.positionX}px`,
    }}
  >
    {data.time}
  </div>
));

TooltipProgressTime.displayName = "TooltipProgressTime";
