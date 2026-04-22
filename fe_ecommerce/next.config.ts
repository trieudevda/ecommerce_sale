import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./messages/i18n.ts');

const nextConfig: NextConfig = {
    allowedDevOrigins: ['192.168.15.41'],
    experimental: {},
};
export default withNextIntl(nextConfig);
