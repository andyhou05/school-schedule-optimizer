import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  TextField,
  Box,
  Flex,
  Card,
  Button,
  IconButton,
  ScrollArea,
  DataList,
  Em,
  Separator,
} from "@radix-ui/themes";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import ScheduleToast from "./ScheduleToast";
import CourseList from "./CourseList";

const ScheduleForm = () => {
  const [courses, setCourses] = useState([]);
  const [input, setInput] = useState("");
  const [openToast, setOpenToast] = useState(false);
  const timerRef = useRef(0);

  // Used for toast re-renders
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // Removes all white space and makes all characters upper case.
  const sanitizeInput = (input = "") => {
    return input.replace(/\s/g, "").toUpperCase();
  };

  const onEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!courses.includes(sanitizeInput(input)) && input.trim() != "") {
        setOpenToast(false);
        setCourses([...courses, sanitizeInput(input)]);
        window.clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setOpenToast(true);
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
        description={courses[courses.length - 1] + " has been added"}
        open={openToast}
        onOpenChange={setOpenToast}
        IconComponent={CheckCircledIcon}
      ></ScheduleToast>
    </form>
  );
};

export default ScheduleForm;
