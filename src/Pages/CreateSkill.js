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

function CreateSkill() {
  const navigate = useNavigate();
  const [error, setError] = useState();
  const [nameSkill, setNameskill] = useState("");
  const [maxLevel, setMaxLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleSubmit = async () => {
    if (nameSkill === "") {
      notification.open({
        message: <Title level={4}>Thông báo</Title>,
        description: "Nhập thiếu",
        duration: 2,
        placement: "top",
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
        console.log("createskill 42", res);
        navigate(-1);
      })
      .catch((error) => {
        setError(error.response.data);
        console.log("editStaff 105", error);
        setIsModalOpen(true);
      });
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Row>
        <Col span={14} offset={5}>
          <Row>
            <Title level={3}>Thông tin kỹ năng mới</Title>
          </Row>
          <Row>
            {/* cột 1 */}
            <Col
              xs={24}
              md={{
                span: 10,
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
            <Col xs={24} md={{ span: 10, offset: 4 }}>
              <Title level={5}>Cấp lớn nhất</Title>
              <Input
                defaultValue={maxLevel}
                onChange={(e) => {
                  setMaxLevel((d) => e.target.value);
                }}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: "50px" }}>
            <Col span={5}>
              <Button style={{ width: "100%" }} onClick={() => navigate(-1)}>
                Quay lại
              </Button>
            </Col>
            <Col span={5} offset={14}>
              <Button style={{ width: "100%" }} onClick={handleSubmit}>
                Cập nhật
              </Button>
              <Modal
                title="Thông báo"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
              >
                <p>{error?.message}</p>
                {error?.assignment && (
                  <>
                    <hr></hr>
                    <p>effort: {error?.assignment?.effort}</p>
                    <p>
                      {`dateStart: ${moment(
                        error?.assignment?.dateStart
                      ).format("DD-MM-YYYY")}`}
                    </p>
                    <p>
                      {"dateEnd: " +
                        moment(error?.assignment?.dateEnd).format("DD-MM-YYYY")}
                    </p>
                  </>
                )}
              </Modal>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default CreateSkill;
