import React from "react";
import { Box, Flex } from "@radix-ui/themes";

import { LandingPageText } from "./LandingPageText";
import ScheduleGrid from "../Schedule/ScheduleGrid";
import { sampleCoursesData, sampleTeacherRatingsData } from "./SampleData";

export const LandingPage = () => {
  return (
    <Flex direction="row">
      <LandingPageText />
      <ScheduleGrid
        coursesData={sampleCoursesData}
        teacherRatingsData={sampleTeacherRatingsData}
        scheduleScore={98.67}
      ></ScheduleGrid>
    </Flex>
  );
};
