import React from "react";
import { Heading } from "@radix-ui/themes";

const LandingPageHeading = ({ text, color }) => {
  return (
    <Heading
      size={{ xl: "9", lg: "9", md: "8", sm: "7", xs: "6", initial: "5" }}
      style={{ color: color }}
    >
      {text}
    </Heading>
  );
};

export default LandingPageHeading;
