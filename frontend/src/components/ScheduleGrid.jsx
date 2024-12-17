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

  return (
    <table className="schedule-grid">
      <thead>
        <tr>
          {columnHeaders.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 20 }, (_, row) => (
          <tr>
            <td key={`${row}-0`} className="time-slot">
              {times[row]}
              <br></br>
              {times[row + 1]}
            </td>
            {Array.from({ length: 7 }, (_, column) => (
              <td key={row - column}></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default ScheduleGrid;
