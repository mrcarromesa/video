import styles from "./styles.module.scss";

interface TooltipProgressProps {
  className: string;
  data: {
    positionX: number;
    time: string;
  };
}

const TooltipProgressTime: React.FC<TooltipProgressProps> = ({
  className,
  data,
}) => (
  <span
    className={`${styles.tooltip} ${className}`}
    style={{
      left: `${data.positionX}px`,
    }}
  >
    {data.time}
  </span>
);

export default TooltipProgressTime;
