import React, { useState } from "react";
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
} from "@radix-ui/themes";
import { Cross1Icon } from "@radix-ui/react-icons";

const CourseList = ({ courses, setCourses }) => {
  const handleDelete = (courseToDelete) => {
    setCourses(courses.filter((course) => course !== courseToDelete));
  };

  return (
    <DataList.Root orientation="vertical">
      {courses.map((course) => (
        <DataList.Item>
          <Flex justify="center" align="center" py="3">
            <Card>
              <Flex
                width="80vh"
                height="7vh"
                direction="row"
                gap="5"
                align="center"
              >
                <Box pl="4">
                  <IconButton
                    size="2"
                    color="red"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(course);
                    }}
                  >
                    <Cross1Icon></Cross1Icon>
                  </IconButton>
                </Box>
                <DataList.Value key={course}>
                  <Text weight="medium" size="4">
                    {course}
                  </Text>
                </DataList.Value>
              </Flex>
            </Card>
          </Flex>
        </DataList.Item>
      ))}
    </DataList.Root>
  );
};

const ScheduleForm = () => {
  const [courses, setCourses] = useState([]);
  const [input, setInput] = useState("");

  const onEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!courses.includes(input.replace(/\s/g, "")) && input.trim() != "")
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
    </form>
  );
};

export default ScheduleForm;
