"use client"
import React from "react";
import {requestApi} from "@/components/api/be.api";
import {Button, Card, Checkbox, Divider, Form, Input, notification, Spin, Typography} from "antd";
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/redux/store";
import {setUser} from "@/src/redux/slices/authSlice";
import {ADMIN_PATHS} from "@/src/path";
import {useTranslations} from "use-intl";
import {GoogleOutlined, LockOutlined, LoginOutlined, MailOutlined, ShoppingOutlined} from "@ant-design/icons";

const Page = ()=>{
    const [form] = Form.useForm();
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, isAuthenticated, isAppLoading } = useSelector((state: RootState) => state.auth);
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
            messageApi.error({ title: tMess("Title.error"), description: tAuth('login_successful') });
        } finally {
            setIsLoading(false);
        }
    };
    if (isAppLoading) {
        return (
            <div
                style={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Spin size="large" />
            </div>
        );
    }
    return <>
        {contextHolder}
        <div
            style={{
                minHeight: "100dvh",
                overflowY: "hidden",
                display: "grid",
                gridTemplateColumns:
                    "1fr 520px",
                background: "#f5f7fb",
            }}
        >
            {/* LEFT BANNER */}
            <div
                style={{
                    position: "relative",
                    overflow: "hidden",
                    background:
                        "linear-gradient(135deg,#0f172a,#1e3a8a,#2563eb)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: '32px',
                }}
            >
                {/* overlay */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "radial-gradient(circle at top right, rgba(255,255,255,0.15), transparent 30%)",
                    }}
                />

                <div
                    style={{
                        position: "relative",
                        zIndex: 2,
                        maxWidth: 520,
                        color: "#fff",
                    }}
                >
                    <div
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 24,
                            background:
                                "rgba(255,255,255,0.15)",
                            backdropFilter:
                                "blur(10px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                "center",
                            marginBottom: 32,
                        }}
                    >
                        <ShoppingOutlined
                            style={{
                                fontSize: 36,
                                color: "#fff",
                            }}
                        />
                    </div>

                    <Typography.Title
                        style={{
                            color: "#fff",
                            fontSize: 52,
                            lineHeight: 1.2,
                            marginBottom: 20,
                        }}
                    >
                        Ecommerce
                        <br />
                        Admin Dashboard
                    </Typography.Title>

                    <Typography.Paragraph
                        style={{
                            color:
                                "rgba(255,255,255,0.8)",
                            fontSize: 18,
                            lineHeight: 1.8,
                        }}
                    >
                        Quản lý đơn hàng,
                        sản phẩm, khách hàng và
                        doanh thu trên một nền
                        tảng hiện đại.
                    </Typography.Paragraph>

                    {/* fake stats */}
                    <div
                        style={{
                            display: "flex",
                            gap: 20,
                            marginTop: 40,
                            flexWrap: "wrap",
                        }}
                    >
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
                                style={{
                                    minWidth: 130,
                                    padding:
                                        "20px 24px",
                                    borderRadius: 20,
                                    background:
                                        "rgba(255,255,255,0.12)",
                                    backdropFilter:
                                        "blur(8px)",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: 28,
                                        fontWeight: 700,
                                        color: "#fff",
                                    }}
                                >
                                    {item.value}
                                </div>

                                <div
                                    style={{
                                        color:
                                            "rgba(255,255,255,0.75)",
                                    }}
                                >
                                    {item.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT LOGIN */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 32,
                }}
            >
                <Card
                    bordered={false}
                    style={{
                        width: "100%",
                        maxWidth: 430,
                        borderRadius: 28,
                        boxShadow:
                            "0 15px 50px rgba(0,0,0,0.08)",
                    }}
                    styles={{
                        body: {
                            padding: 20,
                        },
                    }}
                >
                    {/* logo */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            marginBottom: 20,
                        }}
                    >
                        <div
                            style={{
                                width: 52,
                                height: 52,
                                borderRadius: 16,
                                background:
                                    "linear-gradient(135deg,#2563eb,#3b82f6)",
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                            }}
                        >
                            <ShoppingOutlined
                                style={{
                                    color: "#fff",
                                    fontSize: 24,
                                }}
                            />
                        </div>

                        <div>
                            <Typography.Title
                                level={3}
                                style={{
                                    margin: 0,
                                }}
                            >
                                Shop Admin
                            </Typography.Title>

                            <Typography.Text
                                type="secondary"
                            >
                                Ecommerce CMS
                            </Typography.Text>
                        </div>
                    </div>

                    <div
                        style={{
                            marginBottom: 16,
                        }}
                    >
                        <Typography.Title
                            level={2}
                            style={{
                                marginBottom: 8,
                            }}
                        >
                            Đăng nhập
                        </Typography.Title>

                        <Typography.Text
                            type="secondary"
                        >
                            Đăng nhập để quản lý
                            cửa hàng của bạn
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
                                        message:
                                            "Email không hợp lệ",
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
                                label="Mật khẩu"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Vui lòng nhập mật khẩu",
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

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    marginBottom: 24,
                                }}
                            >
                                <Checkbox>
                                    Ghi nhớ đăng nhập
                                </Checkbox>

                                <a href="#">
                                    Quên mật khẩu?
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
                                    style={{
                                        height: 54,
                                        borderRadius: 16,
                                        fontSize: 16,
                                        fontWeight: 700,
                                        background:
                                            "linear-gradient(135deg,#2563eb,#3b82f6)",
                                    }}
                                >
                                    Đăng nhập
                                </Button>
                            </Form.Item>

                            <Divider>
                                Hoặc tiếp tục với
                            </Divider>

                            <Button
                                block
                                icon={
                                    <GoogleOutlined />
                                }
                                style={{
                                    height: 52,
                                    borderRadius: 14,
                                    fontWeight: 600,
                                }}
                            >
                                Đăng nhập với Google
                            </Button>
                        </Form>
                    </Spin>
                </Card>
            </div>
        </div>
    </>
}
 export default Page