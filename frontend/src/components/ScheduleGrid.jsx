import React, { useEffect, useState } from "react";
import { Flex, Em, Strong, Text } from "@radix-ui/themes";
import "./styles.css";

const ScheduleGrid = () => {
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
  const courses = [
    {
      section: "00001",
      course_id: "101-101-VA",
      name: "Anatomy and Physiology I",
      teacher_id: 2075,
      day: "Mon.",
      time: "8:00 - 10:00",
    },
  ];
  const daysIndexMap = {
    "Mon.": 1,
    "Tue.": 2,
    "Wed.": 3,
    "Thu.": 4,
    "Fri.": 5,
    "Sat.": 6,
    "Sun.": 7,
  };
  const teachers = {};

  // TODO: Convert time on the backend
  const convertTimeBlock = (time) => {
    const [hour, minutes] = time.trim().split(":").map(Number);
    let timeBlock = (Math.floor(hour) - 8) * 2;
    timeBlock = minutes === 30 ? timeBlock + 1 : timeBlock;
    return timeBlock;
  };
  const transformCourseTime = (courses = []) => {
    courses.forEach((course, _) => {
      const [start, end] = course.time
        .split(" - ")
        .map((time, _) => convertTimeBlock(time));
      course.start = start;
      course.end = end;
      course.duration = end - start;
    });
  };

  const fetchTeacherData = async (teacher_id) => {
    try {
      const result = await fetch(
        `http://127.0.0.1:5000/get_teacher_rating/${teacher_id}`
      ).then((response) => response.json());
      return result.teacherRatings;
    } catch (error) {
      console.log("Error fetching data", error);
      return [];
    }
  };
  transformCourseTime(courses);

  useEffect(() => {
    courses.forEach((course, _) => {
      const teacher_id = course.teacher_id;
      teachers.teacher_id = fetchTeacherData(teacher_id);
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "150vh",
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
          {Array.from({ length: 20 }, (_, row) => (
            <tr key={row}>
              {/* Row headers (time cell) */}
              <td key={`${row}-0`} className="time-cell">
                {times[row]}
                <br></br>
                {times[row + 1]}
              </td>

              {/* Course cells */}
              {Array.from({ length: 7 }, (_, column) => {
                const courseForCell = courses.find(
                  (course) =>
                    daysIndexMap[course.day] === column + 1 &&
                    course.start === row
                );

                if (courseForCell) {
                  return (
                    <td
                      key={`${row}-${column}`}
                      className="course-cell"
                      rowSpan={courseForCell.duration}
                    >
                      <Flex direction="column">
                        <Text size="2" weight="medium">
                          <Em>{courseForCell.name}</Em>
                        </Text>
                        <Text
                          style={{ fontSize: "10px" }}
                        >{`${courseForCell.course_id} sec. ${courseForCell.section}`}</Text>
                      </Flex>
                    </td>
                  );
                }

                {
                  /* Check if the current cell is occupied by a course */
                }
                const isOccuppied = courses.some(
                  (course) =>
                    daysIndexMap[course.day] === column + 1 &&
                    row > course.start &&
                    row < course.end
                );

                return isOccuppied ? null : (
                  <td key={`${row}-${column}`} className="empty-cell"></td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ScheduleGrid;
