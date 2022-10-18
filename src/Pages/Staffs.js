import { Table } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import Axios from "axios";

const { Column } = Table;

function Staffs() {
  const emailRef = React.useRef(null);
  const [data, setData] = React.useState(null);

  async function getStaff() {
    await Axios.get("/api/staff", {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzM4NjhiN2RkODFiMDkwYWRkOGQ1YTciLCJpYXQiOjE2NjQ2NDEyMDd9.oB7vpO68LDoTbtQ9vZef8hUe0rQmUss32CxguC9kmy0",
      },
    }).then((res) => setData(res.data));
  }

  React.useEffect(() => {
    getStaff();
  }, []);
  return (
    <>
      <h2>Danh sách nhân viên</h2>
      <Table dataSource={data} pagination={{ pageSize: 6 }}>
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
