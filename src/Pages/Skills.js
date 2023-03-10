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
import { TitleTable } from "../utils";
import CreateSkill from "./CreateSkill";
const { Option } = Select;
const { Title, Text } = Typography;

function Skills() {
  const [isModalCreateSkillOpen, setIsModalCreateSkillOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [loading, setLoading] = useState(false);
  const [levelSkillChange, setLevelSkillChange] = useState([]);
  const [isModalSkillOpen, setIsModalSkillOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({});
  console.log("40", newSkill);
  const [skills, setSkills] = useState();
  const [skillSelected, setSkillSelected] = useState(null);
  // let options = skills ? getOptions() : [];
  // function getOptions() {
  //   return skills.map((value, index) => {
  //     return {
  //       value: value._id,
  //       label: value.skillName,
  //     };
  //   });
  // }
  async function handleDelete(idSkill) {
    setLoading(true);
    await Axios({
      method: "delete",
      url: `api/skill/${idSkill}`,
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        setLoading(false);
        navigate(0);
      })
      .catch((error) => {
        message.error(error.response.data.message);
        setLoading(false);
      });
  }
  const handleOkSkillModal = async () => {
    if (JSON.stringify(newSkill) === JSON.stringify(skillSelected)) {
      messageApi.open({
        type: "warning",
        content: "Kh??ng c?? thay ?????i",
      });
      return;
    } else if (!newSkill.skillName) {
      messageApi.open({
        type: "warning",
        content: "Thi???u t??n skill",
      });
      return;
    } else if (!newSkill.maxLevel) {
      messageApi.open({
        type: "warning",
        content: "Thi???u c???p l???n nh???t",
      });
      return;
    }

    setLoading(true);

    await Axios({
      method: "put",
      url: `/api/skill/${newSkill.idSkill}`,
      data: {
        skillName: newSkill.skillName,
        maxLevel: newSkill.maxLevel,
      },
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        setLoading(false);

        setSkillSelected(null);
        setNewSkill({});
        setIsModalSkillOpen(false);
        navigate(0);
      })
      .catch((error) => {
        message.error(error.response.data.message);
        setLoading(false);
      });
  };

  const handleCancelSkillModal = () => {
    setIsModalSkillOpen(false);
    setSkillSelected(null);
  };

  const openModalEditSkill = (skill) => {
    setSkillSelected({
      idSkill: skill._id,
      skillName: skill.skillName,
      maxLevel: skill.maxLevel,
    });
    setNewSkill((d) => {
      return {
        ...d,
        idSkill: skill._id,
        skillName: skill.skillName,
        maxLevel: skill.maxLevel,
      };
    });
    setIsModalSkillOpen(true);
  };
  const columns = [
    {
      title: <TitleTable value="T??n skill" />,
      dataIndex: "skillName",
      key: "skillName",
      width: 170,
      fixed: "left",
      // ...getColumnSearchProps("fullName"),
    },
    {
      title: <TitleTable value="C???p l???n nh???t" />,
      dataIndex: "maxLevel",
    },
    {
      title: <TitleTable value="Thao t??c" />,
      fixed: "right",
      width: 190,
      render: (value, record) => {
        return (
          <Row>
            <Col span={24}>
              <Space wrap>
                <Popconfirm
                  title="B???n c?? ch???c mu???n x??a skill n??y???"
                  cancelText="H???y"
                  okText="X??a"
                  okButtonProps={{ type: "danger" }}
                  onConfirm={() => handleDelete(record._id)}
                >
                  <Button style={{ fontSize: "10px" }} size="small" danger>
                    X??a skill
                  </Button>
                </Popconfirm>

                <Button
                  style={{ fontSize: "10px" }}
                  size="small"
                  type="primary"
                  onClick={() => {
                    openModalEditSkill(record);
                  }}
                >
                  S???a skill
                </Button>
                <Modal
                  // maskStyle={{ opacity: 0.5 }}
                  open={isModalSkillOpen}
                  title={<Title level={3}>S???a skill</Title>}
                  onOk={() => handleOkSkillModal()}
                  onCancel={() => handleCancelSkillModal()}
                  footer={[
                    <Button key="back" onClick={() => handleCancelSkillModal()}>
                      H???y
                    </Button>,
                    <Button
                      key="submit"
                      type="primary"
                      onClick={() => handleOkSkillModal()}
                    >
                      S???a
                    </Button>,
                  ]}
                >
                  {/* <Input
                    //kh??ng hi???u sao record ??? ????y n?? c??? l???y c??i ??? cu???i danh s??ch,
                    //????ng l??? click v??o c??i n??o th?? ph???i l?? record c???a c??i ?????y ch???
                    value={newSkill?.skillName}
                    placeholder="T??n m???i"
                    // defaultValue={""}
                    onChange={(e) => {
                      setNewSkill((d) => {
                        return { ...d, skillName: e.target.value };
                      });
                    }}
                  />
                  <Input
                    style={{ marginTop: "20px" }}
                    placeholder="C???p l???n nh???t"
                    value={newSkill?.maxLevel}
                    onChange={(e) => {
                      setNewSkill((d) => {
                        return { ...d, maxLevel: e.target.value };
                      });
                    }}
                  /> */}
                  <Row>
                    <Col span={24}>
                      <Row>
                        {/* c???t 1 */}
                        <Col
                          xs={24}
                          md={{
                            span: 12,
                          }}
                        >
                          <Title level={5}>T??n k??? n??ng</Title>
                          <Input
                            //kh??ng hi???u sao record ??? ????y n?? c??? l???y c??i ??? cu???i danh s??ch,
                            //????ng l??? click v??o c??i n??o th?? ph???i l?? record c???a c??i ?????y ch???
                            value={newSkill?.skillName}
                            placeholder="T??n m???i"
                            // defaultValue={""}
                            onChange={(e) => {
                              setNewSkill((d) => {
                                return { ...d, skillName: e.target.value };
                              });
                            }}
                          />
                        </Col>
                        {/* c???t 2 */}
                        <Col xs={24} md={{ span: 8, offset: 4 }}>
                          <Title level={5}>C???p l???n nh???t</Title>
                          <Input
                            placeholder="C???p l???n nh???t"
                            value={newSkill?.maxLevel}
                            onChange={(e) => {
                              setNewSkill((d) => {
                                return { ...d, maxLevel: e.target.value };
                              });
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Modal>
              </Space>
            </Col>
          </Row>
        );
      },
    },
  ];
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
        message.error(error.response.data.message);
        setLoading(false);
      });
  }
  React.useEffect(() => {
    getSkills();
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      {contextHolder}

      <Row justify="space-between">
        <Title level={3}>Danh s??ch c??c k??? n??ng c???a nh??n vi??n</Title>
        <Button type="primary" onClick={() => setIsModalCreateSkillOpen(true)}>
          Th??m m???i
        </Button>
        <CreateSkill
          isModalCreateSkillOpen={isModalCreateSkillOpen}
          setIsModalCreateSkillOpen={setIsModalCreateSkillOpen}
        />
      </Row>
      <Table
        dataSource={skills}
        pagination={{ pageSize: 15 }}
        rowKey={(data) => data._id}
        columns={columns}
        scroll={{
          x: 1000,
        }}
      />
      <Row>
        <Button
          onClick={() => {
            navigate(-1);
          }}
        >
          Quay l???i
        </Button>
      </Row>
    </>
  );
}

export default Skills;
