import React from "react";
import { useContext, useState } from "react";
import { Text, TextField, Flex, Link } from "@radix-ui/themes";
import { CoursesDataContext } from "../../Context/CoursesDataProvider";
import { UserChoicesContext } from "../../Context/UserChoicesProvider";
import { DispatchUserChoicesContext } from "../../Context/UserChoicesProvider";
import * as utils from "./utils";
import ACTIONS from "../../Context/Reducer/Actions";

const CourseInput = ({ setSection, showToast }) => {
  const coursesData = useContext(CoursesDataContext);
  const userChoices = useContext(UserChoicesContext);
  const userChoicesDispatch = useContext(DispatchUserChoicesContext);

  const [input, setInput] = useState("");

  const onEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Capitalize all letters and remove white space
      const sanitizedCourseInput = utils.sanitizeInput(input);

      // Valid input
      if (
        utils.validateCourseId(coursesData, sanitizedCourseInput) &&
        !userChoices.courses.some(
          (course) => course.id == sanitizedCourseInput
        ) &&
        input.trim() != ""
      ) {
        userChoicesDispatch({
          type: ACTIONS.addCourse,
          payload: {
            id: sanitizedCourseInput,
            sectionInput: "",
            sectionValue: "",
          },
        });

        // Initialize the section value and input whenever user enters a new course
        setSection((prev) => [...prev, { input: "", value: "" }]);
        showToast("add", sanitizedCourseInput);
      }

      // Duplicate input
      else if (
        userChoices.courses.some((course) => course.id == sanitizedCourseInput)
      ) {
        showToast("duplicate", sanitizedCourseInput);
      }

      // Invalid input
      else {
        showToast("invalid");
      }
      setInput("");
    }
  };
  return (
    <Flex width="400px" direction="column" gap="4" m="auto" mt="50px">
      <Text align="center" size="5">
        Enter Course ID (
        <Link
          size="5"
          weight="medium"
          target="_blank"
          href="https://vanierlivecourseschedule.powerappsportals.com/"
        >
          See Courses
        </Link>
        )
      </Text>

      <TextField.Root
        aria-label="courseInput"
        size="3"
        onKeyDown={onEnter}
        onChange={(e) => setInput(e.target.value)}
        placeholder="e.g. 603-101-MA"
        value={input}
      ></TextField.Root>
    </Flex>
  );
};
export default CourseInput;
