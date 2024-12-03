import React, { useState } from "react";
import {
  Text,
  TextField,
  Box,
  Flex,
  Card,
  IconButton,
  DataList,
  Em,
  Separator,
  Tooltip,
} from "@radix-ui/themes";
import { Cross1Icon } from "@radix-ui/react-icons";

const CourseList = ({ courses, setCourses, showToast, coursesData }) => {
  const [sectionInput, setSectionInput] = useState([]);

  const handleDelete = (courseToDelete, index) => {
    setCourses(courses.filter((course) => course !== courseToDelete));
    showToast("delete", courseToDelete);
    setSectionInput(sectionInput.splice(index, 1));
  };

  const validateSection = (input) => {
    return coursesData.current.some((course) => course.section == input);
  };

  const handleSectionInput = (value, index) => {
    setSectionInput((prev) => {
      const updatedSectionInput = [...prev];
      updatedSectionInput[index] = value;
      return updatedSectionInput;
    });
  };

  return (
    <DataList.Root orientation="vertical">
      {courses.map((course, index) => (
        <DataList.Item key={course}>
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
                    variant="outline"
                    color="red"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(course, index);
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
                <Flex
                  position="absolute"
                  right="5vh"
                  direction="row"
                  align="center"
                  gap="4"
                >
                  <Separator orientation="vertical" size="2" />
                  <Text size="3" as="label" htmlFor="section">
                    <Em>Section (optional)</Em>
                  </Text>
                  <Tooltip
                    content="Invalid"
                    open={
                      sectionInput[index]?.length > 0 &&
                      !validateSection(sectionInput[index])
                    }
                    sideOffset={5}
                  >
                    <TextField.Root
                      inputMode="numeric"
                      variant="soft"
                      id="section"
                      placeholder="00000"
                      style={{
                        outlineColor:
                          sectionInput[index]?.length > 0 &&
                          !validateSection(sectionInput[index])
                            ? "var(--red-6)"
                            : "var(--slate-7)",
                        backgroundColor:
                          sectionInput[index]?.length > 0 &&
                          !validateSection(sectionInput[index])
                            ? "var(--red-4)"
                            : "var(--slate-5)",
                        transition:
                          "outline-color 0.5s ease, background-color 0.5s ease",
                      }}
                      onChange={(e) => {
                        handleSectionInput(e.target.value, index);
                      }}
                    ></TextField.Root>
                  </Tooltip>
                </Flex>
              </Flex>
            </Card>
          </Flex>
        </DataList.Item>
      ))}
    </DataList.Root>
  );
};

export default CourseList;
