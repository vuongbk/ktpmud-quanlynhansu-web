import { Table, Typography, Row, DatePicker } from "antd";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Axios from "axios";
import Loading from "../Components/Modal/Loading";
import moment from "moment";
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

function DetailAssignment() {
  const [data, setData] = useState(useLocation().state.data);
  // const [dateStartEnd]
  const [projects, setProjects] = useState([]); //
  const [loading, setLoading] = useState(false);
  const columnAssignments = [
    {
      title: "Dự án",
      dataIndex: "projectName",
      render: (projectName, record) => {
        return (
          <Link to="/detail-assignment" state={{ data: record }}>
            {projectName}
          </Link>
        );
      },
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
      //lấy tháng hiện tại cột đang xet
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
        title: getTitle(),
        dataIndex: "totalEffort",
        render: (totalEffort) => {
          let total = 0;
          let dateStart = Date.parse(totalEffort.dateStart);
          let dateEnd = Date.parse(totalEffort.dateEnd);
          //làm tiếp ở đoạn này, lấy tổng effort theo từng khoảng
          if (dateStart > nextMonth || dateEnd < currentMonth) {
            total += 0;
          } else if (dateStart < currentMonth) {
            if (dateEnd >= nextMonth) {
              total += getTotalEffort(
                currentMonth,
                nextMonth,
                totalEffort.effort
              );
            } else {
              total += getTotalEffort(
                currentMonth,
                dateEnd,
                totalEffort.effort
              );
            }
          } else if (dateStart > currentMonth) {
            if (dateEnd < nextMonth) {
              total += getTotalEffort(dateStart, dateEnd, totalEffort.effort);
            } else {
              total += getTotalEffort(dateStart, nextMonth, totalEffort.effort);
            }
          }
          //lấy số ngày trong tháng curMonth
          let dateAmount = (nextMonth - currentMonth) / millisecondsPerDay;
          total = Math.round(total / dateAmount);
          return (
            <Text style={{ color: total < 100 ? "red" : "" }}>{total}%</Text>
          );
        },
      };
    });
  }

  async function getProjectName() {
    setLoading(true);
    let urlGet = "/api/project?";
    data.totalEffort.forEach((value, index, array) => {
      urlGet += "id" + index + "=" + value.idProject;
      if (index !== array.length - 1) {
        urlGet += "&";
      }
    });
    await Axios({
      method: "get",
      url: urlGet,
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzM4NWM4MjkyNzFiMzQ5ZDY4NzQ1MDYiLCJpYXQiOjE2NjYwODY4NjN9.pD3Jes5RcPy-73DaBtqEDn6JLX7KZ90ZzO1sn07j4wk",
      },
    })
      .then((res) => {
        let projects = res.data.infoProjects.map((value, index) => {
          return { ...value, totalEffort: data.totalEffort[index] };
        });
        setProjects(projects);
      })
      .catch((error) => {
        console.log("error detail 41", error);
      });
    setLoading(false);
  }

  useEffect(() => {
    getProjectName();
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Row justify="space-between" style={{ marginBottom: "30px" }}>
        <Title level={3}>Phân công {data.fullName}</Title>
        <RangePicker
          defaultValue={[moment("2022-09"), moment("2022-12")]}
          onChange={(dates) => {
            console.log("detail 157", dates[0].format("YYYY-MM"));
            return <div>{dates[1].date()}</div>;
          }}
        />
      </Row>
      <Table
        dataSource={projects}
        pagination={{ pageSize: 6 }}
        rowKey={(data) => data.projectName}
        columns={columnAssignments}
      ></Table>
    </>
  );
}

export default DetailAssignment;
