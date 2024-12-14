import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  IconButton,
  Snackbar,
  Alert,
  TablePagination,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";

const QuestionList = () => {
  const [courses, setCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchCourses();
    fetchQuestions();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/courses");
      setCourses(response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/questions");
      setQuestions(response.data || []);
      setFilteredQuestions(response.data || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuestions([]);
      setFilteredQuestions([]);
    }
  };

  const handleSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);
    setFilteredQuestions(
      questions.filter((q) => {
        const course = courses.find((course) => course.id === q.courseId);
        return (
          q.questionText.toLowerCase().includes(text) ||
          course?.name.toLowerCase().includes(text) ||
          course?.code.toLowerCase().includes(text)
        );
      })
    );
  };

  const filterByCourse = (courseId) => {
    setSelectedCourse(courseId);
    setFilteredQuestions(questions.filter((q) => q.courseId === courseId));
  };

  const clearCourseFilter = () => {
    setSelectedCourse(null);
    setFilteredQuestions(questions);
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/api/questions/${id}`);
      setSnackbarMessage("Question deleted successfully!");
      setSnackbarOpen(true);
      fetchQuestions();
    } catch (error) {
      console.error("Error deleting question:", error);
      setSnackbarMessage("Failed to delete question.");
      setSnackbarOpen(true);
    }
  };

  const handleCsvUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:9000/api/questions/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSnackbarMessage("CSV uploaded successfully!");
      setSnackbarOpen(true);
      fetchQuestions();
    } catch (error) {
      console.error("Error uploading CSV:", error);
      setSnackbarMessage("Failed to upload CSV.");
      setSnackbarOpen(true);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#F4F6F8",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "24px",
        marginTop: "45px",
      }}
    >
      <Box
        sx={{
          width: "90%",
          maxWidth: "1200px",
          backgroundColor: "#ffffff",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h4" gutterBottom>
          MCQ Question Bank
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <TextField
            placeholder="Search by course name, code, or question"
            value={searchText}
            onChange={handleSearch}
            fullWidth
            sx={{ mr: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="outlined"
            startIcon={<UploadFileIcon />}
            component="label"
          >
            Upload CSV
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleCsvUpload}
            />
          </Button>
        </Box>

        {/* Course Cards */}
        <Typography variant="h5" gutterBottom>
          Courses
        </Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
              <Card
                sx={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedCourse === course.id ? "#1F509A" : "#ffffff",
                  color: selectedCourse === course.id ? "#ffffff" : "#000000",
                  "&:hover": { backgroundColor: "#1F509A", color: "#ffffff" },
                  boxShadow:
                    selectedCourse === course.id
                      ? "0px 4px 12px rgba(31, 80, 154, 0.5)"
                      : "0px 4px 12px rgba(0, 0, 0, 0.1)",
                }}
                onClick={() => filterByCourse(course.id)}
              >
                <CardContent>
                  <Typography variant="h6">{course.name}</Typography>
                  <Typography variant="subtitle2">
                    Code: {course.code}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {selectedCourse && (
          <Button
            variant="contained"
            sx={{ mb: 3 }}
            onClick={clearCourseFilter}
          >
            Clear Course Filter
          </Button>
        )}

        {/* Question Table */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "16px",
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
            maxHeight: "400px", // Enable vertical scrolling
            overflowY: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#1F509A",
                }}
              >
                {[
                  "ID",
                  "Course",
                  "Question",
                  "Options",
                  "Correct Answer",
                  "Actions",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      color: "#ffffff",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredQuestions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((question) => (
                  <TableRow key={question.id}>
                    <TableCell sx={{ textAlign: "center" }}>
                      {question.id}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {
                        courses.find(
                          (course) => course.id === question.courseId
                        )?.name
                      }
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {question.questionText}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {question.options.map((opt, idx) => (
                        <Typography key={idx}>{opt.optionText}</Typography>
                      ))}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {question.correctAnswer}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredQuestions.length}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>

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

export default QuestionList;
