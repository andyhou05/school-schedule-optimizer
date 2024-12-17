import React from "react";

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
    <table
      style={{
        border: "1px solid white",
        width: "50vw",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          {columnHeaders.map((header, index) => (
            <th
              key={index}
              style={{ border: "1px solid white", padding: "5px" }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 21 }, (_, row) => (
          <tr>
            <td
              key={`${row}-0`}
              style={{ border: "1px solid white", textAlign: "center" }}
            >
              {times[row]}
            </td>
            {Array.from({ length: 7 }, (_, column) => (
              <td key={row - column} style={{ border: "1px solid white" }}></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
export default ScheduleGrid;
