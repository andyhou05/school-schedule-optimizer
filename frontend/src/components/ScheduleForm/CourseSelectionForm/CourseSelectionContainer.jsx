import React from "react";
import { useContext } from "react";
import { ScrollArea, Flex } from "@radix-ui/themes";

import CourseList from "./CourseList";
import { UserChoicesContext } from "../../Context/UserChoicesProvider";
import { CoursesDataContext } from "../../Context/CoursesDataProvider";

const CourseSelectionContainer = ({
  children,
  showToast,
  section,
  setSection,
  validateSection,
}) => {
  const userChoices = useContext(UserChoicesContext);
  const coursesData = useContext(CoursesDataContext);
  return (
    <Flex
      width="120vh"
      height="60vh"
      position="relative"
      justify="center"
      p="60px"
      pb="100px"
    >
      <ScrollArea type="auto" scrollbars="vertical">
        <CourseList
          userChoices={userChoices}
          showToast={showToast}
          coursesData={coursesData}
          section={section}
          setSection={setSection}
          validateSection={validateSection}
        />
      </ScrollArea>

      {children}
    </Flex>
  );
};

export default CourseSelectionContainer;
