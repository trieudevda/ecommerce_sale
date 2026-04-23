'use client'
import {useParams, useRouter} from 'next/navigation';
import React, {useState} from "react";
import {Button, Card, DatePicker, Form, Input, Layout, notification, Select, Space, Spin} from "antd";
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import {useTranslations} from "use-intl";
import dynamic from "next/dynamic";

const TiptapFull = dynamic(() => import('@/components/Common/Editor/TiptapFull'), { ssr: false })
const Page = ()=>{
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [role,setRole]=useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [messageApi, contextHolder] = notification.useNotification();
    const t = useTranslations("Product.CRUD");
    const [form] = Form.useForm();
    const [content, setContent] = useState('')

    const handleSubmit = () => {
        console.log("Dữ liệu gửi lên server:", description)
    }
    React.useEffect(() => {
        // const fetchUserData = async () => {
        //     try {
        //         const res: any = await requestApi('product/find', { method: 'GET', params:{id} });
        //         if (res && !res.statusCode) {
        //             form.setFieldsValue({
        //                 ...res,
        //                 dateOfBirth: res.dateOfBirth ? dayjs(res.dateOfBirth) : null,
        //             });
        //         } else {
        //             messageApi.error({ title: 'Lỗi', description: res.message || 'Không tìm thấy người dùng' });
        //         }
        //     } catch (error) {
        //         messageApi.error({ title: 'Lỗi kết nối', description: 'Không thể lấy dữ liệu từ server' });
        //     } finally {
        //         setIsLoading(false);
        //     }
        // };
        // const fetchRole = async () =>{
        //     try {
        //         const res: any = await requestApi('roles/find-all', { method: 'GET' });
        //         if (res && !res.statusCode) {
        //             setRole(res.data);
        //         } else {
        //             messageApi.error({ title: 'Lỗi', description: res.message || 'Chưa có vai trò' });
        //         }
        //     } catch (error) {
        //         messageApi.error({ title: 'Lỗi kết nối', description: 'Không thể lấy dữ liệu từ server' });
        //     } finally {
        //         setIsLoading(false);
        //     }
        // }

        // if (id) fetchUserData();
        // fetchRole();
    }, [id, form, messageApi]);
    const onFinish = async (values: any) => {
        console.log(values);
        // setIsLoading(true);
        // try {
        //     const transformedData = {
        //         ...values,
        //         role: { id: values.role }
        //     };
        //     const res: any = await requestApi(`user`, {
        //         method: 'POST',
        //         body: JSON.stringify(transformedData),
        //     });
        //
        //     if (res && !res.statusCode) {
        //         messageApi.success({
        //             title: 'Thành công',
        //             description: 'Thêm người dùng thành công.',
        //         });
        //         setTimeout(() => router.push('/admin/user'), 1500);
        //     } else {
        //         messageApi.error({
        //             title: 'Thất bại',
        //             description: Array.isArray(res.message) ? res.message[0] : res.message,
        //         });
        //     }
        // } catch (error) {
        //     messageApi.error({ title: 'Lỗi', description: 'Có lỗi xảy ra khi lưu dữ liệu' });
        // } finally {
        //     setIsLoading(false);
        // }
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
                            label={t('name')}
                            name="name"
                            rules={[{ required: true, message: t('please_enter_name') }]}
                        >
                            <Input placeholder={t('name')} />
                        </Form.Item>
                        <Form.Item
                            label={t('short_description')}
                            name="short_description"
                            rules={[{ required: true, message: t('please_enter_short_description') }]}
                        >
                            <Input placeholder={t('short_description')} />
                        </Form.Item>
                        <Form.Item
                            label={t('description')}
                            name="description"
                            rules={[{ required: true, message: t('please_enter_description') }]}
                        >
                            <Input placeholder={t('description')} />
                        </Form.Item>
                        <TiptapFull value={content} onChange={setContent} />
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