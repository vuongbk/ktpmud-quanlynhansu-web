import {
  Button,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Typography,
  Popconfirm,
  Modal,
  notification,
  message,
} from "antd";
import { useState, useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import moment from "moment";
import Axios from "axios";
import workingDay from "../utils";
import Loading from "../Components/Modal/Loading";
import { getToken } from "../Components/useToken";
const { Option } = Select;
const { Title, Text } = Typography;

function CreateSkill(props) {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [nameSkill, setNameskill] = useState("");
  const [maxLevel, setMaxLevel] = useState("");
  console.log("30", maxLevel);
  const [loading, setLoading] = useState(false);
  const handleOkCreateSkillModal = () => {
    props.setIsModalCreateSkillOpen(false);
  };
  const handleCancelCreateSkillModal = () => {
    props.setIsModalCreateSkillOpen(false);
  };
  const handleSubmit = async () => {
    if (nameSkill === "") {
      messageApi.open({
        type: "warning",
        content: "Thiếu tên skill",
      });
      return;
    } else if (maxLevel === "") {
      messageApi.open({
        type: "warning",
        content: "Thiếu maxLevel",
      });
      return;
    }
    await Axios({
      method: "post",
      url: "/api/skill",
      data: { skillName: nameSkill, maxLevel: maxLevel },
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        props.setIsModalCreateSkillOpen(false);
        message.success("Thêm skill mới thành công");
        navigate(0);
      })
      .catch((error) => {
        message.error(error.response.data.message);
      });
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Modal
        open={props.isModalCreateSkillOpen}
        title={<Title level={3}>Thêm skill</Title>}
        onOk={() => handleSubmit()}
        onCancel={() => handleCancelCreateSkillModal()}
        footer={[
          <Button key="back" onClick={() => handleCancelCreateSkillModal()}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={() => handleSubmit()}>
            Thêm Skill
          </Button>,
        ]}
      >
        <Row>
          {contextHolder}
          <Col span={24}>
            <Row>
              {/* cột 1 */}
              <Col
                xs={24}
                md={{
                  span: 12,
                }}
              >
                <Title level={5}>Tên kỹ năng</Title>
                <Input
                  defaultValue={nameSkill}
                  onChange={(e) => {
                    setNameskill((d) => e.target.value);
                  }}
                />
              </Col>
              {/* cột 2 */}
              <Col xs={24} md={{ span: 8, offset: 4 }}>
                <Title level={5}>Cấp lớn nhất</Title>
                <Input
                  defaultValue={maxLevel}
                  onChange={(e) => {
                    setMaxLevel((d) => e.target.value);
                  }}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
    </>
  );
}

export default CreateSkill;
