import React from "react";
import {
  Text,
  Flex,
  Button,
  Heading,
  RadioCards,
  Box,
  Em,
  Separator,
} from "@radix-ui/themes";
import FormCard from "./FormCard";

const PreferenceItem = ({ children, text }) => {
  return (
    <Box width="100%">
      <Flex direction="row" gap="5">
        <Text size="5">
          <Em>{text}</Em>
        </Text>
        <Separator orientation="vertical" size="2"></Separator>
        {children}
      </Flex>
    </Box>
  );
};

const PreferencesForm = ({ step, setStep, direction, setDirection }) => {
  return (
    <>
      <FormCard step={2} currentStep={step} direction={direction}>
        <Heading size={"8"} ml="9" mb="9">
          Preferences
        </Heading>
        <Flex height="60vh" direction="column" gap="9" pt="5" ml="9">
          <PreferenceItem text="Breaks"></PreferenceItem>
          <PreferenceItem text="Class Time"></PreferenceItem>
          <PreferenceItem text="Day Off"></PreferenceItem>
          <PreferenceItem text="Intensive"></PreferenceItem>
        </Flex>
        <Box position="absolute" bottom="32px" height="4vh" width="60vw">
          <Button
            size="3"
            style={{ position: "absolute", left: "32px" }}
            onClick={(e) => {
              e.preventDefault();
              setStep((prev) => prev - 1);
              setDirection("backward");
            }}
          >
            Go back
          </Button>
          <Button
            size="3"
            style={{ position: "absolute", right: "32px" }}
            onClick={(e) => e.preventDefault()}
          >
            Generate Schedules
          </Button>
        </Box>
      </FormCard>
    </>
  );
};

export default PreferencesForm;
