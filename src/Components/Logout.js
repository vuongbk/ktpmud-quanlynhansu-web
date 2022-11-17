import { getToken, removeToken } from "./useToken";
import Axios from "axios";
import { Button } from "antd";

export default function Lougout({ setToken }) {
  const lougoutOne = async (e) => {
    e.preventDefault();
    Axios("/logout-one", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    });
    removeToken();
    setToken(getToken());
  };

  const lougoutAll = async (e) => {
    e.preventDefault();
    Axios({
      url: "/logout-all",
      method: "POST",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    });
    removeToken();
    setToken(getToken());
  };
  return (
    <>
      <Button type="primary" danger onClick={lougoutOne}>
        Đăng xuất khỏi thiết bị này
      </Button>
      <Button type="primary" danger onClick={lougoutAll}>
        Đăng xuất khỏi mọi thiết bị
      </Button>
    </>
  );
}
