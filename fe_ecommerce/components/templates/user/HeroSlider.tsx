import {Button, Typography} from "antd";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, EffectFade, Navigation, Pagination, Parallax,} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const { Title, Text } = Typography;

const slides = [
    {
        id: 1,
        title: "Chảy Cùng",
        highlight: "Công Nghệ",
        description:
            "Trải nghiệm thiết kế mềm mại, uyển chuyển. Nâng tầm phong cách sống với những sản phẩm công nghệ tinh hoa nhất.",
        image:
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200",
    },
    {
        id: 2,
        title: "Khám Phá",
        highlight: "Tương Lai",
        description:
            "Sự hòa quyện hoàn hảo giữa nghệ thuật và công nghệ hiện đại.",
        image:
            "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200",
    },
    {
        id: 3,
        title: "Thiết Kế",
        highlight: "Đột Phá",
        description:
            "Tạo nên trải nghiệm số đầy cảm hứng và khác biệt.",
        image:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200",
    },
];

export default function HeroSlider() {
    return (
        <section className="relative overflow-hidden">
            <Swiper
                modules={[
                    Autoplay,
                    Pagination,
                    Navigation,
                    EffectFade,
                    Parallax,
                ]}
                effect="fade"
                speed={1200}
                parallax
                loop
                navigation
                pagination={{
                    clickable: true,
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                className="hero-swiper"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="flex items-center">
                            <div className="max-w-[1400px] mx-auto px-6 w-full">
                                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">

                                    {/* LEFT */}
                                    <div
                                        className="flex-1 space-y-8 text-center md:text-left"
                                        data-swiper-parallax="-300"
                                    >
                                        <Title
                                            level={1}
                                            className="!mb-0 !text-5xl md:!text-7xl lg:!text-8xl font-black tracking-tighter text-slate-800"
                                        >
                                            {slide.title}
                                            <br />
                                            <span className="liquid-text-gradient">
                        {slide.highlight}
                      </span>
                                        </Title>

                                        <Text className="block text-lg md:text-xl text-slate-500 max-w-xl">
                                            {slide.description}
                                        </Text>

                                        <div>
                                            <Button
                                                size="large"
                                                className="liquid-btn liquid-gradient text-white font-bold h-14 px-10 text-lg"
                                            >
                                                Khám phá ngay
                                            </Button>
                                        </div>
                                    </div>

                                    {/* RIGHT */}
                                    <div
                                        className="flex-1 flex justify-center"
                                        data-swiper-parallax="300"
                                    >
                                        <div className="relative">
                                            <div className="w-[320px] h-[320px] md:w-[500px] md:h-[500px] liquid-shape liquid-gradient p-2 shadow-2xl shadow-blue-500/20">
                                                <div
                                                    className="w-full h-full liquid-shape bg-cover bg-center"
                                                    style={{
                                                        backgroundImage: `url(${slide.image})`,
                                                    }}
                                                />
                                            </div>

                                            <div className="absolute inset-0 blur-3xl bg-blue-400/20 -z-10 scale-125 rounded-full" />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}