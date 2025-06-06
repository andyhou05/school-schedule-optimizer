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
  Tooltip,
} from "@radix-ui/themes";
import { Cross1Icon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "framer-motion";

import { DispatchUserChoicesContext } from "../../Context/UserChoicesProvider";
import { CoursesDataContext } from "../../Context/CoursesDataProvider";
import * as utils from "./utils";
import ACTIONS from "../../Context/Reducer/Actions";

const CourseList = ({ userChoices, showToast, section, setSection }) => {
  const [sectionIndex, setSectionIndex] = useState(0);

  const userChoicesDispatch = useContext(DispatchUserChoicesContext);
  const coursesData = useContext(CoursesDataContext);

  useEffect(() => {
    // Change userChoices state in useEffect to avoid 'Cannot update component while rendering other component'
    // (Do not put this code in the handleSectionInput method)
    userChoicesDispatch({
      type: ACTIONS.updateSection,
      payload: {
        input: section[sectionIndex]?.input,
        value: section[sectionIndex]?.value,
        index: sectionIndex,
      },
    });
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
  };

  const transformSectionInput = (input = "") => {
    return input.length >= 5 || input.length == 0
      ? input
      : "0".repeat(5 - input.length).concat(input);
  };

  const handleSectionInput = (input, index) => {
    setSectionIndex(index);
    setSection((prev) => {
      const updatedSection = [...prev];
      updatedSection[index].input = input;
      updatedSection[index].value = transformSectionInput(input);

      return updatedSection;
    });
  };

  return (
    <DataList.Root orientation="vertical">
      <AnimatePresence mode="popLayout">
        {userChoices.courses.map((course, index) => (
          <motion.li
            key={course.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }} // Moves up and fades out
            transition={{ duration: 0.4 }}
            layout // Ensures smooth movement of other elements
            style={{ listStyle: "none" }}
          >
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
                            !utils.validateSection(
                              coursesData,
                              userChoices.courses[index]
                            ) &&
                            coursesData.length
                              ? "var(--red-6)"
                              : "var(--slate-7)",
                          backgroundColor:
                            section[index] &&
                            !utils.validateSection(
                              coursesData,
                              userChoices.courses[index]
                            ) &&
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
                      <Tooltip
                        delayDuration={150}
                        content="You can choose if you want a specific section for this course."
                      >
                        <IconButton
                          radius="full"
                          size="1"
                          variant="ghost"
                          onClick={(e) => e.preventDefault()}
                        >
                          <QuestionMarkCircledIcon height="20px" width="20px" />
                        </IconButton>
                      </Tooltip>
                    </Flex>
                  </Flex>
                </Card>
              </Flex>
            </DataList.Item>
          </motion.li>
        ))}
      </AnimatePresence>
    </DataList.Root>
  );
};

export default CourseList;
