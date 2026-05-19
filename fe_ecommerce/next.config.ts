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
};
export default withNextIntl(nextConfig);
