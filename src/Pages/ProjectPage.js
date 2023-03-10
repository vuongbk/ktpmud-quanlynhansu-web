import { Button, message, Row, Table, Typography } from "antd";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import workingDay from "../utils";
import Loading from "../Components/Modal/Loading";
import { getToken } from "../Components/useToken";
import moment from "moment";
import { roleAdmin, TitleTable } from "../utils";
const { Title, Text } = Typography;
const { Column } = Table;

function ProjectPage(props) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [infoAccount, setInfoAccount] = useState(props?.infoAccount);
  console.log("project 17", infoAccount);
  const columns = [
    {
      title: <TitleTable value="Tên dự án" />,
      dataIndex: "projectName",
      key: "projectName",
      render: (projectName, record) => (
        <>
          <Link
            to={
              infoAccount?.role === roleAdmin
                ? `/edit-project/${record._id}`
                : "#"
            }
            state={{ data: record }}
          >
            {projectName}
          </Link>
        </>
      ),
    },
    {
      title: <TitleTable value="Thời gian dự kiến (mm)" />,
      dataIndex: "thoigiandukien",
      render: (text) => text,
    },
    {
      title: <TitleTable value="Đã chạy (mm)" />,
      dataIndex: "dachay",
      key: "dachay",
      render: (text) => text,
    },
    {
      title: <TitleTable value="Còn lại (mm)" />,
      render: (text, record) => {
        return Math.round((record.thoigiandukien - record.dachay) * 100) / 100;
      },
    },
    {
      title: <TitleTable value="PM/Leader" />,
      dataIndex: "nameLeader",
    },
    {
      title: <TitleTable value="Ngày bắt đầu" />,
      dataIndex: "dateStart",
      render: (dateStart) => {
        return <Text>{moment(dateStart).format("DD/MM/YYYY")}</Text>;
      },
      key: "dateStart",
    },
    {
      title: <TitleTable value="Trạng thái" />,
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

  async function getInfoAccount() {
    await Axios({
      method: "get",
      url: "../api/staff?infoAccount=true",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        console.log("project 92");
        setInfoAccount(res.data);
      })
      .catch((error) => {
        message.error(error.response.data.message);
      });
  }

  async function getProjects(assignments) {
    setLoading(true);
    await Axios.get(
      `/api/project?role=${infoAccount?.role}&idLeader=${infoAccount?._id}`,
      {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      }
    )
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
        message.error(error.response.data.message);
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
        message.error(error.response.data.message);
        setLoading(false);
      });
  }

  useEffect(() => {
    if (!infoAccount) {
      getInfoAccount();
    }
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
        {infoAccount?.role === roleAdmin && (
          <Button type="primary" onClick={() => navigate("../create-project")}>
            Thêm mới
          </Button>
        )}
      </Row>
      {console.log("project 174")}
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
