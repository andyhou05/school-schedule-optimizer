import React from "react";
import { Flex, Text, Button } from "@radix-ui/themes";
import LandingPageHeading from "./LandingPageHeading";
import LandingPageButton from "./LandingPageButton";

export const LandingPageText = () => {
  return (
    <Flex
      direction="column"
      justify="center"
      width="30vw"
      height="100vh"
      ml="9"
      pl="9"
    >
      <Flex direction="column" gap="8">
        <LandingPageHeading text={"Courses."} color="#FEC3C7" />
        <LandingPageHeading text={"Preferences."} color="#9AD7F3" />
        <LandingPageHeading text={"Schedules."} color="#6BDFDA" />
      </Flex>
      <Text size="7" mt="9">
        Tired of juggling course registration? Simply enter your classes, set
        your preferences — like breaks, class times, or a free day — and let us
        generate the perfect schedule for you. We’ll even match you with the
        best-rated teachers based on student reviews. Plan smarter. Stress less.
        Start now!
      </Text>
      <LandingPageButton />
    </Flex>
  );
};
