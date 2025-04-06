import React from "react";
import { Flex, Box, Tabs } from "@radix-ui/themes";

import { LandingPage } from "./LandingPage/LandingPage";
import FAQ from "./FAQ/FAQ";
import Contact from "./Contact";
import "../styles/styles.css";

const NavigationBar = () => {
  return (
    <Tabs.Root defaultValue="home">
      <Box className="navigation-bar-tabs">
        <Tabs.List>
          <Tabs.Trigger value="home">Home</Tabs.Trigger>
          <Tabs.Trigger value="faq">FAQ</Tabs.Trigger>
          <Tabs.Trigger value="contact">Contact Me</Tabs.Trigger>
        </Tabs.List>
      </Box>
      <Box className="navigation-bar-page-content">
        <Tabs.Content value="home">
          <LandingPage />
        </Tabs.Content>
        <Tabs.Content value="faq">
          <FAQ />
        </Tabs.Content>
        <Tabs.Content value="contact">
          <Contact />
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  );
};

export default NavigationBar;
