import React from "react";
import GridLayout from "react-grid-layout";

const ScheduleGrid = () => {
  const layout = [
    { i: "1", x: 0, y: 0, w: 1, h: 1, static: true },
    { i: "2", x: 1, y: 0, w: 1, h: 1, static: true },
    { i: "3", x: 2, y: 0, w: 1, h: 1, static: true },
    { i: "4", x: 3, y: 0, w: 1, h: 1, static: true },
    { i: "5", x: 4, y: 0, w: 1, h: 1, static: true },
    { i: "6", x: 5, y: 0, w: 1, h: 1, static: true },
    { i: "7", x: 6, y: 0, w: 1, h: 1, static: true },
    { i: "8", x: 7, y: 0, w: 1, h: 1, static: true },

    ...Array.from({ length: 12 }, (_, row) =>
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
      <div key="1" style={{ border: "1px solid lightblue" }}></div>
      <div key="2" style={{ border: "1px solid lightblue" }}>
        Monday
      </div>
      <div key="3" style={{ border: "1px solid lightblue" }}>
        Tuesday
      </div>
      <div key="4" style={{ border: "1px solid lightblue" }}>
        Wednesday
      </div>
      <div key="5" style={{ border: "1px solid lightblue" }}>
        Thursday
      </div>
      <div key="6" style={{ border: "1px solid lightblue" }}>
        Friday
      </div>
      <div key="7" style={{ border: "1px solid lightblue" }}>
        Saturday
      </div>
      <div key="8" style={{ border: "1px solid lightblue" }}>
        Sunday
      </div>

      {/* Dynamic Cells for rows */}
      {Array.from({ length: 12 }, (_, row) =>
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
