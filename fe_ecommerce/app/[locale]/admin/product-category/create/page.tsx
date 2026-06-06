'use client'
import {useParams, useRouter} from 'next/navigation';
import React, {useEffect, useState} from "react";
import {Button, Card, ConfigProvider, Form, Input, notification, Select, Spin, Typography} from "antd";
import {
    AppstoreAddOutlined,
    ArrowLeftOutlined,
    EditOutlined,
    FileTextOutlined,
    GlobalOutlined,
    SaveOutlined,
    TagsOutlined
} from "@ant-design/icons";
import {useTranslations} from "use-intl";
import {requestApi} from "@/components/api/be.api";
import LoadingPage from "@/src/custom/loading-page/loading-page";

const Page = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    const [cate, setCate] = useState([]);
    const [cateType, setCateType] = useState([]);
    const [cateAttr, setCateAttr] = useState([]);

    const [isLoading, setIsLoading] = React.useState(true);
    const [isChildLoading, setIsChildLoading] = useState(false);

    const [messageApi, contextHolder] = notification.useNotification();
    const t = useTranslations("Product.Category");
    const tMess = useTranslations("Message");
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchCateAttr = async () => {
            try {
                const res: any = await requestApi('category-attribute/find-all', { method: 'GET' });
                if (res && !res.statusCode && res !== "undefined") {
                    setCateAttr(res.data);
                }
            } catch (error) {
                messageApi.error({ title: tMess('Title.error'), description: tMess('Description.Unable_to_connect_to_the_server') });
            }
        }

        const fetchCateType = async () => {
            try {
                const res: any = await requestApi('category/enums/ref-types', { method: 'GET' });
                if (res && !res.statusCode && res !== "undefined") {
                    setCateType(res);
                }
            } catch (error) {
                messageApi.error({ title: tMess('Title.error'), description: tMess('Description.Unable_to_connect_to_the_server') });
            } finally {
                setIsLoading(false);
            }
        }

        fetchCateAttr();
        fetchCateType();
    }, [id, form]);

    const fetchCate = async (type: string) => {
        form.setFieldValue('parentId', undefined);
        setCate([]);
        setIsChildLoading(true);
        try {
            const res: any = await requestApi('category/find-all', { method: 'GET', params: { type: type } });
            if (res && !res.statusCode && res !== "undefined") {
                setCate(res.data);
            } else {
                messageApi.error({ title: tMess('Title.error'), description: res.message || tMess('Description.no_role_yet') });
            }
        } catch (error) {
            messageApi.error({ title: tMess('Title.error'), description: tMess('Description.Unable_to_connect_to_the_server') });
        } finally {
            setIsChildLoading(false);
        }
    }

    const onFinish = async (values: any) => {
        setIsLoading(true);
        try {
            const res: any = await requestApi(`category`, {
                method: 'POST',
                body: JSON.stringify(values),
            });
            if (res && !res.statusCode) {
                messageApi.success({
                    title: tMess('Title.success'),
                    description: tMess('category_added_successfully'),
                });
                setTimeout(() => router.back(), 1500);
            } else {
                messageApi.error({
                    title: tMess('Title.fail'),
                    description: Array.isArray(res.message) ? res.message[0] : res.message,
                });
            }
        } catch (error) {
            messageApi.error({ title: tMess('Title.error'), description: tMess('Description.An_error_occurred_while_saving_the_data') });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <LoadingPage />;
    }

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
                    Select: { controlHeight: 44, colorBgContainer: '#f8fafc' },
                    Button: { controlHeight: 44 }
                },
            }}
        >
            {contextHolder}

            <div className="min-h-screen bg-slate-50/50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50/50 to-slate-50 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-700">
                <div className="max-w-[1200px] mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => router.back()}
                            className="flex items-center justify-center rounded-xl border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
                        />
                        <div>
                            <Typography.Title level={2} className="!mb-0 !text-2xl !font-extrabold tracking-tight text-slate-800">
                                {t('create')}
                            </Typography.Title>
                            <p className="text-slate-500 text-sm mt-1">
                                {t('create_new_categories_to_systematically_classify_and_manage_products')}
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
                                    <Card variant="borderless" className="rounded-[24px] shadow-sm ring-1 ring-slate-900/5 bg-white">
                                        <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold text-lg">
                                            <EditOutlined className="text-blue-500" />{t('basic_information')}
                                        </div>

                                        <Form.Item
                                            label={<span className="text-slate-600 font-medium">{t('name')}</span>}
                                            name="name"
                                            rules={[{ required: true, message: t('please_enter_name') }]}
                                        >
                                            <Input prefix={<TagsOutlined className="text-slate-400 mr-1" />} placeholder={t('name')} className="hover:border-blue-400 focus:border-blue-500" />
                                        </Form.Item>

                                        <Form.Item
                                            label={<span className="text-slate-600 font-medium">{t('description')}</span>}
                                            name="description"
                                            className="mb-0"
                                        >
                                            <Input.TextArea rows={4} placeholder={t('description')} className="bg-slate-50 hover:border-blue-400 focus:border-blue-500 rounded-lg p-3" />
                                        </Form.Item>
                                    </Card>
                                    <Card variant="borderless" className="rounded-[24px] shadow-sm ring-1 ring-slate-900/5 bg-white">
                                        <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold text-lg">
                                            <GlobalOutlined className="text-blue-500" /> {t('search_engine_optimization_seo')}
                                        </div>
                                        <Form.Item
                                            label={<span className="text-slate-600 font-medium">{t('metaTitle')}</span>}
                                            name="metaTitle"
                                        >
                                            <Input prefix={<FileTextOutlined className="text-slate-400 mr-1" />} placeholder={t('metaTitle')} className="hover:border-blue-400 focus:border-blue-500" />
                                        </Form.Item>

                                        <Form.Item
                                            label={<span className="text-slate-600 font-medium">{t('metaDescription')}</span>}
                                            name="metaDescription"
                                        >
                                            <Input.TextArea rows={2} placeholder={t('metaDescription')} className="bg-slate-50 hover:border-blue-400 focus:border-blue-500 rounded-lg p-3" />
                                        </Form.Item>

                                        <Form.Item
                                            label={<span className="text-slate-600 font-medium">{t('metaKeywords')}</span>}
                                            name="metaKeywords"
                                            className="mb-0"
                                            help={<span className="text-slate-400 text-xs">{t('keywords_are_separated_by_commas')}</span>}
                                        >
                                            <Input placeholder={t('examples_phones_phone_cases_accessories')} className="hover:border-blue-400 focus:border-blue-500" />
                                        </Form.Item>
                                    </Card>
                                </div>
                                <div className="w-full lg:w-[360px] flex flex-col gap-6 shrink-0">
                                    <Card variant="borderless" className="rounded-[24px] shadow-sm ring-1 ring-slate-900/5 bg-white">
                                        <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold text-lg">
                                            <AppstoreAddOutlined className="text-blue-500" />{t('classification_structure')}
                                        </div>
                                        {cateType && cateType.length > 0 && (
                                            <Form.Item
                                                label={<span className="text-slate-600 font-medium">{t('category_type')}</span>}
                                                name="type"
                                            >
                                                <Select
                                                    placeholder={t('please_select_category_type')}
                                                    onChange={fetchCate}
                                                    options={cateType?.map((item: any) => ({ value: item.value, label: item.label })) || []}
                                                    className="hover:border-blue-400 focus:border-blue-500"
                                                />
                                            </Form.Item>
                                        )}
                                        {cate.length > 0 && (
                                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                <Form.Item
                                                    label={<span className="text-slate-600 font-medium">{t('category_parent')}</span>}
                                                    name="parentId"
                                                >
                                                    <Select
                                                        loading={isChildLoading}
                                                        allowClear
                                                        placeholder={t('please_select_category')}
                                                        options={cate?.map((item: any) => ({ value: item.id, label: item.name })) || []}
                                                        className="hover:border-blue-400 focus:border-blue-500"
                                                    />
                                                </Form.Item>
                                            </div>
                                        )}
                                        {cateAttr && cateAttr.length > 0 && (
                                            <Form.Item
                                                label={<span className="text-slate-600 font-medium">{t('attributes')}</span>}
                                                name="attributeIds"
                                                className="mb-0"
                                            >
                                                <Select
                                                    mode="multiple"
                                                    allowClear
                                                    placeholder={t('please_select_attribute')}
                                                    options={cateAttr?.map((item: any) => ({ value: item.id, label: item.name })) || []}
                                                    className="hover:border-blue-400 focus:border-blue-500"
                                                />
                                            </Form.Item>
                                        )}
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
};

export default Page;
// 'use client'
// import {useParams} from 'next/navigation';
// import React, {useState} from "react";
// import {Button, Card, Form, Input, notification, Select, Spin} from "antd";
// import {SaveOutlined} from "@ant-design/icons";
// import {useTranslations} from "use-intl";
// import {requestApi} from "@/components/api/be.api";
// import LoadingPage from "@/src/custom/loading-page/loading-page";
//
// const Page = () => {
//     const params = useParams();
//     const id = params.id;
//     const [cate, setCate] = useState([]);
//     const [cateType, setCateType] = useState([]);
//     const [cateAttr, setCateAttr] = useState([]);
//     const [isLoading, setIsLoading] = React.useState(false);
//     const [isChildLoading, setIsChildLoading] = useState(false);
//     const [messageApi, contextHolder] = notification.useNotification();
//     const t = useTranslations("Product.Category");
//     const tMess = useTranslations("Message");
//     const [form] = Form.useForm();
//     React.useEffect(() => {
//         const fetchCateAttr = async () => {
//             try {
//                 const res: any = await requestApi('category-attribute/find-all', { method: 'GET' });
//                 if (res && !res.statusCode) {
//                     if (res !== "undefined")
//                         setCateAttr(res.data);
//                 } else {
//                     messageApi.error({ title: tMess('Title.error'), description: res.message || tMess('Description.You_are_not_authorized_to_do_this') });
//                 }
//             } catch (error) {
//                 messageApi.error({ title: tMess('Title.error'), description: tMess('Description.Unable_to_connect_to_the_server') });
//             } finally {
//                 setIsLoading(false);
//             }
//         }
//         const fetchCateType = async () => {
//             try {
//                 const res: any = await requestApi('category/enums/ref-types', { method: 'GET' });
//                 if (res && !res.statusCode) {
//                     if (res !== "undefined")
//                         setCateType(res);
//                 } else {
//                     messageApi.error({ title: tMess('Title.error'), description: res.message || tMess('Description.no_specific_type_available') });
//                 }
//             } catch (error) {
//                 messageApi.error({ title: tMess('Title.error'), description: tMess('Description.Unable_to_connect_to_the_server') });
//             } finally {
//                 setIsLoading(false);
//             }
//         }
//         fetchCateAttr();
//         fetchCateType();
//     }, [id, form, messageApi]);
//     const fetchCate = async (type: string) => {
//         form.setFieldValue('childId', undefined);
//         setCate([]);
//         setIsChildLoading(true);
//         try {
//             const res: any = await requestApi('category/find-all', { method: 'GET',params:{type: type} });
//             if (res && !res.statusCode) {
//                 if (res !== "undefined")
//                     setCate(res.data);
//             } else {
//                 messageApi.error({ title: tMess('Title.error'), description: res.message || tMess('Description.no_role_yet') });
//             }
//         } catch (error) {
//             messageApi.error({ title: tMess('Title.error'), description: tMess('Description.Unable_to_connect_to_the_server') });
//         } finally {
//             setIsChildLoading(false);
//         }
//     }
//     const onFinish = async (values: any) => {
//         setIsLoading(true);
//         try {
//             const res: any = await requestApi(`category`, {
//                 method: 'POST',
//                 body: JSON.stringify(values),
//             });
//             if (res && !res.statusCode) {
//                 messageApi.success({
//                     title: tMess('Title.info'),
//                     description: tMess('category_added_successfully'),
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
//     if (isLoading) {
//         return <LoadingPage />;
//     }
//     return <>
//         {contextHolder}
//         <div style={{ maxWidth: 800, margin: '0 auto' }}>
//
//             <Card title={t('create')}>
//                 <Spin spinning={isLoading}>
//                     <Form
//                         form={form}
//                         layout="vertical"
//                         onFinish={onFinish}
//                         autoComplete="off"
//                     >
//                         <Form.Item
//                             label={t('name')}
//                             name="name"
//                             rules={[{ required: true, message: t('please_enter_name') }]}
//                         >
//                             <Input placeholder={t('name')} />
//                         </Form.Item>
//                         {
//                             cateType && cateType.length && <Form.Item label={t('category_type')} name="type">
//                                 <Select
//                                     placeholder={t('please_select_category_type')}
//                                     onChange={fetchCate}
//                                     options={[
//                                         ...(cateType?.map((item: any) => {
//                                             return { value: item.value, label: item.label };
//                                         })) || []
//                                     ]} />
//                             </Form.Item>
//                         }
//                         {
//                             cate.length > 0
//                                 ? <Form.Item label={t('category')} name="parentId">
//                                     <Select
//                                         loading = {isChildLoading}
//                                         placeholder={t('please_select_category')}
//                                         options={[
//                                             ...(cate?.map((item: any) => {
//                                                 return { value: item.id, label: item.name };
//                                             })) || []
//                                         ]} />
//                                 </Form.Item>
//                                 : <></>
//                         }
//                         {
//                             cateAttr && cateAttr.length > 0
//                                 ? <Form.Item label={t('attributes')} name="attributeIds">
//                                     <Select
//                                         mode="multiple"
//                                         placeholder={t('please_select_attribute')}
//                                         options={[
//                                             ...(cateAttr?.map((item: any) => {
//                                                 return { value: item.id, label: item.name };
//                                             })) || []
//                                         ]} />
//                                 </Form.Item>
//                                 : <></>
//                         }
//
//                         <Form.Item
//                             label={t('description')}
//                             name="description"
//                             // rules={[{ required: true, message: t('please_enter_description') }]}
//                         >
//                             <Input.TextArea placeholder={t('description')} />
//                         </Form.Item>
//
//                         <Form.Item
//                             label={t('metaTitle')}
//                             name="metaTitle"
//                             // rules={[{ required: true, message: t('please_enter_meta_title') }]}
//                         >
//                             <Input placeholder={t('metaTitle')} />
//                         </Form.Item>
//
//                         <Form.Item
//                             label={t('metaDescription')}
//                             name="metaDescription"
//                             // rules={[{ required: true, message: t('please_enter_meta_description') }]}
//                         >
//                             <Input placeholder={t('metaDescription')} />
//                         </Form.Item>
//
//                         <Form.Item
//                             label={t('metaKeywords')}
//                             name="metaKeywords"
//                             // rules={[{ required: true, message: t('please_enter_meta_keywords') }]}
//                         >
//                             <Input placeholder={t('metaKeywords')} />
//                         </Form.Item>
//
//                         <Form.Item>
//                             <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isLoading}>
//                                 {t('save')}
//                             </Button>
//                         </Form.Item>
//                     </Form>
//                 </Spin>
//             </Card>
//         </div>
//     </>
// }
// export default Page