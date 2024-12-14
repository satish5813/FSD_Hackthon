import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditMode, setEditMode] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchRolesAndPermissions();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/user-roles");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchRolesAndPermissions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:9000/api/user-roles/menus"
      );
      setAvailablePermissions(response.data);
      setAvailableRoles(["Admin", "Editor", "Viewer"]);
    } catch (error) {
      console.error("Error fetching roles and permissions:", error);
    }
  };

  const handleOpenDialog = (user = null) => {
    setCurrentUser(
      user || {
        name: "",
        email: "",
        role: "",
        permissions: [],
      }
    );
    setEditMode(Boolean(user));
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setCurrentUser(null);
    setDialogOpen(false);
    setEditMode(false);
  };

  const handleSaveUser = async () => {
    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:9000/api/user-roles/${currentUser.id}`,
          currentUser
        );
        setSnackbarMessage("User updated successfully!");
      } else {
        const response = await axios.post(
          "http://localhost:9000/api/user-roles",
          currentUser
        );
        setUsers([...users, response.data]);
        setSnackbarMessage("User added successfully!");
      }
      fetchUsers();
      setSnackbarOpen(true);
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:9000/api/user-roles/${id}`);
      setSnackbarMessage("User deleted successfully!");
      setSnackbarOpen(true);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const togglePermission = (permission) => {
    setCurrentUser((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  return (
    <Box
      sx={{
        padding: "18px",
        backgroundColor: "#F4F6F8",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        marginTop: "45px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1000px",
          height: "550px",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            background: "linear-gradient(to right, #1F509A, #62B6F0)",
            color: "#ffffff",
            padding: "16px",
            textAlign: "center",
            borderRadius: "16px 16px 0 0",
            fontWeight: "bold",
          }}
        >
          User Management
        </Typography>
        <Box
          sx={{
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#1F509A",
              "&:hover": { backgroundColor: "#174079" },
            }}
            onClick={() => handleOpenDialog()}
          >
            Add User
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          sx={{ margin: "12px", borderRadius: "16px" }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: "linear-gradient(to right, #1F509A, #62B6F0)",
                }}
              >
                {["Name", "Email", "Role", "Permissions", "Actions"].map(
                  (header) => (
                    <TableCell
                      key={header}
                      sx={{
                        color: "#ffffff",
                        fontWeight: "bold",
                        border: "1px solid #ccc",
                      }}
                    >
                      {header}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{
                    "&:hover": { backgroundColor: "#F7FAFC" },
                  }}
                >
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.permissions.join(", ")}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      sx={{
                        marginRight: "8px",
                        borderRadius: "8px",
                      }}
                      onClick={() => handleOpenDialog(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      sx={{ borderRadius: "8px" }}
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={isDialogOpen}
          onClose={handleCloseDialog}
          PaperProps={{
            style: {
              borderRadius: "16px",
              overflow: "hidden",
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
              {isEditMode ? "Edit User" : "Add User"}
            </Typography>
          </Box>
          <DialogContent sx={{ padding: "24px", backgroundColor: "#F9FAFC" }}>
            <TextField
              label="Name"
              fullWidth
              sx={{ mb: 2 }}
              value={currentUser?.name || ""}
              onChange={(e) =>
                setCurrentUser((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <TextField
              label="Email"
              fullWidth
              sx={{ mb: 2 }}
              value={currentUser?.email || ""}
              onChange={(e) =>
                setCurrentUser((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={currentUser?.role || ""}
                onChange={(e) =>
                  setCurrentUser((prev) => ({ ...prev, role: e.target.value }))
                }
              >
                {availableRoles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Permissions:
            </Typography>
            {availablePermissions.map((permission) => (
              <Box
                key={permission}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Checkbox
                  checked={currentUser?.permissions.includes(permission)}
                  onChange={() => togglePermission(permission)}
                />
                <Typography>{permission}</Typography>
              </Box>
            ))}
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
                color: "#1F509A",
                borderColor: "#1F509A",
                "&:hover": { backgroundColor: "#E3F2FD" },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1F509A",
                "&:hover": { backgroundColor: "#174079" },
                borderRadius: "8px",
              }}
              onClick={handleSaveUser}
              disabled={
                !currentUser?.name || !currentUser?.email || !currentUser?.role
              }
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

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

export default UserList;
