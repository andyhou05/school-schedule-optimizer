import React, { useContext, useState } from "react";
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

import FormCard from "../../Layout/FormCard";
import PreferenceRadioCards from "./PreferenceRadioCards";
import {
  DispatchUserChoicesContext,
  UserChoicesContext,
} from "../../Context/UserChoicesProvider";
import { DispatchAnimationContext } from "../../Context/AnimationProvider";
import ACTIONS from "../../Context/Reducer/Actions";

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

const PreferencesForm = ({ animation, generate_schedules }) => {
  const userChoicesDispatch = useContext(DispatchUserChoicesContext);
  const userChoices = useContext(UserChoicesContext);
  const animationDispatch = useContext(DispatchAnimationContext);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <FormCard
        step={2}
        currentStep={animation.step}
        direction={animation.direction}
      >
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
              API_values={["", "short", "regular"]}
              name="breaks"
            ></PreferenceRadioCards>
          </PreferenceItem>
          <PreferenceItem text="Class Time">
            <PreferenceRadioCards
              size="3"
              gap="9"
              items={["No Preferences", "Morning Classes", "Evening Classes"]}
              API_values={["", "morning", "evening"]}
              name="time"
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
              API_values={["", "Mon.", "Tue.", "Wed.", "Thu.", "Fri."]}
              name="dayOff"
            ></PreferenceRadioCards>
          </PreferenceItem>
          <PreferenceItem text="Intensive">
            <Checkbox
              ml="3"
              defaultChecked={userChoices.preferences.intensive.value ?? false}
              size="3"
              onCheckedChange={(e) => {
                userChoicesDispatch({
                  type: ACTIONS.updatePreferences,
                  payload: {
                    updatedPreference: "intensive",
                    value: e,
                    index: 0,
                  },
                });
              }}
            ></Checkbox>
          </PreferenceItem>
        </Flex>
        <Box position="absolute" bottom="32px" height="4vh" width="60vw">
          <Button
            size="3"
            style={{ position: "absolute", left: "32px" }}
            onClick={(e) => {
              e.preventDefault();
              animationDispatch({ type: ACTIONS.animationPrevious });
            }}
          >
            Go back
          </Button>
          <Button
            size="3"
            style={{ position: "absolute", right: "32px" }}
            type="submit"
            loading={isLoading}
            onClick={(e) => {
              e.preventDefault();
              generate_schedules(setIsLoading);
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
