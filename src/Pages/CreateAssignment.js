import {
  Button,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Typography,
  Popconfirm,
  Dropdown,
  Menu,
  Modal,
  notification,
} from "antd";
import { useState, useEffect } from "react";
import {
  Link,
  useLocation,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import moment from "moment";
import Axios from "axios";
import workingDay from "../utils";
import Loading from "../Components/Modal/Loading";
import { getToken } from "../Components/useToken";
const { Option } = Select;
const { Title, Text } = Typography;

const CreateAssignment = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(useLocation()?.state?.data);
  const [error, setError] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dataChange, setDataChange] = useState({
    idStaff: searchParams.get("idStaff"),
  });
  console.log("createassign 36", dataChange);
  const [projects, setProjects] = useState([]);
  console.log("createassign 38", projects);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dateFormat = "DD/MM/YYYY";
  const iso8601Format = "YYYY-MM-DD";

  let optionsStaffs = Array.isArray(data) ? getOptionsStaffs() : [];
  function getOptionsStaffs() {
    return data?.map((value, index) => {
      return {
        value: value._id,
        label: value.fullName,
      };
    });
  }
  let optionsProjects = projects ? getOptionsProjects() : [];
  function getOptionsProjects() {
    return projects.map((value, index) => {
      return {
        value: value._id,
        label: value.projectName,
      };
    });
  }
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleSubmit = async () => {
    if (JSON.stringify(dataChange) === "{}") {
      notification.open({
        message: "Thông báo",
        description: "Không có thay đổi",
        duration: 2,
        placement: "topLeft",
      });
      return;
    } else {
      setLoading(true);
      await Axios.post(`../api/assignment`, dataChange, {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      })
        .then((res) => {
          console.log("createAssign 63", res);
          setLoading(false);
          navigate(-1);
        })
        .catch((error) => {
          setError(error.response.data);
          console.log("createAssign 68", error);
          setIsModalOpen(true);
          setLoading(false);
        });
    }
  };

  async function getStaff() {
    setLoading(true);
    await Axios.get(
      `/api/staff/${
        searchParams.get("idStaff") ? searchParams.get("idStaff") : ""
      }`,
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
        console.log("error createAssignment 106", error);
        setLoading(false);
      });
  }

  async function getProjects() {
    setLoading(true);
    await Axios({
      method: "get",
      url: "/api/project",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        setProjects(res.data.infoProjects);
        setLoading(false);
      })
      .catch((error) => {
        console.log("createAssign 127", error);
        setLoading(false);
      });
  }

  useEffect(() => {
    if (!data) {
      getStaff();
    }
    getProjects();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Row>
        {/* {console.log("editassign 126 ", moment(error?.dateStart))} */}
        <Col span={24}>
          <Row>
            <Col span={19} offset={5}>
              <Title level={3}>Thêm phân công</Title>
            </Col>
            <Col>
              {/* <Dropdown overlay={menu}>
                <p>Chọn khoảng ngày</p>
              </Dropdown> */}
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
              <Title level={5}>Nhân viên</Title>
              {searchParams.get("idStaff") ? (
                <Input defaultValue={data?.fullName} disabled />
              ) : (
                <Select
                  labelInValue
                  onChange={(e) => {
                    console.log("createProject 230", e);
                    setDataChange((d) => {
                      return { ...d, idStaff: e.value };
                    });
                  }}
                  style={{
                    width: "100%",
                  }}
                  options={optionsStaffs}
                ></Select>
              )}

              <Title level={5}>Từ ngày</Title>
              <DatePicker
                format={dateFormat}
                style={{ width: "100%" }}
                onChange={(date, dateString) => {
                  setDataChange((d) => {
                    return {
                      ...d,
                      dateStart: moment(date).format(iso8601Format),
                    };
                  });
                }}
              />
              <Title level={5}>Phân công dự án</Title>
              <Input
                value={dataChange?.effort}
                onChange={(e) => {
                  setDataChange((d) => {
                    return { ...d, effort: Number(e.target.value) };
                  });
                }}
              />
            </Col>
            {/* cột 2 */}
            <Col xs={24} md={{ span: 6, offset: 2 }}>
              <Title level={5}>Dự án</Title>
              <Select
                labelInValue
                onChange={(e) => {
                  console.log("createProject 230", e);
                  setDataChange((d) => {
                    return { ...d, idProject: e.value };
                  });
                }}
                style={{
                  width: "100%",
                }}
                options={optionsProjects}
              ></Select>
              <Title level={5}>Đến ngày</Title>
              <DatePicker
                format={dateFormat}
                style={{ width: "100%" }}
                onChange={(date, dateString) => {
                  setDataChange((d) => {
                    return {
                      ...d,
                      dateEnd: moment(date).format(iso8601Format),
                    };
                  });
                }}
              />
              <Title level={5}>Vai trò</Title>
              <Select
                defaultValue={dataChange.role}
                onSelect={(e) => {
                  setDataChange((d) => {
                    return { ...d, role: e };
                  });
                }}
                style={{
                  width: "100%",
                }}
              >
                <Option value="developer">Lập trình viên</Option>
                {/* <Option value="Leader">Leader</Option> */}
                {/* leader là gì khi đã có manager */}
                <Option value="manager">Quản lý dự án</Option>
              </Select>
            </Col>
          </Row>
          <Row>
            <Col span={16} offset={5}>
              <Row style={{ marginTop: "50px" }}>
                <Col span={6}>
                  <Button
                    style={{ width: "100%" }}
                    onClick={() => navigate(-1)}
                  >
                    <Text>Quay lại</Text>
                  </Button>
                </Col>
                <Col span={6} offset={5}>
                  <Button style={{ width: "100%" }} onClick={handleSubmit}>
                    Cập nhật
                  </Button>
                  <Modal
                    title="Thông báo"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                  >
                    <p>{error?.message}</p>
                    {error?.assignment && (
                      <>
                        <hr></hr>
                        <p>effort: {error?.assignment?.effort}</p>
                        <p>
                          {`dateStart: ${moment(
                            error?.assignment?.dateStart
                          ).format("DD-MM-YYYY")}`}
                        </p>
                        <p>
                          {"dateEnd: " +
                            moment(error?.assignment?.dateEnd).format(
                              "DD-MM-YYYY"
                            )}
                        </p>
                      </>
                    )}
                  </Modal>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default CreateAssignment;
