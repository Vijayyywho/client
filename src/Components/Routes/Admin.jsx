import React, { useState } from "react";
import { Form, Input, Button, message, Typography } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  GoogleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supbaseClient";

const { Title } = Typography;

const RegisterPage = ({ title }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    console.log("Received values:", values);

    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    const payload = {
      name: values.name,
      email: values.email,
      contactNo: values.phone,
      password: values.password,
      clickupSrc: values.clickupSrc, // Include the clickupSrc field if provided
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/clients",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Client created successfully:", response.data);
      message.success("Client registered successfully!");
      navigate("/"); // Redirect after successful registration
    } catch (error) {
      console.error("Error creating client:", error);
      message.error("Failed to register client. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google Login Handler
  const handleGoogleLogin = async () => {
    try {
      const { user, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        message.error("Failed to sign in with Google. Please try again.");
        console.error("Google login error:", error);
        return;
      }

      if (user) {
        const googleUserData = {
          name: user.user_metadata.full_name || user.user_metadata.first_name,
          email: user.email,
          contactNo: "", // You can add a phone number field to the form if needed
          provider: user.app_metadata.providers[0], // This will be 'google'
        };

        console.log("Google User Data:", googleUserData);

        const response = await axios.post(
          "http://localhost:3000/api/clients",
          googleUserData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(
          "Client registered successfully with Google:",
          response.data
        );
        message.success("Successfully signed in with Google!");
        navigate("/"); // Redirect after successful login
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      message.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-md w-full flex-col mt-[8rem] p-6 bg-white shadow-lg rounded-lg mx-auto">
      <Title level={2} className="text-center mb-8">
        {title}
      </Title>
      <Form
        name="register"
        onFinish={onFinish}
        initialValues={{ remember: true }}
        layout="vertical"
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: "Please input your full name!" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Full Name"
            className="input-field"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please input a valid email!" },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Email"
            className="input-field"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Contact No"
          rules={[
            { required: true, message: "Please input your contact number!" },
          ]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="Contact Number"
            className="input-field"
          />
        </Form.Item>

        <Form.Item name="clickupSrc" label="ClickUp URL (Optional)">
          <Input
            placeholder="Enter ClickUp URL (Optional)"
            className="input-field"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters!" },
          ]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            className="input-field"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password
            placeholder="Confirm Password"
            className="input-field"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;
