import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import QuizIcon from "@mui/icons-material/Quiz";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#1e88e5",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Section with Title */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <QuizIcon sx={{ marginRight: 1, fontSize: 30, color: "#ffffff" }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#ffffff",
              letterSpacing: "0.5px",
            }}
          >
            Online Exam Portal
          </Typography>
        </Box>

        {/* Right Section with Logout Button */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="outlined"
            onClick={handleLogout}
            sx={{
              color: "#ffffff",
              borderColor: "#ffffff",
              textTransform: "none",
              fontWeight: "bold",
              marginRight: 2,
              "&:hover": {
                backgroundColor: "#1565c0",
                borderColor: "#1565c0",
              },
            }}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
