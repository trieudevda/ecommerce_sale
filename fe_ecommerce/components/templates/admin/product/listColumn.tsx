import {Divider, Space, TableColumnsType, Tag, Tooltip, Typography} from "antd";
import React from "react";
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
interface DataType {
    id: string;
    name: string;
    description: string;
    category: string;
    variants: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
interface ActionProps {
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    t: any
}
export const getListProductColumns = ({ onEdit, onDelete, t }: ActionProps): TableColumnsType<DataType> => [
    {
        title: t('name'),
        dataIndex: 'name',
    },
    {
        title: t('short_description'),
        dataIndex: 'short_description',
    },
    {
        title: t('category'),
        dataIndex: '',
        key: 'category',
        render: (value) => <Tag color="blue">{value.name}</Tag>,
    },
    // {
    //     title: t('variants'),
    //     dataIndex: 'variants',
    // },
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
                    <Typography.Link onClick={() => onEdit(record.slug)}>
                        <PencilSquareIcon className="w-5 h-5 text-blue-500"/>
                    </Typography.Link>
                </Tooltip>
                <Tooltip title={t('delete')} placement={'bottom'}>
                    <Typography.Link
                        type="danger"
                        onClick={() => onDelete(record.slug)}
                    >
                        <TrashIcon className="w-5 h-5 text-red-500"/>
                    </Typography.Link>
                </Tooltip>
            </Space>
        ),
    },
]