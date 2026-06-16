"use client";
import React, {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {StarFilled} from "@ant-design/icons";

// 1. DỮ LIỆU TABS
const tabs = [
    { id: "flashsale", image: "https://cdnv2.tgdd.vn/mwg-static/common/Campaign/e8/42/e8423a0c15c70df4fae51120e63a5b22.png" },
    { id: "kmo", image: "https://cdnv2.tgdd.vn/mwg-static/common/Campaign/7a/e0/7ae0723d3d978fd4c8a2c77f3bf4bd3a.png" },
    { id: "phone", label: "Điện Thoại" },
    { id: "apple", label: "Apple" },
    { id: "laptop", label: "Laptop" },
    { id: "phukien", label: "Phụ Kiện" },
    { id: "dongho", label: "Đồng Hồ" },
    { id: "pc", label: "PC, Máy in" },
];

// 2. DỮ LIỆU SẢN PHẨM MẪU (Lấy từ HTML của bạn)
const products = [
    {
        id: 361311,
        name: "HP 15 fc0023AU R5 7520U (D0BH1PA)",
        price: 17290000,
        oldPrice: 18390000,
        discount: 5,
        image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/361311/hp-15-fc0023au-r5-7520u-d0bh1pa-thumb-639030592238863081-600x600.jpg",
        specs: ["RAM 16 GB", "SSD 512 GB"],
        installment: "Trả chậm 0% trả trước 0đ",
        gift: "100.000₫",
        rating: 4.9,
        sold: "3,1k",
        isOnlineOnly: false,
    },
    {
        id: 360418,
        name: "Asus Vivobook 15 X1504VA Core 5 120U (BQ185W)",
        price: 18190000,
        oldPrice: 20990000,
        discount: 13,
        image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/360418/asus-vivobook-15-x1504va-core-5-120u-bq185w-thumb-639017420847213436-600x600.jpg",
        specs: ["RAM 16 GB", "SSD 512 GB"],
        installment: "Trả chậm 0% trả trước 0đ",
        gift: "100.000₫",
        rating: 5,
        sold: "336",
        isOnlineOnly: true,
    },
    {
        id: 363258,
        name: "OPPO Find N6 5G 16GB/512GB",
        price: 64990000,
        oldPrice: null,
        discount: null,
        image: "https://cdn.tgdd.vn/2026/06/timerseo/363258.jpg",
        specs: ["QXGA+", "Chính 8.12\" & Phụ 6.62\""],
        installment: "Trả chậm 0%",
        gift: "5.050.000₫",
        rating: 5,
        sold: "92",
        isOnlineOnly: false,
    },
    {
        id: 342679,
        name: "iPhone 17 Pro Max 256GB",
        price: 36990000,
        oldPrice: 37990000,
        discount: 2,
        image: "https://cdn.tgdd.vn/Products/Images/42/342679/iphone-17-pro-max-cam-thumb-600x600.jpg",
        specs: ["Super Retina XDR", "6.9\""],
        installment: "Trả chậm 0%",
        gift: null,
        rating: 4.9,
        sold: "250k",
        isOnlineOnly: false,
    },
    {
        id: 339137,
        name: "Chuột Có dây Gaming Rapoo V10SE",
        price: 65000,
        oldPrice: 105000,
        discount: 38,
        image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/86/339137/chuot-co-day-gaming-rapoo-v10s-070625-033053-694-600x600.jpg",
        specs: [],
        installment: null,
        gift: null,
        rating: 4.9,
        sold: "2,8k",
        isOnlineOnly: true,
    }
];

// Format Tiền tệ VNĐ
const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
        .format(price)
        .replace("₫", "₫");
};

export default function HotPromotion() {
    const [activeTab, setActiveTab] = useState("laptop");

    return (
        <section className="max-w-[1440px] mx-auto px-4 md:px-6 w-full mb-12">
            <div className="bg-[#FFF6E3] rounded-2xl overflow-hidden shadow-sm">

                {/* HEADER & TABS */}
                <div className="px-4 md:px-8 pt-6 pb-2 border-b border-orange-200/50">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase italic mb-6">
                        Khuyến mãi online
                    </h2>

                    {/* Scrollable Tabs */}
                    <div className="flex overflow-x-auto snap-x scrollbar-hide gap-3 pb-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`shrink-0 snap-start px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 border 
                  ${ activeTab === tab.id
                                    ? "bg-[#FFF6E3] border-[#F79009] text-[#F79009] shadow-sm"
                                    : "bg-white border-transparent text-slate-600 hover:text-[#F79009]"
                                }`}
                            >
                                {tab.image ? (
                                    <div className="relative h-6 w-24">
                                        <Image src={tab.image} alt="Tab Icon" fill className="object-contain" />
                                    </div>
                                ) : (
                                    tab.label
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* DANH SÁCH SẢN PHẨM */}
                <div className="p-4 md:p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href="/"
                                className="!bg-white rounded-xl p-4 flex flex-col hover:shadow-lg transition-shadow duration-300 group relative"
                            >
                                {/* Badge Trả góp */}
                                {product.installment && (
                                    <span className="absolute top-4 left-4 bg-gray-100 text-gray-700 text-[11px] font-semibold px-2 py-1 rounded">
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
                                        <span key={index} className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                      {spec}
                    </span>
                                    ))}
                                </div>

                                {/* Online Only Badge */}
                                {product.isOnlineOnly && (
                                    <p className="text-[11px] text-red-500 font-medium mb-1">
                                        Chỉ bán online
                                    </p>
                                )}

                                {/* Giá tiền */}
                                <div className="mt-auto">
                                    <strong className="text-red-600 text-lg font-bold block mb-1">
                                        {formatPrice(product.price)}
                                    </strong>

                                    {/* Giá cũ & Giảm giá */}
                                    <div className="flex items-center gap-2 mb-2 h-[20px]">
                                        {product.oldPrice && (
                                            <>
                        <span className="text-slate-400 line-through text-xs font-medium">
                          {formatPrice(product.oldPrice)}
                        </span>
                                                <span className="text-red-600 bg-red-50 px-1 rounded text-xs font-bold border border-red-100">
                          -{product.discount}%
                        </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Quà tặng */}
                                    <div className="h-[24px]">
                                        {product.gift && (
                                            <p className="text-[11px] text-slate-700 border border-orange-200 bg-orange-50/50 rounded px-2 py-0.5 inline-block">
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

                    {/* Button Xem thêm */}
                    <div className="flex justify-center mt-8">
                        <Link
                            href="/"
                            className="bg-white border border-[#F79009] text-[#F79009] px-24 py-3 rounded-full font-semibold hover:bg-[#F79009] hover:text-white transition-colors duration-300"
                        >
                            Xem thêm {tabs.find(t => t.id === activeTab)?.label || "sản phẩm"}
                        </Link>
                    </div>
                </div>

            </div>

            {/* Ẩn thanh cuộn cho Tabs trên mọi trình duyệt */}
            <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}} />
        </section>
    );
}