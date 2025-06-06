import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { Box } from "@radix-ui/themes";

import CourseSelectionForm from "./CourseSelectionForm/CourseSelectionForm";
import PreferencesForm from "./PreferenceSelectionForm/PreferencesForm";
import { UserChoicesContext } from "../Context/UserChoicesProvider";
import { AnimationContext } from "../Context/AnimationProvider";

const ScheduleForm = () => {
  const navigate = useNavigate();

  // Used to animate between form components
  const animation = useContext(AnimationContext);

  // This state is used to render the list items
  const userChoices = useContext(UserChoicesContext);

  // Save values in session
  useEffect(() => {
    window.sessionStorage.setItem(
      "scheduleForm",
      JSON.stringify({
        userChoices: {
          courses: userChoices.courses.map((value) => ({
            id: value.id,
            sectionInput: value.sectionInput,
            sectionValue: value.sectionValue,
          })),
          preferences: userChoices.preferences,
        },
        animation,
      })
    );
  }, [userChoices, animation]);

  const getFormatedUserChoices = () => {
    // Properly format the data to send it to API
    const specificCourses = [];
    const courses = [];
    const preferences = {
      breaks: userChoices.preferences.breaks.value,
      time: userChoices.preferences.time.value,
      dayOff: userChoices.preferences.dayOff.value,
      intensive: userChoices.preferences.intensive.value,
    };

    // Separate specifc and general courses
    userChoices.courses.forEach((course) => {
      course.sectionInput?.length > 0
        ? specificCourses.push({
            course_id: course.id,
            section: course.sectionValue,
          })
        : courses.push(course.id);
    });

    return { courses, specificCourses, preferences };
  };

  const generateSchedules = async (setIsLoading) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/generate_schedule`,
        {
          method: "POST",
          body: JSON.stringify(getFormatedUserChoices()),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error, ${response.status}`);
      }

      const data = await response.json();
      navigate("/schedules", { state: data });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box height="100vh" overflow="hidden">
      <form style={{ overflow: "hidden" }}>
        <CourseSelectionForm
          animation={animation}
          userChoices={userChoices}
        ></CourseSelectionForm>
        <PreferencesForm
          animation={animation}
          generateSchedules={generateSchedules}
        ></PreferencesForm>
      </form>
    </Box>
  );
};

export default ScheduleForm;
