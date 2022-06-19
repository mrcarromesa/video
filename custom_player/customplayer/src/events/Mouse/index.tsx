import { useEffect, useState } from 'react';

interface PropsPosition {
  position: {
    x: number;
    y: number;
  };
}

interface MouseComponentProps {
  component: React.ComponentType<PropsPosition>;
  onMouseMove?: (position: PropsPosition['position']) => void;
  onMouseUp?: () => void;
}

const Mouse: React.FC<MouseComponentProps> = ({
  component: Component,
  onMouseMove,
  onMouseUp,
}) => {

  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const setFromEvent = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", setFromEvent);

    return () => {
      window.removeEventListener("mousemove", setFromEvent);
    };
  }, []);

  useEffect(() => {
    if (onMouseMove) {
      onMouseMove(position);
    }
  }, [onMouseMove, position]);
  
  useEffect(() => {

    const setFromEvent = (e: MouseEvent) => {
      if (onMouseUp) {
        onMouseUp();
      }
    }

    window.addEventListener("mouseup", setFromEvent);

    return () => {
      window.removeEventListener("mouseup", setFromEvent);
    };

  }, [onMouseUp]);

  return (<Component position={position} />);
}

export default Mouse;