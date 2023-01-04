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
  notification,
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
const { Text, Title } = Typography;
const hassedemptypassword = "d41d8cd98f00b204e9800998ecf8427e";

function CreateStaff() {
  const [messageApi, contextHolder] = message.useMessage();
  const defaultPassword = "12345678";
  const navigate = useNavigate();
  const [dataStaffChange, setDataStaffChange] = useState({
    password: md5(defaultPassword),
  });
  console.log("createstaff 45", dataStaffChange);
  const [fileList, setFileList] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  // console.log("edit staff 57", imageUrl);
  //state dùng để thêm department
  const [departments, setDepartments] = useState(["Thanh Hóa", "Hà Nội"]);
  const dateFormat = "DD/MM/YYYY";

  const handleSubmit = async () => {
    if (!dataStaffChange?.fullName) {
      messageApi.open({
        type: "warning",
        content: "Thiếu họ tên",
      });
      return;
    } else if (!dataStaffChange?.email) {
      messageApi.open({
        type: "warning",
        content: "Thiếu email",
      });
      return;
    } else if (dataStaffChange?.password === hassedemptypassword) {
      messageApi.open({
        type: "warning",
        content: "Thiếu password",
      });
      return;
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
          navigate(-1);
        })
        .catch((error) => {
          message.error(error.response.data.message);
        });
    }
    setLoading(false);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Row>
      {contextHolder}
      <Col span={14} offset={5}>
        <Row>
          <Typography.Title level={4}>Thêm nhân viên mới</Typography.Title>
        </Row>
        <Row>
          {/* cột 1 */}
          <Col
            xs={24}
            md={{
              span: 10,
            }}
          >
            <Typography.Title level={5}>Họ và tên</Typography.Title>
            <Input
              defaultValue={dataStaffChange.fullName}
              onChange={(e) => {
                setDataStaffChange((d) => {
                  return { ...d, fullName: e.target.value };
                });
              }}
            />
            <Typography.Title level={5}>Điện thoại</Typography.Title>
            <Input
              defaultValue={dataStaffChange.phoneNumber}
              onChange={(e) => {
                setDataStaffChange((d) => {
                  return { ...d, phoneNumber: e.target.value };
                });
              }}
            />
            <Typography.Title level={5}>Ngày sinh</Typography.Title>
            <DatePicker
              format={dateFormat}
              defaultValue={moment(dataStaffChange.birthYear)}
              style={{ width: "100%" }}
              onChange={(e) => {
                setDataStaffChange((d) => {
                  return { ...d, birthYear: e };
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
              // dropdownRender={(menu) => (
              //   <>
              //     {menu}
              //     <Divider
              //       style={{
              //         margin: "8px 0",
              //       }}
              //     />
              //     <Space
              //       style={{
              //         padding: "0 8px 4px",
              //       }}
              //     >
              //       <Input
              //         placeholder="Thêm phòng ban"
              //         ref={inputRef}
              //         defaultValue={nameDepartment}
              //         onChange={onNameDepartmentChange}
              //       />
              //       <Button
              //         type="text"
              //         icon={<PlusOutlined />}
              //         onClick={addItem}
              //       >
              //         Thêm
              //       </Button>
              //     </Space>
              //   </>
              // )}
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
              onChange={(e) => {
                setDataStaffChange((d) => {
                  return { ...d, password: md5(e.target.value) };
                });
              }}
            />
            <Row style={{ marginTop: "70px" }} justify={"space-between"}>
              <Col span={10}>
                <Button
                  style={{ width: "100%" }}
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  Quay lại
                </Button>
              </Col>
              <Col span={10}>
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  onClick={handleSubmit}
                >
                  Cập nhật
                </Button>
              </Col>
            </Row>
          </Col>
          {/* cột 2 */}
          <Col xs={24} md={{ span: 10, offset: 4 }}>
            <Typography.Title level={5}>Email</Typography.Title>
            <Input
              defaultValue={dataStaffChange.email}
              onChange={(e) => {
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
              <Option value="Nhân viên chính thức">Nhân viên chính thức</Option>
              <Option value="Thực tập">Thực tập</Option>
              <Option value="Tạm nghỉ">Tạm nghỉ</Option>
              <Option value="Đã nghỉ">Đã nghỉ</Option>
            </Select>
            <Typography.Title level={5}>Ngày vào làm</Typography.Title>
            <DatePicker
              format={dateFormat}
              defaultValue={moment(dataStaffChange.startTL)}
              style={{ width: "100%" }}
              onChange={(e) => {
                setDataStaffChange((d) => {
                  return { ...d, startTL: e };
                });
              }}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default CreateStaff;
