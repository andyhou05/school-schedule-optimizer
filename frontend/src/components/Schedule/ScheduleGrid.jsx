import React, { useEffect, useState } from "react";
import { Flex, Em, Tooltip, Link, Text, IconButton } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";

import CourseCell from "./CourseCell";
import InfoButton from "../ScheduleForm/InfoButton/InfoButton";
import "../styles/styles.css";

const ScheduleGrid = ({ coursesData, teacherRatingsData, scheduleScore }) => {
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
  const times = Array.from({ length: 11 }, (_, hour) =>
    Array.from(minutes, (minute, _) => `${8 + hour}:${minute}`)
  )
    .flat()
    .slice(0, -1);

  const [courses, setCourses] = useState([]);

  const daysIndexMap = {
    "Mon.": 1,
    "Tue.": 2,
    "Wed.": 3,
    "Thu.": 4,
    "Fri.": 5,
    "Sat.": 6,
    "Sun.": 7,
  };

  // TODO: Convert time on the backend
  const convertTimeBlock = (time) => {
    const [hour, minutes] = time.trim().split(":").map(Number);
    let timeBlock = (Math.floor(hour) - 8) * 2;
    timeBlock = minutes === 30 ? timeBlock + 1 : timeBlock;
    return timeBlock;
  };

  const isOccupied = (row, column) =>
    courses.some(
      (course) =>
        daysIndexMap[course.day] === column + 1 &&
        row >= course.start &&
        row < course.end
    );

  useEffect(() => {
    const transformedCourses = coursesData.map((course) => {
      const [start, end] = course.time
        .split(" - ")
        .map((t) => convertTimeBlock(t));
      return { ...course, start, end, duration: end - start };
    });
    setCourses(transformedCourses);
  }, [coursesData]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        marginTop: "10%",
        marginBottom: "10%",
      }}
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
                {/* Row headers (time cell) */}

                <td key={`${row}-0`} className="time-cell">
                  {time}
                  <br></br>
                  {times[row + 1]}
                </td>

                {/* Course cells */}
                {Array.from({ length: 7 }, (_, column) => {
                  const courseCellInformation = courses.find(
                    (course) =>
                      daysIndexMap[course.day] === column + 1 &&
                      course.start === row
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
      <Flex gap="2" align="center" height="5%">
        <Tooltip delayDuration={150}>
          <InfoButton />
        </Tooltip>
        <Text size="6">
          <Em>Schedule Score:</Em>
        </Text>
        <Text size="6" weight="bold">
          <Em>{scheduleScore.toFixed(2)}%</Em>
        </Text>
      </Flex>
    </div>
  );
};
export default ScheduleGrid;
