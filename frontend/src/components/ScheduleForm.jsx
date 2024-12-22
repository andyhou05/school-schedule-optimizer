import React, { useState, createContext, useReducer } from "react";
import { Box } from "@radix-ui/themes";
import { useNavigate } from "react-router";
import CourseForm from "./CourseForm";
import PreferencesForm from "./PreferencesForm";

export const DispatchUserInputContext = createContext();

export const ACTIONS = {
  submitCourseForm: "submitCourseForm",
  updatePreferences: "updatePreferences",
};

const reducer = (userInput, action) => {
  switch (action.type) {
    case ACTIONS.submitCourseForm:
      return {
        courses: action.payload.courses,
        specificCourses: action.payload.specificCourses,
        preferences: action.payload.preferences,
      };

    case ACTIONS.updatePreferences:
      return {
        ...userInput,
        preferences: {
          ...userInput.preferences,
          [action.payload.updatedPreference]: action.payload.value,
        },
      };
  }
};

const ScheduleForm = () => {
  const navigate = useNavigate();
  const [inputCourses, setInputCourses] = useState([]); // This state is used to render the list items

  // Used for sending info to API
  const [userInput, dispatch] = useReducer(reducer, {
    courses: [],
    specificCourses: [],
    preferences: { dayOff: "", time: "", breaks: "", intensive: false },
  });

  // Used to animate between form components
  const [animation, setAnimation] = useState({ step: 1, direction: "forward" });

  const generateSchedules = async () => {
    try {
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box height="100vh" overflow="hidden">
      <form style={{ overflow: "hidden" }}>
        <DispatchUserInputContext.Provider value={dispatch}>
          <CourseForm
            animation={animation}
            setAnimation={setAnimation}
            setInputCourses={setInputCourses}
            inputCourses={inputCourses}
          ></CourseForm>
          <PreferencesForm
            animation={animation}
            setAnimation={setAnimation}
            generate_schedules={generateSchedules}
          ></PreferencesForm>
        </DispatchUserInputContext.Provider>
      </form>
    </Box>
  );
};

export default ScheduleForm;
