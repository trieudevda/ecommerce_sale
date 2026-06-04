'use client'
import {useRouter} from 'next/navigation';
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
    LockOutlined,
    MailOutlined,
    PhoneOutlined,
    SafetyCertificateOutlined,
    SaveOutlined,
    UserOutlined
} from "@ant-design/icons";
import {useTranslations} from "use-intl";
import {ADMIN_PATHS} from "@/src/path";

const Page = () => {
    const router = useRouter();
    const t = useTranslations("User.CRUD");
    const tMess = useTranslations("Message");
    const [form] = Form.useForm();
    const [role, setRole] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [messageApi, contextHolder] = notification.useNotification();
    useEffect(() => {
        const fetchRole = async () => {
            try {
                setIsLoading(true);
                const res: any = await requestApi('roles/find-all', { method: 'GET' });
                if (res && !res.statusCode) {
                    setRole(res.data);
                } else {
                    messageApi.error({ title: tMess('Title.role'), description: res.message || tMess('Description.You_are_not_authorized_to_do_this') });
                }
            } catch (error) {
                messageApi.error({ title: tMess('Title.error'), description: tMess('Description.Unable_to_connect_to_the_server') });
            } finally {
                setIsLoading(false);
            }
        }
        fetchRole();
    }, [tMess, messageApi]);

    const onFinish = async (values: any) => {
        setIsLoading(true);
        try {
            const transformedData = {
                ...values,
                role: { id: values.role }
            };
            const res: any = await requestApi(`user`, {
                method: 'POST',
                body: JSON.stringify(transformedData),
            });

            if (res && res.status === 'success') {
                messageApi.success({
                    title: tMess('Title.success'),
                    description: t('user_added_successfully'),
                });
                setTimeout(() => router.push(ADMIN_PATHS.USER.LIST()), 1500);
            } else {
                messageApi.error({
                    title: t('adding_users_failed'),
                    description: Array.isArray(res.message) ? res.message[0] : res.message,
                });
            }
        } catch (error) {
            messageApi.error({ title: tMess('Title.error'), description: tMess('Description.data_added_fail') });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#2563eb',
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
            <div className="min-h-screen bg-slate-50/50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50/50 to-slate-50 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-700">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => router.back()}
                            className="flex items-center justify-center rounded-xl border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm"
                        />
                        <div>
                            <Typography.Title level={2} className="!mb-0 !text-2xl !font-extrabold tracking-tight text-slate-800">
                                {t('create')}
                            </Typography.Title>
                            <p className="text-slate-500 text-sm mt-1">
                                {t('fill_in_the_information_below_to_set_up_a_new_user_account')}
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
                                    <div>
                                        <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold text-base">
                                            <UserOutlined className="text-blue-500" />{t('personal_information')}
                                        </div>
                                        <Form.Item
                                            label={<span className="text-slate-600 font-medium">{t('full_name')}</span>}
                                            name="fullName"
                                            rules={[{ required: true, message: t('please_enter_your_name') }]}
                                        >
                                            <Input prefix={<UserOutlined className="text-slate-400 mr-1" />} placeholder={t('place_name')} className="hover:border-blue-400 focus:border-blue-500" />
                                        </Form.Item>
                                        <Form.Item
                                            label={<span className="text-slate-600 font-medium">{t('phone')}</span>}
                                            name="phone"
                                            rules={[
                                                { required: true, message: t('please_enter_phone') },
                                                { pattern: /^(0[3|5|7|8|9])([0-9]{8})$/, message: t('phone_number_is_not_in_the_correct_Vietnamese') }
                                            ]}
                                        >
                                            <Input
                                                prefix={<PhoneOutlined className="text-slate-400 mr-1" />}
                                                placeholder="0901234567"
                                                maxLength={10}
                                                allowClear
                                                onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
                                                className="hover:border-blue-400 focus:border-blue-500"
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label={<span className="text-slate-600 font-medium">{t('address')}</span>}
                                            name="address"
                                            rules={[{ required: true, message: t('please_enter_address') }]}
                                        >
                                            <Input prefix={<EnvironmentOutlined className="text-slate-400 mr-1" />} placeholder={t('enter_your_residential_address')} className="hover:border-blue-400 focus:border-blue-500" />
                                        </Form.Item>
                                        <Form.Item
                                            label={<span className="text-slate-600 font-medium">{t('date_of_birth')}</span>}
                                            name="dateOfBirth"
                                            rules={[{ required: true, message: t('please_enter_date_of_birth') }]}
                                        >
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                className="w-full hover:border-blue-400 focus:border-blue-500"
                                                placeholder={t('please_select_date_of_birth')}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold text-base mt-8 md:mt-0">
                                            <SafetyCertificateOutlined className="text-blue-500" />{t('accounts_and_permissions')}
                                        </div>
                                        <Form.Item
                                            label={<span className="text-slate-600 font-medium">Email</span>}
                                            name="email"
                                            rules={[{ required: true, type: 'email', message: t('invalid_email') }]}
                                        >
                                            <Input prefix={<MailOutlined className="text-slate-400 mr-1" />} placeholder="example@gmail.com" className="hover:border-blue-400 focus:border-blue-500" />
                                        </Form.Item>

                                        <Form.Item
                                            label={<span className="text-slate-600 font-medium">{t('password')}</span>}
                                            name="password"
                                            rules={[{ required: true, message: t('invalid_password') }]}
                                        >
                                            <Input.Password prefix={<LockOutlined className="text-slate-400 mr-1" />} placeholder="••••••••" className="hover:border-blue-400 focus:border-blue-500" />
                                        </Form.Item>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Form.Item
                                                label={<span className="text-slate-600 font-medium">{t('role')}</span>}
                                                name="role"
                                                rules={[{ required: true, message: t('please_select_role') }]}
                                            >
                                                <Select
                                                    placeholder={t('please_select_role')}
                                                    options={role.map((item: any) => ({ value: item.id, label: item.name }))}
                                                    className="hover:border-blue-400 focus:border-blue-500"
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label={<span className="text-slate-600 font-medium">{t('is_email_verified')}</span>}
                                                name="isEmailVerified"
                                                initialValue={false}
                                            >
                                                <Select
                                                    options={[
                                                        { value: true, label: <span className="text-emerald-600 font-medium">{t('verified')}</span> },
                                                        { value: false, label: <span className="text-rose-600 font-medium">{t('unverified')}</span> },
                                                    ]}
                                                    className="hover:border-blue-400 focus:border-blue-500"
                                                />
                                            </Form.Item>
                                        </div>
                                        <Form.Item
                                            label={<span className="text-slate-600 font-medium">{t('status')}</span>}
                                            name="status"
                                            initialValue="active"
                                        >
                                            <Select
                                                options={[
                                                    { value: 'active', label: <span className="text-emerald-600 font-medium">Đang hoạt động</span> },
                                                    { value: 'inactive', label: <span className="text-slate-500 font-medium">Đã khóa</span> },
                                                ]}
                                                className="hover:border-blue-400 focus:border-blue-500"
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                                <Divider className="my-6 border-slate-100" />
                                <div className="flex justify-end gap-3">
                                    <Button
                                        onClick={() => router.back()}
                                        className="h-11 px-6 rounded-xl text-slate-600 font-medium hover:bg-slate-50 border-slate-200"
                                    >
                                        {t('cancel')}
                                    </Button>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<SaveOutlined />}
                                        loading={isLoading}
                                        className="h-11 px-8 rounded-xl font-semibold bg-blue-600 hover:bg-blue-500 border-0 shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:-translate-y-0.5 transition-all"
                                    >
                                        {t('save')}
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