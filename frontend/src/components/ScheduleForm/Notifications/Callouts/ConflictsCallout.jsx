import React from "react";
import CalloutTemplate from "./CalloutTemplate";

const ConflictsCallout = ({ inputHasConflicts }) => {
  return (
    <CalloutTemplate
      condition={inputHasConflicts}
      text={"There are time conflicts in your selected courses."}
    ></CalloutTemplate>
  );
};
export default ConflictsCallout;
