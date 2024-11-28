import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Button, Input, Form, message } from "antd";
import Home from "./Components/Home";
import Navbar from "./Components/Navbar";
import Admin from "./Components/Routes/Admin";
import RegisterPage from "./Components/Routes/Admin";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import LeadsUpload from "./Components/LeadsUpload";
import ClientsPage from "./Components/ClientsPage";
import ClientsPageWithLogin from "./Components/ClientsPageWithLogin";

// Dummy admin credentials (for the login form)
const adminCredentials = {
  username: "admin", // Dummy admin username
  password: "admin123", // Dummy admin password
};

// Authentication check function for protected route
const isAuthenticated = () => {
  return localStorage.getItem("isAdmin") === "true"; // Check if the user is the admin
};

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/admin"
          element={<RegisterPage title={"Register New User"} />}
        />
        {/* Clients route now includes login form */}
        <Route path="/clients" element={<ClientsPageWithLogin />} />
        <Route
          path="/admin/login"
          element={<Login title={"Login to KPM CLIENTS"} />}
        />
        <Route
          path="/login"
          element={<Login title={"Login to Your Account"} />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard title={"Welcome To Dashboard Page"} />}
        />
        <Route path="/Leads" element={<LeadsUpload />} />
        <Route path="/" element={<Home title={"Welcome"} />} />
      </Routes>
    </div>
  );
}

export default App;
