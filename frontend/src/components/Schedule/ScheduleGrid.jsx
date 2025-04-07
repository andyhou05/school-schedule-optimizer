import React from "react";
import { Flex, Em, Tooltip, Text } from "@radix-ui/themes";

import CourseCell from "./CourseCell";
import InfoButton from "../ScheduleForm/InfoButton/InfoButton";
import "../styles/styles.css";

const ScheduleGrid = ({
  coursesData,
  teacherRatingsData,
  scheduleScore,
  className,
}) => {
  const columnHeaders = [
    "Time",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const minutes = ["00", "30"];
  const times = Array.from(
    { length: 11 },
    (
      _,
      hour // Loop through all available hours and minutes
    ) => Array.from(minutes, (minute, _) => `${8 + hour}:${minute}`)
  )
    .flat()
    .slice(0, -1); // Remove 18:30 since classes finish at 18:00

  const daysIndexMap = {
    "Mon.": 1,
    "Tue.": 2,
    "Wed.": 3,
    "Thu.": 4,
    "Fri.": 5,
    "Sat.": 6,
    "Sun.": 7,
  };

  const isOccupied = (row, column) =>
    coursesData.some(
      (course) =>
        daysIndexMap[course.day] === column + 1 &&
        row >= course.startTime &&
        row < course.endTime
    );

  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      gap="2"
      mt="9"
      mb="9"
    >
      <table className="schedule-grid">
        <thead>
          <tr>
            {/* Column headers (days) */}
            {columnHeaders.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time, row) =>
            times[row + 1] ? (
              <tr key={row}>
                {/* Row headers (time slot) */}
                <td key={`${row}-0`} className="time-cell">
                  {time}
                  <br></br>
                  {times[row + 1]}
                </td>

                {/* Course cells */}
                {Array.from({ length: 7 }, (_, column) => {
                  const courseCellInformation = coursesData.find(
                    (course) =>
                      daysIndexMap[course.day] === column + 1 &&
                      course.startTime === row
                  );

                  if (courseCellInformation) {
                    return (
                      <CourseCell
                        key={`${row}-${column}`}
                        courseCellInformation={courseCellInformation}
                        teacherRatingsData={teacherRatingsData}
                      ></CourseCell>
                    );
                  }

                  return !isOccupied(row, column) ? (
                    <td key={`${row}-${column}`} className="empty-cell"></td>
                  ) : null;
                })}
              </tr>
            ) : null
          )}
        </tbody>
      </table>
      <Flex gap="2" align="center" justify="center">
        <Tooltip
          delayDuration={150}
          side="bottom"
          content="The overall score of this schedule based off your preferences and teacher ratings."
        >
          <InfoButton />
        </Tooltip>
        <Text size="6">
          <Em>Schedule Score:</Em>
        </Text>
        <Text size="6" weight="bold">
          <Em>{scheduleScore.toFixed(2)}%</Em>
        </Text>
      </Flex>
    </Flex>
  );
};
export default ScheduleGrid;
