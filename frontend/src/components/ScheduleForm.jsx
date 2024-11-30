import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  TextField,
  Box,
  Flex,
  Card,
  Button,
  ScrollArea,
} from "@radix-ui/themes";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import ScheduleToast from "./ScheduleToast";
import CourseList from "./CourseList";

const ScheduleForm = () => {
  const [inputCourses, setInputCourses] = useState([]);
  const [input, setInput] = useState("");
  const [openConfirmationToast, setOpenConfirmationToast] = useState(false);
  const [openDuplicateToast, setOpenDupliacteToast] = useState(false);

  const timerRef = useRef(0);
  const lastAddedCourse = useRef("");
  const duplicateCourse = useRef("");
  const coursesData = useRef([]);

  // Fetch all existing courses for input validation
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch("http://127.0.0.1:5000/courses").then(
          (response) => response.json()
        );
        coursesData.current = result;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Used for toast re-renders
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // Removes all white space and makes all characters upper case.
  const sanitizeInput = (input = "") => {
    return input.replace(/\s/g, "").toUpperCase();
  };

  // Used to hide all toast notifications whenever a new one appears
  const removeToast = () => {
    setOpenConfirmationToast(false);
    setOpenDupliacteToast(false);
  };

  const onEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Capitalize all letters and remove white space
      const sanitizedInput = sanitizeInput(input);

      // Valid input
      if (!inputCourses.includes(sanitizedInput) && input.trim() != "") {
        removeToast();
        setInputCourses([...inputCourses, sanitizedInput]);
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
          lastAddedCourse.current = sanitizedInput;
          setOpenConfirmationToast(true);
        }, 100);
      }

      // Duplicate input
      else if (inputCourses.includes(sanitizedInput)) {
        removeToast();
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
          duplicateCourse.current = sanitizedInput;
          setOpenDupliacteToast(true);
        }, 100);
      }
      setInput("");
    }
  };

  return (
    <form>
      <Flex width="100%" height="100vh" align="center" justify="center">
        <Card style={{ boxShadow: "var(--shadow-4)" }}>
          <Flex width="400px" direction="column" gap="4" m="auto" mt="50px">
            <Text align="center" size="5">
              Enter Course ID
            </Text>
            <TextField.Root
              aria-label="courseInput"
              size="3"
              onKeyDown={onEnter}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. 603-101-MQ"
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
              <CourseList
                courses={inputCourses}
                setCourses={setInputCourses}
              ></CourseList>
            </ScrollArea>

            <Box position="absolute" bottom="16px" right="32px">
              <Button size="3" variant="solid" disabled={!inputCourses.length}>
                Continue
              </Button>
            </Box>
          </Flex>
        </Card>
      </Flex>
      <ScheduleToast
        title="Successful!"
        description={`${lastAddedCourse.current} has been added`}
        open={openConfirmationToast}
        onOpenChange={setOpenConfirmationToast}
        IconComponent={CheckCircledIcon}
        color="lightgreen"
      ></ScheduleToast>
      <ScheduleToast
        title="Error!"
        description={`${duplicateCourse.current} has already been added`}
        open={openDuplicateToast}
        onOpenChange={setOpenDupliacteToast}
        IconComponent={CrossCircledIcon}
        color="red"
      ></ScheduleToast>
    </form>
  );
};

export default ScheduleForm;
