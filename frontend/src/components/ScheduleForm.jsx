import React, { useState } from "react";
import { Box } from "@radix-ui/themes";
import CourseForm from "./CourseForm";
import PreferencesForm from "./PreferencesForm";

const ScheduleForm = () => {
  const [step, setStep] = useState(1);

  return (
    <Box height="100vh" overflow="hidden">
      <form style={{ overflow: "hidden" }}>
        <CourseForm step={step} setStep={setStep}></CourseForm>
        <PreferencesForm step={step} setStep={setStep}></PreferencesForm>
      </form>
    </Box>
  );
};

export default ScheduleForm;
