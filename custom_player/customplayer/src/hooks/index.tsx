import { ReactNode } from "react";
import MouseAppProvider from "src/events/Mouse/hooks";
import WindowAppProvider from "src/events/Window/hooks";

interface AppProvider {
  children: ReactNode;
}

const AppPlayerProvider: React.FC<AppProvider> = ({ children }) => {
  return (
    <WindowAppProvider>
      <MouseAppProvider>{children}</MouseAppProvider>
    </WindowAppProvider>
  );
};

export default AppPlayerProvider;
