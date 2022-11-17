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
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Divider, Space } from "antd";
import { Link, useLocation, useParams } from "react-router-dom";
import moment from "moment";
import Axios from "axios";
import Loading from "../Components/Modal/Loading.js";
import Upload from "antd/lib/upload/Upload.js";
import { getToken } from "../Components/useToken.js";
const { Option } = Select;

const getBase64 = (img, callback) => {
  console.log("editstaff 23 img", img);
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

function EditPage() {
  const [dataStaffChange, setDataStaffChange] = useState({});
  const [levelSkillChange, setLevelSkillChange] = useState([]);
  const [fileList, setFileList] = useState([]);
  const { idStaff } = useParams();
  // const [data, setData] = useState(null);
  const [data, setData] = useState(useLocation()?.state?.data);
  const [skill, setSkill] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  let [idSkill, setIdSkill] = useState();
  const [imageUrl, setImageUrl] = useState(
    data?.imageUrl ? data?.imageUrl : ""
  );
  console.log("edit staff 57", imageUrl);
  //state dùng để thêm department
  const [departments, setDepartments] = useState(["Thanh Hóa", "Hà Nội"]);
  const [nameDepartment, setNameDepartment] = useState("");

  const inputRef = useRef(null);

  async function getLevelSkillAndIdSkill() {
    setLoading(true);
    await Axios(`/api/level-skill/${data?._id}`, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        setIdSkill(
          res.data.levelSkill.reduce((result, value, index) => {
            return { ...result, [`id${index}`]: value.idSkill };
          }, {})
        );
        setSkill(
          res.data.levelSkill.map((value) => {
            return { idLevelSkill: value._id, levelSkill: value.level };
          })
        );
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  async function getNameSkill(idSkill) {
    await Axios.post("/api/skills", idSkill, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then(async (res) => {
        let skillNameArray = res.data.skill.map((value) => value.skillName);

        setSkill((s) => {
          let skill = s.map((value, index) => {
            return { ...value, nameSkill: skillNameArray[index] };
          });
          return skill;
        });
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
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

    //thay đổi bảng staff
    if (JSON.stringify(dataStaffChange) !== "{}") {
      setLoading(true);
      await Axios.put(`/api/staff/${data._id}`, dataStaffChange, {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      });
      setLoading(false);
    }

    //thay đổi bảng skill
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
        );
        setLoading(false);
      });
    }

    //upload image
    if (imageUrl !== data.imageUrl) {
      let formData = new FormData();
      formData.append("file", fileList.pop().originFileObj);
      formData.append("idStaff", data._id);

      await Axios.post("api/image", formData, {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      })
        .then((res) => {
          console.log("edit 237 res", res);
        })
        .catch((err) => {
          console.log("edit 240 err", err);
        });
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    await Axios.delete(`/api/staff/${data._id}`, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    });
    setLoading(false);
  };

  const uploadButton = (
    <div>
      {loadingAvatar ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  //dùng cho component Upload
  const handleChange = (info) => {
    setFileList(info.fileList);
    if (info.file.status === "uploading") {
      setLoadingAvatar(true);
      return;
    }
    //đoạn này ko kiểm tra dk error thì ko thể hiển thị ảnh ra luôn được
    if (info.file.status === "done" || info.file.status === "error") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoadingAvatar(false);
        setImageUrl(url);
      });
    }
  };

  //lấy data Staff từ api
  // async function getStaff() {
  //   console.log("editstaff 237", data);
  //   setLoading(true);
  //   await Axios.get(`/api/staff/${idStaff}`, {
  //     headers: {
  //       Authorization: "Bearer " + getToken(),
  //     },
  //   })
  //     .then((res) => {
  //       setLoading(false);
  //       setData(res.data.infoStaff);
  //       setImageUrl(res.data.infoStaff.imageUrl);
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //       console.log("error getStaff", error);
  //     });
  // }
  // useEffect(() => {
  //   if (!data) {
  //     getStaff();
  //   }
  // }, []);

  //Lấy arraySkill của staff đc click
  useEffect(() => {
    if (!idSkill) {
      getLevelSkillAndIdSkill();
    }
    if (idSkill instanceof Object) {
      getNameSkill(idSkill);
    }
  }, [idSkill]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Row>
        <Col span={24}>
          <Row>
            <Col span={20} offset={5}>
              <Typography.Title level={3}>{data?.fullName}</Typography.Title>
              <Typography.Title level={4}>Thông tin cơ bản</Typography.Title>
              <Upload
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
              </Upload>
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
                defaultValue={data?.fullName}
                onBlur={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, fullName: e.target.value };
                  });
                }}
              />
              <Typography.Title level={5}>Điện thoại</Typography.Title>
              <Input
                defaultValue={data?.phoneNumber}
                onBlur={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, phoneNumber: e.target.value };
                  });
                }}
              />
              <Typography.Title level={5}>Ngày sinh</Typography.Title>
              <DatePicker
                defaultValue={moment(data?.birthYear)}
                style={{ width: "100%" }}
                onBlur={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, birthYear: e.target.value };
                  });
                }}
              />
              <Typography.Title level={5}>Phòng ban</Typography.Title>
              <Select
                defaultValue={data?.department}
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
                defaultValue={data?.level}
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
                defaultValue={data?.email}
                onBlur={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, email: e.target.value };
                  });
                }}
              />
              <Typography.Title level={5}>Giới tính</Typography.Title>
              <Select
                defaultValue={data?.sex}
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
                defaultValue={data?.role}
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
                defaultValue={data?.status}
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
                defaultValue={
                  moment(dataStaffChange.startTL) || moment(data?.startTL)
                }
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
              <Typography.Title level={4}>Kinh nghiệm</Typography.Title>
              <Row>
                {skill &&
                  typeof skill[0] === "object" &&
                  skill.map((value, index) => {
                    return (
                      <Col xs={24} sm={12} lg={6} key={index}>
                        <Typography.Title level={5}>
                          {value.nameSkill}
                        </Typography.Title>
                        <Select
                          defaultValue={value.levelSkill}
                          onSelect={(e) => {
                            setLevelSkillChange((d) => {
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
                  <Button style={{ width: "100%" }}>
                    <Link to="/staff">Quay lại</Link>
                  </Button>
                </Col>
                <Col span={6} offset={5}>
                  <Button style={{ width: "100%" }} onClick={handleSubmit}>
                    Cập nhật
                  </Button>
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
