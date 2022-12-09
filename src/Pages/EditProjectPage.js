import {
  Button,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Typography,
  Popconfirm,
  Modal,
  notification,
} from "antd";
import { useState, useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import Axios from "axios";
import workingDay from "../utils";
import Loading from "../Components/Modal/Loading";
import { getToken } from "../Components/useToken";
const { Option } = Select;
const { Title, Text } = Typography;

function EditProjectPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(useLocation().state?.data);
  const { idProject } = useParams();
  const [error, setError] = useState();
  const [dataProjectChange, setDataProjectChange] = useState({});
  // console.log("editpj 29", dataProjectChange);
  const [leaderChange, setLeaderChange] = useState("");
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  let options = managers ? getOptions() : [];
  const [assignments, setAssignments] = useState([]);
  const timeWorkingEstimation = workingDay(
    dataProjectChange.dateStart || data?.dateStart,
    dataProjectChange.dateEnd || data?.dateEnd
  );
  //Tính tổng thời gian nhân viên đã được phân công làm cho tới hiện tại
  const currentDay = moment().startOf("day");
  const totalTimeWorking = assignments.reduce((total, value) => {
    return (total += workingDay(value.dateStart, currentDay));
  }, 0);
  const dateFormat = "DD/MM/YYYY";
  function getOptions() {
    return managers.map((value, index) => {
      return {
        value: value._id,
        label: value.fullName,
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
    if (JSON.stringify(dataProjectChange) === "{}" && leaderChange === "") {
      notification.open({
        message: "Thông báo",
        description: "Không có thay đổi",
        duration: 2,
        placement: "topLeft",
      });
      return;
    }

    //thay đổi bảng project
    if (JSON.stringify(dataProjectChange) !== "{}") {
      setLoading(true);
      await Axios.put(`/api/project/${data?._id}`, dataProjectChange, {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      })
        .then((res) => {
          console.log("editProject 52", res);
          navigate(-1);
        })
        .catch((error) => {
          console.log("editProject 55", error);
          setError(error.response.data);
          setIsModalOpen(true);
        });
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    await Axios.delete(`/api/project/${data?._id}`, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        console.log("editAssignment 81", res.data);
        navigate(-1);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.response.data);
        console.log("editAssign 87", error);
        setIsModalOpen(true);
        setLoading(false);
      });

    //lấy danh sách assignment có liên quan để xóa luôn
    let listAssignment = await Axios.get(
      `/api/assignment-id-project/${data?._id}`,
      {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      }
    );
    listAssignment.data?.infoAssignment
      .map(async (value) => {
        await Axios.delete(`/api/assignment/${value._id}`, {
          headers: {
            Authorization: "Bearer " + getToken(),
          },
        });
      })
      .then((res) => {
        console.log("editAssignment 81", res.data);
        navigate(-1);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.response.data);
        console.log("editAssign 87", error);
        setIsModalOpen(true);
        setLoading(false);
      });
    setLoading(false);
  };

  async function getManagers() {
    await Axios.get(`/api/staff`, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        setManagers(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("message error", error.config);
        setLoading(false);
      });
  }
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

  async function getProject() {
    setLoading(true);
    await Axios.get(`/api/project/${idProject}`, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        const infoProject = res.data?.infoProject;
        setData({
          ...infoProject,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log("message error", error);
        setLoading(false);
      });
  }
  async function getAssignments() {
    setLoading(true);
    await Axios.get(`/api/assignment-id-project/${data?._id}`, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        setAssignments(res.data?.infoAssignment);
      })
      .catch((error) => {
        console.log("message error", error);
      });
  }

  useEffect(() => {
    if (!data) {
      console.log("get data");
      getProject();
    }
    getAssignments();
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
              <Title level={3}>
                {dataProjectChange.projectName || data?.projectName}
              </Title>
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
                defaultValue={
                  dataProjectChange.projectName || data?.projectName
                }
                onChange={(e) => {
                  setDataProjectChange((d) => {
                    return { ...d, projectName: e.target.value };
                  });
                }}
              />
              <Title level={5}>Ngày bắt đầu</Title>
              <DatePicker
                format={dateFormat}
                defaultValue={moment(
                  dataProjectChange.dateStart || data?.dateStart
                )}
                style={{ width: "100%" }}
                onBlur={(e) => {
                  setDataProjectChange((d) => {
                    return { ...d, dateStart: e.target.value };
                  });
                }}
              />
              <Title level={5}>Dự kiến kết thúc</Title>
              <DatePicker
                format={dateFormat}
                defaultValue={moment(
                  dataProjectChange.dateEnd || data?.dateEnd
                )}
                style={{ width: "100%" }}
                onBlur={(e) => {
                  setDataProjectChange((d) => {
                    return { ...d, dateEnd: e.target.value };
                  });
                }}
              />
              <Text>
                Ước tính: {Math.round(timeWorkingEstimation * 100) / 100} mm
              </Text>
            </Col>
            {/* cột 2 */}
            <Col xs={24} md={{ span: 6, offset: 2 }}>
              <Title level={5}>PM/Leader</Title>
              <Select
                labelInValue
                defaultValue={data?.nameLeader}
                onChange={(e) => {
                  console.log("createProject 230", e);
                  setDataProjectChange((d) => {
                    return { ...d, idLeader: e.value, nameLeader: e.label };
                  });
                }}
                style={{
                  width: "100%",
                }}
                options={options}
              ></Select>
              <Title level={5}>Trạng thái</Title>
              <Select
                defaultValue={data?.status}
                onChange={(e) => {
                  console.log("createProject 230", e);
                  setDataProjectChange((d) => {
                    return { ...d, status: e };
                  });
                }}
                style={{
                  width: "100%",
                }}
                options={[
                  {
                    value: "Đang thực hiện",
                    label: "Đang thực hiện",
                  },
                  {
                    value: "Kết thúc",
                    label: "Kết thúc",
                  },
                  {
                    value: "Tạm dừng",
                    label: "Tạm dừng",
                  },
                  {
                    value: "Chưa thực hiện",
                    label: "Chưa thực hiện",
                  },
                ]}
              ></Select>
              <Title level={5}>Đã chạy</Title>
              <Input
                defaultValue={() => {
                  return Math.round(totalTimeWorking * 100) / 100 + " mm";
                }}
                disabled
              />
              <Text>
                Còn lại:{" "}
                {Math.round((timeWorkingEstimation - totalTimeWorking) * 100) /
                  100}{" "}
                {" mm"}
              </Text>
            </Col>
          </Row>
          <Row justify="space-between">
            <Col span={16} offset={5}>
              <Row style={{ marginTop: "50px" }}>
                <Col span={6}>
                  <Button
                    style={{ width: "100%" }}
                    onClick={() => navigate(-1)}
                  >
                    Quay lại
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
              <Row>
                <Col span={6} offset={14}>
                  <Popconfirm
                    title="Bạn có chắc muốn xóa dự án？"
                    cancelText="Hủy"
                    okText="Xóa"
                    okButtonProps={{ type: "danger" }}
                    onConfirm={handleDelete}
                  >
                    <Button type="link" danger>
                      Xóa dự án
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
}

export default EditProjectPage;
