import React, { useState, useEffect, useContext } from "react";
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
import { DispatchUserChoices, ACTIONS } from "./ScheduleForm";

const CourseList = ({
  userChoices,
  setValidSectionInput,
  showToast,
  coursesData,
}) => {
  const [section, setSection] = useState(
    userChoices.courses.map((course) => ({
      input: course.sectionInput,
      value: course.sectionValue,
    })) // { input: "", value: "" }
  );
  const [sectionIndex, setSectionIndex] = useState(0);

  const userChoicesDispatch = useContext(DispatchUserChoices);

  useEffect(() => {
    if (userChoices.courses.length > section.length) {
      setSection((prev) => [...prev, { input: "", value: "" }]);
    }
  }, [userChoices.courses]);

  useEffect(() => {
    // Update validity
    setValidSectionInput(
      userChoices.courses.every((course) => {
        return validateSection(course);
      })
    );
  }, [section, coursesData]);

  const handleDelete = (courseToDelete, index) => {
    setSection((prev) => {
      const updatedSectionInput = [...prev].filter((_, i) => i !== index);
      return updatedSectionInput;
    });

    userChoicesDispatch({
      type: ACTIONS.deleteCourse,
      payload: courseToDelete,
    });
    showToast("delete", courseToDelete);
    /*
    setSection((prev) => {
      const updatedSectionInput = [...prev].filter((_, i) => i !== index);

      // Update validity
      setValidSectionInput(
        userChoices.courses.every((course) => {
          return validateSection(course);
        })
      );

      return updatedSectionInput;
    });
    */
  };

  const validateSection = (courseInput) => {
    return !courseInput.sectionValue?.length
      ? true
      : coursesData.some(
          (course) =>
            course.courseId == courseInput.id &&
            course.section == courseInput.sectionValue
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
      const updatedSection = [...prev];
      updatedSection[index].input = value;
      updatedSection[index].value = transformSectionInput(value);
      userChoicesDispatch({
        type: ACTIONS.updateSection,
        payload: {
          input: updatedSection[index].input,
          value: updatedSection[index].value,
          index: index,
        },
      });

      return updatedSection;
    });
  };

  return (
    <DataList.Root orientation="vertical">
      {userChoices.courses.map((course, index) => (
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
                    value={userChoices.courses[index].sectionInput}
                    style={{
                      outlineColor:
                        section[index] &&
                        !validateSection(userChoices.courses[index]) &&
                        coursesData.length
                          ? "var(--red-6)"
                          : "var(--slate-7)",
                      backgroundColor:
                        section[index] &&
                        !validateSection(userChoices.courses[index]) &&
                        coursesData.length
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
