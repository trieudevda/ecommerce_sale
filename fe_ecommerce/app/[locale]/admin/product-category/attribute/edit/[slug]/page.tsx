'use client'
import {useParams, useRouter} from 'next/navigation';

import React, {useState} from "react";
import {requestApi} from "@/components/api/be.api";
import {Button, Card, DatePicker, Form, Input, Layout, notification, Select, Space, Spin} from "antd";
import {ArrowLeftOutlined, MinusCircleOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {useTranslations} from "use-intl";

const Page = ()=>{
    const router = useRouter();
    const params = useParams();
    const slug = params.slug;
    const [isLoading, setIsLoading] = React.useState(false);
    const [messageApi, contextHolder] = notification.useNotification();
    const [form] = Form.useForm();
    const t = useTranslations("Product.Category.Attribute");
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await requestApi('category-attribute/find?slug='+slug, { method: 'GET' });
                if( data.statusCode === 403 ){
                    messageApi.error({title:'Thuộc tính',description: "Bạn không có quyền thực hiện việc này!",
                        placement: 'bottomRight',});
                    return;
                }
                form.setFieldsValue(data.data);
            } catch (error) {
                messageApi.error({title:'Thuộc tính',description: "Lỗi khi lấy dữ liệu!",
                    placement: 'bottomRight',});
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    },[]);
    const onFinish = async (values: any) => {
        setIsLoading(true);
        try {
            const res: object = await requestApi(`category-attribute/${slug}`, {
                method: 'PATCH',
                body: JSON.stringify(values),
            });

            if (res && !res.statusCode) {
                messageApi.success({
                    title: 'Thành công',
                    description: 'Thuộc tính đã được cập nhật.',
                });
                // setTimeout(() => router.push('/admin/user'), 1500);
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
            <Card title={t('edit_attr')}>
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
                        <Form.List
                            name="values"
                            rules={[
                                {
                                    validator: async (_, names) => {
                                        if (!names || names.length < 1) {
                                            return Promise.reject(new Error('Phải có ít nhất 1 giá trị'));
                                        }
                                    },
                                },
                            ]}
                        >
                            {(fields, { add, remove }, { errors }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space
                                            key={key} // Dùng key của antd cung cấp
                                            style={{ display: 'flex', marginBottom: 8 }}
                                            align="baseline"
                                        >
                                            {/* 1. Lưu ID ẩn để Backend nhận diện (id: 1, 2, 3...) */}
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'id']}
                                                noStyle
                                            >
                                                <Input type="hidden" />
                                            </Form.Item>

                                            {/* 2. Ô nhập giá trị (value: "do", "vang"...) */}
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'value']}
                                                rules={[{ required: true, message: 'Nhập giá trị' }]}
                                            >
                                                <Input placeholder="Ví dụ: Đỏ / XL / 128GB" />
                                            </Form.Item>

                                            {/* 3. Nút xóa: dùng biến name đã lấy ra ở trên */}
                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}

                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                            icon={<PlusOutlined />}
                                        >
                                            Thêm giá trị
                                        </Button>
                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
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