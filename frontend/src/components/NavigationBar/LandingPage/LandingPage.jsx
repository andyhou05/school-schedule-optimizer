import React from "react";
import { Box, Flex } from "@radix-ui/themes";

import { LandingPageText } from "./LandingPageText";
import { sampleCoursesData, sampleTeacherRatingsData } from "./SampleData";
import ScheduleGrid from "../../Schedule/ScheduleGrid";
import "../../styles/styles.css";

export const LandingPage = () => {
  return (
    <Flex className="landing-page-layout" direction="row" gap="9">
      <LandingPageText />
      <ScheduleGrid
        coursesData={sampleCoursesData}
        teacherRatingsData={sampleTeacherRatingsData}
        scheduleScore={98.67}
      ></ScheduleGrid>
    </Flex>
  );
};
