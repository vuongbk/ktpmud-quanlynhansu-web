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
import { useLocation, useNavigate } from "react-router-dom";
const { Title, Text } = Typography;
const { Option } = Select;

function SkillsOfStaff({ infoStaff, setLevelSkillChange, levelSkillChange }) {
  const location = useLocation();
  const [isModalSkillOpen, setIsModalSkillOpen] = useState(false);
  const [newSkill, setNewSkill] = useState({});
  const [loading, setLoading] = useState(false);
  const [skillsOfStaff, setSkillsOfStaff] = useState();
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
    // navigate(0);
  };
  const handleCancelSkillModal = () => {
    setIsModalSkillOpen(false);
  };
  return (
    <>
      <Divider orientation="left" orientationMargin={0}>
        <Title level={4} style={{ marginTop: "35px", marginBottom: "15px" }}>
          Kinh nghiệm
        </Title>
      </Divider>

      <Row>
        {skillsOfStaff &&
          typeof skillsOfStaff[0] === "object" &&
          skillsOfStaff.map((value, index) => {
            return (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Title level={5}>{value.nameSkill}</Title>
                <InputNumber
                  disabled={location.pathname === "/account" ? true : false}
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
