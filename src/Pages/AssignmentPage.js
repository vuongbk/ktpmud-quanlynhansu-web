import { Table, Typography } from "antd";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import Loading from "../Components/Modal/Loading";
const { Title, Text } = Typography;

function AssignmentPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const columnAssignments = [
    {
      title: "Nhân viên",
      dataIndex: "fullName",
      key: "fullName",
      render: (fullName, record) => (
        <>
          <Link to="/detail-assignment" state={{ data: record }}>
            {fullName}
          </Link>
        </>
      ),
    },
    ...getEffortInMonth(),
  ];

  function getEffortInMonth() {
    let curDate = new Date();
    let curMonth = curDate.getMonth() + 1;
    let millisecondsPerDay = 24 * 60 * 60 * 1000;
    let monthArray = [];
    //lấy tổng effort làm trong 1 khoảng ngày
    function getTotalEffort(dateStart, dateEnd, effort) {
      let days = Math.floor((dateEnd - dateStart) / millisecondsPerDay);
      return effort * days;
    }
    for (let j = curMonth - 3; j < curMonth + 6; j++) {
      monthArray.push(j);
    }

    // console.log("assignment 39", monthArray);
    //trả về một mảng các column
    return monthArray.map((month, index) => {
      let currentMonth = Date.parse(
        `${month > 12 ? curDate.getFullYear() + 1 : curDate.getFullYear()}-${
          month <= 9 ? "0" + month : month > 12 ? "0" + (month - 12) : month
        }`
      );
      let nextMonth = Date.parse(
        `${
          month + 1 > 12 ? curDate.getFullYear() + 1 : curDate.getFullYear()
        }-${
          month + 1 <= 9
            ? "0" + (month + 1)
            : month + 1 > 12
            ? "0" + (month + 1 - 12)
            : month + 1
        }`
      );
      function getTitle() {
        let date = new Date(currentMonth);
        let title = date.getMonth() + 1 + "/" + date.getFullYear();
        return title;
      }

      //mỗi column có title, effort
      return {
        title: getTitle,
        dataIndex: "totalEffort",
        render: (totalEffort) => {
          let totalE = totalEffort.reduce((total, value, index) => {
            let dateStart = Date.parse(value.dateStart);
            let dateEnd = Date.parse(value.dateEnd);
            //làm tiếp ở đoạn này, lấy tổng effort theo từng khoảng
            if (dateStart > nextMonth || dateEnd < currentMonth) {
              return (total += 0);
            } else if (dateStart < currentMonth) {
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
            } else if (dateStart > currentMonth) {
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
            <Text style={{ color: totalE < 100 ? "red" : "" }}>{totalE}%</Text>
          );
        },
      };
    });
  }

  async function getAssignmentAndStaff() {
    setLoading(true);
    await Axios.get("/api/assignment-staff", {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzM4NWM4MjkyNzFiMzQ5ZDY4NzQ1MDYiLCJpYXQiOjE2NjYwODY4NjN9.pD3Jes5RcPy-73DaBtqEDn6JLX7KZ90ZzO1sn07j4wk",
      },
    })
      .then((res) => {
        let rawData = res.data.map((value) => {
          return {
            fullName: value[0].fullName,
            idStaff: value[0]._id,
            totalEffort: (function () {
              let effortArrayByMonth = [];
              for (let i = 1; i < value.length; i++) {
                effortArrayByMonth.push({
                  idProject: value[i].idProject,
                  dateStart: value[i].dateStart,
                  dateEnd: value[i].dateEnd,
                  effort: value[i].effort,
                });
              }
              return effortArrayByMonth;
            })(),
          };
        });
        setData(rawData);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error getAssignmentAndStaff", error);
      });
  }

  useEffect(() => {
    if (!data) {
      getAssignmentAndStaff();
    }
  }, [data]);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Title level={3}>Phân công nhân sự</Title>
      <Table
        dataSource={data}
        pagination={{ pageSize: 6 }}
        rowKey={(data) => data.staffName}
        columns={columnAssignments}
      ></Table>
    </>
  );
}

export default AssignmentPage;
