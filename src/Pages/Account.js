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
} from "antd";
import { useState, useEffect } from "react";
import moment from "moment";
import Axios from "axios";
import Loading from "../Components/Modal/Loading.js";
// import Upload from "antd/lib/upload/Upload.js";
import { getToken } from "../Components/useToken.js";
import md5 from "md5";
import Link from "antd/lib/typography/Link.js";
const { Option } = Select;
const { Text } = Typography;

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
function Account({ infoAccount }) {
  const [data, setData] = useState(infoAccount);
  useEffect(() => {
    if (!infoAccount) {
      getInfoAccount();
    }
  }, []);
  async function getInfoAccount() {
    setLoading(true);
    await Axios({
      method: "get",
      url: "/api/staff?infoAccount=true",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        setData(res.data);
        setImageUrl(res.data.imageUrl);
        setLoading(false);
      })
      .catch((error) => {
        console.log("App 39 error", error);
        setLoading(false);
      });
  }
  const [dataStaffChange, setDataStaffChange] = useState({});
  // const [fileList, setFileList] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  // const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [isModalErrorOpen, setIsModalErrorOpen] = useState(false);
  const [isModalPasswordOpen, setIsModalPasswordOpen] = useState(false);
  const [password, setPassword] = useState({});
  const dateFormat = "DD/MM/YYYY";
  const handleOkPasswordModal = async () => {
    if (
      !password.hasOwnProperty("oldPassword") ||
      !password.hasOwnProperty("newPassword")
    ) {
      notification.open({
        message: "Thông báo",
        description: "Bạn nhập thiếu",
        duration: 2,
        placement: "topLeft",
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
        setIsModalErrorOpen(true);
        setLoading(false);
      });
    setIsModalPasswordOpen(false);
  };
  const handleCancelPasswordModal = () => {
    setIsModalPasswordOpen(false);
  };
  const handleErrorOk = () => {
    setIsModalErrorOpen(false);
  };
  const handleCancel = () => {
    setIsModalErrorOpen(false);
  };

  const handleSubmit = async () => {
    if (
      JSON.stringify(dataStaffChange) === "{}" &&
      imageUrl === data.imageUrl
    ) {
      notification.open({
        message: "Thông báo",
        description: "Không có thay đổi",
        duration: 2,
        placement: "topLeft",
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
          console.log("editStaff 106", res);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.response.data);
          console.log("editStaff 111", error);
          setIsModalErrorOpen(true);
          setLoading(false);
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
                {dataStaffChange?.fullName || data?.fullName}
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
                  onChange={(e) =>
                    setPassword((p) => {
                      return {
                        ...p,
                        oldPassword: md5(e.target.value),
                      };
                    })
                  }
                />
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
              <Text>{dataStaffChange?.fullName || data?.fullName}</Text>
              {/* <Input
                defaultValue={dataStaffChange?.fullName || data?.fullName}
                onBlur={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, fullName: e.target.value };
                  });
                }}
              /> */}
              <Typography.Title level={5}>Điện thoại</Typography.Title>
              <Text>{dataStaffChange?.phoneNumber || data?.phoneNumber}</Text>
              {/* <Input
                defaultValue={dataStaffChange?.phoneNumber || data?.phoneNumber}
                onBlur={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, phoneNumber: e.target.value };
                  });
                }}
              /> */}
              <Typography.Title level={5}>Ngày sinh</Typography.Title>
              <Text>
                {moment(dataStaffChange?.birthYear || data?.birthYear).format(
                  dateFormat
                )}
              </Text>
              {/* <DatePicker
                defaultValue={moment(
                  dataStaffChange?.birthYear || data?.birthYear
                )}
                style={{ width: "100%" }}
                onBlur={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, birthYear: e.target.value };
                  });
                }}
              /> */}
              <Typography.Title level={5}>Phòng ban</Typography.Title>

              <Text>{data?.department}</Text>
              <Typography.Title level={5}>Cấp bậc</Typography.Title>

              <Text>{data?.role}</Text>
            </Col>
            {/* cột 2 */}
            <Col xs={24} md={{ span: 6, offset: 2 }}>
              <Typography.Title level={5}>Email</Typography.Title>
              <Text>{dataStaffChange?.email || data?.email}</Text>
              {/* <Input
                defaultValue={dataStaffChange?.email || data?.email}
                onBlur={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, email: e.target.value };
                  });
                }}
              /> */}
              <Typography.Title level={5}>Giới tính</Typography.Title>
              {/* <Select
                defaultValue={dataStaffChange?.sex || data?.sex}
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
              </Select> */}
              <Text>{dataStaffChange?.sex || data?.sex}</Text>
              <Typography.Title level={5}>Vị trí</Typography.Title>
              <Text>{data?.level}</Text>
              <Typography.Title level={5}>Trạng thái</Typography.Title>
              <Text>{data?.status}</Text>
              <Typography.Title level={5}>Ngày vào làm</Typography.Title>
              <Text>{moment(data?.startTL).format(dateFormat)}</Text>
            </Col>
          </Row>
          <Row>
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
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default Account;
