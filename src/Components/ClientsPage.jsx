import React, { useState, useEffect } from "react";
import { List, Button, message, Typography, Card } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/api/clients")
      .then((response) => response.json())
      .then((data) => {
        const transformedClients = (data || []).map((client) => ({
          id: client.id,
          name: client.name || "Unknown Name",
          email: client.email || "No Email",
          contact_no: client.contactNo || "No Contact",
        }));
        setClients(transformedClients);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
        message.error("Failed to fetch clients.");
        setLoading(false);
      });
  }, []);

  const handleAddLeads = (client) => {
    localStorage.setItem("client", JSON.stringify(client));
    navigate("/leads");
  };

  return (
    <div style={{ padding: "100px 40px" }}>
      <Card style={{ marginBottom: "20px", borderRadius: "10px" }}>
        <Title level={2} style={{ fontFamily: "monospace", margin: 0 }}>
          Leads Upload for KPM
        </Title>
      </Card>

      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={clients}
        renderItem={(client) => (
          <List.Item
            style={{
              borderBottom: "1px solid #f0f0f0",
              padding: "15px 0",
            }}
            actions={[
              <Button
                type="primary"
                size="small"
                onClick={() => handleAddLeads(client)}
              >
                Add Leads
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={
                <Typography.Text strong style={{ fontSize: "16px" }}>
                  {client.name}
                </Typography.Text>
              }
              description={
                <Typography.Text type="secondary">
                  Email: {client.email} | Contact: {client.contact_no}
                </Typography.Text>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ClientsPage;
