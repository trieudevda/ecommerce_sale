'use client'
import {useParams, useRouter} from 'next/navigation';

import React, {useState} from "react";
import {requestApi} from "@/components/api/be.api";
import {Button, Card, DatePicker, Form, Input, Layout, notification, Select, Space, Spin} from "antd";
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/redux/store";
import {useTranslations} from "use-intl";
// import { useRouter } from 'next/navigation';

const Page = ()=>{
    const dispatch = useDispatch();
    const { user, isAuthenticated, isAppLoading } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    // const [user,setUser]=useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [messageApi, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();
    const t = useTranslations("Auth");
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

        if (id) fetchUserData();
    }, [id, form, messageApi]);
    const onFinish = async (values: any) => {
        if(values.password !== values.repassword) {
            messageApi.error({
                title: t('password'),
                description: t('t_match'),
            });
            return;
        }
        setIsLoading(true);
        try {
            const res: any = await requestApi(`user`, {
                method: 'POST',
                body: JSON.stringify(values),
            });

            if (res && !res.statusCode) {
                messageApi.success({
                    title: t('successfully'),
                    description: t('user_added_successfully'),
                });
                setTimeout(() => router.push('/admin/user'), 1500);
            } else {
                messageApi.error({
                    title: t('adding_users_failed'),
                    description: Array.isArray(res.message) ? res.message[0] : res.message,
                });
            }
        } catch (error) {
            messageApi.error({ title: t('error'), description: t('error_when_adding_user') });
        } finally {
            setIsLoading(false);
        }
    };
    return <>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {contextHolder}
            <Card title={t('login')}>
                <Spin spinning={!isAppLoading}>
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
                        <Form.Item label={t('phone')} name="phone" rules={[{
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

                        <Form.Item
                            label={t('password')}
                            name="password"
                            rules={[{ required: true, message: t('invalid_password') }]}
                        >
                            <Input.Password placeholder="********" />
                        </Form.Item>

                        <Form.Item
                            label={t('re_password')}
                            name="repassword"
                            rules={[{ required: true, message: t('invalid_password') }]}
                        >
                            <Input.Password placeholder="********" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} >
                                {t('submit')}
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Card>
        </div>
    </>
}
export default Page