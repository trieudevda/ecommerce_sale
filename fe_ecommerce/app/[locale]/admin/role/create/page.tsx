'use client'
import {useRouter} from 'next/navigation';
import React from "react";
import {Button, Card, ConfigProvider, Form, Input, notification, Spin, Typography} from "antd";
import {
    ArrowLeftOutlined,
    EditOutlined,
    SafetyCertificateOutlined,
    SaveOutlined,
    TagsOutlined
} from "@ant-design/icons";
import {useTranslations} from "use-intl";
import {requestApi} from "@/components/api/be.api";

const Page = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [messageApi, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();
    const t = useTranslations("Role.CRUD");
    const tMess = useTranslations("Message");

    const onFinish = async (values: any) => {
        setIsLoading(true);
        try {
            const res: any = await requestApi(`roles`, {
                method: 'POST',
                body: JSON.stringify(values),
            });

            if (res && !res.statusCode) {
                messageApi.success({
                    title: tMess('Title.info'),
                    description: tMess('Description.data_added_successfully'),
                });
                form.resetFields();
                setTimeout(() => router.back(), 1000);
            } else {
                messageApi.error({
                    title: tMess('Title.error'),
                    description: Array.isArray(res.message) ? res.message[0] : res.message,
                });
            }
        } catch (error) {
            messageApi.error({ title: tMess('Title.error'), description: tMess('Description.An_error_occurred_while_saving_the_data') });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#2563eb',
                    colorTextBase: '#334155',
                    fontFamily: 'inherit',
                    borderRadius: 8
                },
                components: {
                    Card: { paddingLG: 32 },
                    Form: { itemMarginBottom: 20 },
                    Input: { controlHeight: 44, colorBgContainer: '#f8fafc' },
                    Button: { controlHeight: 44 }
                },
            }}
        >
            {contextHolder}
            <div className="min-h-screen bg-slate-50/50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50/50 to-slate-50 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-700">
                <div className="max-w-xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => router.back()}
                            className="flex items-center justify-center rounded-xl border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
                        />
                        <div>
                            <Typography.Title level={2} className="!mb-0 !text-2xl !font-extrabold tracking-tight text-slate-800">
                                {t("create")}
                            </Typography.Title>
                            <p className="text-slate-500 text-sm mt-1">
                                {t('create_a_new_system_administrator_role')}
                            </p>
                        </div>
                    </div>
                    <Card
                        variant="borderless"
                        className="rounded-[24px] shadow-sm ring-1 ring-slate-900/5 bg-white overflow-hidden"
                    >
                        <Spin spinning={isLoading}>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                autoComplete="off"
                                className="w-full"
                            >
                                <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold text-lg">
                                    <SafetyCertificateOutlined className="text-blue-500" />{t('role_information')}
                                </div>
                                <Form.Item
                                    label={<span className="text-slate-600 font-medium">{t("name")}</span>}
                                    name="name"
                                    rules={[{ required: true, message: t('please_enter_your_role_name') }]}
                                >
                                    <Input prefix={<EditOutlined className="text-slate-400 mr-1" />} placeholder={t("name")} className="hover:border-blue-400 focus:border-blue-500" />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="text-slate-600 font-medium">{t('slug')}</span>}
                                    name="slug"
                                    rules={[{ required: true, message: t('please_enter_your_role_initials') }]}
                                >
                                    <Input prefix={<TagsOutlined className="text-slate-400 mr-1" />} placeholder={t('slug')} className="hover:border-blue-400 focus:border-blue-500" />
                                </Form.Item>

                                <div className="flex justify-end gap-3 mt-8">
                                    <Button
                                        onClick={() => router.back()}
                                        className="h-12 px-8 rounded-xl text-slate-600 font-medium hover:bg-slate-50 border-slate-200"
                                    >
                                        {t("cancel")}
                                    </Button>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<SaveOutlined />}
                                        loading={isLoading}
                                        className="h-12 px-10 rounded-xl font-semibold bg-blue-600 hover:bg-blue-500 border-0 shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:-translate-y-0.5 transition-all"
                                    >
                                        {t("save")}
                                    </Button>
                                </div>
                            </Form>
                        </Spin>
                    </Card>
                </div>
            </div>
        </ConfigProvider>
    );
}

export default Page;
// 'use client'
// import {useRouter} from 'next/navigation';
//
// import React from "react";
// import {requestApi} from "@/components/api/be.api";
// import {Button, Card, Form, Input, notification, Space, Spin} from "antd";
// import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
// import {useTranslations} from "use-intl";
// // import { useRouter } from 'next/navigation';
//
// const Page = ()=>{
//     const router = useRouter();
//     const [isLoading, setIsLoading] = React.useState(false);
//     const [messageApi, contextHolder] = notification.useNotification();
//     const [form] = Form.useForm();
//     const t = useTranslations("Role.CRUD");
//     const tMess = useTranslations("Message");
//     const onFinish = async (values: any) => {
//         setIsLoading(true);
//         try {
//             const res: any = await requestApi(`roles`, {
//                 method: 'POST',
//                 body: JSON.stringify(values),
//             });
//
//             if (res && !res.statusCode) {
//                 messageApi.success({
//                     title:  tMess('Title.info'),
//                     description: tMess('Description.data_added_successfully'),
//                 });
//                 form.setFieldsValue({name:"",slug:""});
//             } else {
//                 messageApi.error({
//                     title: tMess('Title.error'),
//                     description: Array.isArray(res.message) ? res.message[0] : res.message,
//                 });
//             }
//         } catch (error) {
//             messageApi.error({ title: tMess('Title.error'), description: tMess('Description.An_error_occurred_while_saving_the_data') });
//         } finally {
//             setIsLoading(false);
//         }
//     };
//     return <>
//         <div style={{ maxWidth: 800, margin: '0 auto' }}>
//             {contextHolder}
//             <Space style={{ marginBottom: 16 }}>
//                 <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>Quay lại</Button>
//             </Space>
//             <Card title={t("create")}>
//                 <Spin spinning={isLoading}>
//                     <Form
//                         form={form}
//                         layout="vertical"
//                         onFinish={onFinish}
//                         autoComplete="off"
//                     >
//                         <Form.Item
//                             label={t("name")}
//                             name="name"
//                             rules={[{ required: true, message: t('please_enter_your_role_name') }]}
//                         >
//                             <Input placeholder={t("name")} />
//                         </Form.Item>
//
//                         <Form.Item
//                             label={t('slug')}
//                             name="slug"
//                             rules={[{ required: true, message: t('please_enter_your_role_initials') }]}
//                         >
//                             <Input placeholder={t('slug')} />
//                         </Form.Item>
//
//                         <Form.Item>
//                             <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isLoading}>
//                                 {t("save")}
//                             </Button>
//                         </Form.Item>
//                     </Form>
//                 </Spin>
//             </Card>
//         </div>
//     </>
// }
// export default Page