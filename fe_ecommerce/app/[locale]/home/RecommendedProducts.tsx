"use client";
import React, {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {StarFilled} from "@ant-design/icons";

// 1. MOCK DATA: Lấy mẫu danh sách sản phẩm từ HTML của bạn
// Ở đây mình nhân bản một chút để có đủ số lượng test nút "Xem thêm"
const recommendedProducts = [
    {
        id: 361311,
        name: "HP 15 fc0023AU R5 7520U (D0BH1PA)",
        price: 17290000,
        oldPrice: 18390000,
        discount: 5,
        image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/361311/hp-15-fc0023au-r5-7520u-d0bh1pa-thumb-639030592238863081-600x600.jpg",
        specs: ["RAM 16 GB", "SSD 512 GB"],
        installment: "Trả chậm 0%",
        gift: "100.000₫",
        rating: 4.9,
        sold: "3,1k",
    },
    {
        id: 341804,
        name: "Samsung Galaxy A07 6GB/128GB",
        price: 3690000,
        oldPrice: 3890000,
        discount: 5,
        image: "https://cdn.tgdd.vn/2026/06/timerseo/341804-600x600-3.jpg",
        specs: ["HD+", "6.7\""],
        installment: "Trả trước 0đ",
        gift: "200.000₫",
        rating: 4.9,
        sold: "86,2k",
    },
    {
        id: 356854,
        name: "Xiaomi Redmi Pad 2 Pro WiFi 6GB/128GB",
        price: 7690000,
        oldPrice: 7990000,
        discount: 3,
        image: "https://cdn.tgdd.vn/2026/06/timerseo/356854.jpg",
        specs: ["IPS LCD", "12.1\""],
        installment: "Trả chậm 0%",
        gift: null,
        rating: 4.9,
        sold: "5,2k",
    },
    {
        id: 354744,
        name: "Acer Aspire Lite 15 AL15 42P R50R R5 7430U",
        price: 15290000,
        oldPrice: 16190000,
        discount: 5,
        image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/354744/acer-aspire-lite-15-al15-42p-r50r-r5-7430u-nxd34sv004-bac-thumb-638942356970285880-600x600.jpg",
        specs: ["RAM 16 GB", "SSD 512 GB"],
        installment: "Trả chậm 0%",
        gift: null,
        rating: 4.9,
        sold: "1,5k",
    },
    {
        id: 343061,
        name: "Samsung Galaxy Tab S10 Lite 5G 6GB/128GB",
        price: 10490000,
        oldPrice: 11490000,
        discount: 8,
        image: "https://cdn.tgdd.vn/2026/06/timerseo/343061-600x600-2.jpg",
        specs: ["TFT LCD", "10.9\""],
        installment: "Trả chậm 0%",
        gift: null,
        rating: 4.9,
        sold: "8,5k",
    },
    {
        id: 360303,
        name: "Xiaomi Redmi Note 15 8GB/128GB",
        price: 5990000,
        oldPrice: 6490000,
        discount: 7,
        image: "https://cdn.tgdd.vn/2026/06/timerseo/0-360303.jpg",
        specs: ["Full HD+", "6.77\"", "Hỗ trợ NFC"],
        installment: "Trả trước 0đ",
        gift: null,
        rating: 4.9,
        sold: "46,3k",
    },
    {
        id: 363474,
        name: "MacBook Air 13 inch M5 16GB/512GB",
        price: 28990000,
        oldPrice: 29990000,
        discount: 3,
        image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/363474/macbook-air-13-inch-m5-16gb-512gb-thumb-2-639086548040650530-600x600.jpg",
        specs: ["RAM 16 GB", "SSD 512 GB"],
        installment: "Trả chậm 0%",
        gift: "500.000₫",
        rating: 5,
        sold: "2,1k",
    },
    {
        id: 365217,
        name: "Xiaomi Redmi Watch 6",
        price: 2790000,
        oldPrice: 3190000,
        discount: 12,
        image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7077/365217/xiaomi-redmi-watch-6-thumb-2-639122662985495541-600x600.jpg",
        specs: [],
        installment: "Trả chậm 0%",
        gift: null,
        rating: 5,
        sold: "4,3k",
    },
    {
        id: 335174,
        name: "Samsung Galaxy A36 5G 8GB/256GB",
        price: 7830000,
        oldPrice: 9130000,
        discount: 14,
        image: "https://cdn.tgdd.vn/2026/06/timerseo/335174-600x600-3.jpg",
        specs: ["Full HD+", "6.7\""],
        installment: "Trả chậm 0%",
        gift: "200.000₫",
        rating: 4.9,
        sold: "67k",
    },
    {
        id: 360246,
        name: "OPPO A6x 4GB/128GB",
        price: 5790000,
        oldPrice: 5990000,
        discount: 3,
        image: "https://cdn.tgdd.vn/2026/06/timerseo/360246-600x600-2.jpg",
        specs: ["HD+", "6.75\""],
        installment: null,
        gift: null,
        rating: 4.9,
        sold: "46,8k",
    },
    {
        id: 335308,
        name: "iPad A16 WiFi 128GB",
        price: 9290000,
        oldPrice: 9790000,
        discount: 5,
        image: "https://cdn.tgdd.vn/Products/Images/522/335308/ipad-11-wifi-yellow-thumb-600x600.jpg",
        specs: ["Retina IPS LCD", "11\""],
        installment: "Trả trước 0đ",
        gift: null,
        rating: 4.9,
        sold: "44,3k",
    },
    {
        id: 303891,
        name: "iPhone 15 Plus 128GB",
        price: 17990000,
        oldPrice: 21990000,
        discount: 18,
        image: "https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-plus-128gb-den-thumb-600x600.jpg",
        specs: ["Super Retina XDR", "6.7\""],
        installment: "Trả chậm 0%",
        gift: null,
        rating: 4.9,
        sold: "102,8k",
    }
];

// Hàm format Tiền tệ
const formatPrice = (price:number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
        .format(price)
        .replace("₫", "₫");
};

export default function RecommendedProducts() {
    // Quản lý số lượng hiển thị (Ban đầu hiện 6, click xem thêm sẽ hiện thêm 6)
    const [visibleCount, setVisibleCount] = useState(6);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 6);
    };

    return (
        <section className="max-w-[1440px] mx-auto px-4 md:px-6 w-full mb-12">

            {/* Tiêu đề Block */}
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase mb-6 px-2">
                Gợi ý cho bạn
            </h2>

            {/* Grid Danh sách sản phẩm */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {recommendedProducts.slice(0, visibleCount).map((product) => (
                    <Link
                        key={product.id}
                        href="/"
                        className="bg-white rounded-xl p-4 flex flex-col border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 group relative"
                    >
                        {/* Badge Trả góp */}
                        {product.installment && (
                            <span className="absolute top-4 left-4 z-10 bg-slate-100/90 backdrop-blur-sm text-slate-700 text-[10px] md:text-[11px] font-semibold px-2 py-1 rounded">
                {product.installment}
              </span>
                        )}

                        {/* Hình ảnh */}
                        <div className="relative w-full aspect-square mt-6 mb-4 transition-transform duration-300 group-hover:-translate-y-2">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain mix-blend-multiply"
                            />
                        </div>

                        {/* Tên sản phẩm */}
                        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 min-h-[40px] mb-2 group-hover:text-blue-600 transition-colors">
                            {product.name}
                        </h3>

                        {/* Cấu hình (Specs) */}
                        <div className="flex flex-wrap gap-1 mb-3 h-[24px] overflow-hidden">
                            {product.specs.map((spec, index) => (
                                <span key={index} className="text-[11px] bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                  {spec}
                </span>
                            ))}
                        </div>

                        {/* Giá tiền */}
                        <div className="mt-auto">
                            <strong className="text-red-600 text-[17px] font-bold block mb-1">
                                {formatPrice(product.price)}
                            </strong>

                            {/* Giá cũ & Giảm giá */}
                            <div className="flex items-center gap-2 mb-2 h-[20px]">
                                {product.oldPrice && (
                                    <>
                    <span className="text-slate-400 line-through text-[12px] font-medium">
                      {formatPrice(product.oldPrice)}
                    </span>
                                        <span className="text-red-600 bg-red-50 px-1 rounded text-[11px] font-bold border border-red-100">
                      -{product.discount}%
                    </span>
                                    </>
                                )}
                            </div>

                            {/* Quà tặng */}
                            <div className="h-[24px]">
                                {product.gift && (
                                    <p className="text-[11px] text-slate-700 border border-orange-200 bg-orange-50 rounded px-2 py-0.5 inline-block">
                                        Quà <b className="text-orange-600 font-bold">{product.gift}</b>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Đánh giá & Đã bán */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                            <div className="flex items-center gap-1 text-yellow-500">
                                <StarFilled className="text-[10px]" />
                                <span className="font-bold text-slate-700">{product.rating}</span>
                            </div>
                            <span>•</span>
                            <span>Đã bán {product.sold}</span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Button Xem thêm (Chỉ hiện khi vẫn còn sản phẩm trong mảng) */}
            {visibleCount < recommendedProducts.length && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={handleLoadMore}
                        className="bg-white border border-slate-300 text-slate-700 px-10 py-3 rounded-xl font-medium hover:border-blue-500 hover:text-blue-600 transition-colors duration-300 shadow-sm"
                    >
                        Xem thêm {recommendedProducts.length - visibleCount} sản phẩm
                    </button>
                </div>
            )}
        </section>
    );
}