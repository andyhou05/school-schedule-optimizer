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
import InfoButton from "../InfoButton/InfoButton";
import {
  DispatchUserChoicesContext,
  UserChoicesContext,
} from "../../Context/UserChoicesProvider";
import { DispatchAnimationContext } from "../../Context/AnimationProvider";
import ACTIONS from "../../Context/Reducer/Actions";

const PreferenceItem = ({ children, text, content }) => {
  return (
    <Box width="100">
      <Flex direction="row" gap="5" height="5vh" align="center">
        <Tooltip delayDuration={150} content={content}>
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

const PreferencesForm = ({ animation, generateSchedules }) => {
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
          <Tooltip
            delayDuration={150}
            content="You can choose any preferences you want your schedule to have. Keep in mind that the more preferences you choose, the less we will be able to completely fulfill them."
          >
            <InfoButton mt="2" />
          </Tooltip>
        </Flex>
        <Flex height="60vh" direction="column" gap="9" pt="5" ml="7">
          <PreferenceItem
            text="Breaks"
            content="You can choose whether you prefer to have as little breaks a possible, or prefer to have breaks between your courses."
          >
            <PreferenceRadioCards
              size="3"
              gap="9"
              items={["No Preferences", "Less Breaks", "More Breaks"]}
              API_values={["", "short", "regular"]}
              name="breaks"
            ></PreferenceRadioCards>
          </PreferenceItem>
          <PreferenceItem
            text="Class Time"
            content="You can choose whether you prefer to have early classes or later during the day."
          >
            <PreferenceRadioCards
              size="3"
              gap="9"
              items={["No Preferences", "Morning Classes", "Evening Classes"]}
              API_values={["", "morning", "evening"]}
              name="time"
            ></PreferenceRadioCards>
          </PreferenceItem>
          <PreferenceItem
            text="Day Off"
            content="You can choose if you would like to have a day off in your schedule. Note that this may not always be possible."
          >
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
          <PreferenceItem
            text="Intensive"
            content="You can choose whether you want to include intensive courses or not. They are offered for gym courses and can include classes during weekends."
          >
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
              generateSchedules(setIsLoading);
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
