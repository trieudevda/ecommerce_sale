import {
    DashboardOutlined,
    EditOutlined,
    KeyOutlined,
    LaptopOutlined,
    OrderedListOutlined,
    PlusOutlined,
    ProductOutlined,
    SafetyOutlined,
    TagsOutlined,
    UserOutlined
} from "@ant-design/icons";
import React from "react";
import Link from "next/link";
import {ADMIN_PATHS} from "@/src/path";

const sidebarAdmin = (userId: string) => [
    {
        key: '1',
        icon: <DashboardOutlined />,
        label: <Link href={ADMIN_PATHS.DASHBOARD.LIST()}>Dashboard</Link>,
    },
    {
        key: 'user',
        icon: <UserOutlined />,
        label: 'Người dùng',
        children: [
            {
                key: 'user-list',
                icon: <OrderedListOutlined />,
                label: <Link href={ADMIN_PATHS.USER.LIST()}>Danh sách</Link>,
            },
            {
                key: 'user-edit',
                icon: <EditOutlined />,
                label: <Link href={ADMIN_PATHS.USER.EDIT(userId)}>Sửa</Link>,
            }
        ],
    },
    {
        key: 'product',
        icon: <ProductOutlined />,
        label: 'Sản phẩm',
        children: [
            {
                key: 'product-list',
                icon: <OrderedListOutlined />,
                label: <Link href={ADMIN_PATHS.PRODUCT.LIST()}>Danh sách</Link>,
            },
            {
                key: 'product-category',
                icon: <LaptopOutlined/>,
                label: 'Danh mục',
                children: [
                    {
                        key: 'product-category-list',
                        icon: <OrderedListOutlined/>,
                        label: <Link href={ADMIN_PATHS.PRODUCT.CATEGORY.LIST()}>Danh sách</Link>,
                    },
                    {
                        key: 'product-category-attribute-list',
                        icon: <TagsOutlined/>,
                        label: <Link href={ADMIN_PATHS.PRODUCT.CATEGORY.ATTRIBUTE.LIST()}>Thuộc tính</Link>,
                    },
                ]
            }
        ],
    },
    {
        key: 'role',
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
        key: 'permission',
        icon: <KeyOutlined />,
        label: 'Phân quyền',
        children: [
            {
                key: 'per-list',
                icon: <OrderedListOutlined />,
                label: <Link href={ADMIN_PATHS.PERMISSION.LIST()}>Danh sách</Link>,
            },
        ],
    },
]
export  {
    sidebarAdmin,
}