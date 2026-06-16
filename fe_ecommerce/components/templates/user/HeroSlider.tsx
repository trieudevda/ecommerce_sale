"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  EffectFade,
  Navigation,
  Pagination,
} from "swiper/modules";
import Link from "next/link";
import Image from "next/image";

// CSS của Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useRouter } from "next/navigation";
const mainBanners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1550029402-226115b7c579?q=80&w=1200",
    title: "Khám phá Công nghệ",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1531297172864-45d0601bfac6?q=80&w=1200",
    title: "Thế giới Phụ kiện",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1200",
    title: "Làm việc Hiệu suất",
  },
];
const rightBanners = [
  {
    id: 1,
    title: "Tai nghe Sony",
    subtitle: "Giảm đến 30%",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=400",
  },
  {
    id: 2,
    title: "Sạc nhanh 65W",
    subtitle: "Chỉ từ 299k",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=400",
  },
  {
    id: 3,
    title: "Bàn phím cơ",
    subtitle: "Tặng kèm chuột",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=400",
  },
  {
    id: 4,
    title: "Smart Watch",
    subtitle: "Trợ lý sức khỏe",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=400",
  },
];

export default function HeroSection() {
    const router = useRouter();
  return (
    <section className="hero-slider max-w-[1440px] mx-auto px-4 md:px-6 w-full mt-6 mb-12">
      <div className="flex flex-col lg:flex-row gap-5 h-auto lg:h-[600px]">
        <div className="flex-1 w-full min-w-0 h-[300px] sm:h-[600px] lg:h-full bg-slate-100 rounded-2xl overflow-hidden relative shadow-sm group">
          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            effect="fade"
            speed={800}
            loop
            navigation={{
              nextEl: '.custom-next',
              prevEl: '.custom-prev',
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            className="h-full w-full hero-swiper rounded-2xl"
          >
            {mainBanners.map((slide, index) => (
              <SwiperSlide key={slide.id}>
                <div className="relative w-full h-full">
                  <Image
                    src={slide.image}
                    fill
                    priority={index === 0}
                    className="object-cover"
                    alt={slide.title}
                    onClick={slide?.path ? () => router.push(slide.path) : () => {}}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
              </SwiperSlide>
            ))}
            <div className="custom-prev absolute top-1/2 left-4 z-10 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/60 hover:bg-white text-slate-800 backdrop-blur-md shadow-md cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 pr-[2px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </div>
            <div className="custom-next absolute top-1/2 right-4 z-10 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/60 hover:bg-white text-slate-800 backdrop-blur-md shadow-md cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 pl-[2px]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </Swiper>
        </div>
        <div className="hidden lg:flex flex-col w-[260px] xl:w-[300px] gap-4 h-[600px] shrink-0">
          {rightBanners.map((banner) => (
            <Link
              href="/"
              key={banner.id}
              className="flex-1 relative rounded-2xl overflow-hidden group shadow-sm border border-slate-200/60"
            >
              <Image
                src={banner.image}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                alt={banner.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />              
              <div className="absolute bottom-0 left-0 p-4 w-full flex flex-col justify-end transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-white font-bold text-base leading-tight drop-shadow-md">
                  {banner.title}
                </span>
                <span className="text-blue-300 font-medium text-xs mt-0.5">
                  {banner.subtitle}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hero-swiper .swiper-pagination-bullet {
          background-color: white !important;
          opacity: 0.6;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          width: 20px;
          border-radius: 8px;
          transition: width 0.3s ease;
        }
      `}} />
    </section>
  );
}