import React from "react";
import {Button, Input, Space, TableColumnsType, Tooltip, Typography} from "antd";
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
import {FilterOutlined, SearchOutlined, TagOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import {ColumnType} from "antd/es/table";

// Đã bổ sung thêm slug vào interface
export interface ProductDataType {
    id: string;
    slug: string;
    name: string;
    short_description: string;
    category: any;
    variants: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

interface ActionProps {
    onEdit: (slug: string) => void;
    onDelete: (slug: string) => void;
    t: any;
}

export const getListProductColumns = ({ onEdit, onDelete, t }: ActionProps): TableColumnsType<ProductDataType> => {

    // Hàm tạo Bộ lọc Kính lúp (Pop-up Search)
    const getColumnSearchProps = (dataIndex: keyof ProductDataType, title: string): ColumnType<ProductDataType> => ({
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
                    <Button
                        size="small"
                        onClick={() => { clearFilters && clearFilters(); confirm(); }}
                        className="text-slate-500 border-slate-200 hover:bg-slate-50 rounded-md"
                    >
                        Xóa
                    </Button>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        className="bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 rounded-md font-medium"
                    >
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
            sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
            ...getColumnSearchProps('name', t('name')),
            render: (text) => <span className="font-semibold text-slate-800">{text}</span>
        },
        {
            title: t('short_description'),
            dataIndex: 'short_description',
            key: 'short_description',
            ...getColumnSearchProps('short_description', t('short_description')),
            render: (text) => (
                <span className="text-slate-500 text-sm truncate max-w-[250px] block" title={text}>
                    {text || 'N/A'}
                </span>
            )
        },
        {
            title: t('category'),
            dataIndex: 'category', // Trỏ thẳng vào category
            key: 'category',
            render: (category) => (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                    <TagOutlined />
                    {category?.name || 'Chưa phân loại'}
                </span>
            ),
        },
        {
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Kích hoạt', value: 'active' },
                { text: 'Ẩn/Tạm ngưng', value: 'inactive' },
                { text: 'Hết hàng', value: 'out_of_stock' },
            ],
            onFilter: (value, record) => record.status === value,
            filterIcon: (filtered: boolean) => <FilterOutlined className={`text-base ${filtered ? 'text-blue-600' : 'text-slate-400'}`} />,
            render: (status) => (
                <span className={`flex items-center w-fit gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                    status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        status === 'out_of_stock' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-emerald-500' : status === 'out_of_stock' ? 'bg-rose-500' : 'bg-slate-400'}`}></span>
                    {status || 'N/A'}
                </span>
            )
        },
        {
            title: t('updated_at'),
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
            render: (date) => <span className="text-slate-500 text-sm">{date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-'}</span>
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
// import {Space, TableColumnsType, Tag, Tooltip, Typography} from "antd";
// import React from "react";
// import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
//
// interface DataType {
//     id: string;
//     name: string;
//     description: string;
//     category: string;
//     variants: string;
//     status: string;
//     createdAt: Date;
//     updatedAt: Date;
// }
// interface ActionProps {
//     onEdit: (id: string) => void;
//     onDelete: (id: string) => void;
//     t: any
// }
// export const getListProductColumns = ({ onEdit, onDelete, t }: ActionProps): TableColumnsType<DataType> => [
//     {
//         title: t('name'),
//         dataIndex: 'name',
//     },
//     {
//         title: t('short_description'),
//         dataIndex: 'short_description',
//     },
//     {
//         title: t('category'),
//         dataIndex: '',
//         key: 'category',
//         render: (value) => <Tag color="blue">{value.name}</Tag>,
//     },
//     // {
//     //     title: t('variants'),
//     //     dataIndex: 'variants',
//     // },
//     {
//         title: t('status'),
//         dataIndex: 'status',
//     },
//     // {
//     //     title: t('created_at'),
//     //     dataIndex: 'createdAt',
//     // },
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