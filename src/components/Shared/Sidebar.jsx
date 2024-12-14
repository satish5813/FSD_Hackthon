import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ClassIcon from "@mui/icons-material/Class";
import PeopleIcon from "@mui/icons-material/People";
import QuizIcon from "@mui/icons-material/Quiz";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Courses", icon: <ClassIcon />, path: "/admin/courses" },
    { text: "User Management", icon: <PeopleIcon />, path: "/admin/users" },
    {
      text: "User Mapping",
      icon: <PeopleIcon />,
      path: "/admin/users/mapping",
    },
    {
      text: "Schedule Exam",
      icon: <QuizIcon />,
      path: "/admin/exams/schedule",
    },
    { text: "Exam Results", icon: <QuizIcon />, path: "/admin/exams/results" },
    {
      text: "Question List",
      icon: <QuizIcon />,
      path: "/admin/questions/list",
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 280,
          boxSizing: "border-box",
          background: "linear-gradient(to bottom, #1e88e5, #62B6F0)",
          color: "#ffffff",
          paddingTop: "20px",
        },
      }}
    >
      {/* Top Header */}
      <Box
        sx={{
          height: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1565c0",
          color: "#ffffff",
          fontSize: "1.5rem",
          fontWeight: "bold",
          borderBottom: "2px solid #ffffff40",
          textTransform: "uppercase",
          marginTop: "25px",
        }}
      >
        Admin Panel
      </Box>
      {/* List of Menu Items */}
      <List sx={{ marginTop: 2 }}>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => navigate(item.path)}
            sx={{
              marginBottom: "10px",
              padding: "12px 20px",
              borderRadius: "12px",
              "&:hover": {
                backgroundColor: "#ffffff30",
                transform: "scale(1.02)",
                transition: "all 0.3s ease",
              },
              transition: "all 0.3s ease",
            }}
          >
            <ListItemIcon
              sx={{
                color: "#ffffff",
                minWidth: "40px",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontSize: "1rem",
                fontWeight: "500",
              }}
              sx={{
                color: "#ffffff",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
