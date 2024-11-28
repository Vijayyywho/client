import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Avatar,
  Col,
  Row,
  Typography,
  Button,
  Descriptions,
  Modal,
} from "antd";
import { UserOutlined, EditOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js"; // Supabase client
import LeadsPage from "./Leads";

const { Content } = Layout;
const { Title, Text } = Typography;

// Supabase setup
const supabase = createClient(
  "https://rvgbnuedurcnwzodpdci.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2Z2JudWVkdXJjbnd6b2RwZGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyNTg0MTEsImV4cCI6MjA0NzgzNDQxMX0.BBy7eipkQdAHNcZttlglerWdW1yrTwwgKBc52Eym-7w"
);

const Dashboard = () => {
  const [avatar, setAvatar] = useState(null);
  const [client, setClient] = useState(null);
  const [clickupSrc, setClickupSrc] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  // Load client data and fetch avatar & ClickUp source
  useEffect(() => {
    const fetchClientData = async () => {
      const storedClient = localStorage.getItem("client");
      if (storedClient) {
        const clientData = JSON.parse(storedClient);
        setClient(clientData);

        // Fetch avatar and ClickUp source from Supabase
        try {
          const { data, error } = await supabase
            .from("clients")
            .select("photoUrl, clickupSrc")
            .eq("id", clientData.id)
            .single();

          if (error) throw error;
          setAvatar(data.photoUrl || null); // Set avatar or default
          setClickupSrc(data.clickupSrc || null); // Set ClickUp iframe source
        } catch (err) {
          console.error("Error fetching client data:", err.message);
          setAvatar(null);
          setClickupSrc(null);
        }
      }
    };

    fetchClientData();
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("client");
    navigate("/login");
  };

  // Show modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle modal actions
  const handleConfirm = () => {
    setIsModalVisible(false);
    handleLogout();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Avatar upload handler
  const handleAvatarUpload = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "kpmdash",
        uploadPreset: "kpmclients",
        multiple: false,
        maxImageFileSize: 2000000,
        folder: "avatars",
      },
      async (error, result) => {
        if (!error && result && result.event === "success") {
          const uploadedUrl = result.info.secure_url;
          setAvatar(uploadedUrl); // Update local state

          try {
            // Update Supabase with the new avatar URL
            const { error: updateError } = await supabase
              .from("clients")
              .update({ photoUrl: uploadedUrl })
              .eq("id", client.id);

            if (updateError) throw updateError;

            console.log("Avatar updated successfully in Supabase.");
          } catch (err) {
            console.error("Error updating avatar in Supabase:", err.message);
          }
        }
      }
    );
    widget.open(); // Open the Cloudinary upload widget
  };

  if (!client) {
    return <div>Error: Unable to load client data.</div>;
  }

  return (
    <Layout>
      <Content
        style={{
          marginTop: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "80px",
          overflow: "hidden",
          paddingBottom: "25px",
        }}
      >
        <div className="site-layout-content" style={{ width: "100%" }}>
          <Row justify="center" gutter={24}>
            {/* Client Profile Card */}
            <Col xs={24} sm={8} md={6} lg={6}>
              <Card
                style={{
                  width: "100%",
                  textAlign: "center",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                }}
                cover={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      paddingTop: "15px",
                    }}
                  >
                    <Avatar
                      size={128}
                      src={avatar}
                      icon={<UserOutlined />}
                      shape="circle"
                    />
                  </div>
                }
                actions={[
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleAvatarUpload}
                  >
                    Upload Avatar
                  </Button>,
                  <Button
                    type="default"
                    danger
                    icon={<LogoutOutlined />}
                    onClick={showModal}
                  >
                    Logout
                  </Button>,
                ]}
              >
                <Title className="font-mono" level={3}>
                  {client.name}
                </Title>
                <Text strong>{client.username}</Text>
              </Card>
            </Col>

            {/* Client Details Section */}
            <Col xs={24} sm={16} md={12} lg={12}>
              <Card
                title="Client Details"
                style={{
                  width: "100%",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                  padding: "12px",
                }}
              >
                <Descriptions className="font-mono" bordered>
                  <Descriptions.Item label="Name" span={3}>
                    {client.name || "Not provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email" span={3}>
                    {client.email || "Not provided"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone" span={3}>
                    {client.contactNo || "Not provided"}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          </Row>

          {/* Embed ClickUp Tasks via iframe */}
          <Row justify="center" gutter={24} style={{ marginTop: "24px" }}>
            <Col span={24}>
              <Card title="ClickUp Tasks" style={{ width: "100%" }}>
                {clickupSrc ? (
                  <iframe
                    src={clickupSrc}
                    width="100%"
                    height="600px"
                    style={{
                      border: "none",
                      borderRadius: "8px",
                    }}
                    title="ClickUp Tasks"
                  ></iframe>
                ) : (
                  <p>Loading ClickUp tasks...</p>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <LeadsPage />

      {/* Logout Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        visible={isModalVisible}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="confirm" type="primary" danger onClick={handleConfirm}>
            Yes, Logout
          </Button>,
        ]}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </Layout>
  );
};

export default Dashboard;
