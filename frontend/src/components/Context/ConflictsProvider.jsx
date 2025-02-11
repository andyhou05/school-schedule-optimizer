import { createContext, useState } from "react";

export const ConflictsContext = createContext();
export const SetConflictsContext = createContext();

export const ConflictsProvider = ({ children }) => {
  const [conflicts, setConflicts] = useState(
    JSON.parse(window.sessionStorage.getItem("conflicts")) ?? []
  );
  return (
    <ConflictsContext.Provider value={conflicts}>
      <SetConflictsContext.Provider value={setConflicts}>
        {children}
      </SetConflictsContext.Provider>
    </ConflictsContext.Provider>
  );
};
