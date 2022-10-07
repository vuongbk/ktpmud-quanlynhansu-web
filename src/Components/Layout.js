import { Button, PageHeader } from 'antd';
import { Outlet, Link } from "react-router-dom";
import React from 'react';

const Layout = () => (
  <>
    <div className="site-page-header-ghost-wrapper">
        <PageHeader
        ghost={true}
        title=<Link to="/">Quản lý nhân sự</Link>
        tags={[
            <Button key="1"><Link to="/assignments">Phân công</Link></Button>,
            <Button key="2"><Link to="/staff">Nhân sự</Link></Button>,
            <Button key="3">Dự án</Button>,
            <Button key="4">kỹ năng</Button>,
        ]}
        extra={[
            <Button key="1" type="primary">
            Primary
            </Button>,
        ]}
        >
        </PageHeader>
    </div>
    <Outlet />
  </>
);

export default Layout;