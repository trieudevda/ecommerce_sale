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
    const [isLoading, setIsLoading] = React.useState(true);
    const [messageApi, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();
    const t = useTranslations("User.CRUD");
    const { user, isAuthenticated, isAppLoading } = useSelector((state: RootState) => state.auth);
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
            const res: any = await requestApi(`user/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(transformedData),
            });

            if (res && !res.statusCode) {
                messageApi.success({
                    title: 'Thành công',
                    description: 'Thông tin người dùng đã được cập nhật.',
                });
                setTimeout(() => router.push('/admin/user'), 1500);
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
            <Card title={`Chỉnh sửa người dùng (ID: ${id})`}>
                <Spin spinning={isLoading}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Họ và tên"
                            name="fullName"
                            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                        >
                            <Input placeholder="Họ và Tên" />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}
                        >
                            <Input placeholder="example@gmail.com" />
                        </Form.Item>

                        <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng cập nhật địa chỉ!' }]}>
                            <Input placeholder="Địa chỉ" />
                        </Form.Item>
                        <Form.Item label="Số điện thoại" name="phone" rules={[{
                            required: true,
                            message: 'Vui lòng nhập số điện thoại!'
                        },
                            {
                                pattern: /^(0[3|5|7|8|9])([0-9]{8})$/,
                                message: 'Số điện thoại không đúng định dạng Việt Nam (10 số)!',
                            }]}>
                            <Input placeholder="090..." maxLength={10} allowClear onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}/>
                        </Form.Item>

                        <Form.Item label="Vai trò" name="role" initialValue={user.role.id}>
                            <Select
                                placeholder={t('please_select_role')}
                                options={[
                                    ...role.map((item: any) => {
                                        return {value: item.id, label: item.name};
                                    })
                            ]} />
                        </Form.Item>

                        <Form.Item label="Địa chỉ" name="address">
                            <Input placeholder={"Địa chỉ"} />
                        </Form.Item>
                        <Form.Item label="Ngày sinh" name="dateOfBirth" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
                            <DatePicker
                                format="DD/MM/YYYY"
                                style={{ width: '100%' }}
                                placeholder="Chọn ngày sinh"
                            />
                        </Form.Item>
                        <Form.Item label="Xác thực email" name="isEmailVerified" initialValue={user.isEmailVerified}>
                            <Select options={[
                                { value: true, label: 'Đã xác thực' },
                                { value: false, label: 'Chưa xác thực' },
                            ]} />
                        </Form.Item>
                        <Form.Item label="Trạng thái" name="status" initialValue={user.status}>
                            <Select options={[
                                { value: 'active', label: 'Đang sử dụng' },
                                { value: 'inactive', label: 'Đã khóa' },
                                { value: 'deleted', label: 'Đã xóa' },
                            ]} />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isLoading}>
                                Lưu thay đổi
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Card>
        </div>
    </>
}
export default Page