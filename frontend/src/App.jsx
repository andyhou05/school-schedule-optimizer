import NavigationBar from "./components/NavigationBar/NavigationBar";
import ScheduleForm from "./components/ScheduleForm/ScheduleForm";
import ScheduleGridList from "./components/Schedule/ScheuleGridList";
import ContextProvider from "./components/Context/ContextProvider";
import { Routes, Route } from "react-router";

function App() {
  return (
    <ContextProvider>
      <Routes>
        <Route path="/" element={<NavigationBar />} />
        <Route path="/form" element={<ScheduleForm />} />
        <Route path="/schedules" element={<ScheduleGridList />} />
      </Routes>
    </ContextProvider>
  );
}

export default App;
