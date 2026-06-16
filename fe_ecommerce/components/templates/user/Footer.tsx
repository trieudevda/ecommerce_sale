"use client";
import React from "react";
import Link from "next/link";
import {FacebookFilled, MessageFilled, YoutubeFilled,} from "@ant-design/icons";

const companyLinks = [
    { title: "Giới thiệu công ty", url: "/" },
    { title: "Tuyển dụng", url: "/" },
    { title: "Gửi góp ý, khiếu nại", url: "/" },
];
const otherLinks = [
    { title: "Lịch sử mua hàng", url: "/" },
    { title: "Đăng ký bán hàng CTV", url: "/" },
    { title: "Tìm hiểu về mua trả chậm", url: "/" },
    { title: "Chính sách bảo hành", url: "/" },
    { title: "Chính sách đổi trả", url: "/" },
    { title: "Giao hàng & Thanh toán", url: "/" },
];
const FooterUser = () => {
    return (
        <footer className="!bg-slate-900 text-slate-400 pt-20 pb-10 px-6 rounded-t-[40px] md:rounded-t-[80px] shadow-[0_-20px_50px_rgba(0,0,0,0.1)] mt-12 block w-full">
            <div className="max-w-[1440px] mx-auto w-full">
                <div className="text-center mb-16">
                    <div className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 liquid-text-gradient mb-4 inline-block">
                        LIQUID.
                    </div>
                    <p className="max-w-xl mx-auto text-slate-500">
                        Sự hòa quyện hoàn hảo giữa công nghệ hiện đại và thiết kế nghệ thuật.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
                    <div>
                        <h3 className="text-white font-bold text-lg mb-5 uppercase tracking-wide">
                            Tổng đài hỗ trợ
                        </h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex flex-col">
                                <span className="text-slate-500 mb-1">Gọi mua (8:00 - 21:30)</span>
                                <a href="tel:1900232460" className="text-blue-400 font-bold text-xl hover:text-blue-300 transition-colors">
                                    0365931326
                                </a>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-slate-500 mb-1">Khiếu nại (8:00 - 21:30)</span>
                                <a href="" className="text-blue-400 font-bold text-xl hover:text-blue-300 transition-colors">
                                    1800 0000
                                </a>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-slate-500 mb-1">Bảo hành (8:00 - 21:00)</span>
                                <a href="tel:1900232464" className="text-blue-400 font-bold text-xl hover:text-blue-300 transition-colors">
                                    0365931326
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg mb-5 uppercase tracking-wide">
                            Về công ty
                        </h3>
                        <ul className="space-y-3 text-sm">
                            {companyLinks.map((item, index) => (
                                <li key={index}>
                                    <Link href={item.url} className="text-slate-400 hover:text-blue-400 transition-colors">
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg mb-5 uppercase tracking-wide">
                            Thông tin khác
                        </h3>
                        <ul className="space-y-3 text-sm">
                            {otherLinks.map((item, index) => (
                                <li key={index}>
                                    <Link href={item.url} className="text-slate-400 hover:text-blue-400 transition-colors">
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg mb-5 uppercase tracking-wide">
                            Kết nối với chúng tôi
                        </h3>
                        <div className="flex gap-4 mb-8">
                            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-all">
                                <FacebookFilled className="text-lg" />
                            </a>
                            <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-red-600 hover:text-white transition-all">
                                <YoutubeFilled className="text-lg" />
                            </a>
                            <a href="https://zalo.me" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-500 hover:text-white transition-all">
                                <MessageFilled className="text-lg" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 leading-relaxed text-center md:text-left">
                    <div className="flex-1 max-w-4xl">
                        <p className="mb-1 text-slate-400 font-medium">© 2026 Liquid UI. Bản quyền thuộc về Công Ty Cổ Phần Đầu Tư Điện Máy Xanh.</p>
                        <p>
                            GPDKKD: 0303217354 do sở KH & ĐT TP.HCM cấp ngày 02/01/2007. GPMXH: 21/GP-BTTTT do Bộ Thông Tin và Truyền Thông cấp ngày 11/01/2021.
                            Địa chỉ: 128 Trần Quang Khải, P.Tân Định, TP. Hồ Chí Minh. Điện thoại: 028 38125960. Email: hotrotmdt@thegioididong.com.
                        </p>
                    </div>
                    <div className="shrink-0 flex gap-4">
                        <Link href="/" className="text-slate-500 hover:text-slate-300 transition-colors">Điều khoản</Link>
                        <Link href="/" className="text-slate-500 hover:text-slate-300 transition-colors">Bảo mật</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterUser;