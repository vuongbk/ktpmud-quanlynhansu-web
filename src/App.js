import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Pages/Home";
import Staffs from "./Pages/Staffs";
import "./App.css";
import EditStaffPage from "./Pages/EditStaffPage";
import EditProjectPage from "./Pages/EditProjectPage";
import {
  Layout,
  Col,
  Row,
  Space,
  Dropdown,
  Typography,
  Button,
  Avatar,
  Popover,
} from "antd";
import { Outlet, NavLink } from "react-router-dom";
import ProjectPage from "./Pages/ProjectPage";
import AssignmentPage from "./Pages/AssignmentPage";
import DetailAssignment from "./Pages/DetailAssignment";
import EditAssignment from "./Pages/EditAssignment";
import SkillPage from "./Pages/SkillPage";
import Login from "./Components/Login/Login";
import useToken from "./Components/useToken";
import Logout from "./Components/Logout";
import CreateStaff from "./Pages/CreateStaff";
import Axios from "axios";
import { DownOutlined } from "@ant-design/icons";
import CreateProject from "./Pages/CreateProject";
import CreateAssignment from "./Pages/CreateAssignment";
import Account from "./Pages/Account";
import AssignmentsOfStaff from "./Pages/AssignmentsOfStaff";
import CreateSkill from "./Pages/CreateSkill";

const { Header, Footer, Content } = Layout;
function App() {
  const { token, setToken } = useToken();
  const [infoAccount, setInfoAccount] = useState();
  const { logoutOne, logoutAll } = Logout({ setToken, setInfoAccount });
  const navigate = useNavigate();
  const items = [
    {
      label: (
        <>
          <Button type="link" onClick={() => navigate("account")}>
            Thông tin tài khoản
          </Button>
        </>
      ),
      key: "0",
    },
    {
      type: "divider",
    },
    {
      label: <Button type="link">Đăng xuất</Button>,
      children: [
        {
          key: "2-2",
          label: (
            <Button type="link" danger onClick={logoutOne}>
              Đăng xuất
            </Button>
          ),
        },
        {
          key: "2-3",
          label: (
            <Button type="link" danger onClick={logoutAll}>
              Đăng xuất mọi thiết bị
            </Button>
          ),
        },
      ],
      key: "3",
    },
  ];

  if (!token) {
    return <Login setToken={setToken} setInfoAccount={setInfoAccount} />;
  }
  if (!infoAccount) {
    getInfoAccount();
  }
  async function getInfoAccount() {
    await Axios({
      method: "get",
      url: "../api/staff?infoAccount=true",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        setInfoAccount(res.data);
      })
      .catch((error) => {
        console.log("App 39 error", error);
      });
  }

  return (
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
                <NavLink to="/">
                  <img src="/logoThinkLabs.png" alt="logoThinkLabs"></img>
                </NavLink>
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
              <Dropdown
                menu={{
                  items,
                }}
                trigger={["click"]}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <Avatar
                      size="small"
                      src={`/${infoAccount?.imageUrl}`}
                      alt="avat"
                    />
                    {infoAccount?.fullName}
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
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
          <Route path="/edit-staff/:idStaff" element={<EditStaffPage />} />
          <Route path="/create-staff" element={<CreateStaff />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route
            path="/edit-project/:idProject"
            element={<EditProjectPage />}
          />
          <Route path="/skill" element={<SkillPage />} />
          <Route path="/create-skill" element={<CreateSkill />} />
          <Route path="/assignment" element={<AssignmentPage />} />
          <Route
            path="/assignments-of-staff"
            element={<AssignmentsOfStaff />}
          />
          <Route path="/create-assignment" element={<CreateAssignment />} />
          <Route
            path="/detail-assignment/:idStaff"
            element={<DetailAssignment />}
          />
          <Route
            path="/edit-assignment/:idAssignment"
            element={<EditAssignment />}
          />
          <Route
            path="/account"
            element={<Account infoAccount={infoAccount} />}
          />

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
}

export default App;
