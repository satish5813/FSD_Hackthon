import React from "react";
import { Box, Grid, Typography, Card, CardContent } from "@mui/material";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Mock Data
const courses = [
  { id: 1, name: "React Basics" },
  { id: 2, name: "Advanced JavaScript" },
  { id: 3, name: "UI/UX Design" },
];
const students = [
  { id: 1, name: "John Doe", courseId: 1, passed: true },
  { id: 2, name: "Jane Smith", courseId: 1, passed: false },
  { id: 3, name: "Alice Johnson", courseId: 2, passed: true },
  { id: 4, name: "Bob Brown", courseId: 3, passed: false },
];
const upcomingExams = [
  { course: "React Basics", date: "2024-12-15", students: 20 },
  { course: "Advanced JavaScript", date: "2024-12-20", students: 25 },
];

// Chart Data
const barChartData = {
  labels: courses.map((course) => course.name),
  datasets: [
    {
      label: "Passed Students",
      data: courses.map(
        (course) =>
          students.filter((s) => s.courseId === course.id && s.passed).length
      ),
      backgroundColor: "#4CAF50",
    },
    {
      label: "Failed Students",
      data: courses.map(
        (course) =>
          students.filter((s) => s.courseId === course.id && !s.passed).length
      ),
      backgroundColor: "#F44336",
    },
  ],
};

const pieChartData = {
  labels: ["Passed", "Failed"],
  datasets: [
    {
      data: [
        students.filter((s) => s.passed).length,
        students.filter((s) => !s.passed).length,
      ],
      backgroundColor: ["#4CAF50", "#F44336"],
    },
  ],
};

const lineChartData = {
  labels: courses.map((course) => course.name),
  datasets: [
    {
      label: "Students Scheduled for Exams",
      data: [20, 25, 15],
      borderColor: "#1F509A",
      backgroundColor: "rgba(31, 80, 154, 0.2)",
      fill: true,
    },
  ],
};

const Dashboard = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
        minHeight: "100vh",
        backgroundColor: "#F9FAFC",
        padding: "32px",
        margin: "0 auto",
        marginTop: "25px",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1F509A", textAlign: "center" }}
      >
        Admin Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        {[
          {
            title: "Total Courses",
            value: courses.length,
            gradient: "#1F509A, #62B6F0",
          },
          {
            title: "Mapped Question Banks",
            value: courses.length,
            gradient: "#6A1B9A, #AB47BC",
          },
          {
            title: "Total Students",
            value: students.length,
            gradient: "#388E3C, #66BB6A",
          },
          {
            title: "Exams Scheduled",
            value: upcomingExams.length,
            gradient: "#FF5722, #FF8A65",
          },
        ].map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                background: `linear-gradient(to right, ${card.gradient})`,
                color: "#fff",
                padding: "16px",
                boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
                borderRadius: "12px",
                height: "150px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6">{card.title}</Typography>
                <Typography variant="h4">{card.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Graphs Section */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              padding: "16px",
              background: "linear-gradient(to bottom, #1F509A, #E3F2FD)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: "bold",
                color: "#fff",
                textAlign: "center",
              }}
            >
              Passed vs Failed Students
            </Typography>
            <Box sx={{ height: "300px", width: "100%" }}>
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      title: { display: true, text: "Courses", color: "#fff" },
                    },
                    y: {
                      title: {
                        display: true,
                        text: "Number of Students",
                        color: "#fff",
                      },
                    },
                  },
                }}
              />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              padding: "16px",
              background: "linear-gradient(to bottom, #6A1B9A, #F3E5F5)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: "bold",
                color: "#fff",
                textAlign: "center",
              }}
            >
              Overall Performance (Pie Chart)
            </Typography>
            <Box sx={{ height: "300px", width: "100%" }}>
              <Pie data={pieChartData} options={{ responsive: true }} />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card
            sx={{
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              padding: "16px",
              background: "linear-gradient(to bottom, #388E3C, #C8E6C9)",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: "bold",
                color: "#fff",
                textAlign: "center",
              }}
            >
              Students Scheduled for Exams (Line Chart)
            </Typography>
            <Box sx={{ height: "300px", width: "100%" }}>
              <Line
                data={lineChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      title: { display: true, text: "Courses", color: "#fff" },
                    },
                    y: {
                      title: {
                        display: true,
                        text: "Number of Students",
                        color: "#fff",
                      },
                    },
                  },
                }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
