import { Table, Typography, Row, DatePicker, Button } from "antd";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import Loading from "../Components/Modal/Loading";
import moment from "moment";
import { getToken } from "../Components/useToken";
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

function DetailAssignment() {
  let curDate = moment().startOf("day");
  const [data, setData] = useState(null);
  const { idStaff } = useParams();
  const [dateColumnStart, setDateColumnStart] = useState(
    moment(curDate).subtract(25, "days")
  );
  const [dateColumnEnd, setDateColumnEnd] = useState(
    moment(curDate).add(35, "days")
  );
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const columnAssignments = [
    {
      fixed: "left",
      width: "200px",
      title: "Dự án",
      dataIndex: "projectName",
      render: (projectName, record) => {
        return (
          <Link
            to={`/assignments-of-staff?idStaff=${idStaff}&idProject=${record._id}`}
          >
            {projectName}
          </Link>
        );
      },
    },
    ...getEffortInDay(),
  ];
  const navigate = useNavigate();
  function removeDuplicateIds(listId) {
    let obj = {};
    let out = [];
    let leng = listId?.length;
    for (let x = 0; x < leng; x++) {
      obj[listId[x].idProject] = 0;
    }
    for (let x in obj) {
      out.push(x);
    }
    return out;
  }
  function getEffortInDay() {
    let dateColumnList = [];
    for (
      let i = dateColumnStart;
      i.isSameOrBefore(dateColumnEnd);
      i = moment(i).add(1, "days")
    ) {
      dateColumnList.push({
        width: "70px",
        title: i.format("DD-MM"),
        dataIndex: "totalEffort",
        render: (totalEffort, record) => {
          //kiểm tra xem ngày cột đang xét (= i) nằm ở assignment nào
          function checkAssign(iTest) {
            //duyệt các assign của dự án dòng này
            let len = totalEffort.length;
            let x = 0;
            for (; x < len; x++) {
              let value = totalEffort[x];
              if (
                moment(value.dateStart).isSameOrBefore(iTest) &&
                iTest.isBefore(moment(value.dateEnd))
              ) {
                break;
              } else {
                continue;
              }
            }
            if (x === len) {
              return -1;
            } else {
              return x;
            }
          }

          //xem tổng effort trong ngày có lớn hơn 100 ko
          function checkTotalEffortInDay(dateCurrentColumn) {
            //duyệt cả các assign của các dự án trên dòng khác
            let arr = data?.totalEffort;
            let sum = 0;
            arr.forEach((value, index) => {
              if (
                moment(value.dateStart).isSameOrBefore(dateCurrentColumn) &&
                dateCurrentColumn.isBefore(moment(value.dateEnd))
              ) {
                sum += value.effort;
              }
            });
            return sum;
          }
          let indexOfAssignment = checkAssign(i);
          let sumEffort = checkTotalEffortInDay(i);
          //làm tiếp ở đoạn này, lấy tổng effort theo từng khoảng
          if (indexOfAssignment !== -1) {
            return (
              <Link
                to={`/edit-assignment/${totalEffort[indexOfAssignment]?._id}`}
                state={{
                  data: {
                    projectName: record.projectName,
                    fullName: data?.fullName,
                    asignment: totalEffort[indexOfAssignment],
                  },
                }}
                style={{
                  color: sumEffort < 100 ? "red" : "blue",
                }}
              >
                {totalEffort[indexOfAssignment]?.effort}%
              </Link>
            );
          } else {
            return (
              <Text style={{ color: sumEffort < 100 ? "red" : "blue" }}>
                0%
              </Text>
            );
          }
        },
      });
    }
    return dateColumnList;
  }

  async function getProjectName() {
    setLoading(true);
    let urlGet = "/api/project?";
    let listId = removeDuplicateIds(data?.totalEffort);
    listId.forEach((value, index, array) => {
      urlGet += "id" + index + "=" + value;
      if (index !== array.length - 1) {
        urlGet += "&";
      }
    });
    await Axios({
      method: "get",
      url: urlGet,
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        let projects = res.data.infoProjects.map((value, index) => {
          return {
            ...value,
            //lấy ra những assignment của staff này, trong dự án này
            totalEffort: data?.totalEffort.filter((assign) => {
              return assign.idProject === value._id;
            }),
          };
        });

        setProjects(projects);
        setLoading(false);
      })
      .catch((error) => {
        console.log("error detail 41", error);
        setLoading(false);
      });
  }

  async function getAssignmentAndStaff() {
    setLoading(true);
    await Axios.get("/api/assignment-staff", {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        let rawData = res.data.find((value, index) => {
          return idStaff === value.idStaff;
        });
        setData(rawData);
        setLoading(false);
      })
      .catch((error) => {
        console.log("error getAssignmentAndStaff", error);
        setLoading(false);
      });
  }
  useEffect(() => {
    if (!data) {
      getAssignmentAndStaff();
    }
    if (data) {
      getProjectName();
    }
  }, [data]);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Row style={{ marginBottom: "20px" }}>
        <Title level={3}>Phân công {data?.fullName}</Title>
      </Row>
      <Row justify="space-between" style={{ marginBottom: "10px" }}>
        <RangePicker
          defaultValue={[moment(dateColumnStart), moment(dateColumnEnd)]}
          placement="bottomRight"
          onChange={(dates) => {
            setDateColumnStart(dates[0]);
            setDateColumnEnd(dates[1]);
          }}
        />
        <Button type="primary">
          <Link to={`/create-assignment?idStaff=${idStaff}`} state={{ data }}>
            Thêm mới
          </Link>
        </Button>
      </Row>

      <Table
        scroll={{
          x: 240,
        }}
        dataSource={projects}
        pagination={{ pageSize: 6 }}
        rowKey={(data) => data?.projectName}
        columns={columnAssignments}
      />
      <Row justify="space-between">
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

export default DetailAssignment;
