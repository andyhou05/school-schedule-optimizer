import React, { useState } from "react";
import { Box } from "@radix-ui/themes";
import CourseForm from "./CourseForm";
import PreferencesForm from "./PreferencesForm";

const ScheduleForm = () => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState("forward");

  return (
    <Box height="100vh" overflow="hidden">
      <form style={{ overflow: "hidden" }}>
        <CourseForm
          step={step}
          setStep={setStep}
          direction={direction}
          setDirection={setDirection}
        ></CourseForm>
        <PreferencesForm
          step={step}
          setStep={setStep}
          direction={direction}
          setDirection={setDirection}
        ></PreferencesForm>
      </form>
    </Box>
  );
};

export default ScheduleForm;
