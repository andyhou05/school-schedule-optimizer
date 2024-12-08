import React from "react";
import { Text, Flex, Button, Heading, Box } from "@radix-ui/themes";
import FormCard from "./FormCard";

const PreferencesForm = ({ step, setStep, direction, setDirection }) => {
  return (
    <>
      <FormCard step={2} currentStep={step} direction={direction}>
        <Heading size={"8"} ml={"9"}>
          Preferences
        </Heading>
        <Flex height="60vh" direction="column"></Flex>
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
