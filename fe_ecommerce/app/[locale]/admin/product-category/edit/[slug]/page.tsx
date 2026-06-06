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
import {ADMIN_PATHS} from "@/src/path";

const Page = () => {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug;

    const [cate, setCate] = useState([]);
    const [cateType, setCateType] = useState([]);
    const [cateAttr, setCateAttr] = useState([]);

    const [isLoading, setIsLoading] = React.useState(true);
    const [messageApi, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();

    const t = useTranslations("Product.Category");
    const tMess = useTranslations("Message");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [resTypes, resAttrs]: any = await Promise.all([
                    requestApi('category/enums/ref-types', { method: 'GET' }),
                    requestApi('category-attribute/find-all', { method: 'GET' })
                ]);
                if (resTypes && !resTypes.statusCode) setCateType(resTypes);
                if (resAttrs && !resAttrs.statusCode) setCateAttr(resAttrs.data);

                if (slug) {
                    const resDetail: any = await requestApi('category/find/', {
                        method: 'GET',
                        params: { slug, isActive: true }
                    });

                    if (resDetail && !resDetail.statusCode) {
                        const detail = resDetail;

                        const formattedData = {
                            ...detail,
                            parentId: detail.parent?.id,
                            attributeIds: detail.attributes?.map((attr: any) => attr.id) || [],
                            type: detail.type
                        };
                        form.setFieldsValue(formattedData);

                        if (detail.type) {
                            const resList: any = await requestApi('category/find-all', {
                                method: 'GET',
                                params: { type: detail.type }
                            });
                            if (resList && !resList.statusCode) {
                                setCate(resList.data);
                            }
                        }
                    }
                }
            } catch (error) {
                messageApi.error({ title: tMess('Title.error'), description: tMess('Description.Unable_to_connect_to_the_server')});
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, form]);

    const handleFetchCate = async (type: string) => {
        // Đã fix lỗi childId -> parentId giống bên Create
        form.setFieldValue('parentId', undefined);
        setCate([]);
        try {
            const res: any = await requestApi('category/find-all', { method: 'GET', params: { type: type } });
            if (res && !res.statusCode && res !== "undefined") {
                setCate(res.data);
            } else {
                messageApi.error({ title: tMess('Title.error'), description: res.message || tMess('Description.no_catefory_yet') });
            }
        } catch (error) {
            messageApi.error({ title: tMess('Title.error'), description: tMess('Description.You_are_not_authorized_to_do_this') });
        }
    }

    const onFinish = async (values: any) => {
        setIsLoading(true);
        try {
            const res: any = await requestApi(`category/${slug}`, {
                method: 'PATCH',
                body: JSON.stringify(values),
            });

            if (res && !res.statusCode) {
                messageApi.success({
                    title: tMess('Title.info'),
                    description: tMess('Description.data_update_successfully'),
                });
                setTimeout(() => router.push(ADMIN_PATHS.PRODUCT.CATEGORY.LIST()), 1500);
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
                                {t('edit')}
                            </Typography.Title>
                            <p className="text-slate-500 text-sm mt-1">
                                {t('update_the_details_and_categories_for_this_section')}
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
                                            <GlobalOutlined className="text-blue-500" />{t('search_engine_optimization_seo')}
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
                                            <Input placeholder="Ví dụ: công nghệ, gia dụng, thời trang..." className="hover:border-blue-400 focus:border-blue-500" />
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
                                                    onChange={handleFetchCate}
                                                    options={cateType?.map((item: any) => ({ value: item.value, label: item.label })) || []}
                                                    className="hover:border-blue-400 focus:border-blue-500"
                                                />
                                            </Form.Item>
                                        )}
                                        {cate && cate.length > 0 && (
                                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                <Form.Item
                                                    label={<span className="text-slate-600 font-medium">{t('category')} (Danh mục cha)</span>}
                                                    name="parentId"
                                                >
                                                    <Select
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

                                    {/* NÚT LƯU THAO TÁC NHANH (Dính liền cột phải) */}
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
// import {useParams, useRouter} from 'next/navigation';
//
// import React, {useState} from "react";
// import {requestApi} from "@/components/api/be.api";
// import {Button, Card, Form, Input, notification, Select, Space, Spin} from "antd";
// import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
// import {useTranslations} from "use-intl";
// import {ADMIN_PATHS} from "@/src/path";
//
// const Page = () => {
//     const router = useRouter();
//     const params = useParams();
//     const slug = params.slug;
//     const [cate, setCate] = useState([]);
//     const [cateType, setCateType] = useState([]);
//     const [cateAttr, setCateAttr] = useState([]);
//     const [isLoading, setIsLoading] = React.useState(true);
//     const [isChildLoading, setIsChildLoading] = useState(false);
//     const [messageApi, contextHolder] = notification.useNotification();
//     const [form] = Form.useForm();
//     const t = useTranslations("Product.Category");
//     const tMess = useTranslations("Message");
//     React.useEffect(() => {
//         const fetchData = async () => {
//         setIsLoading(true);
//         try {
//             const [resTypes, resAttrs] = await Promise.all([
//                 requestApi('category/enums/ref-types', { method: 'GET' }),
//                 requestApi('category-attribute/find-all', { method: 'GET' })
//             ]);
//             if (resTypes && !resTypes.statusCode) setCateType(resTypes);
//             if (resAttrs && !resAttrs.statusCode) setCateAttr(resAttrs.data);
//
//             if (slug) {
//                 const resDetail: any = await requestApi('category/find/', {
//                     method: 'GET',
//                     params: { slug, isActive: true }
//                 });
//                 if (resDetail && !resDetail.statusCode) {
//                     const detail = resDetail;
//
//                     const formattedData = {
//                         ...detail,
//                         parentId: detail.parent?.id,
//                         attributeIds: detail.attributes?.map((attr: any) => attr.id) || [],
//                         type: detail.type
//                     };
//                     form.setFieldsValue(formattedData);
//
//                     if (detail.type) {
//                         const resList: any = await requestApi('category/find-all', {
//                             method: 'GET',
//                             params: { type: detail.type }
//                         });
//                         if (resList && !resList.statusCode) {
//                             setCate(resList.data);
//                         }
//                     }
//                 }
//             }
//         } catch (error) {
//             messageApi.error({ title: tMess('Title.error'), description: tMess('Description.Unable_to_connect_to_the_server')});
//         } finally {
//             setIsLoading(false);
//         }
//     };
//     fetchData();
//     }, [slug, form]);
//     const handleFetchCate = async (type: string) => {
//         form.setFieldValue('childId', undefined);
//         setCate([]);
//         // setIsChildLoading(true);
//         try {
//             const res: any = await requestApi('category/find-all', { method: 'GET', params: { type: type } });
//             if (res && !res.statusCode) {
//                 if (res !== "undefined")
//                     setCate(res.data);
//             } else {
//                 messageApi.error({ title: tMess('Title.error'), description: res.message || tMess('Description.no_catefory_yet') });
//             }
//         } catch (error) {
//             messageApi.error({ title: tMess('Title.error'), description: tMess('Description.You_are_not_authorized_to_do_this') });
//         } finally {
//             // setIsChildLoading(false);
//         }
//     }
//     const onFinish = async (values: any) => {
//         setIsLoading(true);
//         try {
//             const res: any = await requestApi(`category/${slug}`, {
//                 method: 'PATCH',
//                 body: JSON.stringify(values),
//             });
//
//             if (res && !res.statusCode) {
//                 messageApi.success({
//                     title: tMess('Title.info'),
//                     description: tMess('Description.data_update_successfully'),
//                 });
//                 setTimeout(() => router.push(ADMIN_PATHS.PRODUCT.CATEGORY.LIST()), 1500);
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
//         <div style={{ maxWidth: 800, margin: '0 auto' }}>
//             {contextHolder}
//             <Space style={{ marginBottom: 16 }}>
//                 <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>Quay lại</Button>
//             </Space>
//             <Card title={t('edit')}>
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
//                                     onChange={handleFetchCate}
//                                     options={[
//                                         ...(cateType?.map((item: any) => {
//                                             return { value: item.value, label: item.label };
//                                         })) || []
//                                     ]} />
//                             </Form.Item>
//                         }
//                         {
//                             cate && cate.length > 0
//                                 ? <Form.Item label={t('category')} name="parentId">
//                                     <Select
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
//                         <Form.Item
//                             label={t('description')}
//                             name="description"
//                         >
//                             <Input.TextArea placeholder={t('description')} />
//                         </Form.Item>
//
//                         <Form.Item
//                             label={t('metaTitle')}
//                             name="metaTitle"
//                         >
//                             <Input placeholder={t('metaTitle')} />
//                         </Form.Item>
//
//                         <Form.Item
//                             label={t('metaDescription')}
//                             name="metaDescription"
//                         >
//                             <Input placeholder={t('metaDescription')} />
//                         </Form.Item>
//
//                         <Form.Item
//                             label={t('metaKeywords')}
//                             name="metaKeywords"
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