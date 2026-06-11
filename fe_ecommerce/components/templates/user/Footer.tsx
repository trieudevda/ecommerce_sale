import React from "react";
import {Layout} from "antd";

const { Footer } = Layout;
const FooterUser = () => {
    return <Footer className="bg-slate-900 text-slate-400 pt-20 pb-10 px-6 rounded-t-[80px] shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <div className="max-w-[1400px] mx-auto w-full text-center">
            <div className="text-4xl font-black tracking-tight liquid-text-gradient text-transparent bg-clip-text mb-6 inline-block">
                LIQUID.
            </div>
            <p className="max-w-xl mx-auto mb-10">Sự hòa quyện hoàn hảo giữa công nghệ hiện đại và thiết kế nghệ thuật.</p>
            <div className="border-t border-slate-800 pt-8 text-sm">
                © 2026 Liquid UI. All rights reserved.
            </div>
        </div>
    </Footer>
}
export default FooterUser;