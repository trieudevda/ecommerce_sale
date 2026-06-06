'use client'
import {useRouter} from "next/navigation";
import React from "react";
import {Button, Card, ConfigProvider, Form, Input, notification, Spin, Typography} from "antd";
import {
    ArrowLeftOutlined,
    DatabaseOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SaveOutlined,
    TagsOutlined
} from "@ant-design/icons";
import {useTranslations} from "use-intl";
import {requestApi} from "@/components/api/be.api";

const Page = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [messageApi, contextHolder] = notification.useNotification();
    const t = useTranslations("Product.Category.Attribute");
    const tMess = useTranslations("Message");
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        setIsLoading(true);
        try {
            const res: any = await requestApi(`category-attribute`, {
                method: 'POST',
                body: JSON.stringify(values),
            });
            if (res && res.data) {
                form.resetFields();
                messageApi.success({
                    title: tMess('Title.info'),
                    description: tMess('Description.data_added_successfully'),
                });
                setTimeout(() => router.back(), 1500); // Quay lại trang danh sách sau khi thêm thành công
            } else {
                messageApi.error({
                    title: tMess('Title.info'),
                    description: Array.isArray(res.message) ? res.message[0] : res.message,
                });
            }
        } catch (error) {
            messageApi.error({
                title: tMess('Title.error'),
                description: tMess('Description.An_error_occurred_while_saving_the_data')
            });
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
                    Card: { paddingLG: 24 },
                    Form: { itemMarginBottom: 20 },
                    Input: { controlHeight: 44, colorBgContainer: '#f8fafc' },
                    Button: { controlHeight: 44 }
                },
            }}
        >
            {contextHolder}
            <div className="min-h-screen bg-slate-50/50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50/50 to-slate-50 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-700">
                <div className="max-w-[1200px] mx-auto">

                    {/* Header Trang */}
                    <div className="flex items-center gap-4 mb-6">
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => router.back()}
                            className="flex items-center justify-center rounded-xl border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
                        />
                        <div>
                            <Typography.Title level={2} className="!mb-0 !text-2xl !font-extrabold tracking-tight text-slate-800">
                                {t('create') || 'Thêm thuộc tính mới'}
                            </Typography.Title>
                            <p className="text-slate-500 text-sm mt-1">
                                {t('create_dynamic_properties')}
                            </p>
                        </div>
                    </div>

                    <Spin spinning={isLoading}>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            autoComplete="off"
                            className="w-full"
                        >
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex-1 flex flex-col gap-6">
                                    <Card variant="borderless" className="rounded-[24px] shadow-sm ring-1 ring-slate-900/5 bg-white h-full">
                                        <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold text-lg">
                                            <EditOutlined className="text-blue-500" />{t('general_information')}
                                        </div>
                                        <Form.Item
                                            label={<span className="text-slate-600 font-medium">{t('name')}</span>}
                                            name="name"
                                            rules={[{ required: true, message: t('please_enter_name') }]}
                                        >
                                            <Input prefix={<TagsOutlined className="text-slate-400 mr-1" />} placeholder={t('for_example_color_memory_capacity')} className="hover:border-blue-400 focus:border-blue-500" />
                                        </Form.Item>
                                        <Form.Item
                                            label={<span className="text-slate-600 font-medium">{t('description')}</span>}
                                            name="description"
                                            rules={[{ required: true, message: t('please_enter_description') }]}
                                            className="mb-0"
                                        >
                                            <Input.TextArea rows={5} placeholder={t('describe_the_function_of_the_attribute')} className="bg-slate-50 hover:border-blue-400 focus:border-blue-500 rounded-lg p-3" />
                                        </Form.Item>
                                    </Card>
                                </div>
                                <div className="w-full lg:w-[450px] flex flex-col gap-6 shrink-0">
                                    <Card variant="borderless" className="rounded-[24px] shadow-sm ring-1 ring-slate-900/5 bg-white">
                                        <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold text-lg">
                                            <DatabaseOutlined className="text-blue-500" />{t('list_of_values')}
                                        </div>
                                        <p className="text-sm text-slate-500 mb-6">
                                            {t('declare_default_values_for_this_property')}
                                        </p>
                                        <Form.List
                                            name="values"
                                            rules={[
                                                {
                                                    validator: async (_, names) => {
                                                        if (!names || names.length < 1) {
                                                            return Promise.reject(new Error(t('there_must_be_at_least_one_value') || 'Phải có ít nhất 1 giá trị'));
                                                        }
                                                    },
                                                },
                                            ]}
                                        >
                                            {(fields, { add, remove }, { errors }) => (
                                                <div className="flex flex-col gap-3">
                                                    {fields.map((field, index) => (
                                                        <div key={field.key} className="flex items-start gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                                            <div className="flex-1">
                                                                <Form.Item
                                                                    {...field}
                                                                    name={[field.name, 'value']}
                                                                    rules={[{ required: true, message: t('enter_value') || 'Vui lòng nhập giá trị' }]}
                                                                    className="mb-0"
                                                                >
                                                                    <Input placeholder={`Giá trị ${index + 1} (VD: Đỏ / XL / 128GB)`} className="hover:border-blue-400 focus:border-blue-500" />
                                                                </Form.Item>
                                                            </div>
                                                            <Button
                                                                type="text"
                                                                danger
                                                                icon={<DeleteOutlined />}
                                                                onClick={() => remove(field.name)}
                                                                className="h-11 w-11 flex-shrink-0 bg-red-50 hover:bg-red-100 border border-transparent rounded-xl"
                                                            />
                                                        </div>
                                                    ))}

                                                    <Form.Item className="mb-0 mt-2">
                                                        <Button
                                                            type="dashed"
                                                            onClick={() => add()}
                                                            block
                                                            icon={<PlusOutlined />}
                                                            className="h-12 rounded-xl text-blue-600 border-blue-200 hover:border-blue-400 hover:bg-blue-50 bg-slate-50 font-medium"
                                                        >
                                                            {t('add_new_value')}
                                                        </Button>
                                                        <Form.ErrorList errors={errors} className="mt-2 text-red-500" />
                                                    </Form.Item>
                                                </div>
                                            )}
                                        </Form.List>
                                    </Card>
                                    <div className="flex justify-end gap-3 mt-2">
                                        <Button
                                            onClick={() => router.back()}
                                            className="flex-1 h-12 rounded-xl text-slate-600 font-medium hover:bg-slate-50 border-slate-200"
                                        >
                                            {t('cancel')}
                                        </Button>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            icon={<SaveOutlined />}
                                            loading={isLoading}
                                            className="flex-1 h-12 rounded-xl font-semibold bg-blue-600 hover:bg-blue-500 border-0 shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:-translate-y-0.5 transition-all"
                                        >
                                            {t('save')}
                                        </Button>
                                    </div>
                                </div>

                            </div>
                        </Form>
                    </Spin>
                </div>
            </div>
        </ConfigProvider>
    );
}

export default Page;
// 'use client'
// import React from "react";
// import {Button, Card, Form, Input, notification, Space, Spin} from "antd";
// import {MinusCircleOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
// import {useTranslations} from "use-intl";
// import {requestApi} from "@/components/api/be.api";
// import LoadingAdmin from "@/components/templates/admin/loading/loading-admin";
//
// const Page = () => {
//     const [isLoading, setIsLoading] = React.useState(false);
//     const [messageApi, contextHolder] = notification.useNotification();
//     const t = useTranslations("Product.Category.Attribute");
//     const tMess = useTranslations("Message");
//     const [form] = Form.useForm();
//     const onFinish = async (values: object) => {
//         setIsLoading(true);
//         try {
//             const res: object = await requestApi(`category-attribute`, {
//                 method: 'POST',
//                 body: JSON.stringify(values),
//             });
//             if (res && res.data) {
//                 form.resetFields();
//                 messageApi.success({
//                     title: tMess('Title.info'),
//                     description: tMess('Description.data_added_successfully'),
//                 });
//             } else {
//                 messageApi.error({
//                     title: tMess('Title.info'),
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
//         {contextHolder}
//         {
//         isLoading
//             ? LoadingAdmin
//             : <div style={{ maxWidth: 800, margin: '0 auto' }}>
//
//                 <Card title={t('create')}>
//                     <Spin spinning={isLoading}>
//                         <Form
//                             form={form}
//                             layout="vertical"
//                             onFinish={onFinish}
//                             autoComplete="off"
//                         >
//                             <Form.Item
//                                 label={t('name')}
//                                 name="name"
//                                 rules={[{ required: true, message: t('please_enter_name') }]}
//                             >
//                                 <Input placeholder={t('name')} />
//                             </Form.Item>
//                             <Form.Item
//                                 label={t('description')}
//                                 name="description"
//                                 rules={[{ required: true, message: t('please_enter_description') }]}
//                             >
//                                 <Input.TextArea placeholder={t('description')}/>
//                             </Form.Item>
//                             <Form.List
//                                 name="values"
//                                 rules={[
//                                     {
//                                         validator: async (_, names) => {
//                                             if (!names || names.length < 1) {
//                                                 return Promise.reject(new Error(t('there_must_be_at_least_one_value')));
//                                             }
//                                         },
//                                     },
//                                 ]}
//                             >
//                                 {(fields, { add, remove }, { errors }) => (
//                                     <>
//                                         {fields.map((field) => (
//                                             <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
//                                                 <Form.Item
//                                                     {...field}
//                                                     name={[field.name, 'value']} // Map vào mảng object: { value: '...' }
//                                                     rules={[{ required: true, message: t('enter_value') }]}
//                                                 >
//                                                     <Input placeholder="Ví dụ: Đỏ / XL / 128GB" />
//                                                 </Form.Item>
//
//                                                 {/* Nút xóa từng value */}
//                                                 <MinusCircleOutlined onClick={() => remove(field.name)} />
//                                             </Space>
//                                         ))}
//
//                                         {/* Nút thêm mới một dòng value */}
//                                         <Form.Item>
//                                             <Button
//                                                 type="dashed"
//                                                 onClick={() => add()}
//                                                 block
//                                                 icon={<PlusOutlined />}
//                                             >
//                                                 Thêm giá trị
//                                             </Button>
//                                             <Form.ErrorList errors={errors} />
//                                         </Form.Item>
//                                     </>
//                                 )}
//                             </Form.List>
//                             <Form.Item>
//                                 <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isLoading}>
//                                     {t('save')}
//                                 </Button>
//                             </Form.Item>
//                         </Form>
//                     </Spin>
//                 </Card>
//             </div>
//     }
//     </>
// }
// export default Page