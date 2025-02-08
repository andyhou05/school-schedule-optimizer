import React, { useState, useEffect, useContext } from "react";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "framer-motion";

// Components
import ScheduleToast from "../Notifications/ScheduleToast";
import CourseInput from "./CourseInput";
import CourseSelectionContainer from "./CourseSelectionContainer";
import FormCard from "../../Layout/FormCard";
import CalloutContainer from "../Notifications/Callouts/CalloutContainer";
import CoursesCallout from "../Notifications/Callouts/CoursesCallout";
import ConflictsCallout from "../Notifications/Callouts/ConflictsCallout";
import SubmitButton from "./SubmitButton";

import useToast from "../../Hooks/useToast";
import { CoursesDataContext } from "../../Context/CoursesDataProvider";
import { SetCoursesDataContext } from "../../Context/CoursesDataProvider";
import { UserChoicesContext } from "../../Context/UserChoicesProvider";
import * as utils from "./utils";
import "../../styles/styles.css";
import { Flex } from "@radix-ui/themes";

const CourseSelectionForm = ({ animation }) => {
  const userChoices = useContext(UserChoicesContext);
  const coursesData = useContext(CoursesDataContext);
  const setCoursesData = useContext(SetCoursesDataContext);

  const [section, setSection] = useState(
    userChoices.courses.map((course) => ({
      input: course.sectionInput,
      value: course.sectionValue,
    }))
  );
  const [validSectionInput, setValidSectionInput] = useState(true);
  const [inputHasConflicts, setInputHasConflicts] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const { toast, setToast, showToast } = useToast();

  useEffect(() => {
    utils
      .fetchCourseData()
      .then((coursesArray) => setCoursesData(coursesArray));
  }, []);

  useEffect(() => {
    // Update validity when the section/course input changes
    setValidSectionInput(
      userChoices.courses.every((course) => {
        return utils.validateSection(coursesData, course);
      })
    );
    setInputHasConflicts(utils.checkConflicts(conflicts, userChoices.courses));
  }, [userChoices.courses]);

  useEffect(() => {
    setInputHasConflicts(true);
  }, [conflicts]);

  return (
    <>
      <FormCard
        step={1}
        currentStep={animation.step}
        direction={animation.direction}
      >
        <CourseInput setSection={setSection} showToast={showToast} />
        <CourseSelectionContainer
          showToast={showToast}
          section={section}
          setSection={setSection}
        >
          <CalloutContainer
            validSectionInput={validSectionInput}
            inputHasConflicts={inputHasConflicts}
          />
        </CourseSelectionContainer>
        <SubmitButton
          validSectionInput={validSectionInput}
          setConflicts={setConflicts}
          inputHasConflicts={inputHasConflicts}
        />
      </FormCard>
      <ScheduleToast
        title={
          toast.type === "add" || toast.type === "delete"
            ? "Successful!"
            : "Error!"
        }
        description={toast.message}
        open={toast.open}
        onOpenChange={(open) => setToast((prev) => ({ ...prev, open }))}
        IconComponent={
          toast.type === "add" || toast.type === "delete"
            ? CheckCircledIcon
            : CrossCircledIcon
        }
        color={
          toast.type === "add" || toast.type === "delete" ? "lightgreen" : "red"
        }
      />
    </>
  );
};

export default CourseSelectionForm;
