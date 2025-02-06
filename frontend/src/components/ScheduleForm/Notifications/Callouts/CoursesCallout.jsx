import React from "react";
import CalloutTemplate from "./CalloutTemplate";

const CoursesCallout = ({ validSectionInput }) => {
  return (
    <CalloutTemplate
      condition={!validSectionInput}
      text={"Please enter valid section numbers before continuing."}
    ></CalloutTemplate>
  );
};
export default CoursesCallout;
