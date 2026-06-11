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
import {useRouter, useSearchParams} from 'next/navigation';
import {useSelector} from "react-redux";
import {RootState} from "@/src/redux/store";
import AdminBreadcrumb from "@/components/templates/admin/breadcrumb/breadcrumb";
import {useTranslations} from "use-intl";
import {ADMIN_PATHS} from "@/src/path";
import {getListCategoryColumns} from '@/components/templates/admin/category/listColumn';
import LoadingPage from "@/src/custom/loading-page/loading-page";
import {
    AppstoreOutlined,
    DownloadOutlined,
    FilterOutlined,
    MoreOutlined,
    PlusOutlined,
    PrinterOutlined,
    SearchOutlined,
    SettingOutlined,
    SyncOutlined
} from '@ant-design/icons';

const COLUMN_OPTIONS = [
    { label: 'Tên danh mục', value: 'name' },
    { label: 'Đường dẫn (Slug)', value: 'slug' },
    { label: 'Mô tả', value: 'description' },
    { label: 'Danh mục cha', value: 'parent' },
    { label: 'Thuộc tính', value: 'attributes' },
    { label: 'Trạng thái', value: 'isActive' },
    { label: 'Ngày cập nhật', value: 'updatedAt' },
];

const App: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isTree = searchParams.get('isTree') || false;

    const t = useTranslations("Product.Category");
    const tMess = useTranslations("Message");
    const tModal = useTranslations("Modal");
    const { user } = useSelector((state: RootState) => state.auth);

    const [cate, setCate] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [messageApi, contextHolder] = notification.useNotification();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState<string[]>(
        COLUMN_OPTIONS.map(col => col.value)
    );

    const onChange: TableProps<any>['onChange'] = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const data: any = await requestApi('category/find-all', {
                method: 'GET',
                params: { isTree: isTree, isActive: true }
            });
            if (data.statusCode === 403) {
                messageApi.error({
                    title: tMess('Title.error'),
                    description: tMess('Description.You_are_not_authorized_to_do_this'),
                    placement: 'bottomRight'
                });
                return;
            }
            setCate(data.data || []);
        } catch (error) {
            messageApi.error({
                title: tMess('Title.error'),
                description: tMess('Description.An_error_occurred_while_saving_the_data')
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTree]);

    const handleCreate = () => {
        router.push(ADMIN_PATHS.PRODUCT.CATEGORY.CREATE());
    };

    const handleEdit = (slug: string) => {
        router.push(ADMIN_PATHS.PRODUCT.CATEGORY.EDIT(slug));
    };

    const handleDelete = async (slug: string) => {
        const data: any = await requestApi('category/' + slug, { method: 'DELETE' });
        if (data?.statusCode && data.statusCode >= 400) {
            messageApi.error({
                title: tMess('Title.info'),
                description: Array.isArray(data.message) ? data.message[0] : data.message,
                placement: 'bottomRight',
            });
        } else if (data) {
            messageApi.success({
                title: tMess('Title.info'),
                description: tMess('Description.data_update_successfully'),
                placement: 'bottomRight',
            });
            setCate((prevData) => prevData.filter(c => c.slug !== slug));
        }
    };

    const allColumns = getListCategoryColumns({ onEdit: handleEdit, onDelete: handleDelete, t: t });

    const displayColumns = allColumns.filter(col => {
        // const columnIdentifier = (col.key || col.dataIndex) as string;
        const columnIdentifier = String(
            col.key ?? ('dataIndex' in col ? col.dataIndex : '')
        );
        return visibleColumns.includes(columnIdentifier) || columnIdentifier === 'actions';
    });

    const filteredCategories = useMemo(() => {
        if (!searchText) return cate;
        return cate.filter(c =>
            (c.name && c.name.toLowerCase().includes(searchText.toLowerCase())) ||
            (c.slug && c.slug.toLowerCase().includes(searchText.toLowerCase()))
        );
    }, [cate, searchText]);

    const filterContent = (
        <div className="flex flex-col gap-4 p-1 w-56">
            <div>
                <Typography.Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                    {tModal('status')}
                </Typography.Text>
                <Checkbox.Group className="flex flex-col gap-2.5">
                    <Checkbox value="active" className="text-slate-600 hover:text-slate-900 transition-colors">{tModal('active')}</Checkbox>
                    <Checkbox value="inactive" className="text-slate-600 hover:text-slate-900 transition-colors">{tModal('inactive')}</Checkbox>
                </Checkbox.Group>
            </div>
            <div className="border-t border-slate-100 pt-3 flex justify-end gap-2">
                <Button size="small" type="text" className="text-slate-500 hover:bg-slate-100">{tModal('delete')}</Button>
                <Button size="small" type="primary" className="bg-blue-600 shadow-md shadow-blue-500/20">{tModal('accept')}</Button>
            </div>
        </div>
    );

    const moreMenu: MenuProps = {
        items: [
            { key: 'export', icon: <DownloadOutlined className="text-slate-400" />, label: <span className="text-slate-600">Xuất file CSV</span> },
            { key: 'print', icon: <PrinterOutlined className="text-slate-400" />, label: <span className="text-slate-600">In danh sách</span> },
            { type: 'divider' },
            { key: 'settings', icon: <SettingOutlined className="text-blue-500" />, label: <span className="text-slate-800 font-medium">Cài đặt hiển thị</span> },
        ],
        onClick: ({ key }) => { if (key === 'settings') setIsSettingsOpen(true); }
    };

    const toggleColumn = (colValue: string, isChecked: boolean) => {
        if (isChecked) setVisibleColumns(prev => [...prev, colValue]);
        else setVisibleColumns(prev => prev.filter(c => c !== colValue));
    };

    const handleToggleAll = () => {
        if (visibleColumns.length === COLUMN_OPTIONS.length) setVisibleColumns([]);
        else setVisibleColumns(COLUMN_OPTIONS.map(col => col.value));
    };

    if (isLoading) return <LoadingPage />;

    return (
        <ConfigProvider
            theme={{
                token: { colorPrimary: '#2563eb', colorTextBase: '#334155', fontFamily: 'inherit', borderRadius: 12 },
                components: {
                    Table: {
                        headerBg: '#f8fafc', headerColor: '#64748b', headerSplitColor: 'transparent',
                        rowHoverBg: '#f1f5f9', borderColor: '#f1f5f9', paddingContentVertical: 14, paddingContentHorizontal: 16
                    },
                    Button: { controlHeight: 40, defaultBorderColor: '#e2e8f0', defaultColor: '#475569' },
                    Input: { controlHeight: 40, colorBgContainer: '#f8fafc', colorBorder: 'transparent', activeBorderColor: '#3b82f6', hoverBorderColor: '#cbd5e1' },
                },
            }}
        >
            {contextHolder}
            <div className="h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/50 via-slate-50/50 to-slate-50 p-3 sm:p-2 lg:p-3 flex flex-col gap-4 animate-in fade-in duration-700 rounded">

                <div className="w-full text-slate-500 font-medium shrink-0">
                    <AdminBreadcrumb />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                    <div className="flex gap-4 items-center">
                        <div className="hidden sm:flex h-12 w-12 rounded-2xl bg-white border border-slate-200/60 shadow-sm items-center justify-center text-blue-600">
                            <AppstoreOutlined className="text-xl" />
                        </div>
                        <div>
                            <Typography.Title level={2} className="!mb-0 !text-xl !font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                                {t('title') || 'Danh mục sản phẩm'}
                            </Typography.Title>
                            <p className="text-slate-500 text-sm font-medium mt-1">
                                {t('manage_the_hierarchy_classification_and_organization_of_product_groups')}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                        <Tooltip title={t('refresh')} placement="bottom">
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
                                placeholder={t('search_for_category_name')}
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
                    <div className="flex-1 min-h-0 w-full bg-white overflow-x-auto">
                        <Table<any>
                            rowKey="id"
                            columns={displayColumns}
                            dataSource={filteredCategories}
                            onChange={onChange}
                            scroll={{ x: 'max-content', y: 'calc(100vh - 330px)' }}
                            pagination={{
                                pageSize: 15,
                                showSizeChanger: true,
                                showTotal: (total, range) => (
                                    <span className="text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                        {t('show')} <span className="text-slate-800">{range[0]}-{range[1]}</span> / {total}
                                    </span>
                                ),
                                className: "px-6 py-4 m-0 border-t border-slate-100 flex items-center justify-between"
                            }}
                            className="custom-pro-table h-full min-w-full"
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
                    style={{ padding: 0, borderRadius: 24, overflow: 'hidden'  }}
                >
                    <div className="bg-slate-50 px-6 py-5 border-b border-slate-100">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                                <SettingOutlined className="text-lg" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 m-0 tracking-tight">{tModal('customize_the_column_display')}</h3>
                        </div>
                        <p className="text-sm text-slate-500 mt-2 ml-11">
                            {tModal('enabledisable_data_fields_to_optimize_category_display_space')}
                        </p>
                    </div>

                    <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                {tModal('selected')} {visibleColumns.length}/{COLUMN_OPTIONS.length}
                            </span>
                            <Typography.Link onClick={handleToggleAll} className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                {visibleColumns.length === COLUMN_OPTIONS.length ? tModal('deselect_all') :  tModal('select_all')}
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
                            {tModal('recovery')}
                        </Button>
                        <Button type="primary" onClick={() => setIsSettingsOpen(false)} className="rounded-xl font-semibold bg-slate-900 hover:bg-slate-800 border-0 px-6 shadow-md shadow-slate-900/20">
                            {tModal('complete')}
                        </Button>
                    </div>
                </Modal>
            </div>
        </ConfigProvider>
    );
};

export default App;
// "use client"
// import React from 'react';
// import {Button, Flex, notification, Table, TableProps, Typography,} from 'antd';
// import {requestApi} from "@/components/api/be.api";
// import {useRouter, useSearchParams} from 'next/navigation';
// import {useSelector} from "react-redux";
// import {RootState} from "@/src/redux/store";
// import AdminBreadcrumb from "@/components/templates/admin/breadcrumb/breadcrumb";
// import {useTranslations} from "use-intl";
// import {ADMIN_PATHS} from "@/src/path";
// import {getListCategoryColumns} from '@/components/templates/admin/category/listColumn';
// import LoadingPage from "@/src/custom/loading-page/loading-page";
//
//
// const App: React.FC = () => {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const isTree = searchParams.get('isTree') || false;
//     const t = useTranslations("Product.Category");
//     const tMess = useTranslations("Message");
//     const [cate,setCate] = React.useState([])
//     const [messageApi, contextHolder] = notification.useNotification();
//     const [isLoading, setIsLoading] = React.useState(true);
//     const { user } = useSelector((state: RootState) => state.auth);
//     const onChange: TableProps['onChange'] = (pagination, filters, sorter, extra) => {
//         // console.log('params', pagination, filters, sorter, extra);
//     };
//     React.useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const data = await requestApi('category/find-all', { method: 'GET',params:{isTree:isTree,isActive:true} });
//                 if( data.statusCode === 403 ){
//                     messageApi.error({title:tMess('Title.error'),description: tMess('Description.You_are_not_authorized_to_do_this'),
//                         placement: 'bottomRight',});
//                     return;
//                 }
//                 setCate(data.data);
//             } catch (error) {
//                 messageApi.error({ title: tMess('Title.error'), description: tMess('Description.An_error_occurred_while_saving_the_data') });
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchData();
//     },[isTree]);
//     const handleCreate = ()=>{
//         router.push(ADMIN_PATHS.PRODUCT.CATEGORY.CREATE());
//     }
//     const handleEdit = (slug: {id: string})=>{
//         router.push(ADMIN_PATHS.PRODUCT.CATEGORY.EDIT(slug));
//     }
//     const handleDelete = async (slug: string)=>{
//         const data = await requestApi('category/'+slug, { method: 'DELETE' });
//         if(data?.statusCode && data.statusCode >= 400)
//             messageApi.error({title:tMess('Title.info'),description: Array.isArray(data.message) ? data.message[0] : data.message,
//             placement: 'bottomRight',});
//         else if(data) {
//             messageApi.success({
//                 title: tMess('Title.info'), description: tMess('Description.data_update_successfully'),
//                 placement: 'bottomRight',
//             });
//             setCate((prevData) => prevData.filter(cate => cate.slug !== slug));
//         }
//     }
//     const columns = getListCategoryColumns({
//         onEdit: handleEdit,
//         onDelete: handleDelete,
//         t: t
//     });
//     if (isLoading) {
//         return <LoadingPage />;
//     }
//     return <>
//         {contextHolder}
//         <div>
//             <Flex gap={'small'} wrap={false}>
//                 <Typography.Title level={3}>{t('title')}</Typography.Title>
//                 {
//                     user.role === 'superAdmin'
//                         ? <Button type="primary" onClick={handleCreate}>{t('create')}</Button>
//                         : <></>
//                 }
//             </Flex>
//             <AdminBreadcrumb/>
//             <Table rowKey="id" columns={columns} dataSource={cate} onChange={onChange}/>
//         </div>
//         </>
//
// };
//
// export default App;