import { Button, Row, Table, Typography } from "antd";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Axios from "axios";
import workingDay from "../utils";
import Loading from "../Components/Modal/Loading";
import { getToken } from "../Components/useToken";
import moment from "moment";
const { Title, Text } = Typography;
const { Column } = Table;

function AssignmentsOfStaff() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const columns = [
    {
      title: "Khoảng ngày",
      dataIndex: "_id",
      render: (text, record) => {
        return (
          <Link to={`/edit-assignment/${text}`}>
            {moment(record.dateStart).format("DD/MM/YYYY")} -{" "}
            {moment(record.dateEnd).format("DD/MM/YYYY")}
          </Link>
        );
      },
    },
    {
      title: "Vai trò",
      dataIndex: "role",
    },
    {
      title: "Phân công",
      dataIndex: "effort",
      render: (text) => {
        return <Text>{text}%</Text>;
      },
    },
  ];
  const navigate = useNavigate();
  async function getAssignments() {
    setLoading(true);
    await Axios.get(
      `/api/assignment?idStaff=${searchParams.get(
        "idStaff"
      )}&idProject=${searchParams.get("idProject")}`,
      {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      }
    )
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error getAssignments", error);
      });
  }

  useEffect(() => {
    getAssignments();
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Row justify="space-between">
        <Title
          level={3}
        >{`Nhân viên ${data?.staffName} - ${data?.projectName}`}</Title>
      </Row>
      <Table
        dataSource={data?.infoAssignment}
        pagination={{ pageSize: 6 }}
        rowKey={(record) => record._id}
        columns={columns}
        scroll={{
          y: 240,
        }}
      ></Table>
      <Row>
        <Button onClick={() => navigate(-1)}>Quay lại</Button>
      </Row>
    </>
  );
}

export default AssignmentsOfStaff;
