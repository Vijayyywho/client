import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Row, Col, Card } from "antd";

const { TextArea } = Input;

const LeadsUpload = () => {
  const [name, setName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [preferredTiming, setPreferredTiming] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [bulkLeads, setBulkLeads] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    const client = JSON.parse(localStorage.getItem("client"));
    if (client && client.name) {
      setClientName(client.name);
    } else {
      message.error("Client information is missing in local storage.");
    }
  }, []);

  const handleSubmit = async () => {
    const client = JSON.parse(localStorage.getItem("client"));
    const userId = client ? client.id : null;

    if (!userId) {
      message.error("User ID is required!");
      return;
    }

    if (
      !name ||
      !contactNo ||
      !email ||
      !city ||
      !budget ||
      !lookingFor ||
      !preferredTiming ||
      !preferredLocation
    ) {
      message.error("All fields are required for single lead upload!");
      return;
    }

    const leadData = {
      name,
      contactNo,
      email,
      city,
      budget,
      lookingFor,
      preferredTiming,
      preferredLocation,
      userId,
    };

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      });
      const data = await response.json();

      if (data.message === "Lead created successfully") {
        message.success("Lead uploaded successfully!");
        setName("");
        setContactNo("");
        setEmail("");
        setCity("");
        setBudget("");
        setLookingFor("");
        setPreferredTiming("");
        setPreferredLocation("");
      } else {
        message.error(data.message || "Failed to upload lead!");
      }
    } catch (error) {
      console.error("Error uploading lead:", error);
      message.error("Error uploading lead.");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async () => {
    const client = JSON.parse(localStorage.getItem("client"));
    const userId = client ? client.id : null;

    if (!userId) {
      message.error("User ID is required!");
      return;
    }

    const bulkLeadData = bulkLeads.split("\n").map((lead) => {
      const [
        leadName,
        leadContact,
        leadEmail,
        leadCity,
        leadBudget,
        leadLookingFor,
        leadTiming,
        leadLocation,
      ] = lead.split(",");
      return {
        name: leadName?.trim(),
        contactNo: leadContact?.trim(),
        email: leadEmail?.trim(),
        city: leadCity?.trim(),
        budget: leadBudget?.trim(),
        lookingFor: leadLookingFor?.trim(),
        preferredTiming: leadTiming?.trim(),
        preferredLocation: leadLocation?.trim(),
        userId,
      };
    });

    const invalidLeads = bulkLeadData.filter(
      (lead) =>
        !lead.name ||
        !lead.contactNo ||
        !lead.email ||
        !lead.city ||
        !lead.budget ||
        !lead.lookingFor ||
        !lead.preferredTiming ||
        !lead.preferredLocation
    );
    if (invalidLeads.length > 0) {
      message.error(
        "Each line must have 'Name, Contact No, Email, City, Budget, Looking For, Preferred Timing, Preferred Location' format."
      );
      return;
    }

    try {
      setLoading(true);
      for (const lead of bulkLeadData) {
        const response = await fetch("http://localhost:3000/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lead),
        });
        const data = await response.json();

        if (data.message !== "Lead created successfully") {
          message.error(`Failed to upload lead: ${lead.name}`);
          break;
        }
      }

      message.success("Bulk leads uploaded successfully!");
      setBulkLeads("");
    } catch (error) {
      console.error("Error uploading bulk leads:", error);
      message.error("Error uploading bulk leads.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row
      align="middle"
      justify="center"
      style={{
        backgroundColor: "#f0f2f5",
        paddingTop: "100px",
      }}
    >
      <Col xs={24} sm={20} md={16} lg={12} xl={15}>
        <Card style={{ padding: 20 }}>
          <h1
            style={{
              textAlign: "center",
              fontFamily: "monospace",
              marginBottom: 20,
              fontSize: "2.2rem",
            }}
          >
            {clientName ? `Leads Upload for ${clientName}` : "Leads Upload"}
          </h1>
          <Form
            name="leads-upload"
            layout="vertical"
            autoComplete="off"
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Name"
                  rules={[{ required: true, message: "Name is required!" }]}
                >
                  <Input
                    placeholder="Enter lead name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Contact No"
                  rules={[
                    { required: true, message: "Contact No is required!" },
                  ]}
                >
                  <Input
                    placeholder="Enter contact number"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Email"
                  rules={[
                    { required: true, message: "Email is required!" },
                    { type: "email", message: "Enter a valid email!" },
                  ]}
                >
                  <Input
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="City"
                  rules={[{ required: true, message: "City is required!" }]}
                >
                  <Input
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Budget"
                  rules={[{ required: true, message: "Budget is required!" }]}
                >
                  <Input
                    placeholder="Enter budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Looking For"
                  rules={[
                    { required: true, message: "Looking For is required!" },
                  ]}
                >
                  <Input
                    placeholder="Enter what lead is looking for"
                    value={lookingFor}
                    onChange={(e) => setLookingFor(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Preferred Timing"
                  rules={[
                    {
                      required: true,
                      message: "Preferred timing is required!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter preferred timing"
                    value={preferredTiming}
                    onChange={(e) => setPreferredTiming(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Preferred Location"
                  rules={[
                    {
                      required: true,
                      message: "Preferred location is required!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter preferred location"
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%", marginBottom: 20 }}
            >
              Submit Single Lead
            </Button>
          </Form>

          <h3 style={{ textAlign: "center", margin: "20px 0" }}>Bulk Upload</h3>
          <TextArea
            rows={6}
            value={bulkLeads}
            onChange={(e) => setBulkLeads(e.target.value)}
            placeholder="Enter bulk leads in 'Name, Contact, Email, City, Budget, Looking For, Timing, Location' format (one per line)"
          />
          <Button
            type="primary"
            onClick={handleBulkSubmit}
            loading={loading}
            style={{ width: "100%", marginTop: 20 }}
          >
            Submit Bulk Leads
          </Button>
        </Card>
      </Col>
    </Row>
  );
};

export default LeadsUpload;
