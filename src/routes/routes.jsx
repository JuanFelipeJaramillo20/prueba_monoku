import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import MoodTracker from "../views/MoodTracker";
import Trends from "../views/Trends";
import Login from "../views/Login";
import Register from "../views/Register";
export const RoutesConfiguration = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/moodtracker" element={<MoodTracker />} />
        <Route path="/trends" element={<Trends />} />
      </Routes>
    </Router>
  );
};
