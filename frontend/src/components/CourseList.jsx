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
} from "@radix-ui/themes";
import { Cross1Icon } from "@radix-ui/react-icons";

const CourseList = ({
  courses,
  setCourses,
  setValidSectionInput,
  showToast,
  coursesData,
}) => {
  const [sectionInput, setSectionInput] = useState([]);

  const handleDelete = (courseToDelete, index) => {
    setCourses(courses.filter((course) => course !== courseToDelete));
    showToast("delete", courseToDelete);
    setSectionInput((prev) => prev.filter((_, i) => i !== index));
  };

  const validateSection = (input) => {
    return input.length == 0
      ? true
      : coursesData.current.some((course) => course.section == input);
  };

  const handleSectionInput = (value, index) => {
    setSectionInput((prev) => {
      // Update the section input
      const updatedSectionInput = [...prev];
      updatedSectionInput[index] =
        value.length >= 5 || value.length == 0
          ? value
          : "0".repeat(5 - value.length).concat(value);

      // Update validity
      setValidSectionInput(
        updatedSectionInput.every((section) => {
          return validateSection(section);
        })
      );

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
                  <TextField.Root
                    inputMode="numeric"
                    variant="soft"
                    id="section"
                    placeholder="00000"
                    style={{
                      outlineColor:
                        sectionInput[index] &&
                        !validateSection(sectionInput[index])
                          ? "var(--red-6)"
                          : "var(--slate-7)",
                      backgroundColor:
                        sectionInput[index] &&
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
