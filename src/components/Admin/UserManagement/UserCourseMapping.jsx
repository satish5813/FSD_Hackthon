import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  TablePagination,
  Card,
  CardContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

const UserCourseMapping = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [userCourseMappings, setUserCourseMappings] = useState([]);
  const [editMappingId, setEditMappingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMappings, setFilteredMappings] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchCourses();
    fetchMappings();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/user-roles");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchMappings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/user-course-mappings"
      );
      setUserCourseMappings(response.data);
      setFilteredMappings(response.data);
    } catch (error) {
      console.error("Error fetching mappings:", error);
    }
  };

  const handleAddMapping = async () => {
    try {
      const newMapping = { userId: user, courseId: selectedCourse };
      await axios.post(
        "http://localhost:9000/api/user-course-mappings",
        newMapping
      );

      setSnackbarMessage("Mapping added successfully!");
      setSnackbarOpen(true);
      setUser("");
      setSelectedCourse("");
      fetchMappings();
    } catch (error) {
      console.error("Error adding mapping:", error);
    }
  };

  const handleEditMapping = (mapping) => {
    setEditMappingId(mapping.id);
    setUser(mapping.userId);
    setSelectedCourse(mapping.courseId);
  };

  const handleSaveEditMapping = async () => {
    try {
      const updatedMapping = { userId: user, courseId: selectedCourse };
      await axios.put(
        `http://localhost:9000/api/user-course-mappings/${editMappingId}`,
        updatedMapping
      );

      setSnackbarMessage("Mapping updated successfully!");
      setSnackbarOpen(true);
      setEditMappingId(null);
      setUser("");
      setSelectedCourse("");
      fetchMappings();
    } catch (error) {
      console.error("Error updating mapping:", error);
    }
  };

  const handleDeleteMapping = async (mappingId) => {
    try {
      await axios.delete(
        `http://localhost:9000/api/user-course-mappings/${mappingId}`
      );
      setSnackbarMessage("Mapping deleted successfully!");
      setSnackbarOpen(true);
      fetchMappings();
    } catch (error) {
      console.error("Error deleting mapping:", error);
    }
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filtered = userCourseMappings.filter(
      (mapping) =>
        users
          .find((u) => u.id === mapping.userId)
          ?.name.toLowerCase()
          .includes(query) ||
        courses
          .find((c) => c.id === mapping.courseId)
          ?.name.toLowerCase()
          .includes(query)
    );
    setFilteredMappings(filtered);
    setPage(0);
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px",
        backgroundColor: "#F4F6F8",
        minHeight: "100vh",
        marginTop: "30px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        {/* Form Section */}
        <Card
          sx={{
            flex: 1,
            borderRadius: "12px",
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              {editMappingId ? "Edit Mapping" : "Add Mapping"}
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select User</InputLabel>
              <Select
                value={user}
                onChange={(e) => setUser(e.target.value)}
                input={<OutlinedInput label="Select User" />}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Course</InputLabel>
              <Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                input={<OutlinedInput label="Select Course" />}
              >
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={editMappingId ? handleSaveEditMapping : handleAddMapping}
              disabled={!user || !selectedCourse}
              sx={{
                backgroundColor: "#1F509A",
                "&:hover": { backgroundColor: "#174079" },
              }}
            >
              {editMappingId ? "Save Changes" : "Add Mapping"}
            </Button>
          </CardContent>
        </Card>

        {/* Table Section */}
        <Card
          sx={{
            flex: 3,
            borderRadius: "12px",
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <TextField
                label="Search by Username or Course Name"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <IconButton
                onClick={handleSearch}
                sx={{
                  backgroundColor: "#1F509A",
                  color: "#ffffff",
                  marginLeft: "8px",
                  "&:hover": { backgroundColor: "#174079" },
                }}
              >
                <SearchIcon />
              </IconButton>
            </Box>
            <TableContainer
              component={Paper}
              sx={{
                borderRadius: "8px",
                maxHeight: "400px", // Makes table scrollable if needed
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {[
                      "User ID",
                      "Username",
                      "Course ID",
                      "Course Name",
                      "Actions",
                    ].map((header) => (
                      <TableCell
                        key={header}
                        sx={{
                          backgroundColor: "#1F509A",
                          color: "#ffffff",
                          fontWeight: "bold",
                        }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMappings
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((mapping) => (
                      <TableRow key={mapping.id}>
                        <TableCell>{mapping.userId}</TableCell>
                        <TableCell>
                          {users.find((u) => u.id === mapping.userId)?.name ||
                            "Unknown"}
                        </TableCell>
                        <TableCell>{mapping.courseId}</TableCell>
                        <TableCell>
                          {courses.find((c) => c.id === mapping.courseId)
                            ?.name || "Unknown"}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleEditMapping(mapping)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteMapping(mapping.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredMappings.length}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </CardContent>
        </Card>
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

export default UserCourseMapping;
