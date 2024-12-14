import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Snackbar,
  Alert,
  Button,
  Paper,
  TableContainer,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ExamResults = () => {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchResults();
    fetchStudents();
  }, []);

  // Fetch all results from API
  const fetchResults = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/results");
      setResults(response.data);
      setFilteredResults(response.data); // Initialize filtered results
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  // Fetch all students from API
  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/user-roles");
      const studentUsers = response.data.filter(
        (user) => user.role === "Student"
      );
      setStudents(studentUsers);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Handle delete result
  const handleDeleteResult = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/api/results/${id}`);
      setSnackbarMessage("Result deleted successfully!");
      setSnackbarOpen(true);
      fetchResults();
    } catch (error) {
      console.error("Error deleting result:", error);
      setSnackbarMessage("Failed to delete result.");
      setSnackbarOpen(true);
    }
  };

  // Filter results based on search query or selected student
  const handleFilter = () => {
    const query = searchQuery.toLowerCase();
    const filtered = results.filter((result) => {
      const matchesSearch =
        result.studentName.toLowerCase().includes(query) ||
        result.course.toLowerCase().includes(query);
      const matchesStudent = selectedStudent
        ? result.studentId === selectedStudent
        : true;
      return matchesSearch && matchesStudent;
    });
    setFilteredResults(filtered);
  };

  // Update filter when search query or selected student changes
  useEffect(() => {
    handleFilter();
  }, [searchQuery, selectedStudent]);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#F4F6F8",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Center content horizontally
      }}
    >
      <Typography variant="h4" gutterBottom>
        Exam Results
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: "16px",
          marginBottom: "16px",
          flexWrap: "wrap",
          justifyContent: "center", // Center filter controls
          maxWidth: "800px",
        }}
      >
        <FormControl sx={{ minWidth: "200px" }}>
          <InputLabel>Select Student</InputLabel>
          <Select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            label="Select Student"
          >
            <MenuItem value="">All Students</MenuItem>
            {students.map((student) => (
              <MenuItem key={student.id} value={student.id}>
                {student.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Search by Student Name or Course"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            maxWidth: "400px",
          }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          width: "80%", // Adjust width to fit nicely
          maxWidth: "900px", // Restrict maximum width
          borderRadius: "16px",
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
          overflow: "hidden", // Prevent overflow for long content
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#1F509A",
              }}
            >
              {["Student Name", "Course", "Exam Date", "Score", "Actions"].map(
                (header) => (
                  <TableCell
                    key={header}
                    sx={{
                      color: "#ffffff",
                      fontWeight: "bold",
                      textAlign: "center", // Center-align header text
                    }}
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredResults.map((result) => (
              <TableRow
                key={result.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#F7FAFC",
                  },
                }}
              >
                <TableCell sx={{ textAlign: "center" }}>
                  {result.studentName}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {result.course}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {result.examDate}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  {result.score}
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteResult(result.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExamResults;
