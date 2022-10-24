import { Table, Typography } from "antd";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import workingDay from "../utils";
const { Title, Text } = Typography;
const { Column } = Table;

function AssignmentPage() {
  const [data, setData] = useState(null);

  async function getAssignmentAndStaff() {
    await Axios.get("/api/assignment-staff", {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzM4NWM4MjkyNzFiMzQ5ZDY4NzQ1MDYiLCJpYXQiOjE2NjYwODY4NjN9.pD3Jes5RcPy-73DaBtqEDn6JLX7KZ90ZzO1sn07j4wk",
      },
    }).then((res) => {
      let curDate = new Date();
      console.log("assign 19", curDate.getMonth() + 1);
    });
  }

  useEffect(() => {
    if (!data) {
      getAssignmentAndStaff();
    }
    // if (data && !data[0][0].hasOwnProperty("staffName")) {
    //   getStaffName();
    // }
  }, [data]);
  return (
    <>
      <Title>Phân công nhân sự</Title>
      <Table
        dataSource={data}
        pagination={{ pageSize: 6 }}
        rowKey={(data) => data.staffName}
      >
        <Column
          title="Nhân viên"
          dataIndex="fullName"
          key="fullName"
          render={(fullName, record) => (
            <>
              <Link to="/edit-project" state={{ data: record }}>
                {fullName}
              </Link>
            </>
          )}
        />
        {console.log("assign 51", data)}
        <Column title="role" dataIndex="role" />
      </Table>
    </>
  );
}

export default AssignmentPage;
