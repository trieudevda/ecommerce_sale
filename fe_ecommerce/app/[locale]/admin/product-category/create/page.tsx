'use client'
import {useParams} from 'next/navigation';
import React, {useState} from "react";
import {Button, Card, Form, Input, notification, Select, Spin} from "antd";
import {SaveOutlined} from "@ant-design/icons";
import {useTranslations} from "use-intl";
import {requestApi} from "@/components/api/be.api";
import LoadingPage from "@/src/custom/loading-page/loading-page";

const Page = () => {
    const params = useParams();
    const id = params.id;
    const [cate, setCate] = useState([]);
    const [cateType, setCateType] = useState([]);
    const [cateAttr, setCateAttr] = useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isChildLoading, setIsChildLoading] = useState(false);
    const [messageApi, contextHolder] = notification.useNotification();
    const t = useTranslations("Product.Category");
    const tMess = useTranslations("Message");
    const [form] = Form.useForm();
    React.useEffect(() => {
        const fetchCateAttr = async () => {
            try {
                const res: any = await requestApi('category-attribute/find-all', { method: 'GET' });
                if (res && !res.statusCode) {
                    if (res !== "undefined")
                        setCateAttr(res.data);
                } else {
                    messageApi.error({ title: tMess('Title.error'), description: res.message || tMess('Description.You_are_not_authorized_to_do_this') });
                }
            } catch (error) {
                messageApi.error({ title: tMess('Title.error'), description: tMess('Description.Unable_to_connect_to_the_server') });
            } finally {
                setIsLoading(false);
            }
        }
        const fetchCateType = async () => {
            try {
                const res: any = await requestApi('category/enums/ref-types', { method: 'GET' });
                if (res && !res.statusCode) {
                    if (res !== "undefined")
                        setCateType(res);
                } else {
                    messageApi.error({ title: tMess('Title.error'), description: res.message || tMess('Description.no_specific_type_available') });
                }
            } catch (error) {
                messageApi.error({ title: tMess('Title.error'), description: tMess('Description.Unable_to_connect_to_the_server') });
            } finally {
                setIsLoading(false);
            }
        }
        fetchCateAttr();
        fetchCateType();
    }, [id, form, messageApi]);
    const fetchCate = async (type: string) => {
        form.setFieldValue('childId', undefined);
        setCate([]);
        setIsChildLoading(true);
        try {
            const res: any = await requestApi('category/find-all', { method: 'GET',params:{type: type} });
            if (res && !res.statusCode) {
                if (res !== "undefined")
                    setCate(res.data);
            } else {
                messageApi.error({ title: tMess('Title.error'), description: res.message || tMess('Description.no_role_yet') });
            }
        } catch (error) {
            messageApi.error({ title: tMess('Title.error'), description: tMess('Description.Unable_to_connect_to_the_server') });
        } finally {
            setIsChildLoading(false);
        }
    }
    const onFinish = async (values: any) => {
        setIsLoading(true);
        try {
            const res: any = await requestApi(`category`, {
                method: 'POST',
                body: JSON.stringify(values),
            });
            if (res && !res.statusCode) {
                messageApi.success({
                    title: tMess('Title.info'),
                    description: tMess('category_added_successfully'),
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
    if (isLoading) {
        return <LoadingPage />;
    }
    return <>
        {contextHolder}
        <div style={{ maxWidth: 800, margin: '0 auto' }}>

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
                        {
                            cateType && cateType.length && <Form.Item label={t('category_type')} name="type">
                                <Select
                                    placeholder={t('please_select_category_type')}
                                    onChange={fetchCate}
                                    options={[
                                        ...(cateType?.map((item: any) => {
                                            return { value: item.value, label: item.label };
                                        })) || []
                                    ]} />
                            </Form.Item>
                        }
                        {
                            cate.length > 0
                                ? <Form.Item label={t('category')} name="parentId">
                                    <Select
                                        loading = {isChildLoading}
                                        placeholder={t('please_select_category')}
                                        options={[
                                            ...(cate?.map((item: any) => {
                                                return { value: item.id, label: item.name };
                                            })) || []
                                        ]} />
                                </Form.Item>
                                : <></>
                        }
                        {
                            cateAttr && cateAttr.length > 0
                                ? <Form.Item label={t('attributes')} name="attributeIds">
                                    <Select
                                        mode="multiple"
                                        placeholder={t('please_select_attribute')}
                                        options={[
                                            ...(cateAttr?.map((item: any) => {
                                                return { value: item.id, label: item.name };
                                            })) || []
                                        ]} />
                                </Form.Item>
                                : <></>
                        }

                        <Form.Item
                            label={t('description')}
                            name="description"
                            // rules={[{ required: true, message: t('please_enter_description') }]}
                        >
                            <Input.TextArea placeholder={t('description')} />
                        </Form.Item>

                        <Form.Item
                            label={t('metaTitle')}
                            name="metaTitle"
                            // rules={[{ required: true, message: t('please_enter_meta_title') }]}
                        >
                            <Input placeholder={t('metaTitle')} />
                        </Form.Item>

                        <Form.Item
                            label={t('metaDescription')}
                            name="metaDescription"
                            // rules={[{ required: true, message: t('please_enter_meta_description') }]}
                        >
                            <Input placeholder={t('metaDescription')} />
                        </Form.Item>

                        <Form.Item
                            label={t('metaKeywords')}
                            name="metaKeywords"
                            // rules={[{ required: true, message: t('please_enter_meta_keywords') }]}
                        >
                            <Input placeholder={t('metaKeywords')} />
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