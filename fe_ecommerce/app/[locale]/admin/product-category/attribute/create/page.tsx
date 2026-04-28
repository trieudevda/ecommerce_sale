'use client'
import { useParams, useRouter } from 'next/navigation';
import React from "react";
import { Button, Card, Form, Input, Layout, notification, Select, Space, Spin } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useTranslations } from "use-intl";
import {requestApi} from "@/components/api/be.api";
import LoadingAdmin from "@/components/templates/admin/loading/loading-admin";

const Page = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [messageApi, contextHolder] = notification.useNotification();
    const t = useTranslations("Product.Category.Attribute");
    const [form] = Form.useForm();
    const onFinish = async (values: object) => {
        setIsLoading(true);
        try {
            const res: object = await requestApi(`category-attribute`, {
                method: 'POST',
                body: JSON.stringify(values),
            });
            if (res && res.data) {
                form.resetFields();
                messageApi.success({
                    title: 'Thành công',
                    description: 'Thêm thuộc tính thành công.',
                });
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
    return <>
        {contextHolder}
        {
        isLoading
            ? LoadingAdmin
            : <div style={{ maxWidth: 800, margin: '0 auto' }}>

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
                            <Form.Item
                                label={t('description')}
                                name="description"
                                rules={[{ required: true, message: t('please_enter_description') }]}
                            >
                                <Input.TextArea placeholder={t('description')}/>
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
    </>
}
export default Page