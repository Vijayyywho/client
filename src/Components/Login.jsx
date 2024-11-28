import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Card,
  Row,
  Col,
  notification,
} from "antd";

import moon from "../assets/moon.svg";
import blu from "../assets/blu.jpg";
import grad from "../assets/blue.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi"; // Add icons for email and password

const Login = ({ title }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("client", JSON.stringify(data));
        const client = JSON.parse(localStorage.getItem("client"));
        notification.success({
          message: `Welcome back, ${client.name}!`,
          description: "You have successfully logged in.",
          placement: "topRight",
          duration: 3,
          style: {
            backgroundColor: "#fff", // Green background
            color: "#000", // White text
            borderRadius: "18px",
            border: "#green",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          },
        });

        if (location.pathname === "/admin/login") {
          navigate("/leads");
        } else {
          navigate("/dashboard");
        }
      } else {
        message.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row
      align="middle"
      justify="center"
      style={{
        height: "100vh",
        background: "#fff",
        backgroundImage: `url(${grad})`, // Use the imported image as background
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Col xs={24} sm={12} md={8}>
        <Card
          bordered={false}
          style={{
            borderRadius: "12px",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.5)",
            padding: "30px",
            backgroundColor: "#fff",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "600",
              color: "#333",
              marginBottom: "20px",
            }}
          >
            {title}
          </h2>
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            autoComplete="off"
            style={{ marginTop: "30px" }}
          >
            {/* Email Field */}
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<FiMail />}
                placeholder="Enter your email"
                style={{
                  borderRadius: "10px",
                  padding: "10px",
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long!",
                },
              ]}
            >
              <Input.Password
                prefix={<FiLock />}
                placeholder="Enter your password"
                style={{
                  borderRadius: "10px",
                  padding: "10px",
                  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{
                  borderRadius: "10px",
                  background: "linear-gradient(90deg, #4caf50, #2b8e2d)",
                  color: "#fff",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
