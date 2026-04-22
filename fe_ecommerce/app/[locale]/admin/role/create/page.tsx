'use client'
import {useParams, useRouter} from 'next/navigation';

import React, {useState} from "react";
import {requestApi} from "@/components/api/be.api";
import {Button, Card, DatePicker, Form, Input, Layout, notification, Select, Space, Spin} from "antd";
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {useSelector} from "react-redux";
import {RootState} from "@/src/redux/store";
import {useTranslations} from "use-intl";
// import { useRouter } from 'next/navigation';

const Page = ()=>{
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [messageApi, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();
    const t = useTranslations("Role.CRUD");
    const onFinish = async (values: any) => {
        setIsLoading(true);
        try {
            const res: any = await requestApi(`roles`, {
                method: 'POST',
                body: JSON.stringify(values),
            });

            if (res && !res.statusCode) {
                messageApi.success({
                    title: 'Thành công',
                    description: 'Thêm vai trò thành công.',
                });
                form.setFieldsValue({name:"",slug:""});
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
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {contextHolder}
            <Space style={{ marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>Quay lại</Button>
            </Space>
            <Card title={t("create")}>
                <Spin spinning={isLoading}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label={t("name")}
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên vai trò!' }]}
                        >
                            <Input placeholder={t("name")} />
                        </Form.Item>

                        <Form.Item
                            label={t('slug')}
                            name="slug"
                            rules={[{ required: true, message: 'Vui lòng nhập tên viết tắt!' }]}
                        >
                            <Input placeholder={t('slug')} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isLoading}>
                                {t("save")}
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Card>
        </div>
    </>
}
export default Page