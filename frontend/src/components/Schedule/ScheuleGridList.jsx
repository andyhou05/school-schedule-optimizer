import React, { useEffect } from "react";
import { Flex } from "@radix-ui/themes";
import { useLocation, useNavigate } from "react-router";
import "./ScheduleGrid";
import ScheduleGrid from "./ScheduleGrid";

const ScheduleGridList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  useEffect(() => {
    if (data == null) navigate("/");
  }, []);

  return (
    <Flex direction="column">
      {data?.schedules.map((schedule, index) => (
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
