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
    const params = useParams();
    const id = params.id;
    const [role,setRole]=useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [messageApi, contextHolder] = notification.useNotification();
    const t = useTranslations("User.CRUD");
    const [form] = Form.useForm();
    React.useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res: any = await requestApi('user/find', { method: 'GET', params:{id} });
                if (res && !res.statusCode) {
                    form.setFieldsValue({
                        ...res,
                        dateOfBirth: res.dateOfBirth ? dayjs(res.dateOfBirth) : null,
                    });
                } else {
                    messageApi.error({ title: 'Lỗi', description: res.message || 'Không tìm thấy người dùng' });
                }
            } catch (error) {
                messageApi.error({ title: 'Lỗi kết nối', description: 'Không thể lấy dữ liệu từ server' });
            } finally {
                setIsLoading(false);
            }
        };
        const fetchRole = async () =>{
            try {
                const res: any = await requestApi('roles/find-all', { method: 'GET' });
                if (res && !res.statusCode) {
                    setRole(res.data);
                } else {
                    messageApi.error({ title: 'Lỗi', description: res.message || 'Chưa có vai trò' });
                }
            } catch (error) {
                messageApi.error({ title: 'Lỗi kết nối', description: 'Không thể lấy dữ liệu từ server' });
            } finally {
                setIsLoading(false);
            }
        }

        if (id) fetchUserData();
        fetchRole();
    }, [id, form, messageApi]);
    const onFinish = async (values: any) => {
        setIsLoading(true);
        try {
            const transformedData = {
                ...values,
                role: { id: values.role }
            };
            const res: any = await requestApi(`user`, {
                method: 'POST',
                body: JSON.stringify(transformedData),
            });

            if (res && !res.statusCode) {
                messageApi.success({
                    title: 'Thành công',
                    description: 'Thêm người dùng thành công.',
                });
                setTimeout(() => router.push('/admin/user'), 1500);
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
            <Card title={t('create')}>
                <Spin spinning={isLoading}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label={t('full_name')}
                            name="fullName"
                            rules={[{ required: true, message: t('please_enter_your_name') }]}
                        >
                            <Input placeholder={t('full_name')} />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, type: 'email', message: t('invalid_email') }]}
                        >
                            <Input placeholder="example@gmail.com" />
                        </Form.Item>
                        <Form.Item
                            label={t('password')}
                            name="password"
                            rules={[{ required: true, message: t('invalid_password') }]}
                        >
                            <Input.Password placeholder="********" />
                        </Form.Item>
                        <Form.Item label={t('address')} name="address" rules={[{ required: true, message: t('please_enter_address') }]}>
                            <Input placeholder={t('address')} />
                        </Form.Item>
                        <Form.Item label={'phone'} name="phone" rules={[{
                            required: true,
                            message: t('please_enter_phone')
                        },
                            {
                                pattern: /^(0[3|5|7|8|9])([0-9]{8})$/,
                                message: t('phone_number_is_not_in_the_correct_Vietnamese'),
                            }]}>
                            <Input placeholder="090..." maxLength={10} allowClear onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}/>
                        </Form.Item>

                        <Form.Item label={t('role')} name="role">
                            <Select
                                placeholder={t('please_select_role')}
                                options={[
                                ...role.map((item: any) => {
                                    return {value: item.id, label: item.name};
                                })
                            ]} />
                        </Form.Item>
                        <Form.Item label={t('date_of_birth')} name="dateOfBirth" rules={[{ required: true, message: t('please_enter_date_of_birth') }]}>
                            <DatePicker
                                format="DD/MM/YYYY"
                                style={{ width: '100%' }}
                                placeholder={t('please_select_date_of_birth')}
                            />
                        </Form.Item>
                        <Form.Item label={t('is_email_verified')} name="isEmailVerified">
                            <Select options={[
                                { value: true, label: t('verified') },
                                { value: false, label: t('unverified') },
                            ]} />
                        </Form.Item>
                        <Form.Item label={t('status')} name="status">
                            <Select options={[
                                { value: 'active', label: t('active') },
                                { value: 'inactive', label: t('inactive') },
                                { value: 'deleted', label: t('deleted') },
                            ]} />
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