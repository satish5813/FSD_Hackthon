import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  TextField,
  Typography,
  Button,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";

const SingleLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(
        "http://localhost:9000/api/users/username/admin"
      );

      const data = response.data;

      if (data.email === email && data.password === password) {
        if (data.roles.toLowerCase() === "admin") {
          sessionStorage.setItem("userRole", data.roles);
          sessionStorage.setItem("username", data.username);
          setError(null);
          navigate("/admin/dashboard", { replace: true });
        } else {
          throw new Error("You do not have admin privileges.");
        }
      } else {
        throw new Error("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError(err.message);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f6fc",
      }}
    >
      {/* Background Shadow Effect */}
      <Box
        sx={{
          position: "absolute",
          width: "480px",
          height: "450px",
          backgroundColor: "#1e88e5",
          borderRadius: "16px",
          transform: "translate(8px, 8px)",
          zIndex: 0,
        }}
      ></Box>

      {/* Login Card */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: 360,
          width: "100%",
          padding: "32px",
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#1e88e5",
            textAlign: "center",
            marginBottom: 2,
          }}
        >
          Sign in
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#757575", textAlign: "center", marginBottom: 3 }}
        >
          Sign in to access your account
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter Your Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              marginBottom: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter Your Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              marginBottom: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 3,
            }}
          ></Box>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#1e88e5",
              color: "#fff",
              fontWeight: "bold",
              textTransform: "none",
              padding: "10px",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Login
          </Button>
        </form>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SingleLogin;
