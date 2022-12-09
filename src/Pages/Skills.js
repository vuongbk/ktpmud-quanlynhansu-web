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

function Skills() {
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
  console.log("skills 35", skills);
  // let options = skills ? getOptions() : [];
  // function getOptions() {
  //   return skills.map((value, index) => {
  //     return {
  //       value: value._id,
  //       label: value.skillName,
  //     };
  //   });
  // }
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
      method: "put",
      url: `/api/skill/${newSkill.idSkill}`,
      data: { skillName: newSkill.skillName },
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        console.log("Skills 55", res);
        setLoading(false);
        setIsModalSkillOpen(false);
        navigate(0);
      })
      .catch((error) => {
        console.log("Skills 59", error);
        setLoading(false);
      });
  };
  const handleCancelSkillModal = () => {
    setIsModalSkillOpen(false);
  };

  const columns = [
    {
      title: "Tên skill",
      dataIndex: "skillName",
      key: "skillName",
      width: 170,
      fixed: "left",
      // ...getColumnSearchProps("fullName"),
    },
    {
      title: "Max level",
    },
    {
      title: "Thao tác",
      fixed: "right",
      width: 230,
      render: (record) => {
        const t = record;
        return (
          <Row>
            <Col span={18} offset={3}>
              <Space wrap>
                <Button
                  style={{ width: "100%" }}
                  ghost
                  size="small"
                  type="primary"
                  onClick={() => handleDelete(record._id)}
                >
                  Xóa skill
                </Button>
                <Button
                  style={{ width: "100%", padding: "1px" }}
                  ghost
                  size="small"
                  type="primary"
                  onClick={() => {
                    setIsModalSkillOpen(true);
                    setNewSkill((d) => {
                      return { ...d, idSkill: record._id };
                    });
                  }}
                >
                  Sửa skill
                </Button>
              </Space>
            </Col>
            <Modal
              // maskStyle={{ opacity: 0.5 }}
              open={isModalSkillOpen}
              title="Sửa skill"
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
                  Sửa
                </Button>,
              ]}
            >
              <Input
                //không hiểu sao record ở đây nó cứ lấy cái ở cuối danh sách,
                //đáng lẽ click vào cái nào thì phải là record của cái đấy chứ
                // defaultValue={record.skillName}
                defaultValue={""}
                onChange={(e) => {
                  setNewSkill((d) => {
                    return { ...d, skillName: e.target.value };
                  });
                }}
              />
            </Modal>
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
    getSkills();
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Row justify="space-between">
        <Title level={3}>Danh sách các kỹ năng của nhân viên</Title>
        <Button type="primary" onClick={() => navigate("../create-skill")}>
          Thêm mới
        </Button>
      </Row>
      <Table
        dataSource={skills}
        pagination={{ pageSize: 4 }}
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
          Quay lại
        </Button>
      </Row>
    </>
  );
}

export default Skills;
