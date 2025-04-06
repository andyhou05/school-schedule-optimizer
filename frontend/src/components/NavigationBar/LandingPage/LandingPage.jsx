import React from "react";
import { Box, Flex } from "@radix-ui/themes";

import { LandingPageText } from "./LandingPageText";
import { sampleCoursesData, sampleTeacherRatingsData } from "./SampleData";
import ScheduleGrid from "../../Schedule/ScheduleGrid";
import "../../styles/styles.css";

export const LandingPage = () => {
  return (
    <Flex direction="row">
      <LandingPageText />
      <ScheduleGrid
        coursesData={sampleCoursesData}
        teacherRatingsData={sampleTeacherRatingsData}
        scheduleScore={98.67}
        className="schedule-grid-landing-page"
      ></ScheduleGrid>
    </Flex>
  );
};
