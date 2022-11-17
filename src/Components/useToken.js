import { useState } from "react";
const getToken = () => {
  const tokenString = localStorage.getItem("token");
  return tokenString;
};
const removeToken = () => {
  localStorage.removeItem("token");
};
export default function useToken() {
  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    if (userToken) {
      localStorage.setItem("token", userToken);
    }
    setToken(userToken);
  };
  return {
    setToken: saveToken,
    token,
  };
}

export { getToken, removeToken };
