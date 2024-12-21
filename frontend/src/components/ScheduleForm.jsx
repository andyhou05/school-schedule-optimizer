import React, { useState, useEffect } from "react";
import { Box } from "@radix-ui/themes";
import { useNavigate } from "react-router";
import CourseForm from "./CourseForm";
import PreferencesForm from "./PreferencesForm";

const ScheduleForm = () => {
  const navigate = useNavigate();
  const [inputCourses, setInputCourses] = useState([]); // This state is used to render the list items

  // Used for sending info to API
  const [userPreferences, setUserPreferences] = useState({
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
        body: JSON.stringify(userPreferences),
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
        <CourseForm
          animation={animation}
          setAnimation={setAnimation}
          inputCourses={inputCourses}
          setInputCourses={setInputCourses}
          setUserPreferences={setUserPreferences}
        ></CourseForm>
        <PreferencesForm
          animation={animation}
          setAnimation={setAnimation}
          setUserPreferences={setUserPreferences}
          generate_schedules={generateSchedules}
        ></PreferencesForm>
      </form>
    </Box>
  );
};

export default ScheduleForm;
