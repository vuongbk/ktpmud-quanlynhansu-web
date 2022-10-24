import {
  Button,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Typography,
  Popconfirm,
} from "antd";
import { useState, useEffect, useRef } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Divider, Space } from "antd";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import Axios from "axios";
const { Option } = Select;

const EditPage = () => {
  const [dataStaffChange, setDataStaffChange] = useState({});
  const [levelSkillChange, setLevelSkillChange] = useState([]);
  const [data, setData] = useState(useLocation().state.data);
  const [skill, setSkill] = useState([]);
  let [idSkill, setIdSkill] = useState();

  //state dùng để thêm department
  const [departments, setDepartments] = useState(["Thanh Hóa", "Hà Nội"]);
  const [nameDepartment, setNameDepartment] = useState("");

  const inputRef = useRef(null);

  async function getLevelSkillAndIdSkill() {
    await Axios(`/api/level-skill/${data._id}`, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzNiZTQxOTEwODVjY2Q1MTYyMTA5MDgiLCJpYXQiOjE2NjQ4NzExODB9.w9lDK7NrD2kFOhqKciQQKxjmbXK7i_Tr1hlMeAXKlgM",
      },
    }).then((res) => {
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
    });
  }

  async function getNameSkill(idSkill) {
    await Axios.post("/api/skills", idSkill, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzNiZTQxOTEwODVjY2Q1MTYyMTA5MDgiLCJpYXQiOjE2NjQ4NzExODB9.w9lDK7NrD2kFOhqKciQQKxjmbXK7i_Tr1hlMeAXKlgM",
      },
    })
      .then((res) => {
        let skillNameArray = res.data.skill.map((value) => value.skillName);
        setSkill((s) => {
          let skill = s.map((value, index) => {
            return { ...value, nameSkill: skillNameArray[index] };
          });
          return skill;
        });
      })
      .catch(function (error) {
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
      JSON.stringify(levelSkillChange) === "[]"
    ) {
      window.alert("ko co thay doi");
    }

    if (JSON.stringify(dataStaffChange) !== "{}") {
      await Axios.put(`/api/staff/${data._id}`, dataStaffChange, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzNiZTQxOTEwODVjY2Q1MTYyMTA5MDgiLCJpYXQiOjE2NjQ5MDExNTR9.W6DseyJQsEOk-bdi9XPTQKRG1TeK_5Pc1Xbe11PPLaM",
        },
      });
    }

    if (JSON.stringify(levelSkillChange) !== "[]") {
      levelSkillChange.forEach(async (value, index) => {
        await Axios.put(
          `/api/level-skill/${value.idLevelSkill}`,
          { levelSkill: value.levelSkill },
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzNiZTQxOTEwODVjY2Q1MTYyMTA5MDgiLCJpYXQiOjE2NjQ5MDExNTR9.W6DseyJQsEOk-bdi9XPTQKRG1TeK_5Pc1Xbe11PPLaM",
            },
          }
        );
      });
    }
  };

  const handleDelete = async () => {
    await Axios.delete(`/api/staff/${data._id}`, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzNiZTQxOTEwODVjY2Q1MTYyMTA5MDgiLCJpYXQiOjE2NjQ5MDExNTR9.W6DseyJQsEOk-bdi9XPTQKRG1TeK_5Pc1Xbe11PPLaM",
      },
    });
  };

  const addSkill = () => {
    console.log("chua lam");
  };

  //Lấy arraySkill của staff đc click
  useEffect(() => {
    if (!idSkill) {
      getLevelSkillAndIdSkill();
    }
    if (idSkill instanceof Object) {
      getNameSkill(idSkill);
    }
  }, [idSkill]);

  return (
    <>
      <Row>
        <Col span={24}>
          <Row>
            <Col span={20} offset={5}>
              <Typography.Title level={3}>{data.fullName}</Typography.Title>
              <Typography.Title level={4}>Thông tin cơ bản</Typography.Title>
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
                defaultValue={data.fullName}
                onBlur={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, fullName: e.target.value };
                  });
                }}
              />
              <Typography.Title level={5}>Điện thoại</Typography.Title>
              <Input
                defaultValue={data.phoneNumber}
                onBlur={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, phoneNumber: e.target.value };
                  });
                }}
              />
              <Typography.Title level={5}>Ngày sinh</Typography.Title>
              <DatePicker
                defaultValue={moment(data.birthYear)}
                style={{ width: "100%" }}
                onBlur={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, birthYear: e.target.value };
                  });
                }}
              />
              <Typography.Title level={5}>Phòng ban</Typography.Title>
              <Select
                defaultValue={data.department}
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
                defaultValue={data.level}
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
                defaultValue={data.email}
                onBlur={(e) => {
                  setDataStaffChange((d) => {
                    return { ...d, email: e.target.value };
                  });
                }}
              />
              <Typography.Title level={5}>Giới tính</Typography.Title>
              <Select
                defaultValue={data.sex}
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
                defaultValue={data.role}
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
                defaultValue={data.status}
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
                defaultValue={moment(data.startTL)}
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
                <Button type="primary" onClick={addSkill}>
                  Add skill
                </Button>
              </Row>
              <Row style={{ marginTop: "50px" }}>
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
};

export default EditPage;
