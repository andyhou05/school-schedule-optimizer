import React, { useState } from "react";
import {
  Text,
  Flex,
  Button,
  Heading,
  Checkbox,
  Box,
  Em,
  Separator,
  Tooltip,
  IconButton,
} from "@radix-ui/themes";
import {
  QuestionMarkCircledIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import FormCard from "./FormCard";
import PreferenceRadioCards from "./PreferenceRadioCards";

const PreferenceItem = ({ children, text }) => {
  return (
    <Box width="100">
      <Flex direction="row" gap="5" height="5vh" align="center">
        <Tooltip delayDuration={150}>
          <IconButton
            radius="full"
            size="1"
            variant="ghost"
            onClick={(e) => e.preventDefault()}
          >
            <QuestionMarkCircledIcon height="20px" width="20px" />
          </IconButton>
        </Tooltip>
        <Text size="5">
          <Em>{text}</Em>
        </Text>
        <Separator orientation="vertical" size="2"></Separator>
        <Flex height="5vh" width="5000px" align="center">
          {children}
        </Flex>
      </Flex>
    </Box>
  );
};

const PreferencesForm = ({ step, setStep, direction, setDirection }) => {
  const [breaksValue, setBreaksValue] = useState("");
  const [timeValue, setTimeValue] = useState("");
  const [dayOffValue, setDayOffValue] = useState("");
  const [intensiveValue, setIntensiveValue] = useState("");

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
  };

  return (
    <>
      <FormCard step={2} currentStep={step} direction={direction}>
        <Flex align="center" gap="4" ml="9" mb="9">
          <Heading size={"8"} as="h1">
            Preferences
          </Heading>
          <Tooltip delayDuration={150}>
            <IconButton
              radius="full"
              color="gray"
              mt="2"
              variant="ghost"
              size="1"
              onClick={(e) => e.preventDefault()}
            >
              <InfoCircledIcon height="20px" width="20px"></InfoCircledIcon>
            </IconButton>
          </Tooltip>
        </Flex>
        <Flex height="60vh" direction="column" gap="9" pt="5" ml="7">
          <PreferenceItem text="Breaks">
            <PreferenceRadioCards
              size="3"
              gap="9"
              items={["No Preferences", "Short Breaks", "Regular Breaks"]}
              setSelectedValue={setBreaksValue}
            ></PreferenceRadioCards>
          </PreferenceItem>
          <PreferenceItem text="Class Time">
            <PreferenceRadioCards
              size="3"
              gap="9"
              items={["No Preferences", "Morning Classes", "Evening Classes"]}
              setSelectedValue={setTimeValue}
            ></PreferenceRadioCards>
          </PreferenceItem>
          <PreferenceItem text="Day Off">
            <PreferenceRadioCards
              size="2"
              gap="8"
              items={[
                "None",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
              ]}
              setSelectedValue={setDayOffValue}
            ></PreferenceRadioCards>
          </PreferenceItem>
          <PreferenceItem text="Intensive">
            <Checkbox
              ml="3"
              size="3"
              onCheckedChange={setIntensiveValue}
            ></Checkbox>
          </PreferenceItem>
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
            onClick={(e) => {
              e.preventDefault();
              generate_schedules();
            }}
          >
            Generate Schedules
          </Button>
        </Box>
      </FormCard>
    </>
  );
};

export default PreferencesForm;
