import React from "react";
import { Heading } from "@radix-ui/themes";

const LandingPageHeading = ({ text, color }) => {
  return (
    <Heading size="9" style={{ color: color }}>
      {text}
    </Heading>
  );
};

export default LandingPageHeading;
