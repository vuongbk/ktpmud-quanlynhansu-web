import { Button, Row, Table, Typography } from "antd";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import Loading from "../Components/Modal/Loading";
import { getToken } from "../Components/useToken";
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
  // const navigate = useNavigate();

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
      };
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
        setData(res.data);
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
      <Row justify="space-between">
        <Title level={3}>Phân công nhân sự</Title>
        <Button type="primary">
          <Link to="/create-assignment">Thêm mới</Link>
        </Button>
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
