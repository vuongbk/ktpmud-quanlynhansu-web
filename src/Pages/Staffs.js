import { Table} from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const { Column} = Table;



function Staffs() {

    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        fetch("/api/staff")
        .then((res) => res.json())
        .then((data) => {
            setData(data)
        });
    }, []);
    return (
        <>
            <h2>Danh sách nhân viên</h2>
            
            <Table dataSource={data} pagination={{pageSize: 4}}>
                <Column 
                    title="Họ và tên" 
                    dataIndex="fullName" 
                    key="fullName"
                    render={(fullName) => (
                        <Link  to="/edit-staff">{fullName}</Link>
                    )}    
                />
                <Column title="Điện thoại" dataIndex="phoneNumber" key="phoneNumber" />
                <Column title="Email" dataIndex="email" key="email" />
                <Column title="Ngày vào làm" dataIndex="startTL" key="startTL" />
                <Column title="Phòng ban" dataIndex="department" key="department" />
                <Column title="Vị trí" dataIndex="role" key="role" />
                <Column title="Trạng thái" dataIndex="status" key="status" />
                <Column title="Cấp bậc" dataIndex="level" key="level" />
                <Column title="Giới tính" dataIndex="sex" key="sex" />
                
            </Table>

        </>
    )
}

export default Staffs