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
} from "antd";
import { useState, useEffect, useRef } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Divider, Space } from "antd";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import Axios from "axios";
import Loading from "../Components/Modal/Loading.js";
// import Upload from "antd/lib/upload/Upload.js";
import { getToken } from "../Components/useToken.js";
import md5 from "md5";
const { Option } = Select;
// const { Text, Title } = Typography;

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
  console.log("editStaffPage 47", dataStaffChange);
  const [levelSkillChange, setLevelSkillChange] = useState([]);
  // const [fileList, setFileList] = useState([]);
  const [error, setError] = useState();
  const { idStaff } = useParams();
  // const [data, setData] = useState(null);
  const [data, setData] = useState(useLocation()?.state?.data);
  const [skillsOfStaff, setSkillsOfStaff] = useState([]);
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
  const [isModalSkillOpen, setIsModalSkillOpen] = useState(false);
  const [password, setPassword] = useState({});
  const [newSkill, setNewSkill] = useState({});
  const [skills, setSkills] = useState();
  let options = skills ? getOptions() : [];
  function getOptions() {
    return skills.map((value, index) => {
      return {
        value: value._id,
        label: value.skillName,
      };
    });
  }
  const handleOkSkillModal = async () => {
    setLoading(true);
    await Axios({
      method: "post",
      url: "/api/level-skill",
      data: { ...newSkill, idStaff: idStaff },
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        console.log("editStaff 91", res);
        setLoading(false);
      })
      .catch((error) => {
        console.log("editStaff 94", error);
        setLoading(false);
      });
    setIsModalSkillOpen(false);
    navigate(0);
  };
  const handleCancelSkillModal = () => {
    setIsModalSkillOpen(false);
  };
  const handleOkPasswordModal = async () => {
    if (!password.hasOwnProperty("newPassword")) {
      window.alert("Nhập thiếu");
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
      window.alert("ko co thay doi");
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
  async function getLevelSkillAndIdSkill() {
    await Axios(`/api/level-skill/${data?._id}`, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        setSkillsOfStaff(res.data.skill);
      })
      .catch((error) => {
        console.log("error.config", error.config);
      });
  }
  function getSkills() {
    Axios({
      method: "get",
      url: "/api/skill",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        console.log("editstaff 319", res.data.skill);
        setSkills(res.data.skill);
      })
      .catch((error) => {
        console.log("editStaff 322", error);
      });
  }
  useEffect(() => {
    if (!data) {
      getStaff();
    }
    if (data) {
      getLevelSkillAndIdSkill();
    }
    if (!skills) {
      getSkills();
    }
  }, [data]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Row>
        <Col span={24}>
          <Row>
            <Col span={20} offset={5}>
              <Typography.Title level={3}>
                {dataStaffChange.fullName || data?.fullName}
              </Typography.Title>
              <Typography.Title level={4}>Thông tin cơ bản</Typography.Title>
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
                defaultValue={dataStaffChange.fullName || data?.fullName}
                onChange={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, fullName: e.target.value };
                  });
                }}
              />
              <Typography.Title level={5}>Điện thoại</Typography.Title>
              <Input
                defaultValue={dataStaffChange.phoneNumber || data?.phoneNumber}
                onChange={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, phoneNumber: e.target.value };
                  });
                }}
              />
              <Typography.Title level={5}>Ngày sinh</Typography.Title>
              <DatePicker
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
              <Typography.Title level={5}>Phòng ban</Typography.Title>
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
              <Typography.Title level={5}>Cấp bậc</Typography.Title>
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
            <Col xs={24} md={{ span: 6, offset: 2 }}>
              <Typography.Title level={5}>Email</Typography.Title>
              <Input
                defaultValue={dataStaffChange.email || data?.email}
                onChange={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, email: e.target.value };
                  });
                }}
              />
              <Typography.Title level={5}>Giới tính</Typography.Title>
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
              <Typography.Title level={5}>Vị trí</Typography.Title>
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
              <Typography.Title level={5}>Trạng thái</Typography.Title>
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
              <Typography.Title level={5}>Ngày vào làm</Typography.Title>
              <DatePicker
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
            <Col span={16} offset={5}>
              <Typography.Title level={4}>Kinh nghiệm</Typography.Title>
              <Button type="primary" onClick={() => setIsModalSkillOpen(true)}>
                Thêm skill
              </Button>
              <Modal
                open={isModalSkillOpen}
                title="Thêm skill mới"
                onOk={handleOkSkillModal}
                onCancel={handleCancelSkillModal}
                footer={[
                  <Button key="back" onClick={handleCancelSkillModal}>
                    Hủy
                  </Button>,
                  <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={handleOkSkillModal}
                  >
                    Thêm skill
                  </Button>,
                ]}
              >
                {/* <Text>Thêm levelSkill mới</Text> */}
                <Select
                  labelInValue
                  defaultValue={data?.nameLeader}
                  onChange={(e) => {
                    console.log("createProject 230", e);
                    setNewSkill((d) => {
                      return { ...d, idSkill: e.value };
                    });
                  }}
                  style={{
                    width: "100%",
                  }}
                  options={options}
                ></Select>
                <Select
                  onSelect={(e) => {
                    setNewSkill((d) => {
                      return { ...d, level: e };
                    });
                  }}
                >
                  <Option value={0}>0</Option>
                  <Option value={1}>1</Option>
                  <Option value={2}>2</Option>
                  <Option value={3}>3</Option>
                  <Option value={4}>4</Option>
                  <Option value={5}>5</Option>
                </Select>
              </Modal>
              <Row>
                {skillsOfStaff &&
                  typeof skillsOfStaff[0] === "object" &&
                  skillsOfStaff.map((value, index) => {
                    return (
                      <Col xs={24} sm={12} lg={6} key={index}>
                        <Typography.Title level={5}>
                          {value.nameSkill}
                        </Typography.Title>
                        <Select
                          defaultValue={
                            getDefaultLevelSkillValue(value.nameSkill)
                              ?.levelSkill || value.levelSkill
                          }
                          onSelect={(e) => {
                            setLevelSkillChange((d) => {
                              //Lọc skill đã change trước đó ra, để không bị trùng khi chỉnh sửa 1 skill nhiều lần
                              d = d.filter((dValue) => {
                                return (
                                  dValue.idLevelSkill !== value.idLevelSkill
                                );
                              });
                              return [...d, { ...value, levelSkill: e }];
                            });
                          }}
                        >
                          <Option value={0}>0</Option>
                          <Option value={1}>1</Option>
                          <Option value={2}>2</Option>
                          <Option value={3}>3</Option>
                          <Option value={4}>4</Option>
                          <Option value={5}>5</Option>
                        </Select>
                      </Col>
                    );
                  })}
              </Row>
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
}

export default EditPage;
