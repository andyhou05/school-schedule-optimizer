import React, { useState, createContext, useReducer, useEffect } from "react";
import { Box } from "@radix-ui/themes";
import { useNavigate } from "react-router";
import CourseForm from "./CourseForm";
import PreferencesForm from "./PreferencesForm";

export const DispatchUserChoices = createContext();
export const DispatchAnimationContext = createContext();

export const ACTIONS = {
  animationNext: "animationNext",
  animationPrevious: "animationPrevious",

  submitCourseForm: "submitCourseForm",
  updatePreferences: "updatePreferences",
  addCourse: "addCourse",
  updateSection: "updateSection",
  deleteCourse: "deleteCourse",
  submitForm: "submitForm",
};

const userChoicesReducer = (userChoices, action) => {
  // need to add to specific courses when submitting and validate everything
  switch (action.type) {
    case ACTIONS.addCourse:
      return {
        ...userChoices,
        courses: [...userChoices.courses, action.payload],
      };

    case ACTIONS.deleteCourse:
      return {
        ...userChoices,
        courses: userChoices.courses.filter(
          (course) => course.id !== action.payload
        ),
      };

    case ACTIONS.submitForm:
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

    case ACTIONS.updateSection:
      return {
        ...userChoices,
        courses: userChoices.courses.map((course, index) =>
          index == action.payload.index
            ? {
                id: course.id,
                sectionInput: action.payload.input,
                sectionValue: action.payload.value,
              }
            : course
        ),
      };
  }
};

const animationReducer = (animation, action) => {
  switch (action.type) {
    case ACTIONS.animationNext:
      return { step: animation.step + 1, direction: "forward" };

    case ACTIONS.animationPrevious:
      return { step: animation.step - 1, direction: "backward" };
  }
};

const ScheduleForm = () => {
  const navigate = useNavigate();

  // Used to animate between form components
  const [animation, animationDispatch] = useReducer(
    animationReducer,
    JSON.parse(window.sessionStorage.getItem("SCHEDULE_FORM"))?.animation ?? {
      step: 1,
      direction: "forward",
    }
  );

  // This state is used to render the list items
  const [userChoices, userChoicesDispatch] = useReducer(
    userChoicesReducer,
    JSON.parse(window.sessionStorage.getItem("SCHEDULE_FORM"))?.userChoices ?? {
      courses: [], // { id: "", sectionInput: "", sectionValue: "" }
      preferences: [
        {
          breaks: { input: "0", value: "" },
          time: { input: "0", value: "" },
          dayOff: { input: "0", value: "" },
          intensive: { input: "false", value: "" },
        },
      ],
    }
  );

  // Save component values in session
  useEffect(() => {
    window.sessionStorage.setItem(
      "SCHEDULE_FORM",
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

  const generateSchedules = async (setIsLoading) => {
    try {
      setIsLoading(true);
      const response = await fetch("http://127.0.0.1:5000/generate_schedule", {
        method: "POST",
        body: JSON.stringify(userInput),
        headers: {
          "Content-Type": "application/json",
        },
      });

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
        <DispatchUserChoices.Provider value={userChoicesDispatch}>
          <DispatchAnimationContext.Provider value={animationDispatch}>
            <CourseForm
              animation={animation}
              userChoices={userChoices}
            ></CourseForm>
            <PreferencesForm
              animation={animation}
              generate_schedules={generateSchedules}
            ></PreferencesForm>
          </DispatchAnimationContext.Provider>
        </DispatchUserChoices.Provider>
      </form>
    </Box>
  );
};

export default ScheduleForm;
