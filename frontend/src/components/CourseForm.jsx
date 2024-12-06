import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  TextField,
  Box,
  Flex,
  Card,
  Button,
  ScrollArea,
  Callout,
} from "@radix-ui/themes";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import ScheduleToast from "./ScheduleToast";
import CourseList from "./CourseList";

const CourseForm = () => {
  const [inputCourses, setInputCourses] = useState([]);
  const [input, setInput] = useState("");
  const [toast, setToast] = useState({ open: false, type: "", message: "" });
  const [validSectionInput, setValidSectionInput] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const timerRef = useRef(0);
  const lastAddedCourse = useRef("");
  const duplicateCourse = useRef("");
  const coursesData = useRef([]);
  const lastToastMessage = useRef("");
  const lastToastType = useRef("");

  const onSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const showToast = (type, sanitizedInput = "") => {
    // Set toast to closed state but keep old toast state during close animation
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
        showToast("add", sanitizedInput);
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
        <Card
          style={{
            boxShadow: "var(--shadow-4)",
            transform: isSubmitted ? "translateY(-100vh)" : "",
            transition: "transform 0.25s ease-in-out",
          }}
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
              <CourseList
                courses={inputCourses}
                setCourses={setInputCourses}
                setValidSectionInput={setValidSectionInput}
                showToast={showToast}
                coursesData={coursesData}
              ></CourseList>
            </ScrollArea>

            <Box position="absolute" bottom="16px" right="32px">
              <Button
                size="3"
                variant="solid"
                disabled={!inputCourses.length || !validSectionInput}
                style={{
                  transition: "background-color 0.25s ease, color 0.25s ease",
                }}
                onClick={onSubmit}
              >
                Continue
              </Button>
            </Box>
            <Callout.Root
              color="red"
              role="alert"
              style={{
                position: "absolute",
                bottom: "16px",
                opacity: !validSectionInput ? "1" : "0",
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
        </Card>
      </Flex>
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
    </form>
  );
};

export default CourseForm;
