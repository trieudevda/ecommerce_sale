import React from "react";
import {Button, Input, Space, TableColumnsType, Tooltip, Typography} from "antd";
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
import {FilterOutlined, SearchOutlined} from '@ant-design/icons';
import {User} from "@/src/interface/user.interface";
import dayjs from 'dayjs';
import {ColumnType} from "antd/es/table";

interface ActionProps {
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    t: any;
}

export const getListUserColumns = ({ onEdit, onDelete, t }: ActionProps): TableColumnsType<User> => {

    // 🌟 HÀM TẠO BỘ LỌC TÌM KIẾM VĂN BẢN (Cho Email, Name, Phone, Address)
    const getColumnSearchProps = (dataIndex: keyof User, title: string): ColumnType<User> => ({
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
            title: t('email'),
            dataIndex: 'email',
            sorter: (a, b) => (a.email || '').localeCompare(b.email || ''),
            ...getColumnSearchProps('email', t('email')), // Kích hoạt Filter Text
            render: (text) => <span className="font-medium text-slate-700">{text}</span>
        },
        {
            title: t('name'),
            dataIndex: 'fullName',
            sorter: (a, b) => (a.fullName || '').localeCompare(b.fullName || ''),
            ...getColumnSearchProps('fullName', t('name')), // Kích hoạt Filter Text
            render: (text) => <span className="text-slate-600">{text}</span>
        },
        {
            title: t('phone'),
            dataIndex: 'phone',
            ...getColumnSearchProps('phone', t('phone')), // Kích hoạt Filter Text
            render: (text) => <span className="text-slate-500">{text || 'N/A'}</span>
        },
        {
            title: t('address'),
            dataIndex: 'address',
            ...getColumnSearchProps('address', t('address')), // Kích hoạt Filter Text
            render: (text) => <span className="text-slate-500 truncate max-w-[150px] block" title={text}>{text || 'N/A'}</span>
        },
        {
            title: t('role'),
            dataIndex: 'role',
            // Bộ lọc chọn danh sách (Dropdown Filter) cho Role
            filters: [
                { text: 'Super Admin', value: 'superAdmin' },
                { text: 'Admin', value: 'ADMIN' },
                { text: 'User', value: 'USER' },
            ],
            onFilter: (value, record) => record.role === value,
            filterIcon: (filtered: boolean) => <FilterOutlined className={`text-base ${filtered ? 'text-blue-600' : 'text-slate-400'}`} />,
            render: (role) => (
                <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                    role === 'ADMIN' || role === 'superAdmin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-slate-100 text-slate-700'
                }`}>
                    {role || 'USER'}
                </span>
            )
        },
        {
            title: t('is_email_verified'),
            dataIndex: 'isEmailVerified',
            // Bộ lọc chọn danh sách cho Trạng thái xác thực
            filters: [
                { text: t('verified'), value: true },
                { text: t('unverified'), value: false },
            ],
            onFilter: (value, record) => record.isEmailVerified === value,
            filterIcon: (filtered: boolean) => <FilterOutlined className={`text-base ${filtered ? 'text-blue-600' : 'text-slate-400'}`} />,
            render: (isVerified: boolean) => (
                <span className={`px-2 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                    {isVerified ? t('verified') : t('unverified')}
                </span>
            ),
        },
        {
            title: t('status'),
            dataIndex: 'status',
            // Bộ lọc chọn danh sách cho Status
            filters: [
                { text: 'Active', value: 'ACTIVE' },
                { text: 'Inactive', value: 'INACTIVE' },
            ],
            onFilter: (value, record) => record.status === value,
            filterIcon: (filtered: boolean) => <FilterOutlined className={`text-base ${filtered ? 'text-blue-600' : 'text-slate-400'}`} />,
            render: (status) => (
                <span className={`flex items-center gap-1.5 text-sm font-medium ${
                    status === 'ACTIVE' ? 'text-emerald-600' : 'text-slate-500'
                }`}>
                    <span className={`w-2 h-2 rounded-full ${status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    {status || 'Unknown'}
                </span>
            )
        },
        // 👇 KHÔNG DÙNG BỘ LỌC Ở 2 CỘT NGÀY 👇
        {
            title: t('created_at'),
            dataIndex: 'createdAt',
            sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(), // Giữ lại sắp xếp tăng/giảm dần
            render: (date) => <span className="text-slate-500">{date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-'}</span>
        },
        {
            title: t('updated_at'),
            dataIndex: 'updatedAt',
            sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(), // Giữ lại sắp xếp tăng/giảm dần
            render: (date) => <span className="text-slate-500">{date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-'}</span>
        },
        {
            title: t('actions'),
            dataIndex: '',
            key: 'actions',
            align: 'center',
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
// import {Space, TableColumnsType, Tag, Tooltip, Typography} from "antd";
// import React from "react";
// import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
// import {User} from "@/src/interface/user.interface";
//
// interface DataType {
//     id: string;
//     email: string;
//     full_name: string;
//     address: string;
//     phone: string;
//     role: string;
//     dateOfBirth: Date;
//     isEmailVerified: boolean;
//     lastLoginAt: Date;
//     status: string;
//     createdAt: Date;
//     updatedAt: Date;
// }
// interface ActionProps {
//     onEdit: (id: string) => void;
//     onDelete: (id: string) => void;
//     t: any
// }
// export const getListUserColumns = ({ onEdit, onDelete, t }: ActionProps): TableColumnsType<User> => [
//     {
//         // key: '',
//         title: t('email'),
//         dataIndex: 'email',
//         // filters: [
//         //     {
//         //         text: 'Joe',
//         //         value: 'Joe',
//         //     },
//         //     {
//         //         text: 'Category 1',
//         //         value: 'Category 1',
//         //     },
//         //     {
//         //         text: 'Category 2',
//         //         value: 'Category 2',
//         //     },
//         // ],
//         // filterMode: 'tree',
//         // filterSearch: true,
//         // onFilter: (value, record) => record.name.startsWith(value as string),
//         // width: '30%',
//     },
//     {
//         title: t('name'),
//         dataIndex: 'fullName',
//     },
//     {
//         title: t('phone'),
//         dataIndex: 'phone',
//     },
//     {
//         title: t('address'),
//         dataIndex: 'address',
//         filters: [
//             {
//                 text: 'London',
//                 value: 'London',
//             },
//             {
//                 text: 'New York',
//                 value: 'New York',
//             },
//         ],
//         onFilter: (value, record) => record.address?.startsWith(value as string),
//         filterSearch: true,
//         // width: '40%',
//     },
//     {
//         title: t('role'),
//         dataIndex: 'role',
//     },
//     {
//         title: t('date_of_birth'),
//         dataIndex: 'dateOfBirth',
//     },
//     {
//         title: t('is_email_verified'),
//         dataIndex: 'isEmailVerified',
//         render: (isVerified: boolean) => (
//             <Tag color={isVerified ? 'green' : 'red'}>
//                 {isVerified ? t('verified') : t('unverified')}
//             </Tag>
//         ),
//     },
//     {
//         title: t('last_login'),
//         dataIndex: 'lastLoginAt',
//     },
//     {
//         title: t('status'),
//         dataIndex: 'status',
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