'use client'
import {useParams, useRouter} from 'next/navigation';
import React, {useEffect, useState} from "react";
import {requestApi} from "@/components/api/be.api";
import {
    Button,
    Card,
    ConfigProvider,
    DatePicker,
    Divider,
    Form,
    Input,
    notification,
    Select,
    Spin,
    Typography
} from "antd";
import {
    ArrowLeftOutlined,
    EnvironmentOutlined,
    MailOutlined,
    PhoneOutlined,
    SafetyCertificateOutlined,
    SaveOutlined,
    UserOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import {useSelector} from "react-redux";
import {RootState} from "@/src/redux/store";
import {useTranslations} from "use-intl";

const Page = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [role, setRole] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [messageApi, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();

    const t = useTranslations("User.CRUD");
    const tMess = useTranslations("Message");
    const { user, isAuthenticated, isAppLoading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res: any = await requestApi('user/find', { method: 'GET', params: { id } });
                if (res && !res.statusCode) {
                    form.setFieldsValue({
                        ...res,
                        role: res?.role?.id,
                        dateOfBirth: res.dateOfBirth ? dayjs(res.dateOfBirth) : null,
                    });
                } else {
                    messageApi.error({ title: tMess('Title.error'), description: res.message || t('no_user_found') });
                }
            } catch (error) {
                messageApi.error({ title: tMess('Title.error'), description: tMess('Description.Unable_to_connect_to_the_server') });
            } finally {
                setIsLoading(false);
            }
        };
        const fetchRole = async () => {
            try {
                const res: any = await requestApi('roles/find-all', { method: 'GET' });
                if (res && !res.statusCode) {
                    setRole(res.data);
                } else {
                    messageApi.error({ title: tMess('Title.role'), description: res.message || tMess('Description.You_are_not_authorized_to_do_this') });
                }
            } catch (error) {
                messageApi.error({ title: tMess('Title.error'), description: tMess('Description.Unable_to_connect_to_the_server') });
            }
        }
        if (id) fetchUserData();
        fetchRole();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, form]);

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
                    title: tMess('Title.success'),
                    description: tMess('Description.data_update_successfully'),
                });
                setTimeout(() => router.push('/admin/user'), 1500);
            } else {
                messageApi.error({
                    title: tMess('Title.fail'), // Đã sửa lại lỗi thông báo (trước đó ghi Title.success)
                    description: Array.isArray(res.message) ? res.message[0] : res.message,
                });
            }
        } catch (error) {
            messageApi.error({ title: tMess('Title.error'), description: tMess('Description.Unable_to_connect_to_the_server') });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#2563eb', // Đồng bộ màu xanh của Tailwind
                    colorTextBase: '#334155',
                    fontFamily: 'inherit',
                    borderRadius: 8
                },
                components: {
                    Card: { paddingLG: 32 },
                    Form: { itemMarginBottom: 20 },
                    Input: { controlHeight: 44, colorBgContainer: '#f8fafc' },
                    Select: { controlHeight: 44, colorBgContainer: '#f8fafc' },
                    DatePicker: { controlHeight: 44, colorBgContainer: '#f8fafc' },
                    Button: { controlHeight: 44 }
                },
            }}
        >
            {contextHolder}

            {/* Background chuẩn SaaS */}
            <div className="min-h-screen bg-slate-50/50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50/50 to-slate-50 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-700">
                <div className="max-w-4xl mx-auto">

                    {/* Header Trang */}
                    <div className="flex items-center gap-4 mb-6">
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => router.back()}
                            className="flex items-center justify-center rounded-xl border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
                        />
                        <div>
                            <Typography.Title level={2} className="!mb-0 !text-2xl !font-extrabold tracking-tight text-slate-800">
                                Chỉnh sửa người dùng
                            </Typography.Title>
                            <p className="text-slate-500 text-sm mt-1">
                                Cập nhật thông tin chi tiết cho tài khoản <span className="font-semibold text-slate-700">#{id}</span>.
                            </p>
                        </div>
                    </div>

                    <Card
                        variant="borderless"
                        className="rounded-[24px] shadow-sm ring-1 ring-slate-900/5 bg-white overflow-hidden"
                    >
                        <Spin spinning={isLoading}>
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                autoComplete="off"
                                className="w-full"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">

                                    {/* CỘT 1: THÔNG TIN CÁ NHÂN */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold text-base">
                                            <UserOutlined className="text-blue-500" /> Thông tin cá nhân
                                        </div>

                                        <Form.Item
                                            label={<span className="text-slate-600 font-medium">Họ và tên</span>}
                                            name="fullName"
                                            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                                        >
                                            <Input prefix={<UserOutlined className="text-slate-400 mr-1" />} placeholder="Họ và Tên" className="hover:border-blue-400 focus:border-blue-500" />
                                        </Form.Item>

                                        <Form.Item
                                            label={<span className="text-slate-600 font-medium">Số điện thoại</span>}
                                            name="phone"
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                                { pattern: /^(0[3|5|7|8|9])([0-9]{8})$/, message: 'Số điện thoại không đúng định dạng (10 số)!' }
                                            ]}
                                        >
                                            <Input
                                                prefix={<PhoneOutlined className="text-slate-400 mr-1" />}
                                                placeholder="090..."
                                                maxLength={10}
                                                allowClear
                                                onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
                                                className="hover:border-blue-400 focus:border-blue-500"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label={<span className="text-slate-600 font-medium">Địa chỉ</span>}
                                            name="address"
                                            rules={[{ required: true, message: 'Vui lòng cập nhật địa chỉ!' }]}
                                        >
                                            <Input prefix={<EnvironmentOutlined className="text-slate-400 mr-1" />} placeholder="Địa chỉ cư trú..." className="hover:border-blue-400 focus:border-blue-500" />
                                        </Form.Item>

                                        <Form.Item
                                            label={<span className="text-slate-600 font-medium">Ngày sinh</span>}
                                            name="dateOfBirth"
                                            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                                        >
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                className="w-full hover:border-blue-400 focus:border-blue-500"
                                                placeholder="Chọn ngày sinh"
                                            />
                                        </Form.Item>
                                    </div>

                                    {/* CỘT 2: TÀI KHOẢN VÀ PHÂN QUYỀN */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold text-base mt-8 md:mt-0">
                                            <SafetyCertificateOutlined className="text-blue-500" /> Tài khoản & Phân quyền
                                        </div>

                                        <Form.Item
                                            label={<span className="text-slate-600 font-medium">Email</span>}
                                            name="email"
                                            rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}
                                        >
                                            <Input prefix={<MailOutlined className="text-slate-400 mr-1" />} placeholder="example@gmail.com" className="hover:border-blue-400 focus:border-blue-500" />
                                        </Form.Item>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Form.Item
                                                label={<span className="text-slate-600 font-medium">Vai trò</span>}
                                                name="role"
                                                rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                                            >
                                                <Select
                                                    placeholder="Chọn vai trò"
                                                    options={role.map((item: any) => ({ value: item.id, label: item.name }))}
                                                    className="hover:border-blue-400 focus:border-blue-500"
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label={<span className="text-slate-600 font-medium">Xác thực email</span>}
                                                name="isEmailVerified"
                                            >
                                                <Select
                                                    options={[
                                                        { value: true, label: <span className="text-emerald-600 font-medium">Đã xác thực</span> },
                                                        { value: false, label: <span className="text-rose-600 font-medium">Chưa xác thực</span> },
                                                    ]}
                                                    className="hover:border-blue-400 focus:border-blue-500"
                                                />
                                            </Form.Item>
                                        </div>

                                        <Form.Item
                                            label={<span className="text-slate-600 font-medium">Trạng thái</span>}
                                            name="status"
                                        >
                                            <Select
                                                options={[
                                                    { value: 'active', label: <span className="text-emerald-600 font-medium">Đang sử dụng</span> },
                                                    { value: 'inactive', label: <span className="text-slate-500 font-medium">Đã khóa</span> },
                                                    { value: 'deleted', label: <span className="text-rose-600 font-medium">Đã xóa</span> },
                                                ]}
                                                className="hover:border-blue-400 focus:border-blue-500"
                                            />
                                        </Form.Item>
                                    </div>
                                </div>

                                <Divider className="my-6 border-slate-100" />

                                {/* NÚT HÀNH ĐỘNG */}
                                <div className="flex justify-end gap-3">
                                    <Button
                                        onClick={() => router.back()}
                                        className="h-11 px-6 rounded-xl text-slate-600 font-medium hover:bg-slate-50 border-slate-200"
                                    >
                                        Hủy bỏ
                                    </Button>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<SaveOutlined />}
                                        loading={isLoading}
                                        className="h-11 px-8 rounded-xl font-semibold bg-blue-600 hover:bg-blue-500 border-0 shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:-translate-y-0.5 transition-all"
                                    >
                                        Lưu thay đổi
                                    </Button>
                                </div>
                            </Form>
                        </Spin>
                    </Card>
                </div>
            </div>
        </ConfigProvider>
    )
}

export default Page;
// 'use client'
// import {useParams, useRouter} from 'next/navigation';
//
// import React, {useState} from "react";
// import {requestApi} from "@/components/api/be.api";
// import {Button, Card, DatePicker, Form, Input, notification, Select, Space, Spin} from "antd";
// import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
// import dayjs from "dayjs";
// import {useSelector} from "react-redux";
// import {RootState} from "@/src/redux/store";
// import {useTranslations} from "use-intl";
// // import { useRouter } from 'next/navigation';
//
// const Page = ()=>{
//     const router = useRouter();
//     const params = useParams();
//     const id = params.id;
//     const [role,setRole]=useState([]);
//     const [isLoading, setIsLoading] = React.useState(true);
//     const [messageApi, contextHolder] = notification.useNotification();
//     const [form] = Form.useForm();
//     const t = useTranslations("User.CRUD");
//     const tMess = useTranslations("Message");
//     const { user, isAuthenticated, isAppLoading } = useSelector((state: RootState) => state.auth);
//     React.useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 const res: any = await requestApi('user/find', { method: 'GET', params:{id} });
//                 if (res && !res.statusCode) {
//                     form.setFieldsValue({
//                         ...res,
//                         role: res?.role?.id,
//                         dateOfBirth: res.dateOfBirth ? dayjs(res.dateOfBirth) : null,
//                     });
//                 } else {
//                     messageApi.error({ title: tMess('Title.error'), description: res.message || t('no_user_found') });
//                 }
//             } catch (error) {
//                 messageApi.error({ title: tMess('Title.error'), description: tMess('Description.Unable_to_connect_to_the_server') });
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         const fetchRole = async () =>{
//             try {
//                 const res: any = await requestApi('roles/find-all', { method: 'GET' });
//                 if (res && !res.statusCode) {
//                     setRole(res.data);
//                 } else {
//                     messageApi.error({ title: tMess('Title.role'), description: res.message || tMess('Description.You_are_not_authorized_to_do_this') });
//                 }
//             } catch (error) {
//                 messageApi.error({ title: tMess('Title.error'), description: tMess('Description.Unable_to_connect_to_the_server') });
//             } finally {
//                 setIsLoading(false);
//             }
//         }
//         if (id) fetchUserData();
//         fetchRole();
//     }, [id, form, messageApi]);
//     const onFinish = async (values: any) => {
//         setIsLoading(true);
//         try {
//             const transformedData = {
//                 ...values,
//                 role: { id: values.role }
//             };
//             const res: any = await requestApi(`user/${id}`, {
//                 method: 'PATCH',
//                 body: JSON.stringify(transformedData),
//             });
//
//             if (res && !res.statusCode) {
//                 messageApi.success({
//                     title: tMess('Title.success'),
//                     description: tMess('Description.data_update_successfully'),
//                 });
//                 setTimeout(() => router.push('/admin/user'), 1500);
//             } else {
//                 messageApi.error({
//                     title: tMess('Title.success'),
//                     description: Array.isArray(res.message) ? res.message[0] : res.message,
//                 });
//             }
//         } catch (error) {
//             messageApi.error({ title: tMess('Title.error'), description: tMess('Description.Unable_to_connect_to_the_server') });
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
//             <Card title={`Chỉnh sửa người dùng (ID: ${id})`}>
//                 <Spin spinning={isLoading}>
//                     <Form
//                         form={form}
//                         layout="vertical"
//                         onFinish={onFinish}
//                         autoComplete="off"
//                     >
//                         <Form.Item
//                             label="Họ và tên"
//                             name="fullName"
//                             rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
//                         >
//                             <Input placeholder="Họ và Tên" />
//                         </Form.Item>
//
//                         <Form.Item
//                             label="Email"
//                             name="email"
//                             rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}
//                         >
//                             <Input placeholder="example@gmail.com" />
//                         </Form.Item>
//
//                         <Form.Item label="Số điện thoại" name="phone" rules={[{
//                             required: true,
//                             message: 'Vui lòng nhập số điện thoại!'
//                         },
//                             {
//                                 pattern: /^(0[3|5|7|8|9])([0-9]{8})$/,
//                                 message: 'Số điện thoại không đúng định dạng Việt Nam (10 số)!',
//                             }]}>
//                             <Input placeholder="090..." maxLength={10} allowClear onKeyPress={(event) => {
//                                 if (!/[0-9]/.test(event.key)) {
//                                     event.preventDefault();
//                                 }
//                             }}/>
//                         </Form.Item>
//
//                         <Form.Item label="Vai trò" name="role" initialValue={user.role.id}>
//                             <Select
//                                 placeholder={t('please_select_role')}
//                                 options={[
//                                     ...role.map((item: any) => {
//                                         return {value: item.id, label: item.name};
//                                     })
//                             ]} />
//                         </Form.Item>
//
//                         <Form.Item label="Địa chỉ" name="address">
//                             <Input placeholder={"Địa chỉ"} />
//                         </Form.Item>
//                         <Form.Item label="Ngày sinh" name="dateOfBirth" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
//                             <DatePicker
//                                 format="DD/MM/YYYY"
//                                 style={{ width: '100%' }}
//                                 placeholder="Chọn ngày sinh"
//                             />
//                         </Form.Item>
//                         <Form.Item label="Xác thực email" name="isEmailVerified" initialValue={user.isEmailVerified}>
//                             <Select options={[
//                                 { value: true, label: 'Đã xác thực' },
//                                 { value: false, label: 'Chưa xác thực' },
//                             ]} />
//                         </Form.Item>
//                         <Form.Item label="Trạng thái" name="status" initialValue={user.status}>
//                             <Select options={[
//                                 { value: 'active', label: 'Đang sử dụng' },
//                                 { value: 'inactive', label: 'Đã khóa' },
//                                 { value: 'deleted', label: 'Đã xóa' },
//                             ]} />
//                         </Form.Item>
//
//                         <Form.Item>
//                             <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isLoading}>
//                                 Lưu thay đổi
//                             </Button>
//                         </Form.Item>
//                     </Form>
//                 </Spin>
//             </Card>
//         </div>
//     </>
// }
// export default Page