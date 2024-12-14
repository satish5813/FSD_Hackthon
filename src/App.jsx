import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Lazy loading components
const SingleLogin = lazy(() => import("./components/Auth/SingleLogin"));
const Dashboard = lazy(() => import("./components/Admin/Dashboard"));
const CourseList = lazy(() =>
  import("./components/Admin/CourseManagement/CourseList")
);
const AddEditCourse = lazy(() =>
  import("./components/Admin/CourseManagement/AddEditCourse")
);
const UserList = lazy(() =>
  import("./components/Admin/UserManagement/UserList")
);
const UserCourseMapping = lazy(() =>
  import("./components/Admin/UserManagement/UserCourseMapping")
);
const ScheduleExam = lazy(() =>
  import("./components/Admin/ExamManagement/ScheduleExam")
);
const ExamResults = lazy(() =>
  import("./components/Admin/ExamManagement/ExamResult")
);
const UploadQuestions = lazy(() =>
  import("./components/Admin/QuestionBank/UploadQuestions")
);
const QuestionList = lazy(() =>
  import("./components/Admin/QuestionBank/QuestionList")
);
const Navbar = lazy(() => import("./components/Shared/Navbar"));
const Sidebar = lazy(() => import("./components/Shared/Sidebar"));

function App() {
  const userRole = sessionStorage.getItem("userRole"); // Check login status

  // Protect routes by role
  const PrivateRoute = ({ children }) => {
    if (!userRole) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<SingleLogin />} />

          {/* Authenticated Routes */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute>
                <div style={{ display: "flex" }}>
                  <Sidebar />
                  <div style={{ flex: 1 }}>
                    <Navbar />
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="courses" element={<CourseList />} />
                      <Route path="courses/add" element={<AddEditCourse />} />
                      <Route
                        path="courses/edit/:id"
                        element={<AddEditCourse />}
                      />
                      <Route path="users" element={<UserList />} />
                      <Route
                        path="users/mapping"
                        element={<UserCourseMapping />}
                      />
                      <Route path="exams/schedule" element={<ScheduleExam />} />
                      <Route path="exams/results" element={<ExamResults />} />
                      <Route
                        path="questions/upload"
                        element={<UploadQuestions />}
                      />
                      <Route path="questions/list" element={<QuestionList />} />
                    </Routes>
                  </div>
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
