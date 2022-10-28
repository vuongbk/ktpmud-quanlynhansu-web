import {
  Button,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Typography,
  Popconfirm,
} from "antd";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import Axios from "axios";
import workingDay from "../utils";
import Loading from "../Components/Modal/Loading";
const { Option } = Select;
const { Title, Text } = Typography;

const EditProjectPage = () => {
  const [data, setData] = useState(useLocation().state.data);
  const [dataProjectChange, setDataProjectChange] = useState({});
  const [leaderChange, setLeaderChange] = useState("");
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (JSON.stringify(dataProjectChange) === "{}" && leaderChange === "") {
      window.alert("ko co thay doi");
    }

    //thay đổi bảng project
    if (JSON.stringify(dataProjectChange) !== "{}") {
      setLoading(true);
      await Axios.put(`/api/project/${data._id}`, dataProjectChange, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzNiZTQxOTEwODVjY2Q1MTYyMTA5MDgiLCJpYXQiOjE2NjQ5MDExNTR9.W6DseyJQsEOk-bdi9XPTQKRG1TeK_5Pc1Xbe11PPLaM",
        },
      });
      setLoading(false);
    }

    //thay đổi bảng leader
    if (leaderChange !== "") {
      if (data.idAssignment) {
        setLoading(true);
        await Axios.put(
          `/api/assignment/${data.idAssignment}`,
          { idStaff: leaderChange },
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzNiZTQxOTEwODVjY2Q1MTYyMTA5MDgiLCJpYXQiOjE2NjQ5MDExNTR9.W6DseyJQsEOk-bdi9XPTQKRG1TeK_5Pc1Xbe11PPLaM",
            },
          }
        );
        setLoading(false);
      } else {
        setLoading(true);
        await Axios.post(
          `/api/assignment`,
          {
            idStaff: leaderChange,
            idProject: data._id,
            role: "manager",
            dateStart: data.dateStart,
            dateEnd: data.dateEnd,
            effort: 10,
          },
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzNiZTQxOTEwODVjY2Q1MTYyMTA5MDgiLCJpYXQiOjE2NjQ5MDExNTR9.W6DseyJQsEOk-bdi9XPTQKRG1TeK_5Pc1Xbe11PPLaM",
            },
          }
        );
        setLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    await Axios.delete(`/api/project/${data._id}`, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzNiZTQxOTEwODVjY2Q1MTYyMTA5MDgiLCJpYXQiOjE2NjQ5MDExNTR9.W6DseyJQsEOk-bdi9XPTQKRG1TeK_5Pc1Xbe11PPLaM",
      },
    });

    //lấy danh sách assignment có liên quan để xóa luôn
    let listAssignment = await Axios.get(
      `/api/assignment-id-project/${data._id}`,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzNiZTQxOTEwODVjY2Q1MTYyMTA5MDgiLCJpYXQiOjE2NjQ5MDExNTR9.W6DseyJQsEOk-bdi9XPTQKRG1TeK_5Pc1Xbe11PPLaM",
        },
      }
    );
    listAssignment.data.infoAssignment.map(async (value) => {
      await Axios.delete(`/api/assignment/${value._id}`, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzNiZTQxOTEwODVjY2Q1MTYyMTA5MDgiLCJpYXQiOjE2NjQ5MDExNTR9.W6DseyJQsEOk-bdi9XPTQKRG1TeK_5Pc1Xbe11PPLaM",
        },
      });
    });
    setLoading(false);
  };

  async function getManagers() {
    setLoading(true);
    let listManagers = await Axios.get(`/api/staff`, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzNiZTQxOTEwODVjY2Q1MTYyMTA5MDgiLCJpYXQiOjE2NjQ5MDExNTR9.W6DseyJQsEOk-bdi9XPTQKRG1TeK_5Pc1Xbe11PPLaM",
      },
    });
    setManagers(listManagers.data);
    setLoading(false);
  }

  useEffect(() => {
    getManagers();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Row>
        <Col span={24}>
          <Row>
            <Col span={19} offset={5}>
              <Title level={3}>{data.projectName}</Title>
            </Col>
          </Row>
          <Row>
            {/* cột 1 */}
            <Col
              xs={24}
              md={{
                span: 6,
                offset: 5,
              }}
            >
              <Title level={5}>Tên dự án</Title>
              <Input
                defaultValue={data.projectName}
                onChange={(e) => {
                  setDataProjectChange((d) => {
                    return { ...d, projectName: e.target.value };
                  });
                }}
              />
              <Title level={5}>Ngày bắt đầu</Title>
              <DatePicker
                defaultValue={moment(data.dateStart)}
                style={{ width: "100%" }}
                onBlur={(e) => {
                  setDataProjectChange((d) => {
                    return { ...d, dateStart: e.target.value };
                  });
                }}
              />
              <Title level={5}>Dự kiến kết thúc</Title>
              <DatePicker
                defaultValue={moment(data.dateEnd)}
                style={{ width: "100%" }}
                onBlur={(e) => {
                  setDataProjectChange((d) => {
                    return { ...d, dateEnd: e.target.value };
                  });
                }}
              />
              <Text>Ước tính: {workingDay(data.dateStart, data.dateEnd)}</Text>
            </Col>
            {/* cột 2 */}
            <Col xs={24} md={{ span: 6, offset: 2 }}>
              <Title level={5}>PM/Leader</Title>
              <Select
                defaultValue={data.leader}
                onSelect={(e) => {
                  setLeaderChange(e);
                }}
                style={{
                  width: "100%",
                }}
              >
                {managers.map((value, index) => {
                  return <Option value={value._id}>{value.fullName}</Option>;
                })}
              </Select>
              <Title level={5}>Trạng thái</Title>
              <Select
                defaultValue={data.status}
                disabled
                style={{
                  width: "100%",
                }}
              ></Select>
              <Title level={5}>Đã chạy</Title>
              <Input
                defaultValue={workingDay(data.dateStart, new Date())}
                disabled
              />
              <Text>Còn lại: {workingDay(new Date(), data.dateEnd)}</Text>
            </Col>
          </Row>
          <Row>
            <Col span={16} offset={5}>
              <Row style={{ marginTop: "50px" }}>
                <Col span={6}>
                  <Button style={{ width: "100%" }}>
                    <Link to="/project">Quay lại</Link>
                  </Button>
                </Col>
                <Col span={6} offset={5}>
                  <Button style={{ width: "100%" }} onClick={handleSubmit}>
                    Cập nhật
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col span={6} offset={14}>
                  <Popconfirm
                    title="Bạn có chắc muốn xóa nhân viên？"
                    cancelText="Hủy"
                    okText="Xóa"
                    okButtonProps={{ type: "danger" }}
                    onConfirm={handleDelete}
                  >
                    <Button type="link" danger>
                      Xóa nhân viên
                    </Button>
                  </Popconfirm>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default EditProjectPage;
