import {
  Button,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Typography,
  Popconfirm,
  Dropdown,
  Menu,
} from "antd";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import moment from "moment";
import Axios from "axios";
import workingDay from "../utils";
import Loading from "../Components/Modal/Loading";
import { getToken } from "../Components/useToken";
const { Option } = Select;
const { Title, Text } = Typography;

const EditAssignment = () => {
  const [data, setData] = useState(useLocation().state.data);
  const [indexAssign, setIndexAssign] = useState(0);

  const [dataChange, setDataChange] = useState({});
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (JSON.stringify(dataChange) === "{}") {
      window.alert("ko co thay doi");
    }

    //thay đổi bảng project
    if (JSON.stringify(dataChange) !== "{}") {
      setLoading(true);
      await Axios.put(
        `/api/assignment/${data.asignmentsList[indexAssign].idAssignment}`,
        dataChange,
        {
          headers: {
            Authorization: "Bearer " + getToken(),
          },
        }
      ).then((res) => {
        console.log("editAssign 46", res);
      });
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    await Axios.delete(
      `/api/project/${data.asignmentsList[indexAssign].idAssignment}`,
      {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      }
    );

    //lấy danh sách assignment có liên quan để xóa luôn
    let listAssignment = await Axios.get(
      `/api/assignment-id-project/${data._id}`,
      {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      }
    );
    listAssignment.data.infoAssignment.map(async (value) => {
      await Axios.delete(`/api/assignment/${value._id}`, {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      });
    });
    setLoading(false);
  };
  const menu = (
    <Menu
      onClick={({ key }) => {
        setIndexAssign(key);
        setDataChange({});
      }}
      items={data.asignmentsList.map((value, index) => {
        return {
          label: `${value.dateStart.slice(0, 10)}   -   ${value.dateEnd.slice(
            0,
            10
          )}`,
          key: index,
        };
      })}
    />
  );

  // useEffect(() => {
  //   getManagers();
  // }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Row>
        {console.log(
          "editassign 112 data.asignmentsList",
          data.asignmentsList[indexAssign]
        )}
        {console.log("editassign 115 dataChange", dataChange)}
        <Col span={24}>
          <Row>
            <Col span={19} offset={5}>
              <Title level={3}>Chỉnh sửa phân công</Title>
            </Col>
            <Col>
              <Dropdown overlay={menu}>
                <p>Chọn khoảng ngày</p>
              </Dropdown>
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
              <Title level={5}>Nhân viên</Title>
              <Input
                defaultValue={data.fullName}
                disabled
                // onChange={(e) => {
                //   setDataChange((d) => {
                //     return { ...d, projectName: e.target.value };
                //   });
                // }}
              />
              <Title level={5}>Từ ngày</Title>
              <DatePicker
                value={moment(
                  dataChange.dateStart
                    ? dataChange.dateStart
                    : data.asignmentsList[indexAssign].dateStart
                )}
                style={{ width: "100%" }}
                onChange={(date, dateString) => {
                  console.log("edit 149", dateString);
                  setDataChange((d) => {
                    return { ...d, dateStart: dateString };
                  });
                }}
              />
              <Title level={5}>Phân công dự án</Title>
              <Input
                value={
                  dataChange.effort !== undefined
                    ? dataChange.effort
                    : data.asignmentsList[indexAssign].effort
                }
                onChange={(e) => {
                  setDataChange((d) => {
                    return { ...d, effort: Number(e.target.value) };
                  });
                }}
              />
            </Col>
            {/* cột 2 */}
            <Col xs={24} md={{ span: 6, offset: 2 }}>
              <Title level={5}>Dự án</Title>
              <Input
                defaultValue={data.projectName}
                disabled
                // onChange={(e) => {
                //   setDataChange((d) => {
                //     return { ...d, projectName: e.target.value };
                //   });
                // }}
              />
              <Title level={5}>Đến ngày</Title>
              <DatePicker
                value={moment(
                  dataChange.dateEnd
                    ? dataChange.dateEnd
                    : data.asignmentsList[indexAssign].dateEnd
                )}
                style={{ width: "100%" }}
                onChange={(date, dateString) => {
                  setDataChange((d) => {
                    return { ...d, dateEnd: dateString };
                  });
                }}
              />
              <Title level={5}>Vai trò</Title>
              <Input
                defaultValue={data.asignmentsList[indexAssign].role}
                disabled
                // onChange={(e) => {
                //   setDataChange((d) => {
                //     return { ...d, projectName: e.target.value };
                //   });
                // }}
              />
            </Col>
          </Row>
          <Row>
            <Col span={16} offset={5}>
              <Row style={{ marginTop: "50px" }}>
                <Col span={6}>
                  <Button style={{ width: "100%" }}>
                    <Link to="/detail-assignment">Quay lại</Link>
                  </Button>
                </Col>
                <Col span={6} offset={5}>
                  <Button style={{ width: "100%" }} onClick={handleSubmit}>
                    Cập nhật
                  </Button>
                </Col>
              </Row>
              <Row justify="space-between">
                <Col span={6} offset={14}>
                  <Popconfirm
                    title="Bạn có chắc muốn xóa nhân viên？"
                    cancelText="Hủy"
                    okText="Xóa"
                    okButtonProps={{ type: "danger" }}
                    onConfirm={handleDelete}
                  >
                    <Button type="link" danger>
                      Xóa nhân viên
                    </Button>
                  </Popconfirm>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default EditAssignment;
