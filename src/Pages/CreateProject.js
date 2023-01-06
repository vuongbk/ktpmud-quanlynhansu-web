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

function CreateProject() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [data, setData] = useState(useLocation()?.state?.data);
  const [dataProjectChange, setDataProjectChange] = useState({});
  console.log("editpj 27", dataProjectChange);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  let options = managers ? getOptions() : [];
  const dateFormat = "DD/MM/YYYY";
  const iso8601Format = "YYYY-MM-DD";
  function getOptions() {
    return managers.map((value, index) => {
      return {
        value: value._id,
        label: value.fullName,
      };
    });
  }
  const handleSubmit = async () => {
    if (!dataProjectChange.projectName) {
      messageApi.open({
        type: "warning",
        content: "Thiếu tên dự án",
      });
      return;
    } else if (!dataProjectChange.idLeader) {
      messageApi.open({
        type: "warning",
        content: "Thiếu leader",
      });
      return;
    } else if (!dataProjectChange.status) {
      messageApi.open({
        type: "warning",
        content: "Thiếu trạng thái",
      });
      return;
    } else if (
      moment(dataProjectChange.dateStart).isSameOrAfter(
        moment(dataProjectChange.dateEnd)
      )
    ) {
      messageApi.open({
        type: "error",
        content: "Ngày bắt đầu phải trước ngày kết thúc",
      });
      return;
    }

    //thay đổi bảng project
    if (JSON.stringify(dataProjectChange) !== "{}") {
      setLoading(true);
      await Axios.post(`/api/project`, dataProjectChange, {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      })
        .then((res) => {
          setDataProjectChange({});
          navigate(-1);
        })
        .catch((error) => {
          message.error(error.response.data.message);
        });
      setLoading(false);
    }
  };

  async function getManagers() {
    await Axios.get(`/api/staff`, {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        setManagers(res.data);
      })
      .catch((error) => {
        message.error(error.response.data.message);
      });
  }
  function checkStatus(date1, date2) {
    let dt1 = new Date(date1);
    let dt2 = new Date(date2);
    let curDate = new Date();
    if (curDate < dt1) {
      return "Chưa bắt đầu";
    } else if (curDate < dt2 && curDate > dt1) {
      return "Đang thực hiện";
    } else {
      return "Đã kết thúc";
    }
  }

  useEffect(() => {
    getManagers();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Row>
      {contextHolder}
      <Col span={14} offset={5}>
        <Row>
          <Title level={3}>Thông tin dự án mới</Title>
        </Row>
        <Row>
          {/* cột 1 */}
          <Col
            xs={24}
            md={{
              span: 10,
            }}
          >
            <Title level={5}>Tên dự án</Title>
            <Input
              defaultValue={dataProjectChange.projectName}
              onChange={(e) => {
                setDataProjectChange((d) => {
                  return { ...d, projectName: e.target.value };
                });
              }}
            />
            <Title level={5}>Ngày bắt đầu</Title>
            <DatePicker
              defaultValue={moment(dataProjectChange.dateStart)}
              style={{ width: "100%" }}
              format={dateFormat}
              onChange={(date, dateString) => {
                setDataProjectChange((d) => {
                  return {
                    ...d,
                    dateStart: moment(date).format(iso8601Format),
                  };
                });
              }}
            />
            <Title level={5}>Trạng thái</Title>
            <Select
              defaultValue={data?.status}
              onChange={(e) => {
                console.log("createProject 230", e);
                setDataProjectChange((d) => {
                  return { ...d, status: e };
                });
              }}
              style={{
                width: "100%",
              }}
              options={[
                {
                  value: "Đang thực hiện",
                  label: "Đang thực hiện",
                },
                {
                  value: "Kết thúc",
                  label: "Kết thúc",
                },
                {
                  value: "Tạm dừng",
                  label: "Tạm dừng",
                },
                {
                  value: "Chưa thực hiện",
                  label: "Chưa thực hiện",
                },
              ]}
            ></Select>
            <Row style={{ marginTop: "70px" }} justify={"space-between"}>
              <Col span={10}>
                <Button style={{ width: "100%" }} onClick={() => navigate(-1)}>
                  Quay lại
                </Button>
              </Col>
              <Col span={10}>
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  onClick={handleSubmit}
                >
                  Thêm mới
                </Button>
              </Col>
            </Row>
          </Col>
          {/* cột 2 */}
          <Col xs={24} md={{ span: 10, offset: 4 }}>
            <Title level={5}>PM/Leader</Title>
            <Select
              labelInValue
              onChange={(e) => {
                console.log("createProject 230", e);
                setDataProjectChange((d) => {
                  return { ...d, idLeader: e.value, nameLeader: e.label };
                });
              }}
              style={{
                width: "100%",
              }}
              options={options}
            ></Select>
            <Title level={5}>Dự kiến kết thúc</Title>
            <DatePicker
              defaultValue={moment(dataProjectChange.dateEnd)}
              style={{ width: "100%" }}
              format={dateFormat}
              onChange={(date, dateString) => {
                setDataProjectChange((d) => {
                  return { ...d, dateEnd: moment(date).format(iso8601Format) };
                });
              }}
            />
            <Text>
              Ước tính:{" "}
              {Math.round(
                workingDay(
                  dataProjectChange.dateStart || moment().startOf("day"),
                  dataProjectChange.dateEnd || moment().startOf("day")
                ) * 100
              ) / 100}{" "}
              mm
            </Text>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default CreateProject;
