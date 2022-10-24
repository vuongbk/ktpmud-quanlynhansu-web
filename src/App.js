import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Staffs from "./Pages/Staffs";
import "./App.css";
import EditStaffPage from "./Pages/EditStaffPage";
import EditProjectPage from "./Pages/EditProjectPage";

import { Layout, Col, Row, Space } from "antd";
import { Outlet, NavLink } from "react-router-dom";
import ProjectPage from "./Pages/ProjectPage";
import AssignmentPage from "./Pages/AssignmentPage";

const { Header, Footer, Content } = Layout;

const App = () => (
  <Layout>
    <Header
      style={{
        padding: "0 80px",
        backgroundColor: "#283b6e",
      }}
    >
      <Row>
        <Col span={21}>
          <Row>
            <Col span={5}>
              <NavLink to="/">Quản lý nhân sự</NavLink>
            </Col>
            <Col span={16}>
              <Space size={20}>
                <NavLink
                  style={({ isActive }) => {
                    return {
                      display: "block",
                      color: isActive ? "red" : "",
                    };
                  }}
                  to="/assignment"
                >
                  Phân công
                </NavLink>
                <NavLink
                  style={({ isActive }) => {
                    return {
                      display: "block",
                      color: isActive ? "red" : "",
                    };
                  }}
                  to="/staff"
                >
                  Nhân sự
                </NavLink>
                <NavLink
                  style={({ isActive }) => {
                    return {
                      display: "block",
                      color: isActive ? "red" : "",
                    };
                  }}
                  to="/project"
                >
                  Dự án
                </NavLink>
                <NavLink
                  style={({ isActive }) => {
                    return {
                      display: "block",
                      color: isActive ? "red" : "",
                    };
                  }}
                  to="/skill"
                >
                  Kỹ năng
                </NavLink>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={3}>
          <Row justify="end">
            <NavLink to="/">Đăng nhập</NavLink>
          </Row>
        </Col>
      </Row>
    </Header>
    <Content
      style={{
        padding: "50px 80px",
        minHeight: "640px",
      }}
    >
      <Routes>
        <Route index element={<Home />} />
        <Route path="/staff" element={<Staffs />} />
        <Route path="/project" element={<ProjectPage />} />
        <Route path="/assignment" element={<AssignmentPage />} />
        <Route path="/edit-staff" element={<EditStaffPage />} />
        <Route path="/edit-project" element={<EditProjectPage />} />
        <Route path="*" element={<p>There's nothing here!</p>} />
      </Routes>
      <Outlet />
    </Content>
    <Footer
      style={{
        paddingBottom: "40px 40px",
        textAlign: "center",
        backgroundColor: "#2d3f70",
        color: "white",
        height: "30px",
      }}
    >
      Ant Design ©2018 Created by Ant UED
    </Footer>
  </Layout>
);

export default App;
