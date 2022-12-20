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
  const navigate = useNavigate();
  const [dataStaffChange, setDataStaffChange] = useState({});
  const [levelSkillChange, setLevelSkillChange] = useState([]);
  // const [fileList, setFileList] = useState([]);
  const [error, setError] = useState();
  const { idStaff } = useParams();
  // const [data, setData] = useState(null);
  const [data, setData] = useState(useLocation()?.state?.data);
  const [loading, setLoading] = useState(false);
  // const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    data?.imageUrl ? data?.imageUrl : ""
  );
  //state dùng để thêm department
  const [departments, setDepartments] = useState(["Thanh Hóa", "Hà Nội"]);
  const [nameDepartment, setNameDepartment] = useState("");
  const inputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalPasswordOpen, setIsModalPasswordOpen] = useState(false);
  const [password, setPassword] = useState({});

  const dateFormat = "DD/MM/YYYY";

  const handleOkPasswordModal = async () => {
    if (!password.hasOwnProperty("newPassword")) {
      notification.open({
        message: <Title level={4}>Thông báo</Title>,
        description: "Nhập thiếu",
        duration: 2,
        placement: "top",
      });
      return;
    }
    setLoading(true);
    await Axios.put(`/api/staff/${data._id}`, password, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        console.log("editStaff 106", res);
        setPassword({});
        setLoading(false);
      })
      .catch((error) => {
        setError(error.response.data);
        console.log("editStaff 111", error);
        setIsModalOpen(true);
        setLoading(false);
      });
    setIsModalPasswordOpen(false);
  };
  const handleCancelPasswordModal = () => {
    setIsModalPasswordOpen(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  function getDefaultLevelSkillValue(nameSkill) {
    return levelSkillChange.find((value) => value.nameSkill === nameSkill);
  }
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
      JSON.stringify(levelSkillChange) === "[]" &&
      imageUrl === data.imageUrl
    ) {
      notification.open({
        message: <Title level={4}>Thông báo</Title>,
        description: "Không có thay đổi",
        duration: 2,
        placement: "top",
      });
      return;
    }
    console.log("editStaff 97", imageUrl === data.imageUrl);
    console.log("editStaff 97", JSON.stringify(dataStaffChange) === "{}");
    console.log("editStaff 97", JSON.stringify(levelSkillChange) === "[]");
    //thay đổi bảng staff
    if (JSON.stringify(dataStaffChange) !== "{}") {
      setLoading(true);
      await Axios.put(`/api/staff/${data._id}`, dataStaffChange, {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      })
        .then((res) => {
          console.log("editStaff 106", res);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.response.data);
          console.log("editStaff 111", error);
          setIsModalOpen(true);
          setLoading(false);
        });
    }

    //thay đổi bảng levelSkill
    if (JSON.stringify(levelSkillChange) !== "[]") {
      levelSkillChange.forEach(async (value, index) => {
        setLoading(true);
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
            console.log("editStaff 131", res);
            setLoading(false);
          })
          .catch((error) => {
            setError(error.response.data);
            console.log("editStaff 136", error);
            setIsModalOpen(true);
            setLoading(false);
          });
      });
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
    navigate(-1);
  };

  const handleDelete = async () => {
    setLoading(true);
    await Axios.delete(`/api/staff/${data._id}`, {
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
        setImageUrl(res.data.infoStaff.imageUrl);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error getStaff", error);
      });
  }
  useEffect(() => {
    if (!data) {
      getStaff();
    }
  }, [data]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Row>
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
                  title="Đặt lại mật khẩu"
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
                    onChange={(e) =>
                      setPassword((p) => {
                        return {
                          ...p,
                          newPassword: md5(e.target.value),
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
                defaultValue={moment(
                  dataStaffChange.birthYear || data?.birthYear
                )}
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
                <Option value="Lập trình viên">Lập trình viên</Option>
                <Option value="Leader">Leader</Option>
                <Option value="Tester">Tester</Option>
                <Option value="Cộng tác viên">Cộng tác viên</Option>
                <Option value="BA">BA</Option>
                <Option value="Kế toán">Kế toán</Option>
                <Option value="Thực tập sinh">Thực tập sinh</Option>
                <Option value="CEO">CEO</Option>
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
                defaultValue={moment(dataStaffChange.startTL || data?.startTL)}
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
              <Row style={{ marginTop: "50px" }} justify="space-between">
                <Col span={5}>
                  <Button
                    style={{ width: "100%" }}
                    onClick={() => {
                      navigate(-1);
                    }}
                  >
                    Quay lại
                  </Button>
                </Col>
                <Col span={5} offset={14}>
                  <Row>
                    <Button
                      type="primary"
                      style={{ width: "100%" }}
                      onClick={handleSubmit}
                    >
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
                  </Row>
                  <Row>
                    <Popconfirm
                      title="Bạn có chắc muốn xóa nhân viên？"
                      cancelText="Hủy"
                      okText="Xóa"
                      okButtonProps={{ type: "danger" }}
                      onConfirm={handleDelete}
                    >
                      <Button style={{ width: "100%" }} type="link" danger>
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
