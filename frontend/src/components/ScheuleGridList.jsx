import React from "react";
import { Flex, Box, Text } from "@radix-ui/themes";
import { useLocation } from "react-router";
import "./ScheduleGrid";
import ScheduleGrid from "./ScheduleGrid";

const ScheduleGridList = () => {
  const location = useLocation();
  const data = location.state;
  return (
    <Flex direction="column" height="500vh">
      {data.schedules.map((schedule, index) => (
        <ScheduleGrid
          key={index}
          coursesData={schedule.periods}
          teacherRatingsData={data.teacherRatings}
          scheduleScore={schedule.score}
        ></ScheduleGrid>
      ))}
    </Flex>
  );
};

export default ScheduleGridList;
