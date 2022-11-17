import { Table, Typography, Input, Space, Button, InputNumber } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import Loading from "../Components/Modal/Loading";
import { getToken } from "../Components/useToken";
const { Title, Text } = Typography;

function SkillPage() {
  const [data, setData] = useState(null);
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [loading, setLoading] = useState(false);
  const [levelSkillChange, setLevelSkillChange] = useState([]);
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
          <Link to="/edit-staff" state={{ data: record }}>
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
  const skillArray = [
    "Java",
    ".Net",
    "PHP",
    "Android",
    "iOS",
    "Angular",
    "NodeJS",
    "MongoDB",
    "Python",
    "React",
    "React-Native",
    "Xamarin",
    "C/ C++",
  ];

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
      fixed: "left",
      render: (fullName, record) => (
        <>
          <Link to="/edit-staff" state={{ data: record }}>
            {fullName}
          </Link>
        </>
      ),
      ...getColumnSearchProps("fullName"),
    },
    ...getSkill(),
    {
      title: "Thao tác",
      fixed: "right",
      width: 125,
      render: () => {
        return <Button onClick={handleSubmit}>Cập nhật</Button>;
      },
    },
  ];
  function handleSubmit() {
    if (JSON.stringify(levelSkillChange) !== "[]") {
      levelSkillChange.forEach(async (value, index) => {
        setLoading(true);
        console.log("172", value);
        await Axios.put(
          `/api/level-skill/${value.idLevelSkill}`,
          { levelSkill: value.levelSkill },
          {
            headers: {
              Authorization: "Bearer " + getToken(),
            },
          }
        );
        setLoading(false);
      });
    } else {
      window.alert("ko co thay doi");
    }
  }
  function handleChange(value, idLevelSkill) {
    setLevelSkillChange((d) => [
      ...d,
      { levelSkill: value, idLevelSkill: idLevelSkill },
    ]);
  }
  function getSkill() {
    return skillArray.map((nameSkill, index) => {
      return {
        title: nameSkill,
        width: 150,
        dataIndex: "idSkills",
        render: (idSkills, record) => {
          let isSkill = idSkills.find((skill) => skill.skillName === nameSkill);
          if (isSkill) {
            return (
              <InputNumber
                min={0}
                max={5}
                defaultValue={isSkill.level}
                onChange={(value) => {
                  handleChange(value, isSkill._id);
                }}
              />
            );
          }
        },
      };
    });
  }
  async function getNameSkillAndStaff() {
    setLoading(true);
    await Axios.get("/api/name-of-staff-and-skill", {
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    })
      .then((res) => {
        setLoading(false);
        setData(res.data.staffSkill);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error getNameSkillAndStaff", error);
      });
  }

  console.log("skillpage 160", data);
  React.useEffect(() => {
    getNameSkillAndStaff();
  }, []);
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Title level={3}>Danh sách các kỹ năng của nhân viên</Title>
      <Table
        dataSource={data}
        pagination={{ pageSize: 4 }}
        rowKey={(data) => data.email}
        columns={columns}
        scroll={{
          x: 1000,
        }}
      />
    </>
  );
}

export default SkillPage;
