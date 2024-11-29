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
  const [courses, setCourses] = useState([]);
  const [input, setInput] = useState("");
  const [openConfirmationToast, setOpenConfirmationToast] = useState(false);
  const [openDuplicateToast, setOpenDupliacteToast] = useState(false);
  const timerRef = useRef(0);
  const lastAddedCourse = useRef("");

  // Used for toast re-renders
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // Removes all white space and makes all characters upper case.
  const sanitizeInput = (input = "") => {
    return input.replace(/\s/g, "").toUpperCase();
  };

  const removeToast = () => {
    setOpenConfirmationToast(false);
    setOpenDupliacteToast(false);
  };

  const onEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const sanitizedInput = sanitizeInput(input);
      if (!courses.includes(sanitizedInput) && input.trim() != "") {
        removeToast();
        setCourses([...courses, sanitizedInput]);
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
          lastAddedCourse.current = sanitizedInput;
          setOpenConfirmationToast(true);
        }, 100);
      } else if (courses.includes(sanitizedInput)) {
        removeToast();
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
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
                courses={courses}
                setCourses={setCourses}
              ></CourseList>
            </ScrollArea>

            <Box position="absolute" bottom="16px" right="32px">
              <Button size="3" variant="solid" disabled={!courses.length}>
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
        description={`${lastAddedCourse.current} has already been added`}
        open={openDuplicateToast}
        onOpenChange={setOpenDupliacteToast}
        IconComponent={CrossCircledIcon}
        color="red"
      ></ScheduleToast>
    </form>
  );
};

export default ScheduleForm;
