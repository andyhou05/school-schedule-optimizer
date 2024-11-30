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
  const [toast, setToast] = useState({ open: false, type: "", message: "" });

  const timerRef = useRef(0);
  const lastAddedCourse = useRef("");
  const duplicateCourse = useRef("");
  const coursesData = useRef([]);

  const showToast = (type, sanitizedInput = "") => {
    var message = "";
    setToast({ open: false, type, message });
    clearTimeout(timerRef.current);
    setTimeout(() => {
      if (type == "valid") {
        lastAddedCourse.current = sanitizedInput;
        message = `${lastAddedCourse.current} has been added`;
      } else if (type == "duplicate") {
        duplicateCourse.current = sanitizedInput;
        message = `${duplicateCourse.current} is already added`;
      } else if (type == "invalid") {
        message = "Invalid course code, try again";
      }
      setToast({ open: true, type, message });
    }, 100);
  };

  // Fetch all existing courses for input validation
  const fetchData = async () => {
    try {
      const result = await fetch("http://127.0.0.1:5000/courses").then(
        (response) => response.json()
      );
      return result.courses || [];
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchData().then((coursesArray) => (coursesData.current = coursesArray));
  }, []);

  // Removes all white space and makes all characters upper case.
  const sanitizeInput = (input = "") => {
    return input.replace(/\s/g, "").toUpperCase();
  };

  const validateCourseId = (id) => {
    return coursesData.current.some((course) => course.courseId == id);
  };

  const onEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Capitalize all letters and remove white space
      const sanitizedInput = sanitizeInput(input);

      // Valid input
      if (
        validateCourseId(sanitizedInput) &&
        !inputCourses.includes(sanitizedInput) &&
        input.trim() != ""
      ) {
        setInputCourses([...inputCourses, sanitizedInput]);
        showToast("valid", sanitizedInput);
      }

      // Duplicate input
      else if (inputCourses.includes(sanitizedInput)) {
        showToast("duplicate", sanitizedInput);
      }

      // Invalid input
      else {
        showToast("invalid");
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
        title={toast.type === "valid" ? "Successful!" : "Error!"}
        description={toast.message}
        open={toast.open}
        onOpenChange={(open) => setToast((prev) => ({ ...prev, open }))}
        IconComponent={
          toast.type === "valid" ? CheckCircledIcon : CrossCircledIcon
        }
        color={toast.type === "valid" ? "lightgreen" : "red"}
      ></ScheduleToast>
    </form>
  );
};

export default ScheduleForm;
