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
      day: "Thu.",
      id: 8773,
      intensive: false,
      name: "Introduction to Cinema",
      seats: 0,
      section: "00002",
      teacherId: 2075,
      time: "8:30 - 11:30",
    },
    {
      courseId: "602-HSY-VA",
      day: "Fri.",
      id: 9104,
      intensive: false,
      name: "L'artiste citoyen",
      seats: 0,
      section: "00003",
      teacherId: 2130,
      time: "14:00 - 17:00",
    },
    {
      courseId: "603-HSD-VA",
      day: "Mon.",
      id: 9439,
      intensive: false,
      name: "Rhymes with Relativity",
      seats: 0,
      section: "00004",
      teacherId: 2166,
      time: "14:00 - 16:00",
    },
    {
      courseId: "603-HSD-VA",
      day: "Wed.",
      id: 9440,
      intensive: false,
      name: "Rhymes with Relativity",
      seats: 0,
      section: "00004",
      teacherId: 2166,
      time: "14:00 - 16:00",
    },
    {
      courseId: "345-HSA-VA",
      day: "Thu.",
      id: 8073,
      intensive: false,
      name: "The Ethics of Responsibiity",
      seats: 0,
      section: "00005",
      teacherId: 1977,
      time: "11:30 - 14:30",
    },
    {
      courseId: "109-103-MQ",
      day: "Mon.",
      id: 6388,
      intensive: false,
      name: "Soccer",
      seats: 0,
      section: "00014",
      teacherId: 1727,
      time: "16:00 - 18:00",
    },
  ]);

  const teacherRatings = {
    1727: {
      avgRating: 90.0,
      links: [
        "https://ratemyteachers.com/ca/quebec/montreal/vanier-college/gregory-longtin",
      ],
      name: " Gregory Longtin",
    },
    1729: {
      avgRating: null,
      links: [],
      name: " Jessica Braul",
    },
    1742: {
      avgRating: null,
      links: [
        "https://ratemyteachers.com/ca/quebec/montreal/vanier-college/thomas-edward-oljemark",
        "https://ratemyteachers.com/ca/quebec/montreal/vanier-college/tom-oljemark",
      ],
      name: " Thomas Edward Oljemark",
    },
    1746: {
      avgRating: null,
      links: [],
      name: " Julie Lynn Pigott",
    },
    1977: {
      avgRating: 94.0,
      links: [
        "https://ratemyteachers.com/ca/quebec/montreal/vanier-college/gordon-aronoff",
      ],
      name: " Gordon Aronoff",
    },
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
    2129: {
      avgRating: 76.0,
      links: [
        "https://ratemyteachers.com/ca/quebec/montreal/vanier-college/isabelle-rivest",
      ],
      name: " Isabelle Rivest",
    },
    2130: {
      avgRating: null,
      links: [],
      name: " Anne L'Allier",
    },
    2166: {
      avgRating: 100.0,
      links: [
        "https://ratemyteachers.com/ca/quebec/montreal/vanier-college/marianne-lynch",
        "https://ratemyteachers.com/ca/quebec/montreal/vanier-college/lynch-marianne-marianne",
      ],
      name: " Marianne Lynch",
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
                            >
                              {`${
                                teacherRatings[courseForCell.teacherId].name
                              }: ${
                                teacherRatings[courseForCell.teacherId]
                                  .avgRating
                                  ? `${
                                      teacherRatings[courseForCell.teacherId]
                                        .avgRating
                                    }%`
                                  : "N/A"
                              }`}
                            </Link>
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
