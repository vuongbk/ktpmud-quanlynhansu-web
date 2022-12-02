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

const EditAssignment = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(useLocation()?.state?.data);
  const { idAssignment } = useParams();
  const [error, setError] = useState();
  const [indexAssign, setIndexAssign] = useState(0);
  const [dataChange, setDataChange] = useState({});
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dateFormat = "DD/MM/YYYY";
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleSubmit = async () => {
    if (JSON.stringify(dataChange) === "{}") {
      window.alert("ko co thay doi");
    }

    if (JSON.stringify(dataChange) !== "{}") {
      setLoading(true);
      await Axios.put(`../api/assignment/${data?.asignment._id}`, dataChange, {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      })
        .then((res) => {
          console.log("editAssign 46", res);
          setLoading(false);
          navigate(-1);
        })
        .catch((error) => {
          setError(error.response.data);
          console.log("editAssign 62", error);
          setIsModalOpen(true);
          setLoading(false);
        });
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    await Axios({
      method: "delete",
      url: `../../api/assignment/${idAssignment}`,
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
  };

  async function getAssignment() {
    setLoading(true);
    await Axios({
      method: "get",
      url: `../api/assignment-staff-project/${idAssignment}`,
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("message error", error);
        setLoading(false);
      });
  }
  useEffect(() => {
    if (!data) {
      getAssignment();
    }
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
              <Title level={3}>Chỉnh sửa phân công</Title>
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
              <Input
                defaultValue={data?.fullName}
                disabled
                // onChange={(e) => {
                //   setDataChange((d) => {
                //     return { ...d, projectName: e.target.value };
                //   });
                // }}
              />
              <Title level={5}>Từ ngày</Title>
              <DatePicker
                format={dateFormat}
                value={moment(
                  dataChange.dateStart
                    ? dataChange.dateStart
                    : data?.asignment.dateStart
                )}
                style={{ width: "100%" }}
                onChange={(date, dateString) => {
                  setDataChange((d) => {
                    return { ...d, dateStart: dateString };
                  });
                }}
              />
              <Title level={5}>Phân công dự án</Title>
              <Input
                value={
                  dataChange.effort !== undefined
                    ? dataChange.effort
                    : data?.asignment.effort
                }
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
              <Input
                defaultValue={data?.projectName}
                disabled
                // onChange={(e) => {
                //   setDataChange((d) => {
                //     return { ...d, projectName: e.target.value };
                //   });
                // }}
              />
              <Title level={5}>Đến ngày</Title>
              <DatePicker
                format={dateFormat}
                value={moment(
                  dataChange.dateEnd
                    ? dataChange.dateEnd
                    : data?.asignment.dateEnd
                )}
                style={{ width: "100%" }}
                onChange={(date, dateString) => {
                  setDataChange((d) => {
                    return { ...d, dateEnd: dateString };
                  });
                }}
              />
              <Title level={5}>Vai trò</Title>
              <Input
                defaultValue={data?.asignment.role}
                disabled
                // onChange={(e) => {
                //   setDataChange((d) => {
                //     return { ...d, projectName: e.target.value };
                //   });
                // }}
              />
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
              <Row justify="space-between">
                <Col span={6} offset={14}>
                  <Popconfirm
                    title="Bạn có chắc muốn xóa nhân viên？"
                    cancelText="Hủy"
                    okText="Xóa"
                    okButtonProps={{ type: "danger" }}
                    onConfirm={handleDelete}
                  >
                    <Button type="link" danger>
                      Xóa phân công
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

export default EditAssignment;
