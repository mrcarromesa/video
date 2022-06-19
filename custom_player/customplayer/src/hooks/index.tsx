import { ReactNode } from "react";
import { TransactionsProvider } from "./useTransactions";

interface AppPlayerProviderProps {
  children: ReactNode;
}

const AppPlayerProvider: React.FC<AppPlayerProviderProps> = ({ children }) => {
  return (<TransactionsProvider>
    {children}
  </TransactionsProvider>);
}

export default AppPlayerProvider;