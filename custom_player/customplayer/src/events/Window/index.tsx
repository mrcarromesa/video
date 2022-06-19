import { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';

interface PropsDimension {
  dimension: {
    width: number;
    height: number;
  }
}


interface WindowComponentProps {
  component: React.ComponentType<PropsDimension>;
}

const Window: React.FC<WindowComponentProps> = ({
  component: Component,
  ...rest
}) => {

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {

    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }

    const debouncedHandleResize = debounce(handleResize, 1000);

    

    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };

  }, []);

  return (<Component dimension={dimensions} {...rest} />);
}

export default Window;

/**
 * 
 * Utilizacao:
 * 
 * <Window component={({width, height}) => <MyComponent width={width} height={height} />} />
 */