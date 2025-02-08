import React from "react";
import { Flex } from "@radix-ui/themes";
import CalloutTemplate from "./CalloutTemplate";
import InfoButton from "../../InfoButton/InfoButton";

const ConflictsCallout = () => {
  return (
    <CalloutTemplate
      text={"There are time conflicts in your selected courses."}
    >
      <InfoButton></InfoButton>
    </CalloutTemplate>
  );
};
export default ConflictsCallout;
