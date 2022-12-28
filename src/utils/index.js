import { Typography } from "antd";

function workingDay(date1, date2) {
  console.log("utls/index 2", date1);
  console.log("utls/index 2", date2);
  let dt1 = Date.parse(date1);
  let dt2 = Date.parse(date2);
  let t7 = Date.parse("1970-01-03"); //ngay t7 đầu tiên
  let millisecondsPerDay = 24 * 60 * 60 * 1000;
  let manmonth = 22;

  //tính số ngày T7, CN
  function numberWeekends(date) {
    let dif = (date - t7) / millisecondsPerDay;
    let week = Math.floor(dif / 7);
    if (dif % 7 === 0) {
      return (week + 1) * 2 - 1;
    } else {
      return (week + 1) * 2;
    }
  }
  let weekendDays = numberWeekends(dt2) - numberWeekends(dt1);
  let mm =
    (Math.floor((dt2 - dt1) / millisecondsPerDay) - weekendDays) / manmonth;
  return mm;
}

const listRole = [
  "Admin",
  "BA",
  "CEO",
  "Cộng tác viên",
  "Kế toán",
  "Lập trình viên",
  "Leader",
  "Tester",
  "Thực tập sinh",
];

const roleAdmin = "Admin";
const TitleTable = (props) => {
  return (
    <Typography.Title level={5} style={{ margin: 0, fontSize: "1.25em" }}>
      {props.value}
    </Typography.Title>
  );
};
const TitleModal = (props) => {
  return <Typography.Title level={4}>{props.value}</Typography.Title>;
};

export { listRole, roleAdmin, TitleTable, TitleModal };
export default workingDay;
