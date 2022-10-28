import { Table, Typography } from "antd";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import workingDay from "../utils";
import Loading from "../Components/Modal/Loading";
const { Title, Text } = Typography;
const { Column } = Table;

function ProjectPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  function checkStatus(date1, date2) {
    let dt1 = new Date(date1);
    let dt2 = new Date(date2);
    let curDate = new Date();
    if (curDate < dt1) {
      return "Chưa bắt đầu";
    } else if (curDate < dt2 && curDate > dt1) {
      return "Đang thực hiện";
    } else {
      return "Đã kết thúc";
    }
  }

  async function getProjects() {
    setLoading(true);
    await Axios.get("/api/project", {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzRjY2M3ODE4YmJjNjE2ZmUxMWM0YTciLCJpYXQiOjE2NjU5Nzc0NjR9.AMpdLJ8HvGU5cz0mzVLhVxm9fQSlkMYK_77tLE-M2n0",
      },
    })
      .then((res) => {
        let projects = res.data.infoProjects.map((value) => {
          return {
            ...value,
            thoigiandukien: workingDay(value.dateStart, value.dateEnd),
            status: checkStatus(value.dateStart, value.dateEnd),
          };
        });

        setData(projects);
      })
      .catch((error) => {
        setLoading(false);

        console.log("error getProjects", error);
      });
  }

  const getLeader = async () => {
    let leaders;
    //lấy assignment của leader
    const getAssignmentById = data.map(async (value, index) => {
      return await Axios.get(`/api/assignment-id-project/${value._id}`, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzRjY2M3ODE4YmJjNjE2ZmUxMWM0YTciLCJpYXQiOjE2NjU5Nzc0NjR9.AMpdLJ8HvGU5cz0mzVLhVxm9fQSlkMYK_77tLE-M2n0",
        },
      });
    });
    await Promise.all(getAssignmentById)
      .then((values) => {
        //rút ra mảng các assignment cua leader
        leaders = values.map((value) => {
          return value.data.infoAssignment.find((assign) => {
            return assign.role === "manager";
          });
        });
      })
      .catch((error) => {
        setLoading(false);

        console.log("error getAssignmentById", error);
      });

    //lấy thông tin leader từ bảng staffs
    const getInfoLeader = leaders.map(async (value, index) => {
      if (value) {
        return await Axios.get(`/api/staff/${value.idStaff}`, {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzRjY2M3ODE4YmJjNjE2ZmUxMWM0YTciLCJpYXQiOjE2NjU5Nzc0NjR9.AMpdLJ8HvGU5cz0mzVLhVxm9fQSlkMYK_77tLE-M2n0",
          },
        });
      } else {
        return "chua co leader";
      }
    });
    Promise.all(getInfoLeader)
      .then((values) => {
        setData((d) => {
          return d.map((value, index) => {
            return {
              ...value,
              leader:
                typeof values[index] === "object"
                  ? values[index].data.infoStaff.fullName
                  : values[index],
              idAssignment:
                typeof values[index] === "object" ? leaders[index]._id : "",
              idStaff:
                typeof values[index] === "object"
                  ? values[index]?.data.infoStaff._id
                  : "",
            };
          });
        });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error getInfoLeader", error);
      });
  };

  useEffect(() => {
    if (!data) {
      getProjects();
    }
    if (data && !data[0].hasOwnProperty("leader")) {
      getLeader();
    }
  }, [data]);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Title level={3}>Danh sách dự án</Title>
      <Table
        dataSource={data}
        pagination={{ pageSize: 6 }}
        rowKey={(data) => data.projectName}
      >
        <Column
          title="Tên dự án"
          dataIndex="projectName"
          key="projectName"
          render={(projectName, record) => (
            <>
              <Link to="/edit-project" state={{ data: record }}>
                {projectName}
              </Link>
            </>
          )}
        />
        <Column title="Thời gian dự kiến" dataIndex="thoigiandukien" />
        <Column title="PM/Leader" dataIndex="leader" />
        <Column
          title="Ngày bắt đầu"
          dataIndex="dateStart"
          render={(dateStart) => {
            let dtStart = new Date(dateStart);
            return (
              <Text>
                {dtStart.getDate() +
                  "/" +
                  (dtStart.getMonth() + 1) +
                  "/" +
                  dtStart.getFullYear()}
              </Text>
            );
          }}
          key="dateStart"
        />
        <Column title="Trạng thái" dataIndex="status" key="status" />
      </Table>
    </>
  );
}

export default ProjectPage;
