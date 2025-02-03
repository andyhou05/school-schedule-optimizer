import React from "react";
import { useContext } from "react";
import { ScrollArea, Flex, Callout } from "@radix-ui/themes";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import CourseList from "./CourseList";
import { UserChoicesContext } from "../../Context/UserChoicesProvider";

const CourseSelectionContainer = ({
  showToast,
  coursesData,
  section,
  setSection,
  validateSection,
  validSectionInput,
}) => {
  const userChoices = useContext(UserChoicesContext);
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

      {/* Callout for invalid sections */}
      <Callout.Root
        color="red"
        role="alert"
        style={{
          position: "absolute",
          bottom: "16px",
          opacity:
            !validSectionInput &&
            coursesData.length &&
            userChoices.courses.length
              ? "1"
              : "0",
          transition: "opacity 0.25s ease",
        }}
      >
        <Callout.Icon>
          <ExclamationTriangleIcon />
        </Callout.Icon>
        <Callout.Text>
          Please enter valid section numbers before continuing.
        </Callout.Text>
      </Callout.Root>
    </Flex>
  );
};

export default CourseSelectionContainer;
