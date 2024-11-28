import React, { useState, useEffect } from "react";
import { Table, Select, Input, Button, message, Badge } from "antd";
import { createClient } from "@supabase/supabase-js";

const { Option } = Select;

// Initialize Supabase client
const supabase = createClient(
  "https://rvgbnuedurcnwzodpdci.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2Z2JudWVkdXJjbnd6b2RwZGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyNTg0MTEsImV4cCI6MjA0NzgzNDQxMX0.BBy7eipkQdAHNcZttlglerWdW1yrTwwgKBc52Eym-7w"
);

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newLeads, setNewLeads] = useState([]);
  const [dismissedLeads, setDismissedLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch leads from Supabase
  const refreshLeads = async () => {
    const client = JSON.parse(localStorage.getItem("client"));
    const userId = client?.id;

    if (!userId) {
      message.error("No client selected.");
      return;
    }

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching leads:", error);
      message.error("Failed to fetch leads.");
    } else {
      const formattedLeads = data
        .map((lead, index) => ({
          key: index + 1,
          id: lead.id,
          name: lead.name,
          number: lead.contact_no,
          email: lead.email,
          city: lead.city,
          budget: lead.budget,
          lookingfor: lead.lookingFor,
          preferedlocation: lead.preferedLocation,
          preferedtiming: lead.preferedTiming,
          status: lead.status || "Followup",
          remark: lead.remark || "",
          createdAt: new Date(lead.createdAt),
        }))
        .sort((a, b) => b.createdAt - a.createdAt);

      setLeads(formattedLeads);
      setFilteredLeads(formattedLeads);

      const now = new Date();
      const freshLeads = formattedLeads.filter(
        (lead) => (now - lead.createdAt) / (1000 * 60) <= 10
      );
      setNewLeads(freshLeads.map((lead) => lead.id));
    }
  };

  useEffect(() => {
    refreshLeads();
  }, []);

  const handleStatusChange = async (value, key) => {
    const updatedLeads = leads.map((lead) =>
      lead.key === key ? { ...lead, status: value } : lead
    );
    setLeads(updatedLeads);
    setFilteredLeads(updatedLeads);

    const leadToUpdate = updatedLeads.find((lead) => lead.key === key);
    if (leadToUpdate) {
      const { error } = await supabase
        .from("leads")
        .update({ status: value })
        .eq("id", leadToUpdate.id);

      if (error) {
        message.error("Failed to update status in Supabase.");
      } else {
        message.success("Status updated successfully.");
      }
    }
  };

  const handleRemarkChange = async (e, key) => {
    const updatedLeads = leads.map((lead) =>
      lead.key === key ? { ...lead, remark: e.target.value } : lead
    );
    setLeads(updatedLeads);
    setFilteredLeads(updatedLeads);

    const leadToUpdate = updatedLeads.find((lead) => lead.key === key);
    if (leadToUpdate) {
      const { error } = await supabase
        .from("leads")
        .update({ remark: e.target.value })
        .eq("id", leadToUpdate.id);

      if (error) {
        message.error("Failed to update remark in Supabase.");
      } else {
        message.success("Remark updated successfully.");
      }
    }
  };

  const handleBadgeDismiss = (record) => {
    setDismissedLeads((prev) => [...prev, record.id]);
    setNewLeads((prev) => prev.filter((id) => id !== record.id));
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = leads.filter((lead) =>
      lead.name.toLowerCase().includes(value)
    );
    setFilteredLeads(filtered);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      responsive: ["xs", "sm", "md"],
      render: (text, record) => (
        <span
          onClick={() => handleBadgeDismiss(record)}
          style={{ cursor: "pointer" }}
        >
          {!dismissedLeads.includes(record.id) &&
            newLeads.includes(record.id) && (
              <Badge
                count="New"
                style={{ backgroundColor: "#52c41a", marginRight: 8 }}
              />
            )}
          {text}
        </span>
      ),
    },
    {
      title: "Number",
      dataIndex: "number",
      key: "number",
      responsive: ["sm", "md"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["md", "lg"],
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Budget ₹",
      dataIndex: "budget",
      key: "budget",
    },
    {
      title: "Looking For",
      dataIndex: "lookingfor",
      key: "lookingfor",
      responsive: ["lg"],
    },
    {
      title: "Prefered Location",
      dataIndex: "preferedlocation",
      key: "preferedlocation",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Select
          defaultValue={text}
          style={{ width: "100%" }}
          onChange={(value) => handleStatusChange(value, record.key)}
        >
          <Option value="Followup">Followup</Option>
          <Option value="Ringing">Ringing</Option>
          <Option value="Not Interested">Not Interested</Option>
        </Select>
      ),
    },
    {
      title: "Remark",
      dataIndex: "remark",
      key: "remark",
      render: (text, record) => (
        <Input
          value={text}
          onChange={(e) => handleRemarkChange(e, record.key)}
          placeholder="Enter remark"
        />
      ),
    },
  ];

  return (
    <div style={{ padding: "10px 20px" }}>
      <h2
        style={{
          fontWeight: "bold",
          fontFamily: "monospace",
          padding: "10px",
          fontSize: "24px",
        }}
      >
        Leads Table
      </h2>
      <Button
        onClick={refreshLeads}
        style={{
          marginBottom: 20,
          backgroundColor: "#4CAF50",
          color: "white",
          margin: "10px",
          padding: "8px 16px",
          fontSize: "14px",
        }}
      >
        Refresh Leads
      </Button>
      <Input
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          marginBottom: 20,
          width: "100%",
          maxWidth: "400px",
        }}
      />
      <div style={{ overflowX: "auto" }}>
        <Table
          columns={columns}
          dataSource={filteredLeads}
          pagination={{
            current: currentPage,
            pageSize,
            total: filteredLeads.length,
            onChange: handleTableChange,
          }}
          scroll={{ x: 1200 }}
        />
      </div>
    </div>
  );
};

export default LeadsPage;
