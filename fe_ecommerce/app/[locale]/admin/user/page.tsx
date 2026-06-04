'use client'
import React, {useEffect, useMemo, useState} from 'react';
import {
    Button,
    Card,
    Checkbox,
    ConfigProvider,
    Dropdown,
    Input,
    MenuProps,
    Modal,
    notification,
    Popover,
    Space,
    Switch,
    Table,
    TableProps,
    Tooltip,
    Typography
} from 'antd';
import {requestApi} from "@/components/api/be.api";
import {getListUserColumns} from "@/components/templates/admin/user/listColumn";
import {useRouter} from 'next/navigation';
import {useSelector} from "react-redux";
import {RootState} from "@/src/redux/store";
import AdminBreadcrumb from "@/components/templates/admin/breadcrumb/breadcrumb";
import {useTranslations} from "use-intl";
import {ADMIN_PATHS} from "@/src/path";
import LoadingPage from "@/src/custom/loading-page/loading-page";
import {User} from "@/src/interface/user.interface";
import {
    DownloadOutlined,
    FilterOutlined,
    MoreOutlined,
    PlusOutlined,
    PrinterOutlined,
    SearchOutlined,
    SettingOutlined,
    SyncOutlined,
    UsergroupAddOutlined
} from '@ant-design/icons';

const COLUMN_OPTIONS = [
    { label: 'Email', value: 'email' },
    { label: 'Họ và Tên', value: 'fullName' },
    { label: 'Số điện thoại', value: 'phone' },
    { label: 'Địa chỉ', value: 'address' },
    { label: 'Vai trò', value: 'role' },
    { label: 'Xác thực Email', value: 'isEmailVerified' },
    { label: 'Trạng thái', value: 'status' },
    { label: 'Ngày tạo', value: 'createdAt' },
    { label: 'Ngày cập nhật', value: 'updatedAt' },
];
const App: React.FC = () => {
    const router = useRouter();
    const t = useTranslations("User.List");
    const tTable = useTranslations("User.Table");
    const tMess = useTranslations("Message");
    const { user } = useSelector((state: RootState) => state.auth);
    const [userList, setUserList] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [messageApi, contextHolder] = notification.useNotification();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState<string[]>(
        COLUMN_OPTIONS.map(col => col.value)
    );
    const onChange: TableProps<User>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('Table params thay đổi:', pagination, filters, sorter);
    };
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data: any = await requestApi('user/find-all', { method: 'GET' });
            if (data.statusCode === 403) {
                messageApi.error({ title: tMess('Title.role'), description: tMess('Description.You_are_not_authorized') });
                return;
            }
            setUserList(data.data || []);
        } catch (error) {
            messageApi.error({ title: tMess('Title.error'), description: tMess('Description.Unable_to_connect_to_the_server') });
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => { fetchData(); }, []);
    const handleCreate = () => router.push(ADMIN_PATHS.USER.CREATE());
    const handleEdit = (id: string) => router.push(ADMIN_PATHS.USER.EDIT(id));
    const handleDelete = async (id: string) => {
        const data: any = await requestApi('user/' + id, { method: 'DELETE' });
        if (data?.statusCode && data.statusCode >= 400) {
            messageApi.error({ title: tMess('Title.fail'), description: tMess('Description.data_delete_fail') });
        } else if (data) {
            messageApi.success({ title: tMess('Title.success'), description: tMess('Description.data_delete_successfully') });
            setUserList((prevData) => prevData.filter(u => u.id !== id));
        }
    };
    const allColumns = getListUserColumns({ onEdit: handleEdit, onDelete: handleDelete, t: tTable });
    const displayColumns = allColumns.filter(col => {
        const columnIdentifier = (col.key || col.dataIndex) as string;
        return visibleColumns.includes(columnIdentifier) || columnIdentifier === 'actions';
    });
    const filteredUsers = useMemo(() => {
        if (!searchText) return userList;
        return userList.filter(u =>
            (u.fullName && u.fullName.toLowerCase().includes(searchText.toLowerCase())) ||
            (u.email && u.email.toLowerCase().includes(searchText.toLowerCase()))
        );
    }, [userList, searchText]);
    const filterContent = (
        <div className="flex flex-col gap-4 p-1 w-56">
            <div>
                <Typography.Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                    {t('status')}
                </Typography.Text>
                <Checkbox.Group className="flex flex-col gap-2.5">
                    <Checkbox value="ACTIVE" className="text-slate-600 hover:text-slate-900 transition-colors">{t('active')}</Checkbox>
                    <Checkbox value="INACTIVE" className="text-slate-600 hover:text-slate-900 transition-colors">{t('inactive')}</Checkbox>
                </Checkbox.Group>
            </div>
            <div className="border-t border-slate-100 pt-3 flex justify-end gap-2">
                <Button size="small" type="text" className="text-slate-500 hover:bg-slate-100">{t('delete')}</Button>
                <Button size="small" type="primary" className="bg-blue-600 shadow-md shadow-blue-500/20">{t('accept')}</Button>
            </div>
        </div>
    );

    const moreMenu: MenuProps = {
        items: [
            { key: 'export', icon: <DownloadOutlined className="text-slate-400" />, label: <span className="text-slate-600">{t('export_CSV_file')}</span> },
            { key: 'print', icon: <PrinterOutlined className="text-slate-400" />, label: <span className="text-slate-600">{t('print_list')}</span> },
            { type: 'divider' },
            { key: 'settings', icon: <SettingOutlined className="text-blue-500" />, label: <span className="text-slate-800 font-medium">{t('display_settings')}</span> },
        ],
        onClick: ({ key }) => {
            if (key === 'settings') {
                setIsSettingsOpen(true);
            }
        }
    };

    const toggleColumn = (colValue: string, isChecked: boolean) => {
        if (isChecked) {
            setVisibleColumns(prev => [...prev, colValue]);
        } else {
            setVisibleColumns(prev => prev.filter(c => c !== colValue));
        }
    };

    const handleToggleAll = () => {
        if (visibleColumns.length === COLUMN_OPTIONS.length) {
            setVisibleColumns([]);
        } else {
            setVisibleColumns(COLUMN_OPTIONS.map(col => col.value));
        }
    };

    if (isLoading) return <LoadingPage />;

    return (
        <ConfigProvider
            theme={{
                token: { colorPrimary: '#2563eb', colorTextBase: '#334155', fontFamily: 'inherit', borderRadius: 12 },
                components: {
                    Table: {
                        headerBg: '#f8fafc',
                        headerColor: '#64748b',
                        headerSplitColor: 'transparent',
                        rowHoverBg: '#f1f5f9',
                        borderColor: '#f1f5f9',
                        paddingContentVertical: 14,
                        paddingContentHorizontal: 16
                    },
                    Button: { controlHeight: 40, defaultBorderColor: '#e2e8f0', defaultColor: '#475569' },
                    Input: { controlHeight: 40, colorBgContainer: '#f8fafc', colorBorder: 'transparent', activeBorderColor: '#3b82f6', hoverBorderColor: '#cbd5e1' },
                },
            }}
        >
            {contextHolder}
            <div className="h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50/50 to-slate-50 p-3 sm:p-2 lg:p-3 flex flex-col gap-4 animate-in fade-in duration-700">
                <div className="w-full text-slate-500 font-medium shrink-0">
                    <AdminBreadcrumb />
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                    <div className="flex gap-4 items-center">
                        <div className="hidden sm:flex h-12 w-12 rounded-2xl bg-white border border-slate-200/60 shadow-sm items-center justify-center text-blue-600">
                            <UsergroupAddOutlined className="text-xl" />
                        </div>
                        <div>
                            <Typography.Title level={2} className="!mb-0 !text-xl !font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                                {t('title')}
                            </Typography.Title>
                            <p className="text-slate-500 text-sm font-medium mt-1">
                                {t('manage_and_monitor_all_system_members')}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                        <Tooltip title="Làm mới" placement="bottom">
                            <Button icon={<SyncOutlined />} onClick={fetchData} className="hidden sm:flex items-center justify-center bg-white hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm ring-1 ring-slate-900/5 border-0" />
                        </Tooltip>
                        {user?.role === 'superAdmin' && (
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 border-0 shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:-translate-y-0.5 transition-all font-semibold px-6">
                                {t('create')}
                            </Button>
                        )}
                    </div>
                </div>
                <Card
                    variant="borderless"
                    className="flex-1 flex flex-col min-h-0 rounded-[24px] shadow-sm ring-1 ring-slate-900/5 bg-white overflow-hidden"
                    styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', height: '100%' } }}
                >
                    <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                        <div className="relative w-full sm:max-w-md group">
                            <Input
                                placeholder={t('search')}
                                prefix={<SearchOutlined className="text-slate-400 text-lg mr-2 group-focus-within:text-blue-500 transition-colors" />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                allowClear
                                className="w-full h-11 bg-slate-50/50 hover:bg-slate-100 focus:bg-white border-transparent shadow-inner rounded-xl"
                            />
                        </div>
                        <Space className="w-full sm:w-auto justify-end">
                            <Popover content={filterContent} trigger="click" placement="bottomRight">
                                <Button icon={<FilterOutlined />} className="bg-white hover:bg-slate-50 text-slate-600 font-medium h-11 px-5 rounded-xl border-slate-200 shadow-sm">
                                    {t('filter')}
                                </Button>
                            </Popover>
                            <Dropdown menu={moreMenu} trigger={['click']} placement="bottomRight">
                                <Button icon={<MoreOutlined />} className="bg-white hover:bg-slate-50 text-slate-600 h-11 w-11 p-0 flex justify-center items-center rounded-xl border-slate-200 shadow-sm" />
                            </Dropdown>
                        </Space>
                    </div>
                    <div className="flex-1 min-h-0 w-full overflow-x-auto bg-white">
                        <Table<User>
                            rowKey="id"
                            columns={displayColumns}
                            dataSource={filteredUsers}
                            onChange={onChange}
                            scroll={{
                                x: 'max-content',
                                y: 'calc(100vh - 330px)'
                            }}
                            pagination={{
                                pageSize: 15,
                                showSizeChanger: true,
                                showTotal: (total, range) => (
                                    <span className="text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                        {t('show')} <span className="text-slate-800">{range[0]}-{range[1]}</span> / {total}
                                    </span>
                                ),
                                locale: { items_per_page: '/ '+t('page') },
                                className: "px-6 py-4 m-0 border-t border-slate-100 flex items-center justify-between"
                            }}
                            className="custom-pro-table h-full"
                            rowClassName="group hover:bg-slate-50/80 transition-colors duration-300 w-full cursor-pointer"
                        />
                    </div>
                </Card>
                <Modal
                    open={isSettingsOpen}
                    onCancel={() => setIsSettingsOpen(false)}
                    footer={null}
                    centered
                    width={420}
                    closeIcon={<span className="text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors"><MoreOutlined className="rotate-90" /></span>}
                    className="custom-premium-modal"
                    styles={{ content: { padding: 0, borderRadius: 24, overflow: 'hidden' } }}
                >
                    <div className="bg-slate-50 px-6 py-5 border-b border-slate-100">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                                <SettingOutlined className="text-lg" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 m-0 tracking-tight">{t('customize_columns')}</h3>
                        </div>
                        <p className="text-sm text-slate-500 mt-2 ml-11">
                            {t('enabledisable_data_fields_to_optimize_your_table_display_space')}
                        </p>
                    </div>

                    <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                {t('selected')} {visibleColumns.length}/{COLUMN_OPTIONS.length}
                            </span>
                            <Typography.Link onClick={handleToggleAll} className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                {t(visibleColumns.length === COLUMN_OPTIONS.length ? 'deselect_all' : 'select_all')}
                            </Typography.Link>
                        </div>

                        <div className="flex flex-col gap-1">
                            {COLUMN_OPTIONS.map((col) => {
                                const isChecked = visibleColumns.includes(col.value);
                                return (
                                    <div
                                        key={col.value}
                                        onClick={() => toggleColumn(col.value, !isChecked)}
                                        className="flex justify-between items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-slate-50 active:bg-slate-100 group border border-transparent hover:border-slate-100"
                                    >
                                        <span className={`font-medium transition-colors ${isChecked ? 'text-slate-800' : 'text-slate-400'}`}>
                                            {col.label}
                                        </span>
                                        <Switch checked={isChecked} size="small" className={`pointer-events-none shadow-sm ${isChecked ? 'bg-blue-600' : 'bg-slate-300'}`} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3">
                        <Button onClick={() => setVisibleColumns(COLUMN_OPTIONS.map(c => c.value))} className="rounded-xl font-medium text-slate-500 border-transparent hover:bg-slate-50">
                            {t('restore')}
                        </Button>
                        <Button type="primary" onClick={() => setIsSettingsOpen(false)} className="rounded-xl font-semibold bg-slate-900 hover:bg-slate-800 border-0 px-6 shadow-md shadow-slate-900/20">
                            {t('complete')}
                        </Button>
                    </div>
                </Modal>
            </div>
        </ConfigProvider>
    );
};

export default App;