import React from "react";
import CalloutTemplate from "../CalloutTemplate";
import ConflictsDialog from "./ConflictsDialog";
import InfoButton from "../../../InfoButton/InfoButton";

const ConflictsCallout = () => {
  return (
    <CalloutTemplate
      text={"There are time conflicts in your selected courses."}
    >
      <ConflictsDialog>
        <InfoButton></InfoButton>
      </ConflictsDialog>
    </CalloutTemplate>
  );
};
export default ConflictsCallout;
