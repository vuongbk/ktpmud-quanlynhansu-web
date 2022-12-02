import { Button, Row, Table, Typography } from "antd";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import workingDay from "../utils";
import Loading from "../Components/Modal/Loading";
import { getToken } from "../Components/useToken";
import moment from "moment";
const { Title, Text } = Typography;
const { Column } = Table;

function ProjectPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      title: "Tên dự án",
      dataIndex: "projectName",
      key: "projectName",
      render: (projectName, record) => (
        <>
          <Link to={`/edit-project/${record._id}`} state={{ data: record }}>
            {projectName}
          </Link>
        </>
      ),
    },
    {
      title: "Thời gian dự kiến (mm)",
      dataIndex: "thoigiandukien",
      render: (text) => text,
    },
    {
      title: "Đã chạy (mm)",
      dataIndex: "dachay",
      key: "dachay",
      render: (text) => text,
    },
    {
      title: "Còn lại (mm)",
      render: (text, record) => {
        return Math.round((record.thoigiandukien - record.dachay) * 100) / 100;
      },
    },
    {
      title: "PM/Leader",
      dataIndex: "nameLeader",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "dateStart",
      render: (dateStart) => {
        let dtStart = new Date(dateStart);
        return <Text>{moment(dateStart).format("DD/MM/YYYY")}</Text>;
      },
      key: "dateStart",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
  ];
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState();
  //Tính tổng thời gian nhân viên đã được phân công làm cho tới hiện tại
  const currentDay = moment().startOf("day");
  const totalTimeWorking = (listAssignments) => {
    return listAssignments.reduce((total, value) => {
      return (total += workingDay(value.dateStart, currentDay));
    }, 0);
  };

  async function getProjects(assignments) {
    setLoading(true);
    await Axios.get("/api/project", {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        let projects = res.data.infoProjects.map((value, index) => {
          return {
            ...value,
            thoigiandukien:
              Math.round(workingDay(value.dateStart, value.dateEnd) * 100) /
              100,
            dachay:
              Math.round(totalTimeWorking(assignments[index]) * 100) / 100,
          };
        });

        setData(projects);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);

        console.log("error getProjects", error);
      });
  }

  async function getAssignments() {
    setLoading(true);
    await Axios.get(`/api/assignments-of-projects`, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        setAssignments(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("message error", error);
        setLoading(false);
      });
  }

  //Làm tiếp chỗ này
  useEffect(() => {
    if (!assignments) {
      getAssignments();
    }
    if (assignments) {
      getProjects(assignments);
    }
  }, [assignments]);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Row justify="space-between">
        <Title level={3}>Danh sách dự án</Title>
        <Button type="primary" onClick={() => navigate("../create-project")}>
          Thêm mới
        </Button>
      </Row>
      <Table
        dataSource={data}
        pagination={{ pageSize: 6 }}
        rowKey={(data) => data.projectName}
        columns={columns}
      ></Table>
    </>
  );
}

export default ProjectPage;
