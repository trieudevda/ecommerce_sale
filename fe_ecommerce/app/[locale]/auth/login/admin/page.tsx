"use client"
import React from "react";
import {Button, Card, Checkbox, Divider, Form, Input, notification, Spin, Typography} from "antd";
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/redux/store";
import {useTranslations} from "use-intl";
import {GoogleOutlined, LockOutlined, LoginOutlined, MailOutlined, ShoppingOutlined} from "@ant-design/icons";
import {requestApi} from "@/components/api/be.api";
import {setUser} from "@/src/redux/slices/authSlice";
import {ADMIN_PATHS} from "@/src/path";

const Page = ()=>{
    const [form] = Form.useForm();
    const router = useRouter();
    const dispatch = useDispatch();
    const { isAppLoading } = useSelector((state: RootState) => state.auth);
    const [isLoading, setIsLoading] = React.useState(false);
    const [messageApi, contextHolder] = notification.useNotification();
    const tAuth = useTranslations("Auth");
    const tMess = useTranslations("Message");

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
                    title: tAuth('login'),
                    description: tAuth('login_successful'),

                });
                setTimeout(() => router.push(ADMIN_PATHS.ROLE.LIST()), 2000);
            } else {
                messageApi.error({
                    title: tAuth('login_fail'),
                    description: Array.isArray(res.message) ? res.message[0] : res.message,
                });
            }
        } catch (error) {
            messageApi.error({ title: tMess("Title.error"), description: tAuth('login_fail') });
        } finally {
            setIsLoading(false);
        }
    };
    return <>
        {contextHolder}
        <div className={"box-main min-h-dvh overflow-y-hidden grid grid-cols-1 lg:grid-cols-[1fr_520px]"}>
            <div className={"box-main-left relative overflow-hidden flex items-center justify-center p-8"}>
                <div className={"relative z-2 max-w-lg text-white"}>
                    <div className={"w-20 h-20 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-md bg-white/10"}>
                        <ShoppingOutlined className={"text-4xl text-white"} />
                    </div>
                    <Typography.Title className="!text-white text-4xl mb-5">
                        Ecommerce
                        <br />
                        Admin Dashboard
                    </Typography.Title>
                    <Typography.Paragraph className={"!text-white/80 text-lg leading-relaxed"}>
                        Quản lý đơn hàng,
                        sản phẩm, khách hàng và
                        doanh thu trên một nền
                        tảng hiện đại.
                    </Typography.Paragraph>
                    <div className={"flex gap-5 mt-10 flex-wrap"}>
                        {[
                            {
                                title: "Orders",
                                value: "12K+",
                            },
                            {
                                title: "Customers",
                                value: "8K+",
                            },
                            {
                                title: "Revenue",
                                value: "$250K",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className={"min-w-[130px] p-[20px_24px] rounded-[20px] bg-white/10 backdrop-blur-md"}
                            >
                                <div className={"text-[28px] font-bold text-white"}>
                                    {item.value}
                                </div>
                                <div className={"text-white/75"}>
                                    {item.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={"flex items-center justify-center p-8"}>
                <Card className={"w-full max-w-[430px] rounded-[28px] shadow-[0_15px_50px_rgba(0,0,0,0.08)]"}
                    variant="borderless"
                    styles={{
                        body: {
                            padding: 20,
                        },
                    }}
                >
                    <div  className={"flex items-center gap-3 mb-5"}>
                        <div className={"w-[52px] h-[52px] rounded-[16px] bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center"}>
                            <ShoppingOutlined className={"text-2xl !text-white"} />
                        </div>
                        <div>
                            <Typography.Title level={3} className={"m-0"}>
                                {tAuth('shop_admin')}
                            </Typography.Title>
                        </div>
                    </div>
                    <div className={"mb-4"}>
                        <Typography.Title level={2} className={"mb-2"}>
                            {tAuth('login')}
                        </Typography.Title>
                        <Typography.Text type="secondary">
                            {tAuth('login_to_manage_your_store')}
                        </Typography.Text>
                    </div>
                    <Spin spinning={isLoading}>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            size="large"
                        >
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        type: "email",
                                        message: tAuth('email_fail')
                                    },
                                ]}
                            >
                                <Input
                                    prefix={
                                        <MailOutlined />
                                    }
                                    placeholder="admin@gmail.com"
                                    style={{
                                        height: 52,
                                        borderRadius: 14,
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                label={tAuth('password')}
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: tAuth('please_enter_the_password')
                                    },
                                ]}
                            >
                                <Input.Password
                                    prefix={
                                        <LockOutlined />
                                    }
                                    placeholder="********"
                                    style={{
                                        height: 52,
                                        borderRadius: 14,
                                    }}
                                />
                            </Form.Item>
                            <div className={"flex justify-between mb-6"}>
                                <Checkbox>
                                    {tAuth('remember_me')}
                                </Checkbox>
                                <a href="#">
                                    {tAuth('forgot_your_password')}
                                </a>
                            </div>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    size="large"
                                    icon={
                                        <LoginOutlined />
                                    }
                                    loading={
                                        isLoading
                                    }
                                    className={"h-[54px] rounded-[16px] text-[16px] font-bold bg-gradient-to-br from-blue-600 to-blue-500"}
                                >
                                    {tAuth('login')}
                                </Button>
                            </Form.Item>
                            <Divider>
                                {tAuth('or')}
                            </Divider>
                            <Button
                                block
                                icon={
                                    <GoogleOutlined />
                                }
                                className={"h-[52px] rounded-[14px] font-semibold"}
                            >
                                {tAuth('sign_in_with_google')}
                            </Button>
                        </Form>
                    </Spin>
                </Card>
            </div>
        </div>
    </>
}
 export default Page