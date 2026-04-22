'use client'
import {useParams, useRouter} from 'next/navigation';

import React, {useState} from "react";
import {requestApi} from "@/components/api/be.api";
import {Button, Card, DatePicker, Form, Input, Layout, notification, Select, Space, Spin} from "antd";
import {ArrowLeftOutlined, LoadingOutlined, SaveOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {useSelector} from "react-redux";
import {RootState} from "@/src/redux/store";
import {useTranslations} from "use-intl";
import {ADMIN_PATHS} from "@/src/path";
// import { useRouter } from 'next/navigation';

const Page = ()=>{
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [isLoading, setIsLoading] = React.useState(true);
    const [messageApi, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();
    const t = useTranslations("Role.CRUD");
    const { user, isAuthenticated, isAppLoading } = useSelector((state: RootState) => state.auth);
    React.useEffect(() => {
        const fetchRoleData = async () => {
            try {
                const res: any = await requestApi('roles/find', { method: 'GET', params:{id} });
                if (res && !res.statusCode) {
                    form.setFieldsValue({
                        ...res,
                        dateOfBirth: res.dateOfBirth ? dayjs(res.dateOfBirth) : null,
                    });
                } else {
                    messageApi.error({ title: 'Lỗi', description: res.message || 'Không tìm thấy vai trò' });
                }
            } catch (error) {
                messageApi.error({ title: 'Lỗi kết nối', description: 'Không thể lấy dữ liệu từ server' });
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchRoleData();
    }, [id, form, messageApi]);
    const onFinish = async (values: any) => {
        setIsLoading(true);
        try {
            const res: any = await requestApi(`roles/${id}`, {
                method: 'PATCH', // Hoặc PUT tùy Backend của bạn
                body: JSON.stringify(values),
            });

            if (res && !res.statusCode) {
                messageApi.success({
                    title: 'Thành công',
                    description: 'Vai trò đã được cập nhật.',
                });
                setTimeout(() => router.push(ADMIN_PATHS.ROLE.LIST()), 1500);
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
    if(!isAuthenticated) return <><Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} /></>
    return <>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {contextHolder}
            <Space style={{ marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>Quay lại</Button>
            </Space>
            <Card title={t("edit")}>
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