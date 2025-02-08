import React, { useContext } from "react";
import { Flex } from "@radix-ui/themes";
import { motion, AnimatePresence } from "framer-motion";

import CoursesCallout from "./CoursesCallout";
import ConflictsCallout from "./ConflictsCallout/ConflictsCallout";
import { CoursesDataContext } from "../../../Context/CoursesDataProvider";
import { UserChoicesContext } from "../../../Context/UserChoicesProvider";

const CalloutDiv = React.forwardRef(({ children, keyProp }, ref) => {
  return (
    <motion.div
      key={keyProp}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      layout
      ref={ref}
    >
      {children}
    </motion.div>
  );
});

const CalloutContainer = ({ validSectionInput, inputHasConflicts }) => {
  const coursesData = useContext(CoursesDataContext);
  const userChoices = useContext(UserChoicesContext);
  return (
    <Flex
      direction={"column"}
      gap="3"
      pt="4"
      style={{
        width: "40%",
        height: "20%",
        position: "absolute",
        bottom: "-21%",
        justifyContent: "center",
      }}
    >
      <AnimatePresence mode="popLayout">
        {!validSectionInput &&
          coursesData?.length &&
          userChoices?.courses?.length && (
            <CalloutDiv key={validSectionInput}>
              <CoursesCallout />
            </CalloutDiv>
          )}

        {inputHasConflicts &&
          coursesData?.length &&
          userChoices?.courses?.length && (
            <CalloutDiv key={inputHasConflicts}>
              <ConflictsCallout />
            </CalloutDiv>
          )}
      </AnimatePresence>
    </Flex>
  );
};

export default CalloutContainer;
