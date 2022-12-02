import { getToken, removeToken } from "./useToken";
import Axios from "axios";
import { Button } from "antd";

export default function Lougout({ setToken, setInfoAccount }) {
  const logoutOne = async (e) => {
    e.preventDefault();
    await Axios("/logout-one", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    });
    removeToken();
    setToken(getToken());
    setInfoAccount("");
  };

  const logoutAll = async (e) => {
    e.preventDefault();
    await Axios({
      url: "/logout-all",
      method: "POST",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    });
    removeToken();
    setToken(getToken());
  };
  return {
    logoutOne,
    logoutAll,
  };
}
