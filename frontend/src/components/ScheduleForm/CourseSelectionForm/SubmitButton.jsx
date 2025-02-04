import React from "react";
import { useContext } from "react";
import { Button, Box } from "@radix-ui/themes";

import { DispatchAnimationContext } from "../../Context/AnimationProvider";
import { UserChoicesContext } from "../../Context/UserChoicesProvider";
import * as utils from "./utils";
import ACTIONS from "../../Context/Reducer/Actions";

const SubmitButton = ({ disabled }) => {
  const animationDispatch = useContext(DispatchAnimationContext);
  const userChoices = useContext(UserChoicesContext);

  const onSubmit = async (e) => {
    e.preventDefault();
    const conflictsResponse = await utils.checkConflicts(
      utils.groupSpecificCourses(userChoices.courses)
    );
    if (conflictsResponse.conflicts.length) {
      console.log(conflictsResponse);
    } else {
      animationDispatch({ type: ACTIONS.animationNext });
    }
  };

  return (
    <Box position="absolute" bottom="32px" height="4vh" width="60vw">
      <Button
        size="3"
        variant="solid"
        disabled={disabled}
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
