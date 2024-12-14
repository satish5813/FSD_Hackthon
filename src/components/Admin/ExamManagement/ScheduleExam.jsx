import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";

const ScheduleExam = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [examDate, setExamDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [studentCount, setStudentCount] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleSave = async () => {
    if (
      !selectedCourse ||
      !examDate ||
      !startTime ||
      !duration ||
      !dayOfWeek ||
      !studentCount
    ) {
      setSnackbarMessage("All fields are required!");
      setSnackbarOpen(true);
      return;
    }

    const newExam = {
      courseId: selectedCourse,
      examDate,
      startTime,
      durationMinutes: parseInt(duration, 10),
      dayOfWeek,
      studentCount: parseInt(studentCount, 10),
    };

    try {
      await axios.post("http://localhost:9000/api/exam-schedules", newExam);
      setSnackbarMessage("Exam scheduled successfully!");
      setSnackbarOpen(true);
      resetForm();
    } catch (error) {
      console.error("Error scheduling exam:", error);
      setSnackbarMessage("Failed to schedule the exam!");
      setSnackbarOpen(true);
    }
  };

  const resetForm = () => {
    setSelectedCourse("");
    setExamDate("");
    setStartTime("");
    setDuration("");
    setDayOfWeek("");
    setStudentCount("");
  };

  return (
    <Box
      sx={{
        margin: "40px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F4F6F8",
        borderRadius: "16px",
        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
        padding: "24px",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "24px",
          marginBottom: "20px",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Schedule Exam
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Course</InputLabel>
          <Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            label="Select Course"
          >
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Exam Date"
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Start Time"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Duration (Minutes)"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Day of the Week"
          type="text"
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(e.target.value)}
          placeholder="e.g., Monday"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Student Count"
          type="number"
          value={studentCount}
          onChange={(e) => setStudentCount(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: "flex", gap: "16px" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1F509A",
              "&:hover": { backgroundColor: "#174079" },
            }}
            onClick={handleSave}
          >
            Save
          </Button>
          <Button variant="outlined" onClick={resetForm}>
            Cancel
          </Button>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="info"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ScheduleExam;
