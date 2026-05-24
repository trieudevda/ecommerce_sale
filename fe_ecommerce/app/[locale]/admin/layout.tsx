'use client'
import {Button, Layout, Menu, notification, Spin, theme} from "antd";
import {LoadingOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import React, {useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/redux/store";
import {sidebarAdmin} from "@/src/custom/menu-admin/sidebar-admin";
import {AuthProvider} from "@/app/AuthProvider";
import {requestApi} from "@/components/api/be.api";
import {useRouter} from "next/navigation";
import {useTranslations} from "use-intl";
import {ADMIN_PATHS} from "@/src/path";
import {setLogout} from "@/src/redux/slices/authSlice";

export default  function AdminLayout({children}: {
    children: React.ReactNode;
}) {
    const userId = useSelector((state: RootState) => state.auth.user?.sub) || '';
    const { Header, Sider, Content } = Layout;
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const [collapsed, setCollapsed] = React.useState(false);
    const [messageApi, contextHolder] = notification.useNotification();
    const router = useRouter();
    const tAuth = useTranslations("Auth");
    const tMess = useTranslations("Message");
    const menuAdmin = useMemo(()=>sidebarAdmin(userId),[userId]);
    const logout = async () => {
        const res: any = await requestApi(`auth/logout`, {
            method: 'POST',
        });
        if (res && res.status == 'success') {
            dispatch(setLogout())
            messageApi.success({
                title: tMess('Title.success'),
                description: tMess('Description.logout_successful'),
            });
            setTimeout(() => router.push(ADMIN_PATHS.AUTH.LOGIN()), 1500);
        } else {
            messageApi.error({
                title: tMess('Title.fail'),
                description: Array.isArray(res.message) ? res.message[0] : res.message,
            });
        }
    }
    return <AuthProvider>
        <Layout>
            {contextHolder}
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={menuAdmin}
                />
                <Button type={'dashed'} icon={<LogoutOutlined />} onClick={logout}>{tAuth('logout')}</Button>
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