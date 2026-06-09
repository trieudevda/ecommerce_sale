'use client';

import React from 'react';
import {Button, Card, Col, Row, Space, Table, Tooltip, Typography} from 'antd';
import {
    DeleteOutlined,
    DollarOutlined,
    EditOutlined,
    InboxOutlined,
    MoreOutlined,
    ShoppingCartOutlined,
    UserOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// 1. Dữ liệu mẫu cho Bảng Chi Tiết Sản Phẩm Tồn Kho
const inventoryData = [
    {
        key: '1',
        id: 'SP-001',
        name: 'iPhone 15 Pro Max 256GB',
        category: 'Điện thoại',
        stock: 145,
        price: '$1,199',
        status: 'Còn hàng'
    },
    {
        key: '2',
        id: 'SP-002',
        name: 'MacBook Air M3 2024',
        category: 'Laptop',
        stock: 12,
        price: '$1,099',
        status: 'Sắp hết'
    },
    {
        key: '3',
        id: 'SP-003',
        name: 'AirPods Pro Gen 2',
        category: 'Phụ kiện',
        stock: 0,
        price: '$249',
        status: 'Hết hàng'
    },
    {
        key: '4',
        id: 'SP-004',
        name: 'iPad Pro 11-inch M4',
        category: 'Tablet',
        stock: 58,
        price: '$999',
        status: 'Còn hàng'
    },
    {
        key: '5',
        id: 'SP-005',
        name: 'Apple Watch Series 9',
        category: 'Phụ kiện',
        stock: 5,
        price: '$399',
        status: 'Sắp hết'
    },
];

// 2. Cấu hình Cột cho Bảng
const inventoryColumns = [
    {
        title: 'Mã SP',
        dataIndex: 'id',
        key: 'id',
        render: (text: string) => <span className="font-semibold text-gray-600">{text}</span>
    },
    {
        title: 'Tên Sản Phẩm',
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <span className="font-medium text-gray-800">{text}</span>
    },
    { title: 'Danh mục', dataIndex: 'category', key: 'category' },
    {
        title: 'Tồn kho',
        dataIndex: 'stock',
        key: 'stock',
        render: (stock: number) => (
            <span className={`font-bold ${stock > 20 ? 'text-green-600' : stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
        {stock}
      </span>
        )
    },
    { title: 'Đơn giá', dataIndex: 'price', key: 'price' },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
            // Sử dụng Tailwind Gradient cho các Tag trạng thái
            let gradientClass = '';
            if (status === 'Còn hàng') gradientClass = 'bg-gradient-to-r from-emerald-100 to-teal-100 text-teal-800 border-teal-200';
            if (status === 'Sắp hết') gradientClass = 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200';
            if (status === 'Hết hàng') gradientClass = 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200';

            return (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${gradientClass}`}>
          {status}
        </span>
            );
        }
    },
    {
        title: 'Hành động',
        key: 'action',
        render: () => (
            <Space size="middle">
                <Tooltip title="Chỉnh sửa">
                    <Button type="text" icon={<EditOutlined className="text-blue-500 hover:text-blue-700" />} />
                </Tooltip>
                <Tooltip title="Xóa">
                    <Button type="text" icon={<DeleteOutlined className="text-red-500 hover:text-red-700" />} />
                </Tooltip>
                <Button type="text" icon={<MoreOutlined className="text-gray-500" />} />
            </Space>
        ),
    },
];

export default function DashboardPage() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            {/* Header trang với nút thêm mới Gradient */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <Title level={2} className="!mb-1 !text-gray-800">Tổng Quan Cửa Hàng</Title>
                    <Text className="text-gray-500">Cập nhật dữ liệu hệ thống ngày hôm nay.</Text>
                </div>
            </div>

            {/* Hàng 1: Các Box Thống Kê (Gradients & Hover Effects) */}
            <Row gutter={[24, 24]} className="mb-8">
                {/* Box Doanh thu */}
                <Col xs={24} sm={12} xl={6}>
                    <Card
                        variant="borderless"
                        className="rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden relative group"
                    >
                        {/* Lớp phủ gradient mờ góc phải */}
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-blue-100 to-transparent rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />

                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
                                <DollarOutlined className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">Tổng Doanh Thu</p>
                                <h3 className="text-2xl font-bold text-gray-800">$24,568</h3>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-green-500 bg-green-50 px-2 py-1 rounded-md inline-block font-medium">
                            +12.5% so với tuần trước
                        </div>
                    </Card>
                </Col>

                {/* Box Đơn hàng */}
                <Col xs={24} sm={12} xl={6}>
                    <Card
                        variant="borderless"
                        className="rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden relative group"
                    >
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-emerald-100 to-transparent rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />

                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-teal-500/30">
                                <ShoppingCartOutlined className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">Đơn Hàng Mới</p>
                                <h3 className="text-2xl font-bold text-gray-800">1,245</h3>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-green-500 bg-green-50 px-2 py-1 rounded-md inline-block font-medium">
                            +5.2% so với tuần trước
                        </div>
                    </Card>
                </Col>

                {/* Box Khách hàng */}
                <Col xs={24} sm={12} xl={6}>
                    <Card
                        variant="borderless"
                        className="rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden relative group"
                    >
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-purple-100 to-transparent rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />

                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30">
                                <UserOutlined className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">Khách Hàng</p>
                                <h3 className="text-2xl font-bold text-gray-800">8,934</h3>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-red-500 bg-red-50 px-2 py-1 rounded-md inline-block font-medium">
                            -1.2% so với tuần trước
                        </div>
                    </Card>
                </Col>

                {/* Box Tồn kho Alert */}
                <Col xs={24} sm={12} xl={6}>
                    <Card
                        variant="borderless"
                        className="rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden relative group"
                    >
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-rose-100 to-transparent rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />

                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-rose-400 to-red-500 text-white shadow-lg shadow-red-500/30">
                                <InboxOutlined className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">Cần Nhập Hàng</p>
                                <h3 className="text-2xl font-bold text-gray-800">17 <span className="text-sm font-normal text-gray-400">mặt hàng</span></h3>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded-md inline-block font-medium">
                            2 mặt hàng đã hết
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Hàng 2: Bảng Chi tiết sản phẩm tồn kho */}
            <Row>
                <Col span={24}>
                    <Card
                        variant="borderless"
                        className="rounded-2xl shadow-sm overflow-hidden"
                        styles={{
                            header: { borderBottom: '1px solid #f0f0f0', padding: '20px 24px' },
                            body: { padding: 0 }
                        }}
                        title={
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-800 m-0">Chi tiết sản phẩm tồn kho</h3>
                                <div className="flex gap-2">
                                    <Button className="rounded-lg border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-600">Xuất báo cáo</Button>
                                </div>
                            </div>
                        }
                    >
                        {/* Custom cấu trúc table bằng Tailwind bên trong lớp của Antd */}
                        <div className="overflow-x-auto">
                            <Table
                                dataSource={inventoryData}
                                columns={inventoryColumns}
                                pagination={{ pageSize: 5 }}
                                className="custom-admin-table"
                                rowClassName="hover:bg-blue-50/50 transition-colors"
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}