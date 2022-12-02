import {
  Button,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Typography,
  Popconfirm,
  message,
  Modal,
} from "antd";
import { useState, useEffect, useRef } from "react";
import md5 from "md5";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Divider, Space } from "antd";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import Axios from "axios";
import Loading from "../Components/Modal/Loading.js";
import Upload from "antd/lib/upload/Upload.js";
import { getToken } from "../Components/useToken.js";
const { Option } = Select;

function CreateStaff() {
  const defaultPassword = "12345678";
  const navigate = useNavigate();
  const [dataStaffChange, setDataStaffChange] = useState({
    password: md5(defaultPassword),
  });
  console.log("createstaff 45", dataStaffChange);
  const [levelSkillChange, setLevelSkillChange] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  // console.log("edit staff 57", imageUrl);
  //state dùng để thêm department
  const [departments, setDepartments] = useState(["Thanh Hóa", "Hà Nội"]);
  const [nameDepartment, setNameDepartment] = useState("");
  const inputRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onNameDepartmentChange = (event) => {
    setNameDepartment(event.target.value);
  };

  const addItem = (e) => {
    e.preventDefault();
    setDepartments([...departments, nameDepartment]);
    setNameDepartment("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleSubmit = async () => {
    if (
      JSON.stringify(dataStaffChange) === "{}" &&
      JSON.stringify(levelSkillChange) === "[]"
    ) {
      window.alert("ko co thay doi");
    }

    //create staff
    if (JSON.stringify(dataStaffChange) !== "{}") {
      setLoading(true);
      await Axios.post(`/api/staff`, dataStaffChange, {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      })
        .then((res) => {
          console.log("editStaff 101", res);
          navigate(-1);
        })
        .catch((error) => {
          setError(error.response.data);
          console.log("editStaff 105", error);
          setIsModalOpen(true);
        });
    }
    setLoading(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Row>
        <Col span={24}>
          <Row>
            <Col span={20} offset={5}>
              <Typography.Title level={4}>Thêm nhân viên mới</Typography.Title>
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
              <Typography.Title level={5}>Họ và tên</Typography.Title>
              <Input
                defaultValue={dataStaffChange.fullName}
                onBlur={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, fullName: e.target.value };
                  });
                }}
              />
              <Typography.Title level={5}>Điện thoại</Typography.Title>
              <Input
                defaultValue={dataStaffChange.phoneNumber}
                onBlur={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, phoneNumber: e.target.value };
                  });
                }}
              />
              <Typography.Title level={5}>Ngày sinh</Typography.Title>
              <DatePicker
                defaultValue={moment(dataStaffChange.birthYear)}
                style={{ width: "100%" }}
                onBlur={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, birthYear: e.target.value };
                  });
                }}
              />
              <Typography.Title level={5}>Phòng ban</Typography.Title>
              <Select
                defaultValue={dataStaffChange.department}
                style={{
                  width: "100%",
                }}
                onSelect={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, department: e };
                  });
                }}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider
                      style={{
                        margin: "8px 0",
                      }}
                    />
                    <Space
                      style={{
                        padding: "0 8px 4px",
                      }}
                    >
                      <Input
                        placeholder="Please enter item"
                        ref={inputRef}
                        defaultValue={nameDepartment}
                        onChange={onNameDepartmentChange}
                      />
                      <Button
                        type="text"
                        icon={<PlusOutlined />}
                        onClick={addItem}
                      >
                        Add item
                      </Button>
                    </Space>
                  </>
                )}
              >
                {departments.map((item) => (
                  <Option key={item}>{item}</Option>
                ))}
              </Select>
              <Typography.Title level={5}>Cấp bậc</Typography.Title>
              <Select
                defaultValue={dataStaffChange.level}
                onSelect={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, level: e };
                  });
                }}
                style={{
                  width: "100%",
                }}
              >
                <Option value="Fresher">Fresher</Option>
                <Option value="Junior">Junior</Option>
                <Option value="Senior">Senior</Option>
              </Select>
              <Typography.Title level={5}>Mật khẩu</Typography.Title>
              <Input.Password
                defaultValue={defaultPassword || dataStaffChange.password}
                onBlur={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, password: md5(e.target.value) };
                  });
                }}
              />
            </Col>
            {/* cột 2 */}
            <Col xs={24} md={{ span: 6, offset: 2 }}>
              <Typography.Title level={5}>Email</Typography.Title>
              <Input
                defaultValue={dataStaffChange.email}
                onBlur={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, email: e.target.value };
                  });
                }}
              />
              <Typography.Title level={5}>Giới tính</Typography.Title>
              <Select
                defaultValue={dataStaffChange.sex}
                onSelect={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, sex: e };
                  });
                }}
                style={{
                  width: "100%",
                }}
              >
                <Option value="Nam">Nam</Option>
                <Option value="Nữ">Nữ</Option>
                <Option value="Khác">Khác</Option>
              </Select>
              <Typography.Title level={5}>Vị trí</Typography.Title>
              <Select
                defaultValue={dataStaffChange.role}
                onSelect={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, role: e };
                  });
                }}
                style={{
                  width: "100%",
                }}
              >
                <Option value="Lập trình viên">Lập trình viên</Option>
                <Option value="Leader">Leader</Option>
                <Option value="Tester">Tester</Option>
                <Option value="Cộng tác viên">Cộng tác viên</Option>
                <Option value="BA">BA</Option>
                <Option value="Kế toán">Kế toán</Option>
                <Option value="Thực tập sinh">Thực tập sinh</Option>
                <Option value="CEO">CEO</Option>
              </Select>
              <Typography.Title level={5}>Trạng thái</Typography.Title>
              <Select
                defaultValue={dataStaffChange.status}
                onSelect={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, status: e };
                  });
                }}
                style={{
                  width: "100%",
                }}
              >
                <Option value="Nhân viên chính thức">
                  Nhân viên chính thức
                </Option>
                <Option value="Thực tập">Thực tập</Option>
                <Option value="Tạm nghỉ">Tạm nghỉ</Option>
                <Option value="Đã nghỉ">Đã nghỉ</Option>
              </Select>
              <Typography.Title level={5}>Ngày vào làm</Typography.Title>
              <DatePicker
                defaultValue={moment(dataStaffChange.startTL)}
                style={{ width: "100%" }}
                onBlur={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, startTL: e.target.value };
                  });
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col span={16} offset={5}>
              <Row style={{ marginTop: "50px" }} justify="space-between">
                <Col span={6}>
                  <Button
                    style={{ width: "100%" }}
                    onClick={() => {
                      navigate(-1);
                    }}
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
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default CreateStaff;
