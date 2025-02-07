import React from "react";
import { Flex } from "@radix-ui/themes";
import { motion, AnimatePresence } from "framer-motion";

import CoursesCallout from "../Notifications/Callouts/CoursesCallout";
import ConflictsCallout from "../Notifications/Callouts/ConflictsCallout";

const CalloutDiv = () => {
  return (
    <motion.div
      key="validSectionInput"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      layout
    ></motion.div>
  );
};

const CalloutContainer = () => {
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
          coursesData.length &&
          userChoices.courses.length && (
            <CalloutDiv>
              <CoursesCallout />
            </CalloutDiv>
          )}

        {inputHasConflicts &&
          coursesData.length &&
          userChoices.courses.length && (
            <CalloutDiv>
              <ConflictsCallout />
            </CalloutDiv>
          )}
      </AnimatePresence>
    </Flex>
  );
};

export default CalloutContainer;
