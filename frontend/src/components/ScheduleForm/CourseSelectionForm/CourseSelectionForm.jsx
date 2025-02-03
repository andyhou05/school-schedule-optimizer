import React, { useState, useEffect, useContext } from "react";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";

import ScheduleToast from "../Notifications/ScheduleToast";
import CourseInput from "./CourseInput";
import CourseSelectionContainer from "./CourseSelectionContainer";
import FormCard from "../../Layout/FormCard";
import CoursesCallout from "../Notifications/CoursesCallout";
import SubmitButton from "./SubmitButton";

import useToast from "../../Hooks/useToast";
import { CoursesDataContext } from "../../Context/CoursesDataProvider";
import { SetCoursesDataContext } from "../../Context/CoursesDataProvider";
import { UserChoicesContext } from "../../Context/UserChoicesProvider";
import { DispatchUserChoicesContext } from "../../Context/UserChoicesProvider";
import * as utils from "./utils";
import ACTIONS from "../../Context/Reducer/Actions";
import "../../styles/styles.css";

const CourseSelectionForm = ({ animation }) => {
  const userChoices = useContext(UserChoicesContext);
  const userChoicesDispatch = useContext(DispatchUserChoicesContext);
  const coursesData = useContext(CoursesDataContext);
  const setCoursesData = useContext(SetCoursesDataContext);

  const [input, setInput] = useState("");
  const [section, setSection] = useState(
    userChoices.courses.map((course) => ({
      input: course.sectionInput,
      value: course.sectionValue,
    }))
  );
  const [validSectionInput, setValidSectionInput] = useState(true);
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
  }, [userChoices.courses]);

  return (
    <>
      <FormCard
        step={1}
        currentStep={animation.step}
        direction={animation.direction}
      >
        <CourseInput
          input={input}
          setInput={setInput}
          setSection={setSection}
          showToast={showToast}
        />
        <CourseSelectionContainer
          showToast={showToast}
          section={section}
          setSection={setSection}
        >
          <CoursesCallout validSectionInput={validSectionInput} />
        </CourseSelectionContainer>
        <SubmitButton
          disabled={
            !userChoices.courses.length ||
            !validSectionInput ||
            !coursesData.length
          }
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
