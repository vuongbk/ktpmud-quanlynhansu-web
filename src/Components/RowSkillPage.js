import { Col, InputNumber, Row, Typography } from "antd";
import { memo } from "react";
const { Text } = Typography;

function RowSkillPage({
  idSkills,
  record,
  levelSkillChange,
  setLevelSkillChange,
}) {
  console.log("RowSkillPage");
  const getChangeLevelSkill = (idLevelSkill) => {
    if (JSON.stringify(levelSkillChange) !== "[]") {
      return levelSkillChange.find(
        (value) => value.idLevelSkill === idLevelSkill
      );
    } else return undefined;
  };
  function handleChange(levelSkill, idLevelSkill, idStaff) {
    setLevelSkillChange((d) => {
      //tìm vị trí trùng skill
      const indexOfSkill = d.findIndex(
        (value) => value.idLevelSkill === idLevelSkill
      );
      if (indexOfSkill !== -1) {
        d[indexOfSkill].levelSkill = levelSkill;
        return d;
      } else {
        return [
          ...d,
          {
            levelSkill: levelSkill,
            idLevelSkill: idLevelSkill,
            idStaff: idStaff,
          },
        ];
      }
    });
  }
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
                max={skill.maxLevel}
                style={{ width: "50px" }}
                defaultValue={
                  getChangeLevelSkill(skill._id)?.levelSkill || skill.level
                }
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
}

export default memo(RowSkillPage);
