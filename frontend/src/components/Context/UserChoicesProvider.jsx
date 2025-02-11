import { createContext, useReducer } from "react";

import userChoicesReducer from "./Reducer/UserChoicesReducer";

export const UserChoicesContext = createContext();
export const DispatchUserChoicesContext = createContext(); // This is used as a dispatch method for userReducer, see UserChoicesReducer

export const UserChoicesProvider = ({ children }) => {
  // This state is used to render the list items
  const [userChoices, userChoicesDispatch] = useReducer(
    userChoicesReducer,
    JSON.parse(window.sessionStorage.getItem("scheduleForm"))?.userChoices ?? {
      courses: [], // { id: "", sectionInput: "", sectionValue: "" }
      preferences: {
        breaks: { input: "1", value: "" },
        time: { input: "1", value: "" },
        dayOff: { input: "1", value: "" },
        intensive: { input: "false", value: "" },
      },
    }
  );
  return (
    <UserChoicesContext.Provider value={userChoices}>
      <DispatchUserChoicesContext.Provider value={userChoicesDispatch}>
        {children}
      </DispatchUserChoicesContext.Provider>
    </UserChoicesContext.Provider>
  );
};
