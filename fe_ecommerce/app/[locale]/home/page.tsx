'use client';
import React, {useState} from 'react';
import {Badge, Button, Card, Col, Input, Layout, Row, Typography} from 'antd';
import {SearchOutlined, ShoppingCartOutlined, UserOutlined} from '@ant-design/icons';
import "@/public/styles/css/main.scss"

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

export default function HomePage() {
    const [visibleProducts, setVisibleProducts] = useState(8);
    const products = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <Layout className="bg-transparent font-sans">

            {/* HEADER: Kính mờ (Glassmorphism) */}
            <Header className="bg-white/70 backdrop-blur-xl border-b border-white/50 h-20 px-0 sticky top-0 z-50 shadow-sm">
                <div className="max-w-[1400px] mx-auto w-full px-6 flex items-center justify-between h-full">
                    <div className="text-3xl font-black tracking-tight liquid-gradient text-transparent bg-clip-text">
                        LIQUID.
                    </div>

                    <div className="hidden lg:flex flex-1 max-w-xl mx-8">
                        <Input
                            size="large"
                            placeholder="Tìm kiếm..."
                            prefix={<SearchOutlined className="text-slate-400" />}
                            className="rounded-full bg-slate-100/50 border-none hover:bg-white focus:bg-white transition-all shadow-inner"
                        />
                    </div>

                    <div className="flex gap-6 items-center">
                        <Badge count={2} color="#3b82f6">
                            <Button shape="circle" icon={<ShoppingCartOutlined className="text-xl text-slate-700" />} className="liquid-btn bg-white shadow-sm h-10 w-10" />
                        </Badge>
                        <Button shape="circle" icon={<UserOutlined className="text-xl text-slate-700" />} className="liquid-btn bg-white shadow-sm h-10 w-10" />
                    </div>
                </div>
            </Header>

            <Content className="max-w-[1400px] mx-auto w-full px-6 py-12">

                {/* BANNER: Sử dụng Liquid Shape & Gradient */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-12">
                    <div className="flex-1 space-y-8">
                        <Title level={1} className="!text-6xl md:!text-8xl font-black tracking-tighter text-slate-800">
                            Chảy Cùng <br/> <span className="liquid-text-gradient">Công Nghệ</span>
                        </Title>
                        <Text className="text-xl text-slate-500 block max-w-lg">
                            Trải nghiệm thiết kế mềm mại, uyển chuyển. Nâng tầm phong cách sống với những sản phẩm công nghệ tinh hoa nhất.
                        </Text>
                        <Button size="large" className="liquid-btn liquid-gradient text-white font-bold h-14 px-10 text-lg">
                            Khám phá ngay
                        </Button>
                    </div>

                    {/* Khối hình giọt nước chuyển động */}
                    <div className="flex-1 flex justify-center">
                        <div className="w-[350px] h-[350px] md:w-[500px] md:h-[500px] liquid-shape liquid-gradient p-2 shadow-2xl shadow-blue-500/20">
                            {/* Bên trong Shape có thể chứa ảnh */}
                            <div className="w-full h-full liquid-shape bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe')] bg-cover bg-center opacity-90 mix-blend-overlay"></div>
                        </div>
                    </div>
                </div>

                {/* SẢN PHẨM: Sử dụng Liquid Card */}
                <div className="mb-20">
                    <Title level={2} className="mb-10 text-center tracking-tight text-slate-800">
                        Sản phẩm nổi bật
                    </Title>
                    <Row gutter={[32, 32]}>
                        {products.slice(0, visibleProducts).map((item) => (
                            <Col xs={24} sm={12} lg={6} key={item}>
                                <Card
                                    hoverable
                                    className="liquid-card !p-2" // Sử dụng class liquid-card
                                    cover={<div className="h-56 bg-slate-100/50 m-2 rounded-[24px]" />}
                                >
                                    <Text className="text-slate-400 font-medium text-sm">Công nghệ</Text>
                                    <h3 className="font-bold text-lg text-slate-800 line-clamp-1 mt-1">Sản phẩm Liquid {item}</h3>
                                    <div className="text-2xl font-black text-slate-800 mt-2 mb-4">19.990.000đ</div>

                                    <Button type="primary" className="liquid-btn liquid-gradient w-full h-12 font-bold text-base">
                                        Mua Ngay
                                    </Button>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Nút XEM THÊM */}
                    {visibleProducts < products.length && (
                        <div className="flex justify-center mt-12">
                            <Button
                                onClick={() => setVisibleProducts(prev => prev + 4)}
                                className="liquid-btn bg-slate-800 text-white hover:text-white h-12 px-10 font-bold"
                            >
                                Tải thêm dòng chảy
                            </Button>
                        </div>
                    )}
                </div>
            </Content>

            {/* FOOTER */}
            <Footer className="bg-slate-900 text-slate-400 pt-20 pb-10 px-6 rounded-t-[80px] shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
                <div className="max-w-[1400px] mx-auto w-full text-center">
                    <div className="text-4xl font-black tracking-tight liquid-text-gradient text-transparent bg-clip-text mb-6 inline-block">
                        LIQUID.
                    </div>
                    <p className="max-w-xl mx-auto mb-10">Sự hòa quyện hoàn hảo giữa công nghệ hiện đại và thiết kế nghệ thuật.</p>
                    <div className="border-t border-slate-800 pt-8 text-sm">
                        © 2026 Liquid UI. All rights reserved.
                    </div>
                </div>
            </Footer>
        </Layout>
    );
}