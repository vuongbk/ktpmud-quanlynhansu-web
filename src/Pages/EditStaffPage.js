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
  message,
} from "antd";
import { useState, useEffect, useRef } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Divider, Space } from "antd";
import { useLocation, useParams, useNavigate, json } from "react-router-dom";
import moment from "moment";
import Axios from "axios";
import Loading from "../Components/Modal/Loading.js";
// import Upload from "antd/lib/upload/Upload.js";
import { getToken } from "../Components/useToken.js";
import md5 from "md5";
import SkillsOfStaff from "../Components/SkillsOfStaff.js";
import { listRole, TitleModal } from "../utils/index.js";
const { Option } = Select;
const { Text, Title } = Typography;

// const getBase64 = (img, callback) => {
//   console.log("editstaff 23 img", img);
//   const reader = new FileReader();
//   reader.addEventListener("load", () => callback(reader.result));
//   reader.readAsDataURL(img);
// };
// const beforeUpload = (file) => {
//   const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
//   if (!isJpgOrPng) {
//     message.error("You can only upload JPG/PNG file!");
//   }
//   const isLt2M = file.size / 1024 / 1024 < 2;
//   if (!isLt2M) {
//     message.error("Image must smaller than 2MB!");
//   }
//   console.log("editStaff 39", isJpgOrPng && isLt2M);
//   return isJpgOrPng && isLt2M;
// };

function EditPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [dataStaffChange, setDataStaffChange] = useState({});
  const [levelSkillChange, setLevelSkillChange] = useState([]);
  // const [fileList, setFileList] = useState([]);
  const { idStaff } = useParams();
  // const [data, setData] = useState(null);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  // const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    data?.imageUrl ? data?.imageUrl : ""
  );
  //state dùng để thêm department
  const [departments, setDepartments] = useState(["Thanh Hóa", "Hà Nội"]);
  const [isModalPasswordOpen, setIsModalPasswordOpen] = useState(false);
  const [password, setPassword] = useState({});

  const dateFormat = "DD/MM/YYYY";

  const handleOkPasswordModal = async () => {
    if (!password?.newPassword) {
      messageApi.open({
        type: "warning",
        content: "Chưa nhập mật khẩu mới",
      });
      return;
    }
    setLoading(true);
    await Axios.put(
      `/api/password/${data._id}`,
      { newPassword: md5(password.newPassword) },
      {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      }
    )
      .then((res) => {
        setLoading(false);
        message.success("Đặt lại mật khẩu thành công");
        setPassword({});
        setIsModalPasswordOpen(false);
      })
      .catch((error) => {
        message.error(error.response.data.message);
        setLoading(false);
      });
  };
  const handleCancelPasswordModal = () => {
    setIsModalPasswordOpen(false);
  };
  const handleSubmit = async () => {
    if (
      JSON.stringify(dataStaffChange) === JSON.stringify(data) &&
      JSON.stringify(levelSkillChange) === "[]"
      // imageUrl === data.imageUrl
    ) {
      messageApi.open({
        type: "warning",
        content: "Không có thay đổi",
      });
      return;
    } else if (!dataStaffChange?.fullName) {
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
    }
    //thay đổi bảng staff
    if (JSON.stringify(dataStaffChange) !== "{}") {
      setLoading(true);
      await Axios.put(`/api/staff/${data._id}`, dataStaffChange, {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      })
        .then((res) => {
          setDataStaffChange(data);
          setLoading(false);
        })
        .catch((error) => {
          message.error(error.response.data.message);
          setLoading(false);
        });
    }

    //thay đổi bảng levelSkill
    if (JSON.stringify(levelSkillChange) !== "[]") {
      setLoading(true);
      levelSkillChange.forEach(async (value, index) => {
        await Axios.put(
          `/api/level-skill/${value.idLevelSkill}`,
          { levelSkill: value.levelSkill },
          {
            headers: {
              Authorization: "Bearer " + getToken(),
            },
          }
        )
          .then((res) => {
            setLevelSkillChange([]);
          })
          .catch((error) => {
            message.error(error.response.data.message);
          });
      });
      setLoading(false);
    }
    //upload image
    // if (imageUrl !== data.imageUrl) {
    //   let formData = new FormData();
    //   formData.append("file", fileList.pop().originFileObj);
    //   formData.append("idStaff", data._id);

    //   await Axios.post("api/image", formData, {
    //     headers: {
    //       Authorization: "Bearer " + getToken(),
    //     },
    //   })
    //     .then((res) => {
    //       console.log("edit 237 res", res);
    //     })
    //     .catch((err) => {
    //       console.log("edit 240 err", err);
    //     });
    // }
  };

  const handleDelete = async () => {
    setLoading(true);
    await Axios.delete(`/api/staff/${data._id}`, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        navigate(-1);
        setLoading(false);
      })
      .catch((error) => {
        message.error(error.response.data.message);
        setLoading(false);
      });
  };
  //vẫn đang dùng cho upload ảnh
  // const uploadButton = (
  //   <div>
  //     {loadingAvatar ? <LoadingOutlined /> : <PlusOutlined />}
  //     <div
  //       style={{
  //         marginTop: 8,
  //       }}
  //     >
  //       Upload
  //     </div>
  //   </div>
  // );

  //dùng cho component Upload
  // const handleChange = (info) => {
  //   console.log("editStaff 198", info);
  //   setFileList(info.fileList);
  //   if (info.file.status === "uploading") {
  //     setLoadingAvatar(true);
  //     return;
  //   }
  //   //đoạn này ko kiểm tra dk error thì ko thể hiển thị ảnh ra luôn được
  //   // || info.file.status === "error"
  //   if (info.file.status === "done") {
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj, (url) => {
  //       setLoadingAvatar(false);
  //       setImageUrl(url);
  //     });
  //   } else if (info.file.status === "error") {
  //     console.log("editStaffPage 214 loi");
  //   }
  // };

  //lấy data Staff từ api
  async function getStaff() {
    console.log("editstaff 237", data);
    setLoading(true);
    await Axios.get(`/api/staff/${idStaff}`, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        setLoading(false);
        setData(res.data.infoStaff);
        setDataStaffChange(res.data.infoStaff);
        setImageUrl(res.data.infoStaff.imageUrl);
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.response.data.message);
      });
  }
  useEffect(() => {
    getStaff();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Row>
        {contextHolder}
        <Col span={14} offset={5}>
          <Row>
            <Col span={24}>
              <Row>
                <Title level={3}>
                  {dataStaffChange.fullName || data?.fullName}
                </Title>
              </Row>
              <Divider orientation="left" orientationMargin={0}>
                <Title level={4}>Thông tin cơ bản</Title>
              </Divider>
              {/* upload đang lỗi, tạm thời comment để deploy */}
              {/* <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? (
                  <img
                    src={`../${imageUrl}`}
                    alt="avatar"
                    style={{
                      width: "100%",
                    }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload> */}
              <Row>
                <Button
                  type="primary"
                  onClick={() => setIsModalPasswordOpen(true)}
                >
                  Đặt lại mật khẩu
                </Button>
                <Modal
                  open={isModalPasswordOpen}
                  title={<TitleModal value="Đặt lại mật khẩu" />}
                  onOk={handleOkPasswordModal}
                  onCancel={handleCancelPasswordModal}
                  footer={[
                    <Button key="back" onClick={handleCancelPasswordModal}>
                      Hủy
                    </Button>,
                    <Button
                      key="submit"
                      type="primary"
                      loading={loading}
                      onClick={handleOkPasswordModal}
                    >
                      Đặt lại
                    </Button>,
                  ]}
                >
                  {/* <Text>Mật khẩu mới</Text> */}
                  <Input.Password
                    style={{ marginTop: "20px" }}
                    placeholder="Mật khẩu mới"
                    defaultValue={password?.newPassword}
                    onChange={(e) =>
                      setPassword((p) => {
                        return {
                          ...p,
                          newPassword: e.target.value,
                        };
                      })
                    }
                  />
                </Modal>
              </Row>
            </Col>
          </Row>
          <Row>
            {/* cột 1 */}
            <Col
              xs={24}
              md={{
                span: 10,
              }}
            >
              <Title level={5}>Họ và tên</Title>
              <Input
                defaultValue={dataStaffChange.fullName || data?.fullName}
                onChange={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, fullName: e.target.value };
                  });
                }}
              />
              <Title level={5}>Điện thoại</Title>
              <Input
                defaultValue={dataStaffChange.phoneNumber || data?.phoneNumber}
                onChange={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, phoneNumber: e.target.value };
                  });
                }}
              />
              <Title level={5}>Ngày sinh</Title>
              <DatePicker
                format={dateFormat}
                defaultValue={moment(dataStaffChange?.birthYear || undefined)}
                style={{ width: "100%" }}
                onChange={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, birthYear: e };
                  });
                }}
              />
              <Title level={5}>Phòng ban</Title>
              <Select
                defaultValue={dataStaffChange.department || data?.department}
                style={{
                  width: "100%",
                }}
                onSelect={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, department: e };
                  });
                }}
              >
                {departments.map((item) => (
                  <Option key={item}>{item}</Option>
                ))}
              </Select>
              <Title level={5}>Cấp bậc</Title>
              <Select
                defaultValue={dataStaffChange.level || data?.level}
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
            </Col>
            {/* cột 2 */}
            <Col xs={24} md={{ span: 10, offset: 4 }}>
              <Title level={5}>Email</Title>
              <Input
                defaultValue={dataStaffChange.email || data?.email}
                onChange={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, email: e.target.value };
                  });
                }}
              />
              <Title level={5}>Giới tính</Title>
              <Select
                defaultValue={dataStaffChange.sex || data?.sex}
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
              <Title level={5}>Vị trí</Title>
              <Select
                defaultValue={dataStaffChange.role || data?.role}
                onSelect={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, role: e };
                  });
                }}
                style={{
                  width: "100%",
                }}
              >
                {/* <Option value="Lập trình viên">Lập trình viên</Option>
                <Option value="Leader">Leader</Option>
                <Option value="Tester">Tester</Option>
                <Option value="Cộng tác viên">Cộng tác viên</Option>
                <Option value="BA">BA</Option>
                <Option value="Kế toán">Kế toán</Option>
                <Option value="Thực tập sinh">Thực tập sinh</Option>
                <Option value="CEO">CEO</Option> */}
                {listRole.map((value, index) => {
                  return <Option value={value}>{value}</Option>;
                })}
              </Select>
              <Title level={5}>Trạng thái</Title>
              <Select
                defaultValue={dataStaffChange.status || data?.status}
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
              <Title level={5}>Ngày vào làm</Title>
              <DatePicker
                format={dateFormat}
                defaultValue={moment(dataStaffChange.startTL || undefined)}
                style={{ width: "100%" }}
                onChange={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, startTL: e };
                  });
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <SkillsOfStaff
                infoStaff={data}
                setLevelSkillChange={setLevelSkillChange}
                levelSkillChange={levelSkillChange}
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
              <Row style={{ marginTop: "80px" }} justify="space-between">
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
                  <Row>
                    <Button
                      type="primary"
                      style={{ width: "100%" }}
                      onClick={handleSubmit}
                    >
                      Cập nhật
                    </Button>
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
                        Xóa nhân viên
                      </Button>
                    </Popconfirm>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default EditPage;
