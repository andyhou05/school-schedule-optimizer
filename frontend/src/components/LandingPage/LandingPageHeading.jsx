import React from "react";
import { Heading } from "@radix-ui/themes";

export const LandingPageHeading = ({ text, color }) => {
  return (
    <Heading size="9" style={{ color: color }}>
      {text}
    </Heading>
  );
};
