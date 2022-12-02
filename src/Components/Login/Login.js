import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Login.css";
import Axios from "axios";
import { Button, Input } from "antd";
import md5 from "md5";

async function loginUser(credentials) {
  return await Axios("/login", {
    method: "POST",
    data: credentials,
  })
    .then((res) => res.data.token)
    .catch((error) => console.log("Login 11", error));
}
export default function Login({ setToken, setInfoAccount }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("login 23");
    const token = await loginUser({
      email,
      password,
    });
    setToken(token);
  };
  return (
    <div className="login-wrapper">
      <h1>Đăng nhập</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Email</p>
          <Input
            type="text"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </label>
        <label>
          <p>Mật khẩu</p>
          <Input.Password
            type="password"
            onChange={(e) => {
              setPassword(md5(e.target.value));
            }}
          />
        </label>
        <div>
          <button type="submit">Đăng nhập</button>
        </div>
      </form>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
