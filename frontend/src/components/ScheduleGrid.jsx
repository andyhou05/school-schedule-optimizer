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
  const [courses, setCourses] = useState([
    {
      section: "00001",
      course_id: "101-101-VA",
      name: "Anatomy and Physiology I",
      teacher_id: 2143,
      day: "Mon.",
      time: "8:00 - 10:00",
    },
  ]);
  const daysIndexMap = {
    "Mon.": 1,
    "Tue.": 2,
    "Wed.": 3,
    "Thu.": 4,
    "Fri.": 5,
    "Sat.": 6,
    "Sun.": 7,
  };
  const [teachers, setTeachers] = useState({});

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

  const fetchAllTeacherData = async () => {
    const updatedTeachers = { ...teachers };
    for (const course of courses) {
      const teacher_id = course.teacher_id;
      if (!teachers[teacher_id]) {
        const teacherData = await fetchTeacherData(teacher_id);
        updatedTeachers[teacher_id] = teacherData;
      }
    }
    setTeachers(updatedTeachers);
  };

  useEffect(() => {
    transformCourseTime();
  }, []);

  useEffect(() => {
    fetchAllTeacherData();
  }, [courses]);

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
                        <Text style={{ fontSize: "10px" }}>{`${
                          courseForCell.course_id
                        } sec. ${courseForCell.section} ${
                          teachers[courseForCell.teacher_id]
                            ? teachers[courseForCell.teacher_id][0].rating
                            : "hi"
                        }`}</Text>
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
