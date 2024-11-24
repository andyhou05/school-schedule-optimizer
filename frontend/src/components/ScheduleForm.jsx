import React, { useState } from "react";
import {
  Text,
  TextField,
  Box,
  Flex,
  Card,
  Button,
  ScrollArea,
  DataList,
} from "@radix-ui/themes";

const CourseListItem = () => {};

const ScheduleForm = () => {
  const [courses, setCourses] = useState([]);
  const [input, setInput] = useState("");

  const onEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!courses.includes(input) && input.trim() != "")
        setCourses([...courses, input.replace(/\s/g, "")]); // remove all white space in course id
      setInput("");
    }
  };

  return (
    <form>
      <Flex width="100%" height="100vh" align="center" justify="center">
        <Card style={{ boxShadow: "var(--shadow-4)" }}>
          <Flex width="400px" direction="column" gap="4" m="auto" mt="50px">
            <Text align="center">Enter Course ID</Text>
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
            <Card style={{ width: "100%" }}>
              <ScrollArea type="auto" scrollbars="vertical">
                <Flex direction="column" gap="5">
                  <DataList.Root orientation="vertical">
                    <DataList.Item>
                      {courses.map((course) => (
                        <DataList.Value key={course}>{course}</DataList.Value>
                      ))}
                    </DataList.Item>
                  </DataList.Root>
                </Flex>
              </ScrollArea>
            </Card>

            <Box position="absolute" bottom="16px" right="32px">
              <Button size="3" variant="solid" disabled={!courses.length}>
                Continue
              </Button>
            </Box>
          </Flex>
        </Card>
      </Flex>
    </form>
  );
};

export default ScheduleForm;
