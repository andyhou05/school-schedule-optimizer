import { useState } from "react";
import { Button } from "@radix-ui/themes";
import ScheduleForm from "./components/ScheduleForm";
import ScheduleGridList from "./components/ScheuleGridList";
import { Routes, Route } from "react-router";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ScheduleForm />} />
        <Route path="/schedules" element={<ScheduleGridList />} />
      </Routes>
    </>
  );
}

export default App;
