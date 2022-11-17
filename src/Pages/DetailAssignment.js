import { Table, Typography, Row, DatePicker } from "antd";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Axios from "axios";
import Loading from "../Components/Modal/Loading";
import moment from "moment";
import { getToken } from "../Components/useToken";
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

function DetailAssignment() {
  let curDate = moment();
  const [data, setData] = useState(useLocation().state.data);
  const [dateColumnStart, setDateColumnStart] = useState(
    moment(curDate).subtract(25, "days")
  );
  const [dateColumnEnd, setDateColumnEnd] = useState(
    moment(curDate).add(35, "days")
  );
  const [projects, setProjects] = useState([]);
  console.log("detailassign 21", projects);
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
            to="/edit-assignment"
            state={{
              data: {
                projectName: record.projectName,
                fullName: data.fullName,
                asignmentsList: record.totalEffort,
              },
            }}
          >
            {projectName}
          </Link>
        );
      },
    },
    ...getEffortInMonth(),
  ];
  function getEffortInMonth() {
    let dateColumnList = [];
    for (
      let i = dateColumnStart;
      i.isBefore(dateColumnEnd);
      i = moment(i).add(1, "days")
    ) {
      dateColumnList.push({
        width: "70px",
        title: i.format("DD-MM"),
        dataIndex: "totalEffort",
        render: (totalEffort, record) => {
          // console.log("detail 59", totalEffort);
          // console.log("detail 60", record);
          let indexOfAssignment = 0; //kiểm tra xem ngày cột đang xét (= i) nằm ở assignment nào
          totalEffort.forEach((value, index) => {
            if (
              moment(value.dateStart).isBefore(i) &&
              i.isBefore(moment(value.dateEnd))
            ) {
              indexOfAssignment = index;
            }
          });
          let dateStart = moment(totalEffort[indexOfAssignment].dateStart);
          let dateEnd = moment(totalEffort[indexOfAssignment].dateEnd);
          //làm tiếp ở đoạn này, lấy tổng effort theo từng khoảng
          if (dateStart.isBefore(i) && i.isBefore(dateEnd)) {
            return (
              <Text
                style={{
                  color:
                    totalEffort[indexOfAssignment].effort < 100 ? "red" : "",
                }}
              >
                {totalEffort[indexOfAssignment].effort}%
              </Text>
            );
          } else {
            return <Text style={{ color: "red" }}>0%</Text>;
          }
        },
      });
    }
    return dateColumnList;
    // console.log("assignment 39", monthArray);
    //trả về một mảng các column
    // return monthArray.map((month, index) => {
    //   //lấy tháng hiện tại cột đang xet
    //   let currentMonth = Date.parse(
    //     `${month > 12 ? curDate.getFullYear() + 1 : curDate.getFullYear()}-${
    //       month <= 9 ? "0" + month : month > 12 ? "0" + (month - 12) : month
    //     }`
    //   );
    //   let nextMonth = Date.parse(
    //     `${
    //       month + 1 > 12 ? curDate.getFullYear() + 1 : curDate.getFullYear()
    //     }-${
    //       month + 1 <= 9
    //         ? "0" + (month + 1)
    //         : month + 1 > 12
    //         ? "0" + (month + 1 - 12)
    //         : month + 1
    //     }`
    //   );
    //   function getTitle() {
    //     let date = new Date(currentMonth);
    //     let title = date.getMonth() + 1 + "/" + date.getFullYear();
    //     return title;
    //   }

    //   //mỗi column có title, effort
    //   return {
    //     title: getTitle(),
    //     dataIndex: "totalEffort",
    //     render: (totalEffort) => {
    //       let total = 0;
    //       let dateStart = Date.parse(totalEffort.dateStart);
    //       let dateEnd = Date.parse(totalEffort.dateEnd);
    //       //làm tiếp ở đoạn này, lấy tổng effort theo từng khoảng
    //       if (dateStart > nextMonth || dateEnd < currentMonth) {
    //         total += 0;
    //       } else if (dateStart < currentMonth) {
    //         if (dateEnd >= nextMonth) {
    //           total += getTotalEffort(
    //             currentMonth,
    //             nextMonth,
    //             totalEffort.effort
    //           );
    //         } else {
    //           total += getTotalEffort(
    //             currentMonth,
    //             dateEnd,
    //             totalEffort.effort
    //           );
    //         }
    //       } else if (dateStart > currentMonth) {
    //         if (dateEnd < nextMonth) {
    //           total += getTotalEffort(dateStart, dateEnd, totalEffort.effort);
    //         } else {
    //           total += getTotalEffort(dateStart, nextMonth, totalEffort.effort);
    //         }
    //       }
    //       //lấy số ngày trong tháng curMonth
    //       let dateAmount = (nextMonth - currentMonth) / millisecondsPerDay;
    //       total = Math.round(total / dateAmount);
    //       return (
    //         <Text style={{ color: total < 100 ? "red" : "" }}>{total}%</Text>
    //       );
    //     },
    //   };
    // });
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
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        let projects = res.data.infoProjects.map((value, index) => {
          return {
            ...value,
            totalEffort: data.totalEffort.filter((assign) => {
              return assign.idProject === value._id;
            }),
          };
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
          defaultValue={[moment(dateColumnStart), moment(dateColumnEnd)]}
          placement="bottomRight"
          onChange={(dates) => {
            setDateColumnStart(dates[0]);
            setDateColumnEnd(dates[1]);
            console.log("detail 179", dates[0].format());
          }}
        />
      </Row>

      <Table
        scroll={{
          x: 240,
        }}
        dataSource={projects}
        pagination={{ pageSize: 6 }}
        rowKey={(data) => data.projectName}
        columns={columnAssignments}
      />
    </>
  );
}

export default DetailAssignment;
