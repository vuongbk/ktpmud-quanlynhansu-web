import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Login.css";
import Axios from "axios";
import { Button, Input, Typography, message, Form } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import md5 from "md5";
const { Title } = Typography;

async function loginUser(credentials) {
  return await Axios("/api/login", {
    method: "POST",
    data: credentials,
  })
    .then((res) => res.data.token)
    .catch((error) => {
      console.log("login 77", error);
    });
}
export default function Login({ setToken, setInfoAccount }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const handleSubmit = async (e) => {
    // e.preventDefault();
    console.log("login 23");
    const token = await Axios("/api/login", {
      method: "POST",
      data: { email, password },
    })
      .then((res) => res.data.token)
      .catch((error) => {
        message.error(error.response.data.message);
        console.log("94", error);
      });
    setToken(token);
  };
  return (
    // <div
    //   className="bg"
    //   style={{
    //     backgroundImage: "url('login.jpg')",
    //   }}
    // >
    //   {contextHolder}
    //   <Modal
    //     title={<h1>Đăng nhập</h1>}
    //     open
    //     closeIcon
    //     footer={[]}
    //     maskStyle={{ opacity: 0.5 }}
    //   >
    //     <form onSubmit={handleSubmit}>
    //       <label>
    //         <Title level={5}>Email</Title>
    //         <Input
    //           type="text"
    //           onChange={(e) => {
    //             setEmail(e.target.value);
    //           }}
    //         />
    //       </label>
    //       <label>
    //         <Title level={5}>Mật khẩu</Title>
    //         <Input.Password
    //           type="password"
    //           onChange={(e) => {
    //             setPassword(md5(e.target.value));
    //           }}
    //         />
    //       </label>
    //       <div>
    //         <button type="submit" style={{ marginTop: "10px" }}>
    //           Đăng nhập
    //         </button>
    //       </div>
    //     </form>
    //   </Modal>
    // </div>
    <div className="wrap-login-form">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={handleSubmit}
      >
        <Form.Item>
          <img src="/logoMau.png" alt="logo" className="logo" />
        </Form.Item>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Yêu cầu email!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Yêu cầu password!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(md5(e.target.value));
            }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

// Login.propTypes = {
//   setToken: PropTypes.func.isRequired,
// };
