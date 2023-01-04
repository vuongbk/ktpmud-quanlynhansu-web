import {
  Button,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Typography,
  Modal,
  notification,
  Divider,
  message,
} from "antd";
import { useState, useEffect } from "react";
import moment from "moment";
import Axios from "axios";
import Loading from "../Components/Modal/Loading.js";
// import Upload from "antd/lib/upload/Upload.js";
import { getToken } from "../Components/useToken.js";
import md5 from "md5";
import Link from "antd/lib/typography/Link.js";
import SkillsOfStaff from "../Components/SkillsOfStaff.js";
import { useNavigate } from "react-router-dom";
import { ControlOutlined } from "@ant-design/icons";
const { Option } = Select;
const { Title, Text } = Typography;

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

// Không hiểu tại sao cái trang infoAccount lại lỗi phần lấy data từ api, lấy đc data rồi, nhưng sao nó ko hiển thị
// thông tin cho vào Text thì được, Vào Input thì ko?
function Account() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [infoAccount, setInfoAccount] = useState();
  const [levelSkillChange, setLevelSkillChange] = useState([]);
  const [dataStaffChange, setDataStaffChange] = useState({});
  // const [fileList, setFileList] = useState([]);
  const [notify, setNotify] = useState();
  const [loading, setLoading] = useState(false);
  // const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [isModalPasswordOpen, setIsModalPasswordOpen] = useState(false);
  const [password, setPassword] = useState({});
  const dateFormat = "DD/MM/YYYY";

  async function getInfoAccount() {
    await Axios({
      method: "get",
      url: "../api/staff?infoAccount=true",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        setInfoAccount(res.data);
        setDataStaffChange(res.data);
      })
      .catch((error) => {
        console.log("App 39 error", error);
      });
  }
  const handleOkPasswordModal = async () => {
    if (!password?.oldPassword || !password?.newPassword) {
      messageApi.open({
        type: "warning",
        content: "Nhập thiếu",
      });
      return;
    }
    setLoading(true);
    await Axios.put(`/api/staff/${infoAccount?._id}`, password, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        message.success("Đổi mk thành công");
        setLoading(false);
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
      JSON.stringify(dataStaffChange) === JSON.stringify(infoAccount) &&
      JSON.stringify(levelSkillChange) === "[]" &&
      imageUrl === infoAccount?.imageUrl
    ) {
      messageApi.open({
        type: "warning",
        content: "Không có thay đổi",
      });
      return;
    }

    //thay đổi bảng staff
    if (JSON.stringify(dataStaffChange) !== JSON.stringify(infoAccount)) {
      setLoading(true);
      await Axios.put(`/api/staff/${infoAccount?._id}`, dataStaffChange, {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      })
        .then((res) => {
          console.log("editStaff 106", res);
          setLoading(false);
        })
        .catch((error) => {
          console.log("editStaff 111", error);
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
            console.log("editStaff 136", error);
            setLoading(false);
          });
      });
    }

    //upload image
    // if (imageUrl !== infoAccount?.imageUrl) {
    //   let formData = new FormData();
    //   formData.append("file", fileList.pop().originFileObj);
    //   formData.append("idStaff", infoAccount?._id);

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

  // //dùng cho component Upload
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
  //     console.log("Account 214 loi");
  //   }
  // };
  useEffect(() => {
    getInfoAccount();
  }, []);
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {contextHolder}
      <Row>
        <Col span={14} offset={5}>
          <Row>
            <Col span={24}>
              <Typography.Title level={3}>
                {dataStaffChange?.fullName || infoAccount?.fullName}
              </Typography.Title>
              <Typography.Title level={4}>Thông tin cơ bản</Typography.Title>
              {/* phần upload ảnh đang lỗi, tạm thời comment để deploy */}
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
                Đổi mật khẩu
              </Button>
              <Modal
                open={isModalPasswordOpen}
                title="Đổi mật khẩu"
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
                    Đổi MK
                  </Button>,
                ]}
              >
                {/* <Text>Mật khẩu cũ</Text> */}
                <Input.Password
                  placeholder="Mật khẩu cũ"
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      setPassword((p) => {
                        return {
                          ...p,
                          oldPassword: md5(e.target.value),
                        };
                      });
                    } else {
                      setPassword((p) => {
                        return {
                          ...p,
                          oldPassword: "",
                        };
                      });
                    }
                  }}
                />
                {/* <Text>Mật khẩu mới</Text> */}
                <Input.Password
                  style={{ marginTop: "20px" }}
                  placeholder="Mật khẩu mới"
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      setPassword((p) => {
                        return {
                          ...p,
                          newPassword: md5(e.target.value),
                        };
                      });
                    } else {
                      setPassword((p) => {
                        return {
                          ...p,
                          newPassword: "",
                        };
                      });
                    }
                  }}
                />
              </Modal>
              <Divider></Divider>
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
              <Typography.Title level={5}>Họ và tên</Typography.Title>
              <Input
                value={dataStaffChange?.fullName}
                onChange={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, fullName: e.target.value };
                  });
                }}
              />
              <Typography.Title level={5}>Điện thoại</Typography.Title>
              <Input
                value={dataStaffChange?.phoneNumber}
                onChange={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, phoneNumber: e.target.value };
                  });
                }}
              />
              <Typography.Title level={5}>Ngày sinh</Typography.Title>
              <DatePicker
                value={moment(dataStaffChange?.birthYear)}
                style={{ width: "100%" }}
                onChange={(date, dateString) => {
                  setDataStaffChange((d) => {
                    return { ...d, birthYear: dateString };
                  });
                }}
              />
              <Typography.Title level={5}>Phòng ban</Typography.Title>

              <Input value={infoAccount?.department} disabled />
              <Typography.Title level={5}>Cấp bậc</Typography.Title>

              <Input value={infoAccount?.role} disabled />
            </Col>
            {/* cột 2 */}
            <Col xs={24} md={{ span: 10, offset: 4 }}>
              <Typography.Title level={5}>Email</Typography.Title>
              {/* <Text>{dataStaffChange?.email || infoAccount?.email}</Text> */}
              <Input
                value={dataStaffChange?.email || infoAccount?.email}
                onChange={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, email: e.target.value };
                  });
                }}
              />
              <Typography.Title level={5}>Giới tính</Typography.Title>
              {/* <Text>{dataStaffChange?.sex || infoAccount?.sex}</Text> */}
              <Select
                value={dataStaffChange?.sex || infoAccount?.sex}
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
              <Input value={infoAccount?.level} disabled />
              <Typography.Title level={5}>Trạng thái</Typography.Title>
              <Input value={infoAccount?.status} disabled />
              <Typography.Title level={5}>Ngày vào làm</Typography.Title>
              <Input
                value={moment(infoAccount?.startTL).format(dateFormat)}
                disabled
              />
            </Col>
          </Row>
          {/* <Row>
            <Col span={16} offset={5}>
              <Row style={{ marginTop: "50px" }} justify="space-between">
                <Col span={6}></Col>
                <Col span={6} offset={5}>
                  <Button style={{ width: "100%" }} onClick={handleSubmit}>
                    Cập nhật
                  </Button>
                  <Modal
                    title="Thông báo"
                    open={isModalErrorOpen}
                    onOk={handleErrorOk}
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
                          ).format(dateFormat)}`}
                        </p>
                        <p>
                          {"dateEnd: " +
                            moment(error?.assignment?.dateEnd).format(
                              dateFormat
                            )}
                        </p>
                      </>
                    )}
                  </Modal>
                </Col>
              </Row>
            </Col>
          </Row> */}
          <Row>
            <Col span={24}>
              <SkillsOfStaff
                infoStaff={infoAccount}
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
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default Account;
