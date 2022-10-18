import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd";
import React, { useState } from "react";

import { PlusOutlined } from "@ant-design/icons";
import { Divider, Space } from "antd";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import Axios from "axios";
const { Option } = Select;

const EditPage = () => {
  const data = useLocation().state.data;
  const [skill, setSkill] = React.useState([]);
  const [initialValues, setInitialValues] = React.useState({
    fullName: data.fullName,
    phoneNumber: data.phoneNumber,
    birthYear: moment(data.birthYear),
    department: data.department,
    level: data.level,
    email: data.email,
    sex: data.sex,
    role: data.role,
    status: data.status,
    startTL: moment(data.startTL),
  });
  let [idSkill, setIdSkill] = useState();

  //state dùng để thêm department
  const [departments, setDepartments] = React.useState(["Thanh Hóa", "Hà Nội"]);
  const [nameDepartment, setNameDepartment] = React.useState("");

  const inputRef = React.useRef(null);

  console.log("editpage 34");
  async function getLevelSkillAndIdSkill() {
    await Axios(`/api/level-skill/${data._id}`, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzM4NjhiN2RkODFiMDkwYWRkOGQ1YTciLCJpYXQiOjE2NjQ2NDEyMDd9.oB7vpO68LDoTbtQ9vZef8hUe0rQmUss32CxguC9kmy0",
      },
    }).then((res) => {
      setIdSkill(
        res.data.levelSkill.reduce((result, value, index) => {
          return { ...result, [`id${index}`]: value.idSkill };
        }, {})
      );
      console.log("editpage 47:", idSkill);
      setSkill(res.data.levelSkill.map((value) => value.level));
    });
  }
  console.log("editpage 51:", idSkill);

  console.log("editpage 52");
  async function getNameSkill(idSkill) {
    await Axios.post("/api/skills", idSkill, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzM4NjhiN2RkODFiMDkwYWRkOGQ1YTciLCJpYXQiOjE2NjQ2NDEyMDd9.oB7vpO68LDoTbtQ9vZef8hUe0rQmUss32CxguC9kmy0",
      },
    })
      .then((res) => {
        let skillNameArray = res.data.skill.map((value) => value.skillName);
        console.log("editpage 63:", idSkill);
        setSkill((s) => {
          return s.map((value, index) => {
            return { nameSkill: skillNameArray[index], levelSkill: value };
          });
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

  //Lấy arraySkill của staff đc click
  React.useEffect(() => {
    if (!idSkill) {
      getLevelSkillAndIdSkill();
      console.log("editpage 93");
    }
    if (idSkill instanceof Object) {
      getNameSkill(idSkill);
      console.log("editpage 99 idSkill !=={}", idSkill);
    }
  }, [idSkill]);
  // React.useEffect(() => {
  //   if (idSkill instanceof Object) {
  //     getNameSkill(idSkill);
  //     console.log("editpage 99 idSkill !=={}", idSkill);
  //   }
  // }, [idSkill]);

  //lấy array tên, level skill

  // React.useEffect(() => {
  //   let skills = skill.reduce((obj, value) => {
  //     let obj1 = {};
  //     obj1[value.nameSkill] = value.levelSkill;
  //     return { ...obj, ...obj1 };
  //   }, {});
  //   console.log("editpage 72, skills: ", skills);
  //   setInitialValues({
  //     fullName: data.fullName,
  //     phoneNumber: data.phoneNumber,
  //     birthYear: moment(data.birthYear),
  //     department: data.department,
  //     level: data.level,
  //     email: data.email,
  //     sex: data.sex,
  //     role: data.role,
  //     status: data.status,
  //     startTL: moment(data.startTL),
  //     ...skills,
  //   });
  // }, [skill]);

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

  const onFinish = (e) => {
    console.log("editpage 64", e);
  };

  return (
    <>
      <Form
        onFinish={onFinish}
        wrapperCol={{
          span: 14,
        }}
        layout="vertical"
        initialValues={initialValues}
      >
        {console.log("editpage 110", skill)}
        {/* <Row>
          <Col span={20} offset={4}>
            <h2>{data.fullName}</h2>
            <h4>Thông tin cơ bản</h4>
          </Col>
        </Row>
        <Row>
          <Col style={{ margin: "auto" }} span={20}>
            <Row style={{ margin: "auto" }}>
              <Col
                xs={24}
                md={{
                  span: 8,
                  offset: 3,
                }}
              >
                <Form.Item name="fullName" label="Họ và tên">
                  <Input />
                </Form.Item>
                <Form.Item name="phoneNumber" label="Điện thoại">
                  <Input />
                </Form.Item>
                <Form.Item name="birthYear" label="Ngày sinh">
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="department" label="Phòng ban">
                  <Select
                    style={{
                      width: "100%",
                    }}
                    placeholder="chỉnh sửa dropdown"
                    allowClear="true"
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
                </Form.Item>
                <Form.Item name="level" label="Cấp bậc">
                  <Select>
                    <Select.Option value="Fresher">Fresher</Select.Option>
                    <Select.Option value="Junior">Junior</Select.Option>
                    <Select.Option value="Senior">Senior</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="email" label="Email">
                  <Input />
                </Form.Item>
                <Form.Item name="sex" label="Giới tính">
                  <Select>
                    <Select.Option value="Nam">Nam</Select.Option>
                    <Select.Option value="Nữ">Nữ</Select.Option>
                    <Select.Option value="Khác">Khác</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="role" label="Vị trí">
                  <Select>
                    <Select.Option value="Lập trình viên">
                      Lập trình viên
                    </Select.Option>
                    <Select.Option value="Leader">Leader</Select.Option>
                    <Select.Option value="Tester">Tester</Select.Option>
                    <Select.Option value="Cộng tác viên">
                      Cộng tác viên
                    </Select.Option>
                    <Select.Option value="BA">BA</Select.Option>
                    <Select.Option value="Kế toán">Kế toán</Select.Option>
                    <Select.Option value="Thực tập sinh">
                      Thực tập sinh
                    </Select.Option>
                    <Select.Option value="CEO">CEO</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="status" label="Trạng thái">
                  <Select>
                    <Select.Option value="Nhân viên chính thức">
                      Nhân viên chính thức
                    </Select.Option>
                    <Select.Option value="Thực tập">Thực tập</Select.Option>
                    <Select.Option value="Tạm nghỉ">Tạm nghỉ</Select.Option>
                    <Select.Option value="Đã nghỉ">Đã nghỉ</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="startTL" label="Ngày vào làm">
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={12} offset={4} style={{ margin: "auto" }}>
            <h4>Kinh nghiệm</h4>
            <Row>
              {skill &&
                typeof skill[0] === "object" &&
                skill.map((value, index) => {
                  return (
                    <Col xs={24} sm={12} lg={8} key={index}>
                      <Form.Item name={value.nameSkill} label={value.nameSkill}>
                        <Select>
                          <Select.Option value={0}>0</Select.Option>
                          <Select.Option value={1}>1</Select.Option>
                          <Select.Option value={2}>2</Select.Option>
                          <Select.Option value={3}>3</Select.Option>
                          <Select.Option value={4}>4</Select.Option>
                          <Select.Option value={5}>5</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  );
                })}
            </Row>
            <Row>
              <Col span={8}>
                <Button style={{ width: "100%" }}>
                  <Link to="/staff">Quay lại</Link>
                </Button>
              </Col>
              <Col span={8} offset={5}>
                <Button style={{ width: "100%" }} htmlType="submit">
                  Cập nhật
                </Button>
              </Col>
            </Row>
            <Row>
              <Col span={8} offset={16}>
                <Button type="link" danger>
                  Xóa nhân viên
                </Button>
              </Col>
            </Row>
          </Col>
        </Row> */}
        <Row>
          <Col span={24}>
            <Row>
              <Col span={20} offset={5}>
                <h2>{data.fullName}</h2>
                <h4>Thông tin cơ bản</h4>
              </Col>
            </Row>
            <Row>
              <Col
                xs={24}
                md={{
                  span: 8,
                  offset: 5,
                }}
              >
                <Form.Item name="fullName" label="Họ và tên">
                  <Input />
                </Form.Item>
                <Form.Item name="phoneNumber" label="Điện thoại">
                  <Input />
                </Form.Item>
                <Form.Item name="birthYear" label="Ngày sinh">
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="department" label="Phòng ban">
                  <Select
                    style={{
                      width: "100%",
                    }}
                    placeholder="chỉnh sửa dropdown"
                    allowClear="true"
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
                </Form.Item>
                <Form.Item name="level" label="Cấp bậc">
                  <Select>
                    <Select.Option value="Fresher">Fresher</Select.Option>
                    <Select.Option value="Junior">Junior</Select.Option>
                    <Select.Option value="Senior">Senior</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item name="email" label="Email">
                  <Input />
                </Form.Item>
                <Form.Item name="sex" label="Giới tính">
                  <Select>
                    <Select.Option value="Nam">Nam</Select.Option>
                    <Select.Option value="Nữ">Nữ</Select.Option>
                    <Select.Option value="Khác">Khác</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="role" label="Vị trí">
                  <Select>
                    <Select.Option value="Lập trình viên">
                      Lập trình viên
                    </Select.Option>
                    <Select.Option value="Leader">Leader</Select.Option>
                    <Select.Option value="Tester">Tester</Select.Option>
                    <Select.Option value="Cộng tác viên">
                      Cộng tác viên
                    </Select.Option>
                    <Select.Option value="BA">BA</Select.Option>
                    <Select.Option value="Kế toán">Kế toán</Select.Option>
                    <Select.Option value="Thực tập sinh">
                      Thực tập sinh
                    </Select.Option>
                    <Select.Option value="CEO">CEO</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="status" label="Trạng thái">
                  <Select>
                    <Select.Option value="Nhân viên chính thức">
                      Nhân viên chính thức
                    </Select.Option>
                    <Select.Option value="Thực tập">Thực tập</Select.Option>
                    <Select.Option value="Tạm nghỉ">Tạm nghỉ</Select.Option>
                    <Select.Option value="Đã nghỉ">Đã nghỉ</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item name="startTL" label="Ngày vào làm">
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={18} offset={5}>
                <h3>Kinh nghiệm</h3>
                <Row>
                  {skill &&
                    typeof skill[0] === "object" &&
                    skill.map((value, index) => {
                      return (
                        <Col xs={24} sm={12} lg={8} key={index}>
                          <Form.Item
                            name={value.nameSkill}
                            label={value.nameSkill}
                          >
                            <Select>
                              <Select.Option value={0}>0</Select.Option>
                              <Select.Option value={1}>1</Select.Option>
                              <Select.Option value={2}>2</Select.Option>
                              <Select.Option value={3}>3</Select.Option>
                              <Select.Option value={4}>4</Select.Option>
                              <Select.Option value={5}>5</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                      );
                    })}
                </Row>
                <Row>
                  <Col span={6}>
                    <Button style={{ width: "100%" }}>
                      <Link to="/staff">Quay lại</Link>
                    </Button>
                  </Col>
                  <Col span={6} offset={5}>
                    <Button style={{ width: "100%" }} htmlType="submit">
                      Cập nhật
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col span={6} offset={14}>
                    <Button type="link" danger>
                      Xóa nhân viên
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default EditPage;
