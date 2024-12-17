import React from "react";
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
    { name: "Math", day: "Monday", start: 0, duration: 2 }, // 8:00 to 9:00
    { name: "Science", day: "Wednesday", start: 4, duration: 3 }, // 10:00 to 11:30
    { name: "History", day: "Friday", start: 6, duration: 4 }, // 12:00 to 2:00
  ];
  const daysIndexMap = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };

  return (
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
            {/* Row headers (time slots) */}
            <td key={`${row}-0`} className="time-slot">
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
                    className="course-slot"
                    rowSpan={courseForCell.duration}
                  >
                    {courseForCell.name}
                  </td>
                );
              }

              {
                /* Check if the current slot is occupied by a course */
              }
              const isOccuppied = courses.some(
                (course) =>
                  daysIndexMap[course.day] === column + 1 &&
                  row > course.start &&
                  row < course.start + course.duration
              );

              return isOccuppied ? null : <td key={`${row}-${column}`}></td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default ScheduleGrid;
