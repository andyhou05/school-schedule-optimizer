import { AnimationProvider } from "./AnimationProvider";
import { CoursesDataProvider } from "./CoursesDataProvider";
import { UserChoicesProvider } from "./UserChoicesProvider";
import { ConflictsProvider } from "./ConflictsProvider";

const ContextProvider = ({ children }) => {
  return (
    <AnimationProvider>
      <CoursesDataProvider>
        <ConflictsProvider>
          <UserChoicesProvider>{children}</UserChoicesProvider>
        </ConflictsProvider>
      </CoursesDataProvider>
    </AnimationProvider>
  );
};
export default ContextProvider;
