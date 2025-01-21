import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Text,
  TextField,
  Box,
  Flex,
  Button,
  ScrollArea,
  Callout,
} from "@radix-ui/themes";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";

import ScheduleToast from "../Notifications/ScheduleToast";
import CourseListItem from "./CourseListItem";
import FormCard from "../../Layout/FormCard";
import { DispatchUserChoicesContext } from "../../Context/UserChoicesProvider";
import { DispatchAnimationContext } from "../../Context/AnimationProvider";
import ACTIONS from "../../Context/Reducer/Actions";
import "../../styles/styles.css";

const CourseForm = ({ animation, userChoices }) => {
  const userChoicesDispatch = useContext(DispatchUserChoicesContext);
  const animationDispatch = useContext(DispatchAnimationContext);

  const [input, setInput] = useState("");
  const [section, setSection] = useState(
    userChoices.courses.map((course) => ({
      input: course.sectionInput,
      value: course.sectionValue,
    }))
  );
  const [validSectionInput, setValidSectionInput] = useState(true);
  const [toast, setToast] = useState({ open: false, type: "", message: "" });
  const [coursesData, setCoursesData] = useState([]);

  // Refs used for toast notification messages
  const timerRef = useRef(0); // Used to clearTimeout
  const lastAddedCourse = useRef("");
  const duplicateCourse = useRef("");
  const lastToastMessage = useRef("");
  const lastToastType = useRef("");

  useEffect(() => {
    // Fetch course data from API
    fetchCourseData().then((coursesArray) => setCoursesData(coursesArray));
  }, []);

  useEffect(() => {
    // Update validity when the section/course input changes
    setValidSectionInput(
      userChoices.courses.every((course) => {
        return validateSection(course);
      })
    );
  }, [userChoices.courses]);

  const onSubmit = (e) => {
    e.preventDefault();
    animationDispatch({ type: ACTIONS.animationNext });
  };

  const validateSection = (courseInput) => {
    return !courseInput.sectionValue?.length
      ? true
      : coursesData.some(
          (course) =>
            course.courseId == courseInput.id &&
            course.section == courseInput.sectionValue
        );
  };

  const showToast = (type, sanitizedInput = "") => {
    // Set toast to closed state but keep old toast state during close animation, prevents the toast to change while closing
    setToast({
      open: false,
      type: lastToastType.current,
      message: lastToastMessage.current,
    });
    clearTimeout(timerRef.current);
    setTimeout(() => {
      lastToastType.current = type;
      switch (type) {
        case "add":
          lastAddedCourse.current = sanitizedInput;
          lastToastMessage.current = `${lastAddedCourse.current} has been added`;
          break;
        case "delete":
          lastToastMessage.current = `${sanitizedInput} has been deleted`;
          break;
        case "duplicate":
          duplicateCourse.current = sanitizedInput;
          lastToastMessage.current = `${duplicateCourse.current} is already added`;
          break;
        case "invalid":
          lastToastMessage.current = "Invalid course code, try again";
          break;
      }
      setToast({ open: true, type, message: lastToastMessage.current });
    }, 50);
  };

  // Fetch all existing courses for input validation
  const fetchCourseData = async () => {
    try {
      const result = await fetch("http://127.0.0.1:5000/courses/W25").then(
        (response) => response.json()
      );
      return result.courses || [];
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  // Removes all white space and makes all characters upper case.
  const sanitizeInput = (input = "") => {
    return input.replace(/\s/g, "").toUpperCase();
  };

  const validateCourseId = (id) => {
    return coursesData.some((course) => course.courseId == id);
  };

  const onEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Capitalize all letters and remove white space
      const sanitizedCourseInput = sanitizeInput(input);

      // Valid input
      if (
        validateCourseId(sanitizedCourseInput) &&
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
    <>
      <FormCard
        step={1}
        currentStep={animation.step}
        direction={animation.direction}
      >
        <Flex width="400px" direction="column" gap="4" m="auto" mt="50px">
          <Text align="center" size="5">
            Enter Course ID
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
        <Flex
          width="120vh"
          height="60vh"
          position="relative"
          justify="center"
          p="60px"
          pb="100px"
        >
          <ScrollArea type="auto" scrollbars="vertical">
            <CourseListItem
              userChoices={userChoices}
              showToast={showToast}
              coursesData={coursesData}
              section={section}
              setSection={setSection}
              validateSection={validateSection}
            ></CourseListItem>
          </ScrollArea>

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
        <Box position="absolute" bottom="32px" height="4vh" width="60vw">
          <Button
            size="3"
            variant="solid"
            disabled={
              !userChoices.courses.length ||
              !validSectionInput ||
              !coursesData.length
            }
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
      </FormCard>
      <ScheduleToast
        title={
          toast.type === "add" || toast.type === "delete"
            ? "Successful!"
            : "Error!"
        }
        description={toast.message}
        open={toast.open}
        onOpenChange={(open) => setToast((prev) => ({ ...prev, open }))}
        IconComponent={
          toast.type === "add" || toast.type === "delete"
            ? CheckCircledIcon
            : CrossCircledIcon
        }
        color={
          toast.type === "add" || toast.type === "delete" ? "lightgreen" : "red"
        }
      ></ScheduleToast>
    </>
  );
};

export default CourseForm;
