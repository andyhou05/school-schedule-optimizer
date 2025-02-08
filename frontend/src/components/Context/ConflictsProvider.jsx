import { createContext, useState } from "react";

export const ConflictsContext = createContext();
export const SetConflictsContext = createContext();

export const ConflictsProvider = ({ children }) => {
  const [conflicts, setConflicts] = useState([]);
  return (
    <ConflictsContext.Provider value={conflicts}>
      <SetConflictsContext.Provider value={setConflicts}>
        {children}
      </SetConflictsContext.Provider>
    </ConflictsContext.Provider>
  );
};
