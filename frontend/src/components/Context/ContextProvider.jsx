import { AnimationProvider } from "./AnimationProvider";
import { CoursesDataProvider } from "./CoursesDataProvider";
import { UserChoicesProvider } from "./UserChoicesProvider";

const ContextProvider = ({ children }) => {
  return (
    <AnimationProvider>
      <CoursesDataProvider>
        <UserChoicesProvider>{children}</UserChoicesProvider>
      </CoursesDataProvider>
    </AnimationProvider>
  );
};
export default ContextProvider;
