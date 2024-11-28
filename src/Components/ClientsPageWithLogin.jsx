import React, { useState } from "react";
import { Button, Input, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import ClientsPage from "./ClientsPage";

// Dummy admin credentials (for the login form)
const adminCredentials = {
  username: "admin", // Dummy admin username
  password: "admin123", // Dummy admin password
};

// Authentication check function for protected route
const isAuthenticated = () => {
  return localStorage.getItem("isAdmin") === "true"; // Check if the user is the admin
};

// Protected Clients Page with login form
const ClientsPageWithLogin = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Handle the login form submission
  const handleLogin = (values) => {
    const { username, password } = values;

    if (
      username === adminCredentials.username &&
      password === adminCredentials.password
    ) {
      localStorage.setItem("isAdmin", true); // Set the user as admin in localStorage
      navigate("/clients"); // Redirect to clients page
    } else {
      setErrorMessage("Incorrect username or password!");
    }
  };

  return isAuthenticated() ? (
    <ClientsPage /> // Render ClientsPage if logged in as admin
  ) : (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h2 style={styles.heading}>Only KPM Can Access</h2>
        <Form name="adminLogin" onFinish={handleLogin} style={styles.form}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          {errorMessage && <div style={styles.error}>{errorMessage}</div>}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

// Styles for centering the login form
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Full viewport height
    backgroundColor: "#f0f2f5", // Light background color
  },
  loginBox: {
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: "400px",
  },
  heading: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#1890ff", // KPM Blue color
  },
  form: {
    maxWidth: "100%",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};

export default ClientsPageWithLogin;
