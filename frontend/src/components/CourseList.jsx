import React, { useState, useEffect } from "react";
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
  inputCourses,
  setInputCourses,
  setValidSectionInput,
  showToast,
  coursesData,
}) => {
  const [sectionInput, setSectionInput] = useState([]);
  const [sectionIndex, setSectionIndex] = useState(0);

  // Used to update state in CourseForm, ensures the update happens after rendering of this component
  useEffect(() => {
    // Update validity
    setValidSectionInput(
      sectionInput.every((section) => {
        return validateSection(section); // we also need to check for course, not just section
      })
    );

    // Update section value in course object
    setInputCourses((prev) => {
      return prev.map((course, currentIndex) => {
        return sectionIndex == currentIndex
          ? { id: course.id, section: sectionInput[sectionIndex] }
          : course;
      });
    });
  }, [sectionInput]);

  const handleDelete = (courseToDelete, index) => {
    setInputCourses(
      inputCourses.filter((course) => course.id !== courseToDelete)
    );
    showToast("delete", courseToDelete);
    setSectionInput((prev) => {
      const updatedSectionInput = [...prev].filter((_, i) => i !== index);

      // Update validity
      setValidSectionInput(
        updatedSectionInput.every((section) => {
          return validateSection(section);
        })
      );

      return updatedSectionInput;
    });
  };

  const validateSection = (input) => {
    return !input
      ? true
      : coursesData.current.some((course) => course.section == input);
  };

  const handleSectionInput = (value, index) => {
    setSectionIndex(index);
    setSectionInput((prev) => {
      // Update the section input
      const updatedSectionInput = [...prev];
      updatedSectionInput[index] =
        value.length >= 5 || value.length == 0
          ? value
          : "0".repeat(5 - value.length).concat(value);

      return updatedSectionInput;
    });
  };

  return (
    <DataList.Root orientation="vertical">
      {inputCourses.map((course, index) => (
        <DataList.Item key={course.id}>
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
                      handleDelete(course.id, index);
                    }}
                  >
                    <Cross1Icon></Cross1Icon>
                  </IconButton>
                </Box>
                <DataList.Value key={course.id}>
                  <Text weight="medium" size="4">
                    {course.id}
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
