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
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Saepe fugiat
        aut ipsum earum asperiores iusto facilis, officiis vel cumque nostrum
        quisquam sed odit temporibus ea voluptas provident officia accusantium
        nesciunt!
      </Text>
      <LandingPageButton />
    </Flex>
  );
};
