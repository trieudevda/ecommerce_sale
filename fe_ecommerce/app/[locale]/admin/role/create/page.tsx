'use client'
import {useRouter} from 'next/navigation';

import React from "react";
import {requestApi} from "@/components/api/be.api";
import {Button, Card, Form, Input, notification, Space, Spin} from "antd";
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import {useTranslations} from "use-intl";
// import { useRouter } from 'next/navigation';

const Page = ()=>{
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
                    title:  tMess('Title.info'),
                    description: tMess('Description.data_added_successfully'),
                });
                form.setFieldsValue({name:"",slug:""});
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
                            rules={[{ required: true, message: t('please_enter_your_role_name') }]}
                        >
                            <Input placeholder={t("name")} />
                        </Form.Item>

                        <Form.Item
                            label={t('slug')}
                            name="slug"
                            rules={[{ required: true, message: t('please_enter_your_role_initials') }]}
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