'use client';
import React, {useState} from 'react';
import {Button, Card, Carousel, Col, Layout, Row, Typography} from 'antd';
import "@/public/styles/css/main.scss"
import "@/public/styles/css/layout.scss"
import FooterUser from "@/components/templates/user/Footer";
import HeaderUser from "@/components/templates/user/Header";
import HeroSlider from "@/components/templates/user/HeroSlider";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

export default function HomePage() {
    const [visibleProducts, setVisibleProducts] = useState(8);
    const products = Array.from({ length: 12 }, (_, i) => i + 1);
    const slides = [
        {
            title: "Chảy Cùng",
            highlight: "Công Nghệ",
            desc: "Trải nghiệm thiết kế mềm mại, uyển chuyển.",
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
        },
        {
            title: "Khám Phá",
            highlight: "Tương Lai",
            desc: "Những sản phẩm công nghệ đột phá cho cuộc sống hiện đại.",
            image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
        },
        {
            title: "Sáng Tạo",
            highlight: "Không Giới Hạn",
            desc: "Thiết kế nghệ thuật kết hợp công nghệ tiên phong.",
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        },
    ];
    return (
        <Layout className="bg-transparent font-sans">
            <HeaderUser/>
            <HeroSlider/>
            <Content className="max-w-[1400px] mx-auto w-full px-6 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-12">
                    <Carousel autoplay effect="fade">
                        {slides.map((slide, index) => (
                            <div key={index}>
                                <div className="min-h-[700px] flex items-center">
                                    <div className="container mx-auto px-6">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                                            <div className="flex-1 space-y-8">
                                                <Title
                                                    level={1}
                                                    className="!text-6xl md:!text-8xl font-black tracking-tighter text-slate-800"
                                                >
                                                    {slide.title}
                                                    <br />
                                                    <span className="liquid-text-gradient">
                                            {slide.highlight}
                                        </span>
                                                </Title>

                                                <Text className="text-xl text-slate-500 block max-w-lg">
                                                    {slide.desc}
                                                </Text>

                                                <Button
                                                    size="large"
                                                    className="liquid-btn liquid-gradient text-white font-bold h-14 px-10 text-lg"
                                                >
                                                    Khám phá ngay
                                                </Button>
                                            </div>

                                            <div className="flex-1 flex justify-center">
                                                <div className="w-[350px] h-[350px] md:w-[500px] md:h-[500px] liquid-shape liquid-gradient p-2 shadow-2xl shadow-blue-500/20">
                                                    <div
                                                        className="w-full h-full liquid-shape bg-cover bg-center"
                                                        style={{
                                                            backgroundImage: `url(${slide.image})`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>
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
            <FooterUser />
        </Layout>
    );
}