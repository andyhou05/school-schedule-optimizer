import React from "react";
import { useContext } from "react";
import { ScrollArea, Flex } from "@radix-ui/themes";

import CourseList from "./CourseList";
import { UserChoicesContext } from "../../Context/UserChoicesProvider";

const CourseSelectionContainer = ({
  children,
  showToast,
  section,
  setSection,
}) => {
  const userChoices = useContext(UserChoicesContext);
  return (
    <Flex
      width="120vh"
      height="50vh"
      position="relative"
      justify="center"
      p="4"
      pt="4"
      pb="4"
    >
      <ScrollArea type="auto" scrollbars="vertical">
        <CourseList
          userChoices={userChoices}
          showToast={showToast}
          section={section}
          setSection={setSection}
        />
      </ScrollArea>

      {children}
    </Flex>
  );
};

export default CourseSelectionContainer;
