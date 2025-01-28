import { createContext, ReactNode, useContext, useState } from "react";

const DumpContext = createContext({} as Record<string, any>);

export const useDump = () => {
  const context = useContext(DumpContext);
  if (!context) throw new Error("useDump must be used within a DumpProvider");
  return context;
}

export const DumpProvider = ({ children }: { children: ReactNode }) => {
  const [value, setValue] = useState({});
  return <DumpContext.Provider value={{ value, setValue }}>{children}</DumpContext.Provider>;
}