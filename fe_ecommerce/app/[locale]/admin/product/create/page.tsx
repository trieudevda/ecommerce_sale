'use client'
import {useParams, useRouter} from 'next/navigation';
import React, {useState} from "react";
import {Button, Card, Form, Input, notification, Select, Space, Spin, Upload} from "antd";
import {PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {useTranslations} from "use-intl";
import dynamic from "next/dynamic";
import {requestApi} from "@/components/api/be.api"

const TiptapFull = dynamic(() => import('@/components/Common/Editor/TiptapFull'), { ssr: false })
const Page = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [cate, setCate] = useState([]);
    const [cateAttr, setCateAttr] = useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [messageApi, contextHolder] = notification.useNotification();
    const t = useTranslations("Product.CRUD");
    const [form] = Form.useForm();
    const [content, setContent] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

    React.useEffect(() => {
        const fetchCate = async () => {
            try {
                const res: any = await requestApi('category/find-all', { method: 'GET' });
                if (res && !res.statusCode) {
                    setCate(res.data);
                } else {
                    messageApi.error({ title: 'Lỗi', description: res.message || 'Chưa có danh mục' });
                }
            } catch (error) {
                messageApi.error({ title: 'Lỗi kết nối', description: 'Không thể lấy dữ liệu từ server' });
            } finally {
                setIsLoading(false);
            }
        }
        const fetchData = async () => {
            try {
                const data = await requestApi('category-attribute/find-all', { method: 'GET' });
                if (data.statusCode === 403) {
                    messageApi.error({
                        title: 'Danh mục', description: "Bạn không có quyền thực hiện việc này!",
                        placement: 'bottomRight',
                    });
                    return;
                }
                setCateAttr(data.data);
            } catch (error) {
                messageApi.error({ title: 'Lỗi', description: 'Có lỗi xảy ra khi lưu dữ liệu' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
        fetchCate();
    }, [id, form, messageApi]);
    const onFinish = async (values: any) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('short_description', values.short_description);
            formData.append('description', content);
            formData.append('category', JSON.stringify({id:Number(values.category)}));
            formData.append('refType', 'PRODUCT')
            console.log(values)
            console.log('formData')
            console.log(formData)
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }
            galleryFiles.forEach((file) => {
                formData.append('gallery', file);
            });
            if (values.variants && values.variants.length > 0) {
                formData.append('variants', JSON.stringify(values.variants));
            }

            // console.log(formData);
            const res: any = await requestApi(`product`, {
                method: 'POST',
                body: formData,
            });

            // console.log(res);
            // const transformedData = {
            //     ...values,
            //     cate: { id: values.cate },
            //     refType: "PRODUCT",
            //     'avatar': avatarFile,
            //     'gallery': galleryFiles
            // };
            // // console.log(transformedData);
            // const res: any = await requestApi(`product`, {
            //     method: 'POST',
            //     body: JSON.stringify(transformedData),
            // });
            // console.log(res)

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
        } catch (error) {
            messageApi.error({ title: 'Lỗi', description: 'Có lỗi xảy ra khi lưu dữ liệu' });
        } finally {
            setIsLoading(false);
        }
    };
    return <>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {contextHolder}
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
                        <Form.Item label="Ảnh đại diện (Avatar)">
                            <Upload
                                listType="picture-card"
                                maxCount={1}
                                beforeUpload={(file) => {
                                    setAvatarFile(file);
                                    return false; // Chặn upload tự động
                                }}
                                onRemove={() => setAvatarFile(null)}
                            >
                                {!avatarFile && (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Tải lên</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                        <Form.Item label="Thư viện ảnh (Gallery)">
                            <Upload
                                listType="picture-card"
                                multiple
                                beforeUpload={(file) => {
                                    setGalleryFiles((prev) => [...prev, file]);
                                    return false;
                                }}
                                onRemove={(file) => {
                                    setGalleryFiles((prev) => prev.filter((f) => f.uid !== file.uid));
                                }}
                            >
                                {galleryFiles.length < 10 && (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Tải lên</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            label={t('short_description')}
                            name="short_description"
                            rules={[{ required: true, message: t('please_enter_short_description') }]}
                        >
                            <Input.TextArea placeholder={t('short_description')} />
                        </Form.Item>
                        <Form.Item
                            label={t('description')}
                            name="description"
                            // rules={[{ required: true, message: t('please_enter_description') }]}
                        >
                            <TiptapFull value={content} onChange={setContent} />
                        </Form.Item>

                        <Form.Item label={t('category')} name="category">
                            <Select
                                placeholder={t('please_select_cate')}
                                options={[
                                    ...cate.map((item: any) => {
                                        return { value: item.id, label: item.name };
                                    })
                                ]} />
                        </Form.Item>
                        <Card title="Biến thể sản phẩm" size="small" style={{ marginBottom: 20 }}>
                            <Form.List name="variants">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Space key={key} style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 16, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }} align="baseline">
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'attributeValueIds']}
                                                    label="Thuộc tính"
                                                    style={{ width: 250 }}
                                                    rules={[{ required: true, message: 'Chọn thuộc tính' }]}
                                                >
                                                    <Select
                                                        mode="multiple"
                                                        placeholder="Chọn giá trị (VD: Đỏ, L)"
                                                        options={cateAttr?.map((attr: any) => ({
                                                            label: attr.name, 
                                                            options: attr.values?.map((val: any) => ({
                                                                label: val.value, 
                                                                value: val.id 
                                                            }))
                                                        }))}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'sku']}
                                                    label="Mã SKU"
                                                    rules={[{ required: true, message: 'Nhập SKU' }]}
                                                >
                                                    <Input placeholder="Mã SKU" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'stock']}
                                                    label="Kho"
                                                    rules={[{ required: true, message: 'Nhập tồn kho' }]}
                                                >
                                                    <Input placeholder="Tồn kho" type="number" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'price']}
                                                    label="Giá"
                                                    rules={[{ required: true, message: 'Nhập giá' }]}
                                                >
                                                    <Input placeholder="Giá bán" type="number" />
                                                </Form.Item>

                                                <Button type="link" onClick={() => remove(name)} danger style={{ marginTop: 30 }}>
                                                    Xóa
                                                </Button>
                                            </Space>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                Thêm biến thể mới
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Card>

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