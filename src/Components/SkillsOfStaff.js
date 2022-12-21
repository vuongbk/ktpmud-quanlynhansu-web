import {
  Row,
  Col,
  Divider,
  Typography,
  Button,
  Modal,
  Select,
  notification,
  InputNumber,
} from "antd";
import { useState, useEffect } from "react";
import Axios from "axios";
import { getToken } from "./useToken";
import { useNavigate } from "react-router-dom";
const { Title, Text } = Typography;
const { Option } = Select;

function SkillsOfStaff({ infoStaff, setLevelSkillChange, levelSkillChange }) {
  console.log("20", infoStaff);
  const [isModalSkillOpen, setIsModalSkillOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({});
  const [loading, setLoading] = useState(false);
  const [skillsOfStaff, setSkillsOfStaff] = useState();
  console.log("25", skillsOfStaff);
  const navigate = useNavigate();
  const [skills, setSkills] = useState();
  // const [levelSkillChange, setLevelSkillChange] = useState([]);
  let options = skills ? getOptions() : [];
  async function getLevelSkillAndIdSkill() {
    await Axios.get(`/api/level-skill/${infoStaff?._id}`, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        setSkillsOfStaff(res.data.skill);
      })
      .catch((error) => {
        console.log("error.config", error.config);
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
        console.log("SkillsOfStaff 319", res.data.skill);
        setSkills(res.data.skill);
      })
      .catch((error) => {
        console.log("editStaff 322", error);
      });
  }
  useEffect(() => {
    if (!skillsOfStaff && infoStaff?._id) {
      getLevelSkillAndIdSkill();
    }
    if (!skills) {
      getSkills();
    }
  });
  function getOptions() {
    return skills.map((value, index) => {
      return {
        value: JSON.stringify(value),
        label: value.skillName,
      };
    });
  }
  function getDefaultLevelSkillValue(nameSkill) {
    return levelSkillChange.find((value) => value.nameSkill === nameSkill);
  }
  const handleOkSkillModal = async () => {
    if (Object.keys(newSkill).length <= 2) {
      notification.open({
        message: <Title level={4}>Thông báo</Title>,
        description: "Chọn thiếu",
        duration: 2,
        placement: "top",
      });
      return;
    }
    setLoading(true);
    await Axios({
      method: "post",
      url: "/api/level-skill",
      data: { ...newSkill, idStaff: infoStaff._id },
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        console.log("editStaff 91", res);
        setLoading(false);
      })
      .catch((error) => {
        console.log("editStaff 94", error);
        setLoading(false);
      });
    setIsModalSkillOpen(false);
    navigate(0);
  };
  const handleCancelSkillModal = () => {
    setIsModalSkillOpen(false);
  };
  return (
    <>
      <Divider orientation="left" orientationMargin={0}>
        <Title level={4} style={{ marginTop: "35px", marginBottom: "35px" }}>
          Kinh nghiệm
        </Title>
      </Divider>
      <Row>
        <Button type="primary" onClick={() => setIsModalSkillOpen(true)}>
          Thêm skill
        </Button>
        <Modal
          open={isModalSkillOpen}
          title={<Title level={4}>Thêm skill mới</Title>}
          // onOk={handleOkSkillModal}
          onCancel={handleCancelSkillModal}
          footer={[
            <Button key="back" onClick={handleCancelSkillModal}>
              Hủy
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={handleOkSkillModal}
            >
              Thêm skill
            </Button>,
          ]}
        >
          {/* <Text>Thêm levelSkill mới</Text> */}
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
                    return { ...d, idSkill: e._id, maxLevel: e.maxLevel };
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
                min={0}
                max={newSkill?.maxLevel}
                style={{ width: "50px" }}
                defaultValue={newSkill?.maxLevel}
                onChange={(e) => {
                  setNewSkill((d) => {
                    return { ...d, level: e };
                  });
                }}
              />
            </Col>
          </Row>
        </Modal>
      </Row>

      <Row>
        {skillsOfStaff &&
          typeof skillsOfStaff[0] === "object" &&
          skillsOfStaff.map((value, index) => {
            return (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Title level={5}>{value.nameSkill}</Title>
                <InputNumber
                  min={0}
                  max={value.maxLevel}
                  style={{ width: "50px" }}
                  defaultValue={
                    getDefaultLevelSkillValue(value.nameSkill)?.levelSkill ||
                    value.levelSkill
                  }
                  onChange={(e) => {
                    setLevelSkillChange((d) => {
                      //Lọc skill đã change trước đó ra, để không bị trùng khi chỉnh sửa 1 skill nhiều lần
                      d = d.filter((dValue) => {
                        return dValue.idLevelSkill !== value.idLevelSkill;
                      });
                      return [...d, { ...value, levelSkill: e }];
                    });
                  }}
                />
              </Col>
            );
          })}
      </Row>
    </>
  );
}
export default SkillsOfStaff;
