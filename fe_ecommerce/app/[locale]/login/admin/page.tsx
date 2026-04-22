"use client"
import React, {useState} from "react";
import {requestApi} from "@/components/api/be.api";
import {Button, Card, DatePicker, Form, Input, notification, Select, Spin} from "antd";
import {SaveOutlined} from "@ant-design/icons";
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/redux/store";
import {setUser} from "@/src/redux/slices/authSlice";

const Page = ()=>{
    const [form] = Form.useForm();
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, isAuthenticated, isAppLoading } = useSelector((state: RootState) => state.auth);
    const [isLoading, setIsLoading] = React.useState(false);
    const [messageApi, contextHolder] = notification.useNotification();

    const onFinish = async (values: any) => {
        setIsLoading(true);
        try {
            const res: any = await requestApi(`auth/login`, {
                method: 'POST',
                body: JSON.stringify(values),
            });
            if (res && res.user) {
                dispatch(setUser(res.user));
                messageApi.success({
                    title: 'Đăng nhập',
                    description: 'Đăng nhập thành công, trang sẽ chuyển sau 2s!',

                });
                setTimeout(() => router.push('/admin/user'), 2000);
            } else {
                messageApi.error({
                    title: 'Đăng nhập thất bại',
                    description: Array.isArray(res.message) ? res.message[0] : res.message,
                });
            }
        } catch (error) {
            messageApi.error({ title: 'Lỗi', description: 'Đăng nhập thất bại!' });
        } finally {
            setIsLoading(false);
        }
    };
    if (isAppLoading) {
        return <div>Đang kiểm tra quyền truy cập...</div>;
    }
    return <>
        {contextHolder}
        {isAuthenticated ? `Chào, ${user.email}` : 'Bạn chưa đăng nhập'}
        <Card title={"Đăng nhập"}>
            <Spin spinning={isLoading}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}
                    >
                        <Input placeholder="example@gmail.com" />
                    </Form.Item>
                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: 'Mật khẩu không hợp lệ!' }]}
                    >
                        <Input.Password placeholder="********" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </Card>
    </>
}
 export default Page