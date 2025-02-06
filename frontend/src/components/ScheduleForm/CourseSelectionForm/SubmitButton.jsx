import React from "react";
import { useContext, useState } from "react";
import { Button, Box } from "@radix-ui/themes";

import { DispatchAnimationContext } from "../../Context/AnimationProvider";
import { UserChoicesContext } from "../../Context/UserChoicesProvider";
import { CoursesDataContext } from "../../Context/CoursesDataProvider";
import * as utils from "./utils";
import ACTIONS from "../../Context/Reducer/Actions";

const SubmitButton = ({ validSectionInput, conflicts, setConflicts }) => {
  const animationDispatch = useContext(DispatchAnimationContext);
  const userChoices = useContext(UserChoicesContext);
  const coursesData = useContext(CoursesDataContext);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const conflictsResponse = await utils.sendConflictsCheck(
      utils.groupSpecificCourses(userChoices.courses),
      setIsLoading
    );
    if (conflictsResponse.conflicts.length) {
      setConflicts(conflictsResponse);
    } else {
      animationDispatch({ type: ACTIONS.animationNext });
    }
  };

  return (
    <Box position="absolute" bottom="32px" height="4vh" width="60vw">
      <Button
        size="3"
        variant="solid"
        type="submit"
        disabled={
          !userChoices.courses.length ||
          !validSectionInput ||
          !coursesData.length ||
          isLoading ||
          conflicts.length
        }
        loading={isLoading}
        style={{
          transition: "background-color 0.25s ease, color 0.25s ease",
          position: "absolute",
          right: "32px",
        }}
        onClick={onSubmit}
      >
        Continue
      </Button>
    </Box>
  );
};

export default SubmitButton;
