import {Divider, Space, TableColumnsType, Tag, Tooltip, Typography} from "antd";
import React from "react";
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
interface DataType {
    id: string;
    code: string;
    name: string;
    module: string;
    roles: string;
}
interface ActionProps {
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    t: any
}
export const getListRoleColumns = ({ onEdit, onDelete, t }: ActionProps): TableColumnsType<DataType> => [
    {
        title: t('name'),
        dataIndex: 'name',
    },
    {
        title: t('slug'),
        dataIndex: 'slug',
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