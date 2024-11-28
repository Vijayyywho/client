import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu, Button, Drawer } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  InfoCircleOutlined,
  MenuOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;

const App = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const hideDrawer = () => {
    setDrawerVisible(false);
  };

  return (
    <Layout>
      {/* Header */}
      <Header
        style={{
          position: "fixed",
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}

        <Link to="/">
          <div
            className="logo"
            style={{
              color: "white",
              fontSize: "20px",
              fontWeight: "bold",
              flex: 1,
            }}
          >
            KPM
          </div>
        </Link>

        {/* Hamburger Button */}
        <Button
          icon={<MenuOutlined />}
          type="text"
          style={{
            color: "white",
          }}
          onClick={showDrawer}
        />
      </Header>

      {/* Drawer */}
      <Drawer
        title="Menu"
        placement="left"
        closable
        onClose={hideDrawer}
        open={drawerVisible}
      >
        <Menu mode="vertical" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            Home
          </Menu.Item>
          <Menu.Item key="2" icon={<AppstoreOutlined />}>
            Features
          </Menu.Item>
          <Menu.Item key="3" icon={<InfoCircleOutlined />}>
            About
          </Menu.Item>
          <Button type="primary">Login</Button>
        </Menu>
      </Drawer>

      {/* Content */}
    </Layout>
  );
};

export default App;
