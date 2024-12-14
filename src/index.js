import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SingleLogin from "./components/Auth/SingleLogin";
import Dashboard from "./components/Admin/Dashboard";
import CourseList from "./components/Admin/CourseManagement/CourseList";
import AddEditCourse from "./components/Admin/CourseManagement/AddEditCourse";
import UserList from "./components/Admin/UserManagement/UserList";
import UserCourseMapping from "./components/Admin/UserManagement/UserCourseMapping";
import ScheduleExam from "./components/Admin/ExamManagement/ScheduleExam";
import ExamResults from "./components/Admin/ExamManagement/ExamResults";
import UploadQuestions from "./components/Admin/QuestionBank/UploadQuestions";
import QuestionList from "./components/Admin/QuestionBank/QuestionList";
import Navbar from "./components/Shared/Navbar";
import Sidebar from "./components/Shared/Sidebar";

function App() {
  const userRole = sessionStorage.getItem("userRole") || "guest";

  const PrivateRoute = ({ children }) => {
    if (userRole !== "admin") {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <Router>
      <div style={{ display: "flex" }}>
        {userRole === "admin" && <Sidebar />}
        <div style={{ flex: 1 }}>
          {userRole === "admin" && <Navbar />}
          <Routes>
            {/* Login Page */}
            <Route path="/" element={<SingleLogin />} />

            {/* Admin Pages */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <PrivateRoute>
                  <CourseList />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/courses/add"
              element={
                <PrivateRoute>
                  <AddEditCourse />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/courses/edit/:id"
              element={
                <PrivateRoute>
                  <AddEditCourse />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateRoute>
                  <UserList />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users/mapping"
              element={
                <PrivateRoute>
                  <UserCourseMapping />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/exams/schedule"
              element={
                <PrivateRoute>
                  <ScheduleExam />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/exams/results"
              element={
                <PrivateRoute>
                  <ExamResults />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/questions/upload"
              element={
                <PrivateRoute>
                  <UploadQuestions />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/questions/list"
              element={
                <PrivateRoute>
                  <QuestionList />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
