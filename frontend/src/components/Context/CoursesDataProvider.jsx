import { createContext, useState } from "react";

export const CoursesDataContext = createContext();
export const SetCoursesDataContext = createContext();

export const CoursesDataProvider = ({ children }) => {
  const [coursesData, setCoursesData] = useState([]);
  return (
    <CoursesDataContext.Provider value={coursesData}>
      <SetCoursesDataContext.Provider value={setCoursesData}>
        {children}
      </SetCoursesDataContext.Provider>
    </CoursesDataContext.Provider>
  );
};
