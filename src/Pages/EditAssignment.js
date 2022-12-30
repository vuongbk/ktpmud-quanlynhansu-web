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
  message,
} from "antd";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import moment, { ISO_8601 } from "moment";
import Axios from "axios";
import workingDay from "../utils";
import Loading from "../Components/Modal/Loading";
import { getToken } from "../Components/useToken";
const { Option } = Select;
const { Title, Text } = Typography;

const EditAssignment = () => {
  const effortRef = useRef();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [data, setData] = useState(useLocation()?.state?.data);
  const { idAssignment } = useParams();
  const [error, setError] = useState();
  const [indexAssign, setIndexAssign] = useState(0);
  const [dataChange, setDataChange] = useState({});
  console.log("32", dataChange);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dateFormat = "DD/MM/YYYY";
  const iso8601Format = "YYYY-MM-DD";
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleSubmit = async () => {
    if (JSON.stringify(dataChange) === "{}") {
      messageApi.open({
        type: "warning",
        content: "Không có thay đổi",
      });
      return;
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
          // setError(error.response.data);
          message.error(error.response.data.message);
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
        // setError(error.response.data);
        message.error(error.response.data.message);
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
    <Row>
      {contextHolder}
      <Col span={14} offset={5}>
        <Row>
          <Title level={3}>Chỉnh sửa phân công</Title>
        </Row>

        <Row>
          {/* cột 1 */}
          <Col
            xs={24}
            md={{
              span: 10,
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
              value={
                dataChange.dateStart
                  ? moment(dataChange.dateStart, [dateFormat, iso8601Format])
                  : moment(data?.asignment.dateStart)
              }
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
            <Title level={5}>Phân công dự án (%)</Title>
            <Input
              ref={effortRef}
              defaultValue={dataChange.effort || data?.asignment.effort}
              onChange={(e) => {
                setDataChange((d) => {
                  return { ...d, effort: Number(e.target.value) };
                });
              }}
            />
            <Row style={{ marginTop: "70px" }} justify={"space-between"}>
              <Col span={10}>
                <Button style={{ width: "100%" }} onClick={() => navigate(-1)}>
                  <Text>Quay lại</Text>
                </Button>
              </Col>
              <Col span={10}>
                <Row>
                  <Button
                    type="primary"
                    style={{ width: "100%" }}
                    onClick={handleSubmit}
                  >
                    Cập nhật
                  </Button>
                  {/* thông báo thông tin lỗi, effort, ngày bđ, kt */}
                  {/* <Modal
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
                  </Modal> */}
                </Row>
                <Row>
                  <Popconfirm
                    title="Bạn có chắc muốn xóa nhân viên？"
                    cancelText="Hủy"
                    okText="Xóa"
                    okButtonProps={{ type: "danger" }}
                    onConfirm={handleDelete}
                  >
                    <Button
                      style={{
                        width: "100%",
                        textAlign: "right",
                        fontSize: "0.75em",
                        padding: "0",
                      }}
                      type="link"
                      danger
                    >
                      Xóa phân công
                    </Button>
                  </Popconfirm>
                </Row>
              </Col>
            </Row>
          </Col>
          {/* cột 2 */}
          <Col xs={24} md={{ span: 10, offset: 4 }}>
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
                  ? moment(dataChange.dateEnd, [dateFormat, iso8601Format])
                  : moment(data?.asignment.dateEnd)
              )}
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
      </Col>
    </Row>
  );
};

export default EditAssignment;
