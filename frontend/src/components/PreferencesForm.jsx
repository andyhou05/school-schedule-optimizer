import React from "react";
import { Text, Flex, Button } from "@radix-ui/themes";
import FormCard from "./FormCard";

const PreferencesForm = ({ step, setStep, direction, setDirection }) => {
  return (
    <>
      <FormCard step={2} currentStep={step} direction={direction}>
        <Flex height="60vh"></Flex>
        <Button
          onClick={(e) => {
            e.preventDefault();
            setStep((prev) => prev - 1);
            setDirection("backward");
          }}
        >
          click
        </Button>
      </FormCard>
    </>
  );
};

export default PreferencesForm;
