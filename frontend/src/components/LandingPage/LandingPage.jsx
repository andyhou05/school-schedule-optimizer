import React from "react";
import { Box, Flex } from "@radix-ui/themes";

import { LandingPageText } from "./LandingPageText";

export const LandingPage = () => {
  return (
    <Flex direction="row">
      <LandingPageText />
    </Flex>
  );
};
