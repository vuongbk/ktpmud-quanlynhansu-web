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
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import Loading from "../Components/Modal/Loading";
import { getToken } from "../Components/useToken";
import { roleAdmin, TitleModal, TitleTable } from "../utils";
import RowSkillPage from "../Components/RowSkillPage";
const { Option } = Select;
const { Title, Text } = Typography;

function SkillsOfStaffs() {
  const [messageApi, contextHolder] = message.useMessage();
  const [infoAccount, setInfoAccount] = useState();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [loading, setLoading] = useState(false);
  const [levelSkillChange, setLevelSkillChange] = useState([]);
  console.log("38", levelSkillChange);
  const [isModalSkillOpen, setIsModalSkillOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({});
  const [skills, setSkills] = useState();
  let options = skills ? getOptions() : [];
  function getOptions() {
    return skills.map((value, index) => {
      return {
        value: JSON.stringify(value),
        label: value.skillName,
      };
    });
  }
  const filterSkill = getFilterSkill();
  function getFilterSkill() {
    if (skills) {
      return skills.map((value, index) => {
        return {
          text: value.skillName,
          value: value.skillName,
        };
      });
    } else {
      return [];
    }
  }
  if (!infoAccount) {
    getInfoAccount();
  }
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
      })
      .catch((error) => {
        console.log("App 39 error", error);
      });
  }
  const handleOkSkillModal = async () => {
    if (!newSkill.idSkill) {
      messageApi.open({
        type: "warning",
        content: "Thiếu tên skill",
      });
      return;
    } else if (!newSkill.level) {
      messageApi.open({
        type: "warning",
        content: "Thiếu cấp độ",
      });
      return;
    }
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
        setLoading(false);
        setIsModalSkillOpen(false);
        setNewSkill({});
        navigate(0);
      })
      .catch((error) => {
        message.error(error.response.data.message);
        setLoading(false);
      });
  };
  const handleCancelSkillModal = () => {
    setIsModalSkillOpen(false);
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    console.log("103");
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
            placeholder={`Tên tìm kiếm`}
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
              Tìm
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{
                width: 90,
              }}
            >
              Đặt lại
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
              Lọc
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
    onFilter: (value, record) => {
      console.log("184");
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },
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
  const getSearchSkillProps = (dataIndex) => ({
    filters: filterSkill,
    onFilter: (value, record) => {
      console.log("288", value);
      return record.idSkills.find((vl) => vl.skillName === value);
    },
    render: (idSkills, record) => {
      return (
        <RowSkillPage
          idSkills={idSkills}
          record={record}
          setLevelSkillChange={setLevelSkillChange}
          levelSkillChange={levelSkillChange}
        />
      );
    },
  });
  const columns = [
    {
      title: <TitleTable value="Họ và tên" />,
      dataIndex: "fullName",
      key: "fullName",
      width: 170,
      fixed: "left",
      ...getColumnSearchProps("fullName"),
    },
    {
      title: <TitleTable value="Danh sách kỹ năng" />,
      dataIndex: "idSkills",
      ...getSearchSkillProps("idSkills"),
    },
    // ...getSkill(),
    //Giám đốc thì mới hiển thị cột thao tác
    {
      title: <TitleTable value="Thao tác" />,
      fixed: "right",
      width: 190,
      render: (record) => {
        if (infoAccount?.role === roleAdmin) {
          return (
            <Row>
              <Col span={24}>
                <Space wrap>
                  <Button
                    style={{ fontSize: "10px" }}
                    size="small"
                    type="primary"
                    ghost
                    onClick={() => handleSubmit(record._id)}
                  >
                    Cập nhật
                  </Button>

                  <Button
                    style={{ fontSize: "10px" }}
                    size="small"
                    type="primary"
                    onClick={() => {
                      setIsModalSkillOpen(true);
                      setNewSkill((d) => {
                        return { idStaff: record._id };
                      });
                    }}
                  >
                    Thêm skill
                  </Button>
                </Space>
                <Modal
                  // maskStyle={{ opacity: 0.5 }}
                  open={isModalSkillOpen}
                  title={<TitleModal value="Thêm skill mới" />}
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
                  {/* <Row>
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
                  </Row> */}
                  <Row justify="space-between">
                    <Col span={12}>
                      <Title level={5} style={{ marginTop: "0" }}>
                        Tên skill
                      </Title>
                      <Select
                        labelInValue
                        // defaultValue={data?.nameLeader}
                        onChange={(event) => {
                          const e = JSON.parse(event.value);
                          setNewSkill((d) => {
                            return {
                              ...d,
                              idSkill: e._id,
                              maxLevel: e.maxLevel,
                            };
                          });
                        }}
                        style={{
                          width: "100%",
                        }}
                        options={options}
                      ></Select>
                    </Col>
                    <Col span={6} offset={6}>
                      <Title level={5} style={{ marginTop: "0" }}>
                        Cấp
                      </Title>
                      <InputNumber
                        min={1}
                        max={newSkill?.maxLevel}
                        style={{ width: "50px" }}
                        defaultValue={
                          newSkill?.maxLevel ? newSkill?.maxLevel : ""
                        }
                        onChange={(e) => {
                          console.log("417", newSkill);
                          setNewSkill((d) => {
                            return { ...d, level: e };
                          });
                        }}
                      />
                    </Col>
                  </Row>
                </Modal>
              </Col>
            </Row>
          );
        } else {
          return "";
        }
      },
    },
  ];
  async function handleSubmit(idStaff) {
    if (JSON.stringify(levelSkillChange) !== "[]") {
      //Lọc ra nhân viên nằm cùng hàng với nút cập nhật vừa bấm
      const levelSkillOfStaff = levelSkillChange.filter((value) => {
        return value.idStaff === idStaff;
      });
      if (JSON.stringify(levelSkillOfStaff) === "[]") {
        messageApi.open({
          type: "warning",
          content: "Không có thay đổi",
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
            setLoading(false);
            navigate(0);
          })
          .catch((error) => {
            message.error(error.message);
            setLoading(false);
          });
      });
    } else {
      messageApi.open({
        type: "warning",
        content: "Không có thay đổi",
      });
      return;
    }
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
    setLoading(true);
    Axios({
      method: "get",
      url: "/api/skill",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        setSkills(res.data.skill);
        setLoading(false);
      })
      .catch((error) => {
        console.log("skillPage 392", error);
        setLoading(false);
      });
  }
  React.useEffect(() => {
    getSkills();
    getNameSkillAndStaff();
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      {contextHolder}

      <Row justify="space-between">
        <Title level={3}>Danh sách các kỹ năng của nhân viên</Title>
        {infoAccount?.role === roleAdmin && (
          <Button type="primary" onClick={() => navigate("../skills")}>
            Danh sách kỹ năng
          </Button>
        )}
      </Row>
      <Table
        locale={{ filterReset: "Đặt lại" }}
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
