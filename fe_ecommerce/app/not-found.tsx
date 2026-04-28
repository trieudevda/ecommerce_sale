'use client'; // Bắt buộc vì Antd cần chạy ở Client Side

import { Button, Result } from 'antd';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <Result
                status="404"
                title="404"
                subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
                extra={
                    <Link href="/">
                        <Button type="primary">Quay lại trang chủ</Button>
                    </Link>
                }
            />
        </div>
    );
}
