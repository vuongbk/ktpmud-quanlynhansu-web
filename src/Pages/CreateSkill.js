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
      data: { skillName: nameSkill },
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
        <Col span={24}>
          <Row>
            <Col span={19} offset={5}>
              <Title level={3}>Thông tin kỹ năng mới</Title>
            </Col>
          </Row>
          <Row>
            {/* cột 1 */}
            <Col
              xs={24}
              md={{
                span: 6,
                offset: 5,
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
            <Col xs={24} md={{ span: 6, offset: 2 }}></Col>
          </Row>
          <Row>
            <Col span={16} offset={5}>
              <Row gutter={80} style={{ marginTop: "50px" }}>
                <Col span={6}>
                  <Button
                    style={{ width: "100%" }}
                    onClick={() => navigate(-1)}
                  >
                    Quay lại
                  </Button>
                </Col>
                <Col span={6} offset={5}>
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
                            moment(error?.assignment?.dateEnd).format(
                              "DD-MM-YYYY"
                            )}
                        </p>
                      </>
                    )}
                  </Modal>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}

export default CreateSkill;
