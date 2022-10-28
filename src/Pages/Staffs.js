import { Table, Typography } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import Loading from "../Components/Modal/Loading";
const { Title, Text } = Typography;
const { Column } = Table;

function Staffs() {
  const emailRef = React.useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function getStaff() {
    setLoading(true);
    await Axios.get("/api/staff", {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzM4NWM4MjkyNzFiMzQ5ZDY4NzQ1MDYiLCJpYXQiOjE2NjYwODY4NjN9.pD3Jes5RcPy-73DaBtqEDn6JLX7KZ90ZzO1sn07j4wk",
      },
    })
      .then((res) => {
        setLoading(false);
        setData(res.data);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error getStaff", error);
      });
  }

  React.useEffect(() => {
    getStaff();
  }, []);
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Title level={3}>Danh sách nhân viên</Title>
      <Table
        dataSource={data}
        pagination={{ pageSize: 6 }}
        rowKey={(data) => data.email}
      >
        <Column
          title="Họ và tên"
          dataIndex="fullName"
          key="fullName"
          render={(fullName, record) => (
            <>
              <Link to="/edit-staff" state={{ data: record }}>
                {fullName}
              </Link>
            </>
          )}
        />
        <Column title="Điện thoại" dataIndex="phoneNumber" key="phoneNumber" />
        <Column title="Email" dataIndex="email" key="email" ref={emailRef} />
        <Column
          title="Vị trí"
          dataIndex="role"
          key="role"
          responsive={["sm"]}
        />
        <Column
          title="Cấp bậc"
          dataIndex="level"
          key="level"
          responsive={["md"]}
        />
        <Column
          title="Trạng thái"
          dataIndex="status"
          key="status"
          responsive={["lg"]}
        />
        <Column
          title="Phòng ban"
          dataIndex="department"
          key="department"
          responsive={["lg"]}
        />
        <Column
          title="Ngày vào làm"
          dataIndex="startTL"
          key="startTL"
          responsive={["xl"]}
        />
        <Column
          title="Giới tính"
          dataIndex="sex"
          key="sex"
          responsive={["xl"]}
        />
      </Table>
    </>
  );
}

export default Staffs;
