import {Divider, Space, TableColumnsType, Tag, Tooltip, Typography} from "antd";
import React from "react";
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
interface DataType {
    id: string;
    name: string;
    slug: string;
    description: string;
    children?: DataType[];
    parent?: DataType[];
    metaTitle: string;
    metaDescription: string;
    metaKeywords: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    attributes?: DataType[];
}
interface ActionProps {
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    t: any
}
export const getListCategoryColumns = ({ onEdit, onDelete, t }: ActionProps): TableColumnsType<DataType> => [
    {
        title: t('name'),
        dataIndex: 'name',
    },
    {
        title: t('slug'),
        dataIndex: 'slug',
    },
    {
        title: t('description'),
        dataIndex: 'description',
    },
    {
        title: t('parent'),
        // dataIndex: 'parent',
        render: (_, record) => record.parent?.name || '-',
    },
    {
        title: t('metaTitle'),
        dataIndex: 'metaTitle',
    },
    {
        title: t('metaDescription'),
        dataIndex: 'metaDescription',
    },
    {
        title: t('metaKeywords'),
        dataIndex: 'metaKeywords',
    },
    {
        title: t('attributes'),
        // dataIndex: 'attributes',
        render: (_, record) =>
            record.attributes?.map((a: any) => a.name).join(', ') || '-',
    },
    {
        title: t('isActive'),
        dataIndex: 'isActive',
        render: (isActive: boolean) => (
            <Tag color={isActive ? 'green' : 'red'}>
                {isActive ? t('active') : t('inactive')}
            </Tag>
        ),
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