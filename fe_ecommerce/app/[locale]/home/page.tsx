'use client';
import React, {useState} from 'react';
import {Layout, Typography} from 'antd';
import "@/public/styles/css/main.scss"
import "@/public/styles/css/layout.scss"
import FooterUser from "@/components/templates/user/Footer";
import HeaderUser from "@/components/templates/user/Header";
import HeroSlider from "@/components/templates/user/HeroSlider";
import Link from "next/link";
import Image from "next/image";
import HotPromotion from "@/app/[locale]/home/HotPromotion";
import RecommendedProducts from "@/app/[locale]/home/RecommendedProducts";
import News from "@/app/[locale]/home/News";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const categories = [
    { id: 1, name: "Điện thoại", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=200" },
    { id: 2, name: "Laptop", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=200" },
    { id: 3, name: "Tablet", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=200" },
    { id: 4, name: "Đồng hồ thông minh", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=200" },
    { id: 5, name: "Tai nghe", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=200" },
    { id: 6, name: "Ốp lưng", image: "https://images.unsplash.com/photo-1606041011872-59659ceb76c8?q=80&w=200" },
    { id: 7, name: "Cáp, Sạc", image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=200" },
    { id: 8, name: "Sạc dự phòng", image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=200" },
    { id: 9, name: "Bàn phím", image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=200" },
    { id: 10, name: "Chuột máy tính", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=200" },
    { id: 11, name: "Màn hình", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=200" },
    { id: 12, name: "Loa Bluetooth", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=200" },
    { id: 13, name: "Camera, Webcam", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=200" },
    { id: 14, name: "Phụ kiện Gaming", image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=200" },
    { id: 15, name: "Thiết bị mạng", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=200" },
    { id: 16, name: "Tivi", image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=200" },
    { id: 17, name: "Máy chơi game", image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=200" },
    { id: 18, name: "Thiết bị mạng", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=200" },
    { id: 19, name: "Tivi", image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=200" },
    { id: 20, name: "Máy chơi game", image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=200" },
    { id: 21, name: "Nhà thông minh", image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=200" },
    { id: 22, name: "Tivi", image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=200" },
    { id: 23, name: "Máy chơi game", image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=200" },
    { id: 24, name: "Thiết bị mạng", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=200" },
    { id: 25, name: "Tivi", image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=200" },
    { id: 26, name: "Máy chơi game", image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=200" },
    { id: 27, name: "Nhà thông minh", image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=200" },
];
export default function HomePage() {
    const [visibleProducts, setVisibleProducts] = useState(8);
    const products = Array.from({ length: 12 }, (_, i) => i + 1);
    return (
        <Layout className="bg-transparent font-sans">
            <HeaderUser/>
            <HeroSlider/>
            <section className="cate-list max-w-[1440px] mx-auto px-4 md:px-6 w-full mb-12">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
                            Danh mục nổi bật
                        </h2>
                    </div>
                    <div className="category-scroll grid grid-rows-2 grid-flow-col gap-x-2 gap-y-6 px-6 py-6 overflow-x-auto overscroll-x-contain snap-x scroll-smooth">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href="/"
                                // Cố định chiều rộng (w-[80px] tới w-[110px]) để các cột không bị ép lại
                                className="flex flex-col items-center group cursor-pointer w-[86px] md:w-[110px] snap-start"
                            >
                                <div className="relative w-16 h-16 md:w-20 md:h-20 mb-3 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-1.5 group-hover:shadow-md group-hover:border-blue-200 shrink-0">
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-cover rounded-full p-1"
                                    />
                                </div>

                                <span className="text-xs md:text-sm font-medium text-slate-600 text-center leading-tight w-full line-clamp-2 group-hover:text-blue-600 transition-colors">
                {category.name}
              </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <HotPromotion/>
            <RecommendedProducts/>
            <News/>
            <FooterUser />
        </Layout>
    );
}