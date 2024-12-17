import React from "react";
import GridLayout from "react-grid-layout";

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
    Array.from({ length: 2 }, (_, index) => `${8 + hour}:${minutes[index]}`)
  )
    .flat()
    .slice(0, -1);
  const layout = [
    // Column Headers (days)
    ...Array.from({ length: 8 }, (_, column) => ({
      i: `${column + 1}`,
      x: column,
      y: 0,
      w: 1,
      h: 1,
      static: true,
    })),

    ...Array.from({ length: 21 }, (_, row) =>
      Array.from({ length: 8 }, (_, column) => ({
        i: `cell-${row}-${column}`,
        x: column,
        y: row + 1,
        w: 1,
        h: 1,
        static: true,
      }))
    ).flat(),
  ];

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={8}
      rowHeight={30}
      width={1200}
      margin={[1, 0]}
    >
      {/* Column Headers (days) */}
      {Array.from({ length: 8 }, (_, column) => (
        <div key={`${column + 1}`} style={{ border: "1px solid lightblue" }}>
          {columnHeaders[column]}
        </div>
      ))}

      {/* Row Headers (time slots)*/}
      {Array.from({ length: 21 }, (_, row) => (
        <div key={`cell-${row}-0`} style={{ border: "1px solid lightblue" }}>
          {times[row]}
        </div>
      ))}

      {/* Cells in grid */}
      {Array.from({ length: 21 }, (_, row) =>
        Array.from({ length: 7 }, (_, column) => (
          <div
            key={`cell-${row}-${column + 1}`}
            style={{ border: "1px solid lightblue" }}
          ></div>
        ))
      )}
    </GridLayout>
  );
};
export default ScheduleGrid;
