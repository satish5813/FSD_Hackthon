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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SearchIcon from "@mui/icons-material/Search";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [csvError, setCsvError] = useState("");

  // Fetch all courses from the API
  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/courses");
      setCourses(response.data);
      setFilteredCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Open dialog for Add/Edit Course
  const handleOpenDialog = (course = null) => {
    setCurrentCourse(course);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCurrentCourse(null);
    setDialogOpen(false);
  };

  // Handle Add/Edit Course
  const handleSaveCourse = async () => {
    try {
      const isEdit = !!currentCourse?.id;
      if (
        currentCourse.name &&
        currentCourse.code &&
        currentCourse.description &&
        currentCourse.schedule
      ) {
        if (isEdit) {
          await axios.put(
            `http://localhost:9000/api/courses/${currentCourse.id}`,
            currentCourse
          );
        } else {
          const response = await axios.post(
            "http://localhost:9000/api/courses",
            currentCourse
          );
          setCourses([...courses, response.data]);
          setFilteredCourses([...courses, response.data]);
        }
        setSnackbarMessage(
          isEdit ? "Course updated successfully!" : "Course added successfully!"
        );
        setSnackbarOpen(true);
        handleCloseDialog();
        fetchCourses();
      }
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  // Handle Delete Course
  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/api/courses/${id}`);
      setSnackbarMessage("Course deleted successfully!");
      setSnackbarOpen(true);
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  // Handle CSV Upload
  const handleCsvUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        await axios.post("http://localhost:9000/api/courses/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSnackbarMessage("CSV uploaded successfully!");
        setSnackbarOpen(true);
        fetchCourses();
      } catch (error) {
        setCsvError("Error uploading CSV file.");
        console.error("Error uploading CSV:", error);
      }
    }
  };

  // Handle Search
  const handleSearch = async (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);

    if (text.trim()) {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/courses/name/${text}`
        );
        setFilteredCourses([response.data]);
      } catch (error) {
        console.error("Error searching course:", error);
      }
    } else {
      setFilteredCourses(courses);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "32px",
        width: "100%",
        marginTop: "30px",
        backgroundColor: "#F7F9FC",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          backgroundColor: "#FFFFFF",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#1F509A",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          Course Management
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <TextField
            placeholder="Search by course name or code"
            value={searchText}
            onChange={handleSearch}
            fullWidth
            sx={{
              marginRight: "16px",
              backgroundColor: "#F7F9FC",
              borderRadius: "8px",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ backgroundColor: "#1F509A", color: "#fff" }}
          >
            Add Course
          </Button>
          <Button
            variant="outlined"
            startIcon={<UploadFileIcon />}
            component="label"
            sx={{
              marginLeft: "8px",
              borderColor: "#1F509A",
              color: "#1F509A",
            }}
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
        {csvError && <Typography color="error">{csvError}</Typography>}
        <TableContainer component={Paper} sx={{ borderRadius: "16px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Course Name</TableCell>
                <TableCell>Course Code</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Schedule</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow
                  key={course.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#F9FAFB",
                    },
                  }}
                >
                  <TableCell>{course.id}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.description}</TableCell>
                  <TableCell>{course.schedule}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(course)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Course Dialog */}
        <Dialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          PaperProps={{
            style: {
              borderRadius: "16px",
              overflow: "hidden",
              maxWidth: "500px",
            },
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(to right, #1F509A, #62B6F0)",
              padding: "16px",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#fff",
              }}
            >
              {currentCourse ? "Edit Course" : "Add Course"}
            </Typography>
          </Box>
          <DialogContent sx={{ padding: "24px", backgroundColor: "#F9FAFC" }}>
            <TextField
              margin="normal"
              fullWidth
              label="Course Name"
              variant="outlined"
              value={currentCourse?.name || ""}
              onChange={(e) =>
                setCurrentCourse((prev) => ({ ...prev, name: e.target.value }))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                },
                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#1F509A",
                  },
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Course Code"
              variant="outlined"
              value={currentCourse?.code || ""}
              onChange={(e) =>
                setCurrentCourse((prev) => ({ ...prev, code: e.target.value }))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                },
                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#1F509A",
                  },
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Description"
              variant="outlined"
              value={currentCourse?.description || ""}
              onChange={(e) =>
                setCurrentCourse((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                },
                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#1F509A",
                  },
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              type="date"
              label="Schedule"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              value={currentCourse?.schedule || ""}
              onChange={(e) =>
                setCurrentCourse((prev) => ({
                  ...prev,
                  schedule: e.target.value,
                }))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor: "#fff",
                },
                "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "#1F509A",
                  },
              }}
            />
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: "center",
              padding: "16px",
              backgroundColor: "#F9FAFC",
            }}
          >
            <Button
              onClick={handleCloseDialog}
              variant="outlined"
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "bold",
                color: "#1F509A",
                borderColor: "#1F509A",
                "&:hover": {
                  backgroundColor: "#E3F2FD",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCourse}
              variant="contained"
              disabled={
                !currentCourse?.name ||
                !currentCourse?.code ||
                !currentCourse?.description ||
                !currentCourse?.schedule
              }
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "bold",
                backgroundColor: "#1F509A",
                color: "#fff",
                marginLeft: "16px",
                "&:hover": {
                  backgroundColor: "#174079",
                },
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

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
    </Box>
  );
};

export default CourseList;
