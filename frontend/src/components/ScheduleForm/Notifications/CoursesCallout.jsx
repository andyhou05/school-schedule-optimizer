import React from "react";
import { useContext } from "react";
import { Callout } from "@radix-ui/themes";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { UserChoicesContext } from "../../Context/UserChoicesProvider";

const CoursesCallout = ({ validSectionInput, coursesData }) => {
  const userChoices = useContext(UserChoicesContext);
  return (
    <Callout.Root
      color="red"
      role="alert"
      style={{
        position: "absolute",
        bottom: "16px",
        opacity:
          !validSectionInput && coursesData.length && userChoices.courses.length
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
  );
};
export default CoursesCallout;
