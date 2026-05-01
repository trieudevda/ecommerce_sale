import {Popconfirm, Space, TableColumnsType, Tag, Tooltip, Typography} from "antd";
import React from "react";
import {PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";
interface DataType {
    id: string;
    name: string;
    slug: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
interface ActionProps {
    onEdit: (slug: string) => void;
    onDelete: (slug: string) => void;
    t: any
}
export const getListCategoryAttributeColumns = ({ onEdit, onDelete, t }: ActionProps): TableColumnsType<DataType> => [
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
                    <Popconfirm
                        title="Xóa thuộc tính"
                        description="Bạn có chắc chắn muốn xóa thuộc tính này không?"
                        onConfirm={() => onDelete(record.slug)}
                        okText="Có"
                        cancelText="Không"
                        okButtonProps={{ danger: true }}
                    >
                        <Typography.Link type="danger">
                            <TrashIcon className="w-5 h-5 text-red-500"/>
                        </Typography.Link>
                    </Popconfirm>
                </Tooltip>
                {/*<Tooltip title={t('delete')} placement={'bottom'}>*/}
                {/*    <Typography.Link*/}
                {/*        type="danger"*/}
                {/*        onClick={() => onDelete(record.slug)}*/}
                {/*    >*/}
                {/*        <TrashIcon className="w-5 h-5 text-red-500"/>*/}
                {/*    </Typography.Link>*/}
                {/*</Tooltip>*/}
            </Space>
        ),
    },
]