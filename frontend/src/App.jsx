import { useState } from "react";
import { Button } from "@radix-ui/themes";
import ScheduleForm from "./components/ScheduleForm";
import ScheduleGridList from "./components/ScheuleGridList";

function App() {
  return (
    <>
      <ScheduleGridList></ScheduleGridList>
    </>
  );
}

export default App;
