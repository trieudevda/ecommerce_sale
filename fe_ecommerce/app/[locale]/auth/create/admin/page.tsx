'use client'
import {useParams, useRouter} from 'next/navigation';

import React from "react";
import {requestApi} from "@/components/api/be.api";
import {Button, Card, Checkbox, Form, Input, notification, Spin, Typography} from "antd";
import {LockOutlined, LoginOutlined, MailOutlined, ShoppingOutlined, UserOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/redux/store";
import {useTranslations} from "use-intl";
// import { useRouter } from 'next/navigation';

const Page = ()=>{
    const dispatch = useDispatch();
    const { user, isAuthenticated, isAppLoading } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [isLoading, setIsLoading] = React.useState(false);
    const [messageApi, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();
    const tAuth = useTranslations("Auth");
    const tMess = useTranslations("Message");
    // const t = useTranslations("Auth");
    React.useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res: any = await requestApi('user/find', { method: 'GET', params:{id} });
                if (res && !res.statusCode) {
                    form.setFieldsValue({
                        ...res,
                        dateOfBirth: res.dateOfBirth ? dayjs(res.dateOfBirth) : null,
                    });
                } else {
                    messageApi.error({ title: 'Lỗi', description: res.message || 'Không tìm thấy người dùng' });
                }
            } catch (error) {
                messageApi.error({ title: 'Lỗi kết nối', description: 'Không thể lấy dữ liệu từ server' });
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchUserData();
    }, [id, form, messageApi]);
    const onFinish = async (values: any) => {
        if(values.password !== values.repassword) {
            messageApi.error({
                title: tAuth('password'),
                description: tAuth('t_match'),
            });
            return;
        }
        setIsLoading(true);
        try {
            const res: any = await requestApi(`user`, {
                method: 'POST',
                body: JSON.stringify(values),
            });

            if (res && !res.statusCode) {
                messageApi.success({
                    title: tAuth('successfully'),
                    description: tAuth('user_added_successfully'),
                });
                setTimeout(() => router.push('/admin/user'), 1500);
            } else {
                messageApi.error({
                    title: tAuth('adding_users_failed'),
                    description: Array.isArray(res.message) ? res.message[0] : res.message,
                });
            }
        } catch (error) {
            messageApi.error({ title: tAuth('error'), description: tAuth('error_when_adding_user') });
        } finally {
            setIsLoading(false);
        }
    };
    return <>
        {contextHolder}

        <div className="min-h-dvh grid grid-cols-1 lg:grid-cols-[1fr_520px] bg-[#f5f7fb]">
            {/* LEFT */}
            <div className="relative overflow-hidden flex items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-blue-600">
                <div className="relative z-10 max-w-lg text-white">

                    <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-md bg-white/10">
                        <ShoppingOutlined className="text-4xl text-white" />
                    </div>

                    <Typography.Title className="!text-white text-4xl mb-5">
                        {tAuth('create_account')}
                        <br />
                        Ecommerce Admin
                    </Typography.Title>

                    <Typography.Paragraph className="!text-white/80 text-lg leading-relaxed">
                        Đăng ký tài khoản để quản lý cửa hàng, sản phẩm, đơn hàng và doanh thu của bạn.
                    </Typography.Paragraph>

                    <div className="flex gap-5 mt-10 flex-wrap">
                        {[
                            { title: "Stores", value: "1K+" },
                            { title: "Users", value: "10K+" },
                            { title: "Orders", value: "50K+" },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="min-w-[130px] p-[20px_24px] rounded-[20px] bg-white/10 backdrop-blur-md"
                            >
                                <div className="text-[28px] font-bold text-white">
                                    {item.value}
                                </div>
                                <div className="text-white/75">{item.title}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center justify-center p-8">

                <Card
                    className="w-full max-w-[430px] rounded-[28px] shadow-[0_15px_50px_rgba(0,0,0,0.08)]"
                    variant="borderless"
                    styles={{ body: { padding: 20 } }}
                >

                    {/* HEADER */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-[52px] h-[52px] rounded-[16px] bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center">
                            <UserOutlined className="text-2xl !text-white" />
                        </div>

                        <Typography.Title level={3} className="m-0">
                            {tAuth("register")}
                        </Typography.Title>
                    </div>

                    <div className="mb-4">
                        <Typography.Title level={2} className="mb-2">
                            Create Account
                        </Typography.Title>

                        <Typography.Text type="secondary">
                            Register to start managing your store
                        </Typography.Text>
                    </div>

                    {/* FORM */}
                    <Spin spinning={isLoading}>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            size="large"
                        >

                            {/* NAME */}
                            <Form.Item
                                label="Full Name"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter your name",
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="John Doe"
                                    style={{
                                        height: 52,
                                        borderRadius: 14,
                                    }}
                                />
                            </Form.Item>

                            {/* EMAIL */}
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        type: "email",
                                        message: tAuth("email_fail"),
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="admin@gmail.com"
                                    style={{
                                        height: 52,
                                        borderRadius: 14,
                                    }}
                                />
                            </Form.Item>

                            {/* PASSWORD */}
                            <Form.Item
                                label={tAuth("password")}
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: tAuth("please_enter_the_password"),
                                    },
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="********"
                                    style={{
                                        height: 52,
                                        borderRadius: 14,
                                    }}
                                />
                            </Form.Item>

                            {/* CONFIRM PASSWORD */}
                            <Form.Item
                                label="Confirm Password"
                                name="confirmPassword"
                                dependencies={["password"]}
                                rules={[
                                    { required: true, message: "Confirm your password" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue("password") === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error("Passwords do not match")
                                            );
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="********"
                                    style={{
                                        height: 52,
                                        borderRadius: 14,
                                    }}
                                />
                            </Form.Item>

                            {/* TERMS */}
                            <div className="flex justify-between mb-6">
                                <Checkbox>I agree to terms</Checkbox>
                            </div>

                            {/* SUBMIT */}
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    size="large"
                                    icon={<LoginOutlined />}
                                    loading={isLoading}
                                    className="h-[54px] rounded-[16px] text-[16px] font-bold bg-gradient-to-br from-blue-600 to-blue-500"
                                >
                                    {tAuth("register")}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Spin>

                </Card>
            </div>
        </div>
    </>
}
export default Page