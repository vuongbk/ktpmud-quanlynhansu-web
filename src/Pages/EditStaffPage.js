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
  //state d??ng ????? th??m department
  const [departments, setDepartments] = useState(["Thanh H??a", "H?? N???i"]);
  const [isModalPasswordOpen, setIsModalPasswordOpen] = useState(false);
  const [password, setPassword] = useState({});
  const dateFormat = "DD/MM/YYYY";

  const handleOkPasswordModal = async () => {
    if (!password?.newPassword) {
      messageApi.open({
        type: "warning",
        content: "Ch??a nh???p m???t kh???u m???i",
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
        message.success("?????t l???i m???t kh???u th??nh c??ng");
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
        content: "Kh??ng c?? thay ?????i",
      });
      return;
    } else if (!dataStaffChange?.fullName) {
      messageApi.open({
        type: "warning",
        content: "Thi???u h??? t??n",
      });
      return;
    } else if (!dataStaffChange?.email) {
      messageApi.open({
        type: "warning",
        content: "Thi???u email",
      });
      return;
    }
    //thay ?????i b???ng staff
    if (JSON.stringify(dataStaffChange) !== "{}") {
      setLoading(true);
      await Axios.put(`/api/staff/${data._id}`, dataStaffChange, {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      })
        .then((res) => {
          message.success("C???p nh???t th??nh c??ng");
          setDataStaffChange(data);
          setLoading(false);
        })
        .catch((error) => {
          console.log("138", error);
          message.error(error.response.data.message);
          setLoading(false);
        });
    }

    //thay ?????i b???ng levelSkill
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
            message.success("C???p nh???t th??nh c??ng");
            setLevelSkillChange([]);
          })
          .catch((error) => {
            message.error(error.response.data.message);
          });
      });
      setLoading(false);
    }
    navigate(0);
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
  //v???n ??ang d??ng cho upload ???nh
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

  //d??ng cho component Upload
  // const handleChange = (info) => {
  //   console.log("editStaff 198", info);
  //   setFileList(info.fileList);
  //   if (info.file.status === "uploading") {
  //     setLoadingAvatar(true);
  //     return;
  //   }
  //   //??o???n n??y ko ki???m tra dk error th?? ko th??? hi???n th??? ???nh ra lu??n ???????c
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

  //l???y data Staff t??? api
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
                <Title level={4}>Th??ng tin c?? b???n</Title>
              </Divider>
              {/* upload ??ang l???i, t???m th???i comment ????? deploy */}
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
                  ?????t l???i m???t kh???u
                </Button>
                <Modal
                  open={isModalPasswordOpen}
                  title={<TitleModal value="?????t l???i m???t kh???u" />}
                  onOk={handleOkPasswordModal}
                  onCancel={handleCancelPasswordModal}
                  footer={[
                    <Button key="back" onClick={handleCancelPasswordModal}>
                      H???y
                    </Button>,
                    <Button
                      key="submit"
                      type="primary"
                      loading={loading}
                      onClick={handleOkPasswordModal}
                    >
                      ?????t l???i
                    </Button>,
                  ]}
                >
                  {/* <Text>M???t kh???u m???i</Text> */}
                  <Input.Password
                    style={{ marginTop: "20px" }}
                    placeholder="M???t kh???u m???i"
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
            {/* c???t 1 */}
            <Col
              xs={24}
              md={{
                span: 10,
              }}
            >
              <Title level={5}>H??? v?? t??n</Title>
              <Input
                defaultValue={dataStaffChange.fullName || data?.fullName}
                onChange={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, fullName: e.target.value };
                  });
                }}
              />
              <Title level={5}>??i???n tho???i</Title>
              <Input
                defaultValue={dataStaffChange.phoneNumber || data?.phoneNumber}
                onChange={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, phoneNumber: e.target.value };
                  });
                }}
              />
              <Title level={5}>Ng??y sinh</Title>
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
              <Title level={5}>Ph??ng ban</Title>
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
              <Title level={5}>C???p b???c</Title>
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
            {/* c???t 2 */}
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
              <Title level={5}>Gi???i t??nh</Title>
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
                <Option value="N???">N???</Option>
                <Option value="Kh??c">Kh??c</Option>
              </Select>
              <Title level={5}>V??? tr??</Title>
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
                {/* <Option value="L???p tr??nh vi??n">L???p tr??nh vi??n</Option>
                <Option value="Leader">Leader</Option>
                <Option value="Tester">Tester</Option>
                <Option value="C???ng t??c vi??n">C???ng t??c vi??n</Option>
                <Option value="BA">BA</Option>
                <Option value="K??? to??n">K??? to??n</Option>
                <Option value="Th???c t???p sinh">Th???c t???p sinh</Option>
                <Option value="CEO">CEO</Option> */}
                {listRole.map((value, index) => {
                  return <Option value={value}>{value}</Option>;
                })}
              </Select>
              <Title level={5}>Tr???ng th??i</Title>
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
                <Option value="Nh??n vi??n ch??nh th???c">
                  Nh??n vi??n ch??nh th???c
                </Option>
                <Option value="Th???c t???p">Th???c t???p</Option>
                <Option value="T???m ngh???">T???m ngh???</Option>
                <Option value="???? ngh???">???? ngh???</Option>
              </Select>
              <Title level={5}>Ng??y v??o l??m</Title>
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
                    Quay l???i
                  </Button>
                </Col>
                <Col span={10}>
                  <Row>
                    <Button
                      type="primary"
                      style={{ width: "100%" }}
                      onClick={handleSubmit}
                    >
                      C???p nh???t
                    </Button>
                  </Row>
                  <Row>
                    <Popconfirm
                      title="B???n c?? ch???c mu???n x??a nh??n vi??n???"
                      cancelText="H???y"
                      okText="X??a"
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
                        X??a nh??n vi??n
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
