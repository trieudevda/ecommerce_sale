"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

// 1. MOCK DATA: Lấy mẫu từ HTML của bạn
const newsData = [
    {
        id: 1,
        title: "HONOR X70 Pro Max ra mắt âm thầm: Snapdragon 6 Gen 4 Enhanced Edition, pin 8.560mAh và sạc nhanh 90W",
        image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/News/Thumb/1594603/x70proMAX2639171392647669681.jpg",
        link: "/tin-tuc",
        date: "1 giờ trước",
    },
    {
        id: 2,
        title: "TOP 10 laptop tầm giá 20 triệu đáng mua nhất, cấu hình mạnh, thiết kế đẹp",
        image: "https://cdn.tgdd.vn//Files/News/2023/06/10/top-5-laptop-duoi-20-trieu-tot-ben-cau-hinh-manh-dang-tham-thumb-560x292.jpg",
        link: "/tin-tuc",
        date: "3 giờ trước",
    },
    {
        id: 3,
        title: "Cùng điểm qua những nâng cấp của HONOR 600 Pro với tiền nhiệm là gì?",
        image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/News/Thumb/1594604/honor-600-pro-7-t639171408805027040.jpg",
        link: "/tin-tuc",
        date: "5 giờ trước",
    },
    {
        id: 4,
        title: "Laptop 12 inch dài rộng bao nhiêu? Các mẫu laptop 12 inch tốt nhất hiện nay",
        image: "https://cdn.tgdd.vn//Files/News/2023/07/16/Laptop-12-inch-dài-rộng-bao-nhiêu-Các-mẫu-laptop-12-inch-tốt-nhất-thumb-560x292-560x292.png",
        link: "/tin-tuc",
        date: "1 ngày trước",
    },
];

export default function News() {
    return (
        <section className="max-w-[1440px] mx-auto px-4 md:px-6 w-full mb-16">

            {/* Tiêu đề */}
            <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
                    Tin tức công nghệ
                </h2>
                {/* Nút xem tất cả dành cho Desktop */}
                <Link
                    href="/tin-tuc"
                    className="hidden md:block text-blue-600 font-medium hover:text-blue-700 hover:underline"
                >
                    Xem tất cả &rarr;
                </Link>
            </div>

            {/* Danh sách tin tức */}
            {/* Mobile: Cuộn ngang (flex + overflow-x-auto) | Desktop: Chia 4 cột (grid) */}
            <div className="news-scroll flex lg:grid lg:grid-cols-4 gap-4 md:gap-5 overflow-x-auto snap-x overscroll-x-contain pb-4">
                {newsData.map((news) => (
                    <Link
                        key={news.id}
                        href={news.link}
                        className="flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 group min-w-[280px] sm:min-w-[320px] lg:min-w-0 snap-start shrink-0"
                    >
                        {/* Vùng chứa Ảnh */}
                        <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-100">
                            <Image
                                src={news.image}
                                alt={news.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            />
                        </div>

                        {/* Vùng chứa Text */}
                        <div className="p-4 md:p-5 flex flex-col flex-1">
                            <h3 className="text-base md:text-[17px] font-bold text-slate-800 leading-snug line-clamp-3 mb-3 group-hover:text-blue-600 transition-colors">
                                {news.title}
                            </h3>

                            {/* Thẻ hiển thị thời gian (Làm cho block tin tức trông sinh động hơn) */}
                            <div className="mt-auto">
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  {news.date}
                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Nút Xem Thêm (Dành cho Mobile) */}
            <div className="flex justify-center mt-2 md:hidden">
                <Link
                    href="/tin-tuc"
                    className="bg-white border border-slate-300 text-slate-700 px-10 py-2.5 rounded-full font-medium hover:border-blue-500 hover:text-blue-600 transition-colors duration-300 shadow-sm text-sm"
                >
                    Xem thêm bài viết
                </Link>
            </div>

            {/* CSS Ẩn thanh cuộn xấu xí trên giao diện */}
            <style dangerouslySetInnerHTML={{__html: `
        .news-scroll::-webkit-scrollbar {
          display: none;
        }
        .news-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
        </section>
    );
}