'use client'
import React from "react";
import {Button, Card, Form, Input, notification, Space, Spin} from "antd";
import {MinusCircleOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {useTranslations} from "use-intl";
import {requestApi} from "@/components/api/be.api";
import LoadingAdmin from "@/components/templates/admin/loading/loading-admin";

const Page = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [messageApi, contextHolder] = notification.useNotification();
    const t = useTranslations("Product.Category.Attribute");
    const tMess = useTranslations("Message");
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
                    title: tMess('Title.info'),
                    description: tMess('Description.data_added_successfully'),
                });
            } else {
                messageApi.error({
                    title: tMess('Title.info'),
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
                            <Form.List
                                name="values"
                                rules={[
                                    {
                                        validator: async (_, names) => {
                                            if (!names || names.length < 1) {
                                                return Promise.reject(new Error(t('there_must_be_at_least_one_value')));
                                            }
                                        },
                                    },
                                ]}
                            >
                                {(fields, { add, remove }, { errors }) => (
                                    <>
                                        {fields.map((field) => (
                                            <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                <Form.Item
                                                    {...field}
                                                    name={[field.name, 'value']} // Map vào mảng object: { value: '...' }
                                                    rules={[{ required: true, message: t('enter_value') }]}
                                                >
                                                    <Input placeholder="Ví dụ: Đỏ / XL / 128GB" />
                                                </Form.Item>

                                                {/* Nút xóa từng value */}
                                                <MinusCircleOutlined onClick={() => remove(field.name)} />
                                            </Space>
                                        ))}

                                        {/* Nút thêm mới một dòng value */}
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