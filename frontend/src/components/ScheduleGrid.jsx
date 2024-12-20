import React, { useEffect, useState } from "react";
import { Flex, Em, Link, Text } from "@radix-ui/themes";
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

  const [courses, setCourses] = useState([
    {
      courseId: "530-HSA-VA",
      day: "Fri.",
      id: 8772,
      intensive: false,
      name: "Introduction to Cinema",
      seats: 0,
      section: "00001",
      teacherId: 2075,
      time: "8:30 - 11:30",
    },
  ]);

  const teacherRatings = {
    2075: {
      avgRating: 52.0,
      links: [
        "https://ratemyteachers.com/ca/quebec/montreal/vanier-college/stefik",
        "https://ratemyteachers.com/ca/quebec/montreal/vanier-college/dan-stefik",
        "https://ratemyteachers.com/ca/quebec/montreal/vanier-college/daniel-stefik",
        "https://ratemyteachers.com/ca/quebec/montreal/vanier-college/daniel-w-stefik",
      ],
      name: " Daniel W. Stefik",
    },
  };

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
  const transformCourseTime = () => {
    setCourses((prev) =>
      prev.map((course) => {
        const [start, end] = course.time
          .split(" - ")
          .map((time) => convertTimeBlock(time));
        return {
          ...course,
          start,
          end,
          duration: end - start,
        };
      })
    );
  };

  useEffect(() => {
    transformCourseTime();
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
                        >{`${courseForCell.courseId} sec. ${courseForCell.section}`}</Text>
                        <br></br>
                        <Text size="1">
                          <Em>
                            <Link
                              href="#"
                              weight="medium"
                              style={{ color: "blue" }}
                              onClick={(e) => e.preventDefault()}
                            >{`${teacherRatings[courseForCell.teacherId].name}: 
                        ${
                          teacherRatings[courseForCell.teacherId].avgRating
                        }%`}</Link>
                          </Em>
                        </Text>
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
