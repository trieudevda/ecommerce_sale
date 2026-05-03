'use client'
import { useParams, useRouter } from 'next/navigation';

import React, { useState } from "react";
import { requestApi } from "@/components/api/be.api";
import { Button, Card, DatePicker, Form, Input, notification, Select, Space, Spin } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { useTranslations } from "use-intl";
import { ADMIN_PATHS } from "@/src/path";

const Page = () => {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug;
    const [cate, setCate] = useState([]);
    const [cateType, setCateType] = useState([]);
    const [cateAttr, setCateAttr] = useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isChildLoading, setIsChildLoading] = useState(false);
    const [messageApi, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();
    const t = useTranslations("Product.Category");
    React.useEffect(() => {
    //     const fetchCateData = async () => {
    //         try {
    //             const res: object = await requestApi('category/find/', { method: 'GET', params: { slug: slug, isActive: true } });
    //             if (res && !res.statusCode) {
    //                 const formattedData = {
    //                     ...res,
    //                     parentId: res.parent?.id,
    //                     attributeIds: res.attributes?.map((attr: any) => attr.id) || [],
    //                     type: res.type
    //                 };
    //                 form.setFieldsValue(formattedData);
    //             } else {
    //                 messageApi.error({ title: 'Lỗi', description: res.message || 'Không tìm thấy thuộc tính' });
    //             }
    //         } catch (error) {
    //             messageApi.error({ title: 'Lỗi kết nối', description: 'Không thể lấy dữ liệu từ server' });
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };
        
    // const fetchCate = async () => {
    //     try {
    //         const res: any = await requestApi('category/find-all', { method: 'GET', params: { type: form.getFieldValue('type') } });
    //         if (res && !res.statusCode) {
    //             if (res !== "undefined")
    //                 setCate(res.data);
    //         } else {
    //             messageApi.error({ title: 'Lỗi', description: res.message || 'Chưa có vai trò' });
    //         }
    //     } catch (error) {
    //         messageApi.error({ title: 'Lỗi kết nối', description: 'Không thể lấy dữ liệu từ server' });
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }
    //     const fetchCateType = async () => {
    //         try {
    //             const res: any = await requestApi('category/enums/ref-types', { method: 'GET' });
    //             if (res && !res.statusCode) {
    //                 if (res !== "undefined") {
    //                     setCateType(res);
    //                 }
    //             } else {
    //                 messageApi.error({ title: 'Lỗi', description: res.message || 'Chưa có kiểu loại' });
    //             }
    //         } catch (error) {
    //             messageApi.error({ title: 'Lỗi kết nối', description: 'Không thể lấy dữ liệu từ server' });
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     }
    //     const fetchCateAttr = async () => {
    //         try {
    //             const res: any = await requestApi('category-attribute/find-all', { method: 'GET' });
    //             if (res && !res.statusCode) {
    //                 if (res !== "undefined")
    //                     setCateAttr(res.data);
    //             } else {
    //                 messageApi.error({ title: 'Lỗi', description: res.message || 'Chưa có thuộc tính' });
    //             }
    //         } catch (error) {
    //             messageApi.error({ title: 'Lỗi kết nối', description: 'Không thể lấy dữ liệu từ server' });
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     }
    //     fetchCateType();
    //     fetchCateAttr();
    //     fetchCateData();
    //     fetchCate();
        const fetchData = async () => {
        setIsLoading(true);
        try {
            const [resTypes, resAttrs] = await Promise.all([
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
            messageApi.error({ message: 'Lỗi kết nối', description: 'Không thể lấy dữ liệu' });
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
    }, [slug, form]);
    const handleFetchCate = async (type: string) => {
        form.setFieldValue('childId', undefined);
        setCate([]);
        setIsChildLoading(true);
        try {
            const res: any = await requestApi('category/find-all', { method: 'GET', params: { type: type } });
            if (res && !res.statusCode) {
                if (res !== "undefined")
                    setCate(res.data);
            } else {
                messageApi.error({ title: 'Lỗi', description: res.message || 'Chưa có vai trò' });
            }
        } catch (error) {
            messageApi.error({ title: 'Lỗi kết nối', description: 'Không thể lấy dữ liệu từ server' });
        } finally {
            setIsChildLoading(false);
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
                    title: 'Thành công',
                    description: 'Thông tin thuộc tính đã được cập nhật.',
                });
                setTimeout(() => router.push(ADMIN_PATHS.PRODUCT.CATEGORY.LIST()), 1500);
            } else {
                messageApi.error({
                    title: 'Cập nhật thất bại',
                    description: Array.isArray(res.message) ? res.message[0] : res.message,
                });
            }
        } catch (error) {
            messageApi.error({ title: 'Lỗi', description: 'Có lỗi xảy ra khi lưu dữ liệu' });
        } finally {
            setIsLoading(false);
        }
    };
    return <>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {contextHolder}
            <Space style={{ marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>Quay lại</Button>
            </Space>
            <Card title={t('edit')}>
                <Spin spinning={isLoading}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label={t('name')}
                            name="name"
                            rules={[{ required: true, message: t('please_enter_name') }]}
                        >
                            <Input placeholder={t('name')} />
                        </Form.Item>
                        {
                            cateType && cateType.length && <Form.Item label={t('category_type')} name="type">
                                <Select
                                    placeholder={t('please_select_category_type')}
                                    onChange={handleFetchCate}
                                    options={[
                                        ...(cateType?.map((item: any) => {
                                            return { value: item.value, label: item.label };
                                        })) || []
                                    ]} />
                            </Form.Item>
                        }
                        {
                            cate && cate.length > 0
                                ? <Form.Item label={t('category')} name="parentId">
                                    <Select
                                        placeholder={t('please_select_category')}
                                        options={[
                                            ...(cate?.map((item: any) => {
                                                return { value: item.id, label: item.name };
                                            })) || []
                                        ]} />
                                </Form.Item>
                                : <></>
                        }
                        {
                            cateAttr && cateAttr.length > 0
                                ? <Form.Item label={t('attributes')} name="attributeIds">
                                    <Select
                                        mode="multiple"
                                        placeholder={t('please_select_attribute')}
                                        options={[
                                            ...(cateAttr?.map((item: any) => {
                                                return { value: item.id, label: item.name };
                                            })) || []
                                        ]} />
                                </Form.Item>
                                : <></>
                        }
                        <Form.Item
                            label={t('description')}
                            name="description"
                        // rules={[{ required: true, message: t('please_enter_description') }]}
                        >
                            <Input.TextArea placeholder={t('description')} />
                        </Form.Item>

                        <Form.Item
                            label={t('metaTitle')}
                            name="metaTitle"
                        // rules={[{ required: true, message: t('please_enter_meta_title') }]}
                        >
                            <Input placeholder={t('metaTitle')} />
                        </Form.Item>

                        <Form.Item
                            label={t('metaDescription')}
                            name="metaDescription"
                        // rules={[{ required: true, message: t('please_enter_meta_description') }]}
                        >
                            <Input placeholder={t('metaDescription')} />
                        </Form.Item>

                        <Form.Item
                            label={t('metaKeywords')}
                            name="metaKeywords"
                        // rules={[{ required: true, message: t('please_enter_meta_keywords') }]}
                        >
                            <Input placeholder={t('metaKeywords')} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isLoading}>
                                {t('save')}
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Card>
        </div>
    </>
}
export default Page