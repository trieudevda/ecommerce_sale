import {Space, TableColumnsType, Tag, Tooltip, Typography} from "antd";
import React from "react";
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
import {User} from "@/src/interface/user.interface";

interface DataType {
    id: string;
    email: string;
    full_name: string;
    address: string;
    phone: string;
    role: string;
    dateOfBirth: Date;
    isEmailVerified: boolean;
    lastLoginAt: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
interface ActionProps {
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    t: any
}
export const getListUserColumns = ({ onEdit, onDelete, t }: ActionProps): TableColumnsType<User> => [
    {
        // key: '',
        title: t('email'),
        dataIndex: 'email',
        // filters: [
        //     {
        //         text: 'Joe',
        //         value: 'Joe',
        //     },
        //     {
        //         text: 'Category 1',
        //         value: 'Category 1',
        //     },
        //     {
        //         text: 'Category 2',
        //         value: 'Category 2',
        //     },
        // ],
        // filterMode: 'tree',
        // filterSearch: true,
        // onFilter: (value, record) => record.name.startsWith(value as string),
        // width: '30%',
    },
    {
        title: t('name'),
        dataIndex: 'fullName',
    },
    {
        title: t('phone'),
        dataIndex: 'phone',
    },
    {
        title: t('address'),
        dataIndex: 'address',
        filters: [
            {
                text: 'London',
                value: 'London',
            },
            {
                text: 'New York',
                value: 'New York',
            },
        ],
        onFilter: (value, record) => record.address?.startsWith(value as string),
        filterSearch: true,
        // width: '40%',
    },
    {
        title: t('role'),
        dataIndex: 'role',
    },
    {
        title: t('date_of_birth'),
        dataIndex: 'dateOfBirth',
    },
    {
        title: t('is_email_verified'),
        dataIndex: 'isEmailVerified',
        render: (isVerified: boolean) => (
            <Tag color={isVerified ? 'green' : 'red'}>
                {isVerified ? t('verified') : t('unverified')}
            </Tag>
        ),
    },
    {
        title: t('last_login'),
        dataIndex: 'lastLoginAt',
    },
    {
        title: t('status'),
        dataIndex: 'status',
    },
    {
        title: t('created_at'),
        dataIndex: 'createdAt',
    },
    {
        title: t('updated_at'),
        dataIndex: 'updatedAt',
    },
    {
        title: t('actions'),
        dataIndex: '',
        key: 'x',
        render: (_, record) => (
            <Space size="middle">
                <Tooltip title={t('edit')} placement={'bottom'}>
                    <Typography.Link onClick={() => onEdit(record.id)}>
                        <PencilSquareIcon className="w-5 h-5 text-blue-500"/>
                    </Typography.Link>
                </Tooltip>
                <Tooltip title={t('delete')} placement={'bottom'}>
                    <Typography.Link
                        type="danger"
                        onClick={() => onDelete(record.id)}
                    >
                        <TrashIcon className="w-5 h-5 text-red-500"/>
                    </Typography.Link>
                </Tooltip>
            </Space>
        ),
    },
]