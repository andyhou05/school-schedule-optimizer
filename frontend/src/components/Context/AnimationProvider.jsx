import { createContext, useReducer } from "react";

import animationReducer from "./Reducer/AnimationReducer";

export const AnimationContext = createContext();
export const DispatchAnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
  const [animation, dispatchAnimation] = useReducer(
    animationReducer,
    JSON.parse(window.sessionStorage.getItem("SCHEDULE_FORM"))?.animation ?? {
      step: 1,
      direction: "forward",
    }
  );
  return (
    <AnimationContext.Provider value={animation}>
      <DispatchAnimationContext.Provider value={dispatchAnimation}>
        {children}
      </DispatchAnimationContext.Provider>
    </AnimationContext.Provider>
  );
};
