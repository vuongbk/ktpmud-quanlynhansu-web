import { Button, Row, Table, Typography, DatePicker, message } from "antd";
import { useState, useLayoutEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import Loading from "../Components/Modal/Loading";
import { getToken } from "../Components/useToken";
import moment from "moment";
import { roleAdmin, TitleTable } from "../utils";
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

function AssignmentPage(props) {
  console.log("assingnmentPage ", props);
  const [infoAccount, setInfoAccount] = useState(props?.infoAccount);
  console.log("assignment 15", infoAccount);
  const [data, setData] = useState();
  const [idProjectOfLeader, setIdProjectOfLeader] = useState();
  const [loading, setLoading] = useState(false);
  const [monthColumnStart, setMonthColumnStart] = useState(
    moment().startOf("month").subtract(3, "months")
  );
  const [monthColumnEnd, setMonthColumnEnd] = useState(
    moment().startOf("month").add(5, "months")
  );
  const monthFormat = "MM-YYYY";

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

  const getProjectsOfLeader = useCallback(async () => {
    //lấy các dự án mà ông này lead
    await Axios({
      method: "get",
      url: "/api/project",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        const listProject = res.data.infoProjects.filter(
          (pj) => pj.idLeader === infoAccount?._id
        );
        let objPj = {}; //lấy các idProject cho làm key của obj
        listProject.forEach((pj) => {
          objPj[pj._id] = 2;
        });
        setIdProjectOfLeader(objPj);
      })
      .catch((error) => {
        message.error(error.response.data.message);
      });
  }, [infoAccount]);

  const columnAssignments = [
    {
      title: <TitleTable value="Nhân viên" />,
      dataIndex: "fullName",
      width: "200px",
      key: "fullName",
      render: (fullName, record) => (
        <>
          <Link
            to={`/detail-assignment/${record.idStaff}`}
            state={{ data: record }}
          >
            {fullName}
          </Link>
        </>
      ),
    },
    ...getEffortInMonth(),
  ];

  function getEffortInMonth() {
    let millisecondsPerDay = 24 * 60 * 60 * 1000;
    let monthArray = [];
    //lấy tổng effort làm trong 1 khoảng ngày
    function getTotalEffort(dateStart, dateEnd, effort) {
      let days = (dateEnd - dateStart) / millisecondsPerDay;
      return effort * days;
    }
    for (
      let j = monthColumnStart.clone();
      j.isSameOrBefore(monthColumnEnd);
      j = j.add(1, "months")
    ) {
      const currentMonth = j.valueOf();
      const nextMonth = j.clone().add(1, "months").valueOf();
      monthArray.push({
        title: <TitleTable value={j.format(monthFormat)} />,
        width: "100px",
        dataIndex: "totalEffort",
        render: (totalEffort) => {
          let totalE = totalEffort.reduce((total, value, index) => {
            let dateStart = Date.parse(value.dateStart);
            let dateEnd = Date.parse(value.dateEnd);
            //làm tiếp ở đoạn này, lấy tổng effort theo từng khoảng
            if (dateStart >= nextMonth || dateEnd <= currentMonth) {
              return (total += 0);
            } else if (dateStart <= currentMonth) {
              if (dateEnd >= nextMonth) {
                return (total += getTotalEffort(
                  currentMonth,
                  nextMonth,
                  value.effort
                ));
              } else {
                return (total += getTotalEffort(
                  currentMonth,
                  dateEnd,
                  value.effort
                ));
              }
            } else {
              if (dateEnd < nextMonth) {
                return (total += getTotalEffort(
                  dateStart,
                  dateEnd,
                  value.effort
                ));
              } else {
                return (total += getTotalEffort(
                  dateStart,
                  nextMonth,
                  value.effort
                ));
              }
            }
          }, 0);
          //lấy số ngày trong tháng curMonth
          let dateAmount = (nextMonth - currentMonth) / millisecondsPerDay;
          totalE = Math.round(totalE / dateAmount);
          return (
            <Text style={{ color: totalE !== 100 ? "red" : "" }}>
              {totalE}%
            </Text>
          );
        },
      });
    }
    return monthArray;
  }
  const getAssignmentAndStaff = useCallback(async () => {
    setLoading(true);
    await Axios.get(
      `/api/assignment-staff?role=${infoAccount?.role}&idLeader=${infoAccount?._id}`,
      {
        headers: {
          Authorization: "Bearer " + getToken(),
        },
      }
    )
      .then((res) => {
        setData(res.data);

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("178 ass ", error);
        message.error(error.response.data.message);
      });
  }, [infoAccount]);

  useLayoutEffect(() => {
    console.log("183 ass ");
    if (!infoAccount) {
      console.log("187 ass ");

      getInfoAccount();
    }
    // if (!idProjectOfLeader && infoAccount) {
    //   getProjectsOfLeader();
    // }
    if (!data && infoAccount) {
      console.log("192 ass", infoAccount);
      getAssignmentAndStaff();
    }
  }, [
    infoAccount,
    idProjectOfLeader,
    data,
    getProjectsOfLeader,
    getAssignmentAndStaff,
    getInfoAccount,
  ]);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Row style={{ marginBottom: "20px" }}>
        <Title level={3}>Phân công nhân sự</Title>
      </Row>
      <Row justify="space-between" style={{ marginBottom: "10px" }}>
        <RangePicker
          picker="month"
          defaultValue={[monthColumnStart, monthColumnEnd]}
          placement="bottomRight"
          format={monthFormat}
          onChange={(dates) => {
            console.log("258", dates);
            setMonthColumnStart(dates[0]);
            setMonthColumnEnd(dates[1]);
          }}
        />
        {/* {infoAccount?.role === roleAdmin && ( */}
        <Button type="primary">
          <Link to="/create-assignment">Thêm mới</Link>
        </Button>
        {/* )} */}
      </Row>

      <Table
        dataSource={data}
        pagination={{ pageSize: 6 }}
        rowKey="idStaff"
        columns={columnAssignments}
      ></Table>
    </>
  );
}

export default AssignmentPage;
