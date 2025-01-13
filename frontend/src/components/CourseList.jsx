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
  const [section, setSection] = useState(
    JSON.parse(
      window.sessionStorage.getItem("SCHEDULE_FORM")
    )?.inputCourses.map((course) => ({
      input: course.sectionInput,
      value: course.sectionValue,
    })) ?? [{ input: "", value: "" }]
  );
  const [sectionIndex, setSectionIndex] = useState(0);

  // Used to update state in CourseForm, ensures the update happens after rendering of this component
  useEffect(() => {
    // Update section value in course object
    setInputCourses((prev) => {
      const newInputCourses = prev.map((course, currentIndex) => {
        return sectionIndex == currentIndex
          ? {
              id: course.id,
              sectionInput: section[sectionIndex].input,
              sectionValue: transformSectionInput(section[sectionIndex].value),
            }
          : course;
      });

      // Update validity
      setValidSectionInput(
        newInputCourses.every((course) => {
          return validateSection(course);
        })
      );

      return newInputCourses;
    });
  }, [section]);

  const handleDelete = (courseToDelete, index) => {
    setInputCourses(
      inputCourses.filter((course) => course.id !== courseToDelete)
    );
    showToast("delete", courseToDelete);
    setSection((prev) => {
      const updatedSectionInput = [...prev].filter((_, i) => i !== index);

      // Update validity
      setValidSectionInput(
        inputCourses.every((course) => {
          return validateSection(course);
        })
      );

      return updatedSectionInput;
    });
  };

  const validateSection = (inputCourse) => {
    return !inputCourse.sectionValue?.length
      ? true
      : coursesData.current.some(
          (course) =>
            course.courseId == inputCourse.id &&
            course.section == inputCourse.sectionValue
        );
  };

  const transformSectionInput = (input = "") => {
    return input.length >= 5 || input.length == 0
      ? input
      : "0".repeat(5 - input.length).concat(input);
  };

  const handleSectionInput = (value, index) => {
    setSectionIndex(index);
    setSection((prev) => {
      // Update the section input
      const updatedSectionInput = [...prev];
      updatedSectionInput[index].input = value;
      updatedSectionInput[index].value = transformSectionInput(value);

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
                    value={inputCourses[index].sectionInput}
                    style={{
                      outlineColor:
                        section[index] && !validateSection(inputCourses[index])
                          ? "var(--red-6)"
                          : "var(--slate-7)",
                      backgroundColor:
                        section[index] && !validateSection(inputCourses[index])
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
