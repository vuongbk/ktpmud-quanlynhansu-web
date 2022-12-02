import { Table, Typography, Input, Space, Button, Row } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import Loading from "../Components/Modal/Loading";
import { getToken } from "../Components/useToken";
import moment from "moment";
const { Title, Text } = Typography;

function Staffs() {
  const navigate = useNavigate();
  const emailRef = React.useRef(null);
  const [data, setData] = useState(null);
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => {
      return (
        <div
          style={{
            padding: 8,
          }}
        >
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: "block",
            }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90,
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{
                width: 90,
              }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({
                  closeDropdown: false,
                });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
          </Space>
        </div>
      );
    },
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text, record) => {
      if (dataIndex === "fullName") {
        return (
          <Link to={`/edit-staff/${record._id}`} state={{ data: record }}>
            {searchedColumn === dataIndex ? (
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            ) : (
              text
            )}
          </Link>
        );
      }
    },
  });

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      ...getColumnSearchProps("fullName"),
    },
    {
      title: "Điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Vị trí",
      dataIndex: "role",
      filters: [
        {
          text: "manager",
          value: "manager",
        },
        {
          text: "boss",
          value: "boss",
        },
        {
          text: "developer",
          value: "developer",
        },
      ],
      onFilter: (value, record) => {
        return record.role === value;
      },
      key: "role",
      responsive: ["sm"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ref: { emailRef },
    },
    {
      title: "Cấp bậc",
      dataIndex: "level",
      key: "level",
      responsive: ["md"],
      filters: [
        {
          text: "Fresher",
          value: "Fresher",
        },
        {
          text: "Junior",
          value: "Junior",
        },
        {
          text: "Senior",
          value: "Senior",
        },
      ],
      onFilter: (value, record) => {
        return record.level === value;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      responsive: ["lg"],
      filters: [
        {
          text: "Nhân viên chính thức",
          value: "Nhân viên chính thức",
        },
        {
          text: "Thực tập",
          value: "Thực tập",
        },
        {
          text: "Đã nghỉ",
          value: "Đã nghỉ",
        },
        {
          text: "Tạm nghỉ",
          value: "Tạm nghỉ",
        },
        {
          text: "Cộng tác viên",
          value: "Cộng tác viên",
        },
      ],
      onFilter: (value, record) => {
        return record.status === value;
      },
    },
    {
      title: "Phòng ban",
      dataIndex: "department",
      key: "department",
      responsive: ["lg"],
      filters: [
        {
          text: "Thanh Hóa",
          value: "Thanh Hóa",
        },
        {
          text: "Hà nội",
          value: "HN",
        },
      ],
      onFilter: (value, record) => {
        return record.department === value;
      },
    },
    {
      title: "Ngày vào làm",
      dataIndex: "startTL",
      key: "startTL",
      responsive: ["xl"],
      render: (text) => moment(text).format("DD-MM-YYYY"),
      sorter: (a, b) => {
        return Date.parse(a.startTL) - Date.parse(b.startTL);
      },
    },
    {
      title: "Giới tính",
      dataIndex: "sex",
      key: "sex",
      responsive: ["xl"],
      filters: [
        {
          text: "Nam",
          value: "male",
        },
        {
          text: "Nữ",
          value: "female",
        },
      ],
      onFilter: (value, record) => {
        return record.sex === value;
      },
    },
  ];

  async function getStaff() {
    setLoading(true);
    await Axios.get("/api/staff", {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("error getStaff", error);
        setLoading(false);
      });
  }

  React.useEffect(() => {
    getStaff();
  }, []);
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Row justify="space-between">
        <Title level={3}>Danh sách nhân viên</Title>
        <Button type="primary" onClick={() => navigate("../../create-staff")}>
          Thêm mới
        </Button>
      </Row>
      <Table
        dataSource={data}
        pagination={{ pageSize: 6 }}
        rowKey="email"
        columns={columns}
      />
    </>
  );
}

export default Staffs;
