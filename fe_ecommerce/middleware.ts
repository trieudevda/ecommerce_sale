import createMiddleware from 'next-intl/middleware';
import {routing} from "@/messages/routing";

export default createMiddleware(routing);
export const config = {
    matcher: ['/', '/(vi|en)/:path*','/((?!api|_next|_vercel|.*\\..*).*)']
};