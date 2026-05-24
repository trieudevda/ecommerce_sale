"use client";
import {useRouter} from "next/navigation";
import React, {useState} from "react";
import {Button, Card, Form, Input, InputNumber, notification, Select, Space, Spin, Upload, UploadFile} from "antd";
import {PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {useTranslations} from "use-intl";
import dynamic from "next/dynamic";
import {requestApi} from "@/components/api/be.api";
import {ADMIN_PATHS} from "@/src/path";

const TiptapFull = dynamic(
  () => import("@/components/Common/Editor/TiptapFull"),
  { ssr: false },
);
const Page = () => {
  const router = useRouter();
  const [cate, setCate] = useState([]);
  const [cateAttr, setCateAttr] = useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [messageApi, contextHolder] = notification.useNotification();
  const t = useTranslations("Product.CRUD");
  const tMess = useTranslations("Message");
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [avatarFile, setAvatarFile] = useState<UploadFile  | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<UploadFile []>([]);

  React.useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const [cateRes, attrRes] = await Promise.all([
          requestApi("category/find-all", { method: "GET" }),
          requestApi("category-attribute/find-all", { method: "GET" }),
        ]);
        if (cateRes && !cateRes.statusCode) {
          setCate(cateRes.data);
        }
        if (attrRes && !attrRes.statusCode) {
          setCateAttr(attrRes.data);
        }
      } catch (error) {
        messageApi.error({
          title: tMess('Title.error'),
          description: tMess('Description.Unable_to_connect_to_the_server'),
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);
  const onFinish = async (values: any) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("short_description", values.short_description);
      formData.append("description", content);
      formData.append(
        "category",
        JSON.stringify({ id: Number(values.category) }),
      );
      formData.append("refType", "PRODUCT");
      if (avatarFile) {
        formData.append("avatar", avatarFile.originFileObj);
      }
      galleryFiles.forEach((file) => {
        formData.append("gallery", file.originFileObj);
      });
      if (values.variants && values.variants.length > 0) {
        formData.append("variants", JSON.stringify(values.variants));
      }
      const res: any = await requestApi(`product`, {
        method: "POST",
        body: formData,
      });
      if (res && res.status === "success") {
        messageApi.success({
          title: tMess('Title.success'),
          description: tMess('Description.data_added_successfully'),
        });
        setTimeout(() => router.push(ADMIN_PATHS.PRODUCT.LIST()), 1500);
      } else {
        messageApi.error({
          title: tMess('Title.fail'),
          description: Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        });
      }
    } catch (error) {
      messageApi.error({
        title: tMess('Title.fail'),
        description:  tMess('Description.An_error_occurred_while_saving_the_data'),
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {contextHolder}
        <Card title={t("create")}>
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
                rules={[{ required: true, message: t("please_enter_name") }]}
              >
                <Input placeholder={t("name")} />
              </Form.Item>
              <Form.Item
                label={t("avatar")}
                name={'avatar'}
                rules={[{ required: true, message: t("please_upload_avatar") }]}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={(file) => {
                    const uploadFile: UploadFile = {
                      uid: file.uid,
                      name: file.name,
                      status: "done",
                      originFileObj: file,
                    };
                    setAvatarFile(uploadFile);
                    return false;
                  }}
                  fileList={avatarFile ? [avatarFile as any] : []}
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
              <Form.Item label={t("gallery")} rules={[{ required: true, message: t("please_upload_gallery") }]}>
                <Upload
                  listType="picture-card"
                  multiple
                  beforeUpload={(file) => {
                    const uploadFile: UploadFile = {
                      uid: file.uid,
                      name: file.name,
                      status: "done",
                      originFileObj: file,
                    };
                    setGalleryFiles((prev) => [...prev, uploadFile]);
                    return false;
                  }}
                  onRemove={(file) => {
                    setGalleryFiles((prev) =>
                      prev.filter((f) => f.uid !== file.uid),
                    );
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
                label={t("short_description")}
                name="short_description"
                rules={[
                  {
                    required: true,
                    message: t("please_enter_short_description"),
                  },
                ]}
              >
                <Input.TextArea placeholder={t("short_description")} />
              </Form.Item>
              <Form.Item label={t("description")}>
                <TiptapFull value={content} onChange={setContent} />
              </Form.Item>

              <Form.Item label={t("category")} name="category">
                <Select
                  placeholder={t("please_select_cate")}
                  options={[
                    ...cate.map((item: any) => {
                      return { value: item.id, label: item.name };
                    }),
                  ]}
                />
              </Form.Item>
              <Card
                title={t('product_variations')}
                size="small"
                style={{ marginBottom: 20 }}
              >
                <Form.List name="variants">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Space
                          key={key}
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            marginBottom: 16,
                            borderBottom: "1px solid #f0f0f0",
                            paddingBottom: 8,
                          }}
                          align="baseline"
                        >
                          <Form.Item
                            {...restField}
                            name={[name, "attributeValueIds"]}
                            label="Thuộc tính"
                            style={{ width: 250 }}
                            rules={[
                              { required: true, message: t('select_properties') },
                            ]}
                          >
                            <Select
                              mode="multiple"
                              placeholder={t('select_a_value')}
                              options={cateAttr?.map((attr: any) => ({
                                label: attr.name,
                                options: attr.values?.map((val: any) => ({
                                  label: val.value,
                                  value: val.id,
                                })),
                              }))}
                            />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "sku"]}
                            label={t('SKU_code')}
                            rules={[{ required: true, message: t('enter_SKU') }]}
                          >
                            <Input placeholder={t('SKU_code')} />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "stock"]}
                            label={t('stock')}
                            rules={[
                              { required: true, message: t('please_enter_stock') },
                            ]}
                          >
                            <InputNumber placeholder={t('stock')} min={0} />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "price"]}
                            label={t('price')}
                            rules={[{ required: true, message: t('enter_price') }]}
                          >
                            <InputNumber placeholder={t('price')} min={0} />
                          </Form.Item>

                          <Button
                            type="link"
                            onClick={() => remove(name)}
                            danger
                            style={{ marginTop: 30 }}
                          >
                            Xóa
                          </Button>
                        </Space>
                      ))}
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Thêm biến thể mới
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Card>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={isLoading}
                >
                  {t("save")}
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
      </div>
    </>
  );
};
export default Page;
