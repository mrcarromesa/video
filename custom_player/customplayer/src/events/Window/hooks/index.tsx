import { ReactNode } from "react";
import { WindowProvider } from "./useWindowResize";

interface WindowAppProviderProps {
  children: ReactNode;
}

const WindowAppProvider: React.FC<WindowAppProviderProps> = ({ children }) => {
  return <WindowProvider>{children}</WindowProvider>;
};

export default WindowAppProvider;
