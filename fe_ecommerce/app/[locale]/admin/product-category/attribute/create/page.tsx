'use client'
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from "react";
import { Button, Card, DatePicker, Form, Input, Layout, notification, Select, Space, Spin } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useTranslations } from "use-intl";
import dynamic from "next/dynamic";
import ImageUpload from "@/components/upload/ImageUpload";
import {requestApi} from "@/components/api/be.api";
import LoadingAdmin from "@/components/templates/admin/loading/loading-admin";
import {ADMIN_PATHS} from "@/src/path";

const TiptapFull = dynamic(() => import('@/components/Common/Editor/TiptapFull'), { ssr: false })
const Page = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [cate, setCate] = useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [messageApi, contextHolder] = notification.useNotification();
    const t = useTranslations("Product.Category");
    const [form] = Form.useForm();
    const [content, setContent] = useState('')
    React.useEffect(() => {
        const fetchCate = async () => {
            try {
                const res: any = await requestApi('category/find-all', { method: 'GET' });
                if (res && !res.statusCode) {
                    if(res!=="undefined")
                    setCate(res);
                } else {
                    messageApi.error({ title: 'Lỗi', description: res.message || 'Chưa có vai trò' });
                }
            } catch (error) {
                messageApi.error({ title: 'Lỗi kết nối', description: 'Không thể lấy dữ liệu từ server' });
            } finally {
                setIsLoading(false);
            }
        }
        fetchCate();
    }, [id, form, messageApi]);
    const onFinish = async (values: any) => {
        setIsLoading(true);
        try {
            const res: any = await requestApi(`category`, {
                method: 'POST',
                body: JSON.stringify(values),
            });
            if (res && !res.statusCode) {
                console.log(res.status)
                messageApi.success({
                    title: 'Thành công',
                    description: 'Thêm danh mục thành công.',
                });
                // setTimeout(()=>{router.push(ADMIN_PATHS.PRODUCT.CATEGORY.LIST())},1000)
            } else {
                messageApi.error({
                    title: 'Thất bại',
                    description: Array.isArray(res.message) ? res.message[0] : res.message,
                });
            }
        } catch (error) {
            messageApi.error({ title: 'Lỗi', description: 'Có lỗi xảy ra khi lưu dữ liệu' });
        } finally {
            setIsLoading(false);
        }
        
    };
    return isLoading
    ? LoadingAdmin
        : <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {contextHolder}
            <Card title={t('create')}>
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
                        <Form.Item label={t('category')} name="parentId">
                            <Select
                                placeholder={t('please_select_category')}
                                options={[
                                    ...(cate?.map((item: any) => {
                                        return { value: item.id, label: item.name };
                                    })) || []
                                ]} />
                        </Form.Item>
                        <Form.Item
                            label={t('description')}
                            name="description"
                            rules={[{ required: true, message: t('please_enter_description') }]}
                        >
                            <Input.TextArea placeholder={t('description')}/>
                        </Form.Item>

                        <Form.Item
                            label={t('metaTitle')}
                            name="metaTitle"
                            rules={[{ required: true, message: t('please_enter_meta_title') }]}
                        >
                            <Input placeholder={t('metaTitle')} />
                        </Form.Item>

                        <Form.Item
                            label={t('metaDescription')}
                            name="metaDescription"
                            rules={[{ required: true, message: t('please_enter_meta_description') }]}
                        >
                            <Input placeholder={t('metaDescription')} />
                        </Form.Item>

                        <Form.Item
                            label={t('metaKeywords')}
                            name="metaKeywords"
                            rules={[{ required: true, message: t('please_enter_meta_keywords') }]}
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
}
export default Page