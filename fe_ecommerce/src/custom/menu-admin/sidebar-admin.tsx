import {
    DashboardOutlined, EditOutlined, KeyOutlined,
    OrderedListOutlined, PlusOutlined, SafetyOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined
} from "@ant-design/icons";
import React from "react";
import Link from "next/link";
import {ADMIN_PATHS} from "@/src/path";

const sidebarAdmin = (userId: string) => [
    {
        key: '1',
        icon: <DashboardOutlined />,
        label: 'nav 1',
    },
    {
        key: '2',
        icon: <UserOutlined />,
        label: 'Người dùng',
        children: [
            {
                key: 'list',
                icon: <OrderedListOutlined />,
                label: <Link href={ADMIN_PATHS.USER.LIST()}>Danh sách</Link>,
            },
            {
                key: 'edit',
                icon: <EditOutlined />,
                label: <Link href={ADMIN_PATHS.USER.EDIT(userId)}>Sửa</Link>,
            }
        ],
    },
    {
        key: '3',
        icon: <SafetyOutlined />,
        label: 'Vai trò',
        children: [
            {
                key: 'role-list',
                icon: <OrderedListOutlined />,
                label: <Link href={ADMIN_PATHS.ROLE.LIST()}>Danh sách</Link>,
            },
            {
                key: 'role-create',
                icon: <PlusOutlined />,
                label: <Link href={ADMIN_PATHS.ROLE.CREATE()}>Thêm</Link>,
            }
        ],
    },
    {
        key: '4',
        icon: <KeyOutlined />,
        label: 'Phân quyền',
        children: [
            {
                key: 'per-list',
                icon: <OrderedListOutlined />,
                label: <Link href={ADMIN_PATHS.PERMISSION.LIST()}>Danh sách</Link>,
            },
            {
                key: 'per-create',
                icon: <PlusOutlined />,
                label: <Link href={ADMIN_PATHS.PERMISSION.CREATE()}>Thêm</Link>,
            }
        ],
    },
]
export  {
    sidebarAdmin,
}