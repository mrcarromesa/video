interface PlayedProps {
  className: string;
  seekPositionX: number;
}

const Played: React.FC<PlayedProps> = ({
  className,
  seekPositionX,
}) => {
  return (
    <div
    className={`${className}`}
    style={{
      width: `${seekPositionX}%`,
    }}
  ></div>);
}

export default Played;