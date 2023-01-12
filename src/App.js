import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Staffs from "./Pages/Staffs";
import "./App.css";
import EditStaffPage from "./Pages/EditStaffPage";
import EditProjectPage from "./Pages/EditProjectPage";
import { Layout, Col, Row, Space, Dropdown, Button, Avatar } from "antd";
import { Outlet, NavLink } from "react-router-dom";
import ProjectPage from "./Pages/ProjectPage";
import AssignmentPage from "./Pages/AssignmentPage";
import DetailAssignment from "./Pages/DetailAssignment";
import EditAssignment from "./Pages/EditAssignment";
import SkillsOfStaffs from "./Pages/SkillsOfStaffs";
import Login from "./Components/Login/Login";
import useToken, { removeToken } from "./Components/useToken";
import Logout from "./Components/Logout";
import CreateStaff from "./Pages/CreateStaff";
import Axios from "axios";
import { DownOutlined } from "@ant-design/icons";
import CreateProject from "./Pages/CreateProject";
import CreateAssignment from "./Pages/CreateAssignment";
import Account from "./Pages/Account";
import AssignmentsOfStaff from "./Pages/AssignmentsOfStaff";
import Skills from "./Pages/Skills";
import { roleAdmin } from "./utils";

const { Header, Footer, Content } = Layout;
function App() {
  const { token, setToken } = useToken();
  const [infoAccount, setInfoAccount] = useState();
  const { logoutOne, logoutAll } = Logout({ setToken, setInfoAccount });
  const items = [
    {
      label: (
        <>
          <Button type="link">
            <Link to="/account">Thông tin tài khoản</Link>
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
        //Chỗ này vẫn chưa test được
        //Trước là đg bật tab local, xong bật sang tab build thì nó ko dùng được token kia, nó ko hiển thị dữ liệu
        //cx ko render ra trang login, cứ phải vào localStorage xóa token bằng tay
        return <Login setToken={setToken} setInfoAccount={setInfoAccount} />;
      });
  }

  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          width: "100%",
          padding: "0 80px",
          backgroundColor: "#283b6e",
        }}
      >
        <Row>
          <Col span={18}>
            <Row>
              <Col span={7}>
                <NavLink to="/">
                  <img src="/logoThinkLabs.png" alt="logo"></img>
                </NavLink>
              </Col>
              <Col span={17}>
                <Space size={20}>
                  <NavLink
                    style={({ isActive }) => {
                      return {
                        fontSize: "16px",
                        display: "block",
                        color: isActive ? "#40a9ff" : "white",
                      };
                    }}
                    to="/assignment"
                  >
                    Phân công
                  </NavLink>
                  {infoAccount?.role === roleAdmin && (
                    <NavLink
                      style={({ isActive }) => {
                        return {
                          fontSize: "16px",
                          display: "block",
                          color: isActive ? "#40a9ff" : "white",
                        };
                      }}
                      to="/staff"
                    >
                      Nhân sự
                    </NavLink>
                  )}
                  <NavLink
                    style={({ isActive }) => {
                      return {
                        fontSize: "16px",
                        display: "block",
                        color: isActive ? "#40a9ff" : "white",
                      };
                    }}
                    to="/project"
                  >
                    Dự án
                  </NavLink>
                  {infoAccount?.role === roleAdmin && (
                    <NavLink
                      style={({ isActive }) => {
                        return {
                          fontSize: "16px",
                          display: "block",
                          color: isActive ? "#40a9ff" : "white",
                        };
                      }}
                      to="/skills-of-staffs"
                    >
                      Kỹ năng
                    </NavLink>
                  )}
                </Space>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row justify="end">
              <Dropdown
                menu={{
                  items,
                }}
                trigger={["click"]}
              >
                <Space
                  style={{
                    cursor: "pointer",
                    fontSize: "16px",
                    color: "white",
                  }}
                >
                  <Avatar
                    size="small"
                    src={`/${infoAccount?.imageUrl}`}
                    alt="avat"
                  />
                  {infoAccount?.fullName}
                  <DownOutlined />
                </Space>
              </Dropdown>
            </Row>
          </Col>
        </Row>
      </Header>
      <Content
        style={{
          padding: "50px 80px",
          minHeight: "90vh",
        }}
      >
        <Routes>
          <Route index element={<AssignmentPage />} />
          <Route path="/assignment" element={<AssignmentPage />} />
          <Route path="/staff" element={<Staffs />} />
          <Route path="/edit-staff/:idStaff" element={<EditStaffPage />} />
          <Route path="/create-staff" element={<CreateStaff />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route
            path="/edit-project/:idProject"
            element={<EditProjectPage />}
          />
          <Route path="/skills-of-staffs" element={<SkillsOfStaffs />} />
          <Route path="/skills" element={<Skills />} />
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
          <Route path="/account" element={<Account />} />

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
          height: "9vh",
        }}
      >
        ThinkLab
      </Footer>
    </Layout>
  );
}

export default App;
