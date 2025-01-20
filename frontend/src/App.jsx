import ScheduleForm from "./components/ScheduleForm/ScheduleForm";
import ScheduleGridList from "./components/Schedule/ScheuleGridList";
import { UserChoicesProvider } from "./components/Context/UserChoicesProvider";
import { AnimationProvider } from "./components/Context/AnimationProvider";
import { Routes, Route } from "react-router";

function App() {
  return (
    <AnimationProvider>
      <UserChoicesProvider>
        <Routes>
          <Route path="/" element={<ScheduleForm />} />
          <Route path="/schedules" element={<ScheduleGridList />} />
        </Routes>
      </UserChoicesProvider>
    </AnimationProvider>
  );
}

export default App;
