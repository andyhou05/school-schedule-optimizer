import React from "react";
import { Flex, Heading } from "@radix-ui/themes";
import { LandingPageHeading } from "./LandingPageHeading";

export const LandingPageText = () => {
  return (
    <Flex direction="column">
      <Flex direction="column" gap="8">
        <LandingPageHeading text={"Courses."} color="#FEC3C7" />
        <LandingPageHeading text={"Preferences."} color="#9AD7F3" />
        <LandingPageHeading text={"Schedules."} color="#6BDFDA" />
      </Flex>
    </Flex>
  );
};
