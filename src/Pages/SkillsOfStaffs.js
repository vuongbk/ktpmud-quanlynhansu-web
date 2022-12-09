import {
  Table,
  Typography,
  Input,
  Space,
  Button,
  InputNumber,
  Row,
  Col,
  Modal,
  Select,
  Popconfirm,
  notification,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import Loading from "../Components/Modal/Loading";
import { getToken } from "../Components/useToken";
const { Option } = Select;
const { Title, Text } = Typography;

function SkillsOfStaffs() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [loading, setLoading] = useState(false);
  const [levelSkillChange, setLevelSkillChange] = useState([]);
  const [isModalSkillOpen, setIsModalSkillOpen] = useState(false);
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
  const handleDelete = async (idSkill) => {
    setLoading(true);
    await Axios({
      method: "delete",
      url: `api/skill/${idSkill}`,
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        console.log("skillPage 53", res);
        setLoading(false);
        navigate(0);
      })
      .catch((error) => {
        console.log("skillPage 57", error);
        setLoading(false);
      });
  };
  const handleOkSkillModal = async () => {
    setLoading(true);
    await Axios({
      method: "post",
      url: "/api/level-skill",
      data: { ...newSkill },
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        console.log("skillpage 55", res);
        setLoading(false);
        setIsModalSkillOpen(false);
        navigate(0);
      })
      .catch((error) => {
        console.log("skillpage 59", error);
        setLoading(false);
      });
  };
  const handleCancelSkillModal = () => {
    setIsModalSkillOpen(false);
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => {
      return (
        <div
          style={{
            padding: 8,
          }}
        >
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: "block",
            }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{
                width: 90,
              }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({
                  closeDropdown: false,
                });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
          </Space>
        </div>
      );
    },
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text, record) => {
      if (dataIndex === "fullName") {
        return (
          <Text>
            {searchedColumn === dataIndex ? (
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            ) : (
              text
            )}
          </Text>
        );
      }
    },
  });

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 170,
      fixed: "left",
      ...getColumnSearchProps("fullName"),
    },
    {
      title: "Danh sách kỹ năng",
      dataIndex: "idSkills",
      render: (idSkills, record) => {
        return (
          <Row>
            {idSkills.map((skill, index) => {
              return (
                <Col style={{ marginRight: "20px" }} key={index}>
                  <Row>
                    <Text>{skill.skillName}</Text>
                  </Row>
                  <Row>
                    <InputNumber
                      min={0}
                      max={5}
                      style={{ width: "50px" }}
                      defaultValue={skill.level}
                      onChange={(value) => {
                        handleChange(value, skill._id, record._id);
                      }}
                    />
                  </Row>
                </Col>
              );
            })}
          </Row>
        );
      },
    },
    // ...getSkill(),
    {
      title: "Thao tác",
      fixed: "right",
      width: 230,
      render: (record) => {
        return (
          <Row>
            <Col span={18} offset={3}>
              <Space wrap>
                <Button
                  style={{ width: "100%" }}
                  ghost
                  size="small"
                  type="primary"
                  onClick={() => handleSubmit(record._id)}
                >
                  Cập nhật
                </Button>

                <Button
                  style={{ width: "100%", padding: "1px" }}
                  ghost
                  size="small"
                  type="primary"
                  onClick={() => {
                    setIsModalSkillOpen(true);
                    setNewSkill((d) => {
                      return { ...d, idStaff: record._id };
                    });
                  }}
                >
                  Thêm skill
                </Button>
              </Space>
              <Modal
                // maskStyle={{ opacity: 0.5 }}
                open={isModalSkillOpen}
                title="Thêm skill mới"
                onOk={() => handleOkSkillModal()}
                onCancel={handleCancelSkillModal}
                footer={[
                  <Button key="back" onClick={handleCancelSkillModal}>
                    Hủy
                  </Button>,
                  <Button
                    key="submit"
                    type="primary"
                    onClick={() => handleOkSkillModal()}
                  >
                    Thêm skill
                  </Button>,
                ]}
              >
                {/* <Text>Thêm levelSkill mới</Text> */}
                <Row>
                  <Col span={12}>
                    <Text>Tên skill</Text>
                    <Select
                      labelInValue
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
                  </Col>
                  <Col span={6} offset={6}>
                    <Row>
                      <Text>Cấp độ</Text>
                    </Row>
                    <Select
                      Chọn
                      cấp
                      độ
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
                  </Col>
                </Row>
              </Modal>
            </Col>
          </Row>
        );
      },
    },
  ];
  async function handleSubmit(idStaff) {
    if (JSON.stringify(levelSkillChange) !== "[]") {
      const levelSkillOfStaff = levelSkillChange.filter((value) => {
        return value.idStaff === idStaff;
      });
      console.log("skillpage 308", levelSkillOfStaff);
      if (JSON.stringify(levelSkillOfStaff) === "[]") {
        notification.open({
          message: "Thông báo",
          description: "Không có thay đổi",
          duration: 2,
          placement: "topLeft",
        });
        return;
      }
      setLoading(true);
      await levelSkillOfStaff.forEach(async (value, index) => {
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
            console.log("skillpage 205", res);
            setLoading(false);
            navigate(0);
          })
          .catch((error) => {
            console.log("skillpage 208", error);
            setLoading(false);
          });
      });
    } else {
      notification.open({
        message: "Thông báo",
        description: "Không có thay đổi",
        duration: 2,
        placement: "topLeft",
      });
      return;
    }
  }
  function handleChange(levelSkill, idLevelSkill, idStaff) {
    setLevelSkillChange((d) => [
      ...d,
      { levelSkill: levelSkill, idLevelSkill: idLevelSkill, idStaff: idStaff },
    ]);
  }
  async function getNameSkillAndStaff() {
    setLoading(true);
    await Axios.get("/api/name-of-staff-and-skill", {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        setLoading(false);
        setData(res.data.staffSkill);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error getNameSkillAndStaff", error);
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
        console.log("skillPage 388", res.data.skill);
        setSkills(res.data.skill);
      })
      .catch((error) => {
        console.log("skillPage 392", error);
      });
  }
  React.useEffect(() => {
    getNameSkillAndStaff();
    getSkills();
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Row justify="space-between">
        <Title level={3}>Danh sách các kỹ năng của nhân viên</Title>
      </Row>
      <Row>
        <Space wrap style={{ marginBottom: "5px" }}>
          {skills
            ? skills.map((value, index) => {
                return (
                  <Popconfirm
                    key={index}
                    title="Bạn có chắc muốn xóa kỹ năng này？"
                    cancelText="Hủy"
                    okText="Xóa"
                    okButtonProps={{ type: "danger" }}
                    onConfirm={() => handleDelete(value._id)}
                  >
                    <Button type="danger">{value.skillName}</Button>
                  </Popconfirm>
                );
              })
            : ""}
          <Button type="primary" onClick={() => navigate("../skills")}>
            Chỉnh sửa danh sách kỹ năng
          </Button>
        </Space>
      </Row>
      <Table
        dataSource={data}
        pagination={{ pageSize: 4 }}
        rowKey={(data) => data.email}
        columns={columns}
        scroll={{
          x: 1000,
        }}
      />
    </>
  );
}

export default SkillsOfStaffs;
