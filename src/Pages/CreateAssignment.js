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
  Modal,
  message,
} from "antd";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Link,
  useLocation,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import moment from "moment";
import Axios from "axios";
import workingDay, { roleDeveloper, roleLeader, TitleModal } from "../utils";
import Loading from "../Components/Modal/Loading";
import { getToken } from "../Components/useToken";
const { Option } = Select;
const { Title, Text } = Typography;

const CreateAssignment = (props) => {
  const [infoAccount, setInfoAccount] = useState(props?.infoAccount);
  const effortRef = useRef();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [data, setData] = useState(useLocation()?.state?.data);
  const [error, setError] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dataChange, setDataChange] = useState({
    idStaff: searchParams.get("idStaff"),
  });
  console.log("41", dataChange);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const dateFormat = "DD/MM/YYYY";
  const iso8601Format = "YYYY-MM-DD";
  const [isModalOpenHandleError, setIsModalOpenHandleError] = useState(false);

  let optionsStaffs = Array.isArray(data) ? getOptionsStaffs() : [];
  function getOptionsStaffs() {
    return data?.map((value, index) => {
      return {
        value: value._id,
        label: value.fullName,
      };
    });
  }
  let optionsProjects = projects ? getOptionsProjects() : [];
  function getOptionsProjects() {
    return projects.map((value, index) => {
      return {
        value: value._id,
        label: value.projectName,
      };
    });
  }

  const getInfoAccount = useCallback(async () => {
    await Axios({
      method: "get",
      url: "../api/staff?infoAccount=true",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        setInfoAccount(res.data);
      })
      .catch((error) => {
        message.error(error.response.data.message);
      });
  }, []);

  const handleCancelHandleError = () => {
    setIsModalOpenHandleError(false);
  };

  const handleOkHandleError = () => {
    setIsModalOpenHandleError(false);
  };

  const handleSubmit = async () => {
    if (!dataChange?.idStaff) {
      messageApi.open({
        type: "warning",
        content: "Thi???u nh??n vi??n",
      });
      return;
    } else if (!dataChange?.idProject) {
      messageApi.open({
        type: "warning",
        content: "Thi???u d??? ??n",
      });
      return;
    } else if (!dataChange?.effort) {
      messageApi.open({
        type: "warning",
        content: "Thi???u ph??n c??ng",
      });
      return;
    } else if (!dataChange?.role) {
      messageApi.open({
        type: "warning",
        content: "Thi???u vai tr??",
      });
      return;
    }
    if (
      moment(dataChange.dateStart).isSameOrAfter(moment(dataChange.dateEnd))
    ) {
      messageApi.open({
        type: "error",
        content: "Ng??y b???t ?????u ph???i tr?????c ng??y k???t th??c",
      });
      return;
    }
    if (dataChange.effort <= 0 || dataChange.effort > 100) {
      messageApi.open({
        type: "warning",
        content: "ph??n c??ng d??? ??n l???n ph???i h??n 0%, b?? h??n 100%",
      });
      effortRef.current.focus();
    } else {
      setLoading(true);
      await Axios.post(
        `../api/assignment?role=${infoAccount?.role}&idLeader=${infoAccount?._id}`,
        dataChange,
        {
          headers: {
            Authorization: "Bearer " + getToken(),
          },
        }
      )
        .then((res) => {
          setLoading(false);
          navigate(-1);
        })
        .catch((error) => {
          message.error(error.response.data.message);
          console.log("119", error);
          if (error.response.data.hasOwnProperty("assignment")) {
            setIsModalOpenHandleError(true);
            setError(error.response.data);
          }
          setLoading(false);
        });
    }
  };

  const getStaff = useCallback(async () => {
    await Axios.get(
      `/api/staff/${
        searchParams.get("idStaff") ? searchParams.get("idStaff") : ""
      }`,
      {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      }
    )
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        message.error(error.response.data.message);
      });
  }, [searchParams]);

  const getProjects = useCallback(async () => {
    await Axios({
      method: "get",
      url: `/api/project?role=${infoAccount?.role}&idLeader=${infoAccount?._id}`,
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        setProjects(res.data.infoProjects);
      })
      .catch((error) => {
        message.error(error.response.data.message);
      });
  }, [infoAccount]);

  useEffect(() => {
    if (!infoAccount) {
      console.log("187 ass ");

      getInfoAccount();
    }
    if (!data) {
      getStaff();
    }
    getProjects();
  }, [data, getInfoAccount, getProjects, getStaff, infoAccount]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Row>
      {contextHolder}
      {/* {console.log("editassign 126 ", moment(error?.dateStart))} */}
      <Col span={14} offset={5}>
        <Row>
          <Title level={3}>Th??m ph??n c??ng</Title>
        </Row>
        <Row>
          {/* c???t 1 */}
          <Col
            xs={24}
            md={{
              span: 10,
            }}
          >
            <Title level={5}>Nh??n vi??n</Title>
            {searchParams.get("idStaff") ? (
              <Input defaultValue={data?.fullName} disabled />
            ) : (
              <Select
                labelInValue
                value={dataChange?.nameStaff}
                onChange={(e) => {
                  console.log("createProject 230", e);
                  setDataChange((d) => {
                    return { ...d, idStaff: e.value, nameStaff: e.label };
                  });
                }}
                style={{
                  width: "100%",
                }}
                options={optionsStaffs}
              ></Select>
            )}

            <Title level={5}>T??? ng??y</Title>
            <DatePicker
              format={dateFormat}
              style={{ width: "100%" }}
              value={moment(dataChange?.dateStart)}
              onChange={(date, dateString) => {
                setDataChange((d) => {
                  return {
                    ...d,
                    dateStart: moment(date).format(iso8601Format),
                  };
                });
              }}
            />
            <Title level={5}>Ph??n c??ng d??? ??n (%)</Title>
            <Input
              ref={effortRef}
              defaultValue={dataChange?.effort}
              onChange={(e) => {
                setDataChange((d) => {
                  return { ...d, effort: Number(e.target.value) };
                });
              }}
            />
          </Col>
          {/* c???t 2 */}
          <Col xs={24} md={{ span: 10, offset: 4 }}>
            <Title level={5}>D??? ??n</Title>
            <Select
              labelInValue
              value={dataChange.nameProject}
              onChange={(e) => {
                console.log("createProject 230", e);
                setDataChange((d) => {
                  return { ...d, idProject: e.value, nameProject: e.label };
                });
              }}
              style={{
                width: "100%",
              }}
              options={optionsProjects}
            ></Select>
            <Title level={5}>?????n ng??y</Title>
            <DatePicker
              format={dateFormat}
              style={{ width: "100%" }}
              value={moment(dataChange?.dateEnd)}
              onChange={(date, dateString) => {
                setDataChange((d) => {
                  return {
                    ...d,
                    dateEnd: moment(date).format(iso8601Format),
                  };
                });
              }}
            />
            <Title level={5}>Vai tr??</Title>
            <Select
              defaultValue={dataChange.role}
              onSelect={(e) => {
                setDataChange((d) => {
                  return { ...d, role: e };
                });
              }}
              style={{
                width: "100%",
              }}
            >
              <Option value={roleDeveloper}>L???p tr??nh vi??n</Option>
              {/* <Option value="Leader">Leader</Option> */}
              {/* leader l?? g?? khi ???? c?? manager */}
              <Option value={roleLeader}>Qu???n l?? d??? ??n</Option>
            </Select>
          </Col>
        </Row>
        <Row>
          <Col
            xs={24}
            md={{
              span: 10,
            }}
          >
            <Row style={{ marginTop: "70px" }} justify={"space-between"}>
              <Col span={10}>
                <Button style={{ width: "100%" }} onClick={() => navigate(-1)}>
                  <Text>Quay l???i</Text>
                </Button>
              </Col>
              <Col span={10}>
                <Button
                  style={{ width: "100%" }}
                  type={"primary"}
                  onClick={handleSubmit}
                >
                  Th??m m???i
                </Button>
                {/* modal th??ng b??o l???i, th??ng b??o th??ng tin nh?? t???ng effort, ng??y b???t ?????u tr??ng */}
                <Modal
                  title={<TitleModal value="Th??ng b??o" />}
                  open={isModalOpenHandleError}
                  onOk={handleOkHandleError}
                  onCancel={handleCancelHandleError}
                >
                  <p>{error?.message}</p>
                  {error?.assignment && (
                    <>
                      <hr></hr>
                      <p>Ph??n c??ng: {error?.assignment?.effort}%</p>
                      <p>
                        {`Ng??y b???t ?????u: ${moment(
                          error?.assignment?.dateStart
                        ).format(dateFormat)}`}
                      </p>
                      <p>
                        {"Ng??y k???t th??c: " +
                          moment(error?.assignment?.dateEnd).format(dateFormat)}
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
  );
};

export default CreateAssignment;
