import React from "react";
import GridLayout from "react-grid-layout";

const ScheduleGrid = () => {
  const days = [
    "",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
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
      {/* Column Headers */}
      {Array.from({ length: 8 }, (_, column) => (
        <div key={`${column + 1}`} style={{ border: "1px solid lightblue" }}>
          {days[column]}
        </div>
      ))}

      {/* Dynamic Cells for rows */}
      {Array.from({ length: 21 }, (_, row) =>
        Array.from({ length: 8 }, (_, column) => (
          <div
            key={`cell-${row}-${column}`}
            style={{ border: "1px solid lightblue" }}
          ></div>
        ))
      )}
    </GridLayout>
  );
};
export default ScheduleGrid;
