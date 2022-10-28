import { Spin, Typography } from "antd";
import "./Loading.css";

export default function Loading() {
  return (
    <div className="loading">
      <Spin tip="Loading..." />
    </div>
  );
}
