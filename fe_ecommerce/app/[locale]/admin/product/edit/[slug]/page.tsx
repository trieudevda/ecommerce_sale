"use client";
import {useParams, useRouter} from "next/navigation";
import React, {useState} from "react";
import {Button, Card, Form, Input, InputNumber, notification, Select, Space, Spin, Upload,} from "antd";
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
  const params = useParams();
  const slug = params.slug;
  const [cate, setCate] = useState([]);
  const [cateAttr, setCateAttr] = useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [messageApi, contextHolder] = notification.useNotification();
  const t = useTranslations("Product.CRUD");
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);
  const [existingAvatarId, setExistingAvatarId] = useState<number | null>(null);
  const [existingGalleryIds, setExistingGalleryIds] = useState<number[]>([]);

  React.useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const [cateRes, dataSlug, attrRes]: any = await Promise.all([
          requestApi("category/find-all", { method: "GET" }),
          requestApi("product/find", { method: "GET", params: { slug: slug } }),
          requestApi("category-attribute/find-all", { method: "GET" }),
        ]);
        if (cateRes && !cateRes.statusCode) {
          setCate(cateRes.data);
        }
        if (dataSlug && !dataSlug.statusCode) {
          form.setFieldsValue({
            ...dataSlug,
            category: dataSlug.category?.id,
            variants: dataSlug.variants?.map((v: any) => ({
              id: v.id,
              sku: v.sku,
              stock: v.stock,
              price: getPriceNumber(v.prices?.price),
              priceId: v.prices?.id,
              attributeValueIds: v.attributeValues?.map((a: any) => a.id) || [],
            })),
          });
          setContent(dataSlug.description);
          setExistingAvatarId(dataSlug.gallery[0]?.id || null);
          setAvatarPreview(
            dataSlug.gallery?.[0]?.url
              ? process.env.NEXT_PUBLIC_IMAGE_URL +
                  "/uploads/" +
                  dataSlug.gallery[0].url
              : null,
          );
          setExistingGalleryIds(
            dataSlug.gallery
              ?.filter((img: any) => img.isPrimary === false)
              .map((img: any) => img.id) || [],
          );
          setGalleryPreview(
            dataSlug.gallery
              ?.filter((img: any) => img.isPrimary !== true)
              .map((img: any) => ({
                uid: img.id.toString(),
                name: img.url,
                status: "done",
                url: process.env.NEXT_PUBLIC_IMAGE_URL + "/uploads/" + img.url,
              })) || [],
          );
        }
        if (attrRes && !attrRes.statusCode) {
          setCateAttr(attrRes.data);
        }
      } catch (error) {
        messageApi.error({
          title: "Lỗi",
          description: "Không thể tải dữ liệu",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);
  function getPriceNumber(priceString?: string) {
    return Number(priceString?.trim() || 0);
  }
  const PriceInput = ({ value = '', onChange }: any) => {
    return (
      <InputNumber
      value={value}
      style={{ width: "100%" }}
      controls={false}
      stringMode
      formatter={(value) =>
        String(value || "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      }
      parser={(value) =>
        String(value || "").replace(/\./g, "")
      }
      onKeyDown={(e) => {
        const allowKeys = [
          "Backspace",
          "Delete",
          "ArrowLeft",
          "ArrowRight",
          "Tab",
        ];

        if (
          !/[0-9]/.test(e.key) &&
          !allowKeys.includes(e.key)
        ) {
          e.preventDefault();
        }
      }}
      onChange={onChange}
    />
    );
  };
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
        formData.append("avatar", avatarFile);
      }
      if (avatarPreview)
        formData.append(
          "existingAvatarIds",
          existingAvatarId ? existingAvatarId.toString() : "null",
        );
      galleryFiles.forEach((file) => {
        formData.append("gallery", file);
      });
      if (galleryPreview.length > 0)
        formData.append(
          "existingGalleryIds",
          JSON.stringify(existingGalleryIds),
        );
      if (values.variants && values.variants.length > 0) {
        const variants = values.variants.map((v: any) => ({
          ...v,
          prices: {
            id: v.priceId ?? null,
            price: v.price,
          },
        }));
        formData.append("variants", JSON.stringify(variants));
      }
      const res: any = await requestApi(`product/${slug}`, {
        method: "PATCH",
        body: formData,
      });
      if (res && res.status === "success") {
        messageApi.success({
          title: "Thành công",
          description: "Cập nhật sản phẩm thành công.",
        });
        setTimeout(() => router.push(ADMIN_PATHS.PRODUCT.LIST()), 1500);
      } else {
        messageApi.error({
          title: "Thất bại",
          description: Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        });
      }
    } catch (error) {
      messageApi.error({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi lưu dữ liệu" + error.toString(),
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {contextHolder}
        <Card title={t("edit")}>
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
              <Form.Item label="Ảnh đại diện (Avatar)">
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={(file) => {
                    setAvatarFile(file);
                    setAvatarPreview(URL.createObjectURL(file));
                    setExistingAvatarId(null);
                    return false; // Chặn upload tự động
                  }}
                  onRemove={() => {
                    setAvatarFile(null);
                    setAvatarPreview(null);
                  }}
                  fileList={
                    avatarPreview
                      ? [
                          {
                            uid: "-1",
                            name: "image.png",
                            status: "done",
                            url: avatarPreview,
                          },
                        ]
                      : []
                  }
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
                    setGalleryPreview((prev) => [
                      ...prev,
                      {
                        uid: file.uid,
                        name: file.name,
                        status: "done",
                        url: URL.createObjectURL(file),
                      },
                    ]);
                    return false;
                  }}
                  onRemove={(file) => {
                    setGalleryFiles((prev) =>
                      prev.filter((f) => f.uid !== file.uid),
                    );

                    setGalleryPreview((prev) =>
                      prev.filter((f) => f.uid !== file.uid),
                    );

                    // remove existing image id
                    if (!isNaN(Number(file.uid))) {
                      setExistingGalleryIds((prev) =>
                        prev.filter((id) => id !== Number(file.uid)),
                      );
                    }
                  }}
                  fileList={galleryPreview}
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
              <Form.Item label={t("description")} name="description">
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
                title="Biến thể sản phẩm"
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
                          <Form.Item {...restField} name={[name, "id"]} hidden>
                            <Input />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "priceId"]}
                            hidden
                          >
                             <Input />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "attributeValueIds"]}
                            label="Thuộc tính"
                            style={{ width: 250 }}
                            rules={[
                              { required: true, message: "Chọn thuộc tính" },
                            ]}
                          >
                            <Select
                              mode="multiple"
                              placeholder="Chọn giá trị (VD: Đỏ, L)"
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
                            label="Mã SKU"
                            rules={[{ required: true, message: "Nhập SKU" }]}
                          >
                            <Input placeholder="Mã SKU" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "stock"]}
                            label="Kho"
                            rules={[
                              { required: true, message: "Nhập tồn kho" },
                            ]}
                          >
                            <Input placeholder="Tồn kho" type="number" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, "price"]}
                            label="Giá"
                            rules={[{ required: true, message: "Nhập giá" }]}
                          >
                            <PriceInput />
                            {/* <Input placeholder="Giá bán" type="number" */}
                            {/* /> */}
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
