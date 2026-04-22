'use client'
import React from 'react';
import { Breadcrumb } from 'antd';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { HomeOutlined } from '@ant-design/icons';
import {t} from "i18next";
import {useTranslations} from "use-intl";

// const breadcrumbNameMap: Record<string, string> = {
//     'admin': 'Quản trị',
//     'user': 'Người dùng',
//     'list': 'Danh sách',
//     'edit': 'Chỉnh sửa',
//     'dashboard': 'Bảng điều khiển',
// };

const AdminBreadcrumb = () => {
    const t = useTranslations('Breadcrumb');
    const pathname = usePathname();
    const pathSnippets1 = pathname.split('/').filter((i) => i);
    const pathSnippets = pathSnippets1.slice(1);
    const breadcrumbItems = pathSnippets.map((segment, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSnippets.length - 1;
        // const name = breadcrumbNameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
        const name = t(`${segment}`)
        return {
            key: url,
            title: isLast ? (
                <span>{name}</span>
            ) : (
                <Link href={url}>{name}</Link>
            ),
        };
    });

    const items = [
        {
            key: 'home',
            title: <Link href="/"><HomeOutlined /></Link>,
        },
        ...breadcrumbItems,
    ];

    return (
        <Breadcrumb
            items={items}
            style={{ margin: '16px 0', fontSize: '14px' }}
        />
    );
};

export default AdminBreadcrumb;