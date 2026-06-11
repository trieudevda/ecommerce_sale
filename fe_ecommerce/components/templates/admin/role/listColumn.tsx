import React from "react";
import {Button, Input, Space, TableColumnsType, Tooltip, Typography} from "antd";
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
import {SafetyCertificateOutlined, SearchOutlined} from '@ant-design/icons';
import {ColumnType} from "antd/es/table";

interface DataType {
    id: string;
    code: string;
    name: string;
    slug: string;
    module: string;
    roles: string;
}

interface ActionProps {
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    t: any;
}

export const getListRoleColumns = ({ onEdit, onDelete, t }: ActionProps): TableColumnsType<DataType> => {
    const getColumnSearchProps = (dataIndex: keyof DataType, title: string): ColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div className="p-3 shadow-xl rounded-2xl bg-white border border-slate-100 w-64" onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    placeholder={`Tìm ${title.toLowerCase()}...`}
                    value={(selectedKeys[0] ?? "") as string}
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
            render: (text) => (
                <div className="flex items-center gap-2">
                    <SafetyCertificateOutlined className="text-blue-500" />
                    <span className="font-semibold text-slate-800">{text}</span>
                </div>
            ),
        },
        {
            title: t('slug'),
            dataIndex: 'slug',
            key: 'slug',
            ...getColumnSearchProps('slug', t('slug')),
            render: (slug) => (
                <span className="text-slate-500 font-mono text-sm bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {slug}
                </span>
            ),
        },
        {
            title: t('actions'),
            key: 'actions',
            align: 'center',
            width: 120,
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title={t('edit')} placement='bottom'>
                        <Typography.Link onClick={() => onEdit(record.id)} className="hover:opacity-70 transition-opacity">
                            <PencilSquareIcon className="w-5 h-5 text-blue-500" />
                        </Typography.Link>
                    </Tooltip>
                    <Tooltip title={t('delete')} placement='bottom'>
                        <Typography.Link type="danger" onClick={() => onDelete(record.id)} className="hover:opacity-70 transition-opacity">
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
//     code: string;
//     name: string;
//     module: string;
//     roles: string;
// }
// interface ActionProps {
//     onEdit: (id: string) => void;
//     onDelete: (id: string) => void;
//     t: any
// }
// export const getListRoleColumns = ({ onEdit, onDelete, t }: ActionProps): TableColumnsType<DataType> => [
//     {
//         title: t('name'),
//         dataIndex: 'name',
//     },
//     {
//         title: t('slug'),
//         dataIndex: 'slug',
//     },
//     {
//         title: t('actions'),
//         dataIndex: '',
//         key: 'x',
//         render: (_, record) => (
//             <Space size="middle">
//                 <Tooltip title={t('edit')} placement={'bottom'}>
//                     <Typography.Link onClick={() => onEdit(record.id)}>
//                         <PencilSquareIcon className="w-5 h-5 text-blue-500"/>
//                     </Typography.Link>
//                 </Tooltip>
//                 <Tooltip title={t('delete')} placement={'bottom'}>
//                     <Typography.Link
//                         type="danger"
//                         onClick={() => onDelete(record.id)}
//                     >
//                         <TrashIcon className="w-5 h-5 text-red-500"/>
//                     </Typography.Link>
//                 </Tooltip>
//             </Space>
//         ),
//     },
// ]