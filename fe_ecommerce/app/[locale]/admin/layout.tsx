'use client'
import {Button, Layout, Menu, Spin, theme} from "antd";
import {LoadingOutlined, MenuFoldOutlined, MenuUnfoldOutlined,} from "@ant-design/icons";
import React, {useMemo} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/src/redux/store";
import {sidebarAdmin} from "@/src/custom/menu-admin/sidebar-admin";
import {AuthProvider} from "@/app/AuthProvider";

export default  function AdminLayout({children}: {
    children: React.ReactNode;
}) {
    const userId = useSelector((state: RootState) => state.auth.user?.sub) || '';
    const { Header, Sider, Content } = Layout;
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [collapsed, setCollapsed] = React.useState(false);
    const menuAdmin = useMemo(()=>sidebarAdmin(userId),[userId]);
    return <AuthProvider>
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={menuAdmin}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {
                        isAuthenticated
                         ? children
                         : <><Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} /></>

                    }
                </Content>
            </Layout>
    </Layout>
    </AuthProvider>
}