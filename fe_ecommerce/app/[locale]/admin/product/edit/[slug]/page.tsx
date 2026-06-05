"use client";
import {useParams, useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {
  Button,
  Card,
  ConfigProvider,
  Form,
  Input,
  InputNumber,
  notification,
  Select,
  Spin,
  Typography,
  Upload
} from "antd";
import {
  AppstoreAddOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  InboxOutlined,
  PictureOutlined,
  PlusOutlined,
  SaveOutlined,
  TagsOutlined
} from "@ant-design/icons";
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
  const tMess = useTranslations("Message");
  const [form] = Form.useForm();

  const [content, setContent] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreview, setGalleryPreview] = useState<any[]>([]);
  const [existingAvatarId, setExistingAvatarId] = useState<number | null>(null);
  const [existingGalleryIds, setExistingGalleryIds] = useState<number[]>([]);

  useEffect(() => {
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
          title: tMess('Title.error'),
          description: tMess('Description.Unable_to_connect_to_the_server'),
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
            className="w-full hover:border-blue-400 focus:border-blue-500"
            controls={false}
            stringMode
            formatter={(val) => String(val || "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            parser={(val) => String(val || "").replace(/\./g, "")}
            onKeyDown={(e) => {
              const allowKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
              if (!/[0-9]/.test(e.key) && !allowKeys.includes(e.key)) {
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
      formData.append("category", JSON.stringify({ id: Number(values.category) }));
      formData.append("refType", "PRODUCT");

      if (avatarFile) formData.append("avatar", avatarFile);
      if (avatarPreview) formData.append("existingAvatarIds", existingAvatarId ? existingAvatarId.toString() : "null");

      galleryFiles.forEach((file) => formData.append("gallery", file));
      if (galleryPreview.length > 0) formData.append("existingGalleryIds", JSON.stringify(existingGalleryIds));

      if (values.variants && values.variants.length > 0) {
        const variants = values.variants.map((v: any) => ({
          ...v,
          prices: { id: v.priceId ?? null, price: v.price },
        }));
        formData.append("variants", JSON.stringify(variants));
      }

      const res: any = await requestApi(`product/${slug}`, {
        method: "PATCH",
        body: formData,
      });

      if (res && res.status === "success") {
        messageApi.success({
          title: tMess('Title.success'),
          description: t('product_updated_successfully'),
        });
        setTimeout(() => router.push(ADMIN_PATHS.PRODUCT.LIST()), 1500);
      } else {
        messageApi.error({
          title: tMess('Title.error'),
          description: Array.isArray(res.message) ? res.message[0] : res.message,
        });
      }
    } catch (error) {
      messageApi.error({
        title: tMess('Title.error'),
        description: tMess('Description.An_error_occurred_while_saving_the_data'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <ConfigProvider
          theme={{
            token: { colorPrimary: '#2563eb', colorTextBase: '#334155', fontFamily: 'inherit', borderRadius: 8 },
            components: {
              Card: { paddingLG: 24 },
              Form: { itemMarginBottom: 20 },
              Input: { controlHeight: 44, colorBgContainer: '#f8fafc' },
              InputNumber: { controlHeight: 44, colorBgContainer: '#f8fafc' },
              Select: { controlHeight: 44, colorBgContainer: '#f8fafc' },
              Button: { controlHeight: 44 }
            },
          }}
      >
        {contextHolder}

        <div className="min-h-screen bg-slate-50/50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50/50 to-slate-50 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-700">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => router.back()}
                  className="flex items-center justify-center rounded-xl border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
              />
              <div>
                <Typography.Title level={2} className="!mb-0 !text-2xl !font-extrabold tracking-tight text-slate-800">
                  {t("edit")}
                </Typography.Title>
                <p className="text-slate-500 text-sm mt-1">
                  {t('edit_the_details_for_the_selected_product')}
                </p>
              </div>
            </div>
            <Spin spinning={isLoading}>
              <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  autoComplete="off"
                  className="w-full"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 flex flex-col gap-6">
                    <Card variant="borderless" className="rounded-[24px] shadow-sm ring-1 ring-slate-900/5 bg-white">
                      <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold text-lg">
                        <EditOutlined className="text-blue-500" /> {t('basic_information')}
                      </div>
                      <Form.Item
                          label={<span className="text-slate-600 font-medium">{t("name")}</span>}
                          name="name"
                          rules={[{ required: true, message: t("please_enter_name") }]}
                      >
                        <Input prefix={<TagsOutlined className="text-slate-400 mr-1" />} placeholder={t("name")} className="hover:border-blue-400 focus:border-blue-500" />
                      </Form.Item>

                      <Form.Item
                          label={<span className="text-slate-600 font-medium">{t("short_description")}</span>}
                          name="short_description"
                          rules={[{ required: true, message: t("please_enter_short_description") }]}
                      >
                        <Input.TextArea rows={3} placeholder={t("short_description")} className="bg-slate-50 hover:border-blue-400 focus:border-blue-500 rounded-lg p-3" />
                      </Form.Item>
                      <Form.Item
                          label={<span className="text-slate-600 font-medium">{t("description")}</span>}
                          className="mb-0"
                      >
                        <div className="rounded-xl overflow-hidden border border-slate-200">
                          <TiptapFull key={content} value={content} onChange={setContent} />
                        </div>
                      </Form.Item>
                    </Card>
                    <Card variant="borderless" className="rounded-[24px] shadow-sm ring-1 ring-slate-900/5 bg-white">
                      <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold text-lg">
                        <AppstoreAddOutlined className="text-blue-500" /> {t('product_variations')}
                      </div>

                      <Form.List name="variants">
                        {(fields, { add, remove }) => (
                            <div className="flex flex-col gap-4">
                              {fields.map(({ key, name, ...restField }) => (
                                  <div key={key} className="relative p-5 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:border-blue-100 group">
                                    <Form.Item {...restField} name={[name, "id"]} hidden><Input /></Form.Item>
                                    <Form.Item {...restField} name={[name, "priceId"]} hidden><Input /></Form.Item>
                                    <Button
                                        type="text" danger icon={<DeleteOutlined />} onClick={() => remove(name)}
                                        className="absolute top-3 right-3 opacity-50 group-hover:opacity-100 transition-opacity bg-white border-slate-200"
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                                      <Form.Item
                                          {...restField}
                                          name={[name, "attributeValueIds"]}
                                          label={<span className="text-slate-600 font-medium text-sm">{t('attribute')}</span>}
                                          rules={[{ required: true, message: t('select_properties') }]}
                                          className="mb-0"
                                      >
                                        <Select
                                            mode="multiple"
                                            placeholder={t('select_a_value')}
                                            options={cateAttr?.map((attr: any) => ({
                                              label: attr.name,
                                              options: attr.values?.map((val: any) => ({ label: val.value, value: val.id })),
                                            }))}
                                            className="hover:border-blue-400 focus:border-blue-500"
                                        />
                                      </Form.Item>

                                      <Form.Item
                                          {...restField}
                                          name={[name, "sku"]}
                                          label={<span className="text-slate-600 font-medium text-sm">{t('SKU_code')}</span>}
                                          rules={[{ required: true, message: t('enter_SKU') }]}
                                          className="mb-0"
                                      >
                                        <Input placeholder={t('SKU_code')} className="hover:border-blue-400 focus:border-blue-500" />
                                      </Form.Item>

                                      <Form.Item
                                          {...restField}
                                          name={[name, "stock"]}
                                          label={<span className="text-slate-600 font-medium text-sm">{t('inventory') || 'Tồn kho'}</span>}
                                          rules={[{ required: true, message: t('enter_inventory') }]}
                                          className="mb-0"
                                      >
                                        <Input placeholder="0" type="number" min={0} className="hover:border-blue-400 focus:border-blue-500" />
                                      </Form.Item>

                                      <Form.Item
                                          {...restField}
                                          name={[name, "price"]}
                                          label={<span className="text-slate-600 font-medium text-sm">{t('price')}</span>}
                                          rules={[{ required: true, message: t('enter_price') }]}
                                          className="mb-0"
                                      >
                                        <PriceInput />
                                      </Form.Item>
                                    </div>
                                  </div>
                              ))}

                              <Button
                                  type="dashed"
                                  onClick={() => add()}
                                  icon={<PlusOutlined />}
                                  className="h-12 mt-2 rounded-xl text-blue-600 border-blue-200 hover:border-blue-400 hover:bg-blue-50 bg-slate-50 font-medium"
                              >
                                {t('add_new_variant') || 'Thêm biến thể mới'}
                              </Button>
                            </div>
                        )}
                      </Form.List>
                    </Card>
                  </div>
                  <div className="w-full lg:w-[360px] flex flex-col gap-6 shrink-0">
                    <Card variant="borderless" className="rounded-[24px] shadow-sm ring-1 ring-slate-900/5 bg-white">
                      <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold text-lg">
                        <InboxOutlined className="text-blue-500" />{t('classify')}
                      </div>
                      <Form.Item
                          label={<span className="text-slate-600 font-medium">{t("category")}</span>}
                          name="category"
                          className="mb-0"
                      >
                        <Select
                            placeholder={t("please_select_cate")}
                            options={cate.map((item: any) => ({ value: item.id, label: item.name }))}
                            className="hover:border-blue-400 focus:border-blue-500"
                        />
                      </Form.Item>
                    </Card>
                    <Card variant="borderless" className="rounded-[24px] shadow-sm ring-1 ring-slate-900/5 bg-white">
                      <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold text-lg">
                        <PictureOutlined className="text-blue-500" />{t('product_images')}
                      </div>
                      <Form.Item label={<span className="text-slate-600 font-medium">{t("avatar")}</span>}>
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            className="avatar-uploader-fullwidth"
                            beforeUpload={(file) => {
                              setAvatarFile(file);
                              setAvatarPreview(URL.createObjectURL(file));
                              setExistingAvatarId(null);
                              return false;
                            }}
                            onRemove={() => {
                              setAvatarFile(null);
                              setAvatarPreview(null);
                            }}
                            fileList={avatarPreview ? [{ uid: "-1", name: "image.png", status: "done", url: avatarPreview }] : []}
                        >
                          {!avatarFile && !avatarPreview && (
                              <div className="flex flex-col items-center justify-center text-slate-500 p-4">
                                <PlusOutlined className="text-xl text-blue-500 mb-2" />
                                <div className="text-sm font-medium">{t('upload_background_image')}</div>
                              </div>
                          )}
                        </Upload>
                      </Form.Item>
                      <Form.Item
                          label={<span className="text-slate-600 font-medium">{t("gallery")}</span>}
                          className="mb-0"
                      >
                        <Upload
                            listType="picture-card"
                            multiple
                            beforeUpload={(file) => {
                              setGalleryFiles((prev) => [...prev, file]);
                              setGalleryPreview((prev) => [...prev, { uid: file.uid, name: file.name, status: "done", url: URL.createObjectURL(file) }]);
                              return false;
                            }}
                            onRemove={(file) => {
                              setGalleryFiles((prev) => prev.filter((f) => f.uid !== file.uid));
                              setGalleryPreview((prev) => prev.filter((f) => f.uid !== file.uid));
                              if (!isNaN(Number(file.uid))) {
                                setExistingGalleryIds((prev) => prev.filter((id) => id !== Number(file.uid)));
                              }
                            }}
                            fileList={galleryPreview}
                        >
                          {galleryFiles.length < 10 && (
                              <div className="flex flex-col items-center justify-center text-slate-400">
                                <PlusOutlined />
                                <div className="text-xs mt-1">{t('upload')}</div>
                              </div>
                          )}
                        </Upload>
                      </Form.Item>
                    </Card>
                    <div className="flex justify-end gap-3 mt-2">
                      <Button
                          onClick={() => router.back()}
                          className="flex-1 h-12 rounded-xl text-slate-600 font-medium hover:bg-slate-50 border-slate-200"
                      >
                        {t('cancel')}
                      </Button>
                      <Button
                          type="primary"
                          htmlType="submit"
                          icon={<SaveOutlined />}
                          loading={isLoading}
                          className="flex-1 h-12 rounded-xl font-semibold bg-blue-600 hover:bg-blue-500 border-0 shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:-translate-y-0.5 transition-all"
                      >
                        {t("save")}
                      </Button>
                    </div>
                  </div>
                </div>
              </Form>
            </Spin>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
        .avatar-uploader-fullwidth .ant-upload.ant-upload-select-picture-card {
            width: 100% !important;
            height: 160px !important;
            background-color: #f8fafc !important;
            border: 1px dashed #cbd5e1 !important;
            border-radius: 12px !important;
            transition: all 0.3s;
        }
        .avatar-uploader-fullwidth .ant-upload.ant-upload-select-picture-card:hover {
            border-color: #3b82f6 !important;
            background-color: #eff6ff !important;
        }
      `}} />
      </ConfigProvider>
  );
};

export default Page;
// "use client";
// import {useParams, useRouter} from "next/navigation";
// import React, {useState} from "react";
// import {Button, Card, Form, Input, InputNumber, notification, Select, Space, Spin, Upload,} from "antd";
// import {PlusOutlined, SaveOutlined} from "@ant-design/icons";
// import {useTranslations} from "use-intl";
// import dynamic from "next/dynamic";
// import {requestApi} from "@/components/api/be.api";
// import {ADMIN_PATHS} from "@/src/path";
//
// const TiptapFull = dynamic(
//   () => import("@/components/Common/Editor/TiptapFull"),
//   { ssr: false },
// );
// const Page = () => {
//   const router = useRouter();
//   const params = useParams();
//   const slug = params.slug;
//   const [cate, setCate] = useState([]);
//   const [cateAttr, setCateAttr] = useState([]);
//   const [isLoading, setIsLoading] = React.useState(false);
//   const [messageApi, contextHolder] = notification.useNotification();
//   const t = useTranslations("Product.CRUD");
//   const tMess = useTranslations("Message");
//   const [form] = Form.useForm();
//   const [content, setContent] = useState("");
//   const [avatarFile, setAvatarFile] = useState<File | null>(null);
//   const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
//   const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
//   const [galleryPreview, setGalleryPreview] = useState<string[]>([]);
//   const [existingAvatarId, setExistingAvatarId] = useState<number | null>(null);
//   const [existingGalleryIds, setExistingGalleryIds] = useState<number[]>([]);
//
//   React.useEffect(() => {
//     const fetchAll = async () => {
//       setIsLoading(true);
//       try {
//         const [cateRes, dataSlug, attrRes]: any = await Promise.all([
//           requestApi("category/find-all", { method: "GET" }),
//           requestApi("product/find", { method: "GET", params: { slug: slug } }),
//           requestApi("category-attribute/find-all", { method: "GET" }),
//         ]);
//         if (cateRes && !cateRes.statusCode) {
//           setCate(cateRes.data);
//         }
//         if (dataSlug && !dataSlug.statusCode) {
//           form.setFieldsValue({
//             ...dataSlug,
//             category: dataSlug.category?.id,
//             variants: dataSlug.variants?.map((v: any) => ({
//               id: v.id,
//               sku: v.sku,
//               stock: v.stock,
//               price: getPriceNumber(v.prices?.price),
//               priceId: v.prices?.id,
//               attributeValueIds: v.attributeValues?.map((a: any) => a.id) || [],
//             })),
//           });
//           setContent(dataSlug.description);
//           setExistingAvatarId(dataSlug.gallery[0]?.id || null);
//           setAvatarPreview(
//             dataSlug.gallery?.[0]?.url
//               ? process.env.NEXT_PUBLIC_IMAGE_URL +
//                   "/uploads/" +
//                   dataSlug.gallery[0].url
//               : null,
//           );
//           setExistingGalleryIds(
//             dataSlug.gallery
//               ?.filter((img: any) => img.isPrimary === false)
//               .map((img: any) => img.id) || [],
//           );
//           setGalleryPreview(
//             dataSlug.gallery
//               ?.filter((img: any) => img.isPrimary !== true)
//               .map((img: any) => ({
//                 uid: img.id.toString(),
//                 name: img.url,
//                 status: "done",
//                 url: process.env.NEXT_PUBLIC_IMAGE_URL + "/uploads/" + img.url,
//               })) || [],
//           );
//         }
//         if (attrRes && !attrRes.statusCode) {
//           setCateAttr(attrRes.data);
//         }
//       } catch (error) {
//         messageApi.error({
//           title: tMess('Title.error'),
//           description: tMess('Description.Unable_to_connect_to_the_server'),
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchAll();
//   }, []);
//   function getPriceNumber(priceString?: string) {
//     return Number(priceString?.trim() || 0);
//   }
//   const PriceInput = ({ value = '', onChange }: any) => {
//     return (
//       <InputNumber
//       value={value}
//       style={{ width: "100%" }}
//       controls={false}
//       stringMode
//       formatter={(value) =>
//         String(value || "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
//       }
//       parser={(value) =>
//         String(value || "").replace(/\./g, "")
//       }
//       onKeyDown={(e) => {
//         const allowKeys = [
//           "Backspace",
//           "Delete",
//           "ArrowLeft",
//           "ArrowRight",
//           "Tab",
//         ];
//
//         if (
//           !/[0-9]/.test(e.key) &&
//           !allowKeys.includes(e.key)
//         ) {
//           e.preventDefault();
//         }
//       }}
//       onChange={onChange}
//     />
//     );
//   };
//   const onFinish = async (values: any) => {
//     setIsLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("name", values.name);
//       formData.append("short_description", values.short_description);
//       formData.append("description", content);
//       formData.append(
//         "category",
//         JSON.stringify({ id: Number(values.category) }),
//       );
//       formData.append("refType", "PRODUCT");
//       if (avatarFile) {
//         formData.append("avatar", avatarFile);
//       }
//       if (avatarPreview)
//         formData.append(
//           "existingAvatarIds",
//           existingAvatarId ? existingAvatarId.toString() : "null",
//         );
//       galleryFiles.forEach((file) => {
//         formData.append("gallery", file);
//       });
//       if (galleryPreview.length > 0)
//         formData.append(
//           "existingGalleryIds",
//           JSON.stringify(existingGalleryIds),
//         );
//       if (values.variants && values.variants.length > 0) {
//         const variants = values.variants.map((v: any) => ({
//           ...v,
//           prices: {
//             id: v.priceId ?? null,
//             price: v.price,
//           },
//         }));
//         formData.append("variants", JSON.stringify(variants));
//       }
//       const res: any = await requestApi(`product/${slug}`, {
//         method: "PATCH",
//         body: formData,
//       });
//       if (res && res.status === "success") {
//         messageApi.success({
//           title: tMess('Title.success'),
//           description: t('product_updated_successfully'),
//         });
//         setTimeout(() => router.push(ADMIN_PATHS.PRODUCT.LIST()), 1500);
//       } else {
//         messageApi.error({
//           title: tMess('Title.error'),
//           description: Array.isArray(res.message)
//             ? res.message[0]
//             : res.message,
//         });
//       }
//     } catch (error) {
//       messageApi.error({
//         title: tMess('Title.error'),
//         description: tMess('Description.An_error_occurred_while_saving_the_data'),
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   return (
//     <>
//       <div style={{ maxWidth: 800, margin: "0 auto" }}>
//         {contextHolder}
//         <Card title={t("edit")}>
//           <Spin spinning={isLoading}>
//             <Form
//               form={form}
//               layout="vertical"
//               onFinish={onFinish}
//               autoComplete="off"
//             >
//               <Form.Item
//                 label={t("name")}
//                 name="name"
//                 rules={[{ required: true, message: t("please_enter_name") }]}
//               >
//                 <Input placeholder={t("name")} />
//               </Form.Item>
//               <Form.Item label={t('avatar')}>
//                 <Upload
//                   listType="picture-card"
//                   maxCount={1}
//                   beforeUpload={(file) => {
//                     setAvatarFile(file);
//                     setAvatarPreview(URL.createObjectURL(file));
//                     setExistingAvatarId(null);
//                     return false; // Chặn upload tự động
//                   }}
//                   onRemove={() => {
//                     setAvatarFile(null);
//                     setAvatarPreview(null);
//                   }}
//                   fileList={
//                     avatarPreview
//                       ? [
//                           {
//                             uid: "-1",
//                             name: "image.png",
//                             status: "done",
//                             url: avatarPreview,
//                           },
//                         ]
//                       : []
//                   }
//                 >
//                   {!avatarFile && (
//                     <div>
//                       <PlusOutlined />
//                       <div style={{ marginTop: 8 }}>Tải lên</div>
//                     </div>
//                   )}
//                 </Upload>
//               </Form.Item>
//               <Form.Item label={t('gallery')}>
//                 <Upload
//                   listType="picture-card"
//                   multiple
//                   beforeUpload={(file) => {
//                     setGalleryFiles((prev) => [...prev, file]);
//                     setGalleryPreview((prev) => [
//                       ...prev,
//                       {
//                         uid: file.uid,
//                         name: file.name,
//                         status: "done",
//                         url: URL.createObjectURL(file),
//                       },
//                     ]);
//                     return false;
//                   }}
//                   onRemove={(file) => {
//                     setGalleryFiles((prev) =>
//                       prev.filter((f) => f.uid !== file.uid),
//                     );
//                     setGalleryPreview((prev) =>
//                       prev.filter((f) => f.uid !== file.uid),
//                     );
//                     if (!isNaN(Number(file.uid))) {
//                       setExistingGalleryIds((prev) =>
//                         prev.filter((id) => id !== Number(file.uid)),
//                       );
//                     }
//                   }}
//                   fileList={galleryPreview}
//                 >
//                   {galleryFiles.length < 10 && (
//                     <div>
//                       <PlusOutlined />
//                       <div style={{ marginTop: 8 }}>Tải lên</div>
//                     </div>
//                   )}
//                 </Upload>
//               </Form.Item>
//               <Form.Item
//                 label={t("short_description")}
//                 name="short_description"
//                 rules={[
//                   {
//                     required: true,
//                     message: t("please_enter_short_description"),
//                   },
//                 ]}
//               >
//                 <Input.TextArea placeholder={t("short_description")} />
//               </Form.Item>
//               <Form.Item label={t("description")} name="description">
//                 <TiptapFull key={content} value={content} onChange={setContent} />
//               </Form.Item>
//               <Form.Item label={t("category")} name="category">
//                 <Select
//                   placeholder={t("please_select_cate")}
//                   options={[
//                     ...cate.map((item: any) => {
//                       return { value: item.id, label: item.name };
//                     }),
//                   ]}
//                 />
//               </Form.Item>
//               <Card
//                 title={t('product_variations')}
//                 size="small"
//                 style={{ marginBottom: 20 }}
//               >
//                 <Form.List name="variants">
//                   {(fields, { add, remove }) => (
//                     <>
//                       {fields.map(({ key, name, ...restField }) => (
//                         <Space
//                           key={key}
//                           style={{
//                             display: "flex",
//                             flexWrap: "wrap",
//                             marginBottom: 16,
//                             borderBottom: "1px solid #f0f0f0",
//                             paddingBottom: 8,
//                           }}
//                           align="baseline"
//                         >
//                           <Form.Item {...restField} name={[name, "id"]} hidden>
//                             <Input />
//                           </Form.Item>
//                           <Form.Item
//                             {...restField}
//                             name={[name, "priceId"]}
//                             hidden
//                           >
//                              <Input />
//                           </Form.Item>
//                           <Form.Item
//                             {...restField}
//                             name={[name, "attributeValueIds"]}
//                             label={t('attribute')}
//                             style={{ width: 250 }}
//                             rules={[
//                               { required: true, message: t('select_properties') },
//                             ]}
//                           >
//                             <Select
//                               mode="multiple"
//                               placeholder={t('select_a_value')}
//                               options={cateAttr?.map((attr: any) => ({
//                                 label: attr.name,
//                                 options: attr.values?.map((val: any) => ({
//                                   label: val.value,
//                                   value: val.id,
//                                 })),
//                               }))}
//                             />
//                           </Form.Item>
//                           <Form.Item
//                             {...restField}
//                             name={[name, "sku"]}
//                             label={t('SKU_code')}
//                             rules={[{ required: true, message: t('enter_SKU') }]}
//                           >
//                             <Input placeholder={t('SKU_code')} />
//                           </Form.Item>
//                           <Form.Item
//                             {...restField}
//                             name={[name, "stock"]}
//                             label={t('inventory')}
//                             rules={[
//                               { required: true, message: t('enter_inventory') },
//                             ]}
//                           >
//                             <Input placeholder={t('inventory')} type="number" />
//                           </Form.Item>
//                           <Form.Item
//                             {...restField}
//                             name={[name, "price"]}
//                             label={t('price')}
//                             rules={[{ required: true, message: t('enter_price') }]}
//                           >
//                             <PriceInput />
//                           </Form.Item>
//
//                           <Button
//                             type="link"
//                             onClick={() => remove(name)}
//                             danger
//                             style={{ marginTop: 30 }}
//                           >
//                             {t('delete')}
//                           </Button>
//                         </Space>
//                       ))}
//                       <Form.Item>
//                         <Button
//                           type="dashed"
//                           onClick={() => add()}
//                           block
//                           icon={<PlusOutlined />}
//                         >
//                           {t('add_new_variant')}
//                         </Button>
//                       </Form.Item>
//                     </>
//                   )}
//                 </Form.List>
//               </Card>
//               <Form.Item>
//                 <Button
//                   type="primary"
//                   htmlType="submit"
//                   icon={<SaveOutlined />}
//                   loading={isLoading}
//                 >
//                   {t("save")}
//                 </Button>
//               </Form.Item>
//             </Form>
//           </Spin>
//         </Card>
//       </div>
//     </>
//   );
// };
// export default Page;
