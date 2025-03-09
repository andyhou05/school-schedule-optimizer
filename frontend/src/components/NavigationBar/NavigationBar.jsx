import React from "react";
import { Flex, Box, Tabs } from "@radix-ui/themes";

import { LandingPage } from "./LandingPage/LandingPage";
import FAQ from "./FAQ/FAQ";

const NavigationBar = () => {
  return (
    <Tabs.Root defaultValue="home">
      <Box width="fit-content" ml="9" pl="9" mt="5">
        <Tabs.List>
          <Tabs.Trigger value="home">Home</Tabs.Trigger>
          <Tabs.Trigger value="faq">FAQ</Tabs.Trigger>
          <Tabs.Trigger value="contact">Contact Me</Tabs.Trigger>
        </Tabs.List>
      </Box>
      <Box height="100vh">
        <Tabs.Content value="home">
          <LandingPage />
        </Tabs.Content>
        <Tabs.Content value="faq">
          <FAQ />
        </Tabs.Content>
        <Tabs.Content value="contact"></Tabs.Content>
      </Box>
    </Tabs.Root>
  );
};

export default NavigationBar;
