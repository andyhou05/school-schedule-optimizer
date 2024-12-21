import React, { useState } from "react";
import { Box } from "@radix-ui/themes";
import { useNavigate } from "react-router";
import CourseForm from "./CourseForm";
import PreferencesForm from "./PreferencesForm";

const ScheduleForm = () => {
  const [inputCourses, setInputCourses] = useState([]); // This state is used to render the list items

  // These states are used for sending info to API
  const [specificCourses, setSpecificCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [breaksValue, setBreaksValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [dayOffValue, setDayOffValue] = useState("");
  const [intensive, setIntensive] = useState("");
  const navigate = useNavigate();

  // These states are used for animation
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState("forward");

  const requestSchedules = async (breaks, time, dayOff, intensive) => {
    const payload = {
      courses: courses,
      specificCourses: specificCourses,
      preferences: {
        dayOff,
        time,
        breaks,
        intensive,
      },
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/generate_schedule", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error, ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      navigate("/schedules");
    } catch (error) {
      console.log(error);
    }
  };

  const generate_schedules = () => {
    const breaks =
      breaksValue == 2 ? "short" : breaksValue == 3 ? "regular" : "";
    const time = timeValue == 2 ? "morning" : timeValue == 3 ? "evening" : "";
    const dayOff =
      dayOffValue == 2
        ? "Mon."
        : dayOffValue == 3
        ? "Tue."
        : dayOffValue == 4
        ? "Wed."
        : dayOffValue == 5
        ? "Thu."
        : dayOffValue == 6
        ? "Fri."
        : "";
    requestSchedules(breaks, time, dayOff, intensive);
  };

  return (
    <Box height="100vh" overflow="hidden">
      <form style={{ overflow: "hidden" }}>
        <CourseForm
          step={step}
          setStep={setStep}
          direction={direction}
          setDirection={setDirection}
          inputCourses={inputCourses}
          setInputCourses={setInputCourses}
          setSpecificCourses={setSpecificCourses}
          courses={courses}
          setCourses={setCourses}
        ></CourseForm>
        <PreferencesForm
          step={step}
          setStep={setStep}
          direction={direction}
          setDirection={setDirection}
          setBreaksValue={setBreaksValue}
          setTimeValue={setTimeValue}
          setDayOffValue={setDayOffValue}
          setIntensive={setIntensive}
          generate_schedules={generate_schedules}
        ></PreferencesForm>
      </form>
    </Box>
  );
};

export default ScheduleForm;
