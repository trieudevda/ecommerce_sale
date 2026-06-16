import type {NextConfig} from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./messages/i18n.ts');
/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    allowedDevOrigins: ['192.168.15.41'],
    experimental: {
        //     turbopack: {
        //   root: '.',
        // },
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**', // Cho phép tất cả các đường dẫn từ domain này
            },
            {
                protocol: 'https',
                hostname: 'cdnv2.tgdd.vn',
                port: '',
                pathname: '/**', // Cho phép tất cả các đường dẫn từ domain này
            },
            {
                protocol: 'https',
                hostname: 'cdn.tgdd.vn',
                port: '',
                pathname: '/**', // Cho phép tất cả các đường dẫn từ domain này
            },
        ],
    },
};
export default withNextIntl(nextConfig);
