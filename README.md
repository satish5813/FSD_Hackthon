# React + Vite+Next.JS

# Art Gallery Management System

This project is an **Art Gallery Management System** that provides CRUD operations for managing users, artworks, categories, and orders. The frontend is built with **React**, **Vite**, and **Next.js**, and it interacts with a Spring Boot backend.

---

## 📑 Features

### Users Dashboard
- Manage user data (Name, Email, Role, Status).
- Roles: Admin, Artist, Visitor.
- Status: Active/Inactive.

### Artworks Dashboard
- Manage artwork details (Title, Description, Artist, Category, Price, Image, Status).
- Status: Available/Sold.
- Upload images for artworks.

### Categories Dashboard
- Manage categories for artworks (Name, Description, Status).
- Status: Active/Inactive.

### Orders Dashboard
- Manage orders (Order ID, Customer Name, Artwork, Amount, Order Date, Status).
- Status: Completed/Pending/Cancelled.

---

## 🚀 Tech Stack

### Frontend
- **React.js**
- **Vite** - For fast build and development.
- **Next.js** - For server-side rendering and routing.
- **CSS Modules**/**TailwindCSS** for styling (optional).

### Backend
- **Spring Boot** - REST APIs for CRUD operations.
- **MySQL** - Database for storing data.

---

## 🔧 Prerequisites

### Install Dependencies
- **Node.js** (version >= 16.x)
- **npm** or **yarn**
- **MySQL Database**

### Backend Setup
Follow the Spring Boot setup in the backend folder for API development.

---

## 🛠️ Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/art-gallery-management.git
cd art-gallery-management
