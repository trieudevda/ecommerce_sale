import {AutoComplete, Badge, Button, Input, Layout, Popover, Spin, Typography} from "antd";
import {
    AppstoreOutlined,
    FireOutlined,
    LaptopOutlined,
    MobileOutlined,
    RightOutlined,
    SearchOutlined,
    ShoppingCartOutlined
} from "@ant-design/icons";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {useTranslations} from "use-intl";

const { Header } = Layout;
const { Title, Text } = Typography;
interface ProductSearch {
    id: string;
    name: string;
    image: string;
}const categoriesData = [
    {
        id: 'phone',
        icon: <MobileOutlined />,
        name: 'Điện thoại',
        brands: ['Apple', 'Samsung', 'Xiaomi', 'Oppo'],
        hotProducts: [
            { id: 1, name: 'iPhone 15 Pro Max', price: '29.990.000đ', img: '/assets/images/horizontal-logo.png' },
            { id: 2, name: 'Samsung Galaxy S24 Ultra', price: '26.990.000đ', img: '/assets/images/horizontal-logo.png' },
        ]
    },
    {
        id: 'laptop',
        icon: <LaptopOutlined />,
        name: 'Máy tính xách tay',
        brands: ['MacBook', 'Asus', 'Dell', 'Lenovo'],
        hotProducts: [
            { id: 3, name: 'MacBook Air M3', price: '27.990.000đ', img: '/assets/images/horizontal-logo.png' },
            { id: 4, name: 'Asus ROG Strix', price: '32.990.000đ', img: '/assets/images/horizontal-logo.png' },
        ]
    }
];

const flashSaleProducts = [
    { id: 101, name: 'AirPods Pro 2', price: '4.990.000đ', oldPrice: '6.500.000đ', img: '/assets/images/horizontal-logo.png' },
    { id: 102, name: 'Sạc nhanh 20W', price: '390.000đ', oldPrice: '690.000đ', img: '/assets/images/horizontal-logo.png' },
];

// --- COMPONENT MEGA MENU ---
const MegaMenuContent = () => {
    // State lưu giữ ID danh mục đang được hover ở cột trái
    const [activeCat, setActiveCat] = React.useState(categoriesData[0].id);

    // Lấy data của danh mục đang active
    const activeData = categoriesData.find(cat => cat.id === activeCat);

    return (
        <div className="flex w-[850px] min-h-[400px] bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-100">

            {/* CỘT 1: Danh sách danh mục dọc (25%) */}
            <div className="w-[25%] bg-slate-50 py-4 flex flex-col border-r border-slate-100">
                {categoriesData.map((cat) => (
                    <div
                        key={cat.id}
                        onMouseEnter={() => setActiveCat(cat.id)}
                        className={`px-4 py-3 cursor-pointer flex items-center justify-between transition-all duration-200 ${
                            activeCat === cat.id ? 'bg-white text-blue-600 font-bold border-l-4 border-blue-600' : 'text-slate-600 hover:bg-slate-100 border-l-4 border-transparent'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-lg">{cat.icon}</span>
                            <span className="text-sm">{cat.name}</span>
                        </div>
                        {activeCat === cat.id && <RightOutlined className="text-[10px]" />}
                    </div>
                ))}
            </div>

            {/* CỘT 2: Thương hiệu & Sản phẩm Hot theo danh mục (50%) */}
            <div className="w-[50%] p-6 bg-white">
                <Title level={5} className="!text-slate-800 !mb-4">Thương hiệu nổi bật</Title>
                <div className="flex flex-wrap gap-2 mb-8">
                    {activeData?.brands.map(brand => (
                        <span key={brand} className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-sm font-medium hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-colors">
                            {brand}
                        </span>
                    ))}
                </div>

                <Title level={5} className="!text-slate-800 !mb-4">Sản phẩm bán chạy</Title>
                <div className="grid grid-cols-2 gap-4">
                    {activeData?.hotProducts.map(prod => (
                        <Link href={`/product/${prod.id}`} key={prod.id} className="flex flex-col gap-2 group">
                            <div className="h-24 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden relative">
                                <Image src={prod.img} alt={prod.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                            </div>
                            <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 line-clamp-2">{prod.name}</span>
                            <span className="text-blue-600 font-bold">{prod.price}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* CỘT 3: Giá Sốc Hôm Nay (25%) */}
            <div className="w-[25%] bg-gradient-to-b from-red-50 to-orange-50 p-6 border-l border-red-100/50">
                <div className="flex items-center gap-2 mb-6">
                    <FireOutlined className="text-red-500 text-xl" />
                    <Title level={5} className="!text-red-600 !mb-0 !font-black italic">GIÁ SỐC</Title>
                </div>
                <div className="flex flex-col gap-6">
                    {flashSaleProducts.map(prod => (
                        <Link href={`/product/${prod.id}`} key={prod.id} className="group">
                            <div className="h-28 bg-white rounded-xl mb-3 relative overflow-hidden shadow-sm">
                                <Image src={prod.img} alt={prod.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                    HOT
                                </div>
                            </div>
                            <span className="text-sm font-semibold text-slate-700 group-hover:text-red-500 line-clamp-2 leading-tight">{prod.name}</span>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-red-600 font-black">{prod.price}</span>
                            </div>
                            <span className="text-xs line-through text-slate-400">{prod.oldPrice}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
const HeaderUser = () => {
    const t = useTranslations("Customer");
    const [searchText, setSearchText] = React.useState("");
    const [options, setOptions] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
        if (!searchText.trim()) {
            setOptions([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setLoading(true);
            try {
                // ==========================================
                // TODO: THAY THẾ BẰNG API THẬT CỦA BẠN TẠI ĐÂY
                // const response = await requestApi(`products/search?keyword=${searchText}`);
                // const data: ProductSearch[] = response.data;
                // ==========================================

                // DỮ LIỆU GIẢ LẬP (Mock Data)
                const mockData: ProductSearch[] = [
                    { id: '1', name: `Điện thoại thông minh - ${searchText}`, image: '/assets/images/horizontal-logo.png' },
                    { id: '2', name: `Laptop Gaming - ${searchText}`, image: '/assets/images/horizontal-logo.png' },
                ];

                // Map dữ liệu từ Backend thành định dạng hiển thị của AutoComplete
                const formattedOptions = mockData.map(item => ({
                    value: item.id, // Value thực sự khi chọn
                    label: (
                        <Link href={`/product/${item.id}`} className="flex items-center gap-3 py-2 px-1 hover:bg-slate-50 transition-colors rounded-lg">
                            <div className="flex-shrink-0 relative w-10 h-10 bg-slate-100 rounded-md overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-sm font-semibold text-slate-700 line-clamp-2">{item.name}</span>
                        </Link>
                    )
                }));

                setOptions(formattedOptions);
            } catch (error) {
                console.error("Lỗi khi tìm kiếm:", error);
            } finally {
                setLoading(false);
            }
        }, 500); // 500ms là thời gian lý tưởng để debounce

        return () => clearTimeout(delayDebounceFn);
    }, [searchText]);

    return (
        <Header className="header backdrop-blur-xl border-b border-white/50 !h-20 px-0 sticky top-0 z-50 shadow-sm bg-white/70">
            <div className="max-w-[1400px] mx-auto w-full px-6 flex items-center justify-between h-full">
                <div className="flex-shrink-0 flex items-center">
                    <Link href="/">
                        <Image src="/assets/images/horizontal-logo.png" height={60} width={200} alt="logo" />
                    </Link>
                </div>
                <div className="hidden lg:flex flex-1 justify-center items-center gap-8 font-semibold text-slate-700 text-base">
                    <div className="flex gap-4 items-center flex-shrink-0">
                        <Popover
                            content={<MegaMenuContent />}
                            placement="bottomLeft"
                            trigger="hover"
                            style={{ padding: 0, borderRadius: '16px', overflow: 'hidden' }}
                            arrow={false}
                        >
                            <Button
                                size="large"
                                icon={<AppstoreOutlined />}
                                className="hidden lg:flex items-center gap-2 bg-blue-50/80 text-blue-600 border-none hover:bg-blue-600 hover:text-white font-semibold rounded-xl transition-colors shadow-sm"
                            >
                                Danh mục
                            </Button>
                        </Popover>
                        {/* KHỐI TÌM KIẾM AUTOCOMPLETE */}
                        <div className="hidden md:block w-64 lg:w-72">
                            <AutoComplete
                                options={options}
                                onSearch={setSearchText}
                                className="w-full"
                                popupClassName="rounded-xl shadow-xl border border-slate-100" // Bo góc dropdown list
                                notFoundContent={
                                    loading ? (
                                        <div className="text-center py-4 text-blue-500"><Spin size="small" /> Đang tìm...</div>
                                    ) : (
                                        searchText && <div className="text-center py-4 text-slate-500">Không tìm thấy sản phẩm</div>
                                    )
                                }
                            >
                                <Input
                                    size="large"
                                    placeholder="Tìm sản phẩm..."
                                    prefix={<SearchOutlined className="text-slate-400 mr-1" />}
                                    className="rounded-full bg-slate-100/60 border-none hover:bg-slate-200/50 focus:bg-white transition-all shadow-inner"
                                />
                            </AutoComplete>
                        </div>
                    </div>
                    <Link href="/" className="hover:text-blue-600 transition-colors">{t('order')}</Link>
                    <Link href="/" className="hover:text-blue-600 transition-colors">{t('stores_near_you')}</Link>
                    <Link href="/" className="hover:text-blue-600 transition-colors">{t('order_tracking')}</Link>
                    <Link href="/" className="hover:text-blue-600 transition-colors">{t('promotion')}</Link>
                    <Link href="/" className="hover:text-blue-600 transition-colors ">
                        <Badge count={2} color="#3b82f6" className={"!mr-1"}>
                            <Button
                                shape="circle"
                                icon={<ShoppingCartOutlined className="text-xl text-slate-700" />}
                                className="liquid-btn bg-white shadow-sm h-10 w-10 border-none "
                            />
                        </Badge>
                        {t('cart')}</Link>
                </div>

            </div>
        </Header>
    );
}

export default HeaderUser;