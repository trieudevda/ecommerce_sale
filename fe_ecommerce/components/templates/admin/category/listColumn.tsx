import React from "react";
import {Button, Input, Space, TableColumnsType, Tooltip, Typography} from "antd";
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
import {FilterOutlined, LinkOutlined, NodeIndexOutlined, SearchOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import {ColumnType} from "antd/es/table";

export interface DataType {
    id: string;
    name: string;
    slug: string;
    description: string;
    children?: DataType[];
    parent?: any;
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string; // Đã fix từ Date sang string
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    attributes?: any[];
}

interface ActionProps {
    onEdit: (slug: any) => void;
    onDelete: (slug: string) => void;
    t: any;
}

export const getListCategoryColumns = ({ onEdit, onDelete, t }: ActionProps): TableColumnsType<DataType> => {

    // Hàm tạo Bộ lọc Kính lúp (Pop-up Search)
    const getColumnSearchProps = (dataIndex: keyof DataType, title: string): ColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div className="p-3 shadow-xl rounded-2xl bg-white border border-slate-100 w-64" onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    placeholder={`Tìm ${title.toLowerCase()}...`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => confirm()}
                    className="mb-3 w-full border-slate-200 focus:border-blue-500 rounded-lg"
                />
                <div className="flex justify-end gap-2">
                    <Button size="small" onClick={() => { clearFilters && clearFilters(); confirm(); }} className="text-slate-500 border-slate-200 hover:bg-slate-50 rounded-md">
                        Xóa
                    </Button>
                    <Button type="primary" size="small" onClick={() => confirm()} icon={<SearchOutlined />} className="bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 rounded-md font-medium">
                        Lọc
                    </Button>
                </div>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined className={`text-base ${filtered ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`} />
        ),
        onFilter: (value, record) => {
            const recordValue = record[dataIndex];
            if (!recordValue) return false;
            return recordValue.toString().toLowerCase().includes((value as string).toLowerCase());
        },
    });

    return [
        {
            title: t('name'),
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name', t('name')),
            render: (text) => <span className="font-semibold text-slate-800">{text}</span>,
        },
        {
            title: t('slug'),
            dataIndex: 'slug',
            key: 'slug',
            ...getColumnSearchProps('slug', t('slug')),
            render: (slug) => (
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-mono bg-slate-100 text-slate-600 border border-slate-200">
                    <LinkOutlined />
                    {slug}
                </span>
            ),
        },
        {
            title: t('description'),
            dataIndex: 'description',
            key: 'description',
            render: (text) => (
                <span className="text-slate-500 text-sm truncate max-w-[200px] block" title={text}>
                    {text || '-'}
                </span>
            ),
        },
        {
            title: t('parent'),
            key: 'parent',
            render: (_, record) => {
                if (!record.parent?.name) return <span className="text-slate-400 italic">Danh mục gốc</span>;
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        <NodeIndexOutlined />
                        {record.parent.name}
                    </span>
                );
            },
        },
        {
            title: t('attributes'),
            key: 'attributes',
            render: (_, record) => {
                if (!record.attributes || record.attributes.length === 0) return <span className="text-slate-400">-</span>;
                return (
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {record.attributes.map((a: any, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                {a.name}
                            </span>
                        ))}
                    </div>
                );
            },
        },
        {
            title: t('isActive'),
            dataIndex: 'isActive',
            key: 'isActive',
            filters: [
                { text: t('active') || 'Đang hoạt động', value: true },
                { text: t('inactive') || 'Đã ẩn', value: false },
            ],
            onFilter: (value, record) => record.isActive === value,
            filterIcon: (filtered: boolean) => <FilterOutlined className={`text-base ${filtered ? 'text-blue-600' : 'text-slate-400'}`} />,
            render: (isActive: boolean) => (
                <span className={`flex items-center w-fit gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-500 border border-slate-200'
                }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    {isActive ? (t('active') || 'Hoạt động') : (t('inactive') || 'Đã ẩn')}
                </span>
            ),
        },
        {
            title: t('updated_at'),
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
            render: (date) => <span className="text-slate-500 text-sm font-medium">{date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-'}</span>,
        },
        {
            title: t('actions'),
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title={t('edit')} placement='bottom'>
                        <Typography.Link onClick={() => onEdit(record.slug)} className="hover:opacity-70 transition-opacity">
                            <PencilSquareIcon className="w-5 h-5 text-blue-500" />
                        </Typography.Link>
                    </Tooltip>
                    <Tooltip title={t('delete')} placement='bottom'>
                        <Typography.Link type="danger" onClick={() => onDelete(record.slug)} className="hover:opacity-70 transition-opacity">
                            <TrashIcon className="w-5 h-5 text-red-500" />
                        </Typography.Link>
                    </Tooltip>
                </Space>
            ),
        },
    ];
};
// import {Divider, Space, TableColumnsType, Tag, Tooltip, Typography} from "antd";
// import React from "react";
// import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
// interface DataType {
//     id: string;
//     name: string;
//     slug: string;
//     description: string;
//     children?: DataType[];
//     parent?: DataType[];
//     metaTitle: string;
//     metaDescription: string;
//     metaKeywords: Date;
//     isActive: boolean;
//     createdAt: Date;
//     updatedAt: Date;
//     attributes?: DataType[];
// }
// interface ActionProps {
//     onEdit: (id: string) => void;
//     onDelete: (id: string) => void;
//     t: any
// }
// export const getListCategoryColumns = ({ onEdit, onDelete, t }: ActionProps): TableColumnsType<DataType> => [
//     {
//         title: t('name'),
//         dataIndex: 'name',
//     },
//     {
//         title: t('slug'),
//         dataIndex: 'slug',
//     },
//     {
//         title: t('description'),
//         dataIndex: 'description',
//     },
//     {
//         title: t('parent'),
//         // dataIndex: 'parent',
//         render: (_, record) => record.parent?.name || '-',
//     },
//     {
//         title: t('metaTitle'),
//         dataIndex: 'metaTitle',
//     },
//     {
//         title: t('metaDescription'),
//         dataIndex: 'metaDescription',
//     },
//     {
//         title: t('metaKeywords'),
//         dataIndex: 'metaKeywords',
//     },
//     {
//         title: t('attributes'),
//         // dataIndex: 'attributes',
//         render: (_, record) =>
//             record.attributes?.map((a: any) => a.name).join(', ') || '-',
//     },
//     {
//         title: t('isActive'),
//         dataIndex: 'isActive',
//         render: (isActive: boolean) => (
//             <Tag color={isActive ? 'green' : 'red'}>
//                 {isActive ? t('active') : t('inactive')}
//             </Tag>
//         ),
//     },
//     {
//         title: t('created_at'),
//         dataIndex: 'createdAt',
//     },
//     {
//         title: t('updated_at'),
//         dataIndex: 'updatedAt',
//     },
//     {
//         title: t('actions'),
//         dataIndex: '',
//         key: 'x',
//         render: (_, record) => (
//             <Space size="middle">
//                 <Tooltip title={t('edit')} placement={'bottom'}>
//                     <Typography.Link onClick={() => onEdit(record.slug)}>
//                         <PencilSquareIcon className="w-5 h-5 text-blue-500"/>
//                     </Typography.Link>
//                 </Tooltip>
//                 <Tooltip title={t('delete')} placement={'bottom'}>
//                     <Typography.Link
//                         type="danger"
//                         onClick={() => onDelete(record.slug)}
//                     >
//                         <TrashIcon className="w-5 h-5 text-red-500"/>
//                     </Typography.Link>
//                 </Tooltip>
//             </Space>
//         ),
//     },
// ]