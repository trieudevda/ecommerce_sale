export const metadata = {
    title: 'Điện thoại, Laptop, Máy tính bảng chính hãng - FPTShop',
    description: 'Hệ thống bán lẻ thiết bị điện tử chính hãng...'
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="bg-gray-50">{children}</main>
    );
}