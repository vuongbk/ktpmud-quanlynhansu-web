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
import workingDay, { TitleModal } from "../utils";
import Loading from "../Components/Modal/Loading";
import { getToken } from "../Components/useToken";
const { Option } = Select;
const { Title, Text } = Typography;

const EditAssignment = () => {
  const effortRef = useRef();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [data, setData] = useState();
  const { idAssignment } = useParams();
  const [dataChange, setDataChange] = useState({});
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [isModalOpenHandleError, setIsModalOpenHandleError] = useState(false);
  const dateFormat = "DD/MM/YYYY";
  const iso8601Format = "YYYY-MM-DD";
  const handleSubmit = async () => {
    if (JSON.stringify(dataChange) === JSON.stringify(data.asignment)) {
      messageApi.open({
        type: "warning",
        content: "Không có thay đổi",
      });
      return;
    } else if (!dataChange?.effort) {
      messageApi.open({
        type: "warning",
        content: "Thiếu phân công",
      });
      return;
    } else if (
      moment(dataChange.dateStart).isSameOrAfter(moment(dataChange.dateEnd))
    ) {
      messageApi.open({
        type: "error",
        content: "Ngày bắt đầu phải trước ngày kết thúc",
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
          setLoading(false);
          navigate(-1);
        })
        .catch((error) => {
          message.error(error.response.data.message);
          if (error.response.data.hasOwnProperty("assignment")) {
            setIsModalOpenHandleError(true);
            setError(error.response.data);
          }
          setLoading(false);
        });
    }
  };

  const handleCancelHandleError = () => {
    setIsModalOpenHandleError(false);
  };

  const handleOkHandleError = () => {
    setIsModalOpenHandleError(false);
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
        message.success("Đã xóa phân công");
        setLoading(false);
        navigate(-1);
      })
      .catch((error) => {
        message.error(error.response.data.message);
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
        setDataChange(res.data.asignment);
        setLoading(false);
      })
      .catch((error) => {
        message.error(error.response.data.message);
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
              value={moment(dataChange.dateStart)}
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
              value={moment(dataChange.dateEnd)}
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
        <Row>
          <Col
            xs={24}
            md={{
              span: 10,
            }}
          >
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
                  <Modal
                    title={<TitleModal value="Thông báo" />}
                    open={isModalOpenHandleError}
                    onOk={handleOkHandleError}
                    onCancel={handleCancelHandleError}
                  >
                    <p>{error?.message}</p>
                    {error?.assignment && (
                      <>
                        <hr></hr>
                        <p>Phân công: {error?.assignment?.effort}%</p>
                        <p>
                          {`Ngày bắt đầu: ${moment(
                            error?.assignment?.dateStart
                          ).format(dateFormat)}`}
                        </p>
                        <p>
                          {"Ngày kết thúc: " +
                            moment(error?.assignment?.dateEnd).format(
                              dateFormat
                            )}
                        </p>
                      </>
                    )}
                  </Modal>
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
        </Row>
      </Col>
    </Row>
  );
};

export default EditAssignment;
